import { useEffect, useState } from 'react'

// Kichik router: kutubxonasiz. /science va /about sahifalari, qolgani bosh sahifa.
export function go(to) {
  window.history.pushState(null, '', to)
  window.dispatchEvent(new Event('app:nav'))
}

const read = () => ({ path: window.location.pathname.replace(/\/+$/, '') || '/', hash: window.location.hash })

export function useLocation() {
  const [loc, setLoc] = useState(read)
  useEffect(() => {
    const on = () => setLoc(read())
    for (const e of ['popstate', 'app:nav', 'hashchange']) window.addEventListener(e, on)
    return () => { for (const e of ['popstate', 'app:nav', 'hashchange']) window.removeEventListener(e, on) }
  }, [])
  return loc
}

export function Link({ to, onClick, ...props }) {
  const handle = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return
    e.preventDefault()
    go(to)
  }
  return <a href={to} onClick={handle} {...props} />
}
