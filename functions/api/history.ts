import type { BackendEnv } from '../../server/env';
import { writeContent } from '../../server/content';
import { assertSameOrigin, HttpError, isRecord, json, readJson } from '../../server/http';
import { requireSession } from '../../server/security';
import { validatePortfolio } from '../../server/validation';

export const onRequest: PagesFunction<BackendEnv> = async ({ request, env }) => {
  await requireSession(request, env);
  if (request.method === 'GET') {
    const version = new URL(request.url).searchParams.get('version');
    if (version !== null) {
      if (!/^\d+$/.test(version)) throw new HttpError(400, 'Choose a valid version.');
      const row = await env.PORTFOLIO_DB.prepare('SELECT document, version, saved_at FROM content_history WHERE version = ?').bind(Number(version)).first<{ document: string; version: number; saved_at: string }>();
      if (!row) throw new HttpError(404, 'That revision could not be found.');
      return json({ content: JSON.parse(row.document), version: row.version, savedAt: row.saved_at });
    }
    const rows = await env.PORTFOLIO_DB.prepare('SELECT version, saved_at AS savedAt FROM content_history ORDER BY version DESC LIMIT 30').all();
    return json({ items: rows.results });
  }
  if (request.method === 'POST') {
    assertSameOrigin(request);
    const body = await readJson(request, 2048);
    if (!isRecord(body) || Object.keys(body).some((key) => !['restoreVersion', 'version'].includes(key)) || !Number.isSafeInteger(body.restoreVersion) || !Number.isSafeInteger(body.version)) throw new HttpError(400, 'Choose a valid revision and current version.');
    const row = await env.PORTFOLIO_DB.prepare('SELECT document FROM content_history WHERE version = ?').bind(body.restoreVersion as number).first<{ document: string }>();
    if (!row) throw new HttpError(404, 'That revision could not be found.');
    const envelope = await writeContent(env, validatePortfolio(JSON.parse(row.document)), body.version as number);
    await caches.default.delete(new Request(`${new URL(request.url).origin}/api/content`, { method: 'GET' }));
    return json(envelope);
  }
  return json({ error: 'Method not allowed.' }, 405, { Allow: 'GET, POST' });
};
