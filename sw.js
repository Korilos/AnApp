const CACHE_NAME = 'smart-dashboard-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Network first for HTML and JS to ensure updates are seen
  if (e.request.destination === 'document' || e.request.destination === 'script') {
    e.respondWith(
      fetch(e.request)
        .catch(() => caches.match(e.request))
    );
  } else {
    // Cache first for other assets (images, styles)
    e.respondWith(
      caches.match(e.request).then((response) => response || fetch(e.request))
    );
  }
});