# Portfolio content service

Cloudflare Pages Functions use the `PORTFOLIO_DB` D1 binding and `PORTFOLIO_MEDIA` R2 binding. Apply `migrations/0001_initial.sql` before serving requests. Generate Cloudflare types with the repository's `cf:types` script. The only required secret is `ADMIN_PASSWORD_HASH`; generate it through `node scripts/backend-password.mjs`, supplying the password through protected stdin. Keep `.dev.vars`, hashes, and plaintext passwords out of Git.

## API

All JSON responses use `application/json`. Error responses are `{ "error": "Readable explanation" }`. JSON mutation requests must set `Content-Type: application/json`. Browser mutations require a same-origin `Origin` header, and authenticated mutations use the HttpOnly session cookie automatically.

| Endpoint | Input | Result |
| --- | --- | --- |
| GET `/api/content` | Optional `If-None-Match` | `{content, version, updatedAt}` or 304. Bundled content is returned at version 0 before the first save. |
| PUT `/api/content` | `{content: PortfolioData, version: number}` | Published envelope; 409 when another editor has saved first. |
| POST `/api/auth/login` | `{password}` | `{authenticated:true, expiresAt}` and a secure session cookie. |
| GET `/api/auth/session` | Cookie | `{authenticated:boolean, expiresAt?}`. |
| POST `/api/auth/logout` | Cookie | `{ok:true}`; server session revoked and cookie cleared. |
| GET `/api/history` | Cookie | `{items:[{version,savedAt}]}`; last 30 published versions. |
| GET `/api/history?version=N` | Cookie | `{content,version,savedAt}` for an old revision. |
| POST `/api/history` | `{restoreVersion,version}` + Cookie | Publishes a retained revision as a new version. |
| GET `/api/media` | Cookie, optional `?cursor=KEY` | `{items:[{key,url,name,type,size,uploadedAt}],cursor?}`. |
| POST `/api/media` | Cookie; multipart field `file` | One validated file; returns its media item with status 201. |
| DELETE `/api/media?key=KEY` | Cookie | `{ok:true}`. Files referenced by current content or retained history are protected. |
| GET/HEAD `/media/KEY` | Public | Streams R2 data with content type, ETag, and immutable caching. |

Sessions contain 256 bits of randomness, expire after eight hours, and are stored only as SHA-256 digests. Changing the password hash secret invalidates prior sessions. Sign-in is throttled atomically in D1 by hashed IP and global window. Content accepts no arbitrary HTML, JavaScript, or SVG upload. Strict schema validation bounds arrays, text, dimensions, URLs, and identifiers. JSON bodies are capped at 512 KB. Uploads are capped at 8 MB and checked against file signatures; image compression belongs in the client upload flow. HTTP cookies are allowed only on localhost for local development; production requires HTTPS.

R2 media is immutable: use a new URL when replacing an image. Public document reads are cached for up to 30 seconds at the edge; an admin session gets uncached reads. Each content save is an atomic compare-and-swap with a D1 trigger that records history. A successful build alone does not establish that remote bindings or migrations are present.

## Verification

Run the security unit suite with `npm run test:security`. It checks hostile URL/schema data, bounded bodies, signature mismatches, traversal, and CSRF. `npm run test:backend` compiles the actual Pages Functions and starts workerd with isolated local D1/R2 and a randomly generated test password. The password never leaves protected stdin. It then runs `scripts/backend-integration.mjs`, which accepts loopback origins only and exercises cookie authentication, stale publish rejection, history restore, upload retrieval, referenced deletion protection, logout revocation, and sign-in throttling. The test restores the starting content as a new local revision and disposes all isolated resources. No remote database, bucket, account, or user password is used.

Official API contracts: [Pages bindings](https://developers.cloudflare.com/pages/functions/bindings/), [D1 transactions](https://developers.cloudflare.com/d1/worker-api/d1-database/#batch), [R2 Workers API](https://developers.cloudflare.com/r2/api/workers/workers-api-reference/), [Web Crypto](https://developers.cloudflare.com/workers/runtime-apis/web-crypto/).

## Local development

`npm run dev` starts only Vite. Its `/api` proxy expects Pages Functions on port 8788, so use `npm run dev:full` for the local editor. That command applies the D1 migration to the local database before starting Wrangler Pages Dev; the Vite proxy rewrites the local `Origin` header at the trusted proxy boundary so CSRF checks continue to work across the two local ports.
