// 통신이 약한 현장에서도 앱이 열리도록 파일을 캐시하는 서비스 워커 (캐시를 먼저 보여 주고 뒤에서 새로 받는다)
const CACHE = 'doffing-open-v1';

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', 'manifest.json', 'icon-180.png', 'icon-512.png'])));
  self.skipWaiting();
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async c => {
    const hit = await c.match(e.request);
    const net = fetch(e.request).then(r => { if (r.ok) c.put(e.request, r.clone()); return r; });
    if (!hit) return net;
    net.catch(() => {});
    return hit;
  }));
});
