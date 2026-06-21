# Creator Link Up — Premium 3D Influencer Marketing Agency

An award-winning, ultra-premium 3D website for **Creator Link Up**, an influencer
marketing agency connecting brands with top creators across **India & the UK**.
Built as a luxury-tech / creative-agency experience with cinematic animations,
smooth scrolling, and a futuristic dark aesthetic.

## Project Overview
- **Name**: Creator Link Up
- **Goal**: Position Creator Link Up as a world-class **worldwide** influencer marketing
  agency and convert visitors into brand clients and creator applicants.
- **Contact**: Email `support@creatorlinkup.in` · Discord `https://discord.gg/eKaGpD6r8Z`
- **Featured Creators**: SenpaiSpider (2.51M), Psd1 (1.09M), Stevee (244K), Fynox (164K),
  Triggered Boy (135K), Its Water (29.8K) — real profile images included.
- **Aesthetic**: Dark theme · purple/blue neon · glassmorphism · animated gradients ·
  Three.js 3D · cinematic GSAP scroll choreography.

## ✨ Completed Features
- **Cinematic preloader** with animated ring, logo and progress bar.
- **Traveling 3D network globe** (Three.js) — a sphere of connected creator/brand nodes
  that smoothly travels, rotates and changes scale/position through every section as you
  scroll (driven by a GSAP ScrollTrigger timeline + Lenis smooth scroll).
- **Animated particle background** with mouse-follow parallax (Three.js Points).
- **Hero** with staggered reveal, gradient headline and dual CTAs
  ("Start Your Campaign", "Join As Creator").
- **Animated statistics** with scroll-triggered count-up (creators, campaigns, reach, brands).
- **Services** — 10 interactive 3D-tilt glass cards with neon hover glow and reveal animations.
- **Featured Creators** — filterable showcase (All / Gaming / GTA / IRL / Lifestyle) with
  hover zoom and premium gradient portrait cards.
- **Voice Testimonials** — real, playable AI-generated voice reviews with animated sound-wave
  visualization (only one plays at a time).
- **Brand Testimonials** — auto-scrolling marquee carousel of brand results (pauses on hover).
- **Campaign Process** — animated vertical timeline with scroll-linked progress line
  (Discovery → Strategy → Creator Selection → Campaign Launch → Reporting).
- **Creator Network** — interactive, **drag-to-spin** 3D worldwide globe (12+ markets,
  6 continents) with a dotted globe surface, lat/long grid, glowing atmosphere, starfield,
  pulsing/rippling city pins, hover city labels, and dense animated connection arcs with
  traveling light pulses. Auto-orbits with momentum + mouse-parallax tilt.
- **Success Stories** — premium case-study cards with performance metrics and 3D tilt.
- **Contact** — luxury glass form with floating labels and animated async submit.
- Responsive across desktop / tablet / mobile, plus `prefers-reduced-motion` support.

## Functional Entry URIs
### Pages
- `GET /` — Single-page application (all sections).

### API (JSON)
- `GET /api/stats` — headline statistics.
- `GET /api/services` — service offerings (icon, title, desc).
- `GET /api/creators` — featured creators (name, handle, category, followers, country, img).
- `GET /api/voice-testimonials` — voice reviews (name, role, img, audio, quote).
- `GET /api/brand-testimonials` — brand results (brand, result, quote, logo).
- `GET /api/case-studies` — success stories (title, metric, tags, desc).
- `GET /api/network` — India/UK network nodes (city, country, lat, lon).
- `POST /api/contact` — contact form. Body: `{ name, email, company?, message }` → `{ ok, message }`.

### Static Assets
- `/static/style.css`, `/static/globe.js`, `/static/app.js`, `/static/favicon.svg`
- `/static/img/creator-*.svg`, `/static/img/voice-*.svg`
- `/static/audio/voice-1.mp3 … voice-3.mp3` (real AI-generated voice testimonials)

## Data Architecture
- **Data Models**: Stats, Services, Creators, VoiceTestimonials, BrandTestimonials,
  CaseStudies, NetworkNodes, ContactSubmission.
- **Storage**: Content is served from in-worker static data (read-only marketing content).
  No persistent database is required for the current scope. Contact submissions are
  validated server-side and acknowledged (wire up email/CRM or Cloudflare D1/KV when needed).
- **Data Flow**: Browser → `fetch('/api/*')` → Hono routes (Cloudflare Worker) → JSON →
  rendered client-side; the contact form POSTs JSON and renders the response inline.

## User Guide
1. Open the site — the preloader plays, then the hero appears with the 3D globe.
2. Scroll slowly to watch the globe travel and morph between sections.
3. Use the **creator filter chips** to filter the roster by category.
4. In **Voice Testimonials**, press ▶ on a card to hear a real voice review; the sound-wave
   animates while playing.
5. Fill in the **Contact** form and submit to get an instant confirmation message.

## Tech Stack
- **Backend**: Hono on Cloudflare Pages/Workers (TypeScript/JSX).
- **3D / Animation**: Three.js, GSAP + ScrollTrigger, Lenis smooth scroll.
- **Styling**: Hand-crafted CSS (glassmorphism, neon gradients), Google Fonts (Sora,
  Space Grotesk), Font Awesome icons.
- **Build/Dev**: Vite + Wrangler, served via PM2 in the sandbox.

## Local Development
```bash
npm run build                 # build to ./dist
pm2 start ecosystem.config.cjs # serve at http://localhost:3000 via wrangler pages dev
curl http://localhost:3000     # smoke test
```

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: ✅ Built & running locally (sandbox). Ready for Cloudflare Pages deploy.
- **Last Updated**: 2026-06-19

## Not Yet Implemented / Next Steps
- Persist contact submissions (Cloudflare D1 or KV) + email/CRM notification.
- Replace stylized SVG creator portraits with licensed photography.
- Admin/CMS layer to manage creators, testimonials and case studies.
- Per-creator detail pages and a public creator-application flow.
- Real brand logo assets in the testimonial marquee.
