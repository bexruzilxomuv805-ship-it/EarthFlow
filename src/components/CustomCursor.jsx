import { useEffect, useRef } from 'react'

// Bosiladigan elementlar
const LINK = 'a, button, [role="tab"], [role="button"], input, label, select, summary, .spot-chip'
const reduce = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

// Sayt uslubidagi kursor: markazda nuqta, atrofida yo'ldosh aylanadigan "orbita" halqasi.
// Faqat sichqoncha bor qurilmalarda ishlaydi (telefon va planshetda yoqilmaydi).
export default function CustomCursor() {
  const ring = useRef(null)
  const dot = useRef(null)

  useEffect(() => {
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return
    const html = document.documentElement
    const R = ring.current, D = dot.current
    let x = -100, y = -100, rx = x, ry = y, raf = 0, shown = false, state = ''

    const show = () => { if (shown) return; shown = true; html.classList.add('cursor-on'); R.classList.add('show'); D.classList.add('show') }
    const hide = () => { shown = false; html.classList.remove('cursor-on'); R.classList.remove('show'); D.classList.remove('show') }
    const setState = (s) => {
      if (s === state) return
      R.classList.remove('is-link', 'is-drag'); D.classList.remove('is-link')
      if (s) { R.classList.add(`is-${s}`); if (s === 'link') D.classList.add('is-link') }
      state = s
    }

    const loop = () => {
      const k = reduce() ? 1 : 0.2
      rx += (x - rx) * k; ry += (y - ry) * k
      R.style.transform = `translate3d(${rx}px, ${ry}px, 0)`
      raf = (Math.abs(x - rx) > 0.1 || Math.abs(y - ry) > 0.1) ? requestAnimationFrame(loop) : 0
    }
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop) }

    const onMove = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') { hide(); return }
      x = e.clientX; y = e.clientY
      if (!shown) { rx = x; ry = y; show() }
      D.style.transform = `translate3d(${x}px, ${y}px, 0)`
      const t = e.target
      // 3D oynada: nuqta ustida bosiladigan (kod "pointer" qo'yadi), aks holda sudrash
      if (t?.tagName === 'CANVAS') setState(document.body.style.cursor === 'pointer' ? 'link' : 'drag')
      else setState(t?.closest?.(LINK) ? 'link' : '')
      kick()
    }
    const onDown = (e) => {
      if (e.pointerType && e.pointerType !== 'mouse') return
      R.classList.add('is-down')
      // Bosganda tovush to'lqiniga o'xshash halqa tarqaladi
      if (!reduce()) {
        const p = document.createElement('span')
        p.className = 'cursor-pulse'
        p.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`
        const inner = document.createElement('i')
        p.appendChild(inner)
        inner.addEventListener('animationend', () => p.remove())
        document.body.appendChild(p)
      }
    }
    const onUp = () => R.classList.remove('is-down')
    const onLeave = () => hide()

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      html.classList.remove('cursor-on')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true"><span className="cr-scale"><span className="cr-spin" /></span></div>
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
