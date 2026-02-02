const CACHE_NAME = 'horizontes-v10';
const STATIC_ASSETS = [
  '/sounds/day_ambience.mp3',
  '/sounds/night_ambience.mp3',
  '/sounds/eco_hum.mp3',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS)));
});

self.addEventListener('fetch', (e) => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then((res) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(e.request, res.clone());
          return res;
        });
    }).catch(() => caches.match(e.request))
  );
});
