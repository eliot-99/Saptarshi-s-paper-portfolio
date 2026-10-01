import type { BackendEnv } from '../../../server/env';
import { assertSameOrigin, json } from '../../../server/http';
import { clearSessionCookie, hashToken, sessionToken } from '../../../server/security';

export const onRequest: PagesFunction<BackendEnv> = async ({ request, env }) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  assertSameOrigin(request);
  const token = sessionToken(request);
  if (token) await env.PORTFOLIO_DB.prepare('DELETE FROM admin_sessions WHERE token_hash = ?').bind(await hashToken(token)).run();
  return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie(request) });
};

