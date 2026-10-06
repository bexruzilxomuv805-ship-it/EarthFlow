import { useEffect, useRef } from 'react'
import { LuArrowDown } from 'react-icons/lu'
import { usePrefs } from '../prefs'

const base = import.meta.env.BASE_URL
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const SLIDE0 = 0.38, SLIDE_LEN = 0.19

const fmt = (v, d, signed) => `${signed && v > 0 ? '+' : ''}${v.toFixed(d)}`

// Skroll-kirish: Yer ustida katta yozuv, keyin uchta haqiqiy raqam birin-ketin chiqadi.
export default function Intro({ datasets, onSkip }) {
  const { t } = usePrefs()
  const root = useRef(null)
  const nums = useRef([])

  useEffect(() => {
    const el = root.current
    let raf = 0
    const update = () => {
      raf = 0
      const r = el.getBoundingClientRect()
      const p = clamp(-r.top / Math.max(1, r.height - window.innerHeight))
      el.style.setProperty('--p', p.toFixed(4))
      datasets.forEach((ds, i) => {
        const node = nums.current[i]
        if (!node) return
        const { data } = ds.json
        const change = data[data.length - 1].value - data[0].value
        const q = clamp((p - (SLIDE0 + i * SLIDE_LEN)) / (SLIDE_LEN * 0.55))
        node.textContent = fmt(change * (1 - Math.pow(1 - q, 3)), ds.decimals, true)
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(raf) }
  }, [datasets])

  return (
    <section className="intro" ref={root} aria-label={t('introLine')}>
      <div className="intro-stage">
        <div className="intro-globe" aria-hidden="true" style={{ '--tex': `url(${base}textures/earth-blue-marble.jpg)` }} />

        <div className="intro-scene intro-title">
          <h1 className="intro-word">{t('introWord')}</h1>
          <p className="intro-sub">{t('introSub')}</p>
          <span className="intro-cue" aria-hidden="true">{t('introScroll')} <LuArrowDown /></span>
        </div>

        <div className="intro-scene intro-line">
          <h2>{t('introLine')}</h2>
          <p>{t('introLine2')}</p>
        </div>

        {datasets.map((ds, i) => {
          const { data, unit } = ds.json
          return (
            <div className="intro-scene intro-slide" key={ds.id} style={{ '--s': SLIDE0 + i * SLIDE_LEN, '--last': i === datasets.length - 1 ? 1 : 0 }}>
              <span className="pixel tag">{t(`ds_${ds.id}_label`)}</span>
              <div className="intro-num"><span ref={(n) => { nums.current[i] = n }}>{fmt(0, ds.decimals, true)}</span> <small>{unit}</small></div>
              <p>{t(`introC_${ds.id}`, { from: data[0].year })}</p>
            </div>
          )
        })}

        <button className="btn ghost sm intro-skip" onClick={onSkip}>{t('introSkip')}</button>
      </div>
    </section>
  )
}
