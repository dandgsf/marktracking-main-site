'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Data Ribbon — Single elegant tube serpentining through space
// Represents CI/CD pipeline flow
// ─────────────────────────────────────────────────────────────────────────────
function Ribbon() {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Create a smooth 3D curve
  const curve = useMemo(() => {
    const points: THREE.Vector3[] = []
    const segments = 80
    for (let i = 0; i <= segments; i++) {
      const t = i / segments
      const angle = t * Math.PI * 3
      const x = Math.sin(angle) * 2.5
      const y = Math.cos(angle * 0.7) * 1.2
      const z = (t - 0.5) * 4
      points.push(new THREE.Vector3(x, y, z))
    }
    return new THREE.CatmullRomCurve3(points)
  }, [])

  const tubeGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.04, 8, false)
  }, [curve])

  const glowGeo = useMemo(() => {
    return new THREE.TubeGeometry(curve, 100, 0.12, 8, false)
  }, [curve])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.08
      meshRef.current.rotation.z = Math.sin(t * 0.1) * 0.05
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.08
      glowRef.current.rotation.z = Math.sin(t * 0.1) * 0.05
      // Pulse the glow
      const pulse = Math.sin(t * 1.2) * 0.3 + 0.7
      glowRef.current.scale.setScalar(pulse)
    }
  })

  return (
    <group>
      {/* Core ribbon */}
      <mesh ref={meshRef} geometry={tubeGeo}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.35}
        />
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

      {/* Flow particles along the curve */}
      {Array.from({ length: 6 }).map((_, i) => (
        <FlowParticle key={i} curve={curve} index={i} total={6} />
      ))}
    </group>
  )
}

function FlowParticle({ curve, index, total }: { curve: THREE.CatmullRomCurve3; index: number; total: number }) {
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
      <sphereGeometry args={[0.06, 16, 16]} />
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
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <Ribbon />
      </Canvas>
    </div>
  )
}
