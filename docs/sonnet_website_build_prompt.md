# Build Prompt for Claude Sonnet — Company Website + MVP Demo Page

Copy everything below the line into a new conversation with Claude Sonnet. Replace the bracketed placeholders first. Where the prompt says "working name," substitute the final name once you've confirmed it at a registrar and SAIP.

---

## Your role

You are a senior full-stack engineer and product designer building the public website for an early-stage Saudi health-technology venture. You will produce a complete, deployable, bilingual (English/Arabic, LTR/RTL) website with a company-facing marketing site and a separate interactive MVP demonstration page. Read this entire brief before writing any code. The brief contains the full project context, a structural analysis of a reference website you are to model the layout on, hard content rules you must not break, and the exact page specifications.

Working name for the venture: **[Sehatlas]** — treat this as a placeholder and make it a single constant so it can be swapped globally. Founder: **[Hamad — name as you want it displayed]**, sixth-year medical student at King Saud bin Abdulaziz University for Health Sciences, Riyadh. Current date: September 2026.

---

## Part 1 — The project you are building a website for

### The problem

Saudi Arabia publishes how many hospitals and health centres exist in each of its 13 administrative regions — 516 hospitals and 5,779 primary healthcare centres per the MOH Statistical Yearbook 2024, against a 2022 census population of 32,175,224. But a facility count divided by an administrative boundary answers none of the questions a planner faces. It does not say how far anyone actually travels to reach care, whether the nearest facility is already saturated by everyone else competing for it, or whether the populations facing the longest journeys are the ones least able to make them. A wealthy household drives ninety minutes to a hospital without difficulty; a poor household experiences the same ninety minutes as a barrier that delays treatment until it becomes an emergency. On every existing measure, those two places look identical. No published tool currently distinguishes them anywhere in the Kingdom, and no small-area socioeconomic vulnerability index exists for Saudi Arabia at all.

### What the platform does

It is a geospatial population-health analytics platform built on open data. For every geographic unit in Saudi Arabia it computes two independent numbers and plots them against each other.

**Axis 1 — Spatial access to healthcare.** A two-step floating catchment area (2SFCA) score: not facility counts, but how many facilities a population can reach within 30 or 60 minutes of travel, discounted by how many other people compete for the same facilities. Inputs: WorldPop 100m gridded population, OpenStreetMap facility locations and road network, MOH facility statistics for validation.

**Axis 2 — Vulnerability.** A constructed index combining three components: (a) census socioeconomic data — education, housing, income; (b) satellite environmental exposure — PM2.5 air pollution, heat, and greenery (NDVI); (c) chronic disease burden — principally diabetes and hypertension from national surveys. The components are standardised and combined by principal component analysis with published loadings. The reasoning: these compound one another. A community that is poor, heat-exposed, and already managing chronic illness carries far more health need than one that is merely distant, because chronic conditions demand sustained nearby care and distance turns that management into emergency presentation.

**The quadrant classification.** Every unit is plotted on both axes, splitting the map into four groups. Good access: fine. Remote but well-off: lower priority, residents can absorb the distance. The target group is **high vulnerability + low access** — communities both far from care and least equipped to cope with being far from care. The two numbers are deliberately kept separate rather than merged into one score, because the quadrant tells a planner not just where the problem is but which problem they are looking at, and those need different interventions.

**Supporting features.** Before anything runs, the system validates its OpenStreetMap facility layer against official MOH figures region by region, producing a coverage ratio that shows where the map is reliable. Because chronic disease sits inside the vulnerability score it cannot double as a test of that score, so validation is done by leave-one-component-out sensitivity analysis, expert face-validity review by regional public health practitioners, and — in a later phase — testing against measured clinical outcomes such as emergency department utilisation and avoidable admissions. Outputs: choropleth maps, a labelled scatter plot, a ranked priority table, bilingual. Everything is built from freely available data so anyone can check or reproduce it. A later stage adds location-allocation modelling recommending where new clinics would relieve the most unmet need.

**Two tiers.** The platform is structured as two tiers with different audiences and different risk profiles, kept deliberately separate:

- *Tier 1 — Planning tier.* Planner- and researcher-facing. Static open data. Buildable now. Complete in itself. This is Phase 1.
- *Tier 2 — Patient tier.* Patient-facing: a map showing nearby emergency departments and how busy each currently is, so a patient isn't forced to default to the closest ED when a quieter one is reachable, plus a short triage questionnaire feeding an estimated wait time. Held as Phase 3 because it requires live occupancy feeds from hospitals, regulatory clearance as clinical decision support (SFDA), and emergency physician oversight — none of which currently exist. Its safety rules are fixed: anyone reporting chest pain, stroke symptoms, or other red flags is instructed to call 997 and attend the nearest facility, with all routing suppressed. Realistic entry point is a single-cluster pilot, not a national launch.

