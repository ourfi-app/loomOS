
// Enhanced Service Worker with Advanced Caching Strategies
const CACHE_VERSION = 'v2';
const CACHE_NAME = `montrecott-${CACHE_VERSION}`;
const RUNTIME_CACHE = `montrecott-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `montrecott-images-${CACHE_VERSION}`;
const API_CACHE = `montrecott-api-${CACHE_VERSION}`;

// Cache duration in milliseconds
const CACHE_DURATION = {
  static: 7 * 24 * 60 * 60 * 1000, // 7 days
  api: 5 * 60 * 1000, // 5 minutes
  images: 30 * 24 * 60 * 60 * 1000, // 30 days
};

// Static resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/dashboard',
  '/offline',
  '/favicon.svg',
  '/manifest.json',
];

// Install event - cache core resources
self.addEventListener('install', (event) => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activate');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('montrecott-') && name !== CACHE_NAME && name !== RUNTIME_CACHE && name !== IMAGE_CACHE && name !== API_CACHE)
            .map((name) => {
              console.log('[SW] Removing old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event with smart caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome extensions and webpack hot reload
  if (url.protocol === 'chrome-extension:' || url.pathname.includes('__webpack')) {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (url.pathname.startsWith('/api/')) {
    // API requests: Network First with API cache
    event.respondWith(networkFirstStrategy(request, API_CACHE, CACHE_DURATION.api));
  } else if (request.destination === 'image') {
    // Images: Cache First with Image cache
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, CACHE_DURATION.images));
  } else if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/static/')) {
    // Static assets: Cache First
    event.respondWith(cacheFirstStrategy(request, CACHE_NAME, CACHE_DURATION.static));
  } else {
    // Pages: Stale While Revalidate
    event.respondWith(staleWhileRevalidateStrategy(request, RUNTIME_CACHE));
  }
});

// Cache First Strategy - Good for images and static assets
async function cacheFirstStrategy(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    // Check if cache is expired
    const cachedTime = new Date(cachedResponse.headers.get('sw-cache-time'));
    const now = new Date();
    if (now - cachedTime < maxAge) {
      return cachedResponse;
    }
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  } catch (error) {
    return cachedResponse || new Response('Offline', { status: 503 });
  }
}

// Network First Strategy - Good for API calls
async function networkFirstStrategy(request, cacheName, maxAge) {
  const cache = await caches.open(cacheName);

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const responseToCache = networkResponse.clone();
      const headers = new Headers(responseToCache.headers);
      headers.set('sw-cache-time', new Date().toISOString());
      
      const modifiedResponse = new Response(responseToCache.body, {
        status: responseToCache.status,
        statusText: responseToCache.statusText,
        headers: headers,
      });

      cache.put(request, modifiedResponse);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await cache.match(request);
    if (cachedResponse) {
      // Check if cache is not too old
      const cachedTime = new Date(cachedResponse.headers.get('sw-cache-time'));
      const now = new Date();
      if (now - cachedTime < maxAge) {
        return cachedResponse;
      }
    }
    throw error;
  }
}

// Stale While Revalidate Strategy - Good for pages
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);

  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return cachedResponse || fetchPromise;
}

// Background Sync
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  if (event.tag === 'sync-data') {
    event.waitUntil(syncData());
  }
});

async function syncData() {
  // Implement your sync logic here
  console.log('[SW] Syncing data...');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'Montrecott';
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    data: data.data,
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((windowClients) => {
        // Check if there's already a window open
        for (let i = 0; i < windowClients.length; i++) {
          const client = windowClients[i];
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Message handler for cache management
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((name) => caches.delete(name))
        );
      })
    );
  }
});
