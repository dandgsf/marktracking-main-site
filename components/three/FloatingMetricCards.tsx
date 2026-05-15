'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// ─────────────────────────────────────────────────────────────────────────────
// Floating Metric Cards — Isometric glass cards with micro-float
// ─────────────────────────────────────────────────────────────────────────────
function MetricCards() {
  const groupRef = useRef<THREE.Group>(null)

  const cards = useMemo(() => [
    { pos: [-1.5, 0.5, -0.5] as const, rot: [0.3, -0.4, 0.1] as const, scale: 1 },
    { pos: [0, -0.3, 0.5] as const, rot: [0.2, 0.3, -0.1] as const, scale: 1.1 },
    { pos: [1.8, 0.8, -1] as const, rot: [-0.2, 0.5, 0.2] as const, scale: 0.9 },
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.children.forEach((child, i) => {
        const card = cards[i]
        if (card) {
          // Gentle floating
          child.position.y = card.pos[1] + Math.sin(t * 0.6 + i * 2) * 0.08
          child.rotation.x = card.rot[0] + Math.sin(t * 0.3 + i) * 0.02
          child.rotation.y = card.rot[1] + Math.cos(t * 0.2 + i * 1.5) * 0.02
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {cards.map((card, i) => (
        <group key={i} position={card.pos} rotation={card.rot} scale={card.scale}>
          {/* Card face */}
          <mesh>
            <boxGeometry args={[1.4, 0.9, 0.04]} />
            <meshBasicMaterial
              color="#0a0a0a"
              transparent
              opacity={0.6}
            />
          </mesh>

          {/* Card border glow */}
          <mesh scale={[1.01, 1.01, 1.01]}>
            <boxGeometry args={[1.4, 0.9, 0.04]} />
            <meshBasicMaterial
              color="#22c55e"
              transparent
              opacity={0.08}
              wireframe
            />
          </mesh>

          {/* Top accent line */}
          <mesh position={[0, 0.38, 0.025]}>
            <boxGeometry args={[0.4, 0.015, 0.005]} />
            <meshBasicMaterial color="#22c55e" transparent opacity={0.5} />
          </mesh>

          {/* Mini bar chart visualization */}
          {[
            { x: -0.35, h: 0.15 },
            { x: -0.15, h: 0.25 },
            { x: 0.05, h: 0.12 },
            { x: 0.25, h: 0.3 },
            { x: 0.45, h: 0.2 },
          ].map((bar, j) => (
            <mesh key={j} position={[bar.x, -0.1 + bar.h / 2, 0.025]}>
              <boxGeometry args={[0.06, bar.h, 0.005]} />
              <meshBasicMaterial
                color={j === 3 ? '#4ade80' : '#22c55e'}
                transparent
                opacity={0.3}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function FloatingMetricCards() {
  return (
    <div
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45, near: 0.1, far: 50 }}
        style={{ background: 'transparent' }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <MetricCards />
      </Canvas>
    </div>
  )
}
