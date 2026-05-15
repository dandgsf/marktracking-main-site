'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MagneticButton from '@/components/ui/MagneticButton'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

export default function CTABand() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.cta-content',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% 50%, #22c55e, transparent)',
          }}
        />
      </div>

      <div className="cta-content max-w-4xl mx-auto px-6 md:px-12 text-center">
        <span className="text-caption mb-8 block">Vamos conversar</span>
        
        <h2 className="text-headline font-medium text-text-primary mb-6">
          Sua stack está quebrando
          <br />
          <span className="gradient-accent">e você ainda não sabe onde.</span>
        </h2>

        <p className="text-body max-w-xl mx-auto mb-12">
          Agende uma call de 30 minutos. Sem pitch de vendas, só diagnóstico técnico 
          do seu cenário atual.
        </p>

        <MagneticButton
          href="#contato"
          className="group relative px-10 py-5 text-sm font-medium text-bg bg-text-primary rounded-full transition-all duration-500 hover:bg-text-secondary"
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
      </div>
    </section>
  )
}
