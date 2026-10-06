import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'

// 3D sahna ekranga kirganda chizish aniq yoqiladi (ayrim holatlarda "frameloop" prop'i o'zgarsa ham chizish boshlanmay qolardi)
export default function FrameKick({ active }) {
  const invalidate = useThree((s) => s.invalidate)
  const setFrameloop = useThree((s) => s.setFrameloop)
  useEffect(() => {
    setFrameloop(active ? 'always' : 'demand')
    invalidate()
  }, [active, setFrameloop, invalidate])
  return null
}
