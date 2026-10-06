import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Line, OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import ErrorBoundary from './ErrorBoundary'
import FrameKick from './FrameKick'
import { useNearScreen } from '../hooks/useNearScreen'

const water = `${import.meta.env.BASE_URL}textures/earth-water.png`
const ADD = THREE.AdditiveBlending
const CYAN = [0.15, 0.75, 1.0]
const MOON = [0.7, 0.85, 1.0]
const SHELL = [0.2, 0.8, 1.0]
const TILT = [0.35, 0, 0.12]
const FLAT = [0, 0, 0]

const vert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() { vUv = uv; vP = position; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

// Quruqlik nuqtalar to'ri, kenglik/uzunlik chiziqlari, chekkada yorug'lik, skaner chizig'i
const frag = /* glsl */ `
  uniform sampler2D uWater; uniform float uTime; uniform float uUse; uniform vec3 uColor;
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() {
    float land = uUse > 0.5 ? 1.0 - smoothstep(0.4, 0.6, texture2D(uWater, vUv).r) : 1.0;
    vec2 f = fract(vUv * vec2(200.0, 100.0)) - 0.5;
    float dots = smoothstep(0.4, 0.2, length(f));
    vec2 q = abs(fract(vUv * vec2(24.0, 12.0)) - 0.5);
    float grid = max(smoothstep(0.48, 0.5, q.x), smoothstep(0.48, 0.5, q.y));
    float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 2.5);
    float scan = 0.6 + 0.4 * sin(vP.y * 70.0 - uTime * 3.0);
    float sweep = smoothstep(0.12, 0.0, abs(fract(uTime * 0.18) * 2.0 - 1.0 - vP.y));
    float a = (land * dots * 0.95 + grid * 0.22 + rim * 0.7 + (1.0 - land) * 0.05) * scan + sweep * 0.5;
    vec3 c = mix(uColor, vec3(0.8, 1.0, 1.0), rim + sweep);
    gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
  }`

const shellFrag = /* glsl */ `
  uniform vec3 uColor; varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() { float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 3.0); gl_FragColor = vec4(uColor, rim * 0.75); }`

// Gologramma shari: Yer (xarita bilan) yoki oddiy shar (Oy)
function HoloSphere({ radius = 1, map, useMap = 1, color = CYAN, spin = 0.25, tilt = TILT }) {
  const group = useRef()
  const uniforms = useMemo(() => ({ uWater: { value: map }, uTime: { value: 0 }, uUse: { value: useMap }, uColor: { value: new THREE.Vector3(...color) } }), [map, useMap, color])
  useFrame((_, dt) => {
    uniforms.uTime.value += dt
    if (group.current) group.current.rotation.y += dt * spin
  })
  return (
    <group ref={group} rotation={tilt}>
      <mesh scale={radius}>
        <sphereGeometry args={[1, 72, 72]} />
        <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} blending={ADD} />
      </mesh>
    </group>
  )
}

function Shell({ radius, color = SHELL }) {
  const uniforms = useMemo(() => ({ uColor: { value: new THREE.Vector3(...color) } }), [color])
  return (
    <mesh scale={radius}>
      <sphereGeometry args={[1, 48, 48]} />
      <shaderMaterial vertexShader={vert} fragmentShader={shellFrag} uniforms={uniforms} transparent depthWrite={false} side={THREE.FrontSide} blending={ADD} />
    </mesh>
  )
}

// Orbita: halqa + ustida aylanuvchi jism
function Orbit({ radius, speed, tilt = [0, 0, 0], phase = 0, ring = true, children }) {
  const arm = useRef()
  useFrame((_, dt) => { if (arm.current) arm.current.rotation.y += dt * speed })
  return (
    <group rotation={tilt}>
      {ring && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius, 0.004, 6, 160]} />
          <meshBasicMaterial color="#5ad1ff" transparent opacity={0.45} blending={ADD} />
        </mesh>
      )}
      <group ref={arm} rotation={[0, phase, 0]}>
        <group position={[radius, 0, 0]}>{children}</group>
      </group>
    </group>
  )
}

const Sat = () => (
  <mesh>
    <octahedronGeometry args={[0.045, 0]} />
    <meshBasicMaterial color="#e9fbff" />
  </mesh>
)

// Proyektor: nur, halqalar va taglik
function Base() {
  return (
    <group position={[0, -1.45, 0]}>
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.95, 0.38, 0.9, 48, 1, true]} />
        <meshBasicMaterial color="#2fd0ff" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} blending={ADD} />
      </mesh>
      {[0.5, 0.75, 1.0].map((r, i) => (
        <mesh key={r} position={[0, 0.03 + i * 0.015, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.012, 8, 96]} />
          <meshBasicMaterial color="#5ad1ff" transparent opacity={0.85 - i * 0.2} blending={ADD} />
        </mesh>
      ))}
      <mesh>
        <cylinderGeometry args={[1.05, 1.15, 0.06, 64]} />
        <meshBasicMaterial color="#0b2a55" />
      </mesh>
    </group>
  )
}

