import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defaultPortfolio } from '../src/data/portfolio.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(root, 'public');
const references = new Set();
const errors = [];
const linkKeys = new Set(['src', 'avif', 'resumeUrl', 'repository', 'liveUrl', 'url']);

function collect(value, field = '', trail = 'content') {
  if (Array.isArray(value)) { value.forEach((item, index) => collect(item, field, `${trail}[${index}]`)); return; }
  if (value && typeof value === 'object') { Object.entries(value).forEach(([key, item]) => collect(item, key, `${trail}.${key}`)); return; }
  if (typeof value !== 'string' || !value) return;
  if (field === 'srcSet') {
    for (const candidate of value.split(',')) {
      const [url, descriptor] = candidate.trim().split(/\s+/);
      if (!/^\d+(w|x)$/.test(descriptor || '')) errors.push(`${trail}: invalid responsive image descriptor`);
      if (url?.startsWith('/')) references.add(url.split(/[?#]/)[0]);
    }
    return;
  }
  if (!linkKeys.has(field)) return;
  if (value.startsWith('/')) references.add(value.split(/[?#]/)[0]);
  else if (!value.startsWith('#')) {
    try { const url = new URL(value); if (!['https:', 'http:', 'mailto:', 'tel:'].includes(url.protocol)) errors.push(`${trail}: unsupported protocol`); }
    catch { errors.push(`${trail}: malformed URL`); }
  }
}

collect(defaultPortfolio);
const css = await fs.readFile(path.join(root, 'src/styles/index.css'), 'utf8');
for (const match of css.matchAll(/url\(['"]?(\/[^)'"\s]+)['"]?\)/g)) references.add(match[1].split(/[?#]/)[0]);
const index = await fs.readFile(path.join(root, 'index.html'), 'utf8');
for (const match of index.matchAll(/(?:src|href|content)="(\/(?:assets|fonts|favicon)[^"]*)"/g)) references.add(match[1].split(/[?#]/)[0]);

for (const reference of references) {
  const asset = path.resolve(publicRoot, `.${reference}`);
  if (!asset.startsWith(`${publicRoot}${path.sep}`)) { errors.push(`${reference}: outside public folder`); continue; }
  try { const stat = await fs.stat(asset); if (!stat.isFile() || stat.size === 0) errors.push(`${reference}: empty or not a file`); }
  catch { errors.push(`${reference}: missing local asset`); }
}

const ids = new Set(['top', 'main', 'about', 'work', 'journey', 'skills', 'archive', 'credentials', 'puzzle', 'contact']);
for (const link of defaultPortfolio.navigation) if (link.url.startsWith('#') && !ids.has(link.url.slice(1))) errors.push(`Navigation "${link.label}" points to an unknown section: ${link.url}`);
for (const id of defaultPortfolio.sectionOrder) if (!ids.has(id) || ['top', 'main'].includes(id)) errors.push(`Unknown ordered section: ${id}`);

if (errors.length) { errors.forEach(error => console.error(error)); process.exitCode = 1; }
else console.log(`Verified ${references.size} local asset paths, remote URL syntax and navigation section names.`);
