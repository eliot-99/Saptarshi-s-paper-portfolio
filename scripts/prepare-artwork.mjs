import sharp from 'sharp';
import { mkdir, copyFile, readdir, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
const out = 'public/assets/artwork';
await mkdir(out, { recursive: true });
const images = [['developers-eye', 1200], ['creative-eye', 800]];
const report = [];
for (const [name, width] of images) {
  const source = `artwork/png/${name}.png`;
  await sharp(source).resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(`${out}/${name}.webp`);
  await sharp(source).resize({ width, withoutEnlargement: true }).avif({ quality: 65, effort: 5 }).toFile(`${out}/${name}.avif`);
  await sharp(source).png({ compressionLevel: 9, palette: true, quality: 90, effort: 10 }).toFile(`artwork/png/${name}-compressed.png`);
  report.push({ name, sourceBytes: (await stat(source)).size, webpBytes: (await stat(`${out}/${name}.webp`)).size });
}
const fonts = [['barlow-condensed','barlow-condensed-latin-900-normal.woff2','barlow-condensed-900.woff2'],['bodoni-moda','bodoni-moda-latin-500-normal.woff2','bodoni-moda-500.woff2'],['bodoni-moda','bodoni-moda-latin-500-italic.woff2','bodoni-moda-500-italic.woff2'],['dm-sans','dm-sans-latin-400-normal.woff2','dm-sans-400.woff2'],['ibm-plex-mono','ibm-plex-mono-latin-400-normal.woff2','ibm-plex-mono-400.woff2']];
await mkdir('public/fonts', {recursive:true});
for(const [family,file,dest] of fonts){ await copyFile(`node_modules/@fontsource/${family}/files/${file}`,`public/fonts/${dest}`); const files=await readdir(`node_modules/@fontsource/${family}`); const license=files.find(f=>/license/i.test(f)); if(license){await mkdir('docs/licenses',{recursive:true});await copyFile(`node_modules/@fontsource/${family}/${license}`,`docs/licenses/${family}.txt`);} }
await writeFile('docs/artwork-compression.json', JSON.stringify(report,null,2));
console.log(report);
