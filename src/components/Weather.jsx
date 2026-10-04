import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { LuSun, LuMoon, LuCloudSun, LuCloud, LuCloudFog, LuCloudRain, LuCloudSnow, LuCloudLightning, LuDroplets, LuWind, LuRefreshCw, LuArrowDownUp } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import { useNearScreen } from '../hooks/useNearScreen'

// O'zbekistonning 12 viloyati + Qoraqalpog'iston Respublikasi + Toshkent shahri (viloyat markazlari)
// Nomlar i18n da: rg<id>
const REGIONS = [
  { id: 1, lat: 41.2995, lon: 69.2401 },  // Toshkent shahri
  { id: 2, lat: 41.0167, lon: 69.3667 },  // Toshkent viloyati (Nurafshon)
  { id: 3, lat: 40.7821, lon: 72.3442 },  // Andijon
  { id: 4, lat: 39.7747, lon: 64.4286 },  // Buxoro
  { id: 5, lat: 40.3864, lon: 71.7864 },  // Farg'ona
  { id: 6, lat: 40.1158, lon: 67.8422 },  // Jizzax
  { id: 7, lat: 41.55, lon: 60.6333 },    // Xorazm (Urganch)
  { id: 8, lat: 40.9983, lon: 71.6726 },  // Namangan
  { id: 9, lat: 40.0844, lon: 65.3792 },  // Navoiy
  { id: 10, lat: 38.8606, lon: 65.7891 }, // Qashqadaryo (Qarshi)
  { id: 11, lat: 42.4531, lon: 59.6103 }, // Qoraqalpog'iston (Nukus)
  { id: 12, lat: 39.6542, lon: 66.9597 }, // Samarqand
  { id: 13, lat: 40.4897, lon: 68.7842 }, // Sirdaryo (Guliston)
  { id: 14, lat: 37.2242, lon: 67.2783 }, // Surxondaryo (Termiz)
]

const CACHE_KEY = 'wx-uz-cache'
const CACHE_MS = 15 * 60 * 1000

// WMO ob-havo kodi -> toifa va ikonka
const kindOf = (c) => (c === 0 ? 'clear' : c <= 2 ? 'partly' : c === 3 ? 'cloudy' : c <= 48 ? 'fog' : c <= 67 ? 'rain' : c <= 77 ? 'snow' : c <= 82 ? 'rain' : c <= 86 ? 'snow' : 'storm')
const ICONS = { clear: LuSun, partly: LuCloudSun, cloudy: LuCloud, fog: LuCloudFog, rain: LuCloudRain, snow: LuCloudSnow, storm: LuCloudLightning }

