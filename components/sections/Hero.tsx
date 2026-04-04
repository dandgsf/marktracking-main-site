'use client'

import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'

// ---------------------------------------------------------------------------
// Lazy-load the Three.js canvas — SSR disabled, no blocking fallback
// ---------------------------------------------------------------------------
const ParticleField = dynamic(
  () => import('@/components/three/ParticleField'),
  { ssr: false, loading: () => null }
)

// ---------------------------------------------------------------------------
// Reusable animation variants (defined at module level — never re-allocated)
// ---------------------------------------------------------------------------
const FADE_UP_INITIAL = { opacity: 0, y: 30 }
const FADE_UP_ANIMATE = { opacity: 1, y: 0 }

const TRANSITION_BASE = {
  duration: 0.7,
  ease: [0.25, 0.46, 0.45, 0.94] as const,
}

function fadeUp(delay: number) {
  return {
    initial: FADE_UP_INITIAL,
    animate: FADE_UP_ANIMATE,
    transition: { ...TRANSITION_BASE, delay },
  }
}

// ---------------------------------------------------------------------------
// Sub-components (defined outside Hero to prevent inline-component issue)
// ---------------------------------------------------------------------------

function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span className="font-heading text-xs tracking-[0.3em] text-white/30 uppercase select-none">
        Scroll
      </span>
      {/* Animated chevron */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <svg
          width="16"
          height="10"
          viewBox="0 0 16 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-white/30"
        >
          <path
            d="M1 1L8 8L15 1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Hero section
// ---------------------------------------------------------------------------
export default function Hero() {
  return (
    <section
      className="relative overflow-hidden flex flex-col"
      style={{ minHeight: '100svh' }}
      aria-label="Hero"
    >
      {/* ── Background canvas ─────────────────────────────────────────── */}
      <div className="absolute inset-0 z-0" aria-hidden="true">
        <ParticleField />
      </div>

      {/* ── Ambient radial glow ────────────────────────────────────────── */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, rgba(0,255,157,0.05) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      {/* ── Content ────────────────────────────────────────────────────── */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        {/* Badge */}
        <motion.div {...fadeUp(0.3)}>
          <span className="font-heading text-xs tracking-[0.3em] text-neon-green/80 uppercase mb-6 block">
            Performance Solutions
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          className="font-heading text-4xl sm:text-5xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl"
          {...fadeUp(0.5)}
        >
          TRACKING QUE
          <br />
          {/* "CONVERTE" gets the glitch animation */}
          <span className="animate-glitch inline-block text-glow-green">
            CONVERTE.
          </span>
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          className="font-body mt-6 max-w-2xl text-lg leading-relaxed text-white/70 md:text-xl"
          {...fadeUp(0.7)}
        >
          Arquitetura de dados robusta para produtos digitais que precisam crescer
          sem perder medições.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          {...fadeUp(0.9)}
        >
          {/* Primary CTA */}
          <a
            href="#contact"
            className="font-heading inline-flex items-center justify-center rounded-lg bg-neon-green px-8 py-4 text-sm font-bold tracking-wide text-black transition-all duration-200 hover:brightness-110 hover:shadow-[0_0_24px_rgba(0,255,157,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green"
          >
            Falar com Especialista
          </a>

          {/* Ghost CTA */}
          <a
            href="#services"
            className="font-heading inline-flex items-center justify-center rounded-lg border border-neon-green/50 px-8 py-4 text-sm font-bold tracking-wide text-neon-green transition-all duration-200 hover:border-neon-green/80 hover:bg-neon-green/5 hover:shadow-[0_0_16px_rgba(0,255,157,0.2)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neon-green"
          >
            Ver Serviços
          </a>
        </motion.div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <ScrollIndicator />
    </section>
  )
}
