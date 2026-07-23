import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSplineContainer() {
  const container = document.getElementById('spline-container');
  const canvas = document.getElementById('spline-fallback-canvas');

  if (!container) return;

  // Add subtle parallax on scroll to the container
  gsap.to(container, {
    y: 60,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero-section',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });

  // If user hasn't added custom Spline iframe/code, run fallback interactive 3D Canvas visual
  if (canvas && !container.querySelector('iframe') && !container.querySelector('spline-viewer')) {
    initFallback3DCanvas(canvas);
  }
}

// 3D Wireframe Torus & Cyber Sphere Fallback Visual
function initFallback3DCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = canvas.parentElement.clientWidth;
    height = canvas.height = canvas.parentElement.clientHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  let rotationX = 0;
  let rotationY = 0;
  let rotationZ = 0;

  // Mouse interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;

  window.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
      mouseX = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
      mouseY = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
      targetRotationY = mouseX * 1.5;
      targetRotationX = -mouseY * 1.5;
    }
  });

  // Generate 3D Torus Vertices
  const R = Math.min(width, height) * 0.28; // Major radius
  const r = R * 0.45; // Minor radius
  const numR = 24;
  const numr = 16;
  const points = [];

  for (let i = 0; i < numR; i++) {
    const u = (i / numR) * Math.PI * 2;
    for (let j = 0; j < numr; j++) {
      const v = (j / numr) * Math.PI * 2;
      const x = (R + r * Math.cos(v)) * Math.cos(u);
      const y = (R + r * Math.cos(v)) * Math.sin(u);
      const z = r * Math.sin(v);
      points.push({ x, y, z, u, v });
    }
  }

  // Floating Cyber Particles around 3D Torus
  const particles = Array.from({ length: 60 }, () => ({
    x: (Math.random() - 0.5) * width * 0.8,
    y: (Math.random() - 0.5) * height * 0.8,
    z: (Math.random() - 0.5) * 300,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 0.02 + 0.005,
    angle: Math.random() * Math.PI * 2
  }));

  function project(p, rx, ry, rz) {
    // Rotation X
    let y1 = p.y * Math.cos(rx) - p.z * Math.sin(rx);
    let z1 = p.y * Math.sin(rx) + p.z * Math.cos(rx);
    let x1 = p.x;

    // Rotation Y
    let x2 = x1 * Math.cos(ry) + z1 * Math.sin(ry);
    let z2 = -x1 * Math.sin(ry) + z1 * Math.cos(ry);
    let y2 = y1;

    // Rotation Z
    let x3 = x2 * Math.cos(rz) - y2 * Math.sin(rz);
    let y3 = x2 * Math.sin(rz) + y2 * Math.cos(rz);
    let z3 = z2;

    // Perspective projection
    const fov = 450;
    const scale = fov / (fov + z3 + 250);
    const projX = x3 * scale + width / 2;
    const projY = y3 * scale + height / 2;

    return { x: projX, y: projY, scale, z: z3 };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Smooth rotational lerp
    rotationY += 0.008 + (targetRotationY - rotationY) * 0.05;
    rotationX += 0.004 + (targetRotationX - rotationX) * 0.05;
    rotationZ += 0.003;

    // Draw glowing center aura
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 10, width / 2, height / 2, Math.min(width, height) * 0.45);
    gradient.addColorStop(0, 'rgba(168, 85, 247, 0.25)');
    gradient.addColorStop(0.5, 'rgba(147, 51, 234, 0.08)');
    gradient.addColorStop(1, 'rgba(3, 2, 6, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Render 3D Floating Particles
    particles.forEach(p => {
      p.angle += p.speed;
      p.y += Math.sin(p.angle) * 0.4;
      const proj = project(p, rotationX * 0.5, rotationY * 0.5, rotationZ * 0.5);

      if (proj.scale > 0) {
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, p.size * proj.scale, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232, 121, 249, ${Math.min(1, proj.scale * 0.7)})`;
        ctx.shadowColor = '#A855F7';
        ctx.shadowBlur = 8;
        ctx.fill();
      }
    });

    // Render Torus Wireframe
    const projected = points.map(p => project(p, rotationX, rotationY, rotationZ));

    ctx.lineWidth = 1.2;
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#A855F7';

    for (let i = 0; i < numR; i++) {
      for (let j = 0; j < numr; j++) {
        const idx1 = i * numr + j;
        const idx2 = i * numr + ((j + 1) % numr);
        const idx3 = ((i + 1) % numR) * numr + j;

        const p1 = projected[idx1];
        const p2 = projected[idx2];
        const p3 = projected[idx3];

        if (p1.scale > 0 && p2.scale > 0) {
          const alpha = Math.max(0.1, (p1.z + 100) / 250);
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha * 0.6})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        }

        if (p1.scale > 0 && p3.scale > 0) {
          const alpha = Math.max(0.1, (p1.z + 100) / 250);
          ctx.strokeStyle = `rgba(59, 130, 246, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p3.x, p3.y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
