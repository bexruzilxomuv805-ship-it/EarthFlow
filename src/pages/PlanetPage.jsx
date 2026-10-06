import { useState } from 'react'
import { LuArrowLeft, LuArrowRight, LuBox, LuImage } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import { Link } from '../router'
import { PLANETS, PLANET_IDS } from '../data/planets'
import PlanetModel from '../components/PlanetModel'
import PlanetGallery from '../components/PlanetGallery'
import Shell from './Shell'

const HEADS = ['plHOverview', 'plHSurface', 'plHAtmo', 'plHOrbit', 'plHMoons', 'plHExplore']

export function usePlanetFormat() {
  const { t, lang } = usePrefs()
  const loc = lang === 'en' ? 'en-US' : 'ru-RU'
  const n = (v, d = 2) => new Intl.NumberFormat(loc, { maximumFractionDigits: d }).format(v).replace('-', '−').replace(/ | /g, ' ')
  return { t, lang, n }
}

function Stats({ id }) {
  const { t, n } = usePlanetFormat()
  const s = PLANETS[id].stats
  const temp = !s.temp ? '—'
    : s.temp.mean != null ? `+${n(s.temp.mean)} °C`
    : s.temp.max == null ? `${t('plLowest')} ${n(s.temp.min)} °C`
    : `${n(s.temp.min)} … +${n(s.temp.max)} °C`
  const dist = s.distance >= 1000 ? `${n(s.distance / 1000, 1)} ${t('uBkm')}` : `${n(s.distance)} ${t('uMkm')}`
  const rows = [
    ['plsDiameter', `${n(s.diameter)} ${t('uKm')}`],
    ['plsDistance', `${dist} (${n(s.au)} ${t('uAu')})`],
    ['plsYear', `${n(s.year)} ${t('uDays')}${s.year > 1000 ? ` (≈ ${n(s.year / 365.25, s.year / 365.25 < 20 ? 0 : 1)} ${t('uYears')})` : ''}`],
    ['plsDay', `${n(s.day.v)} ${t(s.day.u === 'h' ? 'uHours' : 'uDays')}`],
    s.solar ? [id === 'venus' ? 'plsSunset' : 'plsSolar', `${n(s.solar)} ${t('uDays')}`] : null,
    ['plsTilt', `${n(s.tilt)}°`],
    ['plsMoons', n(s.moons, 0)],
    ['plsRings', s.rings ? t('plYes') : t('plNo')],
    ['plsTemp', temp],
  ].filter(Boolean)
  return (
    <dl className="pl-stats">
      {rows.map(([k, v]) => (
        <div className="card pl-stat" key={k}><dt className="muted small">{t(k)}</dt><dd>{v}</dd></div>
      ))}
    </dl>
  )
}

export default function PlanetPage({ id }) {
  const { t, lang } = usePrefs()
  const [tab, setTab] = useState('3d')
  const pl = PLANETS[id]
  const name = pl.name[lang]
  const i = PLANET_IDS.indexOf(id)
  const prev = PLANET_IDS[(i + PLANET_IDS.length - 1) % PLANET_IDS.length]
  const next = PLANET_IDS[(i + 1) % PLANET_IDS.length]

  return (
    <Shell>
      <header className="page-head">
        <Link className="link back" to="/sayyoralar"><LuArrowLeft aria-hidden="true" /> {t('plAll')}</Link>
        <h1>{name}</h1>
        <p className="lead">{pl.tag[lang]}</p>
      </header>

      <div className="tabs" role="tablist" aria-label={name}>
        <button role="tab" aria-selected={tab === '3d'} className={`tab ${tab === '3d' ? 'on' : ''}`} onClick={() => setTab('3d')}><LuBox aria-hidden="true" /> {t('plTab3d')}</button>
        <button role="tab" aria-selected={tab === 'photo'} className={`tab ${tab === 'photo' ? 'on' : ''}`} onClick={() => setTab('photo')}><LuImage aria-hidden="true" /> {t('plTabPhoto')}</button>
      </div>

      {tab === '3d' ? (
        <>
          <PlanetModel key={id} id={id} label={`${name}: ${t('plTab3d')}`} />
          <p className="muted small pm-hint">{t('plDragHint')}</p>
        </>
      ) : (
        <PlanetGallery key={id} id={id} name={name} color={pl.color} />
      )}

      <section className="section" aria-labelledby="pl-stats-title">
        <h2 id="pl-stats-title">{t('plStatsTitle')}</h2>
        <Stats id={id} />
      </section>

      <section className="section pl-text" aria-labelledby="pl-about-title">
        <h2 id="pl-about-title">{t('plAbout', { name })}</h2>
        {pl.p[lang].map((text, k) => (
          <article key={k} className="card pl-para">
            <h3>{t(HEADS[k])}</h3>
            <p className="muted">{text}</p>
          </article>
        ))}
      </section>

      <section className="section" aria-labelledby="pl-facts-title">
        <h2 id="pl-facts-title">{t('plFacts')}</h2>
        <ul className="pl-facts">
          {pl.facts[lang].map((f, k) => <li className="card" key={k}>{f}</li>)}
        </ul>
        <p className="muted small">{t('plSource')}</p>
      </section>

      <nav className="pl-nav" aria-label={t('plAll')}>
        <Link className="btn ghost" to={`/sayyoralar/${prev}`}><LuArrowLeft aria-hidden="true" /> {PLANETS[prev].name[lang]}</Link>
        <Link className="btn ghost" to="/sayyoralar">{t('plAll')}</Link>
        <Link className="btn ghost" to={`/sayyoralar/${next}`}>{PLANETS[next].name[lang]} <LuArrowRight aria-hidden="true" /></Link>
      </nav>
    </Shell>
  )
}
