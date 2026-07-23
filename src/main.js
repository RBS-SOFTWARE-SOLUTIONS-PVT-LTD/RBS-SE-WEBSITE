import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { createIcons, Shield, Cpu, Lock, Terminal, Zap, Server, Activity, ArrowRight, CheckCircle2, ChevronRight, Sparkles, Layers, Globe, Code, FileText, Send, X } from 'lucide';

import './style.css';
import { initMagneticCursor } from './js/cursor.js';
import { initPreloader } from './js/preloader.js';
import { initSplineContainer } from './js/splineContainer.js';
import { initTiltCards } from './js/tiltCards.js';
import { initNodesCanvas } from './js/nodesCanvas.js';
import { initCodeTerminal } from './js/codeTerminal.js';

gsap.registerPlugin(ScrollTrigger);

// Main Application Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  createIcons({
    icons: {
      Shield,
      Cpu,
      Lock,
      Terminal,
      Zap,
      Server,
      Activity,
      ArrowRight,
      CheckCircle2,
      ChevronRight,
      Sparkles,
      Layers,
      Globe,
      Code,
      FileText,
      Send,
      X
    }
  });

  // 1. Initialize Lenis Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 1,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // 2. Initialize Interactive Background Canvas & Cursor
  initNodesCanvas();
  initMagneticCursor();

  // 3. Initialize Preloader & Hero Entrance Sequence
  initPreloader(() => {
    animateHeroEntrance();
  });

  // 4. Initialize 3D Spline Container & 3D Tilt Cards
  initSplineContainer();
  initTiltCards();
  initCodeTerminal();

  // 5. Setup ScrollTrigger Animations across sections
  initScrollAnimations();

  // 6. Interactive Solution Scope Calculator
  initScopeCalculator();

  // 7. Interactive Contact Modal
  initContactModal();
});

// GSAP Hero Letter-by-Letter Entrance Animation
function animateHeroEntrance() {
  const letters = document.querySelectorAll('.hero-letter');
  const heroSub = document.getElementById('hero-subtext');
  const heroCtas = document.getElementById('hero-cta-group');
  const heroBadges = document.getElementById('hero-badges');

  const tl = gsap.timeline();

  if (letters.length > 0) {
    tl.to(letters, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.03,
      ease: 'back.out(1.7)'
    });
  }

  tl.to([heroSub, heroCtas, heroBadges], {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  }, '-=0.4');
}

// Scroll Trigger Animations for Page Sections
function initScrollAnimations() {
  // Service Cards Entrance
  gsap.from('.service-card-item', {
    y: 60,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '#services-section',
      start: 'top 80%',
    }
  });

  // Section Headers
  const sectionTitles = document.querySelectorAll('.scroll-reveal');
  sectionTitles.forEach(title => {
    gsap.from(title, {
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
      }
    });
  });

  // Animated Numbers Counter
  const counters = document.querySelectorAll('.counter-val');
  counters.forEach(counter => {
    const target = parseInt(counter.dataset.target, 10);
    const suffix = counter.dataset.suffix || '';

    gsap.to(counter, {
      innerText: target,
      duration: 2,
      snap: { innerText: 1 },
      ease: 'power2.out',
      scrollTrigger: {
        trigger: counter,
        start: 'top 90%',
      },
      onUpdate: function () {
        counter.textContent = Math.ceil(this.targets()[0].innerText) + suffix;
      }
    });
  });
}

// Interactive Solution Scope Calculator Logic
function initScopeCalculator() {
  const sliders = document.querySelectorAll('.scope-slider');
  const costEl = document.getElementById('calc-estimated-cost');
  const timeEl = document.getElementById('calc-estimated-time');

  if (!costEl || !timeEl) return;

  function updateCalculation() {
    let baseCost = 15000;
    let baseWeeks = 4;

    sliders.forEach(slider => {
      const val = parseInt(slider.value, 10);
      const multiplier = parseFloat(slider.dataset.multiplier || 1);
      baseCost += val * multiplier * 2500;
      baseWeeks += val * 0.8;
    });

    costEl.textContent = `$${baseCost.toLocaleString()}`;
    timeEl.textContent = `${Math.ceil(baseWeeks)} Weeks`;
  }

  sliders.forEach(slider => {
    slider.addEventListener('input', updateCalculation);
  });
}

// Contact Modal Handling
function initContactModal() {
  const modal = document.getElementById('contact-modal');
  const openBtns = document.querySelectorAll('.open-contact-modal');
  const closeBtns = document.querySelectorAll('.close-contact-modal');
  const form = document.getElementById('contact-form');

  if (!modal) return;

  openBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      modal.classList.remove('hidden');
      modal.classList.add('flex');
      gsap.fromTo('#modal-content', { scale: 0.9, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: 'power3.out' });
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gsap.to('#modal-content', {
        scale: 0.9,
        opacity: 0,
        duration: 0.2,
        onComplete: () => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      });
    });
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerHTML = `<span>Transmitting Secure Data...</span>`;
      setTimeout(() => {
        submitBtn.innerHTML = `<i data-lucide="check-circle-2" class="w-5 h-5 text-emerald-400 inline mr-2"></i><span>Message Received!</span>`;
        createIcons({ icons: { CheckCircle2 } });
        setTimeout(() => {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
          form.reset();
          submitBtn.innerHTML = `<span>Send Transmission</span>`;
        }, 1500);
      }, 1200);
    });
  }
}
