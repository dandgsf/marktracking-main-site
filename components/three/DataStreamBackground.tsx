'use client'

import { useEffect, useRef } from 'react'

interface Stream {
  x: number
  y: number
  z: number
  speed: number
  length: number
  opacity: number
  width: number
  hue: number
}

interface Particle {
  x: number
  y: number
  z: number
  vx: number
  vy: number
  vz: number
  life: number
  maxLife: number
  size: number
  hue: number
}

export default function DataStreamBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const canvasCtx = canvas.getContext('2d')!
    if (!canvasCtx) return

    let animationId: number
    let width = 0
    let height = 0

    const streams: Stream[] = []
    const particles: Particle[] = []
    const centerX = () => width / 2
    const centerY = () => height / 2

    // Tech characters for data rain effect
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'

    function resize() {
      if (!canvas) return
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    function createStream(): Stream {
      const angle = Math.random() * Math.PI * 2
      const distance = Math.random() * 800 + 200
      return {
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        z: Math.random() * 2000 + 500,
        speed: Math.random() * 8 + 4,
        length: Math.random() * 150 + 50,
        opacity: Math.random() * 0.6 + 0.2,
        width: Math.random() * 2 + 0.5,
        hue: Math.random() > 0.5 ? 160 : 180, // Green or cyan
      }
    }

    function createParticle(): Particle {
      const angle = Math.random() * Math.PI * 2
      const dist = Math.random() * 600 + 100
      return {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist,
        z: Math.random() * 3000 + 1000,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        vz: -Math.random() * 15 - 5,
        life: 0,
        maxLife: Math.random() * 60 + 30,
        size: Math.random() * 3 + 1,
        hue: Math.random() > 0.5 ? 160 : 180,
      }
    }

    // Initialize
    resize()
    for (let i = 0; i < 60; i++) streams.push(createStream())
    for (let i = 0; i < 40; i++) particles.push(createParticle())

    function project(x: number, y: number, z: number) {
      const fov = 800
      const scale = fov / (fov + z)
      return {
        x: centerX() + x * scale,
        y: centerY() + y * scale,
        scale,
      }
    }

    function drawStream(stream: Stream) {
      const start = project(stream.x, stream.y, stream.z)
      const end = project(
        stream.x,
        stream.y + stream.length,
        stream.z - stream.length * 2
      )

      if (start.scale < 0 || end.scale < 0) return

      const gradient = canvasCtx.createLinearGradient(start.x, start.y, end.x, end.y)
      const hue = stream.hue
      gradient.addColorStop(0, `hsla(${hue}, 100%, 50%, 0)`)
      gradient.addColorStop(0.3, `hsla(${hue}, 100%, 60%, ${stream.opacity * 0.3})`)
      gradient.addColorStop(0.7, `hsla(${hue}, 100%, 70%, ${stream.opacity * 0.6})`)
      gradient.addColorStop(1, `hsla(${hue}, 100%, 80%, ${stream.opacity})`)

      canvasCtx.beginPath()
      canvasCtx.moveTo(start.x, start.y)
      canvasCtx.lineTo(end.x, end.y)
      canvasCtx.strokeStyle = gradient
      canvasCtx.lineWidth = stream.width * start.scale
      canvasCtx.lineCap = 'round'
      canvasCtx.stroke()

      // Data characters along the stream
      const charCount = Math.floor(stream.length / 20)
      for (let i = 0; i < charCount; i++) {
        const t = i / charCount
        const cx = stream.x
        const cy = stream.y + t * stream.length
        const cz = stream.z - t * stream.length * 2
        const pos = project(cx, cy, cz)

        if (pos.scale > 0.1) {
          canvasCtx.fillStyle = `hsla(${hue}, 100%, 70%, ${stream.opacity * (1 - t) * pos.scale})`
          canvasCtx.font = `${Math.max(8, 14 * pos.scale)}px monospace`
          canvasCtx.fillText(
            chars[Math.floor(Math.random() * chars.length)],
            pos.x,
            pos.y
          )
        }
      }

      // Head glow
      canvasCtx.beginPath()
      canvasCtx.arc(end.x, end.y, 4 * end.scale, 0, Math.PI * 2)
      canvasCtx.fillStyle = `hsla(${hue}, 100%, 80%, ${stream.opacity * 0.8})`
      canvasCtx.fill()
    }

    function drawParticle(p: Particle) {
      const pos = project(p.x, p.y, p.z)
      if (pos.scale < 0) return

      const lifeRatio = p.life / p.maxLife
      const alpha = Math.sin(lifeRatio * Math.PI) * 0.8

      canvasCtx.beginPath()
      canvasCtx.arc(pos.x, pos.y, p.size * pos.scale, 0, Math.PI * 2)
      canvasCtx.fillStyle = `hsla(${p.hue}, 100%, 70%, ${alpha})`
      canvasCtx.fill()

      // Glow
      const glowSize = p.size * 4 * pos.scale
      const gradient = canvasCtx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, glowSize)
      gradient.addColorStop(0, `hsla(${p.hue}, 100%, 60%, ${alpha * 0.3})`)
      gradient.addColorStop(1, `hsla(${p.hue}, 100%, 60%, 0)`)
      canvasCtx.beginPath()
      canvasCtx.arc(pos.x, pos.y, glowSize, 0, Math.PI * 2)
      canvasCtx.fillStyle = gradient
      canvasCtx.fill()
    }

    function drawGrid() {
      const gridSize = 100
      const gridCount = 20
      const fov = 800

      for (let i = -gridCount; i <= gridCount; i++) {
        // Horizontal lines
        const y1 = i * gridSize
        const start1 = project(-gridCount * gridSize, y1, 2000)
        const end1 = project(gridCount * gridSize, y1, 2000)

        if (start1.scale > 0 && end1.scale > 0) {
          canvasCtx.beginPath()
          canvasCtx.moveTo(start1.x, start1.y)
          canvasCtx.lineTo(end1.x, end1.y)
          canvasCtx.strokeStyle = `hsla(160, 100%, 50%, ${0.03 * start1.scale})`
          canvasCtx.lineWidth = 0.5
          canvasCtx.stroke()
        }

        // Vertical lines
        const x1 = i * gridSize
        const start2 = project(x1, -gridCount * gridSize, 2000)
        const end2 = project(x1, gridCount * gridSize, 2000)

        if (start2.scale > 0 && end2.scale > 0) {
          canvasCtx.beginPath()
          canvasCtx.moveTo(start2.x, start2.y)
          canvasCtx.lineTo(end2.x, end2.y)
          canvasCtx.strokeStyle = `hsla(160, 100%, 50%, ${0.03 * start2.scale})`
          canvasCtx.lineWidth = 0.5
          canvasCtx.stroke()
        }
      }
    }

    function animate() {
      canvasCtx.fillStyle = 'rgba(5, 5, 5, 0.15)'
      canvasCtx.fillRect(0, 0, width, height)

      // Draw perspective grid
      drawGrid()

      // Update and draw streams
      streams.forEach((stream) => {
        stream.z -= stream.speed
        if (stream.z < -fov) {
          Object.assign(stream, createStream())
          stream.z = 3000
        }
        drawStream(stream)
      })

      // Update and draw particles
      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy
        p.z += p.vz
        p.life++

        if (p.life >= p.maxLife || p.z < -fov) {
          Object.assign(p, createParticle())
        }

        drawParticle(p)
      })

      // Central glow
      const centerGlow = canvasCtx.createRadialGradient(
        centerX(), centerY(), 0,
        centerX(), centerY(), 300
      )
      centerGlow.addColorStop(0, 'hsla(160, 100%, 50%, 0.05)')
      centerGlow.addColorStop(0.5, 'hsla(180, 100%, 50%, 0.02)')
      centerGlow.addColorStop(1, 'transparent')
      canvasCtx.fillStyle = centerGlow
      canvasCtx.fillRect(0, 0, width, height)

      animationId = requestAnimationFrame(animate)
    }

    const fov = 800
    window.addEventListener('resize', resize)
    animate()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#050505' }}
    />
  )
}
