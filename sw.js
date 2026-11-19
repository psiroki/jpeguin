const cacheName = "jpeguin-v1.0.0";
const files = [
  "/jpeguin/",
  "/jpeguin/?source=pwa",
  "/jpeguin/crc32.js",
  "/jpeguin/favicon.jpeg",
  "/jpeguin/icon-192.png",
  "/jpeguin/icon-512.png",
  "/jpeguin/index.html",
  "/jpeguin/jpeguin.jpeg",
  "/jpeguin/manifest.json"
];

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.open(cacheName)
      .then(c => c.match(event.request))
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(files);
    })
  );
});

// Delete stale caches from previous versions once the new one is active.
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key.startsWith("jpeguin-v") && key !== cacheName)
          .map(key => caches.delete(key))
    ))
  );
});

self.addEventListener("message", event => {
  const msg = event.data;
  if (msg["action"] === "hi") {
    const dash = cacheName.indexOf("-");
    event.source.postMessage({"action": "greetings", "version": cacheName.substring(dash + 1)});
  }
});
