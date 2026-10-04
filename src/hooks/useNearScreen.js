import { useEffect, useRef, useState } from 'react'

// Element ekranga yaqinlashganda `near` bir marta true bo'ladi (og'ir 3D qismlarni kech yuklash uchun).
// `visible` esa element ekranda bo'lgan paytda true, chiqib ketsa false (3D chizishni to'xtatish uchun).
export function useNearScreen(margin = 300) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const check = () => {
      const r = el.getBoundingClientRect()
      const inView = r.top < window.innerHeight + 80 && r.bottom > -80
      setVisible(inView)
      if (r.top < window.innerHeight + margin && r.bottom > -margin) setNear(true)
    }
    let io
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(([e]) => {
        setVisible(e.isIntersecting)
        if (e.isIntersecting) setNear(true)
      }, { rootMargin: '80px' })
      io.observe(el)
    }
    // Zaxira: ba'zi holatlarda (masalan, yashirin panel) kuzatuvchi ishlamaydi
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    const timer = setInterval(check, 800)
    check()
    return () => {
      io?.disconnect()
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
      clearInterval(timer)
    }
  }, [margin])

  return [ref, near, visible]
}
