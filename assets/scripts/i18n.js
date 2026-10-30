/* Load locale resources and preserve English source text as a fallback */
window.ICHU_I18N_READY = (async () => {
  'use strict';
  if (!(await window.ICHU_PARTIALS_READY)) return false;

  const LANGUAGE_KEY = 'ichu-lang';
  const DEFAULT_LANGUAGE = 'en';
  const SUPPORTED_LANGUAGES = new Set(['en', 'es']);
  const locales = new Map();
  const localeRequests = new Map();
  const SKIPPED_ELEMENTS = 'script,style,noscript,textarea,.stat-value,[data-i18n-skip],[contenteditable]';
  const textSources = new WeakMap();
  const attributeSources = new WeakMap();
  let language = DEFAULT_LANGUAGE;
  let changeRequest = 0;

  function format(text, values = {}) {
    return text.replace(/\{(\w+)\}/g, (placeholder, name) => (
      Object.hasOwn(values, name) ? String(values[name]) : placeholder
    ));
  }

  function translate(text, values = {}) {
    const translated = locales.get(language)?.messages[text] ?? locales.get(DEFAULT_LANGUAGE)?.messages[text];
    return format(typeof translated === 'string' ? translated : text, values);
  }

  function setText(element, text, values = {}) {
    element.textContent = translate(text, values);
    if (element.firstChild) textSources.set(element.firstChild, { text, values });
  }

  function translatePage() {
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        return node.parentElement?.closest(SKIPPED_ELEMENTS)
          ? NodeFilter.FILTER_REJECT
          : NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      const node = walker.currentNode;
      let source = textSources.get(node);
      if (!source) {
        source = { text: node.nodeValue, values: {} };
        textSources.set(node, source);
      }
      const trimmed = source.text.trim();
      if (trimmed) {
        const leading = source.text.slice(0, source.text.indexOf(trimmed));
        const trailing = source.text.slice(source.text.indexOf(trimmed) + trimmed.length);
        node.nodeValue = leading + translate(trimmed, source.values) + trailing;
      }
    }

    const attributes = ['placeholder', 'alt', 'aria-label', 'title', 'content'];
    document.querySelectorAll('input[placeholder],textarea[placeholder],img[alt],[aria-label],[title],meta[content]').forEach((element) => {
      if (element.closest(SKIPPED_ELEMENTS)) return;
      let sources = attributeSources.get(element);
      if (!sources) {
        sources = new Map();
        attributeSources.set(element, sources);
      }
      attributes.forEach((attribute) => {
        if (!element.hasAttribute(attribute)) return;
        if (!sources.has(attribute)) sources.set(attribute, element.getAttribute(attribute));
        element.setAttribute(attribute, translate(sources.get(attribute)));
      });
    });

    document.documentElement.lang = language;
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'es' ? 'es_PE' : 'en_US');
  }

  async function loadLocale(target) {
    if (!SUPPORTED_LANGUAGES.has(target)) throw new Error('Unsupported language');
    if (locales.has(target)) return locales.get(target);
    if (!localeRequests.has(target)) {
      const request = fetch(`public/locales/${target}.json`)
        .then(async (response) => {
          if (!response.ok) throw new Error(`Failed to load ${target} translations with status ${response.status}`);
          const locale = await response.json();
          if (locale.language !== target || !locale.messages || typeof locale.messages !== 'object' || Array.isArray(locale.messages)
            || !Object.values(locale.messages).every(value => typeof value === 'string')
            || !locale.chatKeywords || typeof locale.chatKeywords !== 'object' || Array.isArray(locale.chatKeywords)
            || !Object.values(locale.chatKeywords).every(keywords => Array.isArray(keywords) && keywords.every(value => typeof value === 'string'))) {
            throw new Error(`Invalid ${target} translation data`);
          }
          locales.set(target, locale);
          return locale;
        })
        .catch((error) => {
          localeRequests.delete(target);
          console.error(`Failed to load ${target} translations.`, error);
          throw error;
        });
      localeRequests.set(target, request);
    }
    return localeRequests.get(target);
  }

  function updateButton() {
    const button = document.getElementById('langToggle');
    if (!button) return;
    button.querySelector('.lang-code').textContent = language.toUpperCase();
    button.setAttribute('aria-label', translate(language === 'en' ? 'Switch language to Spanish' : 'Switch language to English'));
    button.setAttribute('aria-pressed', String(language === 'es'));
  }

  async function applyLanguage(target) {
    if (!SUPPORTED_LANGUAGES.has(target)) return false;
    const request = ++changeRequest;
    if (target !== DEFAULT_LANGUAGE) {
      try {
        await loadLocale(target);
      } catch (error) {
        return false;
      }
    }
    if (request !== changeRequest) return false;
    language = target;
    translatePage();
    updateButton();
    try {
      localStorage.setItem(LANGUAGE_KEY, language);
    } catch (error) { /* Continue without saving the preference */ }
    document.dispatchEvent(new CustomEvent('ichu:languagechange', { detail: { language } }));
    return true;
  }

  window.ICHU_I18N = {
    get lang() { return language; },
    t: translate,
    setText,
    matchesTopic(text, topic) {
      const keywords = [
        ...(locales.get(DEFAULT_LANGUAGE)?.chatKeywords[topic] || []),
        ...(language === DEFAULT_LANGUAGE ? [] : locales.get(language)?.chatKeywords[topic] || []),
      ];
      const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
      const message = normalize(text);
      return keywords.some(keyword => message.includes(normalize(keyword)));
    },
  };

  document.getElementById('langToggle')?.addEventListener('click', () => {
    void applyLanguage(language === 'en' ? 'es' : 'en');
  });

  let savedLanguage = DEFAULT_LANGUAGE;
  try {
    if (localStorage.getItem(LANGUAGE_KEY) === 'es') savedLanguage = 'es';
  } catch (error) { /* Use English when storage is unavailable */ }
  try {
    await loadLocale(DEFAULT_LANGUAGE);
  } catch (error) { /* Keep English source content available if locale loading fails */ }
  await applyLanguage(savedLanguage);
  return true;
})();