### Phasing

- **Phase 1** — open data only; facility validation, both axes, quadrant classification, internal validation, manuscript. No permissions beyond an IRB exemption for secondary analysis of public data.
- **Phase 2** — institutional data via KAIMRC IRB (MNGHA BESTCare records, Saudi Biobank); siting optimiser; external clinical outcome validation.
- **Phase 3** — national data linkage (NPHIES, Sehhaty, Weqaya) through institutional partnership; Tier 2 patient-facing ED routing.

### Positioning against incumbents

Lean Business Services — a PIF-owned company that operates Saudi Arabia's national digital health backbone (Sehhaty, Seha, Anat, NPHIES) and a population-health analytics platform called Yamamah — already does population health management on integrated national data. This venture does **not** compete with that on data scale and must never be positioned as doing so. The differentiation is structural: this platform is open, academically published, externally auditable, and replicable by any researcher, which a proprietary platform operating on protected national data cannot be by design. Position as **complementary to national infrastructure**, never as an alternative to it.

### Known limitations (these appear on the site — see content rules)

- OSM facility coverage is uneven and weakest in rural areas; the validation module quantifies this.
- Chronic disease data exists only at 13-region resolution with wide confidence intervals; governorate-level small-area estimation is the priority methodological upgrade.
- Thirteen regions is too few units for stable spatial modelling; governorate-level (~139 units) is strongly preferred, contingent on obtaining boundary polygons.
- Phase 1 has no external validation; this is stated, not hidden.
- Income is not a census variable in Saudi Arabia and may need to be proxied.

---

## Part 2 — Reference site: lean.sa/en

The founder wants the site modelled on the **structure and layout pattern** of Lean Business Services' website at https://lean.sa/en. Here is what that site does, section by section, so you can mirror the pattern.

**Global chrome.** Dark theme (their theme colour is a very dark navy-purple, `#0b081c`). Sticky top nav: logo left; links Home / About / Products & Solutions / Research & Articles / Media Center; a language toggle ("العربية"); a prominent "Get in touch" CTA button on the right. Footer in four columns — Overview (site links), Reach us (contact / business contact / partner / careers), Privacy & terms, Newsletter signup — followed by logo, social icons, copyright, and a parent-organisation badge (theirs is PIF).

**Homepage sections, in order:**

1. Full-width hero with a large abstract visual and a headline positioning them as "the digital enabler for the healthcare sector."
2. "Trusted by leading organizations" — horizontally scrolling logo strip of ~30 clients.
3. "What sets Lean apart?" — four value cards, each with heading, one-paragraph description, and an image: Data integration / Artificial intelligence / Digital solutions / Health & Life Sciences.
4. "Innovative products redefining healthcare" — three animated counters (+0M operations served individuals / practitioners / facilities) with a link to products.
5. "The health eco-system" — product carousel, one card per product (Sehhaty / Seha / Anat), each with logo, name, description, "Read more," and a lifestyle photo.
6. "An impactful journey towards a healthier living" — three lifecycle cards: Childhood / Adulthood / Elderhood, each with image, heading, subheading, paragraph.
7. "Awards & Recognitions" — carousel of award cards with image, title, description.
8. Embedded YouTube video section.
9. Closing CTA band: "Ready to elevate your business with Lean?" + "Let's meet!" button.

**What to borrow:** the dark, editorial, confident visual register; the section rhythm (hero → proof → values → products → narrative → recognition → CTA); the card-based layout; the bilingual toggle with full RTL; the four-column footer; the Next.js-style image optimisation and smooth scroll.

**What you must NOT do:** do not copy any Lean brand asset, logo, colour palette verbatim, client logo, product logo, photograph, copy text, or award. Do not reproduce their hero visual. Do not use their exact hex colours. Build an original visual identity that follows the same *structural pattern*. Lean is a large PIF-owned company with thirty institutional clients and a shelf of awards; this venture is a pre-launch student project with none of that. Every section that Lean fills with proof must be either honestly adapted or removed — see Part 4.

---

## Part 3 — Site map and page specifications

Build these routes, each fully bilingual with RTL layout for Arabic:

