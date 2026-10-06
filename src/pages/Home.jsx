import { Suspense, lazy, useEffect, useState } from 'react'
import { DATASETS } from '../data/datasets'
import { usePrefs } from '../prefs'
import Apod from '../components/Apod'
import Facts from '../components/Facts'
import SectionHead from '../components/SectionHead'
import Intro from '../components/Intro'
import Hologram from '../components/Hologram'
import { Link } from '../router'
import { LuPlay, LuArrowDown } from 'react-icons/lu'

// Og'ir 3D bo'limlar alohida faylda: sahifa matni tezroq chiqadi
const HeroGlobe = lazy(() => import('../components/HeroGlobe'))
const EarthLayers = lazy(() => import('../components/EarthLayers'))
const Later = ({ h = 480, children }) => <Suspense fallback={<div className="skel" style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>

const base = import.meta.env.BASE_URL
const LAYER_IMGS = ['earth-blue-marble.jpg', 'earth-night.jpg', 'earth-topology.png', 'earth-water.png']

// Kirish sahnasi: havola, belgi yoki "harakatni kamaytirish" bo'lsa o'tkazib yuboriladi
const q = new URLSearchParams(window.location.search)
const SHOW_INTRO = !window.location.hash && !q.has('spot')
  && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let introShown = false // kirish sahnasi faqat birinchi ochilishda

// Bosh sahifa: faqat Yer haqida. Qolgan bo'limlar o'z havolasida.
export default function Home() {
  const { t } = usePrefs()
  const [showIntro] = useState(() => SHOW_INTRO && !introShown)
  useEffect(() => { introShown = true }, [])

  return (
    <main id="top">
      {showIntro && <Intro datasets={DATASETS} onSkip={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} />}

      <section className="hero" id="hero">
        <div className="hero-text">
          <span className="pixel tag">NASA SPACE APPS · 2026</span>
          {showIntro ? <h2 className="h1">{t('heroTitle')}</h2> : <h1>{t('heroTitle')}</h1>}
          <p className="lead">{t('heroLead')}</p>
          <div className="cta">
            <Link className="btn" to="/jukebox"><LuPlay aria-hidden="true" /> {t('heroStart')}</Link>
            <Link className="btn ghost" to="/qanday-ishlaydi">{t('heroHow')} <LuArrowDown aria-hidden="true" style={{ transform: 'rotate(-90deg)' }} /></Link>
          </div>
          <p className="hint muted small">{t('heroHint')}</p>
        </div>
        <Suspense fallback={<div className="globe-wrap"><div className="globe"><div className="globe-fallback" aria-hidden="true" /></div></div>}>
          <HeroGlobe heat={0.35} pulse={0} playing={false} />
        </Suspense>
      </section>

      <div className="wrap">
        <Facts />
        <Hologram />
        <Later h={700}><EarthLayers /></Later>
        <Apod />

        <section className="section" id="layers" aria-labelledby="layers-title">
          <SectionHead id="layers-title" tag={t('layersTag')} title={t('layersTitle')} lead={t('layersLead')} />
          <div className="grid layers">
            {LAYER_IMGS.map((img, i) => (
              <figure className="card photo" key={img}>
                <img src={`${base}textures/${img}`} alt={t(`l${i + 1}_title`)} loading="lazy" />
                <figcaption className="cap"><strong>{t(`l${i + 1}_title`)}</strong><span className="muted small">{t(`l${i + 1}_text`)}</span><span className="credit small">{t('layerCredit')}</span></figcaption>
              </figure>
            ))}
          </div>
        </section>
      </div>
    </main>
  )
}
