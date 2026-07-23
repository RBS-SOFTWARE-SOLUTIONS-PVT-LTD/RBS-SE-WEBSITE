export function initNodesCanvas() {
  const canvas = document.getElementById('nodes-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d', { alpha: true });
  let width, height;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  // Mouse position
  let mouse = { x: -1000, y: -1000, radius: 180 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  }, { passive: true });

  window.addEventListener('mouseleave', () => {
    mouse.x = -1000;
    mouse.y = -1000;
  }, { passive: true });

  // Node particle density based on screen size (optimized count)
  const numNodes = Math.min(60, Math.floor((width * height) / 22000));
  const nodes = Array.from({ length: numNodes }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.5,
    vy: (Math.random() - 0.5) * 0.5,
    radius: Math.random() * 2 + 1.5,
    pulse: Math.random() * Math.PI * 2,
    pulseSpeed: Math.random() * 0.03 + 0.01,
  }));

  // Data packets traversing the node network
  const packets = Array.from({ length: 10 }, () => ({
    fromNode: Math.floor(Math.random() * nodes.length),
    toNode: Math.floor(Math.random() * nodes.length),
    progress: Math.random(),
    speed: Math.random() * 0.012 + 0.005,
  }));

  let animFrameId = null;
  let isVisible = true;

  // Pause rendering when canvas is not visible in viewport
  const observer = new IntersectionObserver((entries) => {
    isVisible = entries[0].isIntersecting;
    if (isVisible && !animFrameId) {
      draw();
    }
  }, { threshold: 0.05 });

  observer.observe(canvas);

  function update() {
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      const dx = mouse.x - node.x;
      const dy = mouse.y - node.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius && dist > 0) {
        const force = (mouse.radius - dist) / mouse.radius;
        node.x -= (dx / dist) * force * 2.5;
        node.y -= (dy / dist) * force * 2.5;
      }

      node.pulse += node.pulseSpeed;
    });

    packets.forEach(packet => {
      packet.progress += packet.speed;
      if (packet.progress >= 1) {
        packet.progress = 0;
        packet.fromNode = packet.toNode;
        packet.toNode = Math.floor(Math.random() * nodes.length);
      }
    });
  }

  function draw() {
    if (!isVisible) {
      animFrameId = null;
      return;
    }

    ctx.clearRect(0, 0, width, height);

    // Draw node connection lines
    const maxDist = 130;
    ctx.lineWidth = 1;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.22;
          ctx.strokeStyle = `rgba(168, 85, 247, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw flowing data packets (optimized without heavy shadowBlur)
    packets.forEach(packet => {
      const n1 = nodes[packet.fromNode];
      const n2 = nodes[packet.toNode];
      if (!n1 || !n2) return;

      const dx = n2.x - n1.x;
      const dy = n2.y - n1.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < maxDist * 1.5) {
        const px = n1.x + dx * packet.progress;
        const py = n1.y + dy * packet.progress;

        ctx.fillStyle = 'rgba(232, 121, 249, 0.25)';
        ctx.beginPath();
        ctx.arc(px, py, 4.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#E879F9';
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const glow = Math.sin(node.pulse) * 0.5 + 0.5;

      ctx.fillStyle = `rgba(168, 85, 247, ${0.15 + glow * 0.2})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius + 3 + glow * 2, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(232, 121, 249, ${0.7 + glow * 0.3})`;
      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw line from mouse to nearby nodes
    if (mouse.x > 0 && mouse.y > 0) {
      nodes.forEach(node => {
        const dx = mouse.x - node.x;
        const dy = mouse.y - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const alpha = (1 - dist / mouse.radius) * 0.35;
          ctx.strokeStyle = `rgba(232, 121, 249, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(node.x, node.y);
          ctx.stroke();
        }
      });
    }

    update();
    animFrameId = requestAnimationFrame(draw);
  }

  draw();
}
