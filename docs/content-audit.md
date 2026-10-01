# Portfolio content audit

Audited on 1 October 2026 against the [live portfolio](https://portfolio-nine-snowy-55.vercel.app/) and [original Git repository](https://github.com/eliot-99/Portfolio). The source checkout, scrape and uncompressed input files remain in the ignored `.source/` and `.firecrawl/` folders. The live website and Git source agree on the content listed below.

## Migration inventory

- **6 software projects**, with descriptions, technologies, categories, status, repository links and available live links.
- **32 creative works:** 8 design posters, 8 branding pieces and 16 photographs, preserving original titles and categories.
- **4 certifications**, **3 achievements**, **3 education entries**, **3 interests**, **4 social profiles**, email and phone contacts.
- **2 portraits**, original SVG monogram and ICO favicon; all gallery photography and artwork migrated.
- Original downloadable resume preserved at `public/resume/saptarshi-ghosh-resume.pdf`. Updated, visually checked two-page resume at `public/assets/resume/saptarshi-ghosh-2026.pdf`.
- No testimonials, client list or published case-study documents were present in the original portfolio.
- The old website also contains a Simon-style "Elite Memory Test" game. Its text is a playful interaction, rather than a personal achievement.

## Applied user updates

- B.Tech CSE (AI/ML), University of Engineering and Management, Kolkata: **graduated in 2026, CGPA 8.50 / 10**.
- Nexaric: **Frontend Web Developer Intern, June-August 2026, three months**. Technologies: React.js, TypeScript, Node.js, Tailwind CSS and AI tools.
- Nexaric: **Associate Software Engineer, September 2026-present**.
- The user's "neaxric" / "nexaric" spelling variants are normalized to **Nexaric**. No unsupported job responsibilities, project outcomes or employment location have been added.

## Identity and contact

| Field | Original portfolio value |
| --- | --- |
| Name | Saptarshi Ghosh |
| Website email | saptarshi0777@gmail.com |
| Phone | +91 6296770327 |
| About location | Kolkata, West Bengal, India |
| Contact hometown | Hoomgarh, Paschim Medinipur, West Bengal, India |
| GitHub | https://github.com/eliot-99 |
| LinkedIn | https://www.linkedin.com/in/saptarshi-ghosh-rana/ |
| Instagram | https://www.instagram.com/unpopular_chobiwala/ |
| X / Twitter | https://x.com/PixelToPython |

The original biography describes an AI/ML student passionate about AI solutions and impactful design, a Vice Chancellor's Award recipient and Lead Designer for Ureckon. The new biography preserves these facts, updates graduation/employment, and removes the outdated student status.

## Software projects

| Project | Repository | Live destination |
| --- | --- | --- |
| PPE Detection for Construction Site Safety | https://github.com/eliot-99/PPE-Detection-for-Construction-Site-Safety-using-YoloV8 | No real demo in original |
| LinkedAI - AI Post Creation Platform | https://github.com/eliot-99/LinkedAI | No real demo in original |
| Plant Disease Detection Using CNN | https://github.com/eliot-99/Plant-Disease-Detection-Using-CNN- | No real demo in original |
| Interactive Portfolio Website | https://github.com/eliot-99/Portfolio | https://portfolio-nine-snowy-55.vercel.app/ |
| DataScope - AI-Powered Data Analysis Platform | https://github.com/eliot-99/DataScope | https://web-production-36f6.up.railway.app/ |
| AI Quiz Hub - Intelligent Quiz Platform | https://github.com/eliot-99/AI-Quiz-Hub | https://ai-quiz-hub-pi.vercel.app/ |

Project cover photographs originally loaded from Unsplash. Their exact source image URLs are retained in the ignored source HTML. Compressed local copies now avoid third-party image requests. GitHub and demo links above are migrated destinations, not a claim that every third-party service remains operational.

## Creative archive

| Title | Category | Original type |
| --- | --- | --- |
| URECKON Event Poster | Design | Event Design |
| T-Shirt Design Competition | Design | Competition Poster |
| Messi Poster | Design | Concept Poster |
| Trap Music Event | Branding | Music Poster |
| Ananya Chakraborty And The Bohemian Baul | Branding | Music Poster |
| Through The Lens | Design | Photography Event |
| Astronomy Quiz Competition | Design | Educational Event |
| Subho Bijoya Poster | Design | Social Event |
| Professor Sonku O Ufo | Design | Concept Poster |
| Social Justice Campaign | Design | Awareness Poster |
| Shawarma Design | Branding | Food Branding |
| Momo Design | Branding | Food Branding |
| Red Velvet Shake | Branding | Beverage Design |
| Cold Coffee | Branding | Beverage Design |
| BGMI | Branding | Gaming Event |
| Auto Expo | Branding | Auto Expo Event |
| Street Photography | Photography | Daily Life |
| A Smiling Baba | Photography | Portrait Photography |
| Bird Portrait | Photography | Wildlife Photography |
| Avian Beauty | Photography | Wildlife Photography |
| Maa er agomon | Photography | Street Photography |
| Lightning | Photography | Nature Photography |
| Bee | Photography | Macro Photography |
| Moon | Photography | Moon Photography |
| Spider | Photography | Macro Photography |
| Life struggle in mountains | Photography | Daily Life |
| Monkey | Photography | Wildlife |
| Offering of the Eyes of Maa | Photography | Daily Life |
| The Owl | Photography | Wildlife |
| The bird | Photography | Wildlife |
| The bird taking flight | Photography | Wildlife |
| The boat in Ganges | Photography | Landscape |

## Certifications and recognition

Certificates (all 2024, original certificate URLs retained in `src/data/portfolio.ts`):

- Machine Learning & Data Science, GeeksforGeeks, 40+ hours.
- Python for Data Science, AI & Development, IBM, 25+ hours.
- Cloud Computing, LinkedIn Learning, 15+ hours.
- Photoshop 2024 Essential Training, LinkedIn Learning, 12+ hours.

Achievements:

- Vice Chancellor's Award, UEM Kolkata, 2024: outstanding overall performance.
- 1st Position, Ray Imagine Poster Design Competition, 2024.
- Lead Designer, Ureckon Fest, UEM Kolkata, 2023-2024: creative direction and design team management.

Interests: photography, travelling and filmmaking. Original descriptions are preserved.

## Source contradictions and corrections

1. **CGPA:** old about section says 8.46, timeline and original resume say 8.59, and animated copy says 8.6. The user's final 8.50 supersedes all of these.
2. **Resume email:** the original PDF says `saptarshi0999@gmail.com`, while every live contact section says `saptarshi0777@gmail.com`. The updated resume uses the live portfolio email consistently. The original PDF is preserved unchanged.
3. **LinkedAI:** its title says "AI Post Creation Platform", but both the old website and PDF describe image annotation and model training. Both original title and description are preserved; no alternative product description is invented.
4. **Project claims:** original site reports 95% PPE accuracy and "20% Accident Reduction". The original PDF qualifies the 20% as a potential reduction in simulated environments. The updated resume keeps the simulation qualification. Original LinkedAI "50+ users" is qualified as initial testing in the updated resume. These are migrated source claims, not independently measured results.
5. **Counters:** the old animated hero says 3 projects, 2 certificates and 1 achievement despite 6/4/3 actual content entries. Counts should derive from the migrated arrays.
6. **Placeholder links:** `href="#"` live demos/achievement links are replaced with empty URLs. The actual old portfolio URL is used for its own project card.
7. **Portrait resolution:** the old hero portrait is only 280×280. The larger about portrait should be used for large layouts. Resolution was preserved without upscaling.

## Image compression

40 original image inputs total **61,363,434 bytes**. Full-size variants total **6,033,210 bytes WebP** (90.2% reduction) and **4,707,546 bytes AVIF** (92.3% reduction). Every image has a responsive 600px WebP variant. Some source photographs were already heavily compressed JPEGs; individual high-quality conversions can exceed their original bytes, while overall transfer size is dramatically smaller.

Portraits are capped at 1200px, design artwork at a 1600px maximum dimension, photographs at 1920px, and project covers at 1000px. Images retain their aspect ratio and transparent backgrounds where present. Uncompressed PNG/JPEG inputs are excluded from the public build and Git. `docs/asset-manifest.json` records all source paths, dimensions and compressed file sizes.

The updated resume is **two A4 pages, 10,448 bytes**, with clickable repository/certificate links and searchable text. Both final pages were rendered with Poppler and visually inspected for clipping, overlap and readability.
