import assert from 'node:assert/strict';
import test from 'node:test';
import { defaultPortfolio } from '../../src/data/portfolio';
import type { AssetImage } from '../../src/types/portfolio';
import { validatePortfolio } from '../../server/validation';
import { api, ApiError } from '../../src/admin/api';
import { parseImportedContent, recoverStoredDraft, replaceUploadedImage, resolvePublication, updateImageField } from '../../src/admin/editorState';
import { reorderSections } from '../../src/admin/SectionOrderEditor';
import { newArrayItem } from '../../src/admin/templates';

test('legacy drafts gain new configuration without losing existing edits or mutating defaults', () => {
  const legacy = structuredClone(defaultPortfolio) as unknown as Record<string, unknown>;
  delete legacy.editorial;
  delete legacy.navigation;
  delete legacy.sectionOrder;
  (legacy.hero as Record<string, unknown>).headline = 'My preserved unpublished headline';
  const original = JSON.stringify(legacy);
  const result = recoverStoredDraft(JSON.stringify({ content: legacy, version: 4, savedAt: '2026-10-01T00:00:00.000Z' }), defaultPortfolio);
  assert.equal(result.draft?.content.hero.headline, 'My preserved unpublished headline');
  assert.deepEqual(result.draft?.content.navigation, defaultPortfolio.navigation);
  assert.deepEqual(result.draft?.content.sectionOrder, defaultPortfolio.sectionOrder);
  assert.equal(result.draft?.version, 4);
  assert.match(result.warning, /upgraded/);
  assert.equal(JSON.stringify(legacy), original);
});

test('malformed nested draft data is rejected gracefully instead of entering the editor', () => {
  const malformed = structuredClone(defaultPortfolio) as unknown as Record<string, unknown>;
  malformed.projects = [null];
  const recovered = recoverStoredDraft(JSON.stringify({ content: malformed, version: 1, savedAt: '2026-10-01T00:00:00.000Z' }), defaultPortfolio);
  assert.equal(recovered.draft, null);
  assert.match(recovered.warning, /published edition has been loaded safely/);
  assert.equal(recoverStoredDraft('{broken JSON', defaultPortfolio).draft, null);
  assert.equal(recoverStoredDraft(JSON.stringify({ content: defaultPortfolio, version: -1, savedAt: 'invalid' }), defaultPortfolio).draft, null);
});

test('advanced import uses the server schema to reject dangerous URLs and malformed fields', () => {
  const unsafe = structuredClone(defaultPortfolio);
  unsafe.socials[0].url = 'javascript:alert(1)';
  assert.throws(() => parseImportedContent(unsafe, defaultPortfolio), /HTTPS or a local asset path/);
  const malformed = structuredClone(defaultPortfolio) as unknown as Record<string, unknown>;
  malformed.theme = { ...defaultPortfolio.theme, motion: 'yes' };
  assert.throws(() => parseImportedContent(malformed, defaultPortfolio), /must be true or false/);
  assert.throws(() => parseImportedContent({ ...defaultPortfolio, password: 'not-a-real-password' }, defaultPortfolio), /not a supported field/);
});

test('legacy imports fill only the new groups while invalid existing data remains rejected', () => {
  const legacy = structuredClone(defaultPortfolio) as unknown as Record<string, unknown>;
  delete legacy.sectionOrder;
  legacy.editorial = { makerTitle: 'A new headline' };
  const result = parseImportedContent(legacy, defaultPortfolio);
  assert.equal(result.migrated, true);
  assert.equal(result.content.editorial.makerTitle, 'A new headline');
  assert.equal(result.content.editorial.puzzleAction, defaultPortfolio.editorial.puzzleAction);
  legacy.projects = 'not a list';
  assert.throws(() => parseImportedContent(legacy, defaultPortfolio), /content.projects/);
});

test('upload replacement removes stale image variants and remains publishable', () => {
  const image = { ...defaultPortfolio.person.portrait, avif: '/old.avif', srcSet: '/old-480.webp 480w' };
  const replaced = replaceUploadedImage(image, { url: '/media/new-image.webp', width: 1440, height: 960 });
  assert.equal(replaced.src, '/media/new-image.webp');
  assert.equal(replaced.width, 1440);
  assert.equal(replaced.height, 960);
  assert.equal(Object.hasOwn(replaced, 'avif'), false);
  assert.equal(Object.hasOwn(replaced, 'srcSet'), false);
  assert.equal(replaced.alt, image.alt);
  const content = structuredClone(defaultPortfolio);
  content.person.portrait = replaced as unknown as AssetImage;
  assert.doesNotThrow(() => validatePortfolio(content));
});

