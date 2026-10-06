import { useEffect, useRef } from 'react'
import { usePrefs } from '../prefs'

// Nusxalash ishlamasa brauzerning oddiy oynasi o'rniga: havola tanlangan holda saytning o'zida ko'rsatiladi
export default function CopyBox({ text, onClose }) {
  const { t } = usePrefs()
  const ref = useRef(null)
  useEffect(() => { ref.current?.focus(); ref.current?.select() }, [])
  return (
    <div className="copybox" role="status">
      <span className="muted small">{t('copyManual')}</span>
      <input ref={ref} readOnly value={text} aria-label={t('copyManual')} onFocus={(e) => e.target.select()} onKeyDown={(e) => { if (e.key === 'Escape') onClose() }} />
    </div>
  )
}
