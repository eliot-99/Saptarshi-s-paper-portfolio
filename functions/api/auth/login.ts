import type { BackendEnv } from '../../../server/env';
import { assertSameOrigin, HttpError, isRecord, json, readJson } from '../../../server/http';
import { consumeLoginAttempt, createSession, verifyPassword } from '../../../server/security';

export const onRequest: PagesFunction<BackendEnv> = async ({ request, env }) => {
  if (request.method !== 'POST') return json({ error: 'Method not allowed.' }, 405, { Allow: 'POST' });
  assertSameOrigin(request);
  if (!env.ADMIN_PASSWORD_HASH) throw new HttpError(503, 'Admin authentication has not been configured.');
  await consumeLoginAttempt(request, env);
  const body = await readJson(request, 2048);
  if (!isRecord(body) || Object.keys(body).some((key) => key !== 'password') || typeof body.password !== 'string' || !body.password || body.password.length > 256) {
    throw new HttpError(400, 'Enter a password of up to 256 characters.');
  }
  if (!await verifyPassword(body.password, env.ADMIN_PASSWORD_HASH)) throw new HttpError(401, 'That password is incorrect.');
  const session = await createSession(request, env);
  return json({ authenticated: true, expiresAt: session.expiresAt }, 200, { 'Set-Cookie': session.cookie });
};

