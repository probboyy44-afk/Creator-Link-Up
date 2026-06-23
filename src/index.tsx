import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

/* ----------------------------- Data ----------------------------- */

const stats = [
  { id: 'creators', label: 'Creators Worldwide', value: 4200, suffix: '+' },
  { id: 'campaigns', label: 'Campaigns Managed', value: 860, suffix: '+' },
  { id: 'reach', label: 'Audience Reach', value: 1.4, suffix: 'B', decimals: 1 },
  { id: 'brands', label: 'Brand Partnerships', value: 320, suffix: '+' }
]

const services = [
  { icon: 'fa-handshake', title: 'Brand Deal Management', desc: 'End-to-end negotiation, contracts and delivery for premium brand partnerships.' },
  { icon: 'fa-bullseye', title: 'Full Campaign Management', desc: 'From creative briefs to final reporting — we run the entire campaign.' },
  { icon: 'fa-chess-knight', title: 'Influencer Marketing Strategy', desc: 'Data-driven strategy engineered for maximum reach and resonance.' },
  { icon: 'fa-pen-ruler', title: 'Custom Campaign Plans', desc: 'Bespoke campaign architecture tailored to each brand’s objectives.' },
  { icon: 'fa-globe', title: 'Worldwide Creator Network', desc: 'A vetted global roster spanning every major market and platform.' },
  { icon: 'fa-car-side', title: 'GTA Content Creators', desc: 'Specialist roleplay & GTA creators with deeply engaged communities.' },
  { icon: 'fa-gamepad', title: 'Gaming Creators', desc: 'Top-tier gaming talent across streaming, shorts and long-form.' },
  { icon: 'fa-street-view', title: 'IRL Creators', desc: 'Lifestyle, vlog and IRL creators that turn moments into movements.' },
  { icon: 'fa-link', title: 'Content Creator Partnerships', desc: 'Long-term ambassador and partnership programs that compound.' },
  { icon: 'fa-chart-line', title: 'Performance Reporting & Analytics', desc: 'Transparent dashboards with real ROI, not vanity metrics.' }
]

const creators = [
  { name: 'SenpaiSpider', handle: '@SenpaiSpider', category: 'Minecraft', followers: '2.51M', img: '/static/img/creators/senpaispider.jpg' },
  { name: 'Psd1', handle: '@Psd1', category: 'Gaming', followers: '1.09M', img: '/static/img/creators/psd1.jpg' },
  { name: 'Stevee', handle: '@Stevee', category: 'Gaming', followers: '244K', img: '/static/img/creators/stevee.jpg' },
  { name: 'Fynox', handle: '@Fynox', category: 'Gaming', followers: '164K', img: '/static/img/creators/fynox.jpg' },
  { name: 'Triggered Boy', handle: '@TriggeredBoy', category: 'Minecraft', followers: '135K', img: '/static/img/creators/triggeredboy.jpg' },
  { name: 'Its Water', handle: '@ItsWater', category: 'Minecraft', followers: '29.8K', img: '/static/img/creators/itswater.jpg' }
]

const voiceTestimonials = [
  { name: 'Priya Nair', role: 'Lifestyle Creator · 1.8M', img: '/static/img/voice-1.svg', audio: '/static/audio/voice-1.mp3', quote: 'They unlocked brand deals I never thought were possible.' },
  { name: 'James Whitlock', role: 'Gaming Creator · 920K', img: '/static/img/voice-2.svg', audio: '/static/audio/voice-2.mp3', quote: 'The most professional agency I have ever worked with.' },
  { name: 'Anaya Singh', role: 'Minecraft Creator · 3.1M', img: '/static/img/voice-3.svg', audio: '/static/audio/voice-3.mp3', quote: 'Every campaign felt premium from start to finish.' }
]

const brandTestimonials = [
  { brand: 'NovaTech', result: '+312% engagement', quote: 'Creator Link Up delivered a flawless multi-market launch.', logo: 'fa-bolt' },
  { brand: 'Aurum Wear', result: '4.8x ROAS', quote: 'Our best performing influencer campaign to date.', logo: 'fa-gem' },
  { brand: 'PulseFit', result: '12M+ views', quote: 'Strategy, execution and reporting were world-class.', logo: 'fa-heart-pulse' },
  { brand: 'Drift Motors', result: '+220% leads', quote: 'The GTA creator activation went absolutely viral.', logo: 'fa-car' },
  { brand: 'Lumen Beauty', result: '2.1M reach', quote: 'They understood our brand voice instantly.', logo: 'fa-wand-magic-sparkles' },
  { brand: 'BytePlay', result: '+540% installs', quote: 'Gaming creators drove record installs for our app.', logo: 'fa-mobile-screen' }
]

