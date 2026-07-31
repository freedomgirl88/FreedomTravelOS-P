// Cache for offline support
const CACHE_NAME = 'ftos-public-v0.1.2';

// Install event - pre-cache essentials
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Cache opened');
      return cache.add('/FreedomTravelOS/').catch(err => {
        console.log('[SW] Could not cache root:', err);
      });
    }).then(() => {
      console.log('[SW] Install complete');
      self.skipWaiting();
    })
  );
});

// Activate event - cleanup
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => {
          console.log('[SW] Deleting old cache:', name);
          return caches.delete(name);
        })
      );
    }).then(() => {
      console.log('[SW] Activation complete');
      self.clients.claim();
    })
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(request)
      .then(response => {
        // Don't cache bad responses
        if (!response || response.status !== 200) {
          // If it's a 404 and looks like an HTML request, serve index
          if (response.status === 404 && request.headers.get('accept')?.includes('text/html')) {
            return caches.match('/FreedomTravelOS/').catch(() => response);
          }
          return response;
        }

        // Cache good responses
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(request, responseToCache);
        });
        
        return response;
      })
      .catch(() => {
        // Network failed, try cache
        console.log('[SW] Network failed, checking cache for:', request.url);
        return caches.match(request)
          .then(response => {
            if (response) return response;
            
            // If it was an HTML request, serve index for client-side routing
            if (request.headers.get('accept')?.includes('text/html')) {
              return caches.match('/FreedomTravelOS/');
            }
            
            return new Response('Offline - Content not available', {
              status: 503,
              statusText: 'Service Unavailable'
            });
          });
      })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) { if ('focus' in client) return client.focus(); }
    if (clients.openWindow) return clients.openWindow('/FreedomTravelOS/?page=notifications');
  }));
});
