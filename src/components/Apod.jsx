import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

const base = import.meta.env.BASE_URL

const FILES = ['tungi-yer.jpg', 'yer-paydo-boldi.jpg', 'yer-yadrosi.jpg', 'yer-qatlamlari.jpg', 'yer-kesimi.jpg', 'globuslar.png']

export default function Apod() {
  const { t } = usePrefs()
  return (
    <section className="section" id="rasmlar" aria-labelledby="apod-title">
      <SectionHead id="apod-title" tag={t('photosTag')} title={t('photosTitle')} lead={t('photosLead')} />
      <div className="grid apod">
        {FILES.map((file, i) => (
          <div key={file} className="card photo">
            <img src={`${base}EARTH_RASMLAR/${file}`} alt={t(`p${i + 1}_title`)} loading="lazy" />
            <div className="cap"><strong>{t(`p${i + 1}_title`)}</strong><span className="muted small">{t(`p${i + 1}_text`)}</span></div>
          </div>
        ))}
      </div>
    </section>
  )
}
