'use client'

import { useEffect, useRef } from 'react'

export default function FloatingMockups() {
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

    interface FloatingWindow {
      x: number
      y: number
      w: number
      h: number
      vx: number
      vy: number
      opacity: number
      code: string[]
      hue: number
      phase: number
    }

    const windows: FloatingWindow[] = []
    const codeSnippets = [
      ['const pipeline =', '  await createCI(', '    stages: [test,', '    build, deploy]', '  );', '// Deployed ✓'],
      ['function track(', '  event: "purchase",', '  value: 299.00,', '  currency: "BRL"', ');', '// Event fired'],
      ['SELECT channel,', '  SUM(revenue)', 'FROM conversions', 'WHERE date > NOW()', 'GROUP BY channel;', '// 3.4x ROAS'],
      ['docker build -t', '  marktracking/api', 'docker push', '  registry.io/mt', '// Image built'],
    ]

    for (let i = 0; i < 4; i++) {
      windows.push({
        x: Math.random() * 300 + 50,
        y: Math.random() * 200 + 50,
        w: 180,
        h: 120,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        opacity: Math.random() * 0.3 + 0.1,
        code: codeSnippets[i],
        hue: i % 2 === 0 ? 160 : 180,
        phase: Math.random() * Math.PI * 2,
      })
    }

    let time = 0

    function drawWindow(win: FloatingWindow) {
      const { x, y, w, h, opacity, code, hue } = win

      // Window background
      canvasCtx.fillStyle = `rgba(10, 12, 20, ${opacity})`
      canvasCtx.fillRect(x, y, w, h)

      // Window border
      canvasCtx.strokeStyle = `hsla(${hue}, 100%, 60%, ${opacity * 0.5})`
      canvasCtx.lineWidth = 1
      canvasCtx.strokeRect(x, y, w, h)

      // Title bar
      canvasCtx.fillStyle = `hsla(${hue}, 100%, 60%, ${opacity * 0.2})`
      canvasCtx.fillRect(x, y, w, 20)

      // Window controls
      const colors = ['#ff5f56', '#ffbd2e', '#27c93f']
      colors.forEach((c, i) => {
        canvasCtx.beginPath()
        canvasCtx.arc(x + 12 + i * 14, y + 10, 3, 0, Math.PI * 2)
        canvasCtx.fillStyle = `${c}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
        canvasCtx.fill()
      })

      // Code lines
      canvasCtx.font = '9px monospace'
      code.forEach((line, i) => {
        canvasCtx.fillStyle = `hsla(${hue}, 80%, 70%, ${opacity * 0.7})`
        canvasCtx.fillText(line, x + 10, y + 38 + i * 14)
      })

      // Glow effect
      canvasCtx.shadowColor = `hsla(${hue}, 100%, 50%, ${opacity * 0.3})`
      canvasCtx.shadowBlur = 20
      canvasCtx.strokeRect(x, y, w, h)
      canvasCtx.shadowBlur = 0
    }

    function animate() {
      if (!canvas) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      canvasCtx.clearRect(0, 0, w, h)
      time += 0.016

      windows.forEach((win) => {
        // Float movement
        win.x += win.vx + Math.sin(time + win.phase) * 0.2
        win.y += win.vy + Math.cos(time * 0.7 + win.phase) * 0.15

        // Bounce off walls
        if (win.x < 0 || win.x + win.w > w) win.vx *= -1
        if (win.y < 0 || win.y + win.h > h) win.vy *= -1

        // Keep in bounds
        win.x = Math.max(0, Math.min(w - win.w, win.x))
        win.y = Math.max(0, Math.min(h - win.h, win.y))

        drawWindow(win)
      })

      // Connection lines between windows
      for (let i = 0; i < windows.length - 1; i++) {
        const a = windows[i]
        const b = windows[i + 1]

        canvasCtx.beginPath()
        canvasCtx.moveTo(a.x + a.w / 2, a.y + a.h / 2)
        canvasCtx.lineTo(b.x + b.w / 2, b.y + b.h / 2)
        canvasCtx.strokeStyle = `rgba(0, 255, 157, ${0.05 + Math.sin(time * 2) * 0.03})`
        canvasCtx.lineWidth = 0.5
        canvasCtx.stroke()
      }

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full opacity-40"
      />
    </div>
  )
}
