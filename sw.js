// sw.js — Service Worker para Push
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (event) => {
  let data = {};
  try { data = event.data.json(); } catch (_) {}

  const title = data.title || 'Asignación teocrática';
  const options = {
    body: data.body || 'Tienes una asignación pendiente',
    icon: data.icon || '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'asg-' + Date.now(),
    data: data.data || {},
    requireInteraction: true,
    vibrate: [200, 100, 200]
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(urlToOpen);
    })
  );
});
