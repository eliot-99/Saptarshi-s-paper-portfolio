# The Saptarshi Gazette

A responsive newspaper-inspired portfolio for Saptarshi Ghosh, built with React, TypeScript, Vite, Tailwind CSS and Framer Motion. The public edition is prerendered for a fast first paint, with local fonts and responsive AVIF/WebP images. Cloudflare Pages Functions provide a private content editor backed by D1 and R2.

## Local development

Use Node.js 24 and npm. Install dependencies and build once before starting the full backend:

```sh
npm ci
npm run build
node scripts/setup-admin.mjs
```

The setup script prompts for an admin password without saving the plaintext. It writes the private hash to ignored `.dev.vars` and `.secrets/admin.json` files. Never commit either file or a password.

Run these commands in two terminals:

```sh
npm run dev:full
```

```sh
npm run dev
```

Vite serves the portfolio at `http://localhost:5173/` and the editor at `http://localhost:5173/admin`. Wrangler runs Pages Functions, local D1 and local R2 on port `8788`; Vite proxies `/api` and `/media` to it. `dev:full` applies the local database migration automatically. Vite alone can display the bundled portfolio, but the editor requires the backend.

## Content and structure

The initial content lives in `src/data/portfolio.ts`. The editor at `/admin` publishes text, projects, experience, navigation, section order, theme settings and uploaded media. Browser drafts and previews stay on the device; published content and revision history live in D1. Media uploaded through the editor lives in R2 and is served through `/media/`.

```text
src/
  admin/          Private editor and media library
  app/            Public application
  components/     Layout and reusable interface components
  data/           Initial portfolio content
  hooks/          Content loading
  sections/       Portfolio sections
  styles/         Design system and responsive layouts
  types/          Shared content types
functions/        Cloudflare Pages API and media routes
server/           Authentication, validation and storage logic
migrations/       D1 schema
public/           Optimized assets, fonts and static configuration
scripts/          Build, image preparation and verification utilities
tests/            Editor tests
docs/             Content audit, asset reports and font licenses
```

`npm run assets:optimize` prepares the editorial artwork and local fonts. Existing optimized images are checked in, so normal development and deployment do not require regenerating them. Generated portrait preparation uses `scripts/optimize-generated-portraits.mjs` and accepts a source directory through `GENERATED_PORTRAIT_DIR`.

## Verification

```sh
npm run typecheck
npm run typecheck:server
npm run verify:assets
npm run test:security
npm run build
```

`npm run test:backend` checks the actual Pages Functions against isolated local D1/R2 resources. See [the content-service documentation](server/README.md) for API contracts and authentication details.

## Cloudflare deployment

`wrangler.jsonc` declares the Pages project and the `PORTFOLIO_DB` D1 and `PORTFOLIO_MEDIA` R2 bindings. Authenticate Wrangler, use the intended Cloudflare account, and configure the corresponding resources before deploying:

```sh
npx wrangler login
npx wrangler d1 migrations apply saptarshi-paper-portfolio --remote
npx wrangler pages secret bulk .secrets/admin.json --project-name saptarshi-paper-portfolio
npm run deploy
```

The deploy script builds and uploads `dist/` to Cloudflare Pages. Database content is independent of application releases: changing the bundled defaults does not overwrite an existing published edition. Use the editor to publish content changes.

`scripts/cloudflare-assets.mjs` is an owner-only synchronization utility: it uploads `public/assets` to R2 and replaces the current D1 edition with the bundled content. Run it only when that replacement is intended. It requires the authenticated Wrangler OAuth configuration and the correct `CLOUDFLARE_ACCOUNT_ID`; `--metadata-only` skips file uploads but still updates the published content and asset metadata.

Keep temporary render output, build artifacts, local storage and credentials out of Git. Font license files are retained in `docs/licenses/`.
