import { LuExternalLink } from 'react-icons/lu'
import { DATASETS } from '../data/datasets'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

const URLS = {
  temperature: 'https://data.giss.nasa.gov/gistemp/',
  co2: 'https://gml.noaa.gov/ccgg/trends/',
  sealevel: 'https://www.star.nesdis.noaa.gov/socd/lsa/SeaLevelRise/',
  weather: 'https://open-meteo.com/',
  apod: 'https://apod.nasa.gov/apod/',
}
const IDS = ['temperature', 'co2', 'sealevel', 'weather', 'apod']

export default function Sources({ id = 'manbalar' }) {
  const { t } = usePrefs()
  return (
    <section className="section" id={id} aria-labelledby="src-title">
      <SectionHead id="src-title" tag={t('srcTag')} title={t('srcTitle')} lead={t('srcLead')} />
      <div className="grid src-grid">
        {IDS.map((sid) => {
          const ds = DATASETS.find((d) => d.id === sid)
          const data = ds?.json.data
          const name = ds ? t(`ds_${sid}_label`) : t(`src_${sid}_name`)
          const period = ds ? `${data[0].year}–${data[data.length - 1].year}` : t('srcLive')
          const sample = ds?.json.source.startsWith('SAMPLE')
          return (
            <article className="card src-card" key={sid}>
              <h3>{name}</h3>
              <dl>
                <div><dt>{t('srcOrg')}</dt><dd>{t(`src_${sid}_org`)}</dd></div>
                <div><dt>{t('srcPeriod')}</dt><dd>{period}</dd></div>
                <div><dt>{t('srcHow')}</dt><dd>{t(`src_${sid}_how`)}</dd></div>
                <div><dt>{t('srcLimit')}</dt><dd>{t(`src_${sid}_limit`)}{sample ? ` (${t('sampleNote')})` : ''}</dd></div>
              </dl>
              <a className="link" href={URLS[sid]} target="_blank" rel="noopener noreferrer"><LuExternalLink aria-hidden="true" /> {t('srcOpen')}</a>
            </article>
          )
        })}
      </div>
    </section>
  )
}
