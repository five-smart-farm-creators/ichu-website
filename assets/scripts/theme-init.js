try {
  if (localStorage.getItem('ichu-theme') === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
  }
} catch (error) {
  // Use the day theme when storage is unavailable
}
