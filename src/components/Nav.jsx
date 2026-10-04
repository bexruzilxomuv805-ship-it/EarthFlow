import { useEffect, useState } from 'react'
import { LuMusic, LuLayers, LuImage, LuCog, LuSparkles, LuSun, LuMoon, LuTarget, LuWaves, LuOrbit, LuBrain, LuCloudSun, LuMenu, LuX } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import { LANGS } from '../i18n'

const base = import.meta.env.BASE_URL
const LINKS = [
  { href: '#jukebox', key: 'navJukebox', Icon: LuMusic },
  { href: '#ichki', key: 'navInterior', Icon: LuTarget },
  { href: '#dengiz', key: 'navSea', Icon: LuWaves },
  { href: '#obhavo', key: 'navWeather', Icon: LuCloudSun },
  { href: '#layers', key: 'navLayers', Icon: LuLayers },
  { href: '#rasmlar', key: 'navPhotos', Icon: LuImage },
  { href: '#sayyoralar', key: 'navPlanets', Icon: LuOrbit },
  { href: '#faktlar', key: 'navFacts', Icon: LuSparkles },
  { href: '#viktorina', key: 'navQuiz', Icon: LuBrain },
  { href: '#how', key: 'navHow', Icon: LuCog },
]

export default function Nav() {
  const { t, lang, setLang, theme, toggleTheme } = usePrefs()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const themeLabel = theme === 'dark' ? t('themeToLight') : t('themeToDark')

  // Hozir qaysi bo'limda ekanimizni ajratib ko'rsatish (scrollspy)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerWidth <= 1100 ? 90 : 150
      let cur = ''
      for (const { href } of LINKS) {
        const el = document.getElementById(href.slice(1))
        if (el && el.getBoundingClientRect().top <= line) cur = href
      }
      setActive(cur)
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [])

  // Menyu ochiq paytda: Esc yoki tashqariga bosish yopadi
  useEffect(() => {
    if (!open) return
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false) }
    const onDown = (e) => { if (!e.target.closest?.('.nav')) setOpen(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [open])

  return (
    <header className="nav">
      <div className="nav-bar">
        <a className="brand" href="#top"><img className="logo" src={`${base}logo.png`} alt="" width="40" height="40" /> <span>{t('brand')}</span></a>
        <nav className="nav-links" aria-label={t('navLabel')}>
          {[LINKS.slice(0, 5), LINKS.slice(5)].map((row, i) => (
            <div className="nav-row" key={i}>
              {row.map(({ href, key, Icon }) => (
                <a key={href} href={href} className={active === href ? 'active' : ''} aria-current={active === href ? 'true' : undefined}><Icon aria-hidden="true" /> {t(key)}</a>
              ))}
            </div>
          ))}
        </nav>
        <div className="nav-tools">
          <div className="lang" role="group" aria-label={t('langLabel')}>
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <button className="icon-btn" onClick={toggleTheme} aria-label={themeLabel} title={themeLabel}>
            {theme === 'dark' ? <LuSun aria-hidden="true" /> : <LuMoon aria-hidden="true" />}
          </button>
          <button className="icon-btn burger" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? t('menuClose') : t('menuOpen')}>
            {open ? <LuX aria-hidden="true" /> : <LuMenu aria-hidden="true" />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-menu" className="mobile-menu" aria-label={t('navLabel')}>
          {LINKS.map(({ href, key, Icon }) => (
            <a key={href} href={href} onClick={() => setOpen(false)} className={active === href ? 'active' : ''} aria-current={active === href ? 'true' : undefined}>
              <Icon aria-hidden="true" /> {t(key)}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}
