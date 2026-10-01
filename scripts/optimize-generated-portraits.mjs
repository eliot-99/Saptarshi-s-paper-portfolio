import { mkdir, copyFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const sourceDir = process.env.GENERATED_PORTRAIT_DIR ?? path.resolve(process.env.USERPROFILE ?? '', '.codex/generated_images/01a0f3f2-c4f9-7481-84ed-b9d6ebc3264e')
const targetDir = path.resolve('public/assets/portraits')
const sourceArchive = path.resolve('artwork/png')
const files = [
  ['exec-779cb0e6-6c62-4ff3-90cf-ca64031842f1.png', 'portrait-new-landscape'],
  ['exec-91971734-03f4-42fc-a584-df84ab98c682.png', 'portrait-new-vertical'],
]

await mkdir(targetDir, { recursive: true })
await mkdir(sourceArchive, { recursive: true })
for (const [sourceName, baseName] of files) {
  const archivedSource = path.join(sourceArchive, `${baseName}.png`)
  const source = existsSync(archivedSource) ? archivedSource : path.join(sourceDir, sourceName)
  if (!existsSync(source)) throw new Error(`Generated portrait not found: ${source}`)
  const input = sharp(source).rotate()
  const metadata = await input.metadata()
  const width = metadata.width ?? 1200
  const height = metadata.height ?? 1200
  if (source !== archivedSource) await copyFile(source, archivedSource)
  await input.clone().resize({ width: Math.min(width, 1536), withoutEnlargement: true }).webp({ quality: 84, effort: 6 }).toFile(path.join(targetDir, `${baseName}.webp`))
  await input.clone().resize({ width: Math.min(width, 1536), withoutEnlargement: true }).avif({ quality: 62, effort: 7 }).toFile(path.join(targetDir, `${baseName}.avif`))
  await input.clone().resize({ width: 600, withoutEnlargement: true }).webp({ quality: 80, effort: 6 }).toFile(path.join(targetDir, `${baseName}-600.webp`))
  console.log(`${baseName}: ${width}x${height}`)
}
