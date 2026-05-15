'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/useMediaQuery'
import LazyCanvas from './LazyCanvas'

// ─────────────────────────────────────────────────────────────────────────────
// Data Ribbon — Single elegant tube serpentining through space
// Mobile: reduced segments, fewer particles, lower DPR
// ─────────────────────────────────────────────────────────────────────────────
function Ribbon({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const curveSegments = isMobile ? 40 : 80
  const tubeSegments = isMobile ? 50 : 100
  const tubeRadius = isMobile ? 0.03 : 0.04
  const tubeRadialSegments = isMobile ? 6 : 8
  const particleCount = isMobile ? 3 : 6

  const curve = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i <= curveSegments; i++) {
      const t = i / curveSegments
      const angle = t * Math.PI * 3
      const x = Math.sin(angle) * 2.5
      const y = Math.cos(angle * 0.7) * 1.2
      const z = (t - 0.5) * 4
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [curveSegments])

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, tubeSegments, tubeRadius, tubeRadialSegments, false)
  }, [curve, tubeSegments, tubeRadius, tubeRadialSegments])

  const glowGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, tubeSegments, tubeRadius * 3, tubeRadialSegments, false)
  }, [curve, tubeSegments, tubeRadius, tubeRadialSegments])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.05
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.08
      glowRef.current.rotation.z = Math.sin(t * 0.1) * 0.05
      const pulse = Math.sin(t * 1.2) * 0.3 + 0.7
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Core ribbon */}
      <mesh ref={meshRef} geometry={tubeGeo}>
        <meshBasicMaterial color="#22c55e" transparent opacity={0.35} />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} geometry={glowGeo}>
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.04}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Flow particles */}
      {Array.from({ length: particleCount }).map((_, i) => (
        <FlowParticle key={i} curve={curve} index={i} total={particleCount} isMobile={isMobile} />
      ))}
    </group>
  )
}

function FlowParticle({ curve, index, total, isMobile }: { curve: THREE.CatmullRomCurve3; index: number; total: number; isMobile: boolean }) {
  const ref = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const progress = ((t * 0.15 + index / total) % 1)

    if (ref.current) {
      const pos = curve.getPointAt(progress)
      ref.current.position.copy(pos)
      const scale = Math.sin(progress * Math.PI) * 0.5 + 0.3
      ref.current.scale.setScalar(scale)
    }
  })

  return (
    <mesh ref={ref}>
      <sphereGeometry args={[isMobile ? 0.04 : 0.06, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
      <meshBasicMaterial
        color="#4ade80"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  )
}

export default function DataRibbon() {
  const isMobile = useIsMobile()

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <LazyCanvas
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <Ribbon isMobile={isMobile} />
      </LazyCanvas>
    </div>
  )
}