const caseStudies = [
  { title: 'NovaTech Global Launch', metric: '312%', metricLabel: 'Engagement Lift', tags: ['Tech', 'Worldwide'], desc: 'A 40-creator synchronized launch across 6 countries in 21 days.' },
  { title: 'Drift Motors Gaming Takeover', metric: '12M', metricLabel: 'Organic Views', tags: ['Gaming', 'Minecraft'], desc: 'An immersive in-game brand world built with top gaming creators.' },
  { title: 'PulseFit Transformation', metric: '4.8x', metricLabel: 'Return on Ad Spend', tags: ['Fitness', 'IRL'], desc: 'Long-form storytelling across global creators that converted at scale.' }
]

const networkNodes = [
  { city: 'Mumbai', country: 'IN', lat: 19.07, lon: 72.87, hub: true },
  { city: 'London', country: 'UK', lat: 51.50, lon: -0.12, hub: true },
  { city: 'New York', country: 'US', lat: 40.71, lon: -74.0, hub: true },
  { city: 'Los Angeles', country: 'US', lat: 34.05, lon: -118.24 },
  { city: 'São Paulo', country: 'BR', lat: -23.55, lon: -46.63 },
  { city: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69 },
  { city: 'Sydney', country: 'AU', lat: -33.87, lon: 151.21 },
  { city: 'Dubai', country: 'AE', lat: 25.20, lon: 55.27 },
  { city: 'Berlin', country: 'DE', lat: 52.52, lon: 13.40 },
  { city: 'Toronto', country: 'CA', lat: 43.65, lon: -79.38 },
  { city: 'Singapore', country: 'SG', lat: 1.35, lon: 103.82 },
  { city: 'Lagos', country: 'NG', lat: 6.52, lon: 3.38 }
]

/* ----------------------------- API ----------------------------- */

app.get('/api/stats', (c) => c.json(stats))
app.get('/api/services', (c) => c.json(services))
app.get('/api/creators', (c) => c.json(creators))
app.get('/api/voice-testimonials', (c) => c.json(voiceTestimonials))
app.get('/api/brand-testimonials', (c) => c.json(brandTestimonials))
app.get('/api/case-studies', (c) => c.json(caseStudies))
app.get('/api/network', (c) => c.json(networkNodes))

app.post('/api/contact', async (c) => {
  try {
    const body = await c.req.json()
    const { name, email, message } = body || {}
    if (!name || !email || !message) {
      return c.json({ ok: false, error: 'Missing required fields.' }, 400)
    }
    return c.json({ ok: true, message: `Thanks ${name}, our team will reach out within 24 hours.` })
  } catch {
    return c.json({ ok: false, error: 'Invalid request.' }, 400)
  }
})

/* ----------------------------- Page ----------------------------- */

app.get('/', (c) => {
  return c.html(PAGE)
})

