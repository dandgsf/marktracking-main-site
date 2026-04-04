'use client'

import { useEffect, useRef, useState } from 'react'

const INTERACTIVE_SELECTORS = 'a, button, [role="button"], input, textarea, select, label'
const LERP_FACTOR = 0.12

export default function CustomCursor() {
  const [mounted, setMounted] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  // Live cursor position (target for ring, immediate for dot)
  const targetX = useRef(0)
  const targetY = useRef(0)

  // Ring's current interpolated position
  const ringX = useRef(0)
  const ringY = useRef(0)

  // Visibility and hover state via refs to avoid re-renders
  const visible = useRef(false)
  const hovering = useRef(false)

  const rafId = useRef<number>(0)

  useEffect(() => {
    // Detect touch / coarse pointer — skip rendering on those devices
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0

    if (isCoarse || hasTouch) {
      setIsTouchDevice(true)
      setMounted(true)
      return
    }

    setMounted(true)

    // --- Event handlers ---
    function onMouseMove(e: MouseEvent) {
      targetX.current = e.clientX
      targetY.current = e.clientY

      if (!visible.current) {
        // Snap ring to cursor on first appearance to avoid slide-in from (0,0)
        ringX.current = e.clientX
        ringY.current = e.clientY
        visible.current = true

        if (dotRef.current) dotRef.current.style.opacity = '1'
        if (ringRef.current) ringRef.current.style.opacity = '1'
      }

      // Move dot immediately
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(calc(-50% + ${e.clientX}px), calc(-50% + ${e.clientY}px))`
      }
    }

    function onMouseLeave() {
      visible.current = false
      if (dotRef.current) dotRef.current.style.opacity = '0'
      if (ringRef.current) ringRef.current.style.opacity = '0'
    }

    function onMouseEnter() {
      visible.current = true
      if (dotRef.current) dotRef.current.style.opacity = '1'
      if (ringRef.current) ringRef.current.style.opacity = '1'
    }

    function onMouseOver(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE_SELECTORS)) {
        if (!hovering.current) {
          hovering.current = true
          if (ringRef.current) {
            ringRef.current.style.transform = `translate(calc(-50% + ${ringX.current}px), calc(-50% + ${ringY.current}px)) scale(2)`
            ringRef.current.style.borderColor = 'rgba(0, 255, 157, 1)'
          }
          if (dotRef.current) dotRef.current.style.opacity = '0.4'
        }
      }
    }

    function onMouseOut(e: MouseEvent) {
      if ((e.target as Element).closest(INTERACTIVE_SELECTORS)) {
        if (hovering.current) {
          hovering.current = false
          if (dotRef.current) dotRef.current.style.opacity = '1'
        }
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)
    document.addEventListener('mouseover', onMouseOver)
    document.addEventListener('mouseout', onMouseOut)

    // --- rAF loop for ring interpolation ---
    function loop() {
      ringX.current += (targetX.current - ringX.current) * LERP_FACTOR
      ringY.current += (targetY.current - ringY.current) * LERP_FACTOR

      if (ringRef.current && visible.current) {
        const scale = hovering.current ? 'scale(2)' : 'scale(1)'
        ringRef.current.style.transform = `translate(calc(-50% + ${ringX.current}px), calc(-50% + ${ringY.current}px)) ${scale}`
      }

      rafId.current = requestAnimationFrame(loop)
    }

    rafId.current = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId.current)
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseout', onMouseOut)
    }
  }, [])

  if (!mounted || isTouchDevice) return null

  return (
    <>
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0, top: 0, left: 0 }}
        aria-hidden="true"
      />
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{
          opacity: 0,
          top: 0,
          left: 0,
          transition: 'border-color 0.2s ease, opacity 0.3s ease',
        }}
        aria-hidden="true"
      />
    </>
  )
}
