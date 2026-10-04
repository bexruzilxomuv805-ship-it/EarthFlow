import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import PlanetOrb from './PlanetOrb'
import ErrorBoundary from './ErrorBoundary'
import { useNearScreen } from '../hooks/useNearScreen'

// Diametr (km): sharning o'lchami haqiqiy nisbatda bo'ladi
const PLANETS = [
  { n: 1, d: 12742, cls: 'earth' },
  { n: 2, d: 12104, cls: 'venus' },
  { n: 3, d: 6779, cls: 'mars' },
]
const ROWS = ['diam', 'temp', 'day', 'year', 'grav', 'atm', 'moons']
const MAX_D = 12742

function Planet({ n, d, cls }) {
  const { t } = usePrefs()
  const [ref, near, visible] = useNearScreen()
  const ratio = d / MAX_D
  // 3D yuklanguncha (yoki xato bo'lsa) oddiy rangli doira ko'rinadi
  const flat = <span className={`orb ${cls}`} style={{ width: `calc(var(--orb) * ${ratio.toFixed(3)})` }} aria-hidden="true" />
  return (
    <article className="card planet">
      <div className="planet-art" ref={ref} aria-hidden="true">
        {near ? <ErrorBoundary fallback={flat}><PlanetOrb kind={cls} scale={ratio} active={visible} /></ErrorBoundary> : flat}
      </div>
      <h3>{t(`pl${n}_name`)}</h3>
      <p className="muted">{t(`pl${n}_text`)}</p>
      <dl>
        {ROWS.map((r) => (
          <div key={r}>
            <dt>{t(`pl${r[0].toUpperCase() + r.slice(1)}`)}</dt>
            <dd>{t(`pl${n}_${r}`)}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

export default function Planets() {
  const { t } = usePrefs()
  return (
    <section className="section" id="sayyoralar" aria-labelledby="pl-title">
      <SectionHead id="pl-title" tag={t('plTag')} title={t('plTitle')} lead={t('plLead')} />
      <div className="grid planets">
        {PLANETS.map((p) => <Planet key={p.n} {...p} />)}
      </div>
    </section>
  )
}
