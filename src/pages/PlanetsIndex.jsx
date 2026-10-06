import { Suspense, lazy } from 'react'
import { usePrefs } from '../prefs'
import { Link } from '../router'
import { PLANETS, PLANET_IDS } from '../data/planets'
import SectionHead from '../components/SectionHead'
import Shell from './Shell'
import { usePlanetFormat } from './PlanetPage'

const Planets = lazy(() => import('../components/Planets'))

// Orb o'lchami diametrning logarifmiga qarab (Merkuriy kichik, Yupiter katta)
const orbSize = (d) => 46 + 56 * (Math.log(d / 4880) / Math.log(139822 / 4880))

export default function PlanetsIndex() {
  const { lang } = usePrefs()
  const { t, n } = usePlanetFormat()
  return (
    <Shell>
      <section className="section" id="sayyoralar-royxat" aria-labelledby="pli-title">
        <SectionHead id="pli-title" tag={t('plTag')} title={t('plIndexTitle')} lead={t('plIndexLead')} />
        <div className="grid pli-grid">
          {PLANET_IDS.map((id, i) => {
            const pl = PLANETS[id]
            const sz = orbSize(pl.stats.diameter)
            return (
              <Link key={id} to={`/sayyoralar/${id}`} className="card pli-card" style={{ '--c': pl.color }}>
                <span className="pli-num muted small">{String(i + 1).padStart(2, '0')}</span>
                <span className={`pli-orb ${id === 'saturn' ? 'ring' : ''}`} style={{ width: sz, height: sz }} aria-hidden="true" />
                <h3>{pl.name[lang]}</h3>
                <p className="muted">{pl.tag[lang]}</p>
                <span className="muted small">{t('plsDiameter')}: {n(pl.stats.diameter)} {t('uKm')}</span>
                <span className="pli-go">{t('plOpen')} →</span>
              </Link>
            )
          })}
        </div>
      </section>
      <Suspense fallback={<div className="skel" style={{ minHeight: 560 }} aria-hidden="true" />}>
        <Planets />
      </Suspense>
    </Shell>
  )
}
