// Keep recovery navigation available without shared fragment loading
(async () => {
  'use strict';
  if (!(await window.ICHU_I18N_READY)) return;

  const controls = document.getElementById('errorControls');
  const themeToggle = document.getElementById('themeToggle');
  const translations = window.ICHU_I18N;
  let theme = document.documentElement.getAttribute('data-theme') === 'night' ? 'night' : 'day';

  function updateTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-pressed', String(theme === 'night'));
    themeToggle.setAttribute('aria-label', translations.t(theme === 'night' ? 'Switch to day mode' : 'Switch to night mode'));
  }

  themeToggle.addEventListener('click', () => {
    theme = theme === 'night' ? 'day' : 'night';
    updateTheme();
    try {
      localStorage.setItem('ichu-theme', theme);
    } catch (error) {
      // Keep the selected theme active when storage is unavailable
    }
  });

  document.addEventListener('ichu:languagechange', updateTheme);
  updateTheme();
  controls.hidden = false;
})();
