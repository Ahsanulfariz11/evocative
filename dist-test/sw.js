const CACHE_NAME = 'evocative-v2';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/robots.txt',
  '/sitemap.xml',
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event (Stale-While-Revalidate Strategy)
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests (like Firebase) to avoid CORS issues in cache
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Skip Vite HMR and internal requests
  if (event.request.url.includes('token=') || event.request.url.includes('@vite/client')) return;

  // Skip media files (mp4, webm, etc.) to allow the browser to handle range requests directly
  if (event.request.url.match(/\.(mp4|webm|ogg|wav|mp3|m4a|aac)$/i)) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache new successful responses
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });

      // Return cached response if exists, otherwise wait for network
      return cachedResponse || fetchPromise;
    })
  );
});
