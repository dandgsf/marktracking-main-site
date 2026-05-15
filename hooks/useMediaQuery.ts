'use client'

import { useState, useEffect, useCallback } from 'react'

/**
 * useMediaQuery — Hook responsivo performático
 * Usa matchMedia API com listener eficiente
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const media = window.matchMedia(query)
    setMatches(media.matches)

    const handler = (e: MediaQueryListEvent) => setMatches(e.matches)
    media.addEventListener('change', handler)
    return () => media.removeEventListener('change', handler)
  }, [query])

  return matches
}

/**
 * useIsMobile — Detecta viewports mobile (lg breakpoint = 1024px)
 */
export function useIsMobile(): boolean {
  return useMediaQuery('(max-width: 1023px)')
}

/**
 * useIsTouch — Detecta dispositivos touch (não hover primary)
 */
export function useIsTouch(): boolean {
  return useMediaQuery('(hover: none) and (pointer: coarse)')
}

/**
 * useReducedMotion — Respeita preferência do usuário por menos movimento
 */
export function useReducedMotion(): boolean {
  return useMediaQuery('(prefers-reduced-motion: reduce)')
}
