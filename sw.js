var CACHE = 'eclaircie-v20';
var SHELL = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './fonts.css', './fonts/bricolage-grotesque-latin-500-normal.woff2', './fonts/bricolage-grotesque-latin-700-normal.woff2', './fonts/figtree-latin-400-normal.woff2', './fonts/figtree-latin-500-normal.woff2', './fonts/figtree-latin-600-normal.woff2'];
self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (ks) {
    return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});
self.addEventListener('fetch', function (e) {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(function (hit) {
    var net = fetch(e.request).then(function (r) {
      if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(CACHE).then(function (c) { c.put(e.request, cp); }); }
      return r;
    }).catch(function () { return hit; });
    return hit || net;
  }));
});
