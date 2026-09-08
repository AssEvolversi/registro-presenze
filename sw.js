// Nome della cache (puoi incrementare la versione se fai modifiche importanti)
const CACHE_NAME = 'evolversi-cache-v1';

// File da memorizzare per rendere l'app veloce o funzionare offline (opzionale)
const urlsToCache = [
  './',
  './index.html'
];

// Installazione del Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Forza l'attivazione immediata del nuovo service worker
});

// Attivazione e pulizia delle vecchie cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Prende il controllo immediato delle pagine aperte
});

// Intercettazione delle richieste di rete
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
