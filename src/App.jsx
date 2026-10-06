import { Suspense, lazy, useEffect, useState } from 'react'
import { usePrefs } from './prefs'
import { Link, useLocation } from './router'
import Nav from './components/Nav'
import InstallPrompt from './components/InstallPrompt'
import CustomCursor from './components/CustomCursor'
import Search from './components/Search'
import Home from './pages/Home'
import Science from './pages/Science'
import About from './pages/About'
import JukeboxPage from './pages/JukeboxPage'
import Shell from './pages/Shell'
import PlanetsIndex from './pages/PlanetsIndex'
import PlanetPage from './pages/PlanetPage'
import { PLANET_IDS, PLANETS } from './data/planets'
import Compare from './components/Compare'
import Numbers from './components/Numbers'
import Weather from './components/Weather'
import Quiz from './components/Quiz'
import How from './components/How'
import { LuArrowUp } from 'react-icons/lu'
import './App.css'
import './extra.css'

const SeaLevel = lazy(() => import('./components/SeaLevel'))
const Later = ({ h = 560, children }) => <Suspense fallback={<div className="skel" style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>

const base = import.meta.env.BASE_URL

// Har bir bo'lim o'z havolasida: yo'l -> sahifa va sarlavha kaliti
const ROUTES = {
  '/jukebox': { title: 'navJukebox', el: <JukeboxPage /> },
  '/taqqoslash': { title: 'navCompare', el: <Shell><Compare /><Numbers /></Shell> },
  '/dengiz': { title: 'navSea', el: <Shell><Later h={640}><SeaLevel /></Later></Shell> },
  '/ob-havo': { title: 'navWeather', el: <Shell><Weather /></Shell> },
  '/viktorina': { title: 'navQuiz', el: <Shell><Quiz /></Shell> },
  '/sayyoralar': { title: 'navPlanets', el: <PlanetsIndex /> },
  '/qanday-ishlaydi': { title: 'navHow', el: <Shell><How /></Shell> },
  '/science': { title: 'navScience', el: <Science /> },
  '/about': { title: 'navAbout', el: <About /> },
}

// Eski havolalar (#belgi yoki ?d=...) yangi manzilga o'tkaziladi
const LEGACY = { jukebox: '/jukebox', dengiz: '/dengiz', obhavo: '/ob-havo', viktorina: '/viktorina', sayyoralar: '/sayyoralar', how: '/qanday-ishlaydi', taqqos: '/taqqoslash', raqamlar: '/taqqoslash', manbalar: '/science' }
if (window.location.pathname === '/') {
  const sp = new URLSearchParams(window.location.search)
  const target = LEGACY[window.location.hash.slice(1)] || (sp.has('d') || sp.has('y') ? '/jukebox' : null)
  if (target) window.history.replaceState(null, '', target + window.location.search)
}

export default function App() {
  const { t, lang } = usePrefs()
  const { path, hash } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const planetId = path.startsWith('/sayyoralar/') ? path.slice('/sayyoralar/'.length) : null
  const route = planetId && PLANET_IDS.includes(planetId) ? { title: 'navPlanets', el: <PlanetPage key={planetId} id={planetId} /> } : ROUTES[path]

  // Ctrl+K yoki "/" qidiruvni ochadi
  useEffect(() => {
    const onKey = (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setSearchOpen(true) }
      else if (e.key === '/' && !typing) { e.preventDefault(); setSearchOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Sahifa almashganda: belgi bo'lsa shu bo'limga (3D bo'limlar kech yuklanadi, shuning uchun qayta urinamiz), bo'lmasa tepaga
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return }
    let tries = 0
    const id = setInterval(() => {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: tries ? 'auto' : 'smooth' }); clearInterval(id) }
      else if (++tries > 20) clearInterval(id)
    }, 80)
    return () => clearInterval(id)
  }, [path, hash])

  useEffect(() => {
    document.title = route ? `${planetId && PLANETS[planetId] ? PLANETS[planetId].name[lang] : t(route.title)} · EarthFlow` : 'EarthFlow'
  }, [route, t, planetId, lang])

  return (
    <>
      <CustomCursor />
      <Nav path={path} onSearch={() => setSearchOpen(true)} />
      <InstallPrompt />
      <Search open={searchOpen} onClose={() => setSearchOpen(false)} />

      {route ? route.el : <Home />}

      <footer className="footer">
        <img className="logo foot" src={`${base}logo.png`} alt={t('footerLogo')} width="56" height="56" />
        <p>{t('footerData')}</p>
        <p className="muted small">{t('footerNote')}</p>
        <p className="foot-links"><Link to="/science">{t('footScience')}</Link> · <Link to="/about">{t('footAbout')}</Link></p>
        <a className="to-top" href="#top"><LuArrowUp aria-hidden="true" /> {t('toTop')}</a>
      </footer>
    </>
  )
}
