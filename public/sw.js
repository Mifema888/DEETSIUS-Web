self.addEventListener('fetch', (event) => {
  // Service worker básico para cumplir con los requisitos de PWA
  event.respondWith(fetch(event.request));
});