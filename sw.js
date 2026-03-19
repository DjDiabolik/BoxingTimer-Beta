// /BoxingTimer-Beta/sw.js - v6.9.3

const CACHE_NAME = 'boxing-timer-beta-v6.9.3';

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

// FETCH
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // NON toccare il manifest
  if (url.pathname.includes('manifest.json')) return;

  if (url.pathname.startsWith('/BoxingTimer-Beta/')) {
    e.respondWith(
      caches.match(e.request).then(response => {
        return response || fetch(e.request);
      })
    );
  }
});
