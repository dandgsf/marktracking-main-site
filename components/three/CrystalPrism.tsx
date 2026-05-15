'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Crystal Prism — Faceted glass refractor, architectural clarity
// Represents transparency and data clarity
// ─────────────────────────────────────────────────────────────────────────────
function Prism() {
  const groupRef = useRef<THREE.Group>(null)
  const prismRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)

  // Custom crystal geometry — elongated octahedron
  const crystalGeo = useMemo(() => {
    const geo = new THREE.OctahedronGeometry(1, 0)
    // Elongate vertically
    const pos = geo.attributes.position.array as Float32Array
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] *= 1.8
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.15
      groupRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
    }

    if (prismRef.current) {
      // Subtle breathing
      const breath = Math.sin(t * 0.5) * 0.03 + 1
      prismRef.current.scale.setScalar(breath)
    }

    if (glowRef.current) {
      glowRef.current.rotation.y = t * 0.15
      glowRef.current.rotation.x = Math.sin(t * 0.2) * 0.1
      const glowPulse = Math.sin(t * 0.7) * 0.1 + 1.3
      glowRef.current.scale.setScalar(glowPulse)
    }
  })

  return (
    <group ref={groupRef}>
      {/* Main crystal */}
      <mesh ref={prismRef} geometry={crystalGeo}>
        <meshPhysicalMaterial
          color="#22c55e"
          transparent
          opacity={0.08}
          roughness={0.1}
          metalness={0.1}
          transmission={0.6}
          thickness={1.5}
          ior={1.5}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner core */}
      <mesh scale={[0.5, 0.5, 0.5]}>
        <octahedronGeometry args={[0.8, 0]} />
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Wireframe edges */}
      <mesh geometry={crystalGeo}>
        <meshBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.2}
          wireframe
        />
      </mesh>

      {/* Outer glow */}
      <mesh ref={glowRef} geometry={crystalGeo}>
        <meshBasicMaterial
          color="#4ade80"
          transparent
          opacity={0.02}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Light rays */}
      {Array.from({ length: 4 }).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * 2.5, Math.sin(angle) * 0.5, Math.sin(angle) * 2.5]}
            rotation={[0, angle, Math.PI / 2]}
          >
            <planeGeometry args={[0.3, 3]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.02}
              blending={THREE.AdditiveBlending}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        )
      })}
    </group>
  )
}

export default function CrystalPrism() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 1, 6], fov: 45, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <Prism />
      </Canvas>
    </div>
  )
}
