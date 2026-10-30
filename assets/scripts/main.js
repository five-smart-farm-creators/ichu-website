// Initialize page interactions after shared markup and translations are ready
(async () => {
  'use strict';
  if (!(await window.ICHU_PARTIALS_READY)) return;
  if (!(await window.ICHU_I18N_READY)) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const select = (selector, context = document) => context.querySelector(selector);
  const selectAll = (selector, context = document) => [...context.querySelectorAll(selector)];
  const translations = window.ICHU_I18N;

  function setOverlayOpen(overlay, open) {
    if (!overlay) return;
    overlay.classList.toggle('open', open);
    overlay.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = select('.mobile-drawer.open, .modal-overlay.open') ? 'hidden' : '';
  }

  function observeOnce(elements, onVisible, options) {
    if (!elements.length) return;
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach(onVisible);
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        onVisible(entry.target);
        observer.unobserve(entry.target);
      });
    }, options);
    elements.forEach(element => observer.observe(element));
  }

  function initializeNavigation() {
    // Keep section links local on the home page and point other pages back to it
    const pageName = document.body.dataset.page || 'home';
    const siteTop = select('#site-top');
    if (siteTop) siteTop.classList.toggle('solid', pageName !== 'home');
    selectAll('[data-home-anchor]').forEach((link) => {
      if (pageName === 'home') link.setAttribute('href', link.dataset.homeAnchor);
    });
    selectAll('[data-page-link]').forEach((link) => {
      if (link.dataset.pageLink !== pageName) return;
      link.classList.add('is-active');
      link.setAttribute('aria-current', 'page');
    });
    selectAll('[data-page-group]').forEach((group) => {
      if (group.dataset.pageGroup === pageName) group.classList.add('is-active');
    });

    // Collapse the utility bar once the page has scrolled
    window.addEventListener('scroll', () => {
      siteTop?.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    const menuToggle = select('#menu-toggle');
    const drawer = select('#mobile-drawer');
    const drawerOverlay = select('#drawer-overlay');
    const closeDrawerButton = select('#close-drawer');
    let lastFocused = null;

    function setDrawerOpen(open) {
      if (open) lastFocused = document.activeElement;
      setOverlayOpen(drawer, open);
      drawerOverlay.classList.toggle('open', open);
      menuToggle.setAttribute('aria-expanded', String(open));
      if (open) select('.drawer-link', drawer)?.focus();
      else lastFocused?.focus();
    }

    const closeDrawer = () => setDrawerOpen(false);
    menuToggle.addEventListener('click', () => setDrawerOpen(true));
    closeDrawerButton.addEventListener('click', closeDrawer);
    drawerOverlay.addEventListener('click', closeDrawer);
    selectAll('a[href]', drawer).forEach((link) => link.addEventListener('click', closeDrawer));

    // Close open submenus when interaction moves outside the navigation
    const dropdowns = selectAll('.nav-dropdown');
    function setDropdownOpen(dropdown, open) {
      dropdown.classList.toggle('is-open', open);
      select('.nav-drop-toggle', dropdown)?.setAttribute('aria-expanded', String(open));
    }
    function closeDropdowns() {
      dropdowns.forEach(dropdown => setDropdownOpen(dropdown, false));
    }
    dropdowns.forEach((dropdown) => {
      select('.nav-drop-toggle', dropdown)?.addEventListener('click', () => {
        setDropdownOpen(dropdown, !dropdown.classList.contains('is-open'));
      });
      selectAll('.nav-drop-menu a', dropdown).forEach((link) => {
        link.addEventListener('click', () => setDropdownOpen(dropdown, false));
      });
    });
    document.addEventListener('click', (event) => {
      if (!dropdowns.some(dropdown => dropdown.contains(event.target))) closeDropdowns();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeDropdowns();
      if (!select('.modal-overlay.open') && drawer.classList.contains('open')) closeDrawer();
    });
  }

  function initializeThemeAndVideo() {
    // Keep video playback aligned with theme visibility and motion preferences
    const whoVideo = select('#who-video');
    let whoVideoVisible = !('IntersectionObserver' in window);
    function syncWhoVideo(theme) {
      if (!whoVideo) return;
      if (theme !== 'night' || prefersReducedMotion || !whoVideoVisible) {
        whoVideo.pause();
        return;
      }
      const playRequest = whoVideo.play();
      if (playRequest && typeof playRequest.catch === 'function') playRequest.catch(() => {});
    }

    const themeToggle = select('#theme-toggle');
    if (themeToggle) {
      const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        themeToggle.setAttribute('aria-pressed', theme === 'night' ? 'true' : 'false');
        themeToggle.setAttribute('aria-label', theme === 'night'
          ? translations.t('common.theme.switchToDay')
          : translations.t('common.theme.switchToNight'));
        syncWhoVideo(theme);
      };
      let theme = document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day';
      applyTheme(theme);
      document.addEventListener('ichu:languagechange', () => applyTheme(theme));
      themeToggle.addEventListener('click', () => {
        theme = theme === 'night' ? 'day' : 'night';
        applyTheme(theme);
        try { localStorage.setItem('ichu-theme', theme); } catch (error) {
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
    const heroVideo = select('#hero-video');
    if (heroVideo && prefersReducedMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    }
  }

  function initializeAnimations() {
    const revealElements = selectAll('.reveal');
    observeOnce(revealElements, element => element.classList.add('in'), {
      threshold: 0.12, rootMargin: '0px 0px -30px 0px',
    });

    const counters = selectAll('.stat-value[data-count]');

    function renderCounter(counter, value = Number(counter.dataset.currentCount)) {
      counter.dataset.currentCount = String(value);
      counter.textContent = `${translations.formatNumber(value)}${counter.dataset.suffix || ''}`;
    }

    function animateCounter(counter) {
      const target = Number(counter.dataset.count);
      if (prefersReducedMotion) {
        renderCounter(counter, target);
        return;
      }
      const duration = 1400;
      const start = performance.now();
      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        renderCounter(counter, Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    observeOnce(counters, animateCounter, { threshold: 0.5 });
    document.addEventListener('ichu:languagechange', () => {
      counters.filter(counter => counter.dataset.currentCount !== undefined)
        .forEach(counter => renderCounter(counter));
    });
  }

  function initializeChat() {
    const phoneChat = select('#phone-chat');
    if (!phoneChat) return null;
    const phoneInput = select('#phone-input');
    const phoneSend = select('#phone-send');
    const chips = selectAll('.chip');
    const chatTopics = ['devices', 'veterinarian', 'farmer'];

    function appendMessage(element) {
      phoneChat.appendChild(element);
      phoneChat.scrollTop = phoneChat.scrollHeight;
    }

    function addBubble(text, type, values = {}) {
      const bubble = document.createElement('div');
      bubble.className = `bubble ${type}`;
      const paragraph = document.createElement('p');
      // Preserve user input when the interface language changes
      if (type === 'out' && !Object.keys(values).length) {
        paragraph.setAttribute('data-i18n-skip', '');
        paragraph.textContent = text;
      } else {
        translations.setText(paragraph, text, values);
      }
      const now = new Date();
      const time = document.createElement('time');
      time.className = 'bubble-time';
      time.dateTime = now.toISOString();
      time.dataset.localeTime = time.dateTime;
      time.textContent = translations.formatTime(now);
      bubble.append(paragraph, time);
      appendMessage(bubble);
    }

    function reply(text, values = {}) {
      if (prefersReducedMotion) {
        addBubble(text, 'in', values);
        return;
      }
      const typing = document.createElement('div');
      typing.className = 'bubble in typing';
      translations.setText(typing, 'home.contact.chat.typingIndicator');
      appendMessage(typing);
      // Translate delayed replies when they appear using the current language
      setTimeout(() => {
        typing.remove();
        addBubble(text, 'in', values);
      }, 1100);
    }

    function respond(text, selectedTopic) {
      const topic = chatTopics.includes(selectedTopic)
        ? selectedTopic
        : chatTopics.find(candidate => translations.matchesTopic(text, candidate));
      addBubble(text, 'out');
      reply(`home.contact.chat.responses.${topic || 'fallback'}`);
    }

    function handleUserMessage() {
      const message = phoneInput.value.trim();
      if (!message) return;
      phoneInput.value = '';
      respond(message);
    }

    if (phoneSend && phoneInput) {
      phoneSend.addEventListener('click', handleUserMessage);
      phoneInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleUserMessage();
        }
      });
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        respond(translations.t(chip.dataset.msgKey), chip.dataset.topic);
      });
    });

    return { addBubble, reply };
  }

  function initializeContactForm(chat) {
    /*
      Replace the placeholder with the team number before enabling real contact requests
      Opening WhatsApp does not confirm delivery of the prepared message
    */
    const whatsappNumber = '51900000000';

    const form = select('#demo-form');
    if (!form) return;
    const modal = select('#demo-modal');
    const closeModalButton = select('#close-modal');

    function setError(fieldName, message) {
      const input = form.elements.namedItem(fieldName);
      const errorElement = document.getElementById(`err-${input.id}`);
      input.classList.toggle('is-invalid', Boolean(message));
      input.setAttribute('aria-invalid', message ? 'true' : 'false');
      if (errorElement) {
        if (message) translations.setText(errorElement, message);
        else translations.clearText(errorElement);
      }
    }

    function isValidPhoneNumber(value) {
      const phoneNumber = value.trim();
      const digits = phoneNumber.replace(/\D/g, '');
      return /^\+?[\d\s()-]+$/.test(phoneNumber) && /^\d{6,15}$/.test(digits);
    }

    function validateForm(data) {
      let firstInvalid = null;
      const rules = {
        firstName: data.firstName.trim() ? '' : 'home.contact.form.validation.firstNameRequired',
        lastName: data.lastName.trim() ? '' : 'home.contact.form.validation.lastNameRequired',
        email: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()) ? '' : 'home.contact.form.validation.emailInvalid',
        phoneNumber: isValidPhoneNumber(data.phoneNumber) ? '' : 'home.contact.form.validation.phoneInvalid',
        userType: data.userType ? '' : 'home.contact.form.validation.profileRequired',
      };
      Object.entries(rules).forEach(([fieldName, message]) => {
        setError(fieldName, message);
        if (message && !firstInvalid) firstInvalid = form.elements.namedItem(fieldName);
      });
      return firstInvalid;
    }

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(form).entries());
      const firstInvalid = validateForm(data);
      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const lines = [
        translations.t('home.contact.whatsapp.introduction'),
        `${translations.t('home.contact.whatsapp.fields.name')}: ${data.firstName} ${data.lastName}`,
        `${translations.t('home.contact.whatsapp.fields.email')}: ${data.email}`,
        `${translations.t('home.contact.whatsapp.fields.phone')}: ${data.phoneNumber}`,
        `${translations.t('home.contact.whatsapp.fields.profile')}: ${translations.t(`home.contact.form.profile.options.${data.userType}`)}`,
      ];
      if (data.message && data.message.trim()) {
        lines.push(`${translations.t('home.contact.whatsapp.fields.message')}: ${data.message.trim()}`);
      }

      // Encode the complete message to keep user input within the query value
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(whatsappUrl, '_blank', 'noopener');

      setOverlayOpen(modal, true);
      closeModalButton?.focus();
      form.reset();
      chat?.addBubble('home.contact.chat.responses.formRequest', 'out', { name: data.firstName });
      chat?.reply('home.contact.chat.responses.formAcknowledgement', { name: data.firstName });
    });

    ['firstName', 'lastName', 'email', 'phoneNumber', 'userType'].forEach((fieldName) => {
      const input = form.elements.namedItem(fieldName);
      input.addEventListener('input', () => setError(fieldName, ''));
    });

    const closeModal = () => setOverlayOpen(modal, false);
    if (closeModalButton) closeModalButton.addEventListener('click', closeModal);
    if (modal) modal.addEventListener('click', (event) => { if (event.target === modal) closeModal(); });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && modal?.classList.contains('open')) closeModal();
    });
  }

  initializeNavigation();
  initializeThemeAndVideo();
  initializeAnimations();
  initializeContactForm(initializeChat());

  window.lucide?.createIcons();
  const yearElement = select('#year');
  if (yearElement) yearElement.textContent = new Date().getFullYear();
})();