```
/                     Home
/about                About — mission, the problem, the founder, institutional context
/platform             The platform — the two axes, the quadrant, the tiers, methodology
/mvp                  MVP demo — interactive (see Part 5)
/roadmap              Phases 1–3, what's done, what's in progress, what depends on permissions
/research             Methodology notes, data sources, limitations, future manuscript placeholder
/contact              Contact form + institutional collaboration enquiry
/privacy              Privacy policy placeholder
```

### Home (`/`)

Mirror Lean's section order, adapted:

1. **Hero.** Headline options (pick one, make it a constant): "Where care is far, and who can least afford the distance." / "Mapping healthcare access and vulnerability across Saudi Arabia." Subhead: one sentence on the two-axis approach. Two CTAs: "See the MVP" → `/mvp`, "How it works" → `/platform`. Hero visual: an original, abstract, animated SVG or canvas rendering of Saudi Arabia's outline with a stylised grid or hex tessellation, with a few cells highlighted — no photograph, no stock imagery. Keep it lightweight.
2. **Built on open data** — replaces Lean's client logo strip. A scrolling strip of *data source* names, not client logos: WorldPop, OpenStreetMap, GHSL, VIIRS, ACAG PM2.5, ERA5, MODIS, GASTAT, MOH Statistical Yearbook, HDX. Text wordmarks only; do not fabricate logos for these organisations and do not imply endorsement. Caption: "All Phase 1 inputs are publicly available. No permissions required."
3. **What sets this apart** — four value cards: *Access, not counts* / *A vulnerability index that doesn't exist yet* / *Two axes, not one score* / *Open and reproducible by design*. Each with heading, one paragraph drawn from Part 1, and an original abstract illustration.
4. **By the numbers** — replaces Lean's operations counters. Use only real, verifiable numbers: 13 regions · 516 hospitals · 5,779 PHC centres · 32.2M population · 2 axes · 4 quadrants. Animated counters are fine. Do not invent user counts, operations counts, or any metric the project hasn't produced.
5. **The platform** — product-carousel pattern with three cards: *Planning tier (Phase 1)* / *Siting optimiser (Phase 2)* / *Patient tier (Phase 3)*. Each card carries a status badge: "In development," "Planned," "Permission-dependent." Link each to `/platform`.
6. **The journey** — replaces Lean's Childhood/Adulthood/Elderhood. Three cards following a planner's workflow: *Measure* (compute both axes) / *Classify* (the quadrant) / *Act* (siting and outreach). Or, alternatively, three cards following the phases. Pick one and be consistent.
7. **Status and honesty** — replaces Lean's awards carousel entirely. A plain section titled "Where we are" with a short list: what has been built, what is running, what is pending. If the founder later wins competitions or gets recognitions, an awards section can be added; **do not create one now with placeholder awards.**
8. **Positioning band** — one paragraph, visually quiet: "This platform is complementary to national health infrastructure such as the Sehhaty and NPHIES ecosystem. It does not replicate national data platforms; it provides an open, auditable analytical layer built on public data."
9. **Closing CTA** — "Working on health access in Saudi Arabia? Let's talk." → `/contact`.

### About (`/about`)

Mission statement. The full problem statement from Part 1 in its long form. Founder section with name, role, institution, and a short bio — the founder will supply the bio; leave a clearly marked placeholder. Institutional context: state that the founder is a student at KSAU-HS with research access through MNGHA; **do not state or imply that either institution endorses, funds, or owns the platform.** Use the phrasing "developed independently by a student researcher at…" or similar.

### Platform (`/platform`)

Long-form explainer. Sections: The two axes (with a static diagram of each) / The quadrant (with a static 2×2 diagram, labelled per Part 1) / Why two axes and not one score / Validation approach / Two tiers / Data sources table (source · what it provides · resolution · licence). Include the limitations from Part 1 as a visible section, not a footnote.

### Roadmap (`/roadmap`)

Vertical timeline, three phases. Each phase lists deliverables and dependencies. Phase 2 and 3 items are explicitly marked as contingent on IRB approval / institutional partnership / regulatory assessment. Include a "current sprint" block that the founder can edit easily — make it a single JSON or MDX file.

### Research (`/research`)

Methodology notes written for an academic reader: 2SFCA definition, PCA-based index construction, tercile cut-points, multi-scale sensitivity, MAUP and ecological fallacy caveats. A "Publications" section with a single placeholder: "Manuscript in preparation." Do not fabricate citations, DOIs, or preprints.

