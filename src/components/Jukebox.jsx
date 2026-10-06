import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { LuPlay, LuPause, LuShare2, LuCheck, LuSend } from 'react-icons/lu'
const Chart = lazy(() => import('./Chart'))
import SectionHead from './SectionHead'
import CopyBox from './CopyBox'
import { usePrefs } from '../prefs'

const fmt = (v, d, signed) => `${signed && v > 0 ? '+' : ''}${v.toFixed(d)}`

export default function Jukebox({ datasets, active, onSelect, data, unit, source, ds, index, playing, onPlay, onStop, onSeek, speed, onSpeed }) {
  const { t, lang } = usePrefs()
  const [copied, setCopied] = useState(false)
  const [manual, setManual] = useState('')
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])

  const cur = data[index]
  const first = data[0]
  const last = data[data.length - 1]
  const peak = data.reduce((a, b) => (b.value > a.value ? b : a))
  const title = t(`ds_${ds.id}_title`)

  const shareUrl = () => {
    const u = new URL(window.location.href)
    u.search = new URLSearchParams({ d: ds.id, y: String(cur.year), lang }).toString()
    u.hash = 'jukebox'
    return u.toString()
  }
  const text = t('shareText', { title, y: cur.year })

  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url) } catch { setManual(url); return }
    setManual('')
    setCopied(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setCopied(false), 2200)
  }
  const onShare = async () => {
    const url = shareUrl()
    if (navigator.share) {
      try { await navigator.share({ title: t('brand'), text, url }); return } catch (e) { if (e?.name === 'AbortError') return }
    }
    copy(url)
  }
  const onTelegram = () => {
    const href = `https://t.me/share/url?url=${encodeURIComponent(shareUrl())}&text=${encodeURIComponent(text)}`
    window.open(href, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="jukebox glass" id="jukebox" aria-labelledby="jb-title">
      <SectionHead id="jb-title" tag={t('jbTag')} title={title} lead={t(`ds_${ds.id}_desc`)} />

      <div className="tabs" role="tablist" aria-label={t('dsTabs')}>
        {datasets.map(({ id, Icon }) => (
          <button key={id} role="tab" aria-selected={id === active} className={`tab ${id === active ? 'on' : ''}`} onClick={() => onSelect(id)}>
            <Icon aria-hidden="true" /> {t(`ds_${id}_label`)}
          </button>
        ))}
      </div>

      <div className="readout" aria-live="off">
        <div><div className="muted small">{t('year')}</div><div className="big">{cur.year}</div></div>
        <div><div className="muted small">{t('value')}</div><div className="big accent">{fmt(cur.value, ds.decimals, ds.signed)} <span className="unit">{unit}</span></div></div>
      </div>

      <Suspense fallback={<div className="chart chart-skeleton" aria-hidden="true" />}>
        <Chart data={data} index={index} unit={unit} label={t('chartLabel', { title, from: first.year, to: last.year })} />
      </Suspense>

      <div className="controls">
        <button className="play" onClick={playing ? onStop : onPlay} aria-label={playing ? t('stop') : t('play')}>
          {playing ? <LuPause aria-hidden="true" /> : <LuPlay aria-hidden="true" />}
        </button>
        <label className="scrub">
          <span className="sr">{t('pickYear')}</span>
          <input type="range" min={0} max={data.length - 1} value={index} onChange={(e) => onSeek(Number(e.target.value))} />
          <span className="scrub-ends"><span>{first.year}</span><span>{last.year}</span></span>
        </label>
        <label className="speed">
          <span className="muted small">{t('speed')}</span>
          <input type="range" min={40} max={400} step={10} value={440 - speed} onChange={(e) => onSpeed(440 - Number(e.target.value))} />
        </label>
      </div>

      <div className="stats">
        <div className="stat"><div className="muted small">{t('inYear', { y: first.year })}</div><div className="num">{fmt(first.value, ds.decimals, ds.signed)} {unit}</div></div>
        <div className="stat"><div className="muted small">{t('peak', { y: peak.year })}</div><div className="num">{fmt(peak.value, ds.decimals, ds.signed)} {unit}</div></div>
        <div className="stat"><div className="muted small">{t('change')}</div><div className="num accent">{fmt(cur.value - first.value, ds.decimals, true)} {unit}</div></div>
      </div>

      <div className="jb-foot">
        <p className="src small muted">{t('source')}: {source}{source.startsWith('SAMPLE') ? ` (${t('sampleNote')})` : ''}</p>
        <div className="share">
          <button className="btn ghost sm" onClick={onShare}>
            {copied ? <LuCheck aria-hidden="true" /> : <LuShare2 aria-hidden="true" />} {copied ? t('shareCopied') : t('share')}
          </button>
          <button className="btn ghost sm" onClick={onTelegram}><LuSend aria-hidden="true" /> {t('shareTelegram')}</button>
        </div>
        {manual && <CopyBox text={manual} onClose={() => setManual('')} />}
      </div>
    </section>
  )
}
