import { useEffect, useMemo, useRef, useState } from 'react'
import { LuSearch, LuX } from 'react-icons/lu'
import { DATASETS } from '../data/datasets'
import { usePrefs } from '../prefs'
import { go } from '../router'
import { PLANETS, PLANET_IDS } from '../data/planets'

const SECTIONS = [
  ['/jukebox', 'navJukebox'], ['/taqqoslash', 'navCompare'], ['/dengiz', 'navSea'], ['/ob-havo', 'navWeather'], ['/viktorina', 'navQuiz'],
  ['/sayyoralar', 'navPlanets'], ['/qanday-ishlaydi', 'navHow'], ['/science', 'navScience'], ['/about', 'navAbout'],
  ['/#gologramma', 'navHolo'], ['/#ichki', 'navInterior'], ['/#faktlar', 'navFacts'], ['/#rasmlar', 'navPhotos'],
]

export function SearchButton({ onOpen }) {
  const { t } = usePrefs()
  return (
    <button className="icon-btn" onClick={onOpen} aria-label={t('searchBtn')} title={`${t('searchBtn')} (Ctrl+K)`}>
      <LuSearch aria-hidden="true" />
    </button>
  )
}

export default function Search({ open, onClose }) {
  const { t, lang } = usePrefs()
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const input = useRef(null)

  const items = useMemo(() => {
    const list = []
    for (const [href, key] of SECTIONS) list.push({ group: 'searchSections', label: t(key), hint: '', to: href })
    for (const id of PLANET_IDS) list.push({ group: 'searchPlanets', label: PLANETS[id].name[lang], hint: PLANETS[id].tag[lang], to: `/sayyoralar/${id}` })
    for (const ds of DATASETS) list.push({ group: 'searchData', label: t(`ds_${ds.id}_label`), hint: t(`ds_${ds.id}_desc`), to: '/jukebox' })
    for (let i = 1; i <= 6; i++) list.push({ group: 'searchFacts', label: `${t(`f${i}_v`)} ${t(`f${i}_u`)}`, hint: t(`f${i}_t`), to: '/#faktlar' })
    for (let i = 1; i <= 8; i++) list.push({ group: 'searchPlaces', label: t(`sp${i}_name`), hint: t(`sp${i}_text`), to: '/#hero' })
    return list
  }, [t, lang])

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase()
    const r = s ? items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(s)) : items.filter((i) => i.group === 'searchSections')
    return r.slice(0, 12)
  }, [items, q])

  useEffect(() => { if (open) { setQ(''); setSel(0); setTimeout(() => input.current?.focus(), 30) } }, [open])
  useEffect(() => { setSel(0) }, [q])

  if (!open) return null
  const choose = (it) => { onClose(); go(it.to) }
  const onKey = (e) => {
    if (e.key === 'Escape') onClose()
    else if (e.key === 'ArrowDown') { e.preventDefault(); setSel((s) => Math.min(shown.length - 1, s + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setSel((s) => Math.max(0, s - 1)) }
    else if (e.key === 'Enter' && shown[sel]) choose(shown[sel])
  }

  return (
    <div className="search-back" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div className="search glass" role="dialog" aria-modal="true" aria-label={t('searchBtn')} onKeyDown={onKey}>
        <div className="search-top">
          <LuSearch aria-hidden="true" />
          <input ref={input} value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('searchPh')} aria-label={t('searchPh')} />
          <button className="icon-btn" onClick={onClose} aria-label={t('searchClose')}><LuX aria-hidden="true" /></button>
        </div>
        <ul className="search-list">
          {shown.length === 0 && <li className="muted search-empty">{t('searchEmpty')}</li>}
          {shown.map((it, i) => (
            <li key={`${it.group}-${i}`}>
              <button className={i === sel ? 'on' : ''} onMouseEnter={() => setSel(i)} onClick={() => choose(it)}>
                <span className="muted small">{t(it.group)}</span>
                <strong>{it.label}</strong>
                {it.hint && <span className="muted small search-hint">{it.hint}</span>}
              </button>
            </li>
          ))}
        </ul>
        <p className="muted small search-foot">{t('searchHint')}</p>
      </div>
    </div>
  )
}
