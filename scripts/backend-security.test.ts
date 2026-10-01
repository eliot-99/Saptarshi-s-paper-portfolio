import assert from 'node:assert/strict';
import { test } from 'node:test';
import { defaultPortfolio } from '../src/data/portfolio';
import { assertSameOrigin, HttpError, readBody, readJson } from '../server/http';
import { cleanFilename, mediaUrl, sniffMedia, validMediaKey } from '../server/media';
import { validateContentUpdate, validatePortfolio } from '../server/validation';

test('the complete migrated portfolio passes server validation', () => {
  assert.equal(validatePortfolio(defaultPortfolio), defaultPortfolio);
  assert.equal(validateContentUpdate({ content: defaultPortfolio, version: 0 }).version, 0);
});

test('unknown keys, malformed structure, invalid colors, and duplicate ids are rejected', () => {
  const change = (edit: (value: typeof defaultPortfolio) => void) => {
    const value = structuredClone(defaultPortfolio);
    edit(value);
    assert.throws(() => validatePortfolio(value), HttpError);
  };
  assert.throws(() => validatePortfolio({ ...defaultPortfolio, injected: true }), HttpError);
  assert.throws(() => validatePortfolio({ ...defaultPortfolio, toString: 'unrecognized field' }), HttpError);
  assert.throws(() => validateContentUpdate({ content: defaultPortfolio, version: -1 }), HttpError);
  assert.throws(() => validateContentUpdate({ content: defaultPortfolio, version: 1, publishAs: 'admin' }), HttpError);
  change((value) => { value.theme.paper = 'url(javascript:alert(1))'; });
  change((value) => { value.person.portrait.width = 0; });
  change((value) => { value.projects.push(structuredClone(value.projects[0])); });
  change((value) => { value.person.name = 'a'.repeat(501); });
  change((value) => { value.hero.description = '\u0000'; });
  change((value) => { value.editorial.makerTitle = 'a'.repeat(5001); });
  change((value) => { value.sectionOrder[0] = value.sectionOrder[1]; });
  change((value) => { value.navigation[0].url = '#unsupported'; });
});

test('javascript, data, protocol-relative, and disguised URL schemes are rejected', () => {
  for (const url of ['javascript:alert(1)', 'data:text/html,x', '//evil.example/image.webp', 'https://user:pass@example.com', 'https:\\evil.example', ' javaScript:alert(1)']) {
    const value = structuredClone(defaultPortfolio);
    value.projects[0].liveUrl = url;
    assert.throws(() => validatePortfolio(value), HttpError, url);
  }
  const value = structuredClone(defaultPortfolio);
  value.projects[0].image.srcSet = 'javascript:alert(1) 500w';
  assert.throws(() => validatePortfolio(value), HttpError);
});

test('unsafe media keys and filename paths are rejected or sanitized', () => {
  for (const key of ['../secret', 'uploads/../secret', '/upload.png', 'uploads//image.png', 'uploads/a?x=1', 'uploads/a#x', 'uploads/./a', 'uploads/%2e%2e/a']) assert.equal(validMediaKey(key), false, key);
  assert.equal(validMediaKey('uploads/hello-123.webp'), true);
  assert.equal(mediaUrl('assets/hero.webp'), '/media/assets/hero.webp');
  assert.equal(cleanFilename('C:\\secret\\photo\u0000.png'), 'photo.png');
});

test('uploads must match an allowed signature and declared MIME', () => {
  const webp = new TextEncoder().encode('RIFF0000WEBP0000');
  assert.equal(sniffMedia(webp, 'image/webp').extension, 'webp');
  assert.throws(() => sniffMedia(webp, 'image/png'), HttpError);
  assert.throws(() => sniffMedia(new TextEncoder().encode('<svg onload="alert(1)"/>'), 'image/svg+xml'), HttpError);
  assert.throws(() => sniffMedia(new TextEncoder().encode('<html/>'), 'image/png'), HttpError);
});

test('mutations require the real same-origin Origin and reject cross-site requests', () => {
  assert.doesNotThrow(() => assertSameOrigin(new Request('https://portfolio.example/api/content', { headers: { Origin: 'https://portfolio.example', 'Sec-Fetch-Site': 'same-origin' } })));
  for (const headers of [{}, { Origin: 'https://evil.example' }, { Origin: 'null' }, { Origin: 'https://portfolio.example', 'Sec-Fetch-Site': 'cross-site' }]) {
    assert.throws(() => assertSameOrigin(new Request('https://portfolio.example/api/content', { headers })), HttpError);
  }
});

test('bounded body reader rejects declared and chunked oversized payloads', async () => {
  await assert.rejects(readBody(new Request('https://test.example', { method: 'POST', headers: { 'Content-Length': '100' }, body: 'hello' }), 5), HttpError);
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(6)); controller.close(); } });
  await assert.rejects(readBody(new Request('https://test.example', { method: 'POST', body: stream, duplex: 'half' } as RequestInit), 5), HttpError);
  const read = await readBody(new Request('https://test.example', { method: 'POST', body: 'hello' }), 5);
  assert.equal(new TextDecoder().decode(read), 'hello');
});

test('JSON parser rejects unsupported content type and malformed UTF-8/JSON', async () => {
  await assert.rejects(readJson(new Request('https://test.example', { method: 'POST', body: '{}' })), HttpError);
  await assert.rejects(readJson(new Request('https://test.example', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' })), HttpError);
  await assert.rejects(readJson(new Request('https://test.example', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: new Uint8Array([255]) })), HttpError);
  assert.deepEqual(await readJson(new Request('https://test.example', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{"ok":true}' })), { ok: true });
});

