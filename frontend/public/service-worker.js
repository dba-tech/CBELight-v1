// public/service-worker.js
const CACHE_NAME = 'app-cache-v2';
const OFFLINE_URL = '/';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192-v2.png',
  '/icons/icon-512-v2.png'
];

// Install - pre-cache core assets
self.addEventListener('install', (event) => {
  // make the new service worker take control ASAP (we still notify users via UpdatePrompt)
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

// Activate - cleanup old caches
self.addEventListener('activate', (event) => {
  clients.claim();
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => (key !== CACHE_NAME ? caches.delete(key) : null)))
    )
  );
});

// Allow the page to tell the SW to skip waiting (used by UpdatePrompt)
self.addEventListener('message', (event) => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Helper to determine "API-like" requests
function isApiRequest(url, request) {
  try {
    // same-origin /api/ path OR requests that prefer JSON responses
    return (
      (url.origin === location.origin && url.pathname.startsWith('/api/')) ||
      (request.headers.get('accept')?.includes('application/json'))
    );
  } catch (e) {
    return false;
  }
}

// Fetch - network-first for API-like requests, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // 1) Network-first for API-like requests
  if (isApiRequest(url, request)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Only cache successful, non-opaque responses (avoid caching cross-origin opaque responses)
          if (response && response.ok && response.type !== 'opaque') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() =>
          // on network failure fall back to cached API response (if any)
          caches.match(request).then((cached) => cached || new Response(JSON.stringify({ error: 'offline' }), {
            status: 503,
            headers: { 'Content-Type': 'application/json' }
          }))
        )
    );
    return;
  }

  // 2) Navigation requests (SPA) - network-first, fallback to cached index.html
  if (
    request.mode === 'navigate' ||
    (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))
  ) {
    event.respondWith(
      fetch(request)
        .then((resp) => resp)
        .catch(() => caches.match('/index.html').then((r) => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // 3) Other GET assets - cache-first with runtime caching
  if (request.method === 'GET') {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request)
          .then((response) => {
            // don't cache opaque cross-origin responses
            if (response && response.ok && response.type !== 'opaque') {
              const resClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, resClone));
            }
            return response;
          })
          .catch(() => {
            // fallback icon or offline shell for images/assets
            return caches.match('/icons/icon-192.png');
          });
      })
    );
  }
});
