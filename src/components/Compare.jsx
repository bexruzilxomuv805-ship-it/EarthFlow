import { useState } from 'react'
import { LuArrowLeftRight } from 'react-icons/lu'
import { DATASETS } from '../data/datasets'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'

const fmt = (v, d, signed) => `${signed && v > 0 ? '+' : ''}${v.toFixed(d)}`
const range = (ds) => { const a = ds.json.data; return [a[0].year, a[a.length - 1].year] }
const pick = (side) => {
  const ds = DATASETS.find((d) => d.id === side.ds)
  const { data } = ds.json
  const [y0, y1] = range(ds)
  const year = Math.min(y1, Math.max(y0, side.year))
  return { ds, data, y0, y1, year, cur: data.find((p) => p.year === year) ?? data[data.length - 1] }
}

function Side({ n, side, onChange }) {
  const { t } = usePrefs()
  const { ds, data, y0, y1, year, cur } = pick(side)
  const unit = ds.json.unit
  const vals = data.map((p) => p.value)
  const min = Math.min(...vals), max = Math.max(...vals)
  const pos = ((cur.value - min) / (max - min || 1)) * 100
  const idA = `cmp-ds-${n}`, idY = `cmp-y-${n}`
  return (
    <div className="card cmp-side">
      <span className="pixel tag">{t('cmpSide', { n })}</span>
      <label className="cmp-field" htmlFor={idA}><span className="muted small">{t('cmpDataset')}</span>
        <select id={idA} value={side.ds} onChange={(e) => onChange({ ds: e.target.value, year: side.year })}>
          {DATASETS.map((d) => <option key={d.id} value={d.id}>{t(`ds_${d.id}_label`)}</option>)}
        </select>
      </label>
      <label className="cmp-field" htmlFor={idY}><span className="muted small">{t('cmpYear')}: <strong>{cur.year}</strong></span>
        <input id={idY} type="range" min={y0} max={y1} value={year} onChange={(e) => onChange({ ds: side.ds, year: Number(e.target.value) })} />
      </label>
      <div className="muted small">{t('cmpValue')}</div>
      <div className="big accent">{fmt(cur.value, ds.decimals, ds.signed)} <span className="unit">{unit}</span></div>
      <div className="muted small">{t('cmpSince', { y: y0 })}</div>
      <div className="num">{fmt(cur.value - data[0].value, ds.decimals, true)} {unit}</div>
      <div className="muted small">{t('cmpPos')}</div>
      <div className="cmp-bar" role="img" aria-label={`${pos.toFixed(0)}%`}><span style={{ width: `${pos}%` }} /></div>
      <div className="muted small">{pos.toFixed(0)}% · {t('cmpPosHint')}</div>
    </div>
  )
}

export default function Compare() {
  const { t } = usePrefs()
  const [a, setA] = useState({ ds: 'temperature', year: 1950 })
  const [b, setB] = useState({ ds: 'temperature', year: 2025 })
  const A = pick(a), B = pick(b)
  const same = a.ds === b.ds
  const diff = B.cur.value - A.cur.value

  return (
    <section className="section" id="taqqos" aria-labelledby="cmp-title">
      <SectionHead id="cmp-title" tag={t('cmpTag')} title={t('cmpTitle')} lead={t('cmpLead')} />
      <div className="cmp">
        <Side n={1} side={a} onChange={setA} />
        <button className="icon-btn cmp-swap" onClick={() => { setA(b); setB(a) }} aria-label={t('cmpSwap')} title={t('cmpSwap')}><LuArrowLeftRight aria-hidden="true" /></button>
        <Side n={2} side={b} onChange={setB} />
      </div>
      <p className="cmp-diff card" role="status">
        {same
          ? <><span className="muted">{t('cmpDiff')}: </span><strong className="accent">{fmt(diff, A.ds.decimals, true)} {A.ds.json.unit}</strong></>
          : <span className="muted">{t('cmpUnits')}</span>}
      </p>
    </section>
  )
}
