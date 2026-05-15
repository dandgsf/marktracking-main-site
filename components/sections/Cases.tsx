'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { TopographicTerrain } from '@/components/three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const CASES = [
  {
    tag: 'DevOps & Tracking',
    title: 'De deploy no susto para releases semanais com dados confiáveis',
    desc: 'Pipeline CI/CD com staging e produção separados, logs centralizados e instrumentação completa.',
    metric: '+340%',
    metricLabel: 'ROAS recuperado',
    area: 'case-a',
  },
  {
    tag: 'Tracking & Growth',
    title: 'Funil cego de vendas para visão do clique ao faturamento',
    desc: 'Padronização de UTMs, eventos de conversão e dashboard único com CAC, LTV e payback por canal.',
    metric: '0%',
    metricLabel: 'dados perdidos',
    area: 'case-b',
  },
  {
    tag: 'LP & Experimentação',
    title: 'De LP feita no olho para otimização contínua guiada por dados',
    desc: 'Tracking de scroll, cliques e formulário com testes A/B contínuos em headline, oferta e layout.',
    metric: '48h',
    metricLabel: 'para deploy',
    area: 'case-c',
  },
]

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll('.case-card')

      cards.forEach((card) => {
        gsap.fromTo(
          card,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 85%',
              toggleActions: 'play none none none',
            },
          }
        )

        const metricEl = card.querySelector('.case-metric')
        if (metricEl) {
          gsap.fromTo(
            metricEl,
            { scale: 0.8, opacity: 0 },
            {
              scale: 1,
              opacity: 1,
              duration: 0.6,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 70%',
                toggleActions: 'play none none none',
              },
            }
          )
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="cases"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* 3D Topographic Terrain — Background */}
      <div className="hidden lg:block absolute inset-0 opacity-40">
        <TopographicTerrain />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header — Left aligned */}
        <div className="mb-20 md:mb-28 max-w-3xl">
          <span className="text-caption mb-6 block">Cases</span>
          <h2 className="text-headline font-medium text-text-primary">
            Menos slide bonito,
            <br />
            <span className="gradient-accent">mais stack funcionando.</span>
          </h2>
        </div>

        {/* Asymmetric Grid — No 3-equal-columns */}
        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr"
          style={{
            gridTemplateAreas: `
              "case-a case-a case-b"
              "case-c case-c case-c"
            `,
          }}
        >
          {CASES.map((c) => (
            <div
              key={c.title}
              className="case-card group"
              style={{ gridArea: c.area }}
            >
              <div
                className="relative h-full rounded-[2rem] md:rounded-[2.5rem] border border-white/[0.06] bg-white/[0.02] p-8 md:p-10 flex flex-col transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.10]"
                style={{
                  boxShadow:
                    '0 20px 40px -15px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.05)',
                }}
              >
                {/* Tag */}
                <span className="font-mono text-[10px] tracking-[0.15em] uppercase text-text-muted mb-8 block">
                  {c.tag}
                </span>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-lg md:text-xl font-medium text-text-primary mb-4 leading-snug">
                    {c.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {c.desc}
                  </p>
                </div>

                {/* Metric */}
                <div className="mt-10 pt-6 border-t border-white/[0.06]">
                  <span className="case-metric text-4xl md:text-5xl font-medium text-text-primary block tracking-tight">
                    {c.metric}
                  </span>
                  <span className="text-[10px] text-text-muted uppercase tracking-[0.15em] mt-2 block">
                    {c.metricLabel}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
