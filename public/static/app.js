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
      <article class="creator-card" data-stagger>
        <div class="creator-media">
          <span class="creator-cat">${c.category}</span>
          <span class="creator-flag">${c.country}</span>
          <img src="${c.img}" alt="${c.name}" loading="lazy" onerror="this.style.background='linear-gradient(135deg,#1a1240,#0a1a2e)';this.style.objectFit='cover'" />
          <div class="creator-info">
            <h3>${c.name}</h3>
            <div class="handle">${c.handle}</div>
            <div class="creator-foll"><i class="fas fa-users"></i> ${c.followers} followers</div>
          </div>
        </div>
      </article>`).join('');
    requestAnimationFrame(() => {
      grid.querySelectorAll('[data-stagger]').forEach((el, i) => {
        setTimeout(() => el.classList.add('in'), i * 60);
      });
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
    { step: 'Step 03', title: 'Creator Selection', desc: 'We match you with vetted India & UK creators whose audience fits your brand.' },
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
    const w = () => mount.clientWidth, h = () => mount.clientHeight;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w(), h());
    mount.appendChild(renderer.domElement);
    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(45, w() / h(), 0.1, 100);
    cam.position.z = 11;
    scene.add(new THREE.AmbientLight(0x6060a0, 1.4));
    const pl = new THREE.PointLight(0x8b5cff, 2, 50); pl.position.set(8, 6, 10); scene.add(pl);

    const grp = new THREE.Group(); scene.add(grp);
    const R = 3.4;
    // wire sphere
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(R, 28, 28), new THREE.MeshBasicMaterial({ color: 0x3a2f7a, wireframe: true, transparent: true, opacity: 0.16 })));
    grp.add(new THREE.Mesh(new THREE.SphereGeometry(R * 0.98, 32, 32), new THREE.MeshBasicMaterial({ color: 0x12102e, transparent: true, opacity: 0.4 })));

    function toVec(lat, lon) {
      const phi = (90 - lat) * Math.PI / 180;
      const theta = (lon + 180) * Math.PI / 180;
      return new THREE.Vector3(-R * Math.sin(phi) * Math.cos(theta), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(theta));
    }

    const pins = [];
    nodes.forEach((n) => {
      const v = toVec(n.lat, n.lon);
      const color = n.country === 'IN' ? 0xff9f1c : 0x39e0ff;
      const m = new THREE.Mesh(new THREE.SphereGeometry(0.1, 12, 12), new THREE.MeshBasicMaterial({ color }));
      m.position.copy(v); grp.add(m);
      const halo = new THREE.Mesh(new THREE.SphereGeometry(0.2, 12, 12), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.3 }));
      halo.position.copy(v); grp.add(halo);
      pins.push({ v, halo, base: 0.2 });
    });

    // connection arcs between IN and UK clusters
    const inNodes = nodes.filter((n) => n.country === 'IN').map((n) => toVec(n.lat, n.lon));
    const ukNodes = nodes.filter((n) => n.country === 'UK').map((n) => toVec(n.lat, n.lon));
    const arcs = [];
    inNodes.forEach((a) => ukNodes.forEach((b) => {
      const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(R * 1.5);
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const geo = new THREE.BufferGeometry().setFromPoints(curve.getPoints(40));
      const mat = new THREE.LineBasicMaterial({ color: 0x8b5cff, transparent: true, opacity: 0.35 });
      const line = new THREE.Line(geo, mat);
      grp.add(line);
      // traveling pulse
      const pulse = new THREE.Mesh(new THREE.SphereGeometry(0.07, 8, 8), new THREE.MeshBasicMaterial({ color: 0xb388ff }));
      grp.add(pulse);
      arcs.push({ curve, pulse, t: Math.random() });
    }));

    let raf;
    function render() {
      raf = requestAnimationFrame(render);
      grp.rotation.y += 0.0022;
      const time = performance.now() * 0.002;
      pins.forEach((p, i) => { const s = 1 + Math.sin(time + i) * 0.25; p.halo.scale.setScalar(s); });
      arcs.forEach((a) => {
        a.t += 0.006; if (a.t > 1) a.t = 0;
        const pt = a.curve.getPoint(a.t);
        a.pulse.position.copy(pt);
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
    btn.classList.add('is-loading');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (res.ok && json.ok) {
        status.textContent = json.message; status.classList.add('ok');
        form.reset();
      } else {
        status.textContent = json.error || 'Something went wrong.'; status.classList.add('err');
      }
    } catch {
      status.textContent = 'Network error. Please try again.'; status.classList.add('err');
    } finally {
      btn.classList.remove('is-loading');
    }
  });
})();
