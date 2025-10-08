const CACHE_NAME = 'ai-prompt-manager-v2'
const STATIC_CACHE_URLS = [
  '/',
  '/new',
  '/favorites',
  '/categories',
  '/templates',
  '/import',
  '/export',
  '/analytics',
  '/manifest.json'
]

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  )
})

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      })
      .then(() => self.clients.claim())
  )
})

// Fetch event
self.addEventListener('fetch', (event) => {
  // Only cache GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip caching for development and API routes
  const url = new URL(event.request.url)
  if (url.hostname === 'localhost' || url.pathname.startsWith('/api/')) {
    return fetch(event.request)
  }

  event.respondWith(
    // Always try network first for fresh content
    fetch(event.request)
      .then((fetchResponse) => {
        // Don't cache non-successful responses
        if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
          return fetchResponse
        }

        // Only cache static assets, not dynamic pages
        if (STATIC_CACHE_URLS.includes(url.pathname) || 
            url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/)) {
          const responseToCache = fetchResponse.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache)
            })
        }

        return fetchResponse
      })
      .catch(() => {
        // Fallback to cache only if network fails
        return caches.match(event.request)
          .then((response) => {
            if (response) {
              return response
            }
            // Return offline page if available
            if (event.request.destination === 'document') {
              return caches.match('/')
            }
          })
      })
  )
})

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Handle offline actions when connection is restored
  return Promise.resolve()
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver',
        icon: '/icons/icon-72x72.png'
      },
      {
        action: 'close',
        title: 'Cerrar',
        icon: '/icons/icon-72x72.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('AI Prompt Manager', options)
  )
})

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
