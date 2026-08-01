const CACHE_NAME = 'ftos-p-v0.2.0';
const APP_ROOT = '/FreedomTravelOS-P/';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.add(APP_ROOT))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(names => Promise.all(
        names
          .filter(name => name.startsWith('ftos-p-') && name !== CACHE_NAME)
          .map(name => caches.delete(name))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;
  event.respondWith(
    fetch(request)
      .then(response => {
        if (!response || response.status !== 200) {
          if (response?.status === 404 && request.headers.get('accept')?.includes('text/html')) {
            return caches.match(APP_ROOT).then(cached => cached || response);
          }
          return response;
        }
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        return response;
      })
      .catch(async () => {
        const cached = await caches.match(request);
        if (cached) return cached;
        if (request.headers.get('accept')?.includes('text/html')) {
          const shell = await caches.match(APP_ROOT);
          if (shell) return shell;
        }
        return new Response('Offline - Content not available', { status: 503 });
      })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
    for (const client of list) if ('focus' in client) return client.focus();
    if (clients.openWindow) return clients.openWindow(APP_ROOT);
  }));
});
