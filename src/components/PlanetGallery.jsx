import { useState } from 'react'
import { LuImage } from 'react-icons/lu'
import { usePrefs } from '../prefs'

const base = import.meta.env.BASE_URL
const EXTS = ['jpg', 'jpeg', 'png', 'webp']
const SLOTS = 6 // <id>.jpg, <id>-2.jpg ... <id>-6.jpg (jpg, jpeg, png yoki webp)

// Bitta rasm o'rni: kengaytmalarni birin-ketin sinaydi, topilmasa hech narsa chizmaydi
function Slot({ id, n, name, onResult }) {
  const [ext, setExt] = useState(0)
  const [ok, setOk] = useState(false)
  const file = n === 1 ? id : `${id}-${n}`
  if (ext >= EXTS.length) return null
  return (
    <figure className="card photo pg-item" hidden={!ok}>
      <img
        src={`${base}planets/${file}.${EXTS[ext]}`}
        alt={`${name} ${n}`}
        onLoad={() => { setOk(true); onResult(n, true) }}
        onError={() => { if (ext + 1 >= EXTS.length) onResult(n, false); setExt(ext + 1) }}
      />
    </figure>
  )
}

// Sayyoraning rasmlari: public/planets/<id>.jpg, <id>-2.jpg, ... Rasm bo'lmasa chiroyli joy ko'rsatiladi
export default function PlanetGallery({ id, name, color }) {
  const { t } = usePrefs()
  const [res, setRes] = useState({})
  const onResult = (n, ok) => setRes((r) => (r[n] === ok ? r : { ...r, [n]: ok }))
  const settled = Object.keys(res).length === SLOTS
  const any = Object.values(res).some(Boolean)
  return (
    <div className="pg">
      <div className="grid pg-grid">
        {Array.from({ length: SLOTS }, (_, i) => <Slot key={i} id={id} n={i + 1} name={name} onResult={onResult} />)}
      </div>
      {settled && !any && (
        <div className="pg-empty glass" style={{ '--c': color }}>
          <span className="pg-orb" aria-hidden="true" />
          <LuImage aria-hidden="true" />
          <p>{t('plPhotoSoon')}</p>
        </div>
      )}
    </div>
  )
}
