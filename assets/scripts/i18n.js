/*
  Load locale resources and apply semantic translation keys
  Keep the English source content available when a locale cannot be loaded
*/
window.ICHU_I18N_READY = (async () => {
  'use strict';

  const localeBaseUrl = new URL('../../locales/', document.currentScript.src);
  if (window.ICHU_PARTIALS_READY && !(await window.ICHU_PARTIALS_READY)) return false;

  const languageKey = 'ichu-lang';
  const defaultLanguage = 'en';
  const supportedLanguages = new Set(['en', 'es']);
  const pluralCategories = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);
  const locales = new Map();
  const localeRequests = new Map();
  const originalText = new WeakMap();
  const dynamicMessages = new Map();
  let language = defaultLanguage;
  let changeRequest = 0;

  function isRecord(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
  }

  function isPluralEntry(value) {
    return isRecord(value)
      && Object.keys(value).length > 0
      && Object.keys(value).every(category => pluralCategories.has(category))
      && Object.prototype.hasOwnProperty.call(value, 'other');
  }

  function collectMessages(value, prefix = '', output = new Map()) {
    if (typeof value === 'string') {
      output.set(prefix, value);
      return output;
    }
    if (!isRecord(value)) throw new Error(`Invalid translation entry at ${prefix || 'messages'}`);

    const keys = Object.keys(value);
    if (keys.length === 0) throw new Error(`Empty translation namespace at ${prefix || 'messages'}`);
    const isPlural = keys.every(category => pluralCategories.has(category));
    if (isPlural && !isPluralEntry(value)) throw new Error(`Invalid plural entry at ${prefix}`);

    Object.entries(value).forEach(([key, child]) => {
      if (!/^[a-z][A-Za-z0-9]*$/.test(key)) throw new Error(`Invalid semantic translation key: ${key}`);
      if (isPlural && typeof child !== 'string') throw new Error(`Invalid plural form at ${prefix}.${key}`);
      collectMessages(child, prefix ? `${prefix}.${key}` : key, output);
    });
    return output;
  }

  function getPlaceholders(message) {
    return [...message.matchAll(/\{\{\s*([\w.]+)\s*\}\}/g)]
      .map(match => match[1])
      .sort()
      .join('|');
  }

  function validateLocale(locale, target) {
    if (!isRecord(locale)
      || locale.language !== target
      || !isRecord(locale.messages)
      || !isRecord(locale.chatKeywords)
      || !Object.values(locale.chatKeywords).every(keywords => Array.isArray(keywords)
        && keywords.every(keyword => typeof keyword === 'string'))) {
      throw new Error(`Invalid ${target} translation resource`);
    }
    const targetMessages = collectMessages(locale.messages);

    if (target !== defaultLanguage && locales.has(defaultLanguage)) {
      const sourceMessages = collectMessages(locales.get(defaultLanguage).messages);
      if (targetMessages.size !== sourceMessages.size || [...sourceMessages.keys()].some(key => !targetMessages.has(key))) {
        throw new Error(`${target} translations do not match the English key structure`);
      }
      sourceMessages.forEach((source, key) => {
        if (getPlaceholders(source) !== getPlaceholders(targetMessages.get(key))) {
          throw new Error(`Placeholder mismatch in ${target} translation: ${key}`);
        }
      });
      if (JSON.stringify(Object.keys(locale.chatKeywords).sort())
        !== JSON.stringify(Object.keys(locales.get(defaultLanguage).chatKeywords).sort())) {
        throw new Error(`${target} chat topics do not match the English resource`);
      }
    }
  }

  function findEntry(resource, key) {
    return key.split('.').reduce((value, segment) => value?.[segment], resource?.messages);
  }

  function localeTag(target) {
    return target === 'es' ? 'es-PE' : 'en-US';
  }

  function formatMessage(message, values) {
    return message.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (placeholder, name) => {
      const value = name.split('.').reduce((current, segment) => current?.[segment], values);
      return value === undefined ? placeholder : String(value);
    });
  }

  function translate(key, values = {}) {
    const activeEntry = findEntry(locales.get(language), key);
    const sourceEntry = findEntry(locales.get(defaultLanguage), key);
    const entry = activeEntry ?? sourceEntry;
    const entryLanguage = activeEntry === undefined ? defaultLanguage : language;
    if (entry === undefined) {
      console.error(`Missing translation key: ${key}`);
      return key;
    }

    let message = entry;
    if (isPluralEntry(entry)) {
      if (!Object.prototype.hasOwnProperty.call(values, 'count') || !Number.isFinite(Number(values.count))) {
        throw new TypeError(`Plural translation requires a numeric count: ${key}`);
      }
      const category = new Intl.PluralRules(localeTag(entryLanguage)).select(Number(values.count));
      message = entry[category] ?? entry.other;
    }
    return formatMessage(message, values);
  }

  function renderStaticText(element) {
    const source = originalText.get(element);
    if (!source) return;
    const key = element.dataset.i18n;
    const entry = findEntry(locales.get(language), key) ?? findEntry(locales.get(defaultLanguage), key);
    element.textContent = entry === undefined ? source : translate(key);
  }

  function formatTime(value) {
    if (typeof value === 'string' && /^\d{2}:\d{2}$/.test(value)) {
      const [hours, minutes] = value.split(':').map(Number);
      value = new Date(2000, 0, 1, hours, minutes);
    }
    const date = value instanceof Date ? value : new Date(value);
    return new Intl.DateTimeFormat(localeTag(language), { hour: 'numeric', minute: '2-digit' }).format(date);
  }

  function formatNumber(value, options = {}) {
    return new Intl.NumberFormat(localeTag(language), options).format(value);
  }

  function applyLocaleFormatting() {
    document.querySelectorAll('[data-locale-time]').forEach((element) => {
      element.textContent = formatTime(element.dataset.localeTime);
    });
    const temperatureFormat = new Intl.NumberFormat(localeTag(language), {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    document.querySelectorAll('[data-locale-temperature]').forEach((element) => {
      const value = Number(element.dataset.localeTemperature);
      if (Number.isFinite(value)) element.textContent = `${temperatureFormat.format(value)} °C`;
    });
    document.querySelectorAll('[data-locale-temperature-range]').forEach((element) => {
      const values = element.dataset.localeTemperatureRange.split(',').map(Number);
      if (values.length === 2 && values.every(Number.isFinite)) {
        element.textContent = `${temperatureFormat.format(values[0])} °C → ${temperatureFormat.format(values[1])} °C`;
      }
    });
  }

  function translatePage() {
    document.querySelectorAll('[data-i18n]').forEach((element) => {
      if (dynamicMessages.has(element)) return;
      if (!originalText.has(element)) originalText.set(element, element.textContent);
      renderStaticText(element);
    });

    const attributeBindings = [
      ['alt', 'data-i18n-alt'],
      ['aria-label', 'data-i18n-aria-label'],
      ['title', 'data-i18n-title'],
      ['placeholder', 'data-i18n-placeholder'],
      ['content', 'data-i18n-content'],
    ];
    attributeBindings.forEach(([attribute, marker]) => {
      document.querySelectorAll(`[${marker}]`).forEach((element) => {
        element.setAttribute(attribute, translate(element.getAttribute(marker)));
      });
    });

    dynamicMessages.forEach(({ key, values }, element) => {
      if (element.isConnected) element.textContent = translate(key, values);
      else dynamicMessages.delete(element);
    });

    applyLocaleFormatting();
    document.documentElement.lang = language === 'es' ? 'es-PE' : 'en';
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content', language === 'es' ? 'es_PE' : 'en_US');
  }

  async function loadLocale(target) {
    if (!supportedLanguages.has(target)) throw new Error('Unsupported language');
    if (locales.has(target)) return locales.get(target);

    if (!localeRequests.has(target)) {
      const request = fetch(new URL(`${target}.json`, localeBaseUrl))
        .then(async (response) => {
          if (!response.ok) throw new Error(`Failed to load ${target} translations: ${response.status}`);
          const locale = await response.json();
          validateLocale(locale, target);
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

  function updateLanguageButton() {
    const button = document.getElementById('langToggle');
    if (!button) return;
    button.querySelector('.lang-code').textContent = language.toUpperCase();
    button.setAttribute('aria-label', translate(language === 'en'
      ? 'common.language.switchToSpanish'
      : 'common.language.switchToEnglish'));
    button.setAttribute('aria-pressed', String(language === 'es'));
  }

  async function applyLanguage(target) {
    if (!supportedLanguages.has(target)) return false;
    const request = ++changeRequest;
    if (target !== defaultLanguage) {
      try {
        await loadLocale(target);
      } catch (error) {
        return false;
      }
    }
    if (request !== changeRequest) return false;
    language = target;
    translatePage();
    updateLanguageButton();
    try {
      localStorage.setItem(languageKey, language);
    } catch (error) {
      // Keep the selected language active when storage is unavailable
    }
    document.dispatchEvent(new CustomEvent('ichu:languagechange', { detail: { language } }));
    return true;
  }

  function normalizeText(value) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  }

  window.ICHU_I18N = {
    get lang() { return language; },
    t: translate,
    setText(element, key, values = {}) {
      dynamicMessages.set(element, { key, values });
      element.textContent = translate(key, values);
    },
    clearText(element) {
      dynamicMessages.delete(element);
      element.textContent = '';
    },
    formatTime,
    formatNumber,
    matchesTopic(text, topic) {
      const keywords = [
        ...(locales.get(defaultLanguage)?.chatKeywords[topic] || []),
        ...(language === defaultLanguage ? [] : locales.get(language)?.chatKeywords[topic] || []),
      ];
      const message = normalizeText(text);
      return keywords.some(keyword => message.includes(normalizeText(keyword)));
    },
  };

  document.getElementById('langToggle')?.addEventListener('click', () => {
    void applyLanguage(language === 'en' ? 'es' : 'en');
  });

  let savedLanguage = defaultLanguage;
  try {
    if (localStorage.getItem(languageKey) === 'es') savedLanguage = 'es';
  } catch (error) {
    // Keep English as the default when the saved preference cannot be read
  }

  try {
    await loadLocale(defaultLanguage);
  } catch (error) {
    // Keep the source language available when its resource cannot be loaded
  }
  await applyLanguage(savedLanguage);
  return true;
})();
