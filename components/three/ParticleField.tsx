'use client'

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ---------------------------------------------------------------------------
// Module-level constants & singletons (never re-allocated)
// ---------------------------------------------------------------------------
const PARTICLE_COUNT_DESKTOP = 150
const PARTICLE_COUNT_MOBILE = 60
const CONNECTION_THRESHOLD = 120
const PARTICLE_SPEED = 0.12
const MOUSE_INFLUENCE_RADIUS = 80
const MOUSE_FORCE = 0.18

// Reusable color objects — never re-created inside render or frame loops
const COLOR_GREEN = new THREE.Color('#00ff9d')
const COLOR_BLUE = new THREE.Color('#00f0ff')
const COLOR_SCRATCH = new THREE.Color()

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface ParticleData {
  positions: Float32Array
  velocities: Float32Array
  colors: Float32Array
  count: number
}

// ---------------------------------------------------------------------------
// Inner scene component — must live inside <Canvas>
// ---------------------------------------------------------------------------
function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const linesRef = useRef<THREE.LineSegments>(null)
  // Mouse in world-space units; starts far off-screen
  const mouseRef = useRef<{ x: number; y: number }>({ x: 99999, y: 99999 })

  const { viewport } = useThree()
  // Keep viewport in a ref so useFrame (and mousemove handler) always reads
  // the latest value without being a dependency
  const vpRef = useRef(viewport)
  useEffect(() => {
    vpRef.current = viewport
  }, [viewport])

  // Particle count: fixed once on mount based on device width
  const count = useMemo<number>(
    () =>
      typeof window !== 'undefined' && window.innerWidth < 768
        ? PARTICLE_COUNT_MOBILE
        : PARTICLE_COUNT_DESKTOP,
    [] // intentionally empty — evaluated once
  )

  // Allocate all typed arrays once
  const particleData = useMemo<ParticleData>(() => {
    const vp = vpRef.current
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      positions[i3]     = (Math.random() - 0.5) * vp.width
      positions[i3 + 1] = (Math.random() - 0.5) * vp.height
      positions[i3 + 2] = 0

      velocities[i3]     = (Math.random() - 0.5) * PARTICLE_SPEED
      velocities[i3 + 1] = (Math.random() - 0.5) * PARTICLE_SPEED
      velocities[i3 + 2] = 0

      // Lerp between green and blue for each particle
      const t = Math.random()
      COLOR_SCRATCH.copy(COLOR_GREEN).lerp(COLOR_BLUE, t)
      colors[i3]     = COLOR_SCRATCH.r
      colors[i3 + 1] = COLOR_SCRATCH.g
      colors[i3 + 2] = COLOR_SCRATCH.b
    }

    return { positions, velocities, colors, count }
  }, [count])

  // Working positions buffer mutated every frame (separate from geometry source)
  const positions = useMemo(() => particleData.positions.slice(), [particleData])

  // Points geometry — position attr updated in-place each frame
  const pointsGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage)
    )
    geo.setAttribute('color', new THREE.BufferAttribute(particleData.colors, 3))
    return geo
  }, [positions, particleData.colors])

  const pointsMat = useMemo(
    () =>
      new THREE.PointsMaterial({
        size: 2.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        sizeAttenuation: false,
      }),
    []
  )

  // Lines — pre-allocate maximum possible segments
  const maxSegments = useMemo(() => Math.floor((count * (count - 1)) / 2), [count])

  const linesGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    const linePositions = new Float32Array(maxSegments * 2 * 3)
    const lineColors    = new Float32Array(maxSegments * 2 * 3)
    geo.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3).setUsage(THREE.DynamicDrawUsage)
    )
    geo.setAttribute(
      'color',
      new THREE.BufferAttribute(lineColors, 3).setUsage(THREE.DynamicDrawUsage)
    )
    geo.setDrawRange(0, 0)
    return geo
  }, [maxSegments])

  const linesMat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        opacity: 1,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      }),
    []
  )

  // Global mousemove → world-space coordinates (passive listener for perf)
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const vp = vpRef.current
      mouseRef.current.x =  (e.clientX / window.innerWidth  - 0.5) * vp.width
      mouseRef.current.y = -(e.clientY / window.innerHeight - 0.5) * vp.height
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  // Per-frame simulation
  useFrame(() => {
    const vp    = vpRef.current
    const halfW = vp.width  / 2
    const halfH = vp.height / 2
    const mx    = mouseRef.current.x
    const my    = mouseRef.current.y
    const vel   = particleData.velocities
    const cols  = particleData.colors

    // ── Update positions ──────────────────────────────────────────────────
    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      let px = positions[i3]
      let py = positions[i3 + 1]

      // Mouse repulsion
      const dx   = px - mx
      const dy   = py - my
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < MOUSE_INFLUENCE_RADIUS && dist > 0.001) {
        const force = (1 - dist / MOUSE_INFLUENCE_RADIUS) * MOUSE_FORCE
        vel[i3]     += (dx / dist) * force
        vel[i3 + 1] += (dy / dist) * force
      }

      // Dampen
      vel[i3]     *= 0.98
      vel[i3 + 1] *= 0.98

      // Integrate
      px += vel[i3]
      py += vel[i3 + 1]

      // Edge wrap
      if (px >  halfW) px -= vp.width
      if (px < -halfW) px += vp.width
      if (py >  halfH) py -= vp.height
      if (py < -halfH) py += vp.height

      positions[i3]     = px
      positions[i3 + 1] = py
    }

    // Flush positions to GPU
    const posAttr = pointsGeo.attributes['position'] as THREE.BufferAttribute
    posAttr.needsUpdate = true

    // ── Rebuild line segments ─────────────────────────────────────────────
    const linePosAttr = linesGeo.attributes['position'] as THREE.BufferAttribute
    const lineColAttr = linesGeo.attributes['color']    as THREE.BufferAttribute
    const lp = linePosAttr.array as Float32Array
    const lc = lineColAttr.array as Float32Array

    let segIdx = 0

    for (let i = 0; i < count; i++) {
      const i3 = i * 3
      const ax = positions[i3]
      const ay = positions[i3 + 1]
      const arR = cols[i3]
      const arG = cols[i3 + 1]
      const arB = cols[i3 + 2]

      for (let j = i + 1; j < count; j++) {
        const j3 = j * 3
        const bx = positions[j3]
        const by = positions[j3 + 1]
        const dx = ax - bx
        const dy = ay - by
        const d  = Math.sqrt(dx * dx + dy * dy)

        if (d < CONNECTION_THRESHOLD) {
          const alpha = 1 - d / CONNECTION_THRESHOLD
          const base  = segIdx * 6

          lp[base]     = ax;  lp[base + 1] = ay;  lp[base + 2] = 0
          lp[base + 3] = bx;  lp[base + 4] = by;  lp[base + 5] = 0

          lc[base]     = arR * alpha
          lc[base + 1] = arG * alpha
          lc[base + 2] = arB * alpha
          lc[base + 3] = cols[j3]     * alpha
          lc[base + 4] = cols[j3 + 1] * alpha
          lc[base + 5] = cols[j3 + 2] * alpha

          segIdx++
        }
      }
    }

    linesGeo.setDrawRange(0, segIdx * 2)
    linePosAttr.needsUpdate = true
    lineColAttr.needsUpdate = true
  })

  return (
    <>
      <points ref={pointsRef} geometry={pointsGeo} material={pointsMat} />
      <lineSegments ref={linesRef} geometry={linesGeo} material={linesMat} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Public export — canvas wrapper (transparent bg, fills parent)
// ---------------------------------------------------------------------------
export default function ParticleField() {
  return (
    <Canvas
      orthographic
      camera={{ zoom: 1, position: [0, 0, 100], near: 0.1, far: 1000 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      gl={{ antialias: false, alpha: true }}
      frameloop="always"
      dpr={[1, 1.5]}
    >
      <Particles />
    </Canvas>
  )
}
