'use client'

import { useEffect, useRef } from 'react'

interface DashboardPreviewProps {
  variant: 'roas' | 'funnel' | 'experiment'
}

export default function DashboardPreview({ variant }: DashboardPreviewProps) {
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

    const dataPoints: number[] = []
    const maxPoints = 50
    for (let i = 0; i < maxPoints; i++) {
      dataPoints.push(Math.random() * 0.5 + 0.3)
    }

    let time = 0

    function drawROAS() {
      if (!canvas) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      canvasCtx.clearRect(0, 0, w, h)

      // Background
      canvasCtx.fillStyle = 'rgba(10, 10, 15, 0.9)'
      canvasCtx.fillRect(0, 0, w, h)

      // Border glow
      canvasCtx.strokeStyle = 'rgba(0, 255, 157, 0.2)'
      canvasCtx.lineWidth = 1
      canvasCtx.strokeRect(0, 0, w, h)

      // Title
      canvasCtx.fillStyle = '#00ff9d'
      canvasCtx.font = 'bold 11px monospace'
      canvasCtx.fillText('ROAS TRACKING', 12, 20)

      // Time
      canvasCtx.fillStyle = 'rgba(255,255,255,0.3)'
      canvasCtx.font = '9px monospace'
      canvasCtx.fillText(new Date().toLocaleTimeString(), w - 70, 20)

      // Grid
      canvasCtx.strokeStyle = 'rgba(255,255,255,0.03)'
      canvasCtx.lineWidth = 0.5
      for (let i = 0; i < 5; i++) {
        const y = 40 + (i * (h - 60)) / 4
        canvasCtx.beginPath()
        canvasCtx.moveTo(12, y)
        canvasCtx.lineTo(w - 12, y)
        canvasCtx.stroke()
      }

      // Update data
      time += 0.02
      dataPoints.shift()
      const baseValue = variant === 'roas' ? 3.4 : variant === 'funnel' ? 0.95 : 0.8
      const noise = Math.sin(time) * 0.1 + Math.random() * 0.05
      dataPoints.push(baseValue + noise)

      // Draw line chart
      const chartH = h - 60
      const chartW = w - 24
      const stepX = chartW / (maxPoints - 1)

      canvasCtx.beginPath()
      canvasCtx.moveTo(12, 40 + chartH * (1 - dataPoints[0]))

      for (let i = 1; i < dataPoints.length; i++) {
        const x = 12 + i * stepX
        const y = 40 + chartH * (1 - dataPoints[i])
        canvasCtx.lineTo(x, y)
      }

      canvasCtx.strokeStyle = '#00ff9d'
      canvasCtx.lineWidth = 2
      canvasCtx.stroke()

      // Fill area under line
      canvasCtx.lineTo(12 + chartW, 40 + chartH)
      canvasCtx.lineTo(12, 40 + chartH)
      canvasCtx.closePath()
      canvasCtx.fillStyle = 'rgba(0, 255, 157, 0.08)'
      canvasCtx.fill()

      // Draw dots at peaks
      for (let i = 0; i < dataPoints.length; i += 8) {
        const x = 12 + i * stepX
        const y = 40 + chartH * (1 - dataPoints[i])
        canvasCtx.beginPath()
        canvasCtx.arc(x, y, 3, 0, Math.PI * 2)
        canvasCtx.fillStyle = '#00ff9d'
        canvasCtx.fill()
        canvasCtx.beginPath()
        canvasCtx.arc(x, y, 6, 0, Math.PI * 2)
        canvasCtx.fillStyle = 'rgba(0, 255, 157, 0.2)'
        canvasCtx.fill()
      }

      // Metric box
      canvasCtx.fillStyle = 'rgba(0, 255, 157, 0.1)'
      canvasCtx.fillRect(12, h - 35, 80, 22)
      canvasCtx.strokeStyle = 'rgba(0, 255, 157, 0.3)'
      canvasCtx.lineWidth = 1
      canvasCtx.strokeRect(12, h - 35, 80, 22)
      canvasCtx.fillStyle = '#00ff9d'
      canvasCtx.font = 'bold 12px monospace'
      const currentVal = (dataPoints[dataPoints.length - 1] * 100).toFixed(0)
      canvasCtx.fillText(`${currentVal}%`, 18, h - 20)

      // Animated pulse dot
      const pulseScale = 1 + Math.sin(time * 3) * 0.3
      canvasCtx.beginPath()
      canvasCtx.arc(w - 20, h - 24, 4 * pulseScale, 0, Math.PI * 2)
      canvasCtx.fillStyle = '#00ff9d'
      canvasCtx.fill()
      canvasCtx.beginPath()
      canvasCtx.arc(w - 20, h - 24, 8 * pulseScale, 0, Math.PI * 2)
      canvasCtx.fillStyle = 'rgba(0, 255, 157, 0.2)'
      canvasCtx.fill()

      animationId = requestAnimationFrame(drawROAS)
    }

    function drawFunnel() {
      if (!canvas) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      canvasCtx.clearRect(0, 0, w, h)

      canvasCtx.fillStyle = 'rgba(10, 10, 15, 0.9)'
      canvasCtx.fillRect(0, 0, w, h)

      canvasCtx.strokeStyle = 'rgba(0, 240, 255, 0.2)'
      canvasCtx.lineWidth = 1
      canvasCtx.strokeRect(0, 0, w, h)

      canvasCtx.fillStyle = '#00f0ff'
      canvasCtx.font = 'bold 11px monospace'
      canvasCtx.fillText('FUNNEL VISIBILITY', 12, 20)

      // Funnel bars
      const stages = ['Click', 'View', 'Cart', 'Checkout', 'Purchase']
      const values = [100, 78, 45, 32, 28]
      const barH = (h - 60) / stages.length

      stages.forEach((stage, i) => {
        const y = 35 + i * barH
        const barW = (values[i] / 100) * (w - 80)

        // Bar
        canvasCtx.fillStyle = `rgba(0, 240, 255, ${0.3 + i * 0.1})`
        canvasCtx.fillRect(60, y, barW, barH - 4)

        // Border
        canvasCtx.strokeStyle = 'rgba(0, 240, 255, 0.4)'
        canvasCtx.lineWidth = 1
        canvasCtx.strokeRect(60, y, barW, barH - 4)

        // Label
        canvasCtx.fillStyle = 'rgba(255,255,255,0.5)'
        canvasCtx.font = '9px monospace'
        canvasCtx.fillText(stage, 12, y + barH / 2 + 3)

        // Value
        canvasCtx.fillStyle = '#00f0ff'
        canvasCtx.font = 'bold 10px monospace'
        canvasCtx.fillText(`${values[i]}%`, 60 + barW + 6, y + barH / 2 + 3)
      })

      // Animated particles flowing down
      time += 0.03
      for (let i = 0; i < 8; i++) {
        const t = (time + i * 0.15) % 1
        const stageIdx = Math.floor(t * stages.length)
        const stageT = (t * stages.length) % 1
        const y = 35 + stageIdx * barH + stageT * barH
        const barW = (values[stageIdx] / 100) * (w - 80)
        const x = 60 + Math.random() * barW

        canvasCtx.beginPath()
        canvasCtx.arc(x, y, 2, 0, Math.PI * 2)
        canvasCtx.fillStyle = 'rgba(0, 240, 255, 0.6)'
        canvasCtx.fill()
      }

      animationId = requestAnimationFrame(drawFunnel)
    }

    function drawExperiment() {
      if (!canvas) return
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      canvasCtx.clearRect(0, 0, w, h)

      canvasCtx.fillStyle = 'rgba(10, 10, 15, 0.9)'
      canvasCtx.fillRect(0, 0, w, h)

      canvasCtx.strokeStyle = 'rgba(255, 255, 255, 0.15)'
      canvasCtx.lineWidth = 1
      canvasCtx.strokeRect(0, 0, w, h)

      canvasCtx.fillStyle = '#ffffff'
      canvasCtx.font = 'bold 11px monospace'
      canvasCtx.fillText('A/B TEST LIVE', 12, 20)

      // Two bars comparing
      const barH = 20
      const variants = [
        { name: 'Variant A', value: 68, color: '#00ff9d' },
        { name: 'Variant B', value: 52, color: '#00f0ff' },
      ]

      variants.forEach((v, i) => {
        const y = 45 + i * 40
        const barW = (v.value / 100) * (w - 100)

        // Label
        canvasCtx.fillStyle = 'rgba(255,255,255,0.5)'
        canvasCtx.font = '9px monospace'
        canvasCtx.fillText(v.name, 12, y + 14)

        // Bar background
        canvasCtx.fillStyle = 'rgba(255,255,255,0.03)'
        canvasCtx.fillRect(70, y, w - 100, barH)

        // Bar
        canvasCtx.fillStyle = v.color
        canvasCtx.fillRect(70, y, barW, barH)

        // Glow on bar
        canvasCtx.fillStyle = `${v.color}20`
        canvasCtx.fillRect(70, y + barH, barW, 2)

        // Value
        canvasCtx.fillStyle = v.color
        canvasCtx.font = 'bold 11px monospace'
        canvasCtx.fillText(`${v.value}%`, 70 + barW + 6, y + 14)
      })

      // Confidence interval
      canvasCtx.fillStyle = 'rgba(255,255,255,0.3)'
      canvasCtx.font = '9px monospace'
      canvasCtx.fillText('Confidence: 94.2%', 12, h - 20)

      // Animated sparkline
      time += 0.05
      canvasCtx.beginPath()
      for (let i = 0; i < 30; i++) {
        const x = w - 100 + i * 3
        const y = h - 25 + Math.sin(time + i * 0.3) * 8
        if (i === 0) canvasCtx.moveTo(x, y)
        else canvasCtx.lineTo(x, y)
      }
      canvasCtx.strokeStyle = '#00ff9d'
      canvasCtx.lineWidth = 1.5
      canvasCtx.stroke()

      animationId = requestAnimationFrame(drawExperiment)
    }

    const drawFn = variant === 'roas' ? drawROAS : variant === 'funnel' ? drawFunnel : drawExperiment
    drawFn()

    return () => cancelAnimationFrame(animationId)
  }, [variant])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{
        borderRadius: '8px',
        boxShadow: '0 0 30px rgba(0, 255, 157, 0.1)',
      }}
    />
  )
}