// 1) Yer va Oy: atmosfera, Oy orbitasi va sun'iy yo'ldoshlar
function EarthMoon({ map }) {
  return (
    <group>
      <HoloSphere radius={1} map={map} />
      <Shell radius={1.1} />
      <Orbit radius={1.55} speed={1.1} tilt={[0.5, 0, 0.2]} phase={0.5}><Sat /></Orbit>
      <Orbit radius={1.4} speed={-0.9} tilt={[-0.9, 0.6, 0]} phase={2.4}><Sat /></Orbit>
      <Orbit radius={1.7} speed={0.8} tilt={[1.3, 0.2, 0.4]} phase={4}><Sat /></Orbit>
      <Orbit radius={2.35} speed={0.22} tilt={[0.18, 0, 0.1]}>
        <HoloSphere radius={0.27} map={map} useMap={0} color={MOON} spin={0.1} tilt={FLAT} />
      </Orbit>
    </group>
  )
}

// 2) Magnit maydon: dipol chiziqlari va Quyosh shamoli zarralari
const FIELD_LINES = (() => {
  const lines = []
  for (const L of [1.7, 2.2, 2.8]) {
    const lmax = Math.acos(Math.sqrt(0.6 / L))
    for (let k = 0; k < 8; k++) {
      const phi = (k / 8) * Math.PI * 2
      const pts = []
      for (let i = 0; i <= 40; i++) {
        const lam = -lmax + (2 * lmax * i) / 40
        const r = L * Math.cos(lam) ** 2
        pts.push([r * Math.cos(lam) * Math.cos(phi), r * Math.sin(lam), r * Math.cos(lam) * Math.sin(phi)])
      }
      lines.push(pts)
    }
  }
  return lines
})()

const N_WIND = 520
function SolarWind() {
  const ref = useRef()
  const seed = useMemo(() => Array.from({ length: N_WIND }, () => {
    const a = Math.random() * Math.PI * 2
    const d = 0.3 + Math.random() * 2.1
    return { x: -3 + Math.random() * 6, y: Math.cos(a) * d, z: Math.sin(a) * d, d, v: 0.8 + Math.random() * 0.8 }
  }), [])
  const pos = useMemo(() => new Float32Array(N_WIND * 3), [])
  useFrame((_, dt) => {
    for (let i = 0; i < N_WIND; i++) {
      const p = seed[i]
      p.x += dt * p.v
      if (p.x > 3) p.x = -3
      // Maydonga yaqinlashganda zarralar chetga og'adi
      const bulge = 1 + 1.15 * Math.exp(-(((p.x + 0.4) / 1.5) ** 2)) * Math.max(0, Math.min(1, (3.1 - p.d) / 2.2))
      pos[i * 3] = p.x
      pos[i * 3 + 1] = p.y * bulge
      pos[i * 3 + 2] = p.z * bulge
    }
    if (ref.current) ref.current.geometry.attributes.position.needsUpdate = true
  })
  return (
    <points ref={ref}>
      <bufferGeometry><bufferAttribute attach="attributes-position" args={[pos, 3]} /></bufferGeometry>
      <pointsMaterial size={0.045} color="#ffcf7a" transparent opacity={0.9} depthWrite={false} blending={ADD} sizeAttenuation />
    </points>
  )
}

function Magnetic({ map }) {
  return (
    <group rotation={[0, 0, 0.2]}>
      <group scale={0.55}><HoloSphere radius={1} map={map} /></group>
      {FIELD_LINES.map((pts, i) => <Line key={i} points={pts} color="#5ad1ff" transparent opacity={0.5} lineWidth={1} />)}
      <SolarWind />
    </group>
  )
}

