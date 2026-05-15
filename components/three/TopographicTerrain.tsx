'use client'

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useIsMobile } from '@/hooks/useMediaQuery'
import LazyCanvas from './LazyCanvas'

// ─────────────────────────────────────────────────────────────────────────────
// Topographic Terrain — Wireframe relief map, Apple/Stripe keynote style
// Mobile: reduced segments, fewer markers, lower DPR
// ─────────────────────────────────────────────────────────────────────────────
function Terrain({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const wireRef = useRef<THREE.LineSegments>(null)

  const { planeGeo, wireGeo } = useMemo(() => {
    const segments = isMobile ? 30 : 60
    const geo = new THREE.PlaneGeometry(8, 6, segments, segments)

    const posAttr = geo.attributes.position
    const positions = posAttr.array as Float32Array

    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i]
      const y = positions[i + 1]
      const z =
        Math.sin(x * 0.8) * Math.cos(y * 0.6) * 0.4 +
        Math.sin(x * 1.5 + 1) * Math.cos(y * 1.2 + 2) * 0.2 +
        Math.sin(x * 3 + 3) * Math.cos(y * 2.5 + 1) * 0.08
      positions[i + 2] = z
    }

    geo.computeVertexNormals()
    const wireGeometry = new THREE.WireframeGeometry(geo)
    return { planeGeo: geo, wireGeo: wireGeometry }
  }, [isMobile])

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

  const markers = isMobile
    ? [
        { x: 1.2, y: 0.8, z: 0.6 },
        { x: -1.5, y: -0.5, z: 0.4 },
      ]
    : [
        { x: 1.2, y: 0.8, z: 0.6 },
        { x: -1.5, y: -0.5, z: 0.4 },
        { x: 0.3, y: 1.5, z: 0.5 },
        { x: -0.8, y: -1.2, z: 0.35 },
      ]

  return (
    <group>
      <mesh ref={meshRef} geometry={planeGeo} rotation={[-Math.PI / 2.5, 0, 0]}>
        <meshBasicMaterial
          color="#050505"
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
        />
      </mesh>

      <lineSegments ref={wireRef} geometry={wireGeo} rotation={[-Math.PI / 2.5, 0, 0]}>
        <lineBasicMaterial
          color="#22c55e"
          transparent
          opacity={0.12}
        />
      </lineSegments>

      {markers.map((peak, i) => (
        <mesh key={i} position={[peak.x, peak.y, peak.z]}>
          <sphereGeometry args={[0.04, isMobile ? 8 : 16, isMobile ? 8 : 16]} />
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
  const isMobile = useIsMobile()

  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <LazyCanvas
        camera={{ position: [0, 3, 6], fov: 50, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: !isMobile, alpha: true, powerPreference: 'low-power' }}
        dpr={isMobile ? [1, 1] : [1, 1.5]}
      >
        <Terrain isMobile={isMobile} />
      </LazyCanvas>
    </div>
  )
}
