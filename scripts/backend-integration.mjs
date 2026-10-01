import assert from 'node:assert/strict';

const origin = process.env.BACKEND_TEST_ORIGIN ?? 'http://localhost:8788';
const url = new URL(origin);
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || !['http:', 'https:'].includes(url.protocol)) throw new Error('Backend integration tests only allow loopback origins with local D1/R2.');
let password = '';
for await (const chunk of process.stdin) password += chunk;
password = password.replace(/\r?\n$/, '');
if (!password) throw new Error('Supply the local test password through protected stdin.');

let cookie = '';
const request = async (path, options = {}) => {
  const headers = new Headers(options.headers);
  if (cookie) headers.set('Cookie', cookie);
  if (options.method && !['GET', 'HEAD'].includes(options.method)) headers.set('Origin', origin);
  return fetch(`${origin}${path}`, { ...options, headers });
};
const jsonRequest = (path, method, body, headers = {}) => request(path, { method, headers: { 'Content-Type': 'application/json', ...headers }, body: JSON.stringify(body) });
const expectStatus = async (response, status) => {
  assert.equal(response.status, status, `${status} expected; got ${response.status}: ${await response.clone().text()}`);
  return response;
};

const initial = await (await expectStatus(await request('/api/content'), 200)).json();
assert.equal((await (await request('/api/auth/session')).json()).authenticated, false);
await expectStatus(await jsonRequest('/api/content', 'PUT', initial), 401);
const csrf = await fetch(`${origin}/api/auth/login`, { method: 'POST', headers: { Origin: 'https://evil.example', 'Content-Type': 'application/json' }, body: JSON.stringify({ password }) });
await expectStatus(csrf, 403);
await expectStatus(await jsonRequest('/api/auth/login', 'POST', { password: 'wrong-password-test' }), 401);
const login = await expectStatus(await jsonRequest('/api/auth/login', 'POST', { password }), 200);
const setCookie = login.headers.get('Set-Cookie');
assert.match(setCookie, /HttpOnly/);
assert.match(setCookie, /SameSite=Strict/);
cookie = setCookie.split(';')[0];
assert.equal((await (await request('/api/auth/session')).json()).authenticated, true);

let latest = initial;
let upload;
try {
  const content = structuredClone(initial.content);
  content.site.edition = 'Local security integration verification';
  latest = await (await expectStatus(await jsonRequest('/api/content', 'PUT', { content, version: latest.version }), 200)).json();
  await expectStatus(await jsonRequest('/api/content', 'PUT', { content, version: initial.version }), 409);
  const invalid = structuredClone(content);
  invalid.projects[0].liveUrl = 'javascript:alert(1)';
  await expectStatus(await jsonRequest('/api/content', 'PUT', { content: invalid, version: latest.version }), 400);
  assert.equal((await (await request('/api/history')).json()).items[0].version, latest.version);
  const historyVersion = latest.version;
  latest = await (await expectStatus(await jsonRequest('/api/history', 'POST', { restoreVersion: historyVersion, version: latest.version }), 200)).json();

  // A valid tiny PNG exercises real R2 storage and streaming retrieval.
  const image = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aD2kAAAAASUVORK5CYII=', 'base64');
  const form = new FormData();
  form.set('file', new File([image], 'local-test.png', { type: 'image/png' }));
  upload = await (await expectStatus(await request('/api/media', { method: 'POST', body: form }), 201)).json();
  const media = await expectStatus(await request(upload.url), 200);
  assert.equal(media.headers.get('Content-Type'), 'image/png');
  assert.deepEqual(Buffer.from(await media.arrayBuffer()), image);
  await expectStatus(await request(upload.url, { headers: { 'If-None-Match': media.headers.get('ETag') } }), 304);
  const published = structuredClone(latest.content);
  published.person.portrait = { src: upload.url, width: 1, height: 1, alt: 'Local test asset' };
  latest = await (await expectStatus(await jsonRequest('/api/content', 'PUT', { content: published, version: latest.version }), 200)).json();
  await expectStatus(await request(`/api/media?key=${encodeURIComponent(upload.key)}`, { method: 'DELETE' }), 409);
  const badForm = new FormData();
  badForm.set('file', new File(['<svg/>'], 'bad.svg', { type: 'image/svg+xml' }));
  await expectStatus(await request('/api/media', { method: 'POST', body: badForm }), 415);
} finally {
  // Restore content without altering any remote resource; retain the local audit trail.
  latest = await (await expectStatus(await jsonRequest('/api/content', 'PUT', { content: initial.content, version: latest.version }), 200)).json();
}

const savedCookie = cookie;
await expectStatus(await request('/api/auth/logout', { method: 'POST' }), 200);
assert.equal((await (await request('/api/auth/session')).json()).authenticated, false);
cookie = savedCookie;
await expectStatus(await jsonRequest('/api/content', 'PUT', { content: initial.content, version: latest.version }), 401);
cookie = '';
let throttled = false;
for (let attempt = 0; attempt < 8; attempt++) {
  const response = await jsonRequest('/api/auth/login', 'POST', { password: 'wrong-password-test' });
  if (response.status === 429) { assert.ok(Number(response.headers.get('Retry-After')) > 0); throttled = true; break; }
  await expectStatus(response, 401);
}
assert.equal(throttled, true, 'D1 must throttle repeated login attempts');
process.stdout.write('Passed: authentication, CSRF, schema validation, optimistic publishing, history, real R2 retrieval, ETags, referenced deletion, logout revocation, and durable login throttling.\n');
