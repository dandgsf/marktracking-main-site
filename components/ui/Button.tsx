'use client'

import { motion } from 'framer-motion'
import { useRef, useState } from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: () => void
  href?: string
  type?: 'button' | 'submit' | 'reset'
  className?: string
  disabled?: boolean
  loading?: boolean
}

interface Ripple {
  id: number
  x: number
  y: number
}

const sizeClasses = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
}

const variantClasses = {
  primary:
    'bg-neon-green text-black font-bold border border-neon-green hover:shadow-[0_0_20px_rgba(0,255,157,0.5),0_0_40px_rgba(0,255,157,0.2)]',
  ghost:
    'bg-transparent text-neon-green border border-neon-green hover:bg-neon-green/10',
  danger:
    'bg-transparent text-red-400 border border-red-500 hover:bg-red-500/10',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  href,
  type = 'button',
  className = '',
  disabled = false,
  loading = false,
}: ButtonProps) {
  const [ripples, setRipples] = useState<Ripple[]>([])
  const containerRef = useRef<HTMLElement>(null)
  const rippleCounter = useRef(0)

  const triggerRipple = (e: React.MouseEvent<HTMLElement>) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = rippleCounter.current++
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id))
    }, 600)
  }

  const handleClick = (e: React.MouseEvent<HTMLElement>) => {
    if (disabled || loading) return
    triggerRipple(e)
    onClick?.()
  }

  const baseClasses = [
    'relative overflow-hidden inline-flex items-center justify-center',
    'rounded-lg font-heading tracking-wider uppercase',
    'transition-colors duration-200 select-none outline-none',
    'focus-visible:ring-2 focus-visible:ring-neon-green/50 focus-visible:ring-offset-2 focus-visible:ring-offset-dark-bg',
    sizeClasses[size],
    variantClasses[variant],
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ].join(' ')

  const rippleColor =
    variant === 'primary'
      ? 'rgba(0,0,0,0.25)'
      : variant === 'danger'
        ? 'rgba(239,68,68,0.3)'
        : 'rgba(0,255,157,0.2)'

  const content = loading ? (
    <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
  ) : (
    children
  )

  const motionProps = {
    whileHover: disabled || loading ? {} : { scale: 1.03 },
    whileTap: disabled || loading ? {} : { scale: 0.97 },
    transition: { type: 'spring' as const, stiffness: 400, damping: 20 },
  }

  if (href) {
    return (
      <motion.a
        ref={containerRef as React.RefObject<HTMLAnchorElement>}
        href={disabled ? undefined : href}
        className={baseClasses}
        onClick={handleClick}
        {...motionProps}
        aria-disabled={disabled}
      >
        {ripples.map((r) => (
          <span
            key={r.id}
            className="absolute pointer-events-none rounded-full animate-ping"
            style={{
              left: r.x,
              top: r.y,
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
              background: rippleColor,
              animation: 'ripple-expand 0.6s ease-out forwards',
            }}
          />
        ))}
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button
      ref={containerRef as React.RefObject<HTMLButtonElement>}
      type={type}
      className={baseClasses}
      onClick={handleClick}
      disabled={disabled || loading}
      {...motionProps}
    >
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute pointer-events-none rounded-full"
          style={{
            left: r.x,
            top: r.y,
            width: 8,
            height: 8,
            marginLeft: -4,
            marginTop: -4,
            background: rippleColor,
            animation: 'ripple-expand 0.6s ease-out forwards',
          }}
        />
      ))}
      {content}
    </motion.button>
  )
}
