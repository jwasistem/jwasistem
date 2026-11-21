// sw.js — Service Worker para Push
self.addEventListener('install', (e) => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(clients.claim()));

self.addEventListener('push', (e) => {
  const d = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(
    d.title || 'Asignación teocrática',
    {
      body: d.body || 'Tienes una asignación pendiente',
      tag: d.tag || 'asg',
      data: d.data || {},
      requireInteraction: true
    }
  ));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
