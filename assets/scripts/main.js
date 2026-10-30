// Initialize page interactions after shared markup and translations are ready
(async () => {
  'use strict';
  if (!(await window.ICHU_PARTIALS_READY)) return;
  if (!(await window.ICHU_I18N_READY)) return;

  /*
    Use an international WhatsApp number with digits only
    Replace the placeholder before enabling real contact requests
  */
  const WHATSAPP_NUMBER = '51900000000';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
  const I18N = window.ICHU_I18N;
  const t = (key, values) => I18N.t(key, values);

  // Keep section links local on the home page and point other pages back to it
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

  // Collapse the utility bar once the page has scrolled
  window.addEventListener('scroll', () => {
    siteTop.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });

  // Keep the drawer state consistent with its accessibility attributes
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
  $$('a[href]', drawer).forEach((link) => link.addEventListener('click', closeDrawer));

  // Close open submenus when interaction moves outside the navigation
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

  // Keep video playback aligned with theme visibility and motion preferences
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
      themeToggle.setAttribute('aria-label', theme === 'night'
        ? t('common.theme.switchToDay')
        : t('common.theme.switchToNight'));
      syncWhoVideo(theme);
    };
    let theme = 'day';
    try {
      theme = document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day';
    } catch (e) {
      // Keep the default theme if the current theme cannot be read
    }
    applyTheme(theme);
    document.addEventListener('ichu:languagechange', () => applyTheme(theme));
    themeToggle.addEventListener('click', () => {
      theme = theme === 'night' ? 'day' : 'night';
      applyTheme(theme);
      try { localStorage.setItem('ichu-theme', theme); } catch (e) {
        // Keep the selected theme active when storage is unavailable
      }
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

  // Respect reduced motion even when autoplay is declared in the markup
  const heroVideo = $('#heroVideo');
  if (heroVideo && prefersReduced) {
    heroVideo.removeAttribute('autoplay');
    heroVideo.pause();
  }

  // Keep content visible when animations are disabled or observation is unavailable
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

  // Observe each counter only until its first animation
  const counters = $$('.stat-value[data-count]');

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const renderCount = value => {
      el.dataset.currentCount = String(value);
      el.textContent = `${I18N.formatNumber(value)}${suffix}`;
    };
    if (prefersReduced) {
      renderCount(target);
      return;
    }
    const duration = 1400;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      renderCount(Math.round(target * eased));
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
  document.addEventListener('ichu:languagechange', () => {
    counters.forEach((counter) => {
      if (counter.dataset.currentCount !== undefined) {
        const suffix = counter.dataset.suffix || '';
        counter.textContent = `${I18N.formatNumber(Number(counter.dataset.currentCount))}${suffix}`;
      }
    });
  });

  // Keep the chat illustrative and render messages as plain text
  const phoneChat = $('#phoneChat');
  const phoneInput = $('#phoneInput');
  const phoneSend = $('#phoneSend');
  const chips = $$('.chip');

  function addBubble(text, type, values = {}) {
    const bubble = document.createElement('div');
    bubble.className = `bubble ${type}`;
    const p = document.createElement('p');
    // Preserve user input when the interface language changes
    if (type === 'out' && !Object.keys(values).length) {
      p.setAttribute('data-i18n-skip', '');
      p.textContent = text;
    } else {
      I18N.setText(p, text, values);
    }
    const now = new Date();
    const time = document.createElement('time');
    time.className = 'bubble-time';
    time.dateTime = now.toISOString();
    time.dataset.localeTime = now.toISOString();
    time.textContent = I18N.formatTime(now);
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
    I18N.setText(typing, 'home.contact.chat.typingIndicator');
    phoneChat.appendChild(typing);
    phoneChat.scrollTop = phoneChat.scrollHeight;
    // Translate delayed replies when they appear using the current language
    setTimeout(() => {
      typing.remove();
      addBubble(text, 'in', values);
    }, 1100);
  }

  function botResponse(text) {
    if (I18N.matchesTopic(text, 'farmer')) {
      return 'home.contact.chat.responses.farmer';
    }
    if (I18N.matchesTopic(text, 'veterinarian')) {
      return 'home.contact.chat.responses.veterinarian';
    }
    if (I18N.matchesTopic(text, 'devices')) {
      return 'home.contact.chat.responses.devices';
    }
    return 'home.contact.chat.responses.fallback';
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
      const message = t(chip.dataset.msgKey);
      addBubble(message, 'out');
      reply(botResponse(message));
    });
  });

  /*
    Validate the request before preparing the WhatsApp message
    Opening WhatsApp does not confirm that a message was sent
  */
  const form = $('#demoForm');
  const modal = $('#demoModal');
  const closeModalBtn = $('#closeModal');

  function setError(id, message) {
    const input = $(`#${id}`);
    const errorEl = $(`#err-${id}`);
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) {
      if (message) I18N.setText(errorEl, message);
      else I18N.clearText(errorEl);
    }
  }

  function validateForm(data) {
    let firstInvalid = null;
    const rules = {
      firstName: data.firstName.trim() ? '' : 'home.contact.form.validation.firstNameRequired',
      lastName: data.lastName.trim() ? '' : 'home.contact.form.validation.lastNameRequired',
      email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()) ? '' : 'home.contact.form.validation.emailInvalid',
      phoneNumber: /^[+()\d\s-]{6,20}$/.test(data.phoneNumber.trim()) ? '' : 'home.contact.form.validation.phoneInvalid',
      userType: data.userType ? '' : 'home.contact.form.validation.profileRequired',
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
        t('home.contact.whatsapp.introduction'),
        `${t('home.contact.whatsapp.fields.name')}: ${data.firstName} ${data.lastName}`,
        `${t('home.contact.whatsapp.fields.email')}: ${data.email}`,
        `${t('home.contact.whatsapp.fields.phone')}: ${data.phoneNumber}`,
        `${t('home.contact.whatsapp.fields.profile')}: ${t(`home.contact.form.profile.options.${data.userType}`)}`,
      ];
      if (data.message && data.message.trim()) {
        lines.push(`${t('home.contact.whatsapp.fields.message')}: ${data.message.trim()}`);
      }

      // Encode the complete message to keep user input within the query value
      const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(waUrl, '_blank', 'noopener');

      if (modal) {
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeModalBtn.focus();
      }
      form.reset();
      addBubble('home.contact.chat.responses.formRequest', 'out', { name: data.firstName });
      reply('home.contact.chat.responses.formAcknowledgement', { name: data.firstName });
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

  // Close the dialog before the drawer when handling Escape
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modal && modal.classList.contains('open')) {
      closeModal();
    } else if (drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Initialize icons and the year after the shared footer has loaded
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
