import sharp from 'sharp';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const outputDirectory = path.join(root, 'public', 'assets', 'portraits');
await mkdir(outputDirectory, { recursive: true });

const requestedNames = process.argv.slice(2);
const portraits = [
  { name: 'maker', basename: 'portrait-passport-maker' },
  { name: 'about', basename: 'portrait-reference-about' },
];

for (const { name, basename } of portraits) {
  if (requestedNames.length && !requestedNames.includes(name)) continue;
  const master = path.join(root, 'artwork', 'png', `${basename}.png`);
  const input = await readFile(master);
  // Preserve the generated alpha and subject; this step only compresses the PNG.
  await writeFile(master, await sharp(input).png({ compressionLevel: 9 }).toBuffer());
  const target = path.join(outputDirectory, basename);
  await sharp(input).webp({ quality: 86, alphaQuality: 100, effort: 6 }).toFile(`${target}.webp`);
  await sharp(input).avif({ quality: 62, effort: 7 }).toFile(`${target}.avif`);
  await sharp(input).resize({ width: 600, withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 100, effort: 6 }).toFile(`${target}-600.webp`);

  const metadata = await sharp(master).metadata();
  const stats = await sharp(master).stats();
  const variants = [master, `${target}.webp`, `${target}.avif`, `${target}-600.webp`];
  console.log(JSON.stringify({
    name,
    width: metadata.width,
    height: metadata.height,
    hasAlpha: metadata.hasAlpha,
    isOpaque: stats.isOpaque,
    alphaRange: [stats.channels[3].min, stats.channels[3].max],
    files: await Promise.all(variants.map(async file => ({
      path: path.relative(root, file).replaceAll('\\', '/'),
      bytes: (await stat(file)).size,
    }))),
  }));
}

