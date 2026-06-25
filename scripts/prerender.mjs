// Prerender the Hono app to fully-static files so the site can deploy to ANY
// host (GitHub Pages, Netlify, Vercel, Cloudflare Pages, S3, nginx, etc.)
// without needing a running server. It imports the SAME Hono app used in
// production and "fetches" each route in-process.
import { mkdir, writeFile, cp, access } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outDir = join(root, 'dist')

// Import the built/transpiled app via tsx loader (run with: tsx scripts/prerender.mjs)
const { default: app } = await import(join(root, 'src', 'index.tsx'))

async function dump(path, file) {
  const res = await app.request(path)
  const body = await res.text()
  const full = join(outDir, file)
  await mkdir(dirname(full), { recursive: true })
  await writeFile(full, body)
  console.log('  ✓', file, `(${res.status})`)
}

async function exists(p) { try { await access(p); return true } catch { return false } }

console.log('Prerendering static site → dist/')

// 1) Home page
await dump('/', 'index.html')
// SPA fallback (404 -> same page) for static hosts
await dump('/', '404.html')

// 2) API endpoints as static JSON (GET only). The frontend reads these as
//    /api/<name> ; we emit both /api/<name> and /api/<name>.json for safety.
const apis = ['stats', 'services', 'creators', 'creator-reviews', 'brand-testimonials', 'case-studies', 'network']
for (const name of apis) {
  await dump('/api/' + name, 'api/' + name)
}

// 3) Copy static assets (css/js/img/audio) into dist/static
const pub = join(root, 'public', 'static')
if (await exists(pub)) {
  await cp(pub, join(outDir, 'static'), { recursive: true })
  console.log('  ✓ static/ assets copied')
}

// 4) SPA fallback for static hosts (Netlify / Cloudflare Pages static)
const redirects = `/api/*   /api/:splat   200
/static/*   /static/:splat   200
/*   /index.html   200
`
await writeFile(join(outDir, '_redirects'), redirects)
console.log('  ✓ _redirects written')

console.log('Prerender complete.')
