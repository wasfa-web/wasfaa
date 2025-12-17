const CACHE_NAME = "recipes-app-v1";
const FILES = [
  "./",
  "./index.html",
  "./app.js",
  "./app.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});

