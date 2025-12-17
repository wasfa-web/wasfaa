// اسم الكاش الحالي
const CACHE = "recipes-v3";

// الملفات الأساسية للتخزين المؤقت
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

// ---------------------------------------------
// تثبيت Service Worker وتخزين الملفات في الكاش
// ---------------------------------------------
self.addEventListener("install", e => {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(CACHE).then(c => {
      console.log("[ServiceWorker] Caching app shell");
      return c.addAll(FILES);
    })
  );
  self.skipWaiting(); // لتفعيل SW الجديد فورًا
});

// ---------------------------------------------
// تفعيل Service Worker وحذف الكاش القديم
// ---------------------------------------------
self.addEventListener("activate", e => {
  console.log("[ServiceWorker] Activate");
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE) {
            console.log("[ServiceWorker] Removing old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim(); // السيطرة على الصفحات فورًا
});

// ---------------------------------------------
// التقاط الطلبات وإرجاع الملفات من الكاش إذا موجودة
// ---------------------------------------------
self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      return r || fetch(e.request);
    })
  );
});
