// Ilova sifatida o'rnatish: FAQAT telefonlarda yoqiladi.
// Kompyuterda manifest umuman ulanmaydi, shuning uchun brauzer "o'rnatish" tugmasini ko'rsatmaydi.
const base = import.meta.env.BASE_URL

export const isIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const isMobile = () =>
  /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent) ||
  (window.matchMedia?.('(pointer: coarse)').matches && Math.min(window.screen.width, window.screen.height) <= 820)

export const isStandalone = () =>
  window.matchMedia?.('(display-mode: standalone)').matches || window.navigator.standalone === true

let deferred = null
const listeners = new Set()
export const getInstallEvent = () => deferred
export const onInstallReady = (cb) => { listeners.add(cb); return () => listeners.delete(cb) }
export const clearInstallEvent = () => { deferred = null }

export function setupPwa() {
  if (!isMobile()) return
  // Manifest faqat telefonda ulanadi
  const link = document.createElement('link')
  link.rel = 'manifest'
  link.href = `${base}manifest.webmanifest`
  document.head.appendChild(link)

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault() // brauzerning o'z bannerini o'chirib, o'zimizniki ko'rsatamiz
    deferred = e
    listeners.forEach((cb) => cb(e))
  })
  window.addEventListener('appinstalled', () => { deferred = null; listeners.forEach((cb) => cb(null)) })

  if ('serviceWorker' in navigator && import.meta.env.PROD) {
    const register = () => navigator.serviceWorker.register(`${base}sw.js`).catch(() => {})
    // Sahifa allaqachon yuklangan bo'lishi mumkin, shuning uchun holatni tekshiramiz
    if (document.readyState === 'complete') register()
    else window.addEventListener('load', register)
  }
}
