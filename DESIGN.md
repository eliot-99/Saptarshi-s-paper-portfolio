# The Saptarshi Gazette

Reference inspected: https://www.niccolomiranda.com/?ref=refs.gallery on 1 October 2026, alongside https://portfolio-nine-snowy-55.vercel.app/ and its source repository.

Observed: parchment background, black ink, sharp corners, hairline columns, huge custom Canopee lettering, Editorial New body type, a featured-work strip and a long newspaper composition. Automated branding extraction has low confidence and unreliable type-size readings; visible browser evidence guides the layout.

Original direction: a personal broadsheet with a compact publication header, navigation running along a ruled masthead, giant SAPTARSHI nameplate, asymmetric lead story and a surreal engraved computer with an eye. Ink-red stamps, monospaced folios, serif editorial subheads and condensed poster typography. Preserve Saptarshi's actual portraits, all six projects, 32 gallery pieces, certificates, achievements, interests and contact links.

## Tokens

- Paper #e8e4db, ink #24241e, accent #a33524. All corners square; buttons may use a deliberate oval outline.
- Barlow Condensed 900 for giant headlines; Bodoni Moda 500/italic for editorial headings; DM Sans 400/500 for readable body; IBM Plex Mono 400 for folios and labels. Self-hosted Latin WOFF2 with swap.
- Max page 1600px; fluid outer gutter 18–48px; ruled multi-column composition collapses at 900px and 600px. Typography uses clamp with mobile legibility.
- Thin ink rules and double section borders, sparse red annotation; no decorative metric claims.
- Native smooth scrolling and transform/opacity Framer Motion reveals; no blocking preloader. Reduced motion disables animation.
- Genuine PNG artwork kept as source; responsive WebP/AVIF used in production. Gallery lazy loaded with fixed dimensions and explicit expansion.

## Sections and interactions

Front page, about, ten compact icon-led project records, career/education ledger with Infosys internship first, categorized skills, filterable design/photo archive with accessible lightbox, certificates/recognition, and a stamped correspondence desk. Archive images begin in grayscale and reveal colour on hover or keyboard focus; the full-colour lightbox works on touch devices. Each publication's text, imagery, links, content order, palette and type selections are editable at /admin.

The narrow edition uses dedicated composition rules in `src/styles/responsive.css`: a separate surname line, compact hero, full-width project rows, horizontal date/index headers, a one-column toolbox, two-column poster archive, and large touch controls. Reviewed at 320, 390, 430, 768 and 1440px. The removed puzzle retains legacy content fields only for stored-document compatibility.

## Architecture

React + TypeScript + Vite + Tailwind CSS + Framer Motion. Feature sections separated from reusable UI and content hooks. Cloudflare Pages Functions, D1 versioned content/session records and R2 assets, secure server-side password hashing and same-origin cookie sessions. Admin is a separate lazy bundle.
