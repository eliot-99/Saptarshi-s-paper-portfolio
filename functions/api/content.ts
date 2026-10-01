import type { BackendEnv } from '../../server/env';
import { readContent, writeContent } from '../../server/content';
import { assertSameOrigin, json, readJson } from '../../server/http';
import { requireSession } from '../../server/security';
import { validateContentUpdate } from '../../server/validation';

export const onRequest: PagesFunction<BackendEnv> = async (context) => {
  const { request, env } = context;
  const cacheKey = new Request(`${new URL(request.url).origin}/api/content`, { method: 'GET' });
  if (request.method === 'GET' || request.method === 'HEAD') {
    const isPublic = !request.headers.has('Cookie');
    if (isPublic) {
      const cached = await caches.default.match(cacheKey);
      if (cached) {
        if (request.headers.get('If-None-Match') === cached.headers.get('ETag')) return new Response(null, { status: 304, headers: cached.headers });
        return request.method === 'HEAD' ? new Response(null, { headers: cached.headers }) : cached;
      }
    }
    const envelope = await readContent(env);
    const digest = new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(JSON.stringify(envelope.content))));
    const contentHash = Array.from(digest, (byte) => byte.toString(16).padStart(2, '0')).join('').slice(0, 24);
    const etag = `"portfolio-${envelope.version}-${contentHash}"`;
    const headers = { 'Cache-Control': isPublic ? 'public, max-age=0, s-maxage=30, must-revalidate' : 'no-store', ETag: etag, Vary: 'Cookie' };
    if (request.headers.get('If-None-Match') === etag) return new Response(null, { status: 304, headers });
    if (request.method === 'HEAD') return new Response(null, { headers });
    const response = json(envelope, 200, headers);
    if (isPublic) context.waitUntil(caches.default.put(cacheKey, response.clone()));
    return response;
  }
  if (request.method === 'PUT') {
    assertSameOrigin(request);
    await requireSession(request, env);
    const { content, version } = validateContentUpdate(await readJson(request));
    const envelope = await writeContent(env, content, version);
    await caches.default.delete(cacheKey);
    return json(envelope);
  }
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD, PUT' });
};

