"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Search, Layers, Code2, BarChart3, type LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Step {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const STEPS: Step[] = [
  {
    number: "01",
    title: "Diagnóstico",
    description:
      "Auditoria completa do tracking existente. Identificamos vazamentos de dados, conflitos de tags e oportunidades de melhoria.",
    icon: Search,
  },
  {
    number: "02",
    title: "Arquitetura",
    description:
      "Desenhamos a solução ideal: datalayer, estrutura de eventos, integrações e infraestrutura necessária.",
    icon: Layers,
  },
  {
    number: "03",
    title: "Implementação",
    description:
      "Deploy com metodologia ágil, testes rigorosos e documentação de cada implementação realizada.",
    icon: Code2,
  },
  {
    number: "04",
    title: "Monitoramento",
    description:
      "Dashboards de qualidade de dados, alertas automáticos e relatórios mensais de performance.",
    icon: BarChart3,
  },
];

// ---------------------------------------------------------------------------
// Step Card
// ---------------------------------------------------------------------------

interface StepCardProps {
  step: Step;
  index: number;
  inView: boolean;
}

function StepCard({ step, index, inView }: StepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      className="flex flex-col items-center text-center flex-1 relative min-w-0"
      initial={{ opacity: 0, y: 32 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    >
      {/* Step number */}
      <p
        className="font-heading text-5xl leading-none mb-4 select-none"
        style={{ color: "rgba(0,255,157,0.18)" }}
        aria-hidden="true"
      >
        {step.number}
      </p>

      {/* Icon circle */}
      <div
        className="glass flex items-center justify-center rounded-full mb-5"
        style={{
          width: 64,
          height: 64,
          border: "1px solid rgba(0,255,157,0.18)",
        }}
      >
        <Icon size={24} style={{ color: "#00ff9d" }} />
      </div>

      {/* Title */}
      <h3 className="font-heading text-base text-white mb-3">{step.title}</h3>

      {/* Description */}
      <p
        className="font-body text-sm leading-relaxed max-w-[200px]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        {step.description}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Mobile Step Card (vertical layout)
// ---------------------------------------------------------------------------

interface MobileStepCardProps {
  step: Step;
  index: number;
  isLast: boolean;
  inView: boolean;
}

function MobileStepCard({ step, index, isLast, inView }: MobileStepCardProps) {
  const Icon = step.icon;

  return (
    <motion.div
      className="flex gap-5 relative"
      initial={{ opacity: 0, x: -24 }}
      animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
      transition={{ duration: 0.5, delay: index * 0.15, ease: "easeOut" }}
    >
      {/* Left: line + icon */}
      <div className="flex flex-col items-center">
        <div
          className="glass flex items-center justify-center rounded-full flex-shrink-0"
          style={{
            width: 48,
            height: 48,
            border: "1px solid rgba(0,255,157,0.18)",
          }}
        >
          <Icon size={20} style={{ color: "#00ff9d" }} />
        </div>
        {!isLast && (
          <div
            className="flex-1 w-px mt-2"
            style={{ background: "rgba(0,255,157,0.15)", minHeight: 40 }}
          />
        )}
      </div>

      {/* Right: content */}
      <div className="pb-10 pt-1">
        <p
          className="font-heading text-xs mb-1"
          style={{ color: "rgba(0,255,157,0.5)" }}
        >
          {step.number}
        </p>
        <h3 className="font-heading text-sm text-white mb-2">{step.title}</h3>
        <p
          className="font-body text-sm leading-relaxed md:max-w-lg"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          {step.description}
        </p>
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Processo() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="processo"
      ref={sectionRef}
      className="bg-dark-surface py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <p
            className="font-heading text-xs tracking-[0.3em] mb-5"
            style={{ color: "rgba(0,255,157,0.6)" }}
          >
            PROCESSO
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-5">
            Como trabalhamos.
          </h2>
          <p
            className="font-body text-xl max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Metodologia estruturada do diagnóstico ao monitoramento contínuo.
          </p>
        </div>

        {/* Desktop timeline — only at lg (1024px+) where 4 columns have room */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div
              className="absolute top-[96px] left-0 right-0 h-px"
              style={{ background: "rgba(255,255,255,0.06)" }}
              aria-hidden="true"
            >
              <motion.div
                className="h-full origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, #00ff9d, rgba(0,240,255,0.6))",
                }}
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 1, delay: 0.2, ease: "easeInOut" }}
              />
            </div>

            {/* Steps row */}
            <div className="flex gap-4">
              {STEPS.map((step, index) => (
                <StepCard
                  key={step.number}
                  step={step}
                  index={index}
                  inView={inView}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile + tablet timeline — shown up to 1023px */}
        <div className="lg:hidden flex flex-col gap-8 md:gap-10">
          {STEPS.map((step, index) => (
            <MobileStepCard
              key={step.number}
              step={step}
              index={index}
              isLast={index === STEPS.length - 1}
              inView={inView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