test('pasting an image URL clears old picture sources while editing its caption preserves them', () => {
  const image = { ...defaultPortfolio.person.portrait, avif: '/old.avif', srcSet: '/old-480.webp 480w' };
  const replaced = updateImageField(image, 'src', '/media/copied.webp');
  assert.equal(Object.hasOwn(replaced, 'avif'), false);
  assert.equal(Object.hasOwn(replaced, 'srcSet'), false);
  const caption = updateImageField(image, 'alt', 'A revised accessible caption');
  assert.equal(caption.avif, image.avif);
  assert.equal(caption.srcSet, image.srcSet);
});

test('clearing an optional image variant removes the field instead of sending invalid empty strings', () => {
  const image = { ...defaultPortfolio.person.portrait, avif: '/old.avif', srcSet: '/old-480.webp 480w' };
  const cleared = updateImageField(updateImageField(image, 'avif', ''), 'srcSet', '');
  assert.equal(Object.hasOwn(cleared, 'avif'), false);
  assert.equal(Object.hasOwn(cleared, 'srcSet'), false);
  const content = structuredClone(defaultPortfolio);
  content.person.portrait = cleared as unknown as AssetImage;
  assert.doesNotThrow(() => validatePortfolio(content));
});

test('a delayed publication response preserves edits made after publication began', () => {
  const sent = structuredClone(defaultPortfolio);
  const current = structuredClone(sent);
  current.hero.headline = 'Typed while the server was saving';
  const result = resolvePublication(sent, current, structuredClone(sent));
  assert.equal(result.newerEdits, true);
  assert.equal(result.content, current);
  assert.equal(result.content.hero.headline, 'Typed while the server was saving');
  const server = structuredClone(sent);
  const clean = resolvePublication(sent, structuredClone(sent), server);
  assert.equal(clean.newerEdits, false);
  assert.equal(clean.content, server);
});

test('reordering sections preserves every section exactly once and stops at list boundaries', () => {
  const order = [...defaultPortfolio.sectionOrder];
  const moved = reorderSections(order, 1, -1);
  assert.deepEqual(moved.slice(0, 2), ['work', 'about']);
  assert.deepEqual([...moved].sort(), [...order].sort());
  assert.equal(reorderSections(order, 0, -1), order);
  assert.equal(reorderSections(order, order.length - 1, 1), order);
  assert.doesNotThrow(() => validatePortfolio({ ...defaultPortfolio, sectionOrder: moved }));
  assert.throws(() => parseImportedContent({ ...defaultPortfolio, sectionOrder: ['about', 'about', ...order.slice(2)] }, defaultPortfolio), /exactly once/);
});

test('new navigation items have stable unique IDs and a supported destination', () => {
  const one = newArrayItem('navigation') as { id: string; label: string; url: string };
  const two = newArrayItem('navigation') as { id: string; label: string; url: string };
  assert.notEqual(one.id, two.id);
  assert.equal(one.url, '#about');
  assert.doesNotThrow(() => validatePortfolio({ ...defaultPortfolio, navigation: [...defaultPortfolio.navigation, one, two] }));
  assert.throws(() => validatePortfolio({ ...defaultPortfolio, navigation: [{ ...one, url: '#unsupported' }] }), /must be one of/);
});

test('a missing API returning HTML never appears as a successful content save', async () => {
  const originalFetch = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response('<html>Static fallback</html>', { status: 200, headers: { 'Content-Type': 'text/html' } });
    await assert.rejects(api('/api/content', { method: 'PUT', body: '{}' }), (error: unknown) => error instanceof ApiError && /service is unavailable/.test(error.message));
  } finally { globalThis.fetch = originalFetch; }
});

test('malformed successful API data reports service unavailability instead of crashing consumers', async () => {
  const originalFetch = globalThis.fetch;
  try {
    for (const body of ['null', '[]', '"unexpected text"']) {
      globalThis.fetch = async () => new Response(body, { status: 200 });
      await assert.rejects(api('/api/content'), (error: unknown) => error instanceof ApiError && /service is unavailable/.test(error.message));
    }
  } finally { globalThis.fetch = originalFetch; }
});

test('API preserves same-origin cookie auth and actionable conflict errors', async () => {
  const originalFetch = globalThis.fetch;
  try {
    let requested: RequestInit | undefined;
    globalThis.fetch = async (_url, options) => { requested = options; return new Response(JSON.stringify({ error: 'Another edition has been published.' }), { status: 409 }); };
    await assert.rejects(api('/api/content', { method: 'PUT', body: '{}' }), (error: unknown) => error instanceof ApiError && error.status === 409);
    assert.equal(requested?.credentials, 'same-origin');
    assert.equal(requested?.method, 'PUT');
  } finally { globalThis.fetch = originalFetch; }
});
