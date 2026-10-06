import { useEffect, useState } from 'react'
import { LuScale, LuFlaskConical, LuInfo, LuMusic, LuLayers, LuImage, LuCog, LuSparkles, LuSun, LuMoon, LuTarget, LuWaves, LuOrbit, LuBrain, LuCloudSun, LuMenu, LuX, LuChevronDown } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import { Link } from '../router'
import { SearchButton } from './Search'
import { LANGS } from '../i18n'

const base = import.meta.env.BASE_URL
const LINKS = [
  { href: '#jukebox', key: 'navJukebox', Icon: LuMusic },
  { href: '#taqqos', key: 'navCompare', Icon: LuScale },
  { href: '#ichki', key: 'navInterior', Icon: LuTarget },
  { href: '#dengiz', key: 'navSea', Icon: LuWaves },
  { href: '#obhavo', key: 'navWeather', Icon: LuCloudSun },
  { href: '#layers', key: 'navLayers', Icon: LuLayers },
  { href: '#rasmlar', key: 'navPhotos', Icon: LuImage },
  { href: '#sayyoralar', key: 'navPlanets', Icon: LuOrbit },
  { href: '#faktlar', key: 'navFacts', Icon: LuSparkles },
  { href: '#viktorina', key: 'navQuiz', Icon: LuBrain },
  { href: '#how', key: 'navHow', Icon: LuCog },
  { page: '/science', key: 'navScience', Icon: LuFlaskConical },
  { page: '/about', key: 'navAbout', Icon: LuInfo },
]
const MAIN = ['#jukebox', '#taqqos', '#dengiz', '#obhavo', '#viktorina'] // sarlavhada ko'rinadiganlar, qolgani "Yana" ro'yxatida

// Bosh sahifada belgi (#id), boshqa sahifada "/#id"; sahifa havolalari alohida
function Item({ item, path, active, onClick, t }) {
  const { href, page, key, Icon } = item
  const isActive = page ? path === page : active === href
  const props = { className: isActive ? 'active' : '', 'aria-current': isActive ? (page ? 'page' : 'true') : undefined, onClick }
  const body = <><Icon aria-hidden="true" /> {t(key)}</>
  if (page) return <Link to={page} {...props}>{body}</Link>
  return path === '/' ? <a href={href} {...props}>{body}</a> : <Link to={`/${href}`} {...props}>{body}</Link>
}

export default function Nav({ path = '/', onSearch }) {
  const { t, lang, setLang, theme, toggleTheme } = usePrefs()
  const [active, setActive] = useState('')
  const [open, setOpen] = useState(false)
  const [more, setMore] = useState(false)
  const themeLabel = theme === 'dark' ? t('themeToLight') : t('themeToDark')

  // Hozir qaysi bo'limda ekanimizni ajratib ko'rsatish (scrollspy)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const line = window.innerWidth <= 1100 ? 90 : 80
      let cur = ''
      for (const { href } of LINKS) {
        if (!href) continue
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

  // "Yana" ro'yxati: Esc yoki tashqariga bosish yopadi
  useEffect(() => {
    if (!more) return
    const onKey = (e) => { if (e.key === 'Escape') setMore(false) }
    const onDown = (e) => { if (!e.target.closest?.('.nav-more')) setMore(false) }
    window.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    return () => { window.removeEventListener('keydown', onKey); document.removeEventListener('pointerdown', onDown) }
  }, [more])

  const main = LINKS.filter((l) => MAIN.includes(l.href))
  const rest = LINKS.filter((l) => !MAIN.includes(l.href))
  const moreActive = rest.some((l) => (l.page ? path === l.page : active === l.href))

  return (
    <header className="nav">
      <div className="nav-bar">
        <Link className="brand" to="/" onClick={() => { if (path === '/') window.scrollTo({ top: 0, behavior: 'smooth' }) }}><img className="logo" src={`${base}logo.png`} alt="" width="40" height="40" /> <span>{t('brand')}</span></Link>
        <nav className="nav-links" aria-label={t('navLabel')}>
          {main.map((item) => <Item key={item.href} item={item} path={path} active={active} t={t} />)}
          <div className="nav-more">
            <button type="button" className={`more-btn ${moreActive ? 'active' : ''}`} aria-haspopup="true" aria-expanded={more} onClick={() => setMore((m) => !m)}>
              {t('navMore')} <LuChevronDown aria-hidden="true" />
            </button>
            {more && (
              <div className="more-panel">
                {rest.map((item) => <Item key={item.href || item.page} item={item} path={path} active={active} t={t} onClick={() => setMore(false)} />)}
              </div>
            )}
          </div>
        </nav>
        <div className="nav-tools">
          <div className="lang" role="group" aria-label={t('langLabel')}>
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          <SearchButton onOpen={onSearch} />
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
          <div className="menu-lang" role="group" aria-label={t('langLabel')}>
            {LANGS.map((l) => (
              <button key={l} className={l === lang ? 'on' : ''} aria-pressed={l === lang} onClick={() => setLang(l)}>{l.toUpperCase()}</button>
            ))}
          </div>
          {LINKS.map((item) => <Item key={item.href || item.page} item={item} path={path} active={active} t={t} onClick={() => setOpen(false)} />)}
        </nav>
      )}
    </header>
  )
}
