/* ============================================================
   Creator Link Up — Hero Globe + Particle field (Three.js)
   A network globe of creator/brand nodes that travels down the
   page as the user scrolls, plus a fixed background particle field.
   ============================================================ */
(function () {
  if (typeof THREE === 'undefined') return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 760;

  /* ---------------- Background particle field ---------------- */
  const bgCanvas = document.getElementById('bg-canvas');
  if (bgCanvas) {
    const bgRenderer = new THREE.WebGLRenderer({ canvas: bgCanvas, alpha: true, antialias: true });
    bgRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    bgRenderer.setSize(window.innerWidth, window.innerHeight);
    const bgScene = new THREE.Scene();
    const bgCam = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 100);
    bgCam.position.z = 30;

    const count = isMobile ? 700 : 1500;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cA = new THREE.Color(0x8b5cff), cB = new THREE.Color(0x39e0ff), cC = new THREE.Color(0x3b7bff);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 90;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 60;
      const m = Math.random();
      const c = m < 0.4 ? cA : m < 0.7 ? cB : cC;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    const bgGeo = new THREE.BufferGeometry();
    bgGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const bgMat = new THREE.PointsMaterial({ size: 0.14, vertexColors: true, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
    const bgPoints = new THREE.Points(bgGeo, bgMat);
    bgScene.add(bgPoints);

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    window.addEventListener('mousemove', (e) => {
      tmx = (e.clientX / window.innerWidth - 0.5);
      tmy = (e.clientY / window.innerHeight - 0.5);
    });

    function bgLoop() {
      requestAnimationFrame(bgLoop);
      mx += (tmx - mx) * 0.04;
      my += (tmy - my) * 0.04;
      bgPoints.rotation.y += 0.0006;
      bgPoints.rotation.x += 0.0002;
      bgCam.position.x += (mx * 6 - bgCam.position.x) * 0.05;
      bgCam.position.y += (-my * 6 - bgCam.position.y) * 0.05;
      bgCam.lookAt(bgScene.position);
      bgRenderer.render(bgScene, bgCam);
    }
    bgLoop();

    window.addEventListener('resize', () => {
      bgCam.aspect = window.innerWidth / window.innerHeight;
      bgCam.updateProjectionMatrix();
      bgRenderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  /* ---------------- Traveling network globe ---------------- */
  const stage = document.getElementById('globe-stage');
  if (!stage) return;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  stage.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 16;

  // Lighting
  scene.add(new THREE.AmbientLight(0x404060, 1.2));
  const l1 = new THREE.PointLight(0x8b5cff, 2.4, 100); l1.position.set(10, 8, 14); scene.add(l1);
  const l2 = new THREE.PointLight(0x39e0ff, 2.0, 100); l2.position.set(-12, -6, 8); scene.add(l2);
  const l3 = new THREE.PointLight(0x3b7bff, 1.6, 100); l3.position.set(0, 14, -10); scene.add(l3);

  const globe = new THREE.Group();
  scene.add(globe);

  const R = 4.6;

  // Wireframe core sphere
  const coreGeo = new THREE.IcosahedronGeometry(R, 3);
  const coreMat = new THREE.MeshBasicMaterial({ color: 0x6a4fd0, wireframe: true, transparent: true, opacity: 0.12 });
  globe.add(new THREE.Mesh(coreGeo, coreMat));

  // Inner glow sphere
  const glowGeo = new THREE.SphereGeometry(R * 0.96, 32, 32);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x1a1240, transparent: true, opacity: 0.35 });
  globe.add(new THREE.Mesh(glowGeo, glowMat));

  // Fibonacci node distribution
  const NODE_COUNT = isMobile ? 90 : 180;
  const nodePositions = [];
  const offset = 2 / NODE_COUNT;
  const increment = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < NODE_COUNT; i++) {
    const y = i * offset - 1 + offset / 2;
    const r = Math.sqrt(1 - y * y);
    const phi = i * increment;
    nodePositions.push(new THREE.Vector3(Math.cos(phi) * r * R, y * R, Math.sin(phi) * r * R));
  }

  // Node points (creators = purple, brands = cyan)
  const npos = new Float32Array(NODE_COUNT * 3);
  const ncol = new Float32Array(NODE_COUNT * 3);
  const cCreator = new THREE.Color(0xb388ff), cBrand = new THREE.Color(0x39e0ff);
  nodePositions.forEach((v, i) => {
    npos[i * 3] = v.x; npos[i * 3 + 1] = v.y; npos[i * 3 + 2] = v.z;
    const c = i % 3 === 0 ? cBrand : cCreator;
    ncol[i * 3] = c.r; ncol[i * 3 + 1] = c.g; ncol[i * 3 + 2] = c.b;
  });
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(npos, 3));
  nodeGeo.setAttribute('color', new THREE.BufferAttribute(ncol, 3));
  const nodeMat = new THREE.PointsMaterial({ size: 0.17, vertexColors: true, transparent: true, opacity: 0.95, blending: THREE.AdditiveBlending, depthWrite: false });
  globe.add(new THREE.Points(nodeGeo, nodeMat));

  // Connection lines between nearby nodes
  const linePos = [];
  const lineCol = [];
  const maxDist = R * 0.9;
  for (let i = 0; i < NODE_COUNT; i++) {
    let links = 0;
    for (let j = i + 1; j < NODE_COUNT && links < 3; j++) {
      if (nodePositions[i].distanceTo(nodePositions[j]) < maxDist) {
        linePos.push(nodePositions[i].x, nodePositions[i].y, nodePositions[i].z);
        linePos.push(nodePositions[j].x, nodePositions[j].y, nodePositions[j].z);
        const c = new THREE.Color(0x6a6aff);
        lineCol.push(c.r, c.g, c.b, c.r, c.g, c.b);
        links++;
      }
    }
  }
  const lineGeo = new THREE.BufferGeometry();
  lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3));
  lineGeo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(lineCol), 3));
  const lineMat = new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending });
  globe.add(new THREE.LineSegments(lineGeo, lineMat));

  // Orbiting ring
  const ringGeo = new THREE.RingGeometry(R * 1.25, R * 1.28, 90);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0x39e0ff, transparent: true, opacity: 0.25, side: THREE.DoubleSide });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = Math.PI * 0.46;
  globe.add(ring);

  const ring2 = new THREE.Mesh(new THREE.RingGeometry(R * 1.45, R * 1.47, 90), new THREE.MeshBasicMaterial({ color: 0x8b5cff, transparent: true, opacity: 0.18, side: THREE.DoubleSide }));
  ring2.rotation.x = Math.PI * 0.62;
  ring2.rotation.y = Math.PI * 0.2;
  globe.add(ring2);

  // Expose globe state for GSAP choreography (app.js)
  const state = {
    posX: 0, posY: 0, posZ: 0,
    scale: 1,
    rotSpeed: 0.0016,
    extraRotX: 0, extraRotY: 0,
    opacity: 1
  };
  window.__CLU_GLOBE__ = { group: globe, state, camera };

  // Mouse parallax tilt
  let tiltX = 0, tiltY = 0, targetTiltX = 0, targetTiltY = 0;
  if (!isMobile) {
    window.addEventListener('mousemove', (e) => {
      targetTiltY = (e.clientX / window.innerWidth - 0.5) * 0.4;
      targetTiltX = (e.clientY / window.innerHeight - 0.5) * 0.4;
    });
  }

  const clock = new THREE.Clock();
  function loop() {
    requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    if (!reduceMotion) {
      globe.rotation.y += state.rotSpeed;
      ring.rotation.z += 0.0024;
      ring2.rotation.z -= 0.0018;
    }
    tiltX += (targetTiltX - tiltX) * 0.05;
    tiltY += (targetTiltY - tiltY) * 0.05;

    globe.position.set(state.posX, state.posY, state.posZ);
    globe.scale.setScalar(state.scale);
    globe.rotation.x = tiltX + state.extraRotX + Math.sin(t * 0.3) * 0.05;
    globe.rotation.z = -tiltY * 0.5 + state.extraRotY;

    nodeMat.opacity = 0.95 * state.opacity;
    lineMat.opacity = 0.18 * state.opacity;
    coreMat.opacity = 0.12 * state.opacity;
    glowMat.opacity = 0.35 * state.opacity;
    ringMat.opacity = 0.25 * state.opacity;

    l1.position.x = Math.sin(t * 0.5) * 12;
    l2.position.y = Math.cos(t * 0.4) * 10;

    renderer.render(scene, camera);
  }
  loop();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
