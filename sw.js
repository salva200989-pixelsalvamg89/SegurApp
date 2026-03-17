const CACHE = 'segurapp-v6';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});

// Push notifications
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(data.title || 'SegurApp', {
    body: data.body || '',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: data.tag || 'segurapp',
  }));
});

// Periodic check — triggered by the app via postMessage
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'CHECK_EXPIRY') {
    const { docs } = e.data;
    const today = new Date();
    docs.forEach(doc => {
      if (!doc.exp) return;
      const parts = doc.exp.split('/');
      if (parts.length !== 3) return;
      const expDate = new Date(+parts[2], +parts[1] - 1, +parts[0]);
      const days = Math.ceil((expDate - today) / 86400000);
      if ([90, 60, 30].includes(days)) {
        self.registration.showNotification('⚠️ Documento por expirar — SegurApp', {
          body: `Tu ${doc.name} expira en ${days} días (${doc.exp})`,
          icon: '/icons/icon-192.png',
          tag: 'expiry-' + doc.name,
        });
      }
    });
  }
});
