'use client'

import { useEffect, useRef, useState } from 'react'

const CHARS =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~`'

function randomChar() {
  return CHARS[Math.floor(Math.random() * CHARS.length)]
}

interface TextScrambleProps {
  text: string
  className?: string
  delay?: number
  speed?: number
}

export default function TextScramble({
  text,
  className = '',
  delay = 0,
  speed = 30,
}: TextScrambleProps) {
  const [display, setDisplay] = useState('')
  const frameRef = useRef(0)
  const resolvedRef = useRef(0)

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>
    let raf: number

    const start = () => {
      resolvedRef.current = 0
      let frame = 0

      const tick = () => {
        frame++
        const resolved = resolvedRef.current

        // Every N frames, resolve one more character
        if (frame % speed === 0 && resolved < text.length) {
          resolvedRef.current++
        }

        let output = ''
        for (let i = 0; i < text.length; i++) {
          if (text[i] === ' ') {
            output += ' '
          } else if (i < resolvedRef.current) {
            output += text[i]
          } else {
            output += randomChar()
          }
        }

        setDisplay(output)

        if (resolvedRef.current < text.length) {
          raf = requestAnimationFrame(tick)
        }
      }

      raf = requestAnimationFrame(tick)
    }

    timeout = setTimeout(start, delay)

    return () => {
      clearTimeout(timeout)
      cancelAnimationFrame(raf)
    }
  }, [text, delay, speed])

  return (
    <span className={className} aria-label={text}>
      {display || text.split('').map(() => '\u00A0').join('')}
    </span>
  )
}
