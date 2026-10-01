import type { PortfolioData } from '../types/portfolio';

export interface ContentEnvelope {
  content: PortfolioData;
  version: number;
  updatedAt: string | null;
}

export interface MediaAsset {
  key: string;
  url: string;
  type: string;
  size: number;
  name: string;
}

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...options,
    credentials: 'same-origin',
    headers: options?.body instanceof FormData
      ? options.headers
      : { 'Content-Type': 'application/json', ...options?.headers },
  });
  const raw = await response.text();
  let data: Record<string, unknown>;
  try {
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('Invalid API response.');
    data = parsed as Record<string, unknown>;
  } catch {
    throw new ApiError('The content service is unavailable. Your draft is still saved on this device.', response.status || 503);
  }
  if (!response.ok) {
    const detail = typeof data.error === 'string' ? data.error : typeof data.message === 'string' ? data.message : `Request failed (${response.status}).`;
    throw new ApiError(detail, response.status);
  }
  return data as T;
}

export async function prepareUpload(file: File): Promise<{ file: File; width?: number; height?: number }> {
  if (file.type === 'application/pdf') return { file };
  if (!file.type.startsWith('image/')) throw new Error('Choose a JPG, PNG, WebP, AVIF, or PDF file.');
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error('This image could not be opened. Try a PNG, JPG, or WebP file.');
  }
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Image compression is unavailable in this browser.');
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((result) => result ? resolve(result) : reject(new Error('Image compression failed.')), 'image/webp', 0.82);
  });
  return { file: new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' }), width, height };
}

export async function uploadMedia(file: File): Promise<MediaAsset & { width?: number; height?: number }> {
  const prepared = await prepareUpload(file);
  const body = new FormData();
  body.append('file', prepared.file);
  const result = await api<MediaAsset>('/api/media', { method: 'POST', body });
  return { ...result, width: prepared.width, height: prepared.height };
}
