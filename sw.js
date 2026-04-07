const CACHE_NAME = 'evocative-v4';
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

// Fetch Event (Full Bypass Strategy for Media)
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Explicitly bypass Service Worker for ALL cross-origin requests (Cloudinary, Firebase, etc.)
  // This is the most reliable way to prevent ERR_CACHE_OPERATION_NOT_SUPPORTED
  if (!url.origin.startsWith(self.location.origin)) {
    return;
  }

  // 2. Bypass for Media Files & Range Requests
  // We use respondWith(fetch) to ensure it reaches the network directly without cache interference
  const isMedia = url.pathname.match(/\.(mp4|webm|ogg|wav|mp3|m4a|aac|ogv)$/i) || 
                  event.request.destination === 'video' || 
                  event.request.destination === 'audio';

  if (isMedia) {
    event.respondWith(fetch(event.request));
    return;
  }

  // 3. Skip development internal requests (Vite)
  if (url.search.includes('token=') || url.pathname.includes('@vite/client')) return;

  // 4. Stale-While-Revalidate for local assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Cache new successful responses for basic local requests
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      });

      return cachedResponse || fetchPromise;
    })
  );
});
