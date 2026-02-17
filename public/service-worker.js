// BasicGermany Service Worker
// Caching strategy: Network First for API, Cache First for static assets

const CACHE_NAME = 'basicgermany-v1';
const STATIC_CACHE_NAME = 'basicgermany-static-v1';
const DYNAMIC_CACHE_NAME = 'basicgermany-dynamic-v1';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/knowledge',
  '/knowledge/all',
  '/site-icon.png',
  '/site-icon-light.png',
  '/assets/ios.png',
  '/assets/android.png',
  '/assets/web.png',
  '/assets/Expatova.png',
  '/assets/Bullettin.applogo.png',
  '/assets/YouTube.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== STATIC_CACHE_NAME && 
                   cacheName !== DYNAMIC_CACHE_NAME &&
                   cacheName.startsWith('basicgermany-');
          })
          .map((cacheName) => {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  // Take control immediately
  self.clients.claim();
});

// Fetch event - handle requests with appropriate strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip Chrome extensions and other non-http(s) requests
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // CRITICAL: Exclude admin routes and API routes from SW interception
  // This prevents ERR_BLOCKED_BY_CLIENT and Firestore connection issues
  if (isAdminRoute(url) || isApiRoute(url)) {
    return; // Let the browser handle these directly
  }

  // Handle different types of requests
  if (isStaticAsset(url)) {
    // Cache First strategy for static assets
    event.respondWith(cacheFirst(request));
  } else if (isFirestoreRequest(url)) {
    // Network Only for Firestore (real-time data)
    event.respondWith(networkOnly(request));
  } else if (isNavigationRequest(request)) {
    // Network First for navigation (HTML pages)
    event.respondWith(networkFirst(request));
  } else {
    // Stale While Revalidate for everything else
    event.respondWith(staleWhileRevalidate(request));
  }
});

// Helper functions to identify request types
function isAdminRoute(url) {
  // Exclude admin panel routes to prevent interference with Firestore operations
  return url.pathname.startsWith('/admin/') || 
         url.pathname === '/admin';
}

function isApiRoute(url) {
  // Exclude API routes (especially revalidation) from SW interception
  return url.pathname.startsWith('/api/') ||
         url.pathname.startsWith('/_next/data/');
}

function isStaticAsset(url) {
  const staticExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2', '.ttf', '.css'];
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.startsWith('/assets/') ||
         url.pathname.includes('/_next/static/');
}

function isFirestoreRequest(url) {
  // Don't intercept Firebase/Firestore requests - let them pass through
  return url.hostname.includes('firestore.googleapis.com') ||
         url.hostname.includes('firebasestorage.googleapis.com') ||
         url.hostname.includes('firebase.google.com');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate' ||
         request.headers.get('accept')?.includes('text/html');
}

// Caching Strategies

// Cache First: Check cache, fallback to network
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    // Return offline fallback if available
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
}

// Network First: Try network, fallback to cache
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    // Return offline page for navigation requests
    return caches.match('/') || new Response('Offline', { status: 503 });
  }
}

// Network Only: Always fetch from network
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Network unavailable', { status: 503 });
  }
}

// Stale While Revalidate: Return cache immediately, update in background
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => null);

  return cachedResponse || fetchPromise || new Response('Offline', { status: 503 });
}

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
    });
  }
});
