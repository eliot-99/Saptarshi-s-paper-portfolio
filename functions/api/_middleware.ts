import { handleError, json } from '../../server/http';
import type { BackendEnv } from '../../server/env';

export const onRequest: PagesFunction<BackendEnv> = (context) => handleError(async () => {
  if (!['GET', 'HEAD', 'POST', 'PUT', 'DELETE'].includes(context.request.method)) {
    return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, HEAD, POST, PUT, DELETE' });
  }
  return context.next();
}, context.request);

