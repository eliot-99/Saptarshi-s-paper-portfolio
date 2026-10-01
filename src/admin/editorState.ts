import type { PortfolioData } from '../types/portfolio';
import { validatePortfolio } from '../../server/validation';

export const DRAFT_KEY = 'paper-portfolio-editor-draft-v1';
export interface Draft { content: PortfolioData; version: number; savedAt: string }

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

/** Older editor exports predate these three content groups. Preserve their edits while filling only new groups. */
export function parseImportedContent(value: unknown, fallback: PortfolioData): { content: PortfolioData; migrated: boolean } {
  if (!isRecord(value)) throw new Error('The portfolio content must be a complete JSON object.');
  const next = { ...value };
  let migrated = false;
  for (const key of ['editorial', 'navigation', 'sectionOrder'] as const) {
    if (!Object.hasOwn(next, key)) { next[key] = structuredClone(fallback[key]); migrated = true; }
  }
  if (isRecord(next.editorial)) {
    if (Object.keys(fallback.editorial).some((key) => !Object.hasOwn(next.editorial as Record<string, unknown>, key))) migrated = true;
    next.editorial = { ...fallback.editorial, ...next.editorial };
  }
  return { content: validatePortfolio(next), migrated };
}

export function recoverStoredDraft(raw: string | null, fallback: PortfolioData): { draft: Draft | null; warning: string } {
  if (!raw) return { draft: null, warning: '' };
  try {
    const value: unknown = JSON.parse(raw);
    if (!isRecord(value) || !Number.isSafeInteger(value.version) || typeof value.version !== 'number' || value.version < 0 || typeof value.savedAt !== 'string' || Number.isNaN(Date.parse(value.savedAt))) throw new Error('The draft metadata is invalid.');
    const restored = parseImportedContent(value.content, fallback);
    return { draft: { content: restored.content, version: value.version, savedAt: value.savedAt }, warning: restored.migrated ? 'Your older draft was upgraded with the latest editorial and navigation settings.' : '' };
  } catch {
    return { draft: null, warning: 'A saved draft could not be restored because its content was invalid. The published edition has been loaded safely.' };
  }
}

export function replaceUploadedImage(value: Record<string, unknown>, asset: { url: string; width?: number; height?: number }): Record<string, unknown> {
  const next = { ...value, src: asset.url, width: asset.width || value.width, height: asset.height || value.height };
  delete (next as Record<string, unknown>).avif;
  delete (next as Record<string, unknown>).srcSet;
  return next;
}

export function updateImageField(value: Record<string, unknown>, field: string, updated: unknown): Record<string, unknown> {
  const next = { ...value, [field]: updated };
  if (field === 'src' && updated !== value.src) { delete next.avif; delete next.srcSet; }
  if ((field === 'avif' || field === 'srcSet') && updated === '') delete next[field];
  return next;
}

/** A slow publication response must never erase edits made after the save began. */
export function resolvePublication(sent: PortfolioData, current: PortfolioData | null, published: PortfolioData): { content: PortfolioData; newerEdits: boolean } {
  const newerEdits = Boolean(current && JSON.stringify(current) !== JSON.stringify(sent));
  return { content: newerEdits && current ? current : published, newerEdits };
}
