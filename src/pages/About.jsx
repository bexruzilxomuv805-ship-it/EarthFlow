import { usePrefs } from '../prefs'
import { Link } from '../router'

const BLOCKS = ['What', 'Why', 'Tech', 'Credits', 'Dev']

export default function About() {
  const { t } = usePrefs()
  return (
    <main id="top" className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>{t('aboutTitle')}</h1>
          <p className="lead">{t('aboutLead')}</p>
        </header>
        <div className="grid about-grid">
          {BLOCKS.map((b) => (
            <article className="card" key={b}>
              <h2>{t(`about${b}T`)}</h2>
              <p className="muted">{t(`about${b}X`)}</p>
            </article>
          ))}
        </div>
        <p className="page-links">
          <Link className="btn" to="/science">{t('aboutOpenSci')}</Link>
          <Link className="btn ghost" to="/">{t('aboutBack')}</Link>
        </p>
      </div>
    </main>
  )
}
