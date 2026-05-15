'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion'
import { useIsTouch } from '@/hooks/useMediaQuery'

interface MagneticButtonProps {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  className?: string
  strength?: number
}

export default function MagneticButton({
  children,
  href,
  onClick,
  className = '',
  strength = 0.3,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isTouch = useIsTouch()

  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springConfig = { stiffness: 150, damping: 15 }
  const springX = useSpring(x, springConfig)
  const springY = useSpring(y, springConfig)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isTouch) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const distX = (e.clientX - centerX) * strength
    const distY = (e.clientY - centerY) * strength
    x.set(distX)
    y.set(distY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const baseClasses = [
    'relative inline-flex items-center justify-center',
    'transition-colors duration-300 select-none outline-none',
    className,
  ].join(' ')

  // Touch-optimized: bypass motion wrapper for better tap response
  if (isTouch) {
    const Component = href ? 'a' : 'button'
    return (
      <Component
        href={href}
        onClick={onClick}
        className={baseClasses}
        style={{ touchAction: 'manipulation' }}
      >
        {children}
      </Component>
    )
  }

  const Component = href ? motion.a : motion.button

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block magnetic-button-wrap"
    >
      <Component
        href={href}
        onClick={onClick}
        className={baseClasses}
        style={{ x: springX, y: springY }}
        whileTap={{ scale: 0.98 }}
      >
        {children}
      </Component>
    </div>
  )
}
