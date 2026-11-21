self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  // Obtiene automáticamente la URL base de tu app (ej: https://jwasistem.github.io/jwasistem/)
  const baseUrl = self.registration.scope;
  
  // Obtiene la URL enviada desde la notificación
  let urlToOpen = event.notification.data?.url;
  
  // Si la URL es "/" o no existe, usamos la URL base para evitar ir a la raíz de GitHub Pages
  if (!urlToOpen || urlToOpen === '/' || urlToOpen === location.origin) {
      urlToOpen = baseUrl;
  } else if (!urlToOpen.startsWith('http')) {
      // Si es una ruta relativa, la unimos a la URL base
      urlToOpen = new URL(urlToOpen, baseUrl).href;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // 1. Si la app ya está abierta en alguna pestaña, solo la enfocamos
      for (const client of windowClients) {
        if (client.url.startsWith(baseUrl) && 'focus' in client) {
          return client.focus();
        }
      }
      // 2. Si no está abierta, abrimos una nueva pestaña con la URL correcta
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
