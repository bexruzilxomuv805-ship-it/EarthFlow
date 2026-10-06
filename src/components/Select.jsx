import { useEffect, useRef, useState } from 'react'
import { LuChevronDown, LuCheck } from 'react-icons/lu'

// Brauzerning oddiy <select> o'rniga: sayt dizaynidagi ochiladigan ro'yxat (klaviatura bilan ham ishlaydi)
export default function Select({ id, label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const [hi, setHi] = useState(0)
  const root = useRef(null)
  const cur = options.findIndex((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDown = (e) => { if (!root.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', onDown)
    return () => document.removeEventListener('pointerdown', onDown)
  }, [open])

  const openList = () => { setHi(Math.max(0, cur)); setOpen(true) }
  const pick = (i) => { onChange(options[i].value); setOpen(false); root.current?.querySelector('button')?.focus() }
  const onKey = (e) => {
    if (e.key === 'Escape') { setOpen(false); return }
    if (!open) { if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(e.key)) { e.preventDefault(); openList() } return }
    if (e.key === 'ArrowDown') { e.preventDefault(); setHi((h) => Math.min(options.length - 1, h + 1)) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setHi((h) => Math.max(0, h - 1)) }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(hi) }
    else if (e.key === 'Tab') setOpen(false)
  }

  return (
    <div className={`dd ${open ? 'open' : ''}`} ref={root} onKeyDown={onKey}>
      <button type="button" id={id} className="dd-btn" aria-haspopup="listbox" aria-expanded={open} aria-label={label} onClick={() => (open ? setOpen(false) : openList())}>
        <span>{options[cur]?.label}</span>
        <LuChevronDown aria-hidden="true" />
      </button>
      {open && (
        <ul className="dd-list" role="listbox" aria-label={label}>
          {options.map((o, i) => (
            <li key={o.value} role="option" aria-selected={i === cur} className={`${i === hi ? 'hi' : ''} ${i === cur ? 'sel' : ''}`}
              onMouseEnter={() => setHi(i)} onClick={() => pick(i)}>
              <span>{o.label}</span>{i === cur && <LuCheck aria-hidden="true" />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
