'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/useMediaQuery'
import LazyCanvas from './LazyCanvas'

// ─────────────────────────────────────────────────────────────────────────────
// Luminous Pearl — Single breathing sphere, meditative glow
// Mobile: reduced segments, lower DPR
// ─────────────────────────────────────────────────────────────────────────────
function Pearl({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const segs = isMobile ? 24 : 64
  const ringSegs = isMobile ? 48 : 100

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      const breath = Math.sin(t * 0.8) * 0.08 + 1
      meshRef.current.scale.setScalar(breath)
      meshRef.current.rotation.y = t * 0.05
    }

    if (glowRef.current) {
      const glowBreath = Math.sin(t * 0.6 + 1) * 0.12 + 1.4
      glowRef.current.scale.setScalar(glowBreath)
      glowRef.current.rotation.y = t * 0.03
    }
  })

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, segs, segs]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.12} />
      </mesh>

      {/* Inner shell */}
      <mesh>
        <sphereGeometry args={[0.9, segs, segs]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.06} />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, isMobile ? 16 : 32, isMobile ? 16 : 32]} />
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.025}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Floating ring around pearl */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.2, 0.008, isMobile ? 8 : 16, ringSegs]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.08} />
      </mesh>

      {/* Second ring, tilted */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.005, isMobile ? 8 : 16, ringSegs]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.05} />
      </mesh>
    </group>
  )
}

export default function LuminousPearl() {
  const isMobile = useIsMobile()

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <LazyCanvas
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <Pearl isMobile={isMobile} />
      </LazyCanvas>
    </div>
  )
}