### Contact (`/contact`)

Form: name, organisation, email, message, and a select: General enquiry / Research collaboration / Institutional partnership / Press. Wire it to a serverless function or a form service the founder can configure via environment variables. Show a success state. No fake phone numbers or office addresses — use an email placeholder the founder will fill.

---

## Part 4 — Content rules (non-negotiable)

These exist because the founder's credibility with academic, clinical, and government audiences depends on the site never overstating what exists.

1. **No fabricated proof.** No invented client logos, partner logos, testimonials, user counts, awards, press quotes, team members, advisors, or funding. If a section on the reference site relies on proof this venture doesn't have, adapt it (as specified in Part 3) or remove it.
2. **No institutional endorsement claims.** KSAU-HS, MNGHA, KAIMRC, MOH, Lean, SDAIA, and any other body may be mentioned only as data sources, affiliations, or ecosystem context. Never as partners, clients, or backers.
3. **Status badges are mandatory** on every product or feature card: "Live" (only if it actually runs), "In development," "Planned," or "Permission-dependent."
4. **Limitations are visible content**, not buried. The Platform and Research pages must each carry a limitations section.
5. **The Tier 2 patient tier must always be shown with its safety constraints** — the 997 red-flag override, wait times as ranges, no routing for time-critical presentations. Never describe it as available.
6. **Demo data must be labelled.** Wherever synthetic or illustrative data appears (see Part 5), a persistent, unmissable banner must say so.
7. **No medical advice anywhere on the site.** The site describes a planning tool. It does not tell anyone where to seek care.
8. **The "complementary to national infrastructure" positioning appears on the home page and the About page.** Never use language that frames the venture as competing with or replacing national platforms.

---

## Part 5 — The MVP demo page (`/mvp`)

This is the page that shows what the platform actually does. It must work with **no backend and no live data**, running entirely client-side on a bundled dataset, so it can be deployed on a static host today.

### Persistent banner

A fixed, high-contrast banner at the top of the page: **"Demonstration using illustrative data. Values shown do not represent real measurements. Phase 1 pipeline in development."** It must not be dismissible.

### Layout

Two-panel responsive layout. Left (or top on mobile): interactive map. Right (or bottom): the quadrant scatter plot and a details panel. Below both: a ranked table.

### The map

- Render Saudi Arabia's 13 administrative regions as GeoJSON polygons. Use a public admin-1 boundary file for Saudi Arabia (HDX/OCHA COD-AB or GADM level 1). If bundling the real geometry is impractical, use a simplified version; **do not hand-draw or invent boundaries.**
- Use MapLibre GL JS with a free vector tile style, or Leaflet with a free raster basemap — no paid API keys required. Dark basemap to match the site theme.
- Choropleth toggle with three modes: *Access score* / *Vulnerability score* / *Quadrant class*. The quadrant mode colours each region with one of four distinct, colourblind-safe colours; the priority quadrant (high vulnerability + low access) must be the most visually prominent.
- Hover: tooltip with region name (EN/AR), both scores, and quadrant label. Click: selects the region, highlights its dot on the scatter, and populates the details panel.
- Include a layer-control checkbox for each vulnerability component (socioeconomic / environmental / disease) that, when unchecked, recomputes the vulnerability score from the remaining components client-side and re-renders. This demonstrates the leave-one-component-out sensitivity analysis live.

### The scatter plot

- X axis: access score. Y axis: vulnerability score. One dot per region, labelled.
- Tercile lines drawn on both axes dividing the plot into the four quadrants, each quadrant lightly shaded and labelled: *Priority: low access, high vulnerability* / *Served but vulnerable* / *Remote but resourced* / *No identified gap*.
- Toggle: tercile cut vs median cut. Switching must re-draw the lines and re-classify the regions.
- Toggle: 30-minute vs 60-minute catchment. Switching swaps the access score column.
- Hover and click linked to the map.

### The details panel

For the selected region: name (EN/AR), quadrant class with explanation in plain language, both raw scores, a small horizontal bar chart of the vulnerability component contributions, a "what this means for a planner" sentence generated from a template per quadrant, and the region's facility-coverage ratio from the validation step.

### The ranked table

All 13 regions sorted by quadrant priority then by vulnerability. Columns: rank, region, access (30m), access (60m), vulnerability, quadrant, facility coverage ratio. Sortable. Exportable as CSV.

### The demo dataset

