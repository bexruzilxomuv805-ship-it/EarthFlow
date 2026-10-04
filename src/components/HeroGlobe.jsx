import { useEffect, useState } from 'react'
import { LuSunMoon, LuRotateCw, LuX, LuMapPin } from 'react-icons/lu'
import Earth3D from './Earth3D'
import ErrorBoundary from './ErrorBoundary'
import { usePrefs } from '../prefs'
import { useNearScreen } from '../hooks/useNearScreen'

// Globusdagi qiziqarli joylar (kenglik, uzunlik). Matnlar i18n da: sp<id>_name / sp<id>_text
const SPOTS = [
  { id: 8, lat: 41.3, lon: 69.2 },  // O'zbekiston (Toshkent)
  { id: 1, lat: 80, lon: 10 },    // Arktika
  { id: 2, lat: -4, lon: -62 },   // Amazonka
  { id: 3, lat: 19.5, lon: -155.6 }, // Mauna Loa
  { id: 4, lat: 3.2, lon: 73.5 }, // Maldiv orollari
  { id: 5, lat: 24, lon: 12 },    // Sahara
  { id: 6, lat: -80, lon: 40 },   // Antarktida
  { id: 7, lat: 45, lon: 60 },    // Orol dengizi
]

const utcClock = () => {
  const d = new Date()
  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

export default function HeroGlobe({ heat, pulse, playing }) {
  const { t } = usePrefs()
  const [live, setLive] = useState(false)
  const [spot, setSpot] = useState(null)
  const [clock, setClock] = useState(utcClock)
  const [globeRef, , visible] = useNearScreen()

  useEffect(() => {
    if (!live) return
    const id = setInterval(() => setClock(utcClock()), 15000)
    return () => clearInterval(id)
  }, [live])

  const pick = (id) => { setLive(false); setSpot((s) => (s === id ? null : id)) }
  const toggleLive = () => { setSpot(null); setClock(utcClock()); setLive((l) => !l) }

  return (
    <div className="globe-wrap">
      <div className="globe" ref={globeRef} aria-label={t('globeLabel')}>
        <ErrorBoundary fallback={<div className="globe-fallback" aria-hidden="true" />}>
          <Earth3D heat={heat} pulse={pulse} playing={playing} live={live} spots={SPOTS} focusId={spot} onSpot={pick} active={visible} />
        </ErrorBoundary>
      </div>

      <div className="globe-tools">
        <button className="btn ghost sm" onClick={toggleLive} aria-pressed={live}>
          {live ? <LuRotateCw aria-hidden="true" /> : <LuSunMoon aria-hidden="true" />} {live ? t('globeFree') : t('globeLive')}
        </button>
        {live && <span className="muted small" role="status">{t('liveTime', { t: clock })} · {t('liveNote')}</span>}
      </div>

      <div className="spot-list" role="group" aria-label={t('spotsLabel')}>
        {SPOTS.map((s) => (
          <button key={s.id} className={`spot-chip ${spot === s.id ? 'on' : ''}`} aria-pressed={spot === s.id} onClick={() => pick(s.id)}>
            <LuMapPin aria-hidden="true" /> {t(`sp${s.id}_name`)}
          </button>
        ))}
      </div>

      {spot ? (
        <div className="card spot-card" role="status">
          <button className="icon-btn close" onClick={() => setSpot(null)} aria-label={t('spotClose')}><LuX aria-hidden="true" /></button>
          <h3>{t(`sp${spot}_name`)}</h3>
          <p className="muted">{t(`sp${spot}_text`)}</p>
        </div>
      ) : (
        <p className="muted small hint">{t('spotsHint')}</p>
      )}
    </div>
  )
}
