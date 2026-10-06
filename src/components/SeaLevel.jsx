import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import sealevel from '../data/sealevel.json'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import FrameKick from './FrameKick'
import ErrorBoundary from './ErrorBoundary'
import { useNearScreen } from '../hooks/useNearScreen'

const tex = (name) => `${import.meta.env.BASE_URL}textures/${name}`
const M_PER_LEVEL = 35 // relyef rasmidagi bitta kulrang daraja taxminan shuncha metr
const MAX_M = 70

const vert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN;
  void main() { vUv = uv; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

const frag = /* glsl */ `
  uniform sampler2D uDay; uniform sampler2D uTopo; uniform sampler2D uWater;
  uniform vec3 uSun; uniform float uFlood; // uFlood: kulrang darajalarda
  varying vec2 vUv; varying vec3 vN;
  void main() {
    vec3 N = normalize(vN);
    vec3 L = normalize((viewMatrix * vec4(uSun, 0.0)).xyz);
    float d = max(dot(N, L), 0.0);
    vec3 day = texture2D(uDay, vUv).rgb;
    float water = texture2D(uWater, vUv).r;
    float h = texture2D(uTopo, vUv).r * 255.0;
    float land = 1.0 - smoothstep(0.4, 0.6, water);
    float flood = land * (1.0 - smoothstep(uFlood - 0.45, uFlood + 0.05, h)) * smoothstep(0.0, 0.1, uFlood);
    // Qorong'i tomon ham ko'rinsin: yorug'lik yumshoq, ammo suv bosgan joy yorqin firuza rangda
    vec3 col = day * (0.42 + d * 0.85);
    float edge = flood * (1.0 - flood) * 4.0;
    vec3 sea = vec3(0.00, 0.85, 1.00) * (0.75 + d * 0.5);
    col = mix(col, sea, flood * 0.95);
    col += vec3(0.6, 1.0, 1.0) * edge * 0.35;
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

function Globe({ meters }) {
  const [day, topo, water] = useTexture([tex('earth-blue-marble.jpg'), tex('earth-topology.png'), tex('earth-water.png')])
  const mesh = useRef()
  const initial = useRef(meters) // ochilganda suv sathi darrov to'g'ri boshlansin
  const uniforms = useMemo(() => {
    day.colorSpace = THREE.SRGBColorSpace
    return { uDay: { value: day }, uTopo: { value: topo }, uWater: { value: water }, uSun: { value: new THREE.Vector3(2.5, 2, 5) }, uFlood: { value: initial.current / M_PER_LEVEL } }
  }, [day, topo, water])
  // Slayder o'zgarganda suv sathi yumshoq ko'tariladi
  useFrame((_, dt) => {
    const goal = meters / M_PER_LEVEL
    uniforms.uFlood.value += (goal - uniforms.uFlood.value) * Math.min(1, dt * 5)
  })
  return (
    <mesh ref={mesh} rotation={[0.25, -1.9, 0]}>
      <sphereGeometry args={[1, 96, 96]} />
      <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  )
}

export default function SeaLevel() {
  const { t } = usePrefs()
  const [m, setM] = useState(0)
  const [ref, near, visible] = useNearScreen()
  const first = sealevel.data[0], last = sealevel.data.at(-1)
  const desc = m === 0 ? 'seaD0' : m <= 15 ? 'seaD1' : m <= 45 ? 'seaD2' : 'seaD3'
  const presets = [
    { v: 0, label: t('seaNow') },
    { v: 10, label: t('seaM', { m: 10 }) },
    { v: 30, label: t('seaM', { m: 30 }) },
    { v: 65, label: t('seaM', { m: 65 }), hint: t('seaP3Hint') },
  ]

  return (
    <section className="section" id="dengiz" aria-labelledby="sea-title">
      <SectionHead id="sea-title" tag={t('seaTag')} title={t('seaTitle')} lead={t('seaLead')} />
      <div className="sea">
        <div className="sea-stage glass" ref={ref} role="img" aria-label={t('seaGlobeLabel')}>
          {near && (
            <ErrorBoundary fallback={null}>
              <Canvas camera={{ position: [0, 0, 3.1], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={visible ? 'always' : 'demand'}>
<FrameKick active={visible} />
                <Suspense fallback={null}>
                  <Globe meters={m} />
                </Suspense>
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.7} rotateSpeed={0.5} />
              </Canvas>
            </ErrorBoundary>
          )}
        </div>

        <div className="sea-side">
          <div className="card sea-ctl">
            <label htmlFor="sea-range" className="sea-value">
              <span className="muted small">{t('seaSlider')}</span>
              <span className="big accent">{m === 0 ? t('seaNow') : t('seaM', { m })}</span>
            </label>
            <input id="sea-range" type="range" min={0} max={MAX_M} step={5} value={m} onChange={(e) => setM(Number(e.target.value))} />
            <div className="sea-presets" role="group" aria-label={t('seaPresets')}>
              {presets.map((p) => (
                <button key={p.v} className={`tab ${m === p.v ? 'on' : ''}`} aria-pressed={m === p.v} onClick={() => setM(p.v)}>
                  {p.label}{p.hint && <small> · {p.hint}</small>}
                </button>
              ))}
            </div>
            <p className="muted" aria-live="polite">{t(desc)}</p>
            <p className="sea-legend small"><span className="swatch" aria-hidden="true" /> {t('seaLegend')}</p>
          </div>
          <div className="stat">
            <div className="muted small">{t('seaReal', { from: first.year, to: last.year, mm: last.value.toFixed(0) })}</div>
          </div>
          <p className="muted small">{t('seaNote')}</p>
        </div>
      </div>
    </section>
  )
}
