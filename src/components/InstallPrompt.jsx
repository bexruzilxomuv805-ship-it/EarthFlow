import { useEffect, useState } from 'react'
import { LuShare, LuPlus, LuX } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import { clearInstallEvent, getInstallEvent, isIOS, isMobile, isStandalone, onInstallReady } from '../pwa'

const base = import.meta.env.BASE_URL
const KEY = 'install-dismissed'
const WAIT_DAYS = 14
const DELAY_MS = 7000

const wasDismissed = () => {
  try { const t = Number(localStorage.getItem(KEY)); return t && Date.now() - t < WAIT_DAYS * 864e5 } catch { return false }
}

// Faqat telefonda, ilova hali o'rnatilmagan bo'lsa va oldin rad etilmagan bo'lsa chiqadi
export default function InstallPrompt() {
  const { t } = usePrefs()
  const [show, setShow] = useState(false)
  const [ios] = useState(() => isMobile() && isIOS())

  useEffect(() => {
    if (!isMobile() || isStandalone() || wasDismissed()) return
    let timer
    const arm = () => { clearTimeout(timer); timer = setTimeout(() => setShow(true), DELAY_MS) }
    if (ios || getInstallEvent()) arm()
    const off = onInstallReady((e) => { if (e) arm(); else setShow(false) })
    return () => { clearTimeout(timer); off() }
  }, [ios])

  const dismiss = () => {
    setShow(false)
    try { localStorage.setItem(KEY, String(Date.now())) } catch { /* ok */ }
  }
  const install = async () => {
    const e = getInstallEvent()
    if (!e) return
    setShow(false)
    e.prompt()
    try { await e.userChoice } catch { /* ok */ }
    clearInstallEvent()
  }

  if (!show) return null
  return (
    <div className="install glass" role="dialog" aria-label={t('installTitle')}>
      <img src={`${base}icon-192.png`} alt="" width="48" height="48" className="install-icon" />
      <div className="install-body">
        <strong>{t('installTitle')}</strong>
        <p className="muted small">{ios ? t('installIosText') : t('installText')}</p>
        {ios ? (
          <p className="install-ios small" aria-hidden="true"><LuShare /> → <LuPlus /></p>
        ) : (
          <div className="install-actions">
            <button className="btn sm" onClick={install}>{t('installBtn')}</button>
            <button className="btn ghost sm" onClick={dismiss}>{t('installLater')}</button>
          </div>
        )}
      </div>
      <button className="icon-btn close" onClick={dismiss} aria-label={t('installClose')}><LuX aria-hidden="true" /></button>
    </div>
  )
}