const PAGE = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
<title>Creator Link Up — Connecting Brands With Exceptional Creators</title>
<meta name="description" content="Creator Link Up is a premium influencer marketing agency connecting brands with top creators worldwide — campaign strategy, brand deals, gaming &amp; Minecraft creators and performance reporting." />
<meta property="og:title" content="Creator Link Up — Connecting Brands With Exceptional Creators" />
<meta property="og:description" content="Premium worldwide influencer marketing agency. We connect brands with top creators and run complete campaigns end to end." />
<meta property="og:type" content="website" />
<meta name="theme-color" content="#05050a" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
<link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.5.2/css/all.min.css" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="/static/favicon.svg" />
<link href="/static/style.css" rel="stylesheet" />
</head>
<body>
  <div id="preloader" class="preloader">
    <div class="preloader-inner">
      <div class="preloader-ring"></div>
      <div class="preloader-logo">CREATOR<span>LINK UP</span></div>
      <div class="preloader-bar"><div class="preloader-bar-fill" id="preloaderFill"></div></div>
      <div class="preloader-pct" id="preloaderPct">0%</div>
    </div>
  </div>

  <div id="cursor-glow" class="cursor-glow"></div>
  <canvas id="bg-canvas"></canvas>
  <div id="globe-stage"></div>

  <header class="nav" id="nav">
    <a href="#hero" class="nav-logo">CREATOR<span>LINK UP</span></a>
    <nav class="nav-links">
      <a href="#services">Services</a>
      <a href="#creators">Creators</a>
      <a href="#voices">Voices</a>
      <a href="#process">Process</a>
      <a href="#network">Network</a>
      <a href="#cases">Stories</a>
    </nav>
    <div class="nav-actions">
      <a href="https://discord.gg/eKaGpD6r8Z" target="_blank" rel="noopener" class="nav-discord" aria-label="Discord"><i class="fab fa-discord"></i></a>
      <a href="#contact" class="nav-cta">Start Your Campaign</a>
    </div>
    <button class="nav-burger" id="navBurger" aria-label="Menu"><span></span><span></span><span></span></button>
  </header>

  <main id="content">
    <!-- HERO -->
    <section id="hero" class="section hero">
      <div class="hero-inner">
        <div class="eyebrow reveal"><span class="dot"></span> Worldwide &nbsp;·&nbsp; Influencer Marketing &nbsp;·&nbsp; Est. Creators</div>
        <h1 class="hero-title">
          <span class="reveal">Connecting Brands</span>
          <span class="reveal">With <em>Exceptional</em></span>
          <span class="reveal grad">Creators</span>
        </h1>
        <p class="hero-sub reveal">We architect and run complete influencer campaigns — from strategy to execution — pairing visionary brands with the most influential creators <strong>across the globe</strong>.</p>
        <div class="hero-cta reveal">
          <a href="#contact" class="btn btn-primary"><i class="fas fa-rocket"></i> Start Your Campaign</a>
          <a href="#creators" class="btn btn-ghost"><i class="fas fa-star"></i> Join As Creator</a>
        </div>
        <div class="hero-trust reveal">
          <div class="hero-trust-avatars">
            <img src="/static/img/creators/senpaispider.jpg" alt="SenpaiSpider" />
            <img src="/static/img/creators/psd1.jpg" alt="Psd1" />
            <img src="/static/img/creators/fynox.jpg" alt="Fynox" />
            <img src="/static/img/creators/stevee.jpg" alt="Stevee" />
            <img src="/static/img/creators/triggeredboy.jpg" alt="Triggered Boy" />
          </div>
          <span class="hero-trust-text">Trusted by <strong>4,200+</strong> creators worldwide</span>
        </div>
      </div>
      <div class="scroll-hint"><span>Scroll to explore</span><i class="fas fa-chevron-down"></i></div>
    </section>

    <!-- STATS -->
    <section id="stats" class="section stats">
      <div class="stats-grid" id="statsGrid"></div>
    </section>

    <!-- SERVICES -->
    <section id="services" class="section services">
      <div class="section-head">
        <span class="kicker">What We Do</span>
        <h2 class="section-title">A full-stack <span class="grad">influencer engine</span></h2>
        <p class="section-lead">Ten disciplines, one seamless partnership — engineered for reach, resonance and measurable return.</p>
      </div>
      <div class="services-grid" id="servicesGrid"></div>
    </section>

    <!-- CREATORS -->
    <section id="creators" class="section creators">
      <div class="section-head">
        <span class="kicker">The Roster</span>
        <h2 class="section-title">Featured <span class="grad">Creators</span></h2>
        <p class="section-lead">Gaming, Minecraft, GTA and IRL talent with deeply engaged, loyal audiences.</p>
      </div>
      <div class="filter-bar" id="creatorFilters">
        <button class="filter-chip active" data-cat="All">All</button>
        <button class="filter-chip" data-cat="Gaming">Gaming</button>
        <button class="filter-chip" data-cat="Minecraft">Minecraft</button>
        <button class="filter-chip" data-cat="GTA">GTA</button>
        <button class="filter-chip" data-cat="IRL">IRL</button>
      </div>
      <div class="creators-grid" id="creatorsGrid"></div>
    </section>

    <!-- VOICE TESTIMONIALS -->
    <section id="voices" class="section voices">
      <div class="section-head">
        <span class="kicker">In Their Own Words</span>
        <h2 class="section-title">Voice <span class="grad">Testimonials</span></h2>
        <p class="section-lead">Press play to hear real creators share their experience.</p>
      </div>
      <div class="voices-grid" id="voicesGrid"></div>
    </section>

    <!-- BRAND TESTIMONIALS -->
    <section id="brands" class="section brands">
      <div class="section-head">
        <span class="kicker">Trusted By Brands</span>
        <h2 class="section-title">Results that <span class="grad">speak</span></h2>
      </div>
      <div class="marquee" id="brandMarquee"><div class="marquee-track" id="brandTrack"></div></div>
    </section>

    <!-- PROCESS -->
    <section id="process" class="section process">
      <div class="section-head">
        <span class="kicker">How It Works</span>
        <h2 class="section-title">The <span class="grad">campaign journey</span></h2>
      </div>
      <div class="timeline" id="timeline">
        <div class="timeline-line"><div class="timeline-progress" id="timelineProgress"></div></div>
      </div>
    </section>

    <!-- NETWORK -->
    <section id="network" class="section network">
      <div class="section-head">
        <span class="kicker">The Network</span>
        <h2 class="section-title">Worldwide <span class="grad">creator map</span></h2>
        <p class="section-lead">Live connections between brands and creators across every continent — we work worldwide.</p>
      </div>
      <div class="network-stage">
        <div id="network-globe"></div>
        <div id="network-label" class="network-label"></div>
        <div class="network-legend">
          <span><i class="dot hub"></i> Brand Hubs</span>
          <span><i class="dot c1"></i> Creators</span>
          <span><i class="dot c2"></i> Live Links</span>
        </div>
        <div class="network-hint"><i class="fas fa-arrows-up-down-left-right"></i> Drag to explore the network</div>
        <div class="network-badge"><span class="grad">12+</span> markets · <span class="grad">6</span> continents</div>
      </div>
    </section>

    <!-- CASE STUDIES -->
    <section id="cases" class="section cases">
      <div class="section-head">
        <span class="kicker">Success Stories</span>
        <h2 class="section-title">Premium <span class="grad">case studies</span></h2>
      </div>
      <div class="cases-grid" id="casesGrid"></div>
    </section>

    <!-- CONTACT -->
    <section id="contact" class="section contact">
      <div class="contact-wrap">
        <div class="contact-copy">
          <span class="kicker">Let's Build</span>
          <h2 class="section-title">Start your <span class="grad">campaign</span></h2>
          <p class="section-lead">Tell us about your brand or creator goals. Our team replies within 24 hours — we work with brands and creators worldwide.</p>
          <ul class="contact-points">
            <li><i class="fas fa-circle-check"></i> Dedicated strategist</li>
            <li><i class="fas fa-circle-check"></i> Vetted worldwide creator roster</li>
            <li><i class="fas fa-circle-check"></i> Transparent performance reporting</li>
          </ul>
          <div class="contact-channels">
            <a class="contact-channel" href="mailto:support@creatorlinkup.in">
              <span class="cc-icon"><i class="fas fa-envelope"></i></span>
              <span class="cc-text"><span class="cc-label">Email us</span><span class="cc-value">support@creatorlinkup.in</span></span>
            </a>
            <a class="contact-channel discord" href="https://discord.gg/eKaGpD6r8Z" target="_blank" rel="noopener">
              <span class="cc-icon"><i class="fab fa-discord"></i></span>
              <span class="cc-text"><span class="cc-label">Join our Discord</span><span class="cc-value">discord.gg/eKaGpD6r8Z</span></span>
            </a>
          </div>
        </div>
        <form class="contact-form" id="contactForm">
          <div class="field"><input type="text" id="cf-name" required placeholder=" " /><label>Your name</label></div>
          <div class="field"><input type="email" id="cf-email" required placeholder=" " /><label>Email address</label></div>
          <div class="field"><input type="text" id="cf-company" placeholder=" " /><label>Brand / Handle (optional)</label></div>
          <div class="field"><textarea id="cf-message" rows="4" required placeholder=" "></textarea><label>Tell us about your goals</label></div>
          <button type="submit" class="btn btn-primary btn-block" id="cfSubmit"><span class="btn-label"><i class="fas fa-paper-plane"></i> Send Message</span></button>
          <div class="form-status" id="formStatus"></div>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="footer-top">
      <a href="#hero" class="nav-logo">CREATOR<span>LINK UP</span></a>
      <p>Connecting brands with exceptional creators — worldwide.</p>
      <div class="footer-contact">
        <a href="mailto:support@creatorlinkup.in"><i class="fas fa-envelope"></i> support@creatorlinkup.in</a>
        <a href="https://discord.gg/eKaGpD6r8Z" target="_blank" rel="noopener"><i class="fab fa-discord"></i> Join Discord</a>
      </div>
      <div class="footer-social">
        <a href="https://discord.gg/eKaGpD6r8Z" target="_blank" rel="noopener" aria-label="Discord"><i class="fab fa-discord"></i></a>
        <a href="mailto:support@creatorlinkup.in" aria-label="Email"><i class="fas fa-envelope"></i></a>
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
    <div class="footer-bottom"><span>© ${new Date().getFullYear()} Creator Link Up. All rights reserved.</span></div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/lenis@1.0.42/dist/lenis.min.js"></script>
  <script src="/static/globe.js"></script>
  <script src="/static/app.js"></script>
</body>
</html>`

export default app
