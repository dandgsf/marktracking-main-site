'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton'
import { LuminousPearl } from '@/components/three'
import { useIsMobile } from '@/hooks/useMediaQuery'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const eyebrowRef = useRef<HTMLDivElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subRef = useRef<HTMLParagraphElement>(null)
  const ctasRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    if (!sectionRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

      // Eyebrow
      if (eyebrowRef.current) {
        tl.fromTo(
          eyebrowRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.1
        )
      }

      // Headline word-by-word
      if (headlineRef.current) {
        const words = headlineRef.current.querySelectorAll('.word')
        tl.fromTo(
          words,
          { y: 100, opacity: 0, rotateX: -40 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.2,
            stagger: 0.08,
          },
          0.3
        )
      }

      // Sub-headline
      if (subRef.current) {
        tl.fromTo(
          subRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          0.8
        )
      }

      // CTAs
      if (ctasRef.current) {
        tl.fromTo(
          ctasRef.current,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8 },
          1.0
        )
      }

      // Scroll indicator
      if (scrollRef.current) {
        tl.fromTo(
          scrollRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 1 },
          1.5
        )
      }

      // Pin the hero content while scrolling (desktop only)
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=100%',
          pin: contentRef.current,
          pinSpacing: true,
        })
      }

      // Parallax fade out on scroll
      gsap.to(contentRef.current, {
        opacity: 0,
        y: -80,
        scale: 0.95,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=80%',
          scrub: 0.8,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [isMobile])

  return (
    <section
      ref={sectionRef}
      className="relative min-h-[100dvh] flex items-center overflow-hidden"
      aria-label="Hero"
    >
      {/* 3D Pearl — Right side background */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-[50%] h-[80%]">
        <LuminousPearl />
      </div>

      {/* ── Content — Left aligned (Anti-Center) ─────────────────────────── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-start text-left px-6 md:px-12 max-w-7xl mx-auto w-full"
      >
        {/* Eyebrow tag */}
        <div ref={eyebrowRef} className="mb-8 opacity-0">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-elevated/50 text-[10px] font-mono tracking-[0.15em] uppercase text-text-tertiary">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-subtle" />
            Performance Solutions
          </span>
        </div>

        {/* Headline with word-by-word reveal */}
        <h1
          ref={headlineRef}
          className="text-display font-medium text-text-primary max-w-5xl"
          style={{ perspective: '1000px' }}
        >
          <span className="word inline-block">Arquitetura</span>{' '}
          <span className="word inline-block">de</span>{' '}
          <span className="word inline-block gradient-accent">dados</span>
          <br className="hidden sm:block" />
          <span className="word inline-block">para</span>{' '}
          <span className="word inline-block">produtos</span>{' '}
          <span className="word inline-block">que</span>
          <br className="hidden sm:block" />
          <span className="word inline-block">precisam</span>{' '}
          <span className="word inline-block gradient-accent">escalar.</span>
        </h1>

        {/* Sub-headline */}
        <p
          ref={subRef}
          className="mt-8 max-w-xl text-body opacity-0"
        >
          DevOps, tracking avançado e growth analytics. Sem dashboards bonitos que ninguém usa. 
          Sistemas que capturam, entendem e convertem.
        </p>

        {/* CTAs */}
        <div
          ref={ctasRef}
          className="mt-12 flex flex-col sm:flex-row items-start gap-4 opacity-0"
        >
          {/* Primary CTA — Magnetic */}
          <MagneticButton
            href="#contato"
            className="group relative px-8 py-4 text-sm font-medium text-bg bg-text-primary rounded-full transition-all duration-500 hover:bg-text-secondary"
          >
            <span className="inline-flex items-center gap-3">
              <span>Agendar diagnóstico gratuito</span>
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-bg/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-bg">
                  <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </span>
          </MagneticButton>

          {/* Secondary CTA */}
          <a
            href="#servicos"
            className="inline-flex items-center gap-2 px-8 py-4 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            <span>Ver serviços</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="opacity-50">
              <path d="M1 6h10M6 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>

        {/* Scroll indicator */}
        <div
          ref={scrollRef}
          className="absolute bottom-12 left-6 md:left-12 flex flex-col items-start gap-3 opacity-0"
        >
          <span className="text-[10px] tracking-[0.3em] uppercase text-text-muted select-none">
            Scroll
          </span>
          <div
            className="w-px h-8 bg-gradient-to-b from-text-muted to-transparent scroll-bounce"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
