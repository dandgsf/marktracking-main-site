'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Topographic Terrain — Wireframe relief map, Apple/Stripe keynote style
// Represents user journey and metric landscapes
// ─────────────────────────────────────────────────────────────────────────────
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)

  const { planeGeo, wireGeo } = useMemo(() => {
    const segments = 60
    const geo = new THREE.PlaneGeometry(8, 6, segments, segments)

    // Simple noise-like displacement
    const posAttr = geo.attributes.position
    const positions = posAttr.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      // Multi-octave pseudo-noise
      const z =
        Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.4 +
        Math.sin(x * 1.5 + 1) * Math.cos(y * 1.2 + 2) * 0.2 +
        Math.sin(x * 3 + 3) * Math.cos(y * 2.5 + 1) * 0.08
      positions[i + 2] = z
    }

    geo.computeVertexNormals()

    const wireGeometry = new THREE.WireframeGeometry(geo)

    return { planeGeo: geo, wireGeo: wireGeometry }
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (meshRef.current) {
      meshRef.current.rotation.z = t * 0.02
      meshRef.current.rotation.x = -Math.PI / 2.5 + Math.sin(t * 0.1) * 0.05
    }

    if (wireRef.current) {
      wireRef.current.rotation.z = t * 0.02
      wireRef.current.rotation.x = -Math.PI / 2.5 + Math.sin(t * 0.1) * 0.05
    }
  })

  return (
    <group>
      {/* Filled surface — very subtle */}
      <mesh ref={meshRef} geometry={planeGeo} rotation={[-Math.PI / 2.5, 0, 0]}>
        <meshBasicMaterial
          color="#050505"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Wireframe */}
      <lineSegments ref={wireRef} geometry={wireGeo} rotation={[-Math.PI / 2.5, 0, 0]}>
        <lineBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.12}
        />
      </lineSegments>

      {/* Elevation markers — dots at peaks */}
      {[
        { x: 1.2, y: 0.8, z: 0.6 },
        { x: -1.5, y: -0.5, z: 0.4 },
        { x: 0.3, y: 1.5, z: 0.5 },
        { x: -0.8, y: -1.2, z: 0.35 },
      ].map((peak, i) => (
        <mesh key={i} position={[peak.x, peak.y, peak.z]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial
            color="#4ade80"
            transparent
            opacity={0.4}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function TopographicTerrain() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 3, 6], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <Terrain />
      </Canvas>
    </div>
  )
}
