(() => {
  'use strict';

  async function loadPartial(placeholder) {
    const response = await fetch(placeholder.dataset.include);
    if (!response.ok) {
      throw new Error(`Failed to load ${placeholder.dataset.include}: ${response.status}`);
    }

    const markup = await response.text();
    placeholder.outerHTML = markup;
  }

  const placeholders = [...document.querySelectorAll('[data-include]')];
  // Share fragment readiness with translation and interaction scripts
  window.ICHU_PARTIALS_READY = Promise.all(placeholders.map(loadPartial))
    .then(() => true)
    .catch((error) => {
      console.error('Failed to load shared ICHU components.', error);
      return false;
    });
})();
