// Magnetic Cursor & Interactive Pull Physics

export function initMagneticCursor() {
  const cursor = document.getElementById('custom-cursor');
  const follower = document.getElementById('custom-cursor-follower');
  
  if (!cursor || !follower) return;

  // Disable custom cursor on touch screens to save performance & prevent mobile scroll lag
  const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || window.matchMedia('(pointer: coarse)').matches;
  if (isTouchDevice) {
    cursor.style.display = 'none';
    follower.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let followerX = -100;
  let followerY = -100;

  // Track mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  // Smooth lerp follower loop
  function render() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;

    follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);

  // Magnetic Buttons hover logic
  const magneticElements = document.querySelectorAll('.magnetic-btn, [data-magnetic]');

  magneticElements.forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center
      const distanceX = e.clientX - centerX;
      const distanceY = e.clientY - centerY;

      // Pull strength factor (0.35)
      const pullX = distanceX * 0.35;
      const pullY = distanceY * 0.35;

      el.style.transform = `translate3d(${pullX}px, ${pullY}px, 0) scale(1.03)`;
      document.body.classList.add('cursor-hover');
    }, { passive: true });

    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate3d(0px, 0px, 0px) scale(1)';
      document.body.classList.remove('cursor-hover');
    });
  });

  // General hover elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, .glowing-border-card');
  hoverables.forEach((el) => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}
