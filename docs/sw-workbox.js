importScripts('https://storage.googleapis.com/workbox-cdn/releases/6.5.4/workbox-sw.js');

workbox.setConfig({ debug: false });

workbox.precaching.precacheAndRoute([
  { url: '/', revision: null },
  { url: '/index.html', revision: null },
  { url: '/styles/styles.css', revision: null },
  { url: '/scripts/index.js', revision: null },
  { url: '/public/favicon.png', revision: null },
  { url: '/public/manifest.json', revision: null },
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