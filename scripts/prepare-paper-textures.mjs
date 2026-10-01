import { mkdir, stat } from 'node:fs/promises';
import sharp from 'sharp';

const textures = [
  ['newsprint-red-black', 768, 67],
  ['torn-ink-impression', 640, 80],
];
await mkdir('artwork/png', { recursive: true });
await mkdir('public/assets/textures', { recursive: true });
for (const [name, width, quality] of textures) {
  await sharp(`artwork/png/${name}.png`).resize({ width }).webp({ quality, alphaQuality: 90, effort: 6 }).toFile(`public/assets/textures/${name}.webp`);
  const image = await sharp(`public/assets/textures/${name}.webp`).metadata();
  console.log(`${name}: ${image.width}×${image.height}, ${Math.round((await stat(`public/assets/textures/${name}.webp`)).size / 1024)} KB, alpha ${image.hasAlpha}`);
}
