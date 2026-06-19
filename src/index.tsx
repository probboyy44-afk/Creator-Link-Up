import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('/api/*', cors())

/* ----------------------------- Data ----------------------------- */

const stats = [
  { id: 'creators', label: 'Total Creators', value: 4200, suffix: '+' },
  { id: 'campaigns', label: 'Campaigns Managed', value: 860, suffix: '+' },
  { id: 'reach', label: 'Audience Reach', value: 1.4, suffix: 'B', decimals: 1 },
  { id: 'brands', label: 'Brand Partnerships', value: 320, suffix: '+' }
]

const services = [
  { icon: 'fa-handshake', title: 'Brand Deal Management', desc: 'End-to-end negotiation, contracts and delivery for premium brand partnerships.' },
  { icon: 'fa-bullseye', title: 'Full Campaign Management', desc: 'From creative briefs to final reporting — we run the entire campaign.' },
  { icon: 'fa-chess-knight', title: 'Influencer Marketing Strategy', desc: 'Data-driven strategy engineered for maximum reach and resonance.' },
  { icon: 'fa-pen-ruler', title: 'Custom Campaign Plans', desc: 'Bespoke campaign architecture tailored to each brand’s objectives.' },
  { icon: 'fa-globe', title: 'India & UK Creator Network', desc: 'A vetted cross-border roster spanning two of the most vibrant markets.' },
  { icon: 'fa-car-side', title: 'GTA Content Creators', desc: 'Specialist roleplay & GTA creators with deeply engaged communities.' },
  { icon: 'fa-gamepad', title: 'Gaming Creators', desc: 'Top-tier gaming talent across streaming, shorts and long-form.' },
  { icon: 'fa-street-view', title: 'IRL Creators', desc: 'Lifestyle, vlog and IRL creators that turn moments into movements.' },
  { icon: 'fa-link', title: 'Content Creator Partnerships', desc: 'Long-term ambassador and partnership programs that compound.' },
  { icon: 'fa-chart-line', title: 'Performance Reporting & Analytics', desc: 'Transparent dashboards with real ROI, not vanity metrics.' }
]

const creators = [
  { name: 'Aarav Mehta', handle: '@aaravplays', category: 'Gaming', followers: '2.1M', country: 'IN', img: '/static/img/creator-1.svg' },
  { name: 'Lola Hart', handle: '@lolahart', category: 'IRL', followers: '1.6M', country: 'UK', img: '/static/img/creator-2.svg' },
  { name: 'Dev Khanna', handle: '@devgta', category: 'GTA', followers: '980K', country: 'IN', img: '/static/img/creator-3.svg' },
  { name: 'Maya Cole', handle: '@mayacole', category: 'Lifestyle', followers: '1.2M', country: 'UK', img: '/static/img/creator-4.svg' },
  { name: 'Rohan Iyer', handle: '@rohanrp', category: 'GTA', followers: '740K', country: 'IN', img: '/static/img/creator-5.svg' },
  { name: 'Zoe Bennett', handle: '@zoeb', category: 'Lifestyle', followers: '2.4M', country: 'UK', img: '/static/img/creator-6.svg' }
]

const voiceTestimonials = [
  { name: 'Priya Nair', role: 'Lifestyle Creator · 1.8M', img: '/static/img/voice-1.svg', audio: '/static/audio/voice-1.mp3', quote: 'They unlocked brand deals I never thought were possible.' },
  { name: 'James Whitlock', role: 'Gaming Creator · 920K', img: '/static/img/voice-2.svg', audio: '/static/audio/voice-2.mp3', quote: 'The most professional agency I have ever worked with.' },
  { name: 'Anaya Singh', role: 'IRL Creator · 3.1M', img: '/static/img/voice-3.svg', audio: '/static/audio/voice-3.mp3', quote: 'Every campaign felt premium from start to finish.' }
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
  { title: 'NovaTech Global Launch', metric: '312%', metricLabel: 'Engagement Lift', tags: ['Tech', 'IN + UK'], desc: 'A 40-creator synchronized launch across two markets in 21 days.' },
  { title: 'Drift Motors GTA Takeover', metric: '12M', metricLabel: 'Organic Views', tags: ['GTA', 'Gaming'], desc: 'An immersive in-game brand world built with roleplay creators.' },
  { title: 'PulseFit Transformation', metric: '4.8x', metricLabel: 'Return on Ad Spend', tags: ['Fitness', 'IRL'], desc: 'Long-form IRL storytelling that converted at scale.' }
]

