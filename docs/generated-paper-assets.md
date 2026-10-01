# Generated paper assets

Generated with the built-in imagegen tool on 1 October 2026. Original PNG files are retained in `artwork/png`; the website uses compressed alpha-preserving WebP counterparts.

| Asset | Saved PNG | Production file | Use |
| --- | --- | --- | --- |
| Red/black newsprint | `artwork/png/newsprint-red-black.png` | `public/assets/textures/newsprint-red-black.webp` | Low-opacity paper grain across the publication |
| Torn ink impression | `artwork/png/torn-ink-impression.png` | `public/assets/textures/torn-ink-impression.webp` | Organic red-and-black print accent behind unframed portraits |

Run `node scripts/prepare-paper-textures.mjs` to regenerate compressed textures from the saved PNGs. Portrait cutout prompts and compression details are in [portrait-assets.md](portrait-assets.md).

## Final prompt: newsprint

Use case: stylized-concept. Asset type: production PNG paper texture for a warm newspaper-inspired creative developer portfolio. Primary request: a seamless square sheet of lightly aged natural newsprint paper, with subtle black graphite fibres and extremely faint brick-red printer ink flecks. Color palette: warm light ivory #e8e4db, charcoal #24241e, brick red #a33524. Style: authentic flat scanned print material, delicate tactile paper grain, sophisticated antique publication stock. Composition: uniform low-contrast texture across the full square, quiet enough that small black website text remains very readable; no focal object or borders. Constraints: no words, no lettering, no symbols, no photography, no shadows, no gradients, no folds, no frame, no obvious repeating marks. Red and black details should be sparse, fine and subtle, around 3 percent coverage. Generate a real paper texture bitmap, not a website mockup.

## Final prompt: torn ink impression

Use case: stylized-concept. Asset type: transparent PNG editorial paper-and-ink texture to place behind an unframed monochrome portrait on a newspaper portfolio. Primary request: a loose abstract circular impression of brick-red screenprinted ink on torn newsprint, with very sparse charcoal black halftone scuffs and fine paper fibres. Composition: one broad imperfect open circular red ring with broken weathered edges, generous transparent center, subtle torn cream paper fragments at the lower edge; all elements fade irregularly into genuine transparent alpha, absolutely no rectangular background. Style: flat scanned riso print, tactile hand-torn paper, refined editorial collage, intentional empty space. Palette: brick red #a33524, charcoal #24241e, warm cream #e8e4db only. Red ink concentrated on the right and bottom of the circle, black tiny sparse marks along the left lower edge. Constraints: no text, no lettering, no people, no photography, no objects, no frame, no UI, no drop shadow, no gradients, no solid filled disc. This is a quiet organic paper texture accent beneath a real portrait, not a logo. Transparent outside and inside the ring.

