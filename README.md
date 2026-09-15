# ULTD LLC — Texas Real Estate Brokerage

Ultra-premium, cinematic single-page marketing site for **ULTD LLC**, a Texas luxury real-estate brokerage led by Designated Broker **Pat Patton** (TREC #0594267). Bespoke residential & commercial representation across Austin, the Hill Country, Dallas–Fort Worth, Houston, and San Antonio.

## Features

- **Scroll-scrubbed cinematic hero** — a 150-frame video rendered on `<canvas>` and scrubbed by GSAP `ScrollTrigger` while pinned
- **Luxury property portfolio** — filterable estate grid (Single Family / Estate / Waterfront / Farm & Ranch / Modern) with a horizontal pinned carousel, detail dossiers, and an "off-market" inquiry flow
- **Executive dossiers** — TREC credentials, specialties, and LinkedIn for the leadership team, opened as modal views
- **Spatial Texas brokerage hub** — interactive SVG map of regional markets with glowing node matrix, hover stats, and corridor volume
- **Services explainer** — expandable advisory accordions plus the affiliated Europa Financing LLC (NMLS #607611) mortgage unit
- **Brand story, analytics, and showcase** — animated quote/stat sections driven by Motion and GSAP
- **Compliance-ready** — TREC disclosures, IABS (TX-2501), Terms of Use, and Privacy Policy in modal views; Fair Housing & fee-negotiability notices
- **Fully responsive** — desktop sidebar dot-navigation and a mobile top nav; dark obsidian + champagne-gold theme throughout
- **No backend required** — all content is static data in `src/data.ts`; the contact form validates client-side and composes a deliverable summary (no API key needed)

## Stack

- Vite + React 19 + TypeScript
- Tailwind CSS 4 (`@tailwindcss/vite`)
- Motion (Framer Motion) + GSAP scroll animations
- Interactive SVG + canvas spatial map of Texas markets
- Lenis smooth scrolling + custom scroll-stack carousel

## Quickstart

Prerequisites: Node.js 18+ (tested on Node 20/22).

```bash
npm install
npm run dev        # Vite dev server on :3000 (--host=0.0.0.0)
```

Production build:

```bash
npm run build      # outputs to dist/
npm run preview    # serves the production build
```

## Available scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Type-check with `tsc --noEmit` (no separate ESLint config) |
| `npm run clean` | Remove the `dist/` output directory |

## Environment variables

The app is fully static and runs without any secrets. The variables below are optional and only relevant if you add a backend or AI integration later.

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `GEMINI_API_KEY` | No | — | Reserved for future Gemini AI API calls (not used by the static site) |
| `APP_URL` | No | — | Reserved for the deployed site URL (self-referential links / API endpoints) |

Copy `.env.example` to `.env` if you need these locally. Never commit `.env` — it is git-ignored.

> Note: `npm run lint` runs `tsc --noEmit` only. There is no ESLint configuration in this repo.

## Editing content

All business content lives in `src/data.ts` (properties, services, executives, value pillars, markets). Adding a listing, service, or team member requires editing that file — no component changes needed.

## Project structure

```
src/
  App.tsx              — SPA shell: animated page switching, modals, Lenis + GSAP wiring
  data.ts              — ALL business content (properties, services, executives, markets)
  types.ts             — TypeScript interfaces and the ActivePage union
  main.tsx             — React 19 entry
  index.css            — Tailwind, @theme tokens, font and dark-theme overrides
  components/          — Navbar, Hero, Narrative, Analytics, Services, PropertiesHub,
                         Showcase, MapSection, ContactSection, LeadershipView,
                         DisclosuresView, TermsView, PrivacyView, DotNavigation
```

Legal assets (TREC Consumer Protection Notice, IABS TX-2501) are linked from the official TREC site and reproduced in the compliance views.