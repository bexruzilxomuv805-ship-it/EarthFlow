import { Suspense, useMemo, useRef } from 'react'
import FrameKick from './FrameKick'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { vert, marsFrag, venusFrag } from './planetShaders'

const tex = (name) => `${import.meta.env.BASE_URL}textures/${name}`
const reduceMotion = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

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
<FrameKick active={active} />
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
