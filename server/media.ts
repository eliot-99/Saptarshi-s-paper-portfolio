import { HttpError } from './http';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export function validMediaKey(value: string): boolean {
  return /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,399}$/.test(value) && !value.split('/').some((segment) => !segment || segment === '.' || segment === '..');
}

export function mediaUrl(key: string): string {
  return `/media/${key.split('/').map(encodeURIComponent).join('/')}`;
}

export function sniffMedia(bytes: Uint8Array, declaredType: string): { type: string; extension: string } {
  const ascii = (start: number, end: number) => String.fromCharCode(...bytes.subarray(start, end));
  let type = '';
  let extension = '';
  if (bytes.length >= 12 && ascii(0, 4) === 'RIFF' && ascii(8, 12) === 'WEBP') { type = 'image/webp'; extension = 'webp'; }
  else if (bytes.length >= 8 && bytes[0] === 137 && ascii(1, 4) === 'PNG' && bytes[4] === 13 && bytes[5] === 10 && bytes[6] === 26 && bytes[7] === 10) { type = 'image/png'; extension = 'png'; }
  else if (bytes.length >= 3 && bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255) { type = 'image/jpeg'; extension = 'jpg'; }
  else if (bytes.length >= 16 && ascii(4, 8) === 'ftyp' && /avif|avis/.test(ascii(8, Math.min(bytes.length, 32)))) { type = 'image/avif'; extension = 'avif'; }
  else if (bytes.length >= 5 && ascii(0, 5) === '%PDF-') { type = 'application/pdf'; extension = 'pdf'; }
  if (!type || type !== declaredType) throw new HttpError(415, 'Upload a valid WebP, AVIF, PNG, JPEG image, or PDF document.');
  return { type, extension };
}

export function cleanFilename(value: string): string {
  return value.split(/[\\/]/).pop()?.replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 200) || 'upload';
}

