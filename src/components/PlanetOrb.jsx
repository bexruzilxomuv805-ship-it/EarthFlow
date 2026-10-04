import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const tex = (name) => `${import.meta.env.BASE_URL}textures/${name}`
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const vert = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  void main() {
    vObj = position;
    vN = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`

// 3D shovqin (value noise + fbm): sayyora sirtini rasmsiz chizish uchun
const noise = /* glsl */ `
  float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
  float vnoise(vec3 x) {
    vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
               mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
  }
  float fbm(vec3 p) { float a = 0.5, s = 0.0; for (int i = 0; i < 5; i++) { s += a * vnoise(p); p *= 2.03; a *= 0.5; } return s; }
`

const lighting = /* glsl */ `
  vec3 N = normalize(vN);
  vec3 L = normalize(vec3(-0.55, 0.35, 0.75));
  float diff = max(dot(N, L), 0.0);
  float rim = pow(1.0 - max(N.z, 0.0), 3.0);
`

const marsFrag = /* glsl */ `
  varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    float big = fbm(p * 2.2);
    float small = fbm(p * 7.0);
    vec3 rust = vec3(0.80, 0.36, 0.19), dust = vec3(0.93, 0.62, 0.38), dark = vec3(0.33, 0.14, 0.09);
    vec3 col = mix(rust, dust, smoothstep(0.45, 0.7, big));
    col = mix(col, dark, smoothstep(0.52, 0.72, fbm(p * 1.6 + 4.0)) * 0.75);
    col *= 0.85 + 0.3 * small;
    float cap = smoothstep(0.86, 0.93, abs(p.y) + (small - 0.5) * 0.12);
    col = mix(col, vec3(0.95, 0.95, 0.97), cap);
    vec3 lit = col * (0.10 + diff * 1.05) + vec3(0.9, 0.5, 0.35) * rim * 0.18;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

const venusFrag = /* glsl */ `
  uniform float uTime; varying vec3 vObj; varying vec3 vN;
  ${noise}
  void main() {
    ${lighting}
    vec3 p = normalize(vObj);
    // Qalin bulutlar: shovqin shovqinni buradi (domain warping), ekvator bo'ylab yo'l-yo'l
    vec3 q = vec3(p.x * 1.4, p.y * 3.2, p.z * 1.4);
    float t = uTime * 0.05;
    float w = fbm(q * 1.6 + vec3(t, 0.0, -t));
    float c = fbm(q * 2.4 + w * 2.2 + vec3(0.0, t * 2.0, 0.0));
    vec3 pale = vec3(0.97, 0.86, 0.55), gold = vec3(0.86, 0.60, 0.26), deep = vec3(0.62, 0.38, 0.17);
    vec3 col = mix(gold, pale, smoothstep(0.3, 0.75, c));
    col = mix(col, deep, smoothstep(0.55, 0.85, w) * 0.5);
    vec3 lit = col * (0.16 + diff * 1.0) + vec3(1.0, 0.8, 0.4) * rim * 0.45;
    gl_FragColor = vec4(lit, 1.0);
    #include <colorspace_fragment>
  }`

function Spin({ children, speed }) {
  const g = useRef()
  useFrame((_, dt) => { g.current.rotation.y += dt * (reduceMotion ? 0 : speed) })
  return <group ref={g} rotation={[0.15, 0, 0.1]}>{children}</group>
}

function Earth({ r }) {
  const [day, clouds] = useTexture([tex('earth-blue-marble.jpg'), tex('clouds.webp')])
  useMemo(() => { day.colorSpace = THREE.SRGBColorSpace; day.anisotropy = 4 }, [day])
  return (
    <>
      <mesh>
        <sphereGeometry args={[r, 64, 64]} />
        <meshStandardMaterial map={day} roughness={0.85} />
      </mesh>
      <mesh>
        <sphereGeometry args={[r * 1.012, 64, 64]} />
        <meshStandardMaterial map={clouds} transparent opacity={0.55} depthWrite={false} roughness={1} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[r, 48, 48]} />
        <meshBasicMaterial color="#5ab4ff" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  )
}

function Shaded({ r, frag, uniforms, glow }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms: uniforms || {} }), [frag, uniforms])
  useFrame(({ clock }) => { if (mat.uniforms.uTime) mat.uniforms.uTime.value = clock.elapsedTime })
  return (
    <>
      <mesh material={mat}><sphereGeometry args={[r, 64, 64]} /></mesh>
      <mesh scale={1.07}>
        <sphereGeometry args={[r, 48, 48]} />
        <meshBasicMaterial color={glow} transparent opacity={0.14} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  )
}

// scale: sayyora diametrining Yerga nisbati (doira o'lchami haqiqiy nisbatda bo'ladi)
export default function PlanetOrb({ kind, scale = 1, active = true }) {
  const r = 0.78 * scale
  const venusUniforms = useMemo(() => ({ uTime: { value: 0 } }), [])
  return (
    <Canvas camera={{ position: [0, 0, 3], fov: 30 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={active ? 'always' : 'demand'}>
      <ambientLight intensity={0.35} />
      <directionalLight position={[-2.2, 1.4, 3]} intensity={2.6} />
      <Suspense fallback={null}>
        <Spin speed={kind === 'venus' ? 0.08 : kind === 'mars' ? 0.25 : 0.3}>
          {kind === 'earth' && <Earth r={r} />}
          {kind === 'mars' && <Shaded r={r} frag={marsFrag} glow="#ff8a5c" />}
          {kind === 'venus' && <Shaded r={r} frag={venusFrag} uniforms={venusUniforms} glow="#ffcf70" />}
        </Spin>
      </Suspense>
    </Canvas>
  )
}
