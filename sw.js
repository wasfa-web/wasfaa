const CACHE = "recipes-v2";

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
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(res => res || fetch(e.request))
  );
});
