// Apply the saved theme before rendering to avoid a visible theme switch
try {
  if (localStorage.getItem('ichu-theme') === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
  }
} catch (error) {
  // Keep the default day theme when the saved preference cannot be read
}
