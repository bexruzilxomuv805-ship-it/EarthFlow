import { DATASETS } from '../data/datasets'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import CountUp from './CountUp'

const byId = (id) => DATASETS.find((d) => d.id === id).json

export default function Numbers() {
  const { t } = usePrefs()
  const temp = byId('temperature').data
  const co2 = byId('co2').data
  const sea = byId('sealevel').data
  const hot = temp.reduce((a, b) => (b.value > a.value ? b : a))
  const co2Pct = ((co2[co2.length - 1].value / co2[0].value) - 1) * 100
  const seaRate = (sea[sea.length - 1].value - sea[0].value) / (sea[sea.length - 1].year - sea[0].year)

  const big = [
    { k: 'numC1', u: 'numC1u', v: temp.length, d: 0 },
    { k: 'numC2', u: 'numC2u', v: co2[co2.length - 1].value, d: 1 },
    { k: 'numC3', u: 'numC3u', v: sea[sea.length - 1].value, d: 0, signed: true },
    { k: 'numC4', u: 'numC4u', v: 3, d: 0 },
  ]

  return (
    <section className="section" id="raqamlar" aria-labelledby="num-title">
      <SectionHead id="num-title" tag={t('numTag')} title={t('numTitle')} lead={t('numLead')} />
      <div className="num-grid">
        {big.map((b) => (
          <div className="card num-card" key={b.k}>
            <div className="num-big"><CountUp to={b.v} decimals={b.d} signed={b.signed} /> <small>{t(b.u)}</small></div>
            <p className="muted">{t(b.k)}</p>
          </div>
        ))}
      </div>
      <div className="grid facts">
        <div className="card"><span className="muted small">{t('numH1')}</span><div className="fact-num"><span>{hot.year}</span></div><p className="muted">{t('numH1s', { v: `+${hot.value.toFixed(2)}` })}</p></div>
        <div className="card"><span className="muted small">{t('numH2')}</span><div className="fact-num"><span>+{co2Pct.toFixed(0)}</span><small>%</small></div><p className="muted">{t('numH2s', { from: co2[0].year })}</p></div>
        <div className="card"><span className="muted small">{t('numH3')}</span><div className="fact-num"><span>+{seaRate.toFixed(1)}</span> <small>mm</small></div><p className="muted">{t('numH3s', { from: sea[0].year })}</p></div>
      </div>
    </section>
  )
}