const readCache = () => { try { const c = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null'); return c && Date.now() - c.t < CACHE_MS ? c : null } catch { return null } }
const writeCache = (c) => { try { localStorage.setItem(CACHE_KEY, JSON.stringify(c)) } catch { /* ok */ } }

const round = (v) => Math.round(v)
const sign = (v) => (round(v) > 0 ? `+${round(v)}` : `${round(v)}`.replace('-', '−'))
// Haroratga qarab rang: sovuq (ko'k) -> betaraf -> iliq (to'q sariq) -> issiq (qizil). Yashil ishlatilmaydi.
const STOPS = [[-5, [59, 130, 246]], [12, [96, 165, 250]], [20, [148, 163, 184]], [28, [251, 146, 60]], [40, [239, 68, 68]]]
const rgb = (c) => `rgb(${c.join(',')})`
const tint = (v) => {
  if (v <= STOPS[0][0]) return rgb(STOPS[0][1])
  for (let i = 1; i < STOPS.length; i++) {
    const [t1, c1] = STOPS[i], [t0, c0] = STOPS[i - 1]
    if (v <= t1) { const k = (v - t0) / (t1 - t0); return rgb(c0.map((c, j) => Math.round(c + (c1[j] - c) * k))) }
  }
  return rgb(STOPS.at(-1)[1])
}

export default function Weather() {
  const { t } = usePrefs()
  const [ref, near] = useNearScreen()
  const [state, setState] = useState(() => readCache() || { data: null, t: 0 })
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sort, setSort] = useState('name')
  const abort = useRef(null)

  const load = useCallback(async (force) => {
    const cached = readCache()
    if (!force && cached) { setState(cached); return }
    abort.current?.abort()
    const ctl = new AbortController()
    abort.current = ctl
    const timeout = setTimeout(() => ctl.abort(), 15000)
    setLoading(true); setError(false)
    try {
      const q = new URLSearchParams({
        latitude: REGIONS.map((r) => r.lat).join(','),
        longitude: REGIONS.map((r) => r.lon).join(','),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
        daily: 'temperature_2m_max,temperature_2m_min',
        timezone: 'Asia/Tashkent',
        forecast_days: '1',
      })
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?${q}`, { signal: ctl.signal })
      if (!res.ok) throw new Error(res.status)
      const json = await res.json()
      const list = Array.isArray(json) ? json : [json]
      const data = REGIONS.map((r, i) => {
        const w = list[i]
        return {
          id: r.id,
          temp: w.current.temperature_2m, feels: w.current.apparent_temperature,
          hum: w.current.relative_humidity_2m, wind: w.current.wind_speed_10m,
          code: w.current.weather_code, day: w.current.is_day === 1,
          max: w.daily.temperature_2m_max[0], min: w.daily.temperature_2m_min[0],
        }
      })
      const next = { data, t: Date.now() }
      writeCache(next)
      setState(next)
    } catch {
      setError(true)
    } finally {
      clearTimeout(timeout)
      setLoading(false)
    }
  }, [])

  useEffect(() => { if (near) load(false) }, [near, load])
  useEffect(() => () => abort.current?.abort(), [])

  const { data } = state
  const shown = useMemo(() => {
    if (!data) return []
    return sort === 'temp' ? [...data].sort((a, b) => b.temp - a.temp) : data
  }, [data, sort])
  const stats = useMemo(() => {
    if (!data) return null
    const hot = data.reduce((a, b) => (b.temp > a.temp ? b : a))
    const cold = data.reduce((a, b) => (b.temp < a.temp ? b : a))
    const avg = data.reduce((s, d) => s + d.temp, 0) / data.length
    return { hot, cold, avg }
  }, [data])
  const updated = state.t ? new Date(state.t).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''

  return (
    <section className="section" id="obhavo" aria-labelledby="wx-title" ref={ref}>
      <SectionHead id="wx-title" tag={t('wxTag')} title={t('wxTitle')} lead={t('wxLead')} />

      {!data && !error && <p className="muted">{t('wxLoading')}</p>}
      {error && !data && (
        <p className="muted">{t('wxError')} <button className="link" onClick={() => load(true)}>{t('wxRetry')}</button></p>
      )}

      {data && (
        <>
          <div className="wx-summary">
            <div className="stat"><div className="muted small">{t('wxHot')}</div><div className="num" style={{ color: tint(stats.hot.temp) }}>{sign(stats.hot.temp)} °C</div><div className="small muted">{t(`rg${stats.hot.id}`)}</div></div>
            <div className="stat"><div className="muted small">{t('wxCold')}</div><div className="num" style={{ color: tint(stats.cold.temp) }}>{sign(stats.cold.temp)} °C</div><div className="small muted">{t(`rg${stats.cold.id}`)}</div></div>
            <div className="stat"><div className="muted small">{t('wxAvg')}</div><div className="num">{sign(stats.avg)} °C</div><div className="small muted">{t('wxToday')}</div></div>
          </div>

          <div className="wx-bar">
            <span className="small muted">{t('wxUpdated', { t: updated })}</span>
            <div className="wx-actions">
              <button className="btn ghost sm" onClick={() => setSort((s) => (s === 'name' ? 'temp' : 'name'))}>
                <LuArrowDownUp aria-hidden="true" /> {sort === 'name' ? t('wxSortTemp') : t('wxSortName')}
              </button>
              <button className="btn ghost sm" onClick={() => load(true)} disabled={loading}>
                <LuRefreshCw aria-hidden="true" className={loading ? 'spin' : ''} /> {t('wxRefresh')}
              </button>
            </div>
          </div>
          {error && <p className="muted small">{t('wxError')}</p>}

          <div className="grid wx-grid">
            {shown.map((d) => {
              const kind = kindOf(d.code)
              const Icon = kind === 'clear' && !d.day ? LuMoon : ICONS[kind]
              return (
                <article className="card wx-card" key={d.id} style={{ '--tint': tint(d.temp) }}>
                  <h3>{t(`rg${d.id}`)}</h3>
                  <div className="wx-main">
                    <Icon aria-hidden="true" />
                    <span className="wx-temp">{sign(d.temp)}<small>°C</small></span>
                  </div>
                  <div className="small muted">{t(`w_${kind}`)} · {t('wxToday')} {sign(d.min)}…{sign(d.max)}°</div>
                  <dl className="wx-meta">
                    <div><dt><LuDroplets aria-hidden="true" /> {t('wxHum')}</dt><dd>{round(d.hum)}%</dd></div>
                    <div><dt><LuWind aria-hidden="true" /> {t('wxWind')}</dt><dd>{round(d.wind)} {t('wxKmh')}</dd></div>
                    <div><dt>{t('wxFeels')}</dt><dd>{sign(d.feels)}°</dd></div>
                  </dl>
                </article>
              )
            })}
          </div>
          <p className="muted small wx-note">{t('wxNote')} · {t('wxCredit')}</p>
        </>
      )}
    </section>
  )
}
