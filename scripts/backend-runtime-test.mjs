import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { execFile, spawn } from 'node:child_process';
import { pbkdf2, randomBytes, randomUUID } from 'node:crypto';
import { readFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const project = dirname(dirname(fileURLToPath(import.meta.url)));
const output = join(tmpdir(), `portfolio-runtime-${randomUUID()}`);
const password = randomBytes(24).toString('base64url');
const salt = randomBytes(16);
const derived = await promisify(pbkdf2)(password, salt, 100_000, 32, 'sha256');
const passwordHash = `pbkdf2-sha256$100000$${salt.toString('base64')}$${derived.toString('base64')}`;
let runtime;
try {
  const built = await promisify(execFile)(process.execPath, [join(project, 'node_modules/wrangler/bin/wrangler.js'), 'pages', 'functions', 'build', '--outdir', output, '--compatibility-date', '2026-09-30', '--compatibility-flags=no_nodejs_compat', '--compatibility-flags=no_nodejs_compat_v2'], { cwd: project, windowsHide: true, timeout: 120_000 });
  if (!built.stdout.includes('Compiled Worker successfully')) throw new Error('Pages Functions compilation did not complete.');
  // The installed workerd release supports September 30; October 1 is still future UTC.
  runtime = new Miniflare(convertV4MiniflareOptions({ workers: [{ name: 'portfolio-test', scriptPath: join(output, 'index.js'), modules: true, compatibilityDate: '2026-09-30', compatibilityFlags: ['no_nodejs_compat', 'no_nodejs_compat_v2'], d1Databases: { PORTFOLIO_DB: 'test-local-content' }, r2Buckets: { PORTFOLIO_MEDIA: 'test-local-media' }, bindings: { ADMIN_PASSWORD_HASH: passwordHash } }], host: '127.0.0.1', port: 0 }));
  const db = await runtime.getD1Database('PORTFOLIO_DB');
  const schema = await readFile(join(project, 'migrations/0001_initial.sql'), 'utf8');
  const statements = schema.split(/;\s*(?=CREATE\s|$)/).filter((statement) => statement.trim());
  for (const statement of statements) await db.prepare(statement).run();
  const origin = (await runtime.ready).origin;
  process.stdout.write('Running compiled Pages Functions in workerd with isolated local D1 and R2.\n');
  const exitCode = await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, [join(project, 'scripts/backend-integration.mjs')], { env: { ...process.env, BACKEND_TEST_ORIGIN: origin }, stdio: ['pipe', 'inherit', 'inherit'], windowsHide: true });
    child.once('error', reject);
    child.once('exit', resolve);
    child.stdin.end(`${password}\n`);
  });
  process.exitCode = exitCode ?? 1;
} finally {
  if (runtime) await runtime.dispose();
  await unlink(join(output, 'index.js')).catch(() => {});
  await rmdir(output).catch(() => {});
}
