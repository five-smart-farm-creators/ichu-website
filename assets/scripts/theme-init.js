try {
  if (localStorage.getItem('ichu-theme') === 'night') {
    document.documentElement.setAttribute('data-theme', 'night');
  }
} catch (error) {
  // El tema claro es el valor predeterminado si el almacenamiento no está disponible.
}
