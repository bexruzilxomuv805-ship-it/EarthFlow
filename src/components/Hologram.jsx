import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { usePrefs } from '../prefs'
import SectionHead from './SectionHead'
import ErrorBoundary from './ErrorBoundary'
import FrameKick from './FrameKick'
import { useNearScreen } from '../hooks/useNearScreen'

const water = `${import.meta.env.BASE_URL}textures/earth-water.png`

const vert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() { vUv = uv; vP = position; vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`

// Quruqlik nuqtalar to'ri, kenglik/uzunlik chiziqlari, chekkada yorug'lik va yuqoriga siljiydigan skaner chizig'i
const frag = /* glsl */ `
  uniform sampler2D uWater; uniform float uTime;
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() {
    float land = 1.0 - smoothstep(0.4, 0.6, texture2D(uWater, vUv).r);
    vec2 f = fract(vUv * vec2(200.0, 100.0)) - 0.5;
    float dots = smoothstep(0.4, 0.2, length(f));
    vec2 q = abs(fract(vUv * vec2(24.0, 12.0)) - 0.5);
    float grid = max(smoothstep(0.48, 0.5, q.x), smoothstep(0.48, 0.5, q.y));
    float rim = pow(1.0 - abs(dot(normalize(vN), vec3(0.0, 0.0, 1.0))), 2.5);
    float scan = 0.6 + 0.4 * sin(vP.y * 70.0 - uTime * 3.0);
    float sweep = smoothstep(0.12, 0.0, abs(fract(uTime * 0.18) * 2.0 - 1.0 - vP.y));
    float a = (land * dots * 0.95 + grid * 0.22 + rim * 0.7 + (1.0 - land) * 0.05) * scan + sweep * 0.5;
    vec3 c = mix(vec3(0.15, 0.75, 1.0), vec3(0.75, 1.0, 1.0), rim + sweep);
    gl_FragColor = vec4(c, clamp(a, 0.0, 1.0));
  }`

function HoloGlobe() {
  const map = useTexture(water)
  const group = useRef()
  const uniforms = useMemo(() => ({ uWater: { value: map }, uTime: { value: 0 } }), [map])
  useFrame((_, dt) => {
    uniforms.uTime.value += dt
    if (group.current) group.current.rotation.y += dt * 0.25
  })
  return (
    <group position={[0, 0.15, 0]}>
      <group ref={group} rotation={[0.35, 0, 0.12]}>
        <mesh>
          <sphereGeometry args={[1, 96, 96]} />
          <shaderMaterial vertexShader={vert} fragmentShader={frag} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      {/* Proyektor: nur va halqalar */}
      <mesh position={[0, -0.95, 0]}>
        <cylinderGeometry args={[0.95, 0.38, 0.9, 48, 1, true]} />
        <meshBasicMaterial color="#2fd0ff" transparent opacity={0.07} depthWrite={false} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
      </mesh>
      {[0.5, 0.75, 1.0].map((r, i) => (
        <mesh key={r} position={[0, -1.42 + i * 0.02, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.012, 8, 96]} />
          <meshBasicMaterial color="#5ad1ff" transparent opacity={0.85 - i * 0.2} blending={THREE.AdditiveBlending} />
        </mesh>
      ))}
      <mesh position={[0, -1.45, 0]}>
        <cylinderGeometry args={[1.05, 1.15, 0.06, 64]} />
        <meshBasicMaterial color="#0b2a55" />
      </mesh>
    </group>
  )
}

export default function Hologram() {
  const { t } = usePrefs()
  const [ref, near, visible] = useNearScreen()
  return (
    <section className="section" id="gologramma" aria-labelledby="holo-title">
      <SectionHead id="holo-title" tag={t('holoTag')} title={t('holoTitle')} lead={t('holoLead')} />
      <div className="holo-stage glass" ref={ref} role="img" aria-label={t('holoLabel')}>
        {near && (
          <ErrorBoundary fallback={null}>
            <Canvas camera={{ position: [0, 0.55, 5.2], fov: 38 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={visible ? 'always' : 'demand'}>
              <FrameKick active={visible} />
              <Suspense fallback={null}>
                <HoloGlobe />
              </Suspense>
              <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI / 3} maxPolarAngle={Math.PI / 1.9} rotateSpeed={0.5} />
            </Canvas>
          </ErrorBoundary>
        )}
      </div>
      <p className="muted small holo-hint">{t('holoHint')}</p>
    </section>
  )
}
