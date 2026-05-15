'use client'

import { useEffect, useRef } from 'react'

export default function PipelineVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const canvasCtx = canvas.getContext('2d')!
    if (!canvasCtx) return

    let animationId: number
    const dpr = window.devicePixelRatio || 1

    function resize() {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvasCtx.scale(dpr, dpr)
    }

    resize()

    const nodes = [
      { x: 0.15, y: 0.5, label: '01', color: '#00ff9d', active: true },
      { x: 0.38, y: 0.5, label: '02', color: '#00f0ff', active: false },
      { x: 0.62, y: 0.5, label: '03', color: '#00ff9d', active: false },
      { x: 0.85, y: 0.5, label: '04', color: '#00f0ff', active: false },
    ]

    let time = 0
    let activeNode = 0
    let activeTimer = 0

    function drawNode(node: typeof nodes[0], w: number, h: number) {
      const cx = node.x * w
      const cy = node.y * h
      const isActive = nodes.indexOf(node) === activeNode
      const wasActive = nodes.indexOf(node) <= activeNode

      // Outer glow ring
      if (isActive) {
        const pulse = 1 + Math.sin(time * 3) * 0.15
        canvasCtx.beginPath()
        canvasCtx.arc(cx, cy, 25 * pulse, 0, Math.PI * 2)
        canvasCtx.strokeStyle = `${node.color}30`
        canvasCtx.lineWidth = 2
        canvasCtx.stroke()

        canvasCtx.beginPath()
        canvasCtx.arc(cx, cy, 35 * pulse, 0, Math.PI * 2)
        canvasCtx.strokeStyle = `${node.color}15`
        canvasCtx.lineWidth = 1
        canvasCtx.stroke()
      }

      // Node circle
      canvasCtx.beginPath()
      canvasCtx.arc(cx, cy, 20, 0, Math.PI * 2)
      canvasCtx.fillStyle = wasActive ? `${node.color}20` : 'rgba(255,255,255,0.03)'
      canvasCtx.fill()
      canvasCtx.strokeStyle = wasActive ? node.color : 'rgba(255,255,255,0.1)'
      canvasCtx.lineWidth = wasActive ? 2 : 1
      canvasCtx.stroke()

      // Inner dot
      canvasCtx.beginPath()
      canvasCtx.arc(cx, cy, 6, 0, Math.PI * 2)
      canvasCtx.fillStyle = wasActive ? node.color : 'rgba(255,255,255,0.2)'
      canvasCtx.fill()

      // Label
      canvasCtx.fillStyle = wasActive ? node.color : 'rgba(255,255,255,0.3)'
      canvasCtx.font = `bold ${isActive ? 14 : 12}px monospace`
      canvasCtx.textAlign = 'center'
      canvasCtx.textBaseline = 'middle'
      canvasCtx.fillText(node.label, cx, cy)

      // Status text below
      const statusTexts = ['DISCOVER', 'ARCHITECT', 'BUILD', 'SCALE']
      canvasCtx.fillStyle = wasActive ? node.color : 'rgba(255,255,255,0.15)'
      canvasCtx.font = `bold ${isActive ? 10 : 9}px monospace`
      canvasCtx.fillText(statusTexts[nodes.indexOf(node)], cx, cy + 38)
    }

    function drawConnection(
      from: typeof nodes[0],
      to: typeof nodes[0],
      w: number,
      h: number,
      isActive: boolean
    ) {
      const x1 = from.x * w
      const y1 = from.y * h
      const x2 = to.x * w
      const y2 = to.y * h

      // Connection line
      canvasCtx.beginPath()
      canvasCtx.moveTo(x1 + 22, y1)
      canvasCtx.lineTo(x2 - 22, y2)
      canvasCtx.strokeStyle = isActive
        ? `rgba(0, 255, 157, ${0.2 + Math.sin(time * 2) * 0.1})`
        : 'rgba(255,255,255,0.03)'
      canvasCtx.lineWidth = isActive ? 2 : 1
      canvasCtx.stroke()

      // Energy particles flowing
      if (isActive) {
        for (let i = 0; i < 5; i++) {
          const t = ((time * 0.5 + i * 0.2) % 1)
          const px = x1 + 22 + (x2 - x1 - 44) * t
          const py = y1 + (y2 - y1) * t

          canvasCtx.beginPath()
          canvasCtx.arc(px, py, 3, 0, Math.PI * 2)
          canvasCtx.fillStyle = `rgba(0, 255, 157, ${1 - t})`
          canvasCtx.fill()

          // Particle glow
          canvasCtx.beginPath()
          canvasCtx.arc(px, py, 8, 0, Math.PI * 2)
          canvasCtx.fillStyle = `rgba(0, 255, 157, ${(1 - t) * 0.2})`
          canvasCtx.fill()
        }
      }

      // Arrow head
      if (isActive) {
        const arrowT = 0.5 + Math.sin(time * 2) * 0.05
        const ax = x1 + 22 + (x2 - x1 - 44) * arrowT
        const ay = y1 + (y2 - y1) * arrowT
        canvasCtx.beginPath()
        canvasCtx.moveTo(ax - 6, ay - 4)
        canvasCtx.lineTo(ax, ay)
        canvasCtx.lineTo(ax - 6, ay + 4)
        canvasCtx.strokeStyle = `rgba(0, 255, 157, 0.6)`
        canvasCtx.lineWidth = 1.5
        canvasCtx.stroke()
      }
    }

    function animate() {
      if (!canvas) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      canvasCtx.clearRect(0, 0, w, h)

      time += 0.016
      activeTimer += 0.016

      // Cycle through nodes
      if (activeTimer > 3) {
        activeTimer = 0
        activeNode = (activeNode + 1) % nodes.length
      }

      // Background grid
      canvasCtx.strokeStyle = 'rgba(255,255,255,0.02)'
      canvasCtx.lineWidth = 0.5
      for (let i = 0; i < w; i += 40) {
        canvasCtx.beginPath()
        canvasCtx.moveTo(i, 0)
        canvasCtx.lineTo(i, h)
        canvasCtx.stroke()
      }
      for (let i = 0; i < h; i += 40) {
        canvasCtx.beginPath()
        canvasCtx.moveTo(0, i)
        canvasCtx.lineTo(w, i)
        canvasCtx.stroke()
      }

      // Draw connections
      for (let i = 0; i < nodes.length - 1; i++) {
        drawConnection(nodes[i], nodes[i + 1], w, h, i === activeNode)
      }

      // Draw nodes
      nodes.forEach((node) => drawNode(node, w, h))

      // Central glow
      const gradient = canvasCtx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 3)
      gradient.addColorStop(0, 'rgba(0, 255, 157, 0.02)')
      gradient.addColorStop(1, 'transparent')
      canvasCtx.fillStyle = gradient
      canvasCtx.fillRect(0, 0, w, h)

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="w-full h-48 md:h-64 relative">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ borderRadius: '12px' }}
      />
      <div className="absolute inset-0 pointer-events-none" style={{
        background: 'linear-gradient(180deg, transparent 60%, rgba(5,5,5,0.8) 100%)'
      }} />
    </div>
  )
}
