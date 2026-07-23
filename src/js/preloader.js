import gsap from 'gsap';

export function initPreloader(onCompleteCallback) {
  const preloader = document.getElementById('preloader');
  const counterEl = document.getElementById('loader-counter');
  const textEl = document.getElementById('loader-text');
  const logoText = document.getElementById('loader-logo-text');

  if (!preloader || !counterEl) {
    if (onCompleteCallback) onCompleteCallback();
    return;
  }

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*!';
  const targetLogoText = "RBS SOFTWARE SOLLUTIONS";
  const statusTexts = [
    "INITIALIZING CORE SYSTEM...",
    "ESTABLISHING ENCRYPTED NODES...",
    "LOADING 3D VECTOR MATRIX...",
    "SYSTEM READY // RBS ONLINE"
  ];

  let progress = { value: 0 };
  let currentStatusIndex = 0;

  // Encrypted text decode effect function
  function scrambleText(element, finalText, ratio) {
    const revealedLength = Math.floor(finalText.length * ratio);
    let output = '';
    for (let i = 0; i < finalText.length; i++) {
      if (i < revealedLength) {
        output += finalText[i];
      } else if (finalText[i] === ' ') {
        output += ' ';
      } else {
        output += charset[Math.floor(Math.random() * charset.length)];
      }
    }
    element.textContent = output;
  }

  const tl = gsap.timeline({
    onComplete: () => {
      // Swipe up preloader reveal
      gsap.timeline()
        .to(preloader, {
          yPercent: -100,
          duration: 1.2,
          ease: 'power4.inOut',
          onComplete: () => {
            preloader.style.display = 'none';
            if (onCompleteCallback) onCompleteCallback();
          }
        });
    }
  });

  // Animate counter 0 -> 100
  tl.to(progress, {
    value: 100,
    duration: 2.2,
    ease: 'power2.inOut',
    onUpdate: () => {
      const val = Math.floor(progress.value);
      counterEl.textContent = val.toString().padStart(3, '0') + '%';
      
      const ratio = progress.value / 100;
      if (logoText) {
        scrambleText(logoText, targetLogoText, ratio);
      }

      // Update subtext
      if (ratio > 0.75) {
        textEl.textContent = statusTexts[3];
      } else if (ratio > 0.5) {
        textEl.textContent = statusTexts[2];
      } else if (ratio > 0.25) {
        textEl.textContent = statusTexts[1];
      } else {
        textEl.textContent = statusTexts[0];
      }
    }
  });

  tl.to('#loader-bar-inner', {
    width: '100%',
    duration: 2.2,
    ease: 'power2.inOut'
  }, 0);
}
