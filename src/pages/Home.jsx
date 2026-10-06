import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { DATASETS } from '../data/datasets'
import { useSonify } from '../hooks/useSonify'
import { usePrefs } from '../prefs'
import Jukebox from '../components/Jukebox'
import Apod from '../components/Apod'
import Facts from '../components/Facts'
import Quiz from '../components/Quiz'
import Weather from '../components/Weather'
import SectionHead from '../components/SectionHead'
import Intro from '../components/Intro'
import Numbers from '../components/Numbers'
import Compare from '../components/Compare'
import Sources from '../components/Sources'
import { Link } from '../router'
import { LuPlay, LuArrowDown, LuDatabase, LuMusic, LuGlobe } from 'react-icons/lu'

// Og'ir 3D bo'limlar alohida faylda: sahifa matni tezroq chiqadi
const HeroGlobe = lazy(() => import('../components/HeroGlobe'))
const EarthLayers = lazy(() => import('../components/EarthLayers'))
const SeaLevel = lazy(() => import('../components/SeaLevel'))
const Planets = lazy(() => import('../components/Planets'))
const Later = ({ h = 480, children }) => <Suspense fallback={<div className="skel" style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>

const base = import.meta.env.BASE_URL
const LAYER_IMGS = ['earth-blue-marble.jpg', 'earth-night.jpg', 'earth-topology.png', 'earth-water.png']
const STEP_ICONS = [LuDatabase, LuMusic, LuGlobe]

// Ulashilgan havola: ?d=co2&y=1999
const shared = new URLSearchParams(window.location.search)
const initialDs = DATASETS.some((d) => d.id === shared.get('d')) ? shared.get('d') : 'temperature'
const initialYear = Number(shared.get('y'))
// Kirish sahnasi: havola, belgi yoki "harakatni kamaytirish" bo'lsa o'tkazib yuboriladi
const SHOW_INTRO = !window.location.hash && !shared.has('d') && !shared.has('y') && !shared.has('spot')
  && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

let introShown = false // kirish sahnasi faqat birinchi ochilishda

export default function Home() {
  const { t } = usePrefs()
  const [showIntro] = useState(() => SHOW_INTRO && !introShown)
  useEffect(() => { introShown = true }, [])
  const [dsId, setDsId] = useState(initialDs)
  const [speed, setSpeed] = useState(140)
  const ds = DATASETS.find((d) => d.id === dsId)
  const { data, source, unit } = ds.json
  const { playing, index, play, stop, seek } = useSonify(data, speed, ds.wave)

  useEffect(() => {
    const i = data.findIndex((p) => p.year === initialYear)
    if (i >= 0) seek(i)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const heat = useMemo(() => {
    let min = Infinity, max = -Infinity
    for (const p of data) { if (p.value < min) min = p.value; if (p.value > max) max = p.value }
    return (data[index].value - min) / (max - min || 1)
  }, [data, index])

  return (
    <main id="top">
      {showIntro && <Intro datasets={DATASETS} onSkip={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })} />}

      <section className="hero" id="hero">
        <div className="hero-text">
          <span className="pixel tag">NASA SPACE APPS · 2026</span>
          {showIntro ? <h2 className="h1">{t('heroTitle')}</h2> : <h1>{t('heroTitle')}</h1>}
          <p className="lead">{t('heroLead')}</p>
          <div className="cta">
            <button className="btn" onClick={() => { document.getElementById('jukebox').scrollIntoView({ behavior: 'smooth' }); play() }}><LuPlay aria-hidden="true" /> {t('heroStart')}</button>
            <a className="btn ghost" href="#how">{t('heroHow')} <LuArrowDown aria-hidden="true" /></a>
          </div>
          <p className="hint muted small">{t('heroHint')}</p>
        </div>
        <Suspense fallback={<div className="globe-wrap"><div className="globe"><div className="globe-fallback" aria-hidden="true" /></div></div>}>
          <HeroGlobe heat={heat} pulse={index} playing={playing} />
        </Suspense>
      </section>

      <div className="wrap">
        <Jukebox datasets={DATASETS} active={dsId} onSelect={setDsId} data={data} unit={unit} source={source} ds={ds}
          index={index} playing={playing} onPlay={play} onStop={stop} onSeek={seek} speed={speed} onSpeed={setSpeed} />

        <Compare />
        <Numbers />

        <Later h={700}><EarthLayers /></Later>

        <Later h={640}><SeaLevel /></Later>

        <Weather />

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

        <Apod />
        <Later h={700}><Planets /></Later>
        <Facts />
        <Quiz />

        <section className="section" id="how" aria-labelledby="how-title">
          <SectionHead id="how-title" tag={t('howTag')} title={t('howTitle')} />
          <div className="grid steps">
            {STEP_ICONS.map((Icon, i) => (
              <div className="card" key={i}>
                <div className="step"><Icon aria-hidden="true" /></div>
                <h3>{t(`s${i + 1}_title`)}</h3>
                <p className="muted">{t(`s${i + 1}_text`)}</p>
              </div>
            ))}
          </div>
          <p className="muted small">{t('howNote')}</p>
        </section>

        <Sources />
        <p className="muted small"><Link className="link" to="/science">{t('footScience')} →</Link></p>
      </div>
    </main>
  )
}
