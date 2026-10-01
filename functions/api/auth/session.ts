import type { BackendEnv } from '../../../server/env';
import { json } from '../../../server/http';
import { currentSession } from '../../../server/security';

export const onRequest: PagesFunction<BackendEnv> = async ({ request, env }) => {
  if (request.method !== 'GET') return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET' });
  const session = await currentSession(request, env);
  return json(session ? { authenticated: true, expiresAt: new Date(session.expiresAt * 1000).toISOString() } : { authenticated: false });
};

