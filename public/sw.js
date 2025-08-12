const CACHE_NAME = 'glassmorphic-todo-v1.0.0';
const STATIC_CACHE = `${CACHE_NAME}-static`;
const DYNAMIC_CACHE = `${CACHE_NAME}-dynamic`;

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png',
  '/assets/icons/maskable-icon-192x192.png',
  '/assets/icons/maskable-icon-512x512.png'
];

const CACHE_STRATEGIES = {
  CACHE_FIRST: 'cache-first',
  NETWORK_FIRST: 'network-first',
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
};

const MAX_CACHE_SIZE = 50;
const CACHE_EXPIRY_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

// Install event - cache static assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Service Worker: Failed to cache static assets', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control of all clients
      self.clients.claim()
    ])
  );
});

// Fetch event - handle network requests
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip cross-origin requests
  if (url.origin !== location.origin) return;

  event.respondWith(handleFetch(request));
});

async function handleFetch(request) {
  const url = new URL(request.url);
  
  try {
    // Handle different types of requests
    if (isStaticAsset(url.pathname)) {
      return await cacheFirst(request, STATIC_CACHE);
    } else if (isAPIRequest(url.pathname)) {
      return await networkFirst(request, DYNAMIC_CACHE);
    } else {
      return await staleWhileRevalidate(request, DYNAMIC_CACHE);
    }
  } catch (error) {
    console.error('Service Worker: Fetch failed', error);
    return await handleOffline(request);
  }
}

function isStaticAsset(pathname) {
  return pathname.includes('/assets/') || 
         pathname.endsWith('.js') || 
         pathname.endsWith('.css') ||
         pathname.endsWith('.png') ||
         pathname.endsWith('.jpg') ||
         pathname.endsWith('.svg') ||
         pathname.endsWith('.ico');
}

function isAPIRequest(pathname) {
  return pathname.startsWith('/api/');
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  if (cached) {
    return cached;
  }
  
  const response = await fetch(request);
  
  if (response.ok) {
    await cache.put(request, response.clone());
  }
  
  return response;
}

async function networkFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  
  try {
    const response = await fetch(request);
    
    if (response.ok) {
      await cache.put(request, response.clone());
      await limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    
    return response;
  } catch (error) {
    const cached = await cache.match(request);
    
    if (cached) {
      return cached;
    }
    
    throw error;
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  
  const fetchPromise = fetch(request).then(response => {
    if (response.ok) {
      cache.put(request, response.clone());
      limitCacheSize(cacheName, MAX_CACHE_SIZE);
    }
    return response;
  }).catch(() => cached);
  
  return cached || fetchPromise;
}

async function handleOffline(request) {
  const cache = await caches.open(STATIC_CACHE);
  
  // Try to serve from cache first
  const cached = await cache.match(request);
  if (cached) return cached;
  
  // For navigation requests, serve offline page
  if (request.mode === 'navigate') {
    const offlinePage = await cache.match('/offline.html');
    if (offlinePage) return offlinePage;
  }
  
  // Return a basic offline response
  return new Response(
    JSON.stringify({ 
      error: 'Offline', 
      message: 'You are currently offline. Please check your connection.' 
    }),
    {
      status: 503,
      statusText: 'Service Unavailable',
      headers: { 'Content-Type': 'application/json' }
    }
  );
}

async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    const keysToDelete = keys.slice(0, keys.length - maxSize);
    await Promise.all(keysToDelete.map(key => cache.delete(key)));
  }
}

// Background sync for offline actions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync triggered', event.tag);
  
  if (event.tag === 'todo-sync') {
    event.waitUntil(syncTodos());
  }
});

async function syncTodos() {
  try {
    const todos = await getOfflineTodos();
    
    for (const todo of todos) {
      await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(todo)
      });
    }
    
    await clearOfflineTodos();
    console.log('Service Worker: Todos synced successfully');
  } catch (error) {
    console.error('Service Worker: Failed to sync todos', error);
  }
}

async function getOfflineTodos() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const request = new Request('/offline-todos');
  const response = await cache.match(request);
  
  if (response) {
    return await response.json();
  }
  
  return [];
}

async function clearOfflineTodos() {
  const cache = await caches.open(DYNAMIC_CACHE);
  await cache.delete('/offline-todos');
}

// Push notifications
self.addEventListener('push', event => {
  console.log('Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New todo reminder!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Todo',
        icon: '/assets/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icons/xmark.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Glassmorphic Todo', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked');
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});