// 3) Quyosh tizimi: sakkizta sayyora (orbita davrlari kunlarda; masofa va tezlik ko'rsatish uchun siqilgan)
const PLANETS = [
  { name: 'Merkuriy', r: 0.6, days: 88, size: 0.045, color: '#b9b3ac' },
  { name: 'Venera', r: 0.85, days: 225, size: 0.08, color: '#e9b95a' },
  { name: 'Yer', r: 1.1, days: 365.25, size: 0.085, color: '#4aa3ff' },
  { name: 'Mars', r: 1.35, days: 687, size: 0.06, color: '#e0603a' },
  { name: 'Yupiter', r: 1.75, days: 4333, size: 0.2, color: '#d9a066' },
  { name: 'Saturn', r: 2.1, days: 10759, size: 0.165, color: '#e6cf8f', ring: true },
  { name: 'Uran', r: 2.4, days: 30687, size: 0.12, color: '#8fe0e6' },
  { name: 'Neptun', r: 2.7, days: 60190, size: 0.115, color: '#4a6fe0' },
]
function SolarSystem() {
  return (
    <group rotation={[0.55, 0, 0.1]} scale={0.85}>
      <mesh>
        <sphereGeometry args={[0.24, 32, 32]} />
        <meshBasicMaterial color="#ffb454" />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshBasicMaterial color="#ff9d2e" transparent opacity={0.2} blending={ADD} depthWrite={false} />
      </mesh>
      {PLANETS.map((p, i) => (
        <Orbit key={p.name} radius={p.r} speed={0.5 * (365.25 / p.days) ** 0.55} phase={i * 1.7}>
          <mesh>
            <sphereGeometry args={[p.size, 24, 24]} />
            <meshBasicMaterial color={p.color} />
          </mesh>
          <mesh>
            <sphereGeometry args={[p.size * 1.7, 24, 24]} />
            <meshBasicMaterial color={p.color} transparent opacity={0.16} blending={ADD} depthWrite={false} />
          </mesh>
          {p.ring && (
            <mesh rotation={[Math.PI / 2.2, 0, 0.3]}>
              <ringGeometry args={[p.size * 1.35, p.size * 2.1, 64]} />
              <meshBasicMaterial color={p.color} transparent opacity={0.55} side={THREE.DoubleSide} blending={ADD} depthWrite={false} />
            </mesh>
          )}
        </Orbit>
      ))}
    </group>
  )
}

// Kamera rejimga qarab yumshoq yaqinlashadi/uzoqlashadi
function Rig({ wide }) {
  const camera = useThree((s) => s.camera)
  useFrame((_, dt) => {
    const z = wide ? 14.2 : 7.6
    const y = wide ? 1.7 : 0.6
    camera.position.z += (z - camera.position.z) * Math.min(1, dt * 3)
    camera.position.y += (y - camera.position.y) * Math.min(1, dt * 3)
    camera.lookAt(0, wide ? -0.1 : 0, 0)
  })
  return null
}

const SCENES = [
  { id: 'moon', x: -5.6, Comp: EarthMoon },
  { id: 'field', x: 0, Comp: Magnetic },
  { id: 'solar', x: 5.6, Comp: SolarSystem },
]

function World({ mode }) {
  const map = useTexture(water)
  const wide = mode === 'all'
  return (
    <>
      <Rig wide={wide} />
      {SCENES.map(({ id, x, Comp }) => (
        <group key={id} position={[wide ? x : 0, 0.1, 0]} visible={wide || mode === id}>
          <Comp map={map} />
          <Base />
        </group>
      ))}
    </>
  )
}

const TABS = ['all', 'moon', 'field', 'solar']
const TAB_KEY = { all: 'holoTabAll', moon: 'holoTabMoon', field: 'holoTabField', solar: 'holoTabSolar' }

export default function Hologram() {
  const { t } = usePrefs()
  const [ref, near, visible] = useNearScreen()
  const [mode, setMode] = useState(() => (window.innerWidth >= 900 ? 'all' : 'moon'))
  const caption = mode === 'all' ? t('holoLead') : t(`holo_${mode}`)

  return (
    <section className="section" id="gologramma" aria-labelledby="holo-title">
      <SectionHead id="holo-title" tag={t('holoTag')} title={t('holoTitle')} lead={t('holoLead')} />
      <div className="tabs" role="tablist" aria-label={t('holoTitle')}>
        {TABS.map((id) => (
          <button key={id} role="tab" aria-selected={mode === id} className={`tab ${mode === id ? 'on' : ''}`} onClick={() => setMode(id)}>{t(TAB_KEY[id])}</button>
        ))}
      </div>
      <div className="holo-stage glass" ref={ref} role="img" aria-label={t('holoLabel')}>
        {near && (
          <ErrorBoundary fallback={null}>
            <Canvas camera={{ position: [0, 1.6, 14.2], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={visible ? 'always' : 'demand'}>
              <FrameKick active={visible} />
              <Suspense fallback={null}>
                <World mode={mode} />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.8} rotateSpeed={0.5} />
            </Canvas>
          </ErrorBoundary>
        )}
      </div>
      <p className="muted holo-cap" aria-live="polite">{caption}</p>
      <p className="muted small holo-hint">{t('holoHint')} {t('holoScale')}</p>
    </section>
  )
}
