const CACHE_NAME = 'nadespot-cache-v1';
const FILES_TO_CACHE = [
  '/',
  "/ancient.html",
  "/anubis.html",
  "/dust2.html",
  "/index.html",
  "/inferno.html",
  "/manifest.json",
  "/mirage.html",
  "/myscript.js",
  "/nuke.html",
  "/README.md",
  "/service-worker.js",
  "/style.css",
  "/train.html",
  "/img/flash.jpg",
  "/img/he.jpg",
  "/img/molotov.jpg",
  "/img/smoke.jpg",
  "/img/ancient/donut.jpg",
  "/img/ancient/long.jpg",
  "/img/ancient/short.jpg",
  "/img/ancient/window.jpg",
  "/img/anubis/connector.jpg",
  "/img/anubis/ct.jpg",
  "/img/anubis/temple.jpg",
  "/img/anubis/window.jpg",
  "/img/dust2/ct.jpg",
  "/img/dust2/door.jpg",
  "/img/dust2/midtob.jpg",
  "/img/dust2/window.jpg",
  "/img/icons/goodtoknow.png",
  "/img/icons/home.png",
  "/img/icons/icon-192x192.png",
  "/img/icons/icon-512x512.png",
  "/img/icons/mapicon.png",
  "/img/icons/nadespot.png",
  "/img/inferno/banan.jpg",
  "/img/inferno/ct.jpg",
  "/img/inferno/long.jpg",
  "/img/inferno/short.jpg",
  "/img/maps/ancient.jpg",
  "/img/maps/anubis.jpg",
  "/img/maps/dust2.jpg",
  "/img/maps/inferno.jpg",
  "/img/maps/mirage.jpg",
  "/img/maps/nuke.jpeg",
  "/img/maps/Train.png",
  "/img/mirage/smoke-ct.jpg",
  "/img/mirage/smoke-jungle.jpg",
  "/img/mirage/smoke-stairs.jpg",
  "/img/mirage/smoke-window.jpg",
  "/img/nuke/garage.jpg",
  "/img/nuke/redbox.jpg",
  "/img/nuke/secret.jpg",
  "/img/nuke/vent.jpg",
  "/img/train/camera.jpg",
  "/img/train/connector.jpg",
  "/img/train/lower.jpg",
  "/img/train/main.jpg",
  "/offline.html"
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(name => {
          if (name !== CACHE_NAME) return caches.delete(name);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request).catch(() => caches.match('/offline.html')))
  );
});