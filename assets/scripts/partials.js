(() => {
  'use strict';

  async function loadPartial(placeholder) {
    const response = await fetch(placeholder.dataset.include);
    if (!response.ok) {
      throw new Error(`No se pudo cargar ${placeholder.dataset.include}: ${response.status}`);
    }

    const markup = await response.text();
    placeholder.outerHTML = markup;
  }

  const placeholders = [...document.querySelectorAll('[data-include]')];
  window.ICHU_PARTIALS_READY = Promise.all(placeholders.map(loadPartial))
    .then(() => true)
    .catch((error) => {
      console.error('No se pudieron cargar los componentes compartidos de ICHU.', error);
      return false;
    });
})();
