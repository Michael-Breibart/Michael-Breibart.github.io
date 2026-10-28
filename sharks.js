/* Original, software-rendered sharks. Canvas 2D + ASCII; no WebGL or libraries. */
(() => {
  const canvas = document.getElementById('sharks');
  const context = canvas.getContext('2d');
  if (!context) return;
  const ocean = document.getElementById('ocean');
  const fallback = document.getElementById('ocean-fallback');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const scratch = document.createElement('canvas');
  scratch.width = scratch.height = 176;
  const raster = scratch.getContext('2d', { willReadFrequently: true });
  if (!raster) return;

  const vertices = [];
  const faces = [];
  const rings = [
    [-1.55, 0.015], [-1.43, 0.12], [-1.22, 0.22], [-0.9, 0.29],
    [-0.5, 0.32], [-0.1, 0.29], [0.3, 0.23], [0.7, 0.16],
    [1.05, 0.10], [1.35, 0.055], [1.6, 0.035]
  ];
  const sides = 12;
  for (const [x, radius] of rings) {
    for (let i = 0; i < sides; i++) {
      const angle = i / sides * Math.PI * 2;
      vertices.push([x, Math.sin(angle) * radius * 0.94, Math.cos(angle) * radius * 1.14]);
    }
  }
  for (let ring = 0; ring < rings.length - 1; ring++) {
    for (let i = 0; i < sides; i++) {
      const a = ring * sides + i;
      const b = (ring + 1) * sides + i;
      const c = (ring + 1) * sides + (i + 1) % sides;
      const d = ring * sides + (i + 1) % sides;
      faces.push([a, b, c, 0], [a, c, d, 0]);
    }
  }
  function fin(points) {
    const offset = vertices.length;
    vertices.push(...points);
    for (let i = 1; i < points.length - 1; i++) faces.push([offset, offset + i, offset + i + 1, 1]);
  }
  // Dorsal fin, swept pectoral fins, pelvic fins, and an asymmetric caudal fin.
  fin([[-0.55, 0.24, 0], [-0.12, 0.76, 0], [0.35, 0.20, 0]]);
  for (const side of [-1, 1]) {
    fin([[-0.80, -0.04, 0.22 * side], [0.05, -0.22, 0.94 * side],
      [0.18, -0.13, 0.78 * side], [-0.08, -0.10, 0.18 * side]]);
    fin([[0.53, -0.03, 0.15 * side], [1.03, -0.14, 0.40 * side], [0.95, -0.08, 0.07 * side]]);
  }
  fin([[1.50, 0, 0], [2.16, 0.96, 0], [2.05, 0.46, 0], [1.88, 0.08, 0]]);
  fin([[1.50, 0, 0], [1.88, 0.08, 0], [2.13, -0.48, 0], [1.88, -0.34, 0]]);

  const glyphs = '.:-=+*x%#@';
  const blues = ['#285881', '#153b62', '#081f3d'];
  const LOOP_SECONDS = 15;
  const FRAME_INTERVAL = 1000 / 30;
  const sharks = [
    { scale: 0.94, phase: 0.4 },
    { scale: 1.00, phase: 0.4 + Math.PI * 2 / 3 },
    { scale: 0.86, phase: 0.4 + Math.PI * 4 / 3 }
  ];
  let width = 1;
  let height = 1;
  let time = 0;
  let lastTime = 0;
  let frameId = 0;
  let inView = true;
  let paused = reducedMotion.matches;
  let waterTime = 0;
  let waterGradient;
  const ripples = [];
  const pointer = { x: 0.5, y: 0.5, active: false };
  let lastRippleTime = -1;
  let lastRippleX = -1;
  let lastRippleY = -1;
  const waterShades = Array.from({ length: 24 }, (_, i) => {
    const amount = i / 23;
    return `rgba(236,252,255,${(0.015 + amount * 0.16).toFixed(3)})`;
  });

  function transform(point, phase, angle, yaw, bank) {
    let [x, y, z] = point;
    // A traveling body wave grows toward the tail, with independent fin flex.
    const tail = Math.max(0, x + 1.2) / 3.4;
    z += Math.sin(phase - x * 2.2) * (0.016 + tail * tail * 0.30);
    y += Math.sin(phase - x * 1.3) * 0.012;
    if (Math.abs(z) > 0.43 && x < 1.2) {
      y += Math.sin(phase + 0.8 - x) * Math.abs(z) * 0.065;
    }
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const pitch = -0.64 + bank;
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
    return [rx * Math.cos(angle) - ry * Math.sin(angle),
      rx * Math.sin(angle) + ry * Math.cos(angle), depth];
  }

  function sharkPose(shark, index, seconds, viewWidth, viewHeight) {
    const small = viewWidth < 520;
    const cycle = ((seconds % LOOP_SECONDS + LOOP_SECONDS) % LOOP_SECONDS) / LOOP_SECONDS * Math.PI * 2;
    // Harmonic turns, depth changes, and variable speed still close every 15s.
    const orbit = cycle + (small ? 0.4 + index * Math.PI : shark.phase);
    const bend = orbit + Math.sin(orbit * 2 + shark.phase) * 0.23;
    const bendSpeed = 1 + Math.cos(orbit * 2 + shark.phase) * 0.46;
    const radiusX = viewWidth * (small ? 0.24 : 0.27);
    const radiusY = viewHeight * 0.27;
    const velocityX = -Math.sin(bend) * radiusX * bendSpeed + Math.cos(orbit * 3 + shark.phase) * viewWidth * 0.105;
    const velocityY = Math.cos(bend) * radiusY * bendSpeed + Math.cos(orbit * 2 - shark.phase) * viewHeight * 0.07;
    const depth = 0.5 + Math.sin(orbit * 2 + shark.phase) * 0.5;
    return {
      angle: Math.atan2(velocityY, -velocityX),
      phase: cycle * 9 + shark.phase,
      yaw: 0.18 + Math.sin(orbit * 2 + 0.4) * 0.30,
      bank: Math.sin(orbit * 2 - shark.phase) * 0.16,
      size: Math.min(viewWidth * (small ? 0.86 : 0.63), viewHeight * 0.66, 610) * shark.scale * (0.91 + depth * 0.12),
      x: viewWidth * 0.50 + Math.cos(bend) * radiusX + Math.sin(orbit * 3 + shark.phase) * viewWidth * 0.035,
      y: viewHeight * 0.50 + Math.sin(bend) * radiusY + Math.sin(orbit * 2 - shark.phase) * viewHeight * 0.035
    };
  }

  function drawShark(shark, index) {
    const { angle, phase, yaw, bank, size, x, y } = sharkPose(shark, index, time, width, height);
    const points = vertices.map(point => transform(point, phase, angle, yaw, bank));
    const triangles = faces.map(face => {
      const [a, b, c] = face.map(i => points[i]);
      const ab = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
      const ac = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const normal = [ab[1] * ac[2] - ab[2] * ac[1], ab[2] * ac[0] - ab[0] * ac[2], ab[0] * ac[1] - ab[1] * ac[0]];
      const length = Math.hypot(...normal) || 1;
      const light = Math.abs((-0.3 * normal[0] - 0.7 * normal[1] + 0.65 * normal[2]) / length);
      return { a, b, c, depth: (a[2] + b[2] + c[2]) / 3, light: face[3] ? 0.38 + light * 0.30 : 0.15 + light * 0.67 };
    }).sort((a, b) => a.depth - b.depth);
    raster.clearRect(0, 0, 176, 176);
    for (const { a, b, c, light } of triangles) {
      const value = Math.round(35 + light * 175);
      raster.fillStyle = `rgb(${value},${value},${value})`;
      raster.beginPath();
      raster.moveTo(78 + a[0] * 32, 88 - a[1] * 32);
      raster.lineTo(78 + b[0] * 32, 88 - b[1] * 32);
      raster.lineTo(78 + c[0] * 32, 88 - c[1] * 32);
      raster.closePath();
      raster.fill();
    }
    // A dark eye helps the silhouette read as a shark rather than a generic fish.
    const eye = transform([-1.28, 0.055, 0.18], phase, angle, yaw, bank);
    raster.fillStyle = '#171717';
    raster.beginPath();
    raster.arc(78 + eye[0] * 32, 88 - eye[1] * 32, 1.25, 0, Math.PI * 2);
    raster.fill();

    const data = raster.getImageData(0, 0, 176, 176).data;
    const cellX = width > 1300 ? 7 : 6;
    const cellY = cellX * 1.35;
    const cols = Math.ceil(size / cellX);
    const rows = Math.ceil(size / cellY);
    const left = x - size / 2;
    const top = y - size / 2;
    context.font = `${cellY}px "Courier New", monospace`;
    context.textBaseline = 'top';
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const sx = Math.min(175, Math.floor((col + 0.5) / cols * 176));
        const sy = Math.min(175, Math.floor((row + 0.5) / rows * 176));
        const offset = (sy * 176 + sx) * 4;
        const alpha = data[offset + 3] / 255;
        if (alpha < 0.35) continue;
        const shade = (1 - data[offset] / 255) * alpha;
        const noise = Math.sin(col * 127.1 + row * 311.7 + index * 41.3) * 43758.5453;
        const grain = noise - Math.floor(noise);
        const density = Math.min(0.99, Math.max(0, shade * 1.18 + grain * 0.13));
        const px = left + col * cellX;
        const py = top + row * cellY;
        const blue = Math.min(2, Math.floor(density * 3));
        context.fillStyle = blues[blue];
        context.fillRect(px, py + 1, cellX - 0.5, cellY - 0.6);
        context.fillStyle = blues[blue === 2 ? 0 : 2];
        context.fillText(glyphs[Math.floor(density * (glyphs.length - 1))], px, py);
      }
    }
  }

  function drawWater() {
    context.fillStyle = waterGradient;
    context.fillRect(0, 0, width, height);
    const cycle = time / LOOP_SECONDS * Math.PI * 2;
    const liveRipples = ripples.map(ripple => ({
      x: ripple.x * width, y: ripple.y * height,
      age: waterTime - ripple.born, strength: ripple.strength
    })).filter(ripple => ripple.age < 3.2);
    const cell = width < 520 ? 22 : 26;
    // Light moving through the water; low-contrast tiles keep sharks distinct.
    for (let y = 0; y < height; y += cell) {
      for (let x = 0; x < width; x += cell) {
        let light = Math.sin(x * 0.011 + cycle * 2) * 0.25
          + Math.sin(y * 0.016 - cycle) * 0.19
          + Math.sin((x + y) * 0.008 + cycle) * 0.12;
        let displacement = 0;
        for (const ripple of liveRipples) {
          const distance = Math.hypot(x - ripple.x, y - ripple.y);
          const edge = distance - ripple.age * 110;
          const envelope = Math.exp(-edge * edge / 1700) * (1 - ripple.age / 3.2) * ripple.strength;
          const wave = Math.sin(edge * 0.11) * envelope;
          light += wave * 0.75;
          displacement += wave * 3;
        }
        const shade = Math.max(0, Math.min(23, Math.round((light + 0.65) / 1.3 * 23)));
        context.fillStyle = waterShades[shade];
        context.fillRect(x + displacement, y - displacement, cell - 0.5, cell - 0.5);
      }
    }
    if (pointer.active) {
      const x = pointer.x * width;
      const y = pointer.y * height;
      const glow = context.createRadialGradient(x, y, 0, x, y, 105);
      glow.addColorStop(0, 'rgba(242,253,255,0.35)');
      glow.addColorStop(1, 'rgba(242,253,255,0)');
      context.fillStyle = glow;
      context.fillRect(x - 105, y - 105, 210, 210);
    }
    while (ripples.length && waterTime - ripples[0].born > 3.2) ripples.shift();
  }

  function drawWake(shark, index) {
    // Curved capillary wakes follow the actual earlier swimming trajectory.
    for (let trail = 1; trail <= 9; trail++) {
      const pose = sharkPose(shark, index, time - trail * 0.10, width, height);
      const x = pose.x + Math.cos(pose.angle) * pose.size * 0.29;
      const y = pose.y - Math.sin(pose.angle) * pose.size * 0.29;
      const spread = 3 + trail * 1.7;
      context.strokeStyle = `rgba(239,253,255,${0.16 * (1 - trail / 10)})`;
      context.lineWidth = 1.1;
      context.beginPath();
      context.ellipse(x, y, spread, spread * 0.45, -pose.angle, 0, Math.PI * 2);
      context.stroke();
    }
  }

  function draw() {
    drawWater();
    const count = width < 520 ? 2 : 3;
    for (let i = 0; i < count; i++) drawWake(sharks[i], i);
    for (let i = 0; i < count; i++) drawShark(sharks[i], i);
    fallback.hidden = true;
  }

  function frame(now) {
    frameId = 0;
    if (paused || document.hidden || !inView) return;
    if (now - lastTime >= FRAME_INTERVAL) {
      const elapsed = (now - lastTime) / 1000;
      time = (time + elapsed) % LOOP_SECONDS;
      waterTime += elapsed;
      lastTime = now;
      draw();
    }
    frameId = requestAnimationFrame(frame);
  }

  function updateMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    if (!paused && !document.hidden && inView) {
      lastTime = performance.now();
      frameId = requestAnimationFrame(frame);
    }
  }

  function resize() {
    const bounds = ocean.getBoundingClientRect();
    width = Math.max(1, Math.round(bounds.width));
    height = Math.max(1, Math.round(bounds.height));
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    context.setTransform(dpr, 0, 0, dpr, 0, 0);
    waterGradient = context.createLinearGradient(0, 0, width * 0.8, height);
    waterGradient.addColorStop(0, '#d0eaf2');
    waterGradient.addColorStop(0.48, '#add2e4');
    waterGradient.addColorStop(1, '#87b6d4');
    ripples.length = 0;
    draw();
  }
  new ResizeObserver(resize).observe(ocean);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    updateMotion();
  }).observe(ocean);
  function disturbWater(event, splash = false) {
    if (event.pointerType === 'touch' && !splash) return;
    const bounds = ocean.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / width;
    const y = (event.clientY - bounds.top) / height;
    const distance = Math.hypot((x - lastRippleX) * width, (y - lastRippleY) * height);
    pointer.x = x;
    pointer.y = y;
    pointer.active = true;
    if (!paused && (splash || (waterTime - lastRippleTime > 0.075 && distance > 10))) {
      ripples.push({ x, y, born: waterTime, strength: splash ? 1.3 : Math.min(1, 0.35 + distance / 85) });
      if (ripples.length > 12) ripples.shift();
      lastRippleTime = waterTime;
      lastRippleX = x;
      lastRippleY = y;
    }
    // OS reduced-motion still permits immediate, stationary cursor lighting.
    if (paused) draw();
  }
  ocean.addEventListener('pointermove', event => disturbWater(event), { passive: true });
  ocean.addEventListener('pointerdown', event => disturbWater(event, true), { passive: true });
  ocean.addEventListener('pointerleave', () => {
    pointer.active = false;
    lastRippleX = lastRippleY = -1;
    if (paused) draw();
  });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  resize();
  updateMotion();
})();
