import { Suspense, lazy, useEffect, useMemo, useState } from 'react'
import { DATASETS } from './data/datasets'
import { useSonify } from './hooks/useSonify'
import { usePrefs } from './prefs'
import Nav from './components/Nav'
import Jukebox from './components/Jukebox'
import Apod from './components/Apod'
import Facts from './components/Facts'
import Quiz from './components/Quiz'
import SectionHead from './components/SectionHead'
import { LuPlay, LuArrowDown, LuArrowUp, LuDatabase, LuMusic, LuGlobe } from 'react-icons/lu'
import './App.css'

// Og'ir 3D bo'limlar alohida faylda: sahifa matni tezroq chiqadi
const HeroGlobe = lazy(() => import('./components/HeroGlobe'))
const EarthLayers = lazy(() => import('./components/EarthLayers'))
const SeaLevel = lazy(() => import('./components/SeaLevel'))
const Planets = lazy(() => import('./components/Planets'))
const Later = ({ h = 480, children }) => <Suspense fallback={<div style={{ minHeight: h }} aria-hidden="true" />}>{children}</Suspense>

const base = import.meta.env.BASE_URL
const LAYER_IMGS = ['earth-blue-marble.jpg', 'earth-night.jpg', 'earth-topology.png', 'earth-water.png']
const STEP_ICONS = [LuDatabase, LuMusic, LuGlobe]

// Ulashilgan havola: ?d=co2&y=1999
const shared = new URLSearchParams(window.location.search)
const initialDs = DATASETS.some((d) => d.id === shared.get('d')) ? shared.get('d') : 'temperature'
const initialYear = Number(shared.get('y'))

export default function App() {
  const { t } = usePrefs()
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
    <>
      <Nav />

      <main id="top">
        <section className="hero">
          <div className="hero-text">
            <span className="pixel tag">NASA SPACE APPS · 2026</span>
            <h1>{t('heroTitle')}</h1>
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

          <Later h={700}><EarthLayers /></Later>

          <Later h={640}><SeaLevel /></Later>

          <section className="section" id="layers" aria-labelledby="layers-title">
            <SectionHead id="layers-title" tag={t('layersTag')} title={t('layersTitle')} lead={t('layersLead')} />
            <div className="grid layers">
              {LAYER_IMGS.map((img, i) => (
                <figure className="card photo" key={img}>
                  <img src={`${base}textures/${img}`} alt={t(`l${i + 1}_title`)} loading="lazy" />
                  <figcaption className="cap"><strong>{t(`l${i + 1}_title`)}</strong><span className="muted small">{t(`l${i + 1}_text`)}</span></figcaption>
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
        </div>
      </main>

      <footer className="footer">
        <img className="logo foot" src={`${base}logo.png`} alt={t('footerLogo')} width="56" height="56" />
        <p>{t('footerData')}</p>
        <p className="muted small">{t('footerNote')}</p>
        <a className="to-top" href="#top"><LuArrowUp aria-hidden="true" /> {t('toTop')}</a>
      </footer>
    </>
  )
}
