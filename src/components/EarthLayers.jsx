import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { LuExpand, LuShrink } from 'react-icons/lu'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import ErrorBoundary from './ErrorBoundary'
import { useNearScreen } from '../hooks/useNearScreen'

const base = import.meta.env.BASE_URL

// Sxematik radiuslar (po'st ko'rinishi uchun qalinlashtirilgan). outer > inner.
const LAYERS = [
  { outer: 1.0, inner: 0.93, color: '#6b5a48', glow: 0, labelAngle: 62 },
  { outer: 0.93, inner: 0.47, color: '#b8571f', glow: 0.18, labelAngle: 28 },
  { outer: 0.47, inner: 0.22, color: '#ff8c1a', glow: 0.7, labelAngle: -18 },
  { outer: 0.22, inner: 0, color: '#ffe27a', glow: 1.1, labelAngle: -50 },
]

// Kesilgan bo'lak: φ = π/2 dan π gacha (to'rtdan bir) olib tashlangan
const PHI_START = Math.PI
const PHI_LEN = Math.PI * 1.5

// Ajratilganda qatlamlar o'ng tomonga qarab ketma-ket joylashadi
const OFFSETS = LAYERS.reduce((acc, l, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + (LAYERS[i - 1].outer + l.outer) * 0.95)
  return acc
}, [])
const SPAN_CENTER = (-LAYERS[0].outer + OFFSETS.at(-1) + LAYERS.at(-1).outer) / 2
const RIGHT = new THREE.Vector3(1, 0, -1).normalize() // kamera nuqtai nazaridan "o'ng"
const CAM_AZIMUTH = Math.PI / 4

