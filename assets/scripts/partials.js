(() => {
  'use strict';

  const siteBaseUrl = new URL('../../', document.currentScript.src);

  async function loadPartial(placeholder) {
    const partialUrl = new URL(placeholder.dataset.include, siteBaseUrl);
    const response = await fetch(partialUrl);
    if (!response.ok) throw new Error(`Failed to load ${partialUrl.pathname}: ${response.status}`);

    const template = document.createElement('template');
    template.innerHTML = await response.text();
    // Resolve shared assets and links from the site root on every page
    template.content.querySelectorAll('[href], [src]').forEach((element) => {
      ['href', 'src'].forEach((attribute) => {
        const value = element.getAttribute(attribute);
        if (value && !/^(?:#|[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) {
          element.setAttribute(attribute, new URL(value, siteBaseUrl).href);
        }
      });
    });
    placeholder.replaceWith(template.content);
  }

  const placeholders = [...document.querySelectorAll('[data-include]')];
  window.ICHU_PARTIALS_READY = Promise.all(placeholders.map(loadPartial))
    .then(() => true)
    .catch((error) => {
      console.error('Failed to load shared ICHU components.', error);
      return false;
    });
})();
