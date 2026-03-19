// /sw.js - v6.9.4
const CACHE_NAME = 'boxing-timer-v6.9.4';

const ASSETS = [
  './',
  './index.html',
  './icon.png',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png',
  './maskable_icon.png'
];

// INSTALL
self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// ACTIVATE
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// ESCUCHA SKIP_WAITING
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// FETCH (Offline support)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Non toccare il manifest
  if (url.pathname.includes('manifest.json')) return;

  e.respondWith(
    caches.match(e.request).then(response => {
      return response || fetch(e.request);
    })
  );
});