Ship a single JSON file, `demo_regions.json`, with one record per region containing: region name EN, region name AR, ISO/GASTAT code, access_30, access_60, socio_index, env_index, disease_index, coverage_ratio. **Generate plausible but clearly synthetic values** — not real. Make the priority quadrant contain three or four regions so the demo is legible. Keep the JSON schema documented in a README so the founder can drop in real outputs from the Phase 1 pipeline without touching the UI code. Compute the vulnerability score and quadrant class client-side from the components, never pre-baked, so the toggles work.

### Pipeline status panel

A collapsible panel titled "Phase 1 pipeline status" listing the modules (data ingestion / facility validation / access engine / vulnerability engine / environmental layer / disease layer / quadrant classifier / validation / visualisation) each with a status chip. Drive this from a small JSON file the founder edits. Default all to "In development" except visualisation, which can be "Prototype."

---

## Part 6 — Design direction

- **Register:** confident, editorial, institutional. The audience is MOH planners, academic reviewers, and health-tech investors. Not playful, not consumer.
- **Theme:** dark by default with a light mode toggle. Choose an original palette: a very dark base, one restrained accent for CTAs, and a separate four-colour categorical set for the quadrants that is colourblind-safe and reads on dark. Do not use Lean's colours.
- **Typography:** a strong Arabic typeface with proper Latin companion — use IBM Plex Sans Arabic or Noto Sans Arabic paired with the matching Latin. Ensure Arabic renders with correct shaping and that numerals follow locale.
- **Motion:** subtle. Section fade-ins on scroll, counter animations, map transitions. Nothing that delays content.
- **Imagery:** no stock photography. Abstract, data-driven visuals only — grids, hex tessellations, choropleth fragments, contour-like forms. All original, generated in code or SVG.
- **Accessibility:** WCAG AA contrast, keyboard navigation for map and scatter, ARIA labels, `prefers-reduced-motion` respected.

---

## Part 7 — Technical stack and delivery

- **Framework:** Next.js 15 (App Router), TypeScript, Tailwind CSS.
- **i18n:** `next-intl` or equivalent with `/en` and `/ar` route prefixes, `dir="rtl"` on Arabic, and logical CSS properties throughout so layouts mirror correctly. All copy in locale JSON files — never hard-coded strings.
- **Map:** MapLibre GL JS (preferred) or Leaflet. GeoJSON bundled locally.
- **Charts:** D3 or Recharts for the scatter and bar charts.
- **Content:** MDX or JSON for editable content (roadmap, status, pipeline). No CMS dependency.
- **Forms:** serverless route handler reading an env var for the destination, or a drop-in form service.
- **Hosting target:** Vercel or Netlify static/SSR. Must build with `npm run build` with no external services required.
- **No paid APIs.** Everything must run with zero API keys for the demo.
- **Repo structure:** conventional Next.js layout; `/content` for editable JSON/MDX; `/public/data` for `demo_regions.json` and GeoJSON; a `README.md` explaining how to swap the working name, edit content, replace demo data with real pipeline output, and configure the contact form.

### Build order

1. Scaffold, i18n, theme, layout shell, nav, footer.
2. Home page with all sections and placeholder copy from Part 1.
3. `/mvp` page — this is the priority deliverable. Get the map, scatter, toggles, and table working end to end on the synthetic dataset.
4. Platform, About, Roadmap, Research, Contact.
5. Arabic translation pass — do not machine-dump; write natural Arabic for a Saudi professional audience. Where you are unsure of terminology (2SFCA, PCA, choropleth), give the English term in parentheses on first use.
6. Accessibility and performance pass. Lighthouse ≥ 90 on all four categories.
7. README.

### What to hand back

The full repository, a screenshot or short description of each page, the README, and a list of every placeholder the founder must fill (bio, email, final name, real data). If any part of this brief is ambiguous, state your assumption in a comment and proceed — do not stop to ask unless the ambiguity would change the architecture.

---

## Part 8 — One-paragraph summary for your own reference

You are building the bilingual public website and an interactive client-side MVP demo for an early-stage Saudi health-tech venture that maps healthcare access against population vulnerability across Saudi Arabia's regions using open data, classifies each region into a four-quadrant priority framework to guide clinic siting and outreach, and defers a patient-facing emergency-department routing tier to a permission-dependent later phase with hard safety constraints. Model the site's structure on lean.sa/en without copying its assets or colours, replace every proof section Lean has with honest equivalents or remove it, label all demo data as illustrative, never claim institutional endorsement, and position the venture as complementary to national health platforms rather than competing with them.
