# Sehatlas

Bilingual (English/Arabic) marketing site and interactive MVP demo for Sehatlas — a geospatial platform mapping healthcare access against population vulnerability across Saudi Arabia's regions.

Full project brief: [docs/sonnet_website_build_prompt.md](docs/sonnet_website_build_prompt.md).

## Stack

Next.js 16 (App Router, TypeScript, Tailwind CSS v4), `next-intl` for i18n/RTL, Recharts for charts, a self-contained SVG choropleth for the `/mvp` map (no external map tile service or API key required).

## Development

```bash
npm install
npm run dev
```

Visit `http://localhost:3000` (redirects to `/en`; try `/ar` for Arabic/RTL).

## Placeholders to fill before launch

- **Working name** — `SITE_NAME` in [lib/site-config.ts](lib/site-config.ts). Currently `"Sehatlas"` per the brief; the project folder/domain use the spelling `sehhatlas.health` — confirm the final spelling and this is the only place to change it.
- **Founder bio** — `about.founder.bioPlaceholder` in [messages/en.json](messages/en.json) and [messages/ar.json](messages/ar.json).
- **Contact email** — `CONTACT_EMAIL_PLACEHOLDER` in [lib/site-config.ts](lib/site-config.ts).
- **Contact form delivery** — set the `CONTACT_FORM_ENDPOINT` environment variable (any webhook/form-relay URL) so submissions from `/contact` are forwarded; without it, submissions are only logged server-side. See [app/api/contact/route.ts](app/api/contact/route.ts).
- **Current sprint note** — [content/roadmap.json](content/roadmap.json), editable without touching UI code.
- **Pipeline module statuses** — [content/pipeline-status.json](content/pipeline-status.json) (shown on `/mvp`).

## Swapping in real Phase 1 pipeline output

The `/mvp` demo reads two static files at runtime from `public/data/`, fetched client-side (no rebuild needed to update them on a deployed static host):

- **`public/data/demo_regions.json`** — one record per region: `region_id`, `name_en`, `name_ar`, `access_30`, `access_60`, `socio_index`, `env_index`, `disease_index`, `coverage_ratio`. Vulnerability scores and quadrant classification are computed **client-side** from these raw fields (see [lib/mvp/compute.ts](lib/mvp/compute.ts)) so the classification-cut and component toggles keep working once real data replaces the synthetic values here. Values are currently synthetic and clearly labelled as such via the persistent demo banner.
- **`public/data/sau_regions.geojson`** — the 13 region boundary polygons, derived from the [geoBoundaries](https://www.geoboundaries.org) open ADM1 dataset (ODbL), reprojected and simplified for a lightweight bundle. Each feature carries `region_id` (ISO 3166-2:SA code, e.g. `SA-01`), `name_en`, `name_ar` — keep these keys if you swap in a different boundary file.

## Known limitations / notes for the founder

- The `/mvp` map renders the choropleth as inline SVG rather than an interactive WebGL basemap (MapLibre GL JS). MapLibre GL JS v6's internal tile-processing worker crashed with every publicly available vector basemap style tested in this build environment (both CARTO's dark-matter style and, intermittently, MapLibre's own demo style) — a library/environment interaction that didn't resolve within the build window. The SVG approach has no such dependency, needs no basemap tile service, and is fully interactive (hover, click, linked selection with the scatter plot and table). If a working MapLibre integration is wanted later, the swap is isolated to [components/mvp/mvp-map.tsx](components/mvp/mvp-map.tsx).
- Numerals in the Arabic locale are kept as Western digits (0–9) rather than Eastern Arabic-Indic numerals, matching common practice for data-heavy Saudi tech products and keeping table/CSV values consistent across locales.
- Lighthouse/full accessibility and performance audits were not run in this session due to time constraints; the build uses semantic HTML, `next/font`, logical CSS properties, and respects `prefers-reduced-motion`, but a manual pass is recommended before launch.

## Deployment

Static/SSR build, no external services required:

```bash
npm run build
npm start
```

Deploys cleanly to Vercel (recommended) or Netlify with zero configuration beyond the optional `CONTACT_FORM_ENDPOINT` env var.
