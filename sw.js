const CACHE = "recipes-v3";

const FILES = [
  "./",
  "./index.html",
  "./all_recipes.html",
  "./app.css",
  "./app.js",
  "./all_recipes.js",
  "./manifest.json",
  "./recipe-icon.png"
];

self.addEventListener("install", e => {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
