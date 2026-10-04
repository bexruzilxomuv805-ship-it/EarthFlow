import { LuClock, LuFlame, LuWaves, LuRuler, LuRocket, LuRotateCw } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

const ICONS = [LuClock, LuFlame, LuWaves, LuRuler, LuRocket, LuRotateCw]

export default function Facts() {
  const { t } = usePrefs()
  return (
    <section className="section" id="faktlar" aria-labelledby="facts-title">
      <SectionHead id="facts-title" tag={t('factsTag')} title={t('factsTitle')} lead={t('factsLead')} />
      <div className="grid facts">
        {ICONS.map((Icon, i) => (
          <div className="card fact" key={i}>
            <div className="step"><Icon aria-hidden="true" /></div>
            <div className="fact-num"><span>{t(`f${i + 1}_v`)}</span> <small>{t(`f${i + 1}_u`)}</small></div>
            <p className="muted">{t(`f${i + 1}_t`)}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
