# Deployment Guide — Creator Link Up

This project is built to deploy on **any hosting platform**. The same Hono app powers
dynamic hosts, and a full **static prerender** (`npm run build:static`) lets it run on
pure static hosts too.

## Build commands

| Command | What it does |
| --- | --- |
| `npm run build` | Builds the Cloudflare Pages worker bundle (`dist/_worker.js`). |
| `npm run build:static` | Builds the worker **and** prerenders `index.html`, all `/api/*` JSON, copies `/static`, writes `_redirects` + `404.html`. Use this for static hosts. |
| `npm start` | Runs the Node server (`server.mjs`) — for VPS/containers. |

After any build the deployable folder is **`dist/`**.

---

## 1. Cloudflare Pages (recommended — dynamic)
```bash
npm run build
npx wrangler pages deploy dist --project-name creator-link-up
```
- Worker handles `/` + `/api/*` (including the dynamic contact POST).
- Config: `wrangler.jsonc`. First time, create the project:
  `npx wrangler pages project create creator-link-up --production-branch main`.

## 2. Vercel
- Import the GitHub repo → Vercel auto-detects `vercel.json`.
- Build command: `npm run build:static` · Output dir: `dist` (already set in `vercel.json`).
- Static + SPA rewrites configured.

## 3. Netlify
- Import the repo → Netlify reads `netlify.toml`.
- Build: `npm run build:static` · Publish dir: `dist`.

## 4. GitHub Pages (static)
- Workflow `.github/workflows/deploy-pages.yml` builds and deploys automatically.
- In the repo: **Settings → Pages → Source = GitHub Actions**.
- Best served from a root domain / custom domain (assets use absolute `/static` paths).

## 5. Render
- New Web Service → connect repo → Render reads `render.yaml`.
- Or static site: build `npm run build:static`, publish `dist`.

## 6. Railway / Fly.io / any Docker host
```bash
docker build -t creator-link-up .
docker run -p 3000:3000 creator-link-up
```
- `Dockerfile` builds and runs the Node server on port 3000.
- Railway also reads `railway.json`.

## 7. Any VPS / Node server
```bash
npm install
npm run build:static
PORT=3000 npm start    # node --import tsx server.mjs
```

## 8. Plain static hosting (S3, nginx, Surge, Firebase Hosting…)
```bash
npm run build:static
# upload the contents of dist/ to your host
```
On static hosts the contact form gracefully falls back to opening the
visitor's email app (`support@creatorlinkup.in`). All read APIs are served as
prerendered JSON files under `dist/api/`.

---

## Notes
- **Node 18+** required (declared in `package.json` `engines`).
- No secrets or env vars are required to run the site.
- Contact submissions: dynamic hosts return a JSON confirmation; wire up email/CRM
  or Cloudflare D1/KV later if you want to persist them.