function Layer({ index, spread, hot, onHover, onSelect, crustMap, name }) {
  const l = LAYERS[index]
  const grp = useRef()
  const mats = useMemo(() => {
    const c = new THREE.Color(l.color)
    const face = new THREE.MeshStandardMaterial({ color: c, emissive: c, emissiveIntensity: l.glow, roughness: 0.85, metalness: 0.05, side: THREE.DoubleSide })
    const outer = index === 0
      ? new THREE.MeshStandardMaterial({ map: crustMap, emissive: c, emissiveIntensity: 0, roughness: 0.9, side: THREE.DoubleSide })
      : face
    return { face, outer }
  }, [index, l, crustMap])

  useFrame(() => {
    grp.current.position.copy(RIGHT).multiplyScalar(OFFSETS[index] * spread.current)
    const goal = (m, rest, lit) => { m.emissiveIntensity += ((hot ? lit : rest) - m.emissiveIntensity) * 0.15 }
    goal(mats.face, l.glow, l.glow + 0.55)
    if (index === 0) goal(mats.outer, 0, 0.3)
  })

  const handlers = {
    onPointerOver: (e) => { e.stopPropagation(); onHover(index); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { onHover(null); document.body.style.cursor = '' },
    onClick: (e) => { e.stopPropagation(); onSelect(index) },
  }
  const rMid = (l.outer + l.inner) / 2
  const ang = (l.labelAngle * Math.PI) / 180

  return (
    <group ref={grp} {...handlers}>
      <mesh material={mats.outer}>
        <sphereGeometry args={[l.outer, 72, 54, PHI_START, PHI_LEN]} />
      </mesh>
      {l.inner > 0 && (
        <mesh material={mats.face}>
          <sphereGeometry args={[l.inner, 56, 42, PHI_START, PHI_LEN]} />
        </mesh>
      )}
      {[Math.PI, Math.PI / 2].map((phi) => (
        <mesh key={phi} rotation={[0, phi + Math.PI, 0]} material={mats.face}>
          <ringGeometry args={[l.inner, l.outer, 64, 1, -Math.PI / 2, Math.PI]} />
        </mesh>
      ))}
      <Html position={[rMid * Math.cos(ang), rMid * Math.sin(ang), 0.02]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
        <span className={'int-label' + (hot ? ' on' : '')}>{name}</span>
      </Html>
    </group>
  )
}

function Scene({ exploded, selected, hovered, onHover, onSelect, names }) {
  const crustMap = useTexture(`${base}textures/earth-blue-marble.jpg`)
  useMemo(() => { crustMap.colorSpace = THREE.SRGBColorSpace; crustMap.anisotropy = 8 }, [crustMap])
  const spread = useRef(0)
  const group = useRef()

  useFrame(({ camera, size }, dt) => {
    spread.current += ((exploded ? 1 : 0) - spread.current) * Math.min(1, dt * 4)
    group.current.position.copy(RIGHT).multiplyScalar(-SPAN_CENTER * spread.current)
    const narrow = size.width / size.height < 1.3 ? 1.35 : 1 // tor ekranda uzoqroq
    const want = (3.4 + 3.6 * spread.current) * narrow
    camera.position.setLength(camera.position.length() + (want - camera.position.length()) * Math.min(1, dt * 4))
  })

  return (
    <>
      <ambientLight intensity={0.85} />
      <directionalLight position={[4, 5, 6]} intensity={2.1} />
      <group ref={group}>
        {LAYERS.map((_, i) => (
          <Layer key={i} index={i} spread={spread} crustMap={crustMap} name={names[i]}
            hot={selected === i || hovered === i} onHover={onHover} onSelect={onSelect} />
        ))}
      </group>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.6}
        minAzimuthAngle={CAM_AZIMUTH - 0.7} maxAzimuthAngle={CAM_AZIMUTH + 0.7}
        minPolarAngle={Math.PI / 2 - 0.55} maxPolarAngle={Math.PI / 2 + 0.55} />
    </>
  )
}

export default function EarthLayers() {
  const { t } = usePrefs()
  const [exploded, setExploded] = useState(false)
  const [selected, setSelected] = useState(3)
  const [hovered, setHovered] = useState(null)
  const [wrapRef, near, visible] = useNearScreen()
  const names = LAYERS.map((_, i) => t(`il${i + 1}_name`))
  const cur = selected
  const n = cur + 1

  return (
    <section className="section" id="ichki" aria-labelledby="int-title">
      <SectionHead id="int-title" tag={t('intTag')} title={t('intTitle')} lead={t('intLead')} />
      <div className="interior">
        <div className="int-stage glass" ref={wrapRef}>
          {near && (
            <ErrorBoundary fallback={<p className="muted int-fail">{t('intFail')}</p>}>
              <Canvas camera={{ position: [3.3 * Math.sin(CAM_AZIMUTH), 1.1, 3.3 * Math.cos(CAM_AZIMUTH)], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={visible ? 'always' : 'demand'}>
                <Suspense fallback={null}>
                  <Scene exploded={exploded} selected={selected} hovered={hovered} onHover={setHovered} onSelect={setSelected} names={names} />
                </Suspense>
              </Canvas>
            </ErrorBoundary>
          )}
          <button className="btn ghost sm int-toggle" onClick={() => setExploded((e) => !e)} aria-pressed={exploded}>
            {exploded ? <LuShrink aria-hidden="true" /> : <LuExpand aria-hidden="true" />} {exploded ? t('intJoin') : t('intSplit')}
          </button>
        </div>

        <div className="int-side">
          <div className="int-list" role="tablist" aria-label={t('intListLabel')}>
            {LAYERS.map((l, i) => (
              <button key={i} role="tab" aria-selected={selected === i} className={`int-item ${selected === i ? 'on' : ''}`}
                onClick={() => setSelected(i)} onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
                <span className="dot" style={{ background: l.color, boxShadow: `0 0 10px ${l.color}` }} aria-hidden="true" /> {names[i]}
              </button>
            ))}
          </div>
          <div className="card int-detail" aria-live="polite">
            <h3><span className="dot lg" style={{ background: LAYERS[cur].color }} aria-hidden="true" /> {t(`il${n}_name`)}</h3>
            <dl>
              <div><dt>{t('intDepth')}</dt><dd>{t(`il${n}_depth`)}</dd></div>
              {t(`il${n}_temp`) && <div><dt>{t('intTemp')}</dt><dd>{t(`il${n}_temp`)}</dd></div>}
              <div><dt>{t('intState')}</dt><dd>{t(`il${n}_state`)}</dd></div>
            </dl>
            <p className="muted">{t(`il${n}_text`)}</p>
          </div>
          <p className="muted small">{t('intNote')}</p>
        </div>
      </div>
    </section>
  )
}
