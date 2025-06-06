importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

workbox.precaching.precacheAndRoute([
  { url: 'index.html', revision: null },
  { url: 'favicon.png', revision: null },
  { url: 'manifest.json', revision: null },
]);

workbox.routing.registerRoute(
  ({url}) => url.pathname.startsWith('/v1/'),
  new workbox.strategies.NetworkFirst()
);

workbox.routing.registerRoute(
  ({request}) => request.destination === 'image',
  new workbox.strategies.CacheFirst()
);

workbox.routing.registerRoute(
  ({ request }) => request.mode === 'navigate',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages',
    plugins: [
      new workbox.expiration.ExpirationPlugin({ maxEntries: 50 }),
    ],
  })
);

self.addEventListener('push', function(event) {
  let data = {};
  try {
    data = event.data.json();
  } catch (e) {
    data = { title: 'Notification', options: { body: event.data && event.data.text() } };
  }
  const title = data.title || 'Notification';
  const options = data.options || { body: '' };
  event.waitUntil(self.registration.showNotification(title, options));
});