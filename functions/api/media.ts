import type { BackendEnv } from '../../server/env';
import { collectAssetUrls, readContent } from '../../server/content';
import { assertSameOrigin, HttpError, json, readBody } from '../../server/http';
import { cleanFilename, MAX_UPLOAD_BYTES, mediaUrl, sniffMedia, validMediaKey } from '../../server/media';
import { requireSession } from '../../server/security';

interface MediaRow { key: string; filename: string; content_type: string; size: number; uploaded_at: string }
const present = (row: MediaRow) => ({ key: row.key, url: mediaUrl(row.key), name: row.filename, type: row.content_type, size: row.size, uploadedAt: row.uploaded_at });

export const onRequest: PagesFunction<BackendEnv> = async ({ request, env }) => {
  await requireSession(request, env);
  if (request.method === 'GET') {
    const cursor = new URL(request.url).searchParams.get('cursor');
    if (cursor && !validMediaKey(cursor)) throw new HttpError(400, 'The media cursor is invalid.');
    const rows = await env.PORTFOLIO_DB.prepare('SELECT key, filename, content_type, size, uploaded_at FROM media_library WHERE key > ? ORDER BY key LIMIT 101').bind(cursor ?? '').all<MediaRow>();
    const items = rows.results.slice(0, 100).map(present);
    return json({ items, ...(rows.results.length > 100 ? { cursor: items[items.length - 1].key } : {}) });
  }
  if (request.method === 'POST') {
    assertSameOrigin(request);
    const contentType = request.headers.get('Content-Type') ?? '';
    if (!contentType.startsWith('multipart/form-data;')) throw new HttpError(415, 'Send a file using multipart/form-data.');
    const bytes = await readBody(request, MAX_UPLOAD_BYTES + 64 * 1024);
    let form: FormData;
    try {
      form = await new Request(request.url, { method: 'POST', headers: { 'Content-Type': contentType }, body: bytes }).formData();
    } catch {
      throw new HttpError(400, 'The file upload could not be read.');
    }
    const file = form.get('file');
    if (!(file instanceof File) || form.getAll('file').length !== 1 || file.size === 0) throw new HttpError(400, 'Choose one non-empty file to upload.');
    if (file.size > MAX_UPLOAD_BYTES) throw new HttpError(413, 'Files must be no larger than 8 MB.');
    const data = await file.arrayBuffer();
    const { type, extension } = sniffMedia(new Uint8Array(data), file.type);
    const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', data)), (byte) => byte.toString(16).padStart(2, '0')).join('');
    const key = `uploads/${hash.slice(0, 20)}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
    const name = cleanFilename(file.name);
    const uploadedAt = new Date().toISOString();
    await env.PORTFOLIO_MEDIA.put(key, data, { httpMetadata: { contentType: type, cacheControl: 'public, max-age=31536000, immutable' }, customMetadata: { filename: name } });
    try {
      await env.PORTFOLIO_DB.prepare('INSERT INTO media_library (key, filename, content_type, size, uploaded_at) VALUES (?, ?, ?, ?, ?)').bind(key, name, type, file.size, uploadedAt).run();
    } catch (error) {
      await env.PORTFOLIO_MEDIA.delete(key);
      throw error;
    }
    return json({ key, url: mediaUrl(key), name, type, size: file.size, uploadedAt }, 201);
  }
  if (request.method === 'DELETE') {
    assertSameOrigin(request);
    const key = new URL(request.url).searchParams.get('key');
    if (!key || !validMediaKey(key) || !key.startsWith('uploads/')) throw new HttpError(400, 'Choose an uploaded media file to delete.');
    const current = await readContent(env);
    if (collectAssetUrls(current.content).has(mediaUrl(key))) throw new HttpError(409, 'This file is used in the published portfolio. Replace it there before deleting it.');
    // Retained revisions remain restorable without losing their media.
    const history = await env.PORTFOLIO_DB.prepare('SELECT document FROM content_history').all<{ document: string }>();
    if (history.results.some((row) => collectAssetUrls(JSON.parse(row.document)).has(mediaUrl(key)))) throw new HttpError(409, 'This file is used in a saved revision and is protected until that revision expires.');
    const exists = await env.PORTFOLIO_DB.prepare('SELECT key FROM media_library WHERE key = ?').bind(key).first();
    if (!exists) throw new HttpError(404, 'That media file was not found.');
    await env.PORTFOLIO_MEDIA.delete(key);
    await env.PORTFOLIO_DB.prepare('DELETE FROM media_library WHERE key = ?').bind(key).run();
    return json({ ok: true });
  }
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST, DELETE' });
};

