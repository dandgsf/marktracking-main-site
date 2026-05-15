'use client'

import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Server, Tag, Zap, Database, BarChart3, Gauge } from 'lucide-react'
import { FloatingMetricCards } from '@/components/three'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

const SERVICES = [
  {
    icon: Tag,
    title: 'Tracking & Analytics',
    desc: 'Do evento certo no lugar certo até o dashboard que você realmente usa.',
    items: ['CAPI & GTM Server-Side', 'Data Layer custom', 'Integração CRM'],
    area: 'tracking',
  },
  {
    icon: Server,
    title: 'DevOps & Infra',
    desc: 'Arquitetura, automação e confiabilidade para os seus apps e APIs.',
    items: ['CI/CD pipelines', 'Monitoramento', 'Rollback seguro'],
    area: 'devops',
  },
  {
    icon: Database,
    title: 'Data Layer',
    desc: 'Camada de dados robusta conectando todas as ferramentas do seu stack.',
    items: ['Schema customizado', 'Eventos estruturados', 'Governança'],
    area: 'datalayer',
  },
  {
    icon: Zap,
    title: 'Growth Técnico',
    desc: 'Estratégia, execução e medição num mesmo fluxo.',
    items: ['Otimização LCP/FID', 'Testes A/B', 'Funil → Receita'],
    area: 'growth',
  },
  {
    icon: BarChart3,
    title: 'Tag Management',
    desc: 'Gestão profissional de tags com governança e performance.',
    items: ['GTM audit', 'Server-side tags', 'Consent mode'],
    area: 'tagmgmt',
  },
  {
    icon: Gauge,
    title: 'Performance Audit',
    desc: 'Auditoria completa de velocidade, tracking e conversão.',
    items: ['Core Web Vitals', 'Análise de funil', 'Action plan'],
    area: 'performance',
  },
]

export default function Servicos() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current || !cardsRef.current) return

    const ctx = gsap.context(() => {
      const cards = cardsRef.current!.querySelectorAll('.bento-card')

      gsap.fromTo(
        cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsRef.current,
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
      id="servicos"
      className="relative py-32 md:py-48 overflow-hidden"
    >
      {/* 3D Floating Metric Cards — Background */}
      <div className="hidden lg:block absolute inset-0 opacity-60">
        <FloatingMetricCards />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        {/* Header — Left aligned, asymmetric */}
        <div className="mb-20 md:mb-28 max-w-3xl">
          <span className="text-caption mb-6 block">Serviços</span>
          <h2 className="text-headline font-medium text-text-primary">
            Pensados
            <br />
            <span className="gradient-accent">como produtos.</span>
          </h2>
          <p className="mt-6 text-body max-w-xl">
            Nada de lista de buzzwords. Cada bloco é um pacote com começo, meio e fim —
            sempre conectado a resultado.
          </p>
        </div>

        {/* Bento 2.0 Grid — Asymmetric (desktop only) */}
        <div
          ref={cardsRef}
          className="bento-grid-mobile grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-fr"
          style={{
            gridTemplateAreas: `
              "tracking tracking devops"
              "datalayer growth growth"
              "tagmgmt performance performance"
            `,
          }}
        >
          {SERVICES.map((service) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                className={`bento-card group`}
                style={{ gridArea: service.area }}
              >
                {/* Bento 2.0 Surface — rounded-[2.5rem], diffusion shadow, liquid glass */}
                <div
                  className={`relative h-full rounded-[2rem] md:rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 ${
                    ['tracking', 'growth', 'performance'].includes(service.area)
                      ? 'shimmer-border'
                      : 'border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.10]'
                  }`}
                  style={
                    ['tracking', 'growth', 'performance'].includes(service.area)
                      ? {
                          boxShadow:
                            '0 20px 40px -15px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.05)',
                        }
                      : {
                          boxShadow:
                            '0 20px 40px -15px rgba(0,0,0,0.05), inset 0 1px 1px rgba(255,255,255,0.05)',
                        }
                  }
                >
                  {/* Perpetual float on icon */}
                  <div className="flex items-start justify-between mb-8">
                    <div className="relative animate-float">
                      <Icon
                        className="w-5 h-5 text-text-tertiary transition-colors duration-300 group-hover:text-accent"
                        strokeWidth={1.5}
                      />
                      {/* Subtle glow on hover */}
                      <div className="absolute inset-0 blur-lg bg-accent/0 group-hover:bg-accent/20 transition-all duration-500 rounded-full" />
                    </div>
                    <span className="font-mono text-[10px] text-text-muted tracking-wider">
                      {service.area}
                    </span>
                  </div>

                  {/* Content */}
                  <div>
                    <h3 className="text-title font-medium text-text-primary mb-3">
                      {service.title}
                    </h3>
                    <p className="text-sm text-text-secondary leading-relaxed mb-6">
                      {service.desc}
                    </p>
                  </div>

                  {/* Items */}
                  <ul className="space-y-2">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="text-[11px] text-text-muted flex items-center gap-2"
                      >
                        <span className="w-1 h-1 rounded-full bg-text-muted group-hover:bg-accent transition-colors" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
