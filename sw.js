/* CricVox service worker. Caches the app shell so the app opens offline. Session data stays in localStorage. */
const CACHE = 'cricvox-2ba559bb40';
const FILES = ["./","./assets/index-CVQ2CA98.js","./assets/index-DeqnZd4q.css","./icon-192.png","./icon-512.png","./icon-maskable-512.png","./icon.svg","./index.html","./manifest.webmanifest"];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('cricvox-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  // Pages: network first, so a new version shows up when online. Everything else: cache first.
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./', copy)); return res; }).catch(() => caches.match('./')));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});
