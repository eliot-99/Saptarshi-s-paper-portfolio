import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(file);else if(file.endsWith('.tsx')){const source=await readFile(file,'utf8');const updated=source.replace(/import\s*\{([^}]+)\}\s*from\s*['"]@phosphor-icons\/react['"];?/g,(_, names)=>names.split(',').map(s=>s.trim()).filter(Boolean).map(name=>`import { ${name} } from '@phosphor-icons/react/dist/csr/${name.split(/\s+as\s+/)[0]}'`).join('\n'));if(updated!==source){await writeFile(file,updated);console.log(file);}}}}
await walk('src/components'); await walk('src/sections');
