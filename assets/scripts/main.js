/* Shared navigation and page interactions */
(async () => {
  'use strict';
  if (!(await window.ICHU_PARTIALS_READY)) return;
  if (!(await window.ICHU_I18N_READY)) return;

  // Replace with the actual WhatsApp number including the country code and digits only
  const WHATSAPP_NUMBER = '51900000000';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const I18N = window.ICHU_I18N;
  const t = (text) => I18N.t(text);

  /* Shared navigation and current page state */
  const pageName = document.body.dataset.page || 'home';
  const siteTop = $('#siteTop');
  if (siteTop) siteTop.classList.toggle('solid', pageName !== 'home');
  $$('[data-home-anchor]').forEach((link) => {
    if (pageName === 'home') link.setAttribute('href', link.dataset.homeAnchor);
  });
  $$('[data-page-link]').forEach((link) => {
    if (link.dataset.pageLink !== pageName) return;
    link.classList.add('is-active');
    link.setAttribute('aria-current', 'page');
  });
  $$('[data-page-group]').forEach((group) => {
    if (group.dataset.pageGroup === pageName) group.classList.add('is-active');
  });

  /* Header appearance while scrolling */
  window.addEventListener('scroll', () => {
    siteTop.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  /* Mobile navigation drawer */
  const menuToggle = $('#menuToggle');
  const drawer = $('#mobileDrawer');
  const drawerOverlay = $('#drawerOverlay');
  const closeDrawerBtn = $('#closeDrawer');
  let lastFocused = null;

  function openDrawer() {
    lastFocused = document.activeElement;
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    const first = $('.drawer-link', drawer);
    if (first) first.focus();
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  menuToggle.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);
  $$('.drawer-link', drawer).forEach((link) => link.addEventListener('click', closeDrawer));

  /* Header submenus */
  const navDrops = $$('.nav-dropdown');
  navDrops.forEach((drop) => {
    const toggle = $('.nav-drop-toggle', drop);
    if (!toggle) return;
    const setOpen = (open) => {
      drop.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    toggle.addEventListener('click', () => setOpen(!drop.classList.contains('is-open')));
    $$('.nav-drop-menu a', drop).forEach((a) => a.addEventListener('click', () => setOpen(false)));
  });
  if (navDrops.length) {
    const closeAllDrops = () => {
      navDrops.forEach((drop) => {
        drop.classList.remove('is-open');
        const toggle = $('.nav-drop-toggle', drop);
        if (toggle) toggle.setAttribute('aria-expanded', 'false');
      });
    };
    document.addEventListener('click', (e) => {
      if (!navDrops.some((drop) => drop.contains(e.target))) closeAllDrops();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAllDrops();
    });
  }

  /* Day and night themes */
  const whoVideo = $('#whoVideo');
  let whoVideoVisible = !('IntersectionObserver' in window);
  function syncWhoVideo(theme) {
    if (!whoVideo) return;
    if (theme !== 'night' || prefersReduced || !whoVideoVisible) {
      whoVideo.pause();
      return;
    }
    const playRequest = whoVideo.play();
    if (playRequest && typeof playRequest.catch === 'function') playRequest.catch(() => {});
  }

  const themeToggle = $('#themeToggle');
  if (themeToggle) {
    const applyTheme = (theme) => {
      document.documentElement.setAttribute('data-theme', theme);
      themeToggle.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
      themeToggle.setAttribute('aria-label', theme === 'night' ? t("Switch to day mode") : t("Switch to night mode"));
      syncWhoVideo(theme);
    };
    let theme = 'day';
    try {
      theme = document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day';
    } catch (e) { /* Use the day theme as the default */ }
    applyTheme(theme);
    document.addEventListener('ichu:languagechange', () => applyTheme(theme));
    themeToggle.addEventListener('click', () => {
      theme = theme === 'night' ? 'day' : 'night';
      applyTheme(theme);
      try { localStorage.setItem('ichu-theme', theme); } catch (e) { /* Continue without saving the preference */ }
    });
  }
  if (whoVideo && 'IntersectionObserver' in window) {
    const videoSection = whoVideo.closest('.who-photo') || whoVideo;
    const whoVideoObserver = new IntersectionObserver((entries) => {
      whoVideoVisible = entries.some((entry) => entry.isIntersecting);
      syncWhoVideo(document.documentElement.getAttribute('data-theme'));
    }, { threshold: 0.15 });
    whoVideoObserver.observe(videoSection);
  }

  /* Pause the hero video when reduced motion is preferred */
  const heroVideo = $('#heroVideo');
  if (heroVideo && prefersReduced) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }

  /* Reveal animations */
  const revealEls = $$('.reveal');
  if (prefersReduced || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* Statistics counters */
  const counters = $$('.stat-value[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    if (prefersReduced) {
      el.textContent = target + suffix;
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => counterObserver.observe(el));
  } else {
    counters.forEach(animateCounter);
  }

  /* Render simulated chat messages as plain text */
  const phoneChat = $('#phoneChat');
  const phoneInput = $('#phoneInput');
  const phoneSend = $('#phoneSend');
  const chips = $$('.chip');

  function currentTime() {
    const now = new Date();
    let hours = now.getHours() % 12;
    if (hours === 0) hours = 12;
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes} ${now.getHours() >= 12 ? 'pm' : 'am'}`;
  }

  function addBubble(text, type, values = {}) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${type}`;
    const p = document.createElement('p');
    if (type === 'out' && !Object.keys(values).length) {
      p.setAttribute('data-i18n-skip', '');
      p.textContent = text;
    } else {
      I18N.setText(p, text, values);
    }
    const time = document.createElement('span');
    time.className = 'bubble-time';
    time.textContent = currentTime();
    bubble.append(p, time);
    phoneChat.appendChild(bubble);
    phoneChat.scrollTop = phoneChat.scrollHeight;
  }

  function reply(text, values = {}) {
    if (prefersReduced) {
      addBubble(text, 'in', values);
      return;
    }
    const typing = document.createElement('div');
    typing.className = 'bubble in typing';
    I18N.setText(typing, 'ICHU is typing...');
    phoneChat.appendChild(typing);
    phoneChat.scrollTop = phoneChat.scrollHeight;
    setTimeout(() => {
      typing.remove();
      addBubble(text, 'in', values);
    }, 1100);
  }

  function botResponse(text) {
    if (I18N.matchesTopic(text, 'farmer')) {
      return 'Great! In the demo we will show you how to register your livestock by collar, monitor grazing and receive temperature alerts instantly.';
    }
    if (I18N.matchesTopic(text, 'veterinarian')) {
      return 'Perfect! You will be able to explore the thermal history, the visit log and the treatment registry.';
    }
    if (I18N.matchesTopic(text, 'devices')) {
      return 'Our devices are designed for high-altitude telemetry and Andean weather.';
    }
    return "Message received! Let's schedule your personalized demonstration: leave your details in the form to coordinate.";
  }

  function handleUserMessage() {
    const message = phoneInput.value.trim();
    if (!message) return;
    addBubble(message, 'out');
    phoneInput.value = '';
    reply(botResponse(message));
  }

  if (phoneSend && phoneInput) {
    phoneSend.addEventListener('click', handleUserMessage);
    phoneInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleUserMessage();
      }
    });
  }

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      addBubble(t(chip.dataset.msg), 'out');
      reply(botResponse(chip.dataset.msg));
    });
  });

  /* Form validation and WhatsApp message preparation */
  const form = $('#demoForm');
  const modal = $('#demoModal');
  const closeModalBtn = $('#closeModal');

  function setError(id, message) {
    const input = $(`#${id}`);
    const errorEl = $(`#err-${id}`);
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) I18N.setText(errorEl, message);
  }

  function validateForm(data) {
    let firstInvalid = null;
    const rules = {
      firstName: data.firstName.trim() ? '' : "Enter your first name.",
      lastName: data.lastName.trim() ? '' : "Enter your last name.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()) ? '' : "Enter a valid email.",
      phoneNumber: /^[+()\d\s-]{6,20}$/.test(data.phoneNumber.trim()) ? '' : "Enter a valid phone number.",
      userType: data.userType ? '' : "Select your profile.",
    };
    Object.entries(rules).forEach(([field, message]) => {
      setError(field, message);
      if (message && !firstInvalid) firstInvalid = $(`#${field}`);
    });
    return firstInvalid;
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const firstInvalid = validateForm(data);
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const lines = [
        t("Hello ICHU, I would like to request a demonstration."),
        `${t("Name")}: ${data.firstName} ${data.lastName}`,
        `${t("Email")}: ${data.email}`,
        `${t("Phone")}: ${data.phoneNumber}`,
        `${t("Profile")}: ${t(data.userType)}`,
      ];
      if (data.message && data.message.trim()) lines.push(`${t("Message")}: ${data.message.trim()}`);

      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(waUrl, '_blank', 'noopener');

      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeModalBtn.focus();
      }
      form.reset();
      addBubble('Hello, I am {n}. I requested a demonstration from the form.', 'out', { n: data.firstName });
      reply('Hi {n}! We have registered your request. We will contact you very soon.', { n: data.firstName });
    });

    ['firstName', 'lastName', 'email', 'phoneNumber', 'userType'].forEach((id) => {
      const input = $(`#${id}`);
      input.addEventListener('input', () => setError(id, ''));
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });

  /* Close the drawer and dialog with Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal && modal.classList.contains('open')) {
      closeModal();
    } else if (drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* Initialize icons and the footer year */
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
