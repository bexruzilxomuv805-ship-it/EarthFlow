import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { DICT, LANGS } from './i18n'

const Ctx = createContext(null)

const read = (k) => { try { return localStorage.getItem(k) } catch { return null } }
const write = (k, v) => { try { localStorage.setItem(k, v) } catch { /* ok */ } }

const initialLang = () => {
  const q = new URLSearchParams(window.location.search).get('lang')
  if (LANGS.includes(q)) return q
  const s = read('lang')
  return LANGS.includes(s) ? s : 'uz'
}
const initialTheme = () => (read('theme') === 'light' ? 'light' : 'dark')

// Sahifa yuklanmasidan oldin mavzuni qo'yamiz, shunda rang "chaqnamaydi"
document.documentElement.dataset.theme = initialTheme()

export function PrefsProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const [theme, setTheme] = useState(initialTheme)

  useEffect(() => { document.documentElement.lang = lang; write('lang', lang) }, [lang])
  useEffect(() => { document.documentElement.dataset.theme = theme; write('theme', theme) }, [theme])

  const setLang = useCallback((l) => { if (LANGS.includes(l)) setLangState(l) }, [])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const t = useCallback((key, vars) => {
    let s = DICT[lang][key] ?? DICT.uz[key] ?? key
    if (vars) for (const k in vars) s = s.replaceAll(`{${k}}`, vars[k])
    return s
  }, [lang])

  const value = useMemo(() => ({ lang, setLang, theme, toggleTheme, t }), [lang, setLang, theme, toggleTheme, t])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const usePrefs = () => useContext(Ctx)
