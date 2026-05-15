'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

// ─────────────────────────────────────────────────────────────────────────────
// COLORS — Emerald family only
// ─────────────────────────────────────────────────────────────────────────────
const C_EMERALD = new THREE.Color('#22c55e')
const C_EMERALD_LIGHT = new THREE.Color('#4ade80')
const C_WHITE = new THREE.Color('#ffffff')

// ─────────────────────────────────────────────────────────────────────────────
// DATA NODES — Connected spheres representing data analysis
// ─────────────────────────────────────────────────────────────────────────────
function DataNodes({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const linesRef = useRef<THREE.LineSegments>(null)

  const NODE_COUNT = 40

  const { positions, connections } = useMemo(() => {
    const pos: THREE.Vector3[] = []
    const conns: [number, number][] = []

    for (let i = 0; i < NODE_COUNT; i++) {
      pos.push(new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 8
      ))
    }

    // Create connections between nearby nodes
    for (let i = 0; i < NODE_COUNT; i++) {
      for (let j = i + 1; j < NODE_COUNT; j++) {
        if (pos[i].distanceTo(pos[j]) < 5) {
          conns.push([i, j])
        }
      }
    }

    return { positions: pos, connections: conns }
  }, [])

  // Create spheres for nodes
  const sphereGeo = useMemo(() => new THREE.SphereGeometry(0.08, 16, 16), [])
  const sphereMat = useMemo(() => new THREE.MeshBasicMaterial({
    color: C_EMERALD,
    transparent: true,
    opacity: 0.7,
  }), [])

  // Create lines geometry
  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const posArr = new Float32Array(connections.length * 2 * 3)
    geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3))
    return geo
  }, [connections])

  const linesMat = useMemo(() => new THREE.LineBasicMaterial({
    color: C_EMERALD,
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    if (groupRef.current) {
      // Parallax: nodes move slower than scroll
      groupRef.current.position.y = scroll * -2
      groupRef.current.rotation.y = t * 0.05 + scroll * 0.3
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.1
    }

    // Update line positions
    if (linesRef.current) {
      const posAttr = linesGeo.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array

      connections.forEach(([a, b], i) => {
        const base = i * 6
        const posA = positions[a]
        const posB = positions[b]

        // Pulsing connection
        const pulse = Math.sin(t * 2 + i * 0.5) * 0.5 + 0.5
        const mid = new THREE.Vector3().lerpVectors(posA, posB, 0.5)
        mid.y += Math.sin(t * 3 + i) * 0.1 * pulse

        arr[base] = posA.x
        arr[base + 1] = posA.y
        arr[base + 2] = posA.z
        arr[base + 3] = posB.x
        arr[base + 4] = posB.y
        arr[base + 5] = posB.z
      })

      posAttr.needsUpdate = true
    }
  })

  return (
    <group ref={groupRef}>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={sphereGeo} material={sphereMat}>
          <meshBasicMaterial
            color={C_EMERALD}
            transparent
            opacity={0.6 + Math.sin(i) * 0.2}
          />
        </mesh>
      ))}
      <lineSegments ref={linesRef} geometry={linesGeo} material={linesMat} />
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DEVOPS RINGS — Rotating torus knots representing CI/CD pipelines
// ─────────────────────────────────────────────────────────────────────────────
function DevOpsRings({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const rings = useMemo(() => [
    { pos: [8, -5, -3] as const, scale: 1.2, speed: 0.3 },
    { pos: [-7, 3, -5] as const, scale: 0.8, speed: 0.5 },
    { pos: [5, 6, -2] as const, scale: 1.0, speed: 0.4 },
    { pos: [-4, -7, -4] as const, scale: 0.6, speed: 0.6 },
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    if (groupRef.current) {
      groupRef.current.position.y = scroll * -3.5
      groupRef.current.rotation.z = scroll * 0.1
    }

    groupRef.current?.children.forEach((child, i) => {
      const ring = rings[i]
      if (ring) {
        child.rotation.x = t * ring.speed
        child.rotation.y = t * ring.speed * 0.7
        const scalePulse = 1 + Math.sin(t * 2 + i) * 0.05
        child.scale.setScalar(ring.scale * scalePulse)
      }
    })
  })

  return (
    <group ref={groupRef}>
      {rings.map((ring, i) => (
        <mesh key={i} position={ring.pos}>
          <torusKnotGeometry args={[0.8, 0.25, 100, 16]} />
          <meshBasicMaterial
            color={C_EMERALD_LIGHT}
            transparent
            opacity={0.12}
            wireframe
          />
        </mesh>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AI CORES — Pulsing icosahedrons representing AI neurons
// ─────────────────────────────────────────────────────────────────────────────
function AICores({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null)
  const cores = useMemo(() => [
    { pos: [0, 0, -6] as const, scale: 1.5 },
    { pos: [-5, 4, -4] as const, scale: 0.8 },
    { pos: [6, -3, -5] as const, scale: 1.0 },
    { pos: [3, 5, -3] as const, scale: 0.6 },
    { pos: [-4, -5, -4] as const, scale: 0.9 },
  ], [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    if (groupRef.current) {
      groupRef.current.position.y = scroll * -1.5
      groupRef.current.rotation.y = t * 0.03
    }

    groupRef.current?.children.forEach((child, i) => {
      const core = cores[i]
      if (core) {
        const pulse = Math.sin(t * 1.5 + i * 1.2) * 0.15 + 1
        child.scale.setScalar(core.scale * pulse)
        child.rotation.x = t * 0.2 + i
        child.rotation.y = t * 0.15 + i * 0.5
      }
    })
  })

  return (
    <group ref={groupRef}>
      {cores.map((core, i) => (
        <mesh key={i} position={core.pos}>
          <icosahedronGeometry args={[1, 1]} />
          <meshBasicMaterial
            color={i === 0 ? C_EMERALD : C_EMERALD_LIGHT}
            transparent
            opacity={i === 0 ? 0.08 : 0.06}
            wireframe
          />
        </mesh>
      ))}
    </group>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PARTICLES — Dust/light motes
// ─────────────────────────────────────────────────────────────────────────────
function FloatingParticles({ scrollProgress }: { scrollProgress: React.MutableRefObject<number> }) {
  const pointsRef = useRef<THREE.Points>(null)
  const COUNT = 300

  const { positions, geo } = useMemo(() => {
    const pos = new Float32Array(COUNT * 3)
    for (let i = 0; i < COUNT; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30
      pos[i * 3 + 1] = (Math.random() - 0.5) * 30
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
    }
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    return { positions: pos, geo: geometry }
  }, [])

  const mat = useMemo(() => new THREE.PointsMaterial({
    color: C_EMERALD_LIGHT,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  }), [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress.current

    if (pointsRef.current) {
      pointsRef.current.position.y = scroll * -0.8
      pointsRef.current.rotation.y = t * 0.02

      const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
      const arr = posAttr.array as Float32Array

      for (let i = 0; i < COUNT; i++) {
        const i3 = i * 3
        arr[i3 + 1] += Math.sin(t * 0.5 + i) * 0.002
      }
      posAttr.needsUpdate = true
    }
  })

  return <points ref={pointsRef} geometry={geo} material={mat} />
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCENE — Orchestrates all layers with scroll parallax
// ─────────────────────────────────────────────────────────────────────────────
function Scene() {
  const scrollProgress = useRef(0)
  const { camera } = useThree()

  useEffect(() => {
    // ScrollTrigger updates the progress value
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        scrollProgress.current = self.progress
      },
    })

    // Camera parallax on mouse move
    const onMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2
      const y = (e.clientY / window.innerHeight - 0.5) * 2
      gsap.to(camera.position, {
        x: x * 0.5,
        y: -y * 0.3,
        duration: 1.5,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [camera])

  return (
    <>
      <ambientLight intensity={0.2} />
      <DataNodes scrollProgress={scrollProgress} />
      <DevOpsRings scrollProgress={scrollProgress} />
      <AICores scrollProgress={scrollProgress} />
      <FloatingParticles scrollProgress={scrollProgress} />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PUBLIC EXPORT — Fixed canvas covering entire page
// ─────────────────────────────────────────────────────────────────────────────
export default function ScrollDrivenScene() {
  return (
    <div
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60, near: 0.1, far: 100 }}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        frameloop="always"
        dpr={[1, 1.5]}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
