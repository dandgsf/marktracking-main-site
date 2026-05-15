'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const STATS = [
  { value: '7+', label: 'Anos em produtos digitais' },
  { value: '20+', label: 'Stacks em produção' },
  { value: '500h+', label: 'De consultoria técnica' },
]

export default function Sobre() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Title reveal
      gsap.fromTo(
        '.sobre-headline',
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sobre-headline',
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Text blocks reveal
      gsap.fromTo(
        '.sobre-text',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sobre-content',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Stats reveal
      gsap.fromTo(
        '.sobre-stat',
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.sobre-stats',
            start: 'top 85%',
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
      id="sobre"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Editorial Split Layout */}
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          {/* Left: Massive headline */}
          <div className="lg:col-span-5">
            <div className="sobre-headline">
              <span className="text-caption mb-6 block">Sobre</span>
              <h2 className="text-headline font-medium text-text-primary">
                Stack.
                <br />
                <span className="gradient-accent">Dados.</span>
                <br />
                Resultado.
              </h2>
            </div>
          </div>

          {/* Right: Content */}
          <div className="lg:col-span-6 lg:col-start-7 sobre-content space-y-8 lg:pt-16">
            <div className="sobre-text">
              <p className="text-body">
                Especialista em <strong className="text-text-primary font-medium">DevOps</strong> e{' '}
                <strong className="text-text-primary font-medium">trackeamento avançado</strong>.
                O trabalho é alinhar infraestrutura, coleta de dados e crescimento
                para que as decisões deixem de ser chute bem-intencionado.
              </p>
            </div>

            <div className="sobre-text">
              <p className="text-body">
                Em vez de entregar só dashboards bonitos, desenha-se o sistema que
                garante que cada evento importante seja capturado, entendido e usado:
                da configuração de servidores e pipelines ao pixel, data layer e
                integrações com CRM, gateway e plataformas de anúncio.
              </p>
            </div>

            {/* Stats row */}
            <div className="sobre-stats grid grid-cols-3 gap-6 pt-10 border-t border-border">
              {STATS.map((stat) => (
                <div key={stat.label} className="sobre-stat">
                  <span className="text-title font-medium text-text-primary block">
                    {stat.value}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-[0.15em] mt-2 block leading-tight">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
