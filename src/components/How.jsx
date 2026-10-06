import { LuDatabase, LuMusic, LuGlobe } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

const STEP_ICONS = [LuDatabase, LuMusic, LuGlobe]

export default function How() {
  const { t } = usePrefs()
  return (
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
  )
}
