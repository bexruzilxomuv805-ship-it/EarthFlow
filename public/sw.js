// Yer jukeboksi: oddiy offline xizmati.
// Sahifa (HTML) avval tarmoqdan, bo'lmasa keshdan. Qolgan fayllar keshdan, orqada yangilanadi.
const CACHE = 'yer-jukeboksi-v1'
const SHELL = ['./', 'favicon.png', 'logo.png', 'icon-192.png']

self.addEventListener('install', (e) => {
  self.skipWaiting()
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {}))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  const url = new URL(req.url)
  // Faqat o'z saytimizdagi GET so'rovlari; tashqi API (ob-havo) har doim tarmoqdan
  if (req.method !== 'GET' || url.origin !== self.location.origin) return

  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put('./', copy))
        return res
      }).catch(() => caches.match('./')),
    )
    return
  }

  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)) }
        return res
      }).catch(() => hit)
      return hit || net
    }),
  )
})
