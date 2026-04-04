"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Differential {
  title: string;
  description: string;
}

interface Stat {
  prefix: string;
  value: number;
  suffix: string;
  label: string;
}

// ---------------------------------------------------------------------------
// Static data — hoisted outside component to avoid recreation on each render
// ---------------------------------------------------------------------------

const DIFFERENTIALS: Differential[] = [
  {
    title: "Rastreamento 100% confiável",
    description: "Zero dados perdidos entre eventos e relatórios",
  },
  {
    title: "Implementação ágil",
    description: "Do diagnóstico ao go-live em dias, não meses",
  },
  {
    title: "LGPD Compliant by design",
    description: "Privacidade e conformidade integradas desde o início",
  },
];

const STATS: Stat[] = [
  { prefix: "+", value: 340, suffix: "%", label: "aumento médio de ROAS" },
  { prefix: "", value: 0, suffix: " dados", label: "perdidos em produção" },
  { prefix: "", value: 48, suffix: "h", label: "da análise ao primeiro deploy" },
  { prefix: "", value: 100, suffix: "%", label: "LGPD compliance" },
];

// Framer Motion variant objects hoisted to module level (static object references)
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
};

const headingVariants: Variants = {
  hidden: { opacity: 0, x: -32 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// AnimatedCounter — isolated so it can be individually memoised
// ---------------------------------------------------------------------------

interface AnimatedCounterProps {
  prefix: string;
  target: number;
  suffix: string;
  inView: boolean;
  duration?: number;
}

function AnimatedCounter({
  prefix,
  target,
  suffix,
  inView,
  duration = 1500,
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!inView) return;

    // Reset accumulated refs on each activation
    startTimeRef.current = null;
    setCount(0);

    const step = (timestamp: number) => {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inView, target, duration]);

  return (
    <span className="font-heading text-3xl sm:text-4xl text-glow-green">
      {prefix}
      {count}
      {suffix}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Sobre — main export
// ---------------------------------------------------------------------------

export default function Sobre() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // once: true — animate in only on first intersection
  const headingInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  return (
    <section
      id="sobre"
      ref={sectionRef}
      className="bg-dark-surface py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ----------------------------------------------------------------
              Left — text content
          ---------------------------------------------------------------- */}
          <div>
            {/* Label */}
            <p className="font-heading text-xs tracking-[0.3em] mb-6 text-neon-green/60">
              SOBRE
            </p>

            {/* Heading — slides in from the left */}
            <motion.h2
              className="font-heading text-4xl md:text-5xl text-white leading-tight mb-8"
              initial="hidden"
              animate={headingInView ? "visible" : "hidden"}
              variants={headingVariants}
            >
              Precisão que os outros não entregam.
            </motion.h2>

            {/* Body paragraphs */}
            <div className="space-y-4 mb-10">
              <p className="font-body text-lg leading-relaxed text-white/60">
                Marktracking nasceu da necessidade de conectar dados reais com
                decisões de crescimento. Não trabalhamos com suposições — cada
                implementação é auditada, testada e monitorada.
              </p>
              <p className="font-body text-lg leading-relaxed text-white/60">
                Nossa stack combina infraestrutura DevOps robusta com tracking de
                precisão cirúrgica, entregando a base que times de Growth precisam
                para escalar.
              </p>
            </div>

            {/* Differentials — staggered list with typographic numbers */}
            <motion.ul
              className="space-y-6"
              initial="hidden"
              animate={headingInView ? "visible" : "hidden"}
              variants={containerVariants}
            >
              {DIFFERENTIALS.map(({ title, description }, index) => (
                <motion.li
                  key={title}
                  className="flex items-start gap-5"
                  variants={itemVariants}
                >
                  {/* Number anchor — typographic, more distinctive than an icon box */}
                  <span
                    className="text-gradient-brand font-heading text-2xl leading-none flex-shrink-0 mt-0.5 w-10 text-right"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Vertical divider */}
                  <div
                    className="w-px self-stretch bg-neon-green/20 flex-shrink-0"
                    aria-hidden="true"
                  />
                  {/* Text content */}
                  <div>
                    <p className="font-heading text-sm text-white">{title}</p>
                    <p className="font-body text-sm mt-0.5 text-white/50">
                      {description}
                    </p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* ----------------------------------------------------------------
              Right — stats grid 2×2
          ---------------------------------------------------------------- */}
          <div ref={statsRef} className="grid grid-cols-2 gap-4">
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="glass p-6 flex flex-col relative overflow-hidden"
              >
                {/* Decorative top line */}
                <div
                  className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon-green/30 to-transparent"
                  aria-hidden="true"
                />
                <AnimatedCounter
                  prefix={stat.prefix}
                  target={stat.value}
                  suffix={stat.suffix}
                  inView={statsInView}
                />
                <p className="font-body text-sm mt-2 text-white/60">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
