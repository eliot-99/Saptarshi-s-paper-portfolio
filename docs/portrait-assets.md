# Transparent printed portraits

## Current portraits regenerated from original references

The current portfolio uses these newer assets, regenerated from the user's original photographs rather than the previous generated portraits. Mode: built-in `image_gen` identity-preserving style-transfer edits with actual transparent alpha. `PASSPORT_PHOTO_2.png` supplied the current frontal, suited maker portrait; `About.png` supplied the striped-shirt about portrait. Only the maker portrait changed in the latest revision. The original reference files were not overwritten.

Saved PNG masters:

- `artwork/png/portrait-passport-maker.png` — 1254 × 1254; 2,292,666 bytes.
- `artwork/png/portrait-reference-about.png` — 1309 × 1201; 2,674,763 bytes.

Compressed production variants:

- `public/assets/portraits/portrait-passport-maker.webp`, `.avif`, and `-600.webp`
- `public/assets/portraits/portrait-reference-about.webp`, `.avif`, and `-600.webp`

Maker delivery sizes: 368,332 bytes WebP, 190,655 bytes AVIF, 83,758 bytes responsive WebP. About delivery sizes: 432,944 bytes WebP, 225,957 bytes AVIF, 87,966 bytes responsive WebP. All masters and full-size delivery variants retain transparent alpha; sampled background alpha is zero.

Run `node scripts/prepare-reference-portraits.mjs` to reproduce the current passport maker and reference about delivery variants from the workspace PNG masters. Add `maker` or `about` as an argument to process just one portrait. WebP quality 86, alpha quality 100; AVIF quality 62; responsive WebP quality 84 at 600 px. The script only compresses and resizes; no background flattening, drawn additions or subject changes occur after generation.

### Maker prompt

```text
Use case: identity-preserve / style-transfer
Asset type: unframed transparent Meet the Maker portrait for a red-and-black paper portfolio
Input image 1 is the exact portrait edit target, not an inspiration image. Transform only the photographic surface into sophisticated charcoal newspaper halftone, fine tactile paper fibres and very subtle distressed screen-print texture on the subject. Preserve the real man's exact identity, facial proportions, face, hairstyle, neutral frontal expression, direct gaze, clean recognizable eyes, head angle, body proportions, dark suit, white shirt collar, dark tie, lapels and all visible clothing details faithfully. The face must remain lifelike and accurate, with delicate grayscale tonal detail; do not alter the eyes, nose, lips, jaw or expression. Add only sparse muted brick-red ink flecks along the lower lapel and shoulder edges, never on the face. Keep the original square composition and the same visible upper-body crop at approximately 1024×1024 or higher resolution; no invented extra torso, arms, hands or body. Completely remove the original white background, replacing it with genuine transparent alpha extending cleanly to the natural subject silhouette. No opaque white or paper backdrop, no rectangle, no frame, no border, no text, no logo, no watermark, no cast shadow, no added objects. The subject will stand directly on the website's cream paper surface.
```

### About prompt

```text
Use case: identity-preserve / style-transfer
Asset type: unframed transparent printed about portrait for a red-and-black editorial portfolio
Input image 1 is the exact portrait edit target, not an inspiration image. Transform only its photographic surface treatment into sophisticated charcoal and black newsprint halftone, fine paper fibres and lightly distressed screen-print grain. Preserve the real man's exact face and identity, haircut, facial proportions, slight closed-mouth smile, eyes looking to his left, head angle, original upper-body crop, body proportions, striped collared shirt over dark undershirt, and every visible clothing detail including vertical pale stripes and buttons. Keep the face lifelike and accurately recognizable, with delicate grayscale tonal detail rather than stylized distortion. Sparse brick-red ink accents may appear only along a few clothing edges and print-grain flecks on the lower shirt; no red on face. Preserve the original near-square crop and composition at high resolution 1024px or higher, approximately 1.09 width-to-height ratio; keep the shoulder/torso ending at the same bottom crop, and do not invent extra torso, hands, arms or body. Remove any background entirely: genuinely transparent alpha all the way to the natural subject silhouette. No frame, no paper rectangle behind the person, no border, no text, no logos, no watermark, no cast shadow, no new objects. The subject must stand directly on a website's cream paper background.
```
