/**
 * SMART PLACEMENT PREDICTION & CAREER COACH
 * Landing Page Interactivity & Live Teaser Prediction Dial
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize theme for landing page
  const currentTheme = initTheme();
  updateThemeIcon(currentTheme);

  // Setup mobile nav toggle
  const mobileBtn = document.getElementById('landing-mobile-btn');
  const navLinks = document.getElementById('landing-nav-links');
  if (mobileBtn && navLinks) {
    mobileBtn.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';
      navLinks.style.display = isOpen ? 'none' : 'flex';
      if (!isOpen) {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '76px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.background = 'var(--bg-card)';
        navLinks.style.padding = '1.5rem';
        navLinks.style.boxShadow = 'var(--shadow-lg)';
      }
    });
  }

  // Interactive Hero Teaser Calculator
  initHeroPreviewCalculator();

  // Stats number counter animation
  initStatsCounter();
});

function handleLandingThemeToggle() {
  const newTheme = toggleTheme();
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  const icon = document.getElementById('landing-theme-icon');
  if (icon) {
    icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }
}

function initHeroPreviewCalculator() {
  const cgpaSlider = document.getElementById('hero-cgpa-slider');
  const cgpaLabel = document.getElementById('hero-cgpa-val');
  const internSelect = document.getElementById('hero-intern-select');
  const dsaSelect = document.getElementById('hero-dsa-select');
  
  if (!cgpaSlider || !cgpaLabel) return;

  function updateHeroPreview() {
    const cgpa = parseFloat(cgpaSlider.value) || 7.5;
    cgpaLabel.innerText = cgpa.toFixed(1);

    const hasIntern = internSelect ? internSelect.value === 'yes' : true;
    const dsaRating = dsaSelect ? parseInt(dsaSelect.value) : 1500;

    // Fast heuristic for hero preview
    let score = (cgpa / 10) * 45;
    if (hasIntern) score += 25; else score += 8;
    score += Math.min(30, ((dsaRating - 1200) / 800) * 30);

    const finalPct = Math.round(Math.min(96, Math.max(25, score)));

    const gaugeCircle = document.getElementById('hero-gauge-circle');
    const gaugeText = document.getElementById('hero-gauge-pct');
    const tierText = document.getElementById('hero-gauge-tier');

    if (gaugeCircle) {
      const circumference = 314.15; // 2 * PI * 50
      const offset = circumference - (finalPct / 100) * circumference;
      gaugeCircle.style.strokeDashoffset = offset;
      gaugeCircle.style.stroke = finalPct >= 80 ? 'var(--accent-emerald)' : finalPct >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)';
    }

    if (gaugeText) gaugeText.innerText = `${finalPct}%`;

    if (tierText) {
      tierText.innerText = finalPct >= 80 ? 'High Readiness' : finalPct >= 60 ? 'Moderate Readiness' : 'Needs Practice';
      tierText.style.color = finalPct >= 80 ? 'var(--accent-emerald)' : finalPct >= 60 ? 'var(--accent-amber)' : 'var(--accent-rose)';
    }
  }

  cgpaSlider.addEventListener('input', updateHeroPreview);
  if (internSelect) internSelect.addEventListener('change', updateHeroPreview);
  if (dsaSelect) dsaSelect.addEventListener('change', updateHeroPreview);

  updateHeroPreview();
}

function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!window.IntersectionObserver) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const targetText = el.getAttribute('data-target');
        if (targetText) {
          animateCounter(el, targetText);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(n => observer.observe(n));
}

function animateCounter(elem, targetStr) {
  const isFloat = targetStr.includes('.');
  const hasSuffix = targetStr.includes('%') || targetStr.includes('x') || targetStr.includes('+');
  const cleanNum = parseFloat(targetStr.replace(/[^0-9.]/g, ''));
  const suffix = targetStr.replace(/[0-9.]/g, '');

  let current = 0;
  const duration = 1500;
  const steps = 40;
  const increment = cleanNum / steps;
  const intervalTime = duration / steps;

  const timer = setInterval(() => {
    current += increment;
    if (current >= cleanNum) {
      current = cleanNum;
      clearInterval(timer);
    }
    elem.innerText = (isFloat ? current.toFixed(1) : Math.round(current).toLocaleString()) + suffix;
  }, intervalTime);
}
