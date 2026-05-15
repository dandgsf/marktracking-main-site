'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Luminous Pearl — Single breathing sphere, meditative glow
// ─────────────────────────────────────────────────────────────────────────────
function Pearl() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  const material = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#22c55e',
      transparent: true,
      opacity: 0.15,
    })
  }, [])

  const glowMaterial = useMemo(() => {
    return new THREE.MeshBasicMaterial({
      color: '#4ade80',
      transparent: true,
      opacity: 0.03,
    })
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      // Gentle breathing scale
      const breath = Math.sin(t * 0.8) * 0.08 + 1
      meshRef.current.scale.setScalar(breath)
      meshRef.current.rotation.y = t * 0.05
    }

    if (glowRef.current) {
      // Outer glow breathes out of phase
      const glowBreath = Math.sin(t * 0.6 + 1) * 0.12 + 1.4
      glowRef.current.scale.setScalar(glowBreath)
      glowRef.current.rotation.y = t * 0.03
    }
  })

  return (
    <group>
      {/* Core sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[1.2, 64, 64]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.12} />
      </mesh>

      {/* Inner shell — slightly smaller, denser */}
      <mesh>
        <sphereGeometry args={[0.9, 64, 64]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.06} />
      </mesh>

      {/* Outer glow halo */}
      <mesh ref={glowRef}>
        <sphereGeometry args={[1.6, 32, 32]} />
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
        <torusGeometry args={[2.2, 0.008, 16, 100]} />
        <meshBasicMaterial color="#22c55e" transparent opacity={0.08} />
      </mesh>

      {/* Second ring, tilted */}
      <mesh rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.5, 0.005, 16, 100]} />
        <meshBasicMaterial color="#4ade80" transparent opacity={0.05} />
      </mesh>
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Public export — section-scoped 3D background
// ─────────────────────────────────────────────────────────────────────────────
export default function LuminousPearl() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 6], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <Pearl />
      </Canvas>
    </div>
  )
}
