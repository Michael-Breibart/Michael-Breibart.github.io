/* Original, software-rendered sharks. Canvas 2D + ASCII; no WebGL or libraries. */
(() => {
  const canvas = document.getElementById('sharks');
  const context = canvas.getContext('2d');
  if (!context) return;
  const ocean = document.getElementById('ocean');
  const fallback = document.getElementById('ocean-fallback');
  const toggle = document.getElementById('motion-toggle');
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

  function transform(point, phase, angle, yaw) {
    let [x, y, z] = point;
    // Tail movement increases toward the caudal fin; the nose stays steady.
    const tail = Math.max(0, x + 0.1);
    z += Math.sin(phase - x * 2.0) * tail * tail * 0.065;
    const rx = x * Math.cos(yaw) + z * Math.sin(yaw);
    const rz = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const pitch = -0.64;
    const ry = y * Math.cos(pitch) - rz * Math.sin(pitch);
    const depth = y * Math.sin(pitch) + rz * Math.cos(pitch);
    return [rx * Math.cos(angle) - ry * Math.sin(angle),
      rx * Math.sin(angle) + ry * Math.cos(angle), depth];
  }

  function sharkPose(shark, index, seconds, viewWidth, viewHeight) {
    const small = viewWidth < 520;
    const cycle = (seconds % LOOP_SECONDS) / LOOP_SECONDS * Math.PI * 2;
    // Every component is periodic: position, heading, body turn, and tail beat.
    const orbit = cycle + (small ? 0.4 + index * Math.PI : shark.phase);
    const radiusX = viewWidth * (small ? 0.25 : 0.28);
    const radiusY = viewHeight * 0.29;
    const velocityX = -Math.sin(orbit) * radiusX + Math.cos(orbit * 2) * viewWidth * 0.05;
    const velocityY = Math.cos(orbit) * radiusY;
    return {
      angle: Math.atan2(velocityY, -velocityX),
      phase: cycle * 9 + shark.phase,
      yaw: 0.18 + Math.sin(orbit + 0.4) * 0.23,
      size: Math.min(viewWidth * (small ? 0.86 : 0.63), viewHeight * 0.66, 610) * shark.scale,
      x: viewWidth * 0.50 + Math.cos(orbit) * radiusX + Math.sin(orbit * 2) * viewWidth * 0.025,
      y: viewHeight * 0.50 + Math.sin(orbit) * radiusY
    };
  }

  function drawShark(shark, index) {
    const { angle, phase, yaw, size, x, y } = sharkPose(shark, index, time, width, height);
    const points = vertices.map(point => transform(point, phase, angle, yaw));
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
    const eye = transform([-1.28, 0.055, 0.18], phase, angle, yaw);
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

  function draw() {
    context.clearRect(0, 0, width, height);
    const count = width < 520 ? 2 : 3;
    for (let i = 0; i < count; i++) drawShark(sharks[i], i);
    // A handful of quiet characters suggest suspended particles in the water.
    context.font = '9px "Courier New", monospace';
    context.fillStyle = 'rgba(45,90,133,0.21)';
    for (let i = 0; i < 38; i++) {
      const x = ((Math.sin(i * 76.31) * 14321.23) % 1 + 1) % 1 * width;
      const cycle = time / LOOP_SECONDS * Math.PI * 2;
      const y = (i * 43.7) % height + Math.sin(cycle + i) * 8;
      context.fillText(i % 4 === 0 ? '+' : '·', x, y);
    }
    fallback.hidden = true;
  }

  function frame(now) {
    frameId = 0;
    if (paused || document.hidden || !inView) return;
    if (now - lastTime >= FRAME_INTERVAL) {
      time = (time + (now - lastTime) / 1000) % LOOP_SECONDS;
      lastTime = now;
      draw();
    }
    frameId = requestAnimationFrame(frame);
  }

  function updateMotion() {
    cancelAnimationFrame(frameId);
    frameId = 0;
    toggle.textContent = paused ? 'Play' : 'Pause';
    toggle.setAttribute('aria-label', paused ? 'Play shark animation' : 'Pause shark animation');
    toggle.setAttribute('aria-pressed', String(paused));
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
    draw();
  }
  new ResizeObserver(resize).observe(ocean);
  new IntersectionObserver(entries => {
    inView = entries[0].isIntersecting;
    updateMotion();
  }).observe(ocean);
  toggle.addEventListener('click', () => { paused = !paused; updateMotion(); });
  reducedMotion.addEventListener('change', event => { paused = event.matches; updateMotion(); });
  document.addEventListener('visibilitychange', updateMotion);
  toggle.hidden = false;
  resize();
  updateMotion();
})();
