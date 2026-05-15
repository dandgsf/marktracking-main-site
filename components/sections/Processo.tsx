'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { DataRibbon } from '@/components/three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const STEPS = [
  {
    number: '01',
    title: 'Diagnóstico',
    desc: 'Auditoria completa do seu stack atual: infra, tracking, dados e funil de conversão.',
  },
  {
    number: '02',
    title: 'Arquitetura',
    desc: 'Desenho da nova estrutura: data layer, pipelines, integrações e governança.',
  },
  {
    number: '03',
    title: 'Implementação',
    desc: 'Execução com sprints curtos, deploys frequentes e validação contínua.',
  },
  {
    number: '04',
    title: 'Monitoramento',
    desc: 'Dashboards, alertas e revisões periódicas para garantir performance.',
  },
]

export default function Processo() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Steps reveal
      gsap.fromTo(
        '.process-step',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.process-steps',
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      )

      // Progress line animation
      if (lineRef.current) {
        gsap.fromTo(
          lineRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '.process-steps',
              start: 'top 80%',
              end: 'bottom 60%',
              scrub: 0.5,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="processo"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* 3D Data Ribbon — Background */}
      <div className="hidden lg:block absolute inset-0 opacity-50">
        <DataRibbon />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <div className="mb-20 md:mb-28 max-w-3xl">
          <span className="text-caption mb-6 block">Processo</span>
          <h2 className="text-headline font-medium text-text-primary">
            De diagnóstico
            <br />
            <span className="gradient-accent">a monitoramento.</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="process-steps relative">
          {/* Progress line */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px bg-border">
            <div
              ref={lineRef}
              className="h-full bg-gradient-to-r from-accent to-accent-light origin-left"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>

          {/* Steps */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
            {STEPS.map((step) => (
              <div key={step.number} className="process-step relative">
                {/* Number circle */}
                <div className="relative mb-8">
                  <div className="w-16 h-16 rounded-full border border-border bg-bg-elevated flex items-center justify-center">
                    <span className="font-mono text-sm text-text-tertiary">{step.number}</span>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-medium text-text-primary mb-3">
                  {step.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
