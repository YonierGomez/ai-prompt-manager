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

// Fetch event - Deshabilitado completamente el caché
self.addEventListener('fetch', (event) => {
  // Solo manejar requests GET
  if (event.request.method !== 'GET') {
    return
  }

  const url = new URL(event.request.url)
  
  // Siempre ir a la red, nunca usar caché
  event.respondWith(
    fetch(event.request, {
      cache: 'no-store',
      headers: {
        ...event.request.headers,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }).catch(() => {
      // Solo en caso de error de red, intentar caché como último recurso
      if (event.request.destination === 'document') {
        return new Response(
          '<!DOCTYPE html><html><head><title>Sin conexión</title></head><body><h1>Sin conexión a internet</h1><p>Por favor, verifica tu conexión e intenta de nuevo.</p></body></html>',
          { headers: { 'Content-Type': 'text/html' } }
        )
      }
      return new Response('Sin conexión', { status: 503 })
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
