// /sw.js - v6.9.9rev3
const CACHE_NAME = 'boxing-timer-v6.9.9rev3';

const ASSETS = [
  './',
  './index.html',
  './icon.png',
  './maskable_icon_x192.png',
  './maskable_icon_x512.png',
  './maskable_icon.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.includes('manifest.json')) return;
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});
