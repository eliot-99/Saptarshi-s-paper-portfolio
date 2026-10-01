import { defaultPortfolio } from '../src/data/portfolio';
import type { PortfolioData } from '../src/types/portfolio';
import type { BackendEnv } from './env';
import { HttpError } from './http';

export interface ContentEnvelope {
  content: PortfolioData;
  version: number;
  updatedAt: string | null;
}

interface ContentRow {
  document: string;
  version: number;
  updated_at: string;
}

export async function readContent(env: BackendEnv): Promise<ContentEnvelope> {
  const row = await env.PORTFOLIO_DB.prepare('SELECT document, version, updated_at FROM portfolio_content WHERE id = 1').first<ContentRow>();
  return row ? { content: JSON.parse(row.document) as PortfolioData, version: row.version, updatedAt: row.updated_at } : { content: defaultPortfolio, version: 0, updatedAt: null };
}

/** Compare-and-swap is one atomic statement; history is recorded by a trigger. */
export async function writeContent(env: BackendEnv, content: PortfolioData, version: number): Promise<ContentEnvelope> {
  const updatedAt = new Date().toISOString();
  const document = JSON.stringify(content);
  const statement = version === 0
    ? env.PORTFOLIO_DB.prepare('INSERT OR IGNORE INTO portfolio_content (id, document, version, updated_at) VALUES (1, ?, 1, ?)').bind(document, updatedAt)
    : env.PORTFOLIO_DB.prepare('UPDATE portfolio_content SET document = ?, version = version + 1, updated_at = ? WHERE id = 1 AND version = ?').bind(document, updatedAt, version);
  const result = await statement.run();
  if (result.meta.changes !== 1) throw new HttpError(409, 'This portfolio changed in another tab. Reload the latest version before publishing.');
  return { content, version: version + 1, updatedAt };
}

export function collectAssetUrls(value: unknown, collected = new Set<string>()): Set<string> {
  if (typeof value === 'string') {
    if (value.startsWith('/media/')) collected.add(value);
    // Images with responsive candidates must also stay protected from deletion.
    for (const candidate of value.split(',')) {
      const url = candidate.trim().split(/\s+/)[0];
      if (url.startsWith('/media/')) collected.add(url);
    }
  } else if (Array.isArray(value)) {
    for (const entry of value) collectAssetUrls(entry, collected);
  } else if (value && typeof value === 'object') {
    for (const entry of Object.values(value)) collectAssetUrls(entry, collected);
  }
  return collected;
}

