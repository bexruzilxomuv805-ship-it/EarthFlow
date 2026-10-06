import { LuMusic } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from '../components/SectionHead'
import Sources from '../components/Sources'
import { Link } from '../router'

export default function Science() {
  const { t } = usePrefs()
  return (
    <main id="top" className="page">
      <div className="wrap">
        <header className="page-head">
          <h1>{t('sciTitle')}</h1>
          <p className="lead">{t('sciLead')}</p>
        </header>

        <Sources id="manbalar" />

        <section className="section" id="usul" aria-labelledby="method-title">
          <SectionHead id="method-title" tag={t('methodTag')} title={t('methodTitle')} />
          <div className="card method"><div className="step"><LuMusic aria-hidden="true" /></div><p className="muted">{t('methodText')}</p></div>
        </section>

        <section className="section" aria-labelledby="honest-title">
          <div className="card">
            <h2 id="honest-title">{t('sciHonest')}</h2>
            <p className="muted">{t('sciHonestText')}</p>
          </div>
        </section>

        <p><Link className="link" to="/">← {t('aboutBack')}</Link></p>
      </div>
    </main>
  )
}
