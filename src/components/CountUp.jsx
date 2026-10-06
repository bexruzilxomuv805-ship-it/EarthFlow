import { useEffect, useRef, useState } from 'react'

// Ekranga kirganda 0 dan qiymatgacha sanaydi (harakatni kamaytirish yoqilgan bo'lsa darhol ko'rsatadi)
export default function CountUp({ to, decimals = 0, signed = false }) {
  const ref = useRef(null)
  const [v, setV] = useState(0)
  useEffect(() => {
    const el = ref.current
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || !('IntersectionObserver' in window)) { setV(to); return }
    let raf = 0
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const tick = (now) => {
        const q = Math.min(1, (now - t0) / 1400)
        setV(to * (1 - Math.pow(1 - q, 3)))
        if (q < 1) raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [to])
  return <span ref={ref}>{signed && v > 0 ? '+' : ''}{v.toFixed(decimals)}</span>
}