const networkNodes = [
  { city: 'Mumbai', country: 'IN', lat: 19.07, lon: 72.87 },
  { city: 'Delhi', country: 'IN', lat: 28.61, lon: 77.20 },
  { city: 'Bengaluru', country: 'IN', lat: 12.97, lon: 77.59 },
  { city: 'London', country: 'UK', lat: 51.50, lon: -0.12 },
  { city: 'Manchester', country: 'UK', lat: 53.48, lon: -2.24 },
  { city: 'Birmingham', country: 'UK', lat: 52.48, lon: -1.90 }
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
<meta name="description" content="Creator Link Up is a premium influencer marketing agency connecting brands with top creators across India and the UK." />
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
    <a href="#contact" class="nav-cta">Start Your Campaign</a>
    <button class="nav-burger" id="navBurger" aria-label="Menu"><span></span><span></span><span></span></button>
  </header>

  <main id="content">
    <!-- HERO -->
    <section id="hero" class="section hero">
      <div class="hero-inner">
        <div class="eyebrow reveal"><span class="dot"></span> India &nbsp;·&nbsp; United Kingdom &nbsp;·&nbsp; Influencer Marketing</div>
        <h1 class="hero-title">
          <span class="reveal">Connecting Brands</span>
          <span class="reveal">With <em>Exceptional</em></span>
          <span class="reveal grad">Creators</span>
        </h1>
        <p class="hero-sub reveal">We architect and run complete influencer campaigns — from strategy to execution — pairing visionary brands with the most influential creators across two continents.</p>
        <div class="hero-cta reveal">
          <a href="#contact" class="btn btn-primary"><i class="fas fa-rocket"></i> Start Your Campaign</a>
          <a href="#creators" class="btn btn-ghost"><i class="fas fa-star"></i> Join As Creator</a>
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
        <p class="section-lead">Gaming, GTA, IRL and Lifestyle talent with deeply engaged audiences.</p>
      </div>
      <div class="filter-bar" id="creatorFilters">
        <button class="filter-chip active" data-cat="All">All</button>
        <button class="filter-chip" data-cat="Gaming">Gaming</button>
        <button class="filter-chip" data-cat="GTA">GTA</button>
        <button class="filter-chip" data-cat="IRL">IRL</button>
        <button class="filter-chip" data-cat="Lifestyle">Lifestyle</button>
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
        <h2 class="section-title">India &amp; UK <span class="grad">creator map</span></h2>
        <p class="section-lead">Live connections between brands and creators across both markets.</p>
      </div>
      <div class="network-stage"><div id="network-globe"></div></div>
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
          <p class="section-lead">Tell us about your brand or creator goals. Our team replies within 24 hours.</p>
          <ul class="contact-points">
            <li><i class="fas fa-circle-check"></i> Dedicated strategist</li>
            <li><i class="fas fa-circle-check"></i> Vetted India &amp; UK roster</li>
            <li><i class="fas fa-circle-check"></i> Transparent performance reporting</li>
          </ul>
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
      <p>Connecting brands with exceptional creators across India &amp; the UK.</p>
      <div class="footer-social">
        <a href="#" aria-label="Instagram"><i class="fab fa-instagram"></i></a>
        <a href="#" aria-label="YouTube"><i class="fab fa-youtube"></i></a>
        <a href="#" aria-label="X"><i class="fab fa-x-twitter"></i></a>
        <a href="#" aria-label="LinkedIn"><i class="fab fa-linkedin-in"></i></a>
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
