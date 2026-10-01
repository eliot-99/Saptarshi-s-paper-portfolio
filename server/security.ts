import type { BackendEnv } from './env';
import { HttpError } from './http';

export const PASSWORD_ITERATIONS = 100_000;
export const SESSION_SECONDS = 8 * 60 * 60;
const encoder = new TextEncoder();
const cookieName = (request: Request) => new URL(request.url).protocol === 'https:' ? '__Host-portfolio_session' : 'portfolio_session';

function fromBase64(value: string): Uint8Array<ArrayBuffer> {
  const bytes = atob(value);
  return Uint8Array.from(bytes, (character) => character.charCodeAt(0));
}

export function toBase64(bytes: Uint8Array): string {
  return btoa(String.fromCharCode(...bytes));
}

export async function hashToken(token: string): Promise<string> {
  const bytes = new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(token)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function passwordHash(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' }, key, 256);
  return `pbkdf2-sha256$${PASSWORD_ITERATIONS}$${toBase64(salt)}$${toBase64(new Uint8Array(derived))}`;
}

export async function verifyPassword(password: string, encoded: string): Promise<boolean> {
  const parts = encoded.split('$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2-sha256' || Number(parts[1]) !== PASSWORD_ITERATIONS) {
    throw new HttpError(503, 'Admin authentication has not been configured.');
  }
  let salt: Uint8Array<ArrayBuffer>;
  let expected: Uint8Array<ArrayBuffer>;
  try {
    salt = fromBase64(parts[2]);
    expected = fromBase64(parts[3]);
  } catch {
    throw new HttpError(503, 'Admin authentication has not been configured.');
  }
  if (salt.byteLength !== 16 || expected.byteLength !== 32) {
    throw new HttpError(503, 'Admin authentication has not been configured.');
  }
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const actual = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: PASSWORD_ITERATIONS, hash: 'SHA-256' }, key, 256);
  return crypto.subtle.timingSafeEqual(actual, expected);
}

export function sessionToken(request: Request): string | null {
  const name = cookieName(request);
  const cookies = request.headers.get('Cookie')?.split(';') ?? [];
  const token = cookies.map((cookie) => cookie.trim()).find((cookie) => cookie.startsWith(`${name}=`))?.slice(name.length + 1);
  return token && /^[A-Za-z0-9_-]{43}$/.test(token) ? token : null;
}

function cookie(request: Request, token: string, age: number): string {
  const url = new URL(request.url);
  const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.protocol !== 'https:' && !local) throw new HttpError(403, 'Admin access requires HTTPS.');
  return `${cookieName(request)}=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${age}${url.protocol === 'https:' ? '; Secure' : ''}`;
}

export async function currentSession(request: Request, env: BackendEnv): Promise<{ tokenHash: string; expiresAt: number } | null> {
  const token = sessionToken(request);
  if (!token) return null;
  const tokenHash = await hashToken(token);
  const row = await env.PORTFOLIO_DB.prepare('SELECT expires_at, credential_version FROM admin_sessions WHERE token_hash = ? AND expires_at > ?')
    .bind(tokenHash, Math.floor(Date.now() / 1000)).first<{ expires_at: number; credential_version: string }>();
  if (!row) return null;
  const credentialVersion = await hashToken(env.ADMIN_PASSWORD_HASH ?? '');
  if (!crypto.subtle.timingSafeEqual(encoder.encode(row.credential_version), encoder.encode(credentialVersion))) return null;
  return { tokenHash, expiresAt: row.expires_at };
}

export async function requireSession(request: Request, env: BackendEnv): Promise<{ tokenHash: string; expiresAt: number }> {
  const session = await currentSession(request, env);
  if (!session) throw new HttpError(401, 'Your session has expired. Sign in to continue.');
  return session;
}

export async function createSession(request: Request, env: BackendEnv): Promise<{ cookie: string; expiresAt: string }> {
  const token = toBase64(crypto.getRandomValues(new Uint8Array(32))).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/, '');
  const tokenHash = await hashToken(token);
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_SECONDS;
  const credentialVersion = await hashToken(env.ADMIN_PASSWORD_HASH ?? '');
  await env.PORTFOLIO_DB.batch([
    env.PORTFOLIO_DB.prepare('DELETE FROM admin_sessions WHERE expires_at <= ?').bind(Math.floor(Date.now() / 1000)),
    env.PORTFOLIO_DB.prepare('INSERT INTO admin_sessions (token_hash, expires_at, credential_version) VALUES (?, ?, ?)').bind(tokenHash, expiresAt, credentialVersion),
  ]);
  return { cookie: cookie(request, token, SESSION_SECONDS), expiresAt: new Date(expiresAt * 1000).toISOString() };
}

export function clearSessionCookie(request: Request): string {
  return cookie(request, '', 0);
}

/** Atomic durable throttles: 8 attempts per IP / 15 minutes, 60 globally. */
export async function consumeLoginAttempt(request: Request, env: BackendEnv): Promise<void> {
  const windowSeconds = 15 * 60;
  const now = Math.floor(Date.now() / 1000);
  const start = Math.floor(now / windowSeconds) * windowSeconds;
  const ip = request.headers.get('CF-Connecting-IP') ?? 'local';
  const ipHash = await hashToken(`login:${ip}`);
  const increment = (key: string) => env.PORTFOLIO_DB.prepare(`
    INSERT INTO login_attempts (scope, window_start, attempts) VALUES (?, ?, 1)
    ON CONFLICT(scope) DO UPDATE SET
      attempts = CASE WHEN login_attempts.window_start = excluded.window_start THEN login_attempts.attempts + 1 ELSE 1 END,
      window_start = excluded.window_start
    RETURNING attempts
  `).bind(key, start);
  const results = await env.PORTFOLIO_DB.batch<{ attempts: number }>([
    increment(ipHash), increment('global'),
    env.PORTFOLIO_DB.prepare('DELETE FROM login_attempts WHERE window_start < ?').bind(start - windowSeconds),
  ]);
  const counts = results.map((result) => result.results[0]?.attempts ?? Number.POSITIVE_INFINITY);
  if (counts[0] > 8 || counts[1] > 60) {
    throw new HttpError(429, 'Too many sign-in attempts. Please wait before trying again.', { 'Retry-After': String(start + windowSeconds - now) });
  }
}

