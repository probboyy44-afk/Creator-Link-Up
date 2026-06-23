// Node.js server entry — for VPS, Render, Railway, Fly.io, Docker, etc.
// Serves the SAME Hono app plus the static assets in /public.
// Run:  node --import tsx server.mjs    (or)   npm run start:node
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { Hono } from 'hono'
import app from './src/index.tsx'

const port = Number(process.env.PORT || 3000)

// Wrap the app so we can also serve /static/* files from disk.
const root = new Hono()
root.use('/static/*', serveStatic({ root: './public' }))
root.use('/favicon.svg', serveStatic({ path: './public/static/favicon.svg' }))
root.route('/', app)

serve({ fetch: root.fetch, port }, (info) => {
  console.log(`Creator Link Up running on http://0.0.0.0:${info.port}`)
})
