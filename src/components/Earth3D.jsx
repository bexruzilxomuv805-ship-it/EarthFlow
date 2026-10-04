import { Suspense, useEffect, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'

const tex = (name) => `${import.meta.env.BASE_URL}textures/${name}`
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const earthVert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() {
    vUv = uv;
    vN = normalize(normalMatrix * normal);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vP = mv.xyz;
    gl_Position = projectionMatrix * mv;
  }`

const earthFrag = /* glsl */ `
  uniform sampler2D uDay; uniform sampler2D uNight; uniform sampler2D uWater;
  uniform vec3 uSun; uniform float uHeat;
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() {
    vec3 N = normalize(vN);
    vec3 L = normalize((viewMatrix * vec4(uSun, 0.0)).xyz);
    float d = dot(N, L);
    float dayMix = smoothstep(-0.12, 0.22, d);
    vec3 day = texture2D(uDay, vUv).rgb;
    vec3 night = texture2D(uNight, vUv).rgb;
    vec3 lit = day * (0.10 + max(d, 0.0) * 1.1);
    vec3 dark = night * vec3(1.0, 0.8, 0.5) * 1.5 + day * 0.025;
    vec3 col = mix(dark, lit, dayMix);
    float water = texture2D(uWater, vUv).r;
    vec3 V = normalize(-vP);
    vec3 R = reflect(-L, N);
    float s = pow(max(dot(R, V), 0.0), 260.0) * water * max(d, 0.0);
    col += vec3(0.55, 0.65, 0.8) * s * 0.3;
    col = mix(col, col * vec3(1.4, 0.78, 0.62), uHeat * 0.4 * dayMix);
    gl_FragColor = vec4(col, 1.0);
    #include <colorspace_fragment>
  }`

const cloudFrag = /* glsl */ `
  uniform sampler2D uClouds; uniform vec3 uSun;
  varying vec2 vUv; varying vec3 vN; varying vec3 vP;
  void main() {
    vec3 N = normalize(vN);
    vec3 L = normalize((viewMatrix * vec4(uSun, 0.0)).xyz);
    float light = smoothstep(-0.2, 0.3, dot(N, L));
    float a = texture2D(uClouds, vUv).a;
    gl_FragColor = vec4(vec3(0.06 + 0.94 * light), a * 0.6 * (0.25 + 0.75 * light));
    #include <colorspace_fragment>
  }`

const atmoVert = /* glsl */ `
  varying vec3 vN;
  void main() { vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`
const atmoFrag = /* glsl */ `
  uniform vec3 uColor; varying vec3 vN;
  void main() {
    float i = pow(max(0.55 - dot(vN, vec3(0.0, 0.0, 1.0)), 0.0), 3.2) * 1.5;
    gl_FragColor = vec4(uColor * i, i * 0.9);
  }`

const SUN_DEFAULT = new THREE.Vector3(5, 1.6, 4)
const SUN = SUN_DEFAULT.clone()
const RAD = Math.PI / 180
const TILT = 0.2
const HOME = { lat: 41.3, lon: 64.6 } // O'zbekiston

// Joy (kenglik, uzunlik) -> sfera ustidagi nuqta. Tekstura bilan bir xil xaritalash.
const toVec = (lat, lon, r = 1) => new THREE.Vector3(
  r * Math.cos(lon * RAD) * Math.cos(lat * RAD), r * Math.sin(lat * RAD), -r * Math.sin(lon * RAD) * Math.cos(lat * RAD))
// Joyni kameraga qaratish uchun globusning Y burilishi
const faceY = (lon) => -Math.atan2(Math.cos(lon * RAD), -Math.sin(lon * RAD))
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a))

// Hozirgi vaqtdagi Quyosh holati (taxminiy): quyosh osti uzunligi va og'ishi
function liveSun() {
  const d = new Date()
  const hours = d.getUTCHours() + d.getUTCMinutes() / 60 + d.getUTCSeconds() / 3600
  const doy = (Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()) - Date.UTC(d.getUTCFullYear(), 0, 0)) / 864e5
  const decl = -23.44 * RAD * Math.cos((2 * Math.PI / 365) * (doy + 10))
  return { lon: -(hours - 12) * 15, decl }
}
const COLD = new THREE.Color('#4aa8ff')
const HOT = new THREE.Color('#ff7a45')

function Earth({ heat, pulse, playing, live, spots, focusId, onSpot }) {
  const [day, night, water, clouds] = useTexture([
    tex('earth-blue-marble.jpg'), tex('earth-night.jpg'), tex('earth-water.png'), tex('clouds.webp'),
  ])
  const group = useRef(), cloudRef = useRef(), atmo = useRef(), earthMat = useRef()
  const p = useRef(0), h = useRef(heat)
  const atmoColor = useRef(new THREE.Color())

  useMemo(() => {
    for (const t of [day, night]) { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true }
  }, [day, night])

  const earthUniforms = useMemo(() => ({ uDay: { value: day }, uNight: { value: night }, uWater: { value: water }, uSun: { value: SUN }, uHeat: { value: 0 } }), [day, night, water])
  const cloudUniforms = useMemo(() => ({ uClouds: { value: clouds }, uSun: { value: SUN } }), [clouds])
  const atmoUniforms = useMemo(() => ({ uColor: { value: new THREE.Color(COLD) } }), [])

  useEffect(() => { p.current = 1 }, [pulse])

  useFrame((_, dt) => {
    const speed = reduceMotion ? 0.01 : playing ? 0.32 : 0.06
    const g = group.current
    const spot = spots?.find((x) => x.id === focusId)
    if (live) {
      // Hozirgi kun-tun: O'zbekiston markazda, Quyosh esa haqiqiy tomondan tushadi
      const { lon, decl } = liveSun()
      const k = Math.min(1, dt * 3)
      g.rotation.y += wrap(faceY(HOME.lon) - g.rotation.y) * k
      g.rotation.x += (HOME.lat * RAD * 0.8 - g.rotation.x) * k
      // Quyosh yo'nalishi Yer koordinatasida (quyosh osti nuqtasi), so'ng globusning joriy burilishiga o'tkaziladi
      SUN.copy(toVec(decl / RAD, lon, 6.4)).applyEuler(g.rotation)
    } else {
      SUN.copy(SUN_DEFAULT)
      if (spot) {
        g.rotation.y += wrap(faceY(spot.lon) - g.rotation.y) * Math.min(1, dt * 4)
        g.rotation.x += (spot.lat * RAD * 0.8 - g.rotation.x) * Math.min(1, dt * 4)
      } else {
        g.rotation.y += dt * speed
        g.rotation.x += (TILT - g.rotation.x) * Math.min(1, dt * 2)
      }
    }
    cloudRef.current.rotation.y += dt * speed * 0.2
    group.current.scale.setScalar(1 + 0.018 * p.current)
    p.current = Math.max(0, p.current - dt * 4)
    h.current += (heat - h.current) * Math.min(1, dt * 3)
    earthUniforms.uHeat.value = h.current
    atmoColor.current.copy(COLD).lerp(HOT, h.current * 0.9)
    atmoUniforms.uColor.value.copy(atmoColor.current)
  })

  return (
    <group ref={group} rotation={[0.2, -1.6, 0]}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <shaderMaterial ref={earthMat} vertexShader={earthVert} fragmentShader={earthFrag} uniforms={earthUniforms} />
      </mesh>
      <mesh ref={cloudRef}>
        <sphereGeometry args={[1.012, 64, 64]} />
        <shaderMaterial vertexShader={earthVert} fragmentShader={cloudFrag} uniforms={cloudUniforms} transparent depthWrite={false} />
      </mesh>
      {spots?.map((sp) => (
        <Spot key={sp.id} spot={sp} active={sp.id === focusId} onSpot={onSpot} />
      ))}
      <mesh ref={atmo} scale={1.13}>
        <sphereGeometry args={[1, 48, 48]} />
        <shaderMaterial vertexShader={atmoVert} fragmentShader={atmoFrag} uniforms={atmoUniforms}
          side={THREE.BackSide} transparent blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}

// Globusdagi bosiladigan nuqta
function Spot({ spot, active, onSpot }) {
  const pos = useMemo(() => toVec(spot.lat, spot.lon, 1.012), [spot])
  const quat = useMemo(() => new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), pos.clone().normalize()), [pos])
  const ring = useRef()
  useFrame(({ clock }) => {
    const k = (clock.elapsedTime * 0.9 + spot.id * 0.37) % 1
    ring.current.scale.setScalar(1 + k * 2.4)
    ring.current.material.opacity = (1 - k) * 0.55
  })
  const color = active ? '#ffb454' : '#5ad1ff'
  const handlers = {
    onClick: (e) => { e.stopPropagation(); onSpot(spot.id) },
    onPointerOver: (e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' },
    onPointerOut: () => { document.body.style.cursor = '' },
  }
  return (
    <group position={pos} quaternion={quat}>
      <mesh {...handlers}>
        <sphereGeometry args={[0.055, 12, 12]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh>
        <sphereGeometry args={[active ? 0.026 : 0.019, 16, 16]} />
        <meshBasicMaterial color={color} />
      </mesh>
      <mesh ref={ring}>
        <ringGeometry args={[0.022, 0.03, 32]} />
        <meshBasicMaterial color={color} transparent depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
    </group>
  )
}

export default function Earth3D({ heat = 0, pulse = 0, playing = false, live = false, spots, focusId = null, onSpot, active = true }) {
  return (
    <Canvas camera={{ position: [0, 0, 3.5], fov: 40 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }} frameloop={active ? 'always' : 'demand'}>
      <Stars radius={90} depth={40} count={3500} factor={4} saturation={0} fade speed={0.4} />
      <Suspense fallback={null}>
        <Earth heat={heat} pulse={pulse} playing={playing} live={live} spots={spots} focusId={focusId} onSpot={onSpot} />
      </Suspense>
      <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />
    </Canvas>
  )
}
