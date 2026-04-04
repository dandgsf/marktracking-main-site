"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import { Quote } from "lucide-react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Metric {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
  color: "green" | "blue";
}

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const METRICS: Metric[] = [
  {
    prefix: "+",
    value: 340,
    suffix: "%",
    label: "aumento médio de ROAS",
    color: "green",
  },
  {
    prefix: "",
    value: 0,
    suffix: "",
    label: "dados perdidos em produção",
    color: "blue",
  },
  {
    prefix: "",
    value: 48,
    suffix: "h",
    label: "diagnóstico ao primeiro deploy",
    color: "green",
  },
  {
    prefix: "",
    value: 100,
    suffix: "%",
    label: "LGPD compliance em todos os projetos",
    color: "blue",
  },
];

// ---------------------------------------------------------------------------
// Animated Counter
// ---------------------------------------------------------------------------

interface AnimatedCounterProps {
  prefix: string;
  target: number;
  suffix: string;
  color: "green" | "blue";
  inView: boolean;
  duration?: number;
}

function AnimatedCounter({
  prefix,
  target,
  suffix,
  color,
  inView,
  duration = 1500,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    setCount(0);
    startTimeRef.current = null;

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const t = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const progress = 1 - Math.pow(1 - t, 3);
      setCount(Math.round(progress * target));

      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration]);

  const glowClass =
    color === "green" ? "text-glow-green" : "text-glow-blue";

  return (
    <span className={`font-heading text-4xl md:text-5xl ${glowClass}`}>
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function Cases() {
  const sectionRef = useRef<HTMLElement>(null);
  const metricsRef = useRef<HTMLDivElement>(null);

  const metricsInView = useInView(metricsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="cases"
      ref={sectionRef}
      className="bg-dark-bg py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <p
            className="font-heading text-xs tracking-[0.3em] mb-5"
            style={{ color: "rgba(0,255,157,0.6)" }}
          >
            RESULTADOS
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-5">
            Números que importam.
          </h2>
          <p
            className="font-body text-xl"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            Resultados reais de projetos reais.
          </p>
        </div>

        {/* Metrics grid */}
        <div
          ref={metricsRef}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {METRICS.map((metric) => (
            <div
              key={metric.label}
              className="glass p-8 flex flex-col items-center text-center"
            >
              <AnimatedCounter
                prefix={metric.prefix}
                target={metric.value}
                suffix={metric.suffix}
                color={metric.color}
                inView={metricsInView}
              />
              <p
                className="font-body text-sm mt-3 leading-snug"
                style={{ color: "rgba(255,255,255,0.5)" }}
              >
                {metric.label}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial card */}
        <div className="glass p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            {/* Left: quote */}
            <div className="flex-1 min-w-0">
              <Quote
                size={32}
                className="mb-4"
                style={{ color: "rgba(0,255,157,0.4)" }}
              />
              <blockquote
                className="font-body text-lg md:text-xl leading-relaxed mb-5"
                style={{ color: "rgba(255,255,255,0.8)" }}
              >
                "Em 30 dias, o Marktracking identificou que estávamos perdendo
                23% das conversões no checkout. Corrigimos, e o ROAS subiu 340%
                no trimestre."
              </blockquote>
              <p
                className="font-heading text-xs tracking-widest"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                — Head of Growth, E-commerce B2C (varejo digital)
              </p>
            </div>

            {/* Right: visual accent */}
            <div
              className="flex-shrink-0 flex flex-col items-center justify-center rounded-2xl px-6 py-6 sm:px-8 overflow-hidden"
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,255,157,0.08) 0%, rgba(0,240,255,0.04) 100%)",
                border: "1px solid rgba(0,255,157,0.15)",
              }}
            >
              <span className="text-glow-green font-heading text-3xl sm:text-4xl lg:text-5xl leading-none whitespace-nowrap">
                +340%
              </span>
              <span
                className="font-body text-xs sm:text-sm mt-2 text-center"
                style={{ color: "rgba(255,255,255,0.4)" }}
              >
                ROAS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
