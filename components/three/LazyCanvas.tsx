'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { Canvas } from '@react-three/fiber'
import type { CanvasProps } from '@react-three/fiber'

interface LazyCanvasProps extends Omit<CanvasProps, 'frameloop'> {
  children: React.ReactNode
}

/**
 * LazyCanvas — Pauses WebGL render loop when off-screen
 * Critical for mobile performance with multiple canvases
 */
export default function LazyCanvas({ children, ...props }: LazyCanvasProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { amount: 0.05, once: false })

  return (
    <div ref={ref} className="absolute inset-0 w-full h-full">
      <Canvas {...props} frameloop={inView ? 'always' : 'never'}>
        {children}
      </Canvas>
    </div>
  )
}
