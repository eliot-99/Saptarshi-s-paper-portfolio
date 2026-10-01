import { readFile, readdir, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { defaultPortfolio } from '../src/data/portfolio.ts';
const configuration=JSON.parse((await readFile('wrangler.jsonc','utf8')).replace(/\/\/.*$/gm,''));
// Wrangler's existing OAuth credential is used only in memory and never printed.
const credentialFile=path.join(process.env.APPDATA,'xdg.config','.wrangler','config','default.toml');
const credential=await readFile(credentialFile,'utf8');
const token=/oauth_token\s*=\s*"([^"]+)"/.exec(credential)?.[1];
if(!token)throw new Error('Authenticate Wrangler before synchronizing assets.');
const accountId=process.env.CLOUDFLARE_ACCOUNT_ID || '29798fceea081d0549a808bb27dc06e3';
const base=`https://api.cloudflare.com/client/v4/accounts/${accountId}`;
const bucket=configuration.r2_buckets[0].bucket_name;
const database=configuration.d1_databases[0].database_id;
async function api(url,init={}){
  for(let attempt=0;attempt<4;attempt++){
    const response=await fetch(url,{...init,headers:{Authorization:`Bearer ${token}`,...init.headers}});
    if(response.status===429||response.status>=500){await new Promise(resolve=>setTimeout(resolve,1000*(attempt+1)));continue}
    if(!response.ok){const error=await response.text();throw new Error(`Cloudflare API ${response.status}: ${error.slice(0,400)}`)}
    return response;
  }
  throw new Error('Cloudflare API retry limit reached.');
}
const types={'.webp':'image/webp','.avif':'image/avif','.png':'image/png','.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg','.pdf':'application/pdf','.woff2':'font/woff2','.ico':'image/x-icon'};
async function walk(directory){const files=[];for(const entry of await readdir(directory,{withFileTypes:true})){const file=path.join(directory,entry.name);if(entry.isDirectory())files.push(...await walk(file));else files.push(file)}return files}
const files=await walk('public/assets');
let count=0, bytes=0;
// Four small upload lanes keep API and local disk work bounded.
const queue=process.argv.includes('--metadata-only')?[]:[...files];
await Promise.all(Array.from({length:4},async()=>{while(queue.length){const file=queue.shift();const key=file.replaceAll('\\','/').replace(/^public\//,'');const body=await readFile(file);await api(`${base}/r2/buckets/${bucket}/objects/${key.split('/').map(encodeURIComponent).join('/')}`,{method:'PUT',headers:{'Content-Type':types[path.extname(file)]||'application/octet-stream','Cache-Control':'public, max-age=31536000, immutable'},body});count++;bytes+=body.length;if(count%25===0)console.log(`Uploaded ${count}/${files.length} assets`);}}));
// Public content uses the same optimized asset URLs. Static copies make the first
// paint immediate; every original/new compressed asset is also available in R2.
const document=JSON.stringify(defaultPortfolio);
const migration=await readFile('migrations/0001_initial.sql','utf8');
await api(`${base}/d1/database/${database}/query`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sql:migration})});
const now=new Date().toISOString();
const query=await api(`${base}/d1/database/${database}/query`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sql:'INSERT INTO portfolio_content (id,document,version,updated_at) VALUES (1,?,1,?) ON CONFLICT(id) DO UPDATE SET document=excluded.document, version=portfolio_content.version+1, updated_at=excluded.updated_at',params:[document,now]})});
const result=await query.json();if(!result.success)throw new Error('Database seeding failed');
const metadata=files.map(file=>({key:file.replaceAll('\\','/').replace(/^public\//,''),name:path.basename(file),type:types[path.extname(file)]||'application/octet-stream'}));
for(let index=0;index<metadata.length;index+=10){const batch=metadata.slice(index,index+10);await api(`${base}/d1/database/${database}/query`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sql:`INSERT INTO media_library(key,filename,content_type,size,uploaded_at) VALUES ${batch.map(()=>'(?,?,?,?,?)').join(',')} ON CONFLICT(key) DO NOTHING`,params:(await Promise.all(batch.map(async(item)=>[item.key,item.name,item.type,(await stat(`public/${item.key}`)).size,now]))).flat()})});}
await writeFile('docs/cloudflare-assets.json',JSON.stringify({bucket,count,bytes,syncedAt:now},null,2));
console.log(`Synchronized ${count} optimized assets (${(bytes/1024/1024).toFixed(2)} MB) to R2; D1 initialized.`);
