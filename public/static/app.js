/* ============================================================
   Creator Link Up — App logic, GSAP choreography, interactions
   ============================================================ */
(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  const fill = document.getElementById('preloaderFill');
  const pct = document.getElementById('preloaderPct');
  document.body.classList.add('locked');
  let p = 0;
  const pTimer = setInterval(() => {
    p += Math.random() * 14 + 6;
    if (p >= 100) { p = 100; clearInterval(pTimer); finishPreload(); }
    if (fill) fill.style.width = p + '%';
    if (pct) pct.textContent = Math.floor(p) + '%';
  }, 130);

  function finishPreload() {
    setTimeout(() => {
      preloader && preloader.classList.add('done');
      document.body.classList.remove('locked');
      heroIntro();
      initScroll();
    }, 350);
  }

  /* ---------------- Smooth scroll (Lenis) ---------------- */
  let lenis = null;
  function initScroll() {
    if (typeof Lenis !== 'undefined' && !reduceMotion) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
      function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
      requestAnimationFrame(raf);
      if (window.ScrollTrigger) {
        lenis.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((t) => lenis.raf(t * 1000));
        gsap.ticker.lagSmoothing(0);
      }
    }
    setupGlobeChoreography();
    setupReveals();
    setupTimelineProgress();
  }

  // anchor links via lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      const el = id && document.querySelector(id);
      if (el) {
        e.preventDefault();
        if (lenis) lenis.scrollTo(el, { offset: -60 });
        else el.scrollIntoView({ behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  /* ---------------- Hero intro ---------------- */
  function heroIntro() {
    if (reduceMotion || typeof gsap === 'undefined') {
      document.querySelectorAll('.hero .reveal').forEach((el) => el.classList.add('in'));
      return;
    }
    gsap.to('.hero .reveal', { opacity: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.12, delay: 0.1, onStart() {
      document.querySelectorAll('.hero .reveal').forEach((el) => { el.style.transition = 'none'; });
    }});
  }

  /* ---------------- Globe scroll choreography ---------------- */
  function setupGlobeChoreography() {
    const G = window.__CLU_GLOBE__;
    if (!G || typeof gsap === 'undefined' || !window.ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);
    const st = G.state;

    // helper: world units roughly map; we drive a normalized timeline across the whole page
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#content',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.1
      }
    });

    // The globe is a continuous traveling object. Each keyframe = a section beat.
    // HERO: large, centered-right
    gsap.set(st, { posX: 0, posY: 0, posZ: 0, scale: 1.25, opacity: 1 });

    tl
      // hero -> stats: globe drifts right + shrinks slightly
      .to(st, { posX: 5.5, posY: -1, scale: 0.85, opacity: 0.85, ease: 'power1.inOut' })
      // stats -> services: move left, push back
      .to(st, { posX: -6, posY: -1.5, posZ: -4, scale: 0.7, opacity: 0.55, extraRotY: 0.4, ease: 'power1.inOut' })
      // services -> creators: cross to right, smaller, dim (cards are busy)
      .to(st, { posX: 6.5, posY: 0, posZ: -6, scale: 0.6, opacity: 0.4, ease: 'power1.inOut' })
      // creators -> voices: back toward center-left
      .to(st, { posX: -5.5, posY: -1, posZ: -3, scale: 0.7, opacity: 0.55, extraRotX: 0.2, ease: 'power1.inOut' })
      // voices -> brands: rise, center
      .to(st, { posX: 0, posY: 1, posZ: -5, scale: 0.75, opacity: 0.45, ease: 'power1.inOut' })
      // brands -> process: drift right along timeline
      .to(st, { posX: 6, posY: 0, posZ: -4, scale: 0.65, opacity: 0.5, ease: 'power1.inOut' })
      // process -> network: fade out (network has its own globe)
      .to(st, { posX: 0, posY: 0, posZ: -8, scale: 0.5, opacity: 0, ease: 'power1.inOut' })
      // network -> cases: fade back in, left
      .to(st, { posX: -6, posY: 0, posZ: -3, scale: 0.7, opacity: 0.5, extraRotY: -0.3, ease: 'power1.inOut' })
      // cases -> contact: settle right, glowing
      .to(st, { posX: 5.5, posY: -1, posZ: -2, scale: 0.85, opacity: 0.7, ease: 'power1.inOut' });
  }

  /* ---------------- Reveal on scroll ---------------- */
  function setupReveals() {
    const items = document.querySelectorAll('.reveal:not(.hero .reveal), [data-stagger]');
    if (typeof gsap !== 'undefined' && window.ScrollTrigger) {
      // group staggered children by parent grid
      document.querySelectorAll('[data-stagger-group]').forEach((group) => {
        const kids = group.querySelectorAll('[data-stagger]');
        ScrollTrigger.create({
          trigger: group, start: 'top 82%', once: true,
          onEnter: () => gsap.to(kids, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08 })
        });
      });
      document.querySelectorAll('.reveal').forEach((el) => {
        if (el.closest('.hero')) return;
        ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => el.classList.add('in') });
      });
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: 0.15 });
      document.querySelectorAll('.reveal, [data-stagger]').forEach((el) => io.observe(el));
    }
  }

  /* ---------------- Timeline progress ---------------- */
  function setupTimelineProgress() {
    const line = document.getElementById('timelineProgress');
    const tl = document.getElementById('timeline');
    if (!line || !tl || typeof gsap === 'undefined' || !window.ScrollTrigger) return;
    gsap.to(line, {
      height: '100%', ease: 'none',
      scrollTrigger: { trigger: tl, start: 'top 70%', end: 'bottom 70%', scrub: true }
    });
  }

  /* ---------------- Cursor glow ---------------- */
  (function cursorGlow() {
    const g = document.getElementById('cursor-glow');
    if (!g || window.matchMedia('(hover:none)').matches) return;
    let gx = window.innerWidth / 2, gy = window.innerHeight / 2, tx = gx, ty = gy;
    window.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; g.classList.add('on'); });
    window.addEventListener('mouseleave', () => g.classList.remove('on'));
    (function follow() {
      gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12;
      g.style.transform = `translate(${gx}px,${gy}px) translate(-50%,-50%)`;
      requestAnimationFrame(follow);
    })();
  })();

  /* ---------------- Nav ---------------- */
  const nav = document.getElementById('nav');
  const burger = document.getElementById('navBurger');
  const links = document.querySelector('.nav-links');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) nav.classList.add('scrolled'); else nav.classList.remove('scrolled');
  });
  function closeMenu() { burger && burger.classList.remove('open'); links && links.classList.remove('open'); }
  burger && burger.addEventListener('click', () => { burger.classList.toggle('open'); links.classList.toggle('open'); });

  /* ---------------- Data fetch + render ---------------- */
  const api = (p) => fetch(p).then((r) => r.json()).catch(() => null);

  // STATS with count-up
  api('/api/stats').then((data) => {
    if (!data) return;
    const grid = document.getElementById('statsGrid');
    grid.innerHTML = data.map((s) => `
      <article class="stat-card reveal" data-stagger>
        <div class="stat-num" data-target="${s.value}" data-suffix="${s.suffix || ''}" data-decimals="${s.decimals || 0}">0</div>
        <div class="stat-label">${s.label}</div>
      </article>`).join('');
    grid.setAttribute('data-stagger-group', '');
    setupReveals();
    countUpAll();
  });

  function countUpAll() {
    document.querySelectorAll('.stat-num').forEach((el) => {
      const target = parseFloat(el.dataset.target);
      const suffix = el.dataset.suffix || '';
      const decimals = parseInt(el.dataset.decimals || '0');
      const obs = new IntersectionObserver((ents) => {
        ents.forEach((e) => {
          if (e.isIntersecting) {
            obs.unobserve(el);
            let start = 0; const dur = 1800; const t0 = performance.now();
            function step(now) {
              const prog = Math.min((now - t0) / dur, 1);
              const eased = 1 - Math.pow(1 - prog, 3);
              const val = target * eased;
              el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val).toLocaleString()) + suffix;
              if (prog < 1) requestAnimationFrame(step);
              else el.textContent = (decimals ? target.toFixed(decimals) : target.toLocaleString()) + suffix;
            }
            requestAnimationFrame(step);
          }
        });
      }, { threshold: 0.4 });
      obs.observe(el);
    });
  }

  // SERVICES
  api('/api/services').then((data) => {
    if (!data) return;
    const grid = document.getElementById('servicesGrid');
    grid.setAttribute('data-stagger-group', '');
    grid.innerHTML = data.map((s) => `
      <article class="service-card" data-tilt data-stagger>
        <div class="service-glow"></div>
        <div class="service-icon"><i class="fas ${s.icon}"></i></div>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
      </article>`).join('');
    setupReveals();
    setupTilt();
  });

  // CREATORS
  let allCreators = [];
  api('/api/creators').then((data) => {
    if (!data) return;
    allCreators = data;
    renderCreators('All');
  });
  function renderCreators(cat) {
    const grid = document.getElementById('creatorsGrid');
    const list = cat === 'All' ? allCreators : allCreators.filter((c) => c.category === cat);
    grid.setAttribute('data-stagger-group', '');
    grid.innerHTML = list.map((c) => `
      <article class="creator-card" data-tilt data-stagger>
        <div class="creator-glow"></div>
        <span class="creator-cat"><i class="fas fa-circle"></i> ${c.category}</span>
        <div class="creator-avatar-wrap">
          <span class="creator-ring"></span>
          <img class="creator-avatar" src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#8b5cff,#39e0ff)'" />
        </div>
        <h3>${c.name}</h3>
        <div class="handle">${c.handle}</div>
        <div class="creator-stat"><span class="creator-subs">${c.followers}</span><span class="creator-subs-label">subscribers</span></div>
        <a class="creator-link" href="https://youtube.com/${c.handle}" target="_blank" rel="noopener"><i class="fab fa-youtube"></i> View Channel</a>
      </article>`).join('');
    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-stagger]').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), i * 60);
      });
      setupTilt();
    });
  }
  document.getElementById('creatorFilters').addEventListener('click', (e) => {
    const btn = e.target.closest('.filter-chip');
    if (!btn) return;
    document.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    renderCreators(btn.dataset.cat);
  });

  // VOICE TESTIMONIALS
  api('/api/voice-testimonials').then((data) => {
    if (!data) return;
    const grid = document.getElementById('voicesGrid');
    grid.setAttribute('data-stagger-group', '');
    grid.innerHTML = data.map((v, i) => `
      <article class="voice-card" data-stagger id="voice-${i}">
        <div class="voice-top">
          <img class="voice-avatar" src="${v.img}" alt="${v.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#8b5cff,#39e0ff)'" />
          <div class="voice-meta"><h4>${v.name}</h4><span>${v.role}</span></div>
        </div>
        <p class="voice-quote">“${v.quote}”</p>
        <div class="voice-player">
          <button class="voice-play" data-audio="${v.audio}" data-card="voice-${i}" aria-label="Play review"><i class="fas fa-play"></i></button>
          <div class="voice-wave">${Array.from({ length: 28 }).map(() => '<span></span>').join('')}</div>
        </div>
      </article>`).join('');
    setupReveals();
    setupVoicePlayers();
  });

  function setupVoicePlayers() {
    let current = null;
    document.querySelectorAll('.voice-play').forEach((btn) => {
      btn.addEventListener('click', () => {
        const card = document.getElementById(btn.dataset.card);
        if (current && current.btn !== btn) resetPlayer(current);
        if (!btn._audio) {
          btn._audio = new Audio(btn.dataset.audio);
          btn._audio.addEventListener('ended', () => resetPlayer({ btn, card }));
          btn._audio.addEventListener('error', () => { resetPlayer({ btn, card }); });
        }
        if (btn._audio.paused) {
          btn._audio.play().catch(() => {});
          btn.innerHTML = '<i class="fas fa-pause"></i>';
          card.classList.add('playing');
          // randomize wave bar speeds
          card.querySelectorAll('.voice-wave span').forEach((s) => s.style.animationDelay = (Math.random() * 0.6) + 's');
          current = { btn, card };
        } else {
          btn._audio.pause();
          resetPlayer({ btn, card });
        }
      });
    });
    function resetPlayer(o) {
      if (!o) return;
      o.btn.innerHTML = '<i class="fas fa-play"></i>';
      o.card.classList.remove('playing');
      if (o.btn._audio) { o.btn._audio.pause(); o.btn._audio.currentTime = 0; }
      if (current && current.btn === o.btn) current = null;
    }
  }

  // BRAND TESTIMONIALS marquee (duplicate for seamless loop)
  api('/api/brand-testimonials').then((data) => {
    if (!data) return;
    const track = document.getElementById('brandTrack');
    const cardHtml = (b) => `
      <article class="brand-card">
        <div class="brand-head">
          <div class="brand-logo"><i class="fas ${b.logo}"></i></div>
          <div><div class="brand-name">${b.brand}</div><div class="brand-result">${b.result}</div></div>
        </div>
        <p class="brand-quote">“${b.quote}”</p>
      </article>`;
    track.innerHTML = (data.map(cardHtml).join('')) + (data.map(cardHtml).join(''));
  });

  // PROCESS timeline
  const steps = [
    { step: 'Step 01', title: 'Discovery', desc: 'We deep-dive into your brand, audience and objectives to define what success looks like.' },
    { step: 'Step 02', title: 'Strategy', desc: 'A data-driven roadmap mapping the right markets, formats and creator archetypes.' },
    { step: 'Step 03', title: 'Creator Selection', desc: 'We match you with vetted worldwide creators whose audience fits your brand.' },
    { step: 'Step 04', title: 'Campaign Launch', desc: 'Creative briefs, contracts and coordinated rollout — managed end to end.' },
    { step: 'Step 05', title: 'Reporting', desc: 'Transparent dashboards with real performance metrics and actionable insight.' }
  ];
  (function renderTimeline() {
    const tl = document.getElementById('timeline');
    if (!tl) return;
    steps.forEach((s) => {
      const item = document.createElement('div');
      item.className = 'timeline-item reveal';
      item.innerHTML = `
        <div class="timeline-dot"></div>
        <div class="timeline-card">
          <span class="timeline-step">${s.step}</span>
          <h3>${s.title}</h3>
          <p>${s.desc}</p>
        </div>`;
      tl.appendChild(item);
    });
  })();

  // CASE STUDIES
  api('/api/case-studies').then((data) => {
    if (!data) return;
    const grid = document.getElementById('casesGrid');
    grid.setAttribute('data-stagger-group', '');
    grid.innerHTML = data.map((c) => `
      <article class="case-card" data-tilt data-stagger>
        <div class="case-metric">${c.metric}</div>
        <div class="case-metric-label">${c.metricLabel}</div>
        <h3>${c.title}</h3>
        <p>${c.desc}</p>
        <div class="case-tags">${c.tags.map((t) => `<span class="case-tag">${t}</span>`).join('')}</div>
      </article>`).join('');
    setupReveals();
    setupTilt();
  });

  /* ---------------- 3D tilt effect ---------------- */
  function setupTilt() {
    if (reduceMotion || window.innerWidth < 760) return;
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      if (card._tilt) return; card._tilt = true;
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(900px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateY(-6px)`;
        const glow = card.querySelector('.service-glow');
        if (glow) { glow.style.left = (e.clientX - r.left) + 'px'; glow.style.top = (e.clientY - r.top) + 'px'; }
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  /* ---------------- Network mini-globe ---------------- */
  api('/api/network').then((data) => { if (data) buildNetworkGlobe(data); });

  function buildNetworkGlobe(nodes) {
    if (typeof THREE === 'undefined') return;
    const mount = document.getElementById('network-globe');
    if (!mount) return;
    const label = document.getElementById('network-label');
    const w = () => mount.clientWidth, h = () => mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 200);
    cam.position.z = 11;
    scene.add(new THREE.AmbientLight(0x5560b0, 1.5));
    const pl = new THREE.PointLight(0x8b5cff, 2.2, 60); pl.position.set(8, 6, 10); scene.add(pl);
    const pl2 = new THREE.PointLight(0x39e0ff, 1.6, 60); pl2.position.set(-10, -4, 6); scene.add(pl2);

    const root = new THREE.Group(); scene.add(root);    // tilt + drag
    const grp = new THREE.Group(); root.add(grp);        // spinning earth
    root.rotation.z = 0.36;
    const R = 3.4;

    /* ---- Starfield around globe ---- */
    const starCount = 600;
    const sp = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const rr = 14 + Math.random() * 22;
      const th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
      sp[i*3] = rr * Math.sin(ph) * Math.cos(th);
      sp[i*3+1] = rr * Math.sin(ph) * Math.sin(th);
      sp[i*3+2] = rr * Math.cos(ph);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(sp, 3));
    const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0x9fb0ff, size: 0.08, transparent: true, opacity: 0.7 }));
    scene.add(stars);

    /* ---- Globe layers ---- */
    // glowing atmosphere
    const atmo = new THREE.Mesh(new THREE.SphereGeometry(R * 1.18, 48, 48),
      new THREE.MeshBasicMaterial({ color: 0x5a6bff, transparent: true, opacity: 0.07, side: THREE.BackSide }));
    grp.add(atmo);
    // solid dark core
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.985, 48, 48),
      new THREE.MeshPhongMaterial({ color: 0x0d0b24, emissive: 0x140f33, shininess: 30, transparent: true, opacity: 0.92 })));
    // lat/long wire grid
    const grid = new THREE.Mesh(new THREE.SphereGeometry(R, 36, 24),
      new THREE.MeshBasicMaterial({ color: 0x4a3fa0, wireframe: true, transparent: true, opacity: 0.18 }));
    grp.add(grid);

    // dotted "land" point cloud on the sphere surface for a globe-of-dots look
    const dotCount = 1400;
    const dp = new Float32Array(dotCount * 3);
    const off = 2 / dotCount, inc = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < dotCount; i++) {
      const y = i * off - 1 + off / 2; const rad = Math.sqrt(1 - y*y); const phi = i * inc;
      dp[i*3] = Math.cos(phi) * rad * R; dp[i*3+1] = y * R; dp[i*3+2] = Math.sin(phi) * rad * R;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute('position', new THREE.BufferAttribute(dp, 3));
    const dotMat = new THREE.PointsMaterial({ color: 0x6c79d6, size: 0.045, transparent: true, opacity: 0.45 });
    grp.add(new THREE.Points(dotGeo, dotMat));

    function toVec(lat, lon, mul = 1) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(-R*mul*Math.sin(phi)*Math.cos(theta), R*mul*Math.cos(phi), R*mul*Math.sin(phi)*Math.sin(theta));
    }

    /* ---- City pins (raycastable for hover labels) ---- */
    const palette = [0x39e0ff, 0xb388ff, 0xff5ce0, 0x6aa6ff];
    const pins = [];
    nodes.forEach((n, i) => {
      const v = toVec(n.lat, n.lon);
      const color = n.hub ? 0xffd166 : palette[i % palette.length];
      const core = new THREE.Mesh(new THREE.SphereGeometry(n.hub ? 0.12 : 0.085, 14, 14), new THREE.MeshBasicMaterial({ color }));
      core.position.copy(v); core.userData = { city: n.city, country: n.country }; grp.add(core);
      const halo = new THREE.Mesh(new THREE.SphereGeometry(n.hub ? 0.26 : 0.18, 14, 14), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.28 }));
      halo.position.copy(v); grp.add(halo);
      // expanding ripple ring on the surface
      const ring = new THREE.Mesh(new THREE.RingGeometry(0.16, 0.2, 24), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.6, side: THREE.DoubleSide }));
      ring.position.copy(v); ring.lookAt(0, 0, 0); grp.add(ring);
      pins.push({ v, halo, core, ring, color, phase: Math.random() * Math.PI * 2 });
    });

    /* ---- Connection arcs between many nodes ---- */
    const verts = nodes.map((n) => toVec(n.lat, n.lon));
    const arcs = [];
    // connect each node to 2 others (hubs get more) for a dense worldwide web
    nodes.forEach((n, i) => {
      const links = n.hub ? 5 : 2;
      for (let k = 1; k <= links; k++) {
        const j = (i + k * 3 + 1) % nodes.length;
        if (j === i) continue;
        const a = verts[i], b = verts[j];
        const dist = a.distanceTo(b);
        const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * (1.15 + dist * 0.12));
        const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
        const pts = curve.getPoints(50);
        const geo = new THREE.BufferGeometry().setFromPoints(pts);
        const col = palette[(i + j) % palette.length];
        const mat = new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending });
        grp.add(new THREE.Line(geo, mat));
        const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        grp.add(pulse);
        arcs.push({ curve, pulse, t: Math.random(), speed: 0.004 + Math.random() * 0.006, mat });
      }
    });

    /* ---- Interaction: drag to spin + mouse parallax tilt + hover labels ---- */
    let dragging = false, lastX = 0, lastY = 0, velY = 0.003, velX = 0;
    let tiltX = 0.1, tiltY = 0, targetTiltX = 0.1, targetTiltY = 0;
    const ray = new THREE.Raycaster(); const mouse = new THREE.Vector2(); let hoverEl = null;

    mount.addEventListener('pointerdown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; mount.style.cursor = 'grabbing'; });
    window.addEventListener('pointerup', () => { dragging = false; mount.style.cursor = 'grab'; });
    mount.addEventListener('pointermove', (e) => {
      const r = mount.getBoundingClientRect();
      mouse.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      mouse.y = -((e.clientY - r.top) / r.height) * 2 + 1;
      targetTiltY = mouse.x * 0.3; targetTiltX = 0.1 - mouse.y * 0.25;
      if (dragging) {
        velY = (e.clientX - lastX) * 0.005;
        velX = (e.clientY - lastY) * 0.004;
        grp.rotation.y += velY; grp.rotation.x = Math.max(-0.6, Math.min(0.6, grp.rotation.x + velX));
        lastX = e.clientX; lastY = e.clientY;
      }
      // hover detect
      ray.setFromCamera(mouse, cam);
      const hits = ray.intersectObjects(pins.map((p) => p.core));
      if (hits.length && label) {
        const d = hits[0].object.userData;
        label.textContent = d.city + ' · ' + d.country;
        label.style.left = (e.clientX - r.left) + 'px';
        label.style.top = (e.clientY - r.top) + 'px';
        label.classList.add('show');
        hoverEl = hits[0].object;
      } else if (label) { label.classList.remove('show'); hoverEl = null; }
    });
    mount.style.cursor = 'grab';

    let visible = true;
    new IntersectionObserver((ents) => { visible = ents[0].isIntersecting; }, { threshold: 0.01 }).observe(mount);

    function render() {
      requestAnimationFrame(render);
      if (!visible) return;
      const time = performance.now() * 0.001;
      if (!dragging && !reduceMotion) { grp.rotation.y += velY; velY += (0.003 - velY) * 0.02; }
      tiltX += (targetTiltX - tiltX) * 0.05; tiltY += (targetTiltY - tiltY) * 0.05;
      root.rotation.x = tiltX; root.rotation.y = tiltY;
      stars.rotation.y -= 0.0004;
      atmo.material.opacity = 0.07 + Math.sin(time * 1.5) * 0.02;

      pins.forEach((p) => {
        const s = 1 + Math.sin(time * 2 + p.phase) * 0.3;
        p.halo.scale.setScalar(s);
        const rs = 1 + ((time * 0.6 + p.phase) % 1.4);
        p.ring.scale.setScalar(rs);
        p.ring.material.opacity = Math.max(0, 0.6 - (rs - 1) * 0.45);
        p.core.scale.setScalar(p.core === hoverEl ? 1.8 : 1);
      });
      arcs.forEach((a) => {
        a.t += a.speed; if (a.t > 1) a.t = 0;
        a.pulse.position.copy(a.curve.getPoint(a.t));
        a.pulse.scale.setScalar(0.7 + Math.sin(a.t * Math.PI) * 0.8);
      });
      renderer.render(scene, cam);
    }
    render();

    new ResizeObserver(() => {
      cam.aspect = w() / h(); cam.updateProjectionMatrix(); renderer.setSize(w(), h());
    }).observe(mount);
  }

  /* ---------------- Contact form ---------------- */
  const form = document.getElementById('contactForm');
  form && form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('cfSubmit');
    const status = document.getElementById('formStatus');
    const payload = {
      name: document.getElementById('cf-name').value.trim(),
      email: document.getElementById('cf-email').value.trim(),
      company: document.getElementById('cf-company').value.trim(),
      message: document.getElementById('cf-message').value.trim()
    };
    status.textContent = ''; status.className = 'form-status';
    if (!payload.name || !payload.email || !payload.message) {
      status.textContent = 'Please fill in your name, email and message.'; status.classList.add('err');
      return;
    }
    btn.classList.add('is-loading');
    const mailtoFallback = () => {
      const subject = encodeURIComponent('New enquiry from ' + payload.name + (payload.company ? ' (' + payload.company + ')' : ''));
      const body = encodeURIComponent('Name: ' + payload.name + '\nEmail: ' + payload.email + (payload.company ? '\nBrand/Handle: ' + payload.company : '') + '\n\n' + payload.message);
      window.location.href = 'mailto:support@creatorlinkup.in?subject=' + subject + '&body=' + body;
      status.textContent = 'Opening your email app… or reach us directly at support@creatorlinkup.in';
      status.classList.add('ok');
      form.reset();
    };
    try {
      // Works on dynamic hosts (Hono server). On pure-static hosts the POST
      // hits a prerendered GET file (405/404) and we fall back to email.
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      let json = null; try { json = await res.json(); } catch (_) {}
      if (res.ok && json && json.ok) {
        status.textContent = json.message; status.classList.add('ok');
        form.reset();
      } else if (json && json.error) {
        status.textContent = json.error; status.classList.add('err');
      } else {
        mailtoFallback();
      }
    } catch {
      mailtoFallback();
    } finally {
      btn.classList.remove('is-loading');
    }
  });
})();
