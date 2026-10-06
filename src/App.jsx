import { useEffect, useState } from 'react'
import { usePrefs } from './prefs'
import { Link, useLocation } from './router'
import Nav from './components/Nav'
import InstallPrompt from './components/InstallPrompt'
import CustomCursor from './components/CustomCursor'
import Search from './components/Search'
import Home from './pages/Home'
import Science from './pages/Science'
import About from './pages/About'
import { LuArrowUp } from 'react-icons/lu'
import './App.css'
import './extra.css'

const base = import.meta.env.BASE_URL

export default function App() {
  const { t } = usePrefs()
  const { path, hash } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)

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
    const name = path === '/science' ? t('navScience') : path === '/about' ? t('navAbout') : null
    document.title = name ? `${name} · EarthFlow` : 'EarthFlow'
  }, [path, t])

  return (
    <>
      <CustomCursor />
      <Nav path={path} onSearch={() => setSearchOpen(true)} />
      <InstallPrompt />
      <Search open={searchOpen} onClose={() => setSearchOpen(false)} />

      {path === '/science' ? <Science /> : path === '/about' ? <About /> : <Home />}

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
