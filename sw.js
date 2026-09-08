const CACHE_NAME = 'evolversi-v5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './IconaApp.png'
];

// Installazione: memorizza i file locali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulisce immediatamente le vecchie cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Gestione delle richieste offline avanzata per PWABuilder
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) {
    return; // Salta le chiamate al backend Google
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Se la rete cade, intercetta le richieste di pagina e restituisce index.html
        if (event.request.mode === 'navigate' || event.request.destination === 'document') {
          return caches.match('./index.html') || caches.match('./');
        }
      });
    })
  );
});
