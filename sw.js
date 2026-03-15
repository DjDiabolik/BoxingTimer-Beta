// /BoxingTimer-Beta/sw.js - v6.7.1 BETA
const CACHE_NAME = 'boxing-timer-beta';
const assets = [
  '/BoxingTimer-Beta/',
  './index.html',
  './manifest.json',
  './icon.png'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(assets))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(key => {
        if (key !== CACHE_NAME && !key.includes('stable')) {
          return caches.delete(key);
        }
      })
    ))
  );
  // Qui è accettabile usare clients.claim() perché lo scope è ristretto
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  try {
    const url = new URL(e.request.url);
    // Interveniamo solo per richieste dentro /BoxingTimer/new/
    if (url.pathname.startsWith('/BoxingTimer-Beta/')) {
      e.respondWith(
        fetch(e.request).then(response => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, responseClone));
          return response;
        }).catch(() => caches.match(e.request))
      );
    }
    // Altrimenti non interveniamo
  } catch (err) {
    // fallback: non interferire
  }
});

