self.addEventListener('push', function(event) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/icon.png', // Ruta al icono de la notificación
      badge: '/badge.png' // Ruta a la insignia de la notificación
    };
  
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  });