const CACHE_NAME = 'evolversi-v4';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './IconaApp.png'
];

// Installazione: memorizza solo i file locali
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Attivazione: pulisce le vecchie cache
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

// Gestione delle richieste
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('script.google.com')) {
    return; // Lascia passare liberamente le chiamate a Google Apps Script
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
