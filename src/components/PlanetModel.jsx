import { Suspense, useMemo, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Stars, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import FrameKick from './FrameKick'
import ErrorBoundary from './ErrorBoundary'
import { useNearScreen } from '../hooks/useNearScreen'
import { PLANETS } from '../data/planets'
import { vert, marsFrag, venusFrag, mercuryFrag, jupiterFrag, saturnFrag, uranusFrag, neptuneFrag, ringVert, ringFrag } from './planetShaders'

const tex = (name) => `${import.meta.env.BASE_URL}textures/${name}`

const SHADERS = { mercury: mercuryFrag, venus: venusFrag, mars: marsFrag, jupiter: jupiterFrag, saturn: saturnFrag, uranus: uranusFrag, neptune: neptuneFrag }
const GLOW = { mercury: '#b9b3ac', venus: '#ffcf70', mars: '#ff8a5c', jupiter: '#e0b080', saturn: '#f0d9a0', uranus: '#8fe8ee', neptune: '#5d86ff' }
// Aylanish tezligi (radian/s, ko'rsatish uchun): Venera va Uran teskari/yonboshlab
const SPIN = { mercury: 0.05, venus: -0.04, earth: 0.2, mars: 0.2, jupiter: 0.45, saturn: 0.4, uranus: -0.3, neptune: 0.3 }

function Earth() {
  const [day, clouds] = useTexture([tex('earth-blue-marble.jpg'), tex('clouds.webp')])
  useMemo(() => { day.colorSpace = THREE.SRGBColorSpace; day.anisotropy = 4 }, [day])
  return (
    <>
      <mesh>
        <sphereGeometry args={[1, 96, 96]} />
        <meshStandardMaterial map={day} roughness={0.85} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.012, 96, 96]} />
        <meshStandardMaterial map={clouds} transparent opacity={0.55} depthWrite={false} roughness={1} />
      </mesh>
      <mesh scale={1.08}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#5ab4ff" transparent opacity={0.12} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  )
}

function Shaded({ id }) {
  const mat = useMemo(() => new THREE.ShaderMaterial({ vertexShader: vert, fragmentShader: SHADERS[id], uniforms: { uTime: { value: 0 } } }), [id])
  useFrame(({ clock }) => { mat.uniforms.uTime.value = clock.elapsedTime })
  return (
    <>
      <mesh material={mat}><sphereGeometry args={[1, 96, 96]} /></mesh>
      <mesh scale={1.06}>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color={GLOW[id]} transparent opacity={0.13} side={THREE.BackSide} depthWrite={false} />
      </mesh>
    </>
  )
}

function Rings() {
  const uniforms = useMemo(() => ({ uIn: { value: 1.25 }, uOut: { value: 2.3 } }), [])
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]}>
      <ringGeometry args={[1.25, 2.3, 160, 1]} />
      <shaderMaterial vertexShader={ringVert} fragmentShader={ringFrag} uniforms={uniforms} transparent side={THREE.DoubleSide} depthWrite={false} />
    </mesh>
  )
}

function Body({ id }) {
  const spin = useRef()
  const tilt = THREE.MathUtils.degToRad(PLANETS[id].tilt)
  useFrame((_, dt) => { if (spin.current) spin.current.rotation.y += dt * SPIN[id] })
  return (
    <group rotation={[0.12, 0, id === 'uranus' ? tilt : tilt * 0.9]}>
      <group ref={spin}>{id === 'earth' ? <Earth /> : <Shaded id={id} />}</group>
      {id === 'saturn' && <Rings />}
    </group>
  )
}

// Sayyoraning 3D modeli: sichqoncha/barmoq bilan aylantirish va yaqinlashtirish
export default function PlanetModel({ id, label }) {
  const [ref, near, visible] = useNearScreen()
  const far = id === 'saturn' ? 6.4 : 3.6
  return (
    <div className="pm-stage glass" ref={ref} role="img" aria-label={label}>
      {near && (
        <ErrorBoundary fallback={null}>
          <Canvas camera={{ position: [0, 0.2, far], fov: 36 }} dpr={[1, 1.75]} gl={{ antialias: true, alpha: true }} frameloop={visible ? 'always' : 'demand'}>
            <FrameKick active={visible} />
            <ambientLight intensity={0.35} />
            <directionalLight position={[-2.2, 1.4, 3]} intensity={2.6} />
            <Stars radius={30} depth={20} count={900} factor={2.2} fade speed={0.4} />
            <Suspense fallback={null}>
              <Body id={id} />
            </Suspense>
            <OrbitControls enablePan={false} minDistance={far * 0.6} maxDistance={far * 1.8} rotateSpeed={0.6} />
          </Canvas>
        </ErrorBoundary>
      )}
    </div>
  )
}
