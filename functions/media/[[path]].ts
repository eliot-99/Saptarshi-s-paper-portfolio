import type { BackendEnv } from '../../server/env';
import { handleError, HttpError } from '../../server/http';
import { validMediaKey } from '../../server/media';

export const onRequest: PagesFunction<BackendEnv> = (context) => handleError(async () => {
  const { request, env } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  let key: string;
  try { key = decodeURIComponent(new URL(request.url).pathname.slice('/media/'.length)); }
  catch { throw new HttpError(400, 'The media path is invalid.'); }
  if (!validMediaKey(key)) throw new HttpError(400, 'The media path is invalid.');
  let object: R2Object | null;
  let body: ReadableStream | null = null;
  if (request.method === 'HEAD') object = await env.PORTFOLIO_MEDIA.head(key);
  else {
    const fetched = await env.PORTFOLIO_MEDIA.get(key);
    object = fetched;
    body = fetched?.body ?? null;
  }
  if (!object) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Content-Length', String(object.size));
  headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  headers.set('X-Content-Type-Options', 'nosniff');
  // Uploaded documents are isolated from the portfolio's origin and session.
  if (['application/pdf', 'image/svg+xml'].includes(headers.get('Content-Type') ?? '')) headers.set('Content-Security-Policy', 'sandbox');
  if (request.headers.get('If-None-Match')?.split(',').map((value) => value.trim()).includes(object.httpEtag)) {
    headers.delete('Content-Length');
    return new Response(null, { status: 304, headers });
  }
  return new Response(body, { headers });
}, context.request);

