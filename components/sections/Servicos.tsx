"use client";

import { useRef } from "react";
import { motion, useInView, type Variants } from "framer-motion";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Service {
  svgIcon: React.ReactNode;
  title: string;
  description: string;
  tag: string;
  color: "green" | "blue";
}

// ---------------------------------------------------------------------------
// Custom SVG Icons
// ---------------------------------------------------------------------------

const IconDevOps = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-devops" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <circle cx="8" cy="20" r="3" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="3" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <circle cx="32" cy="20" r="3" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <line x1="11" y1="20" x2="17" y2="20" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <line x1="23" y1="20" x2="29" y2="20" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <line x1="20" y1="17" x2="20" y2="10" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <circle cx="20" cy="8" r="2.5" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <line x1="20" y1="23" x2="20" y2="30" stroke="url(#grad-devops)" strokeWidth="1.5" />
    <circle cx="20" cy="32" r="2.5" stroke="url(#grad-devops)" strokeWidth="1.5" />
  </svg>
);

const IconTracking = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-tracking" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <circle cx="20" cy="20" r="12" stroke="url(#grad-tracking)" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="5" stroke="url(#grad-tracking)" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="1.5" fill="url(#grad-tracking)" />
    <line x1="20" y1="8" x2="20" y2="15" stroke="url(#grad-tracking)" strokeWidth="1.5" />
    <line x1="20" y1="25" x2="20" y2="32" stroke="url(#grad-tracking)" strokeWidth="1.5" />
    <line x1="8" y1="20" x2="15" y2="20" stroke="url(#grad-tracking)" strokeWidth="1.5" />
    <line x1="25" y1="20" x2="32" y2="20" stroke="url(#grad-tracking)" strokeWidth="1.5" />
  </svg>
);

const IconGrowth = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-growth" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <rect x="5" y="28" width="6" height="6" rx="1" stroke="url(#grad-growth)" strokeWidth="1.5" />
    <rect x="13" y="22" width="6" height="12" rx="1" stroke="url(#grad-growth)" strokeWidth="1.5" />
    <rect x="21" y="15" width="6" height="19" rx="1" stroke="url(#grad-growth)" strokeWidth="1.5" />
    <rect x="29" y="8" width="6" height="26" rx="1" stroke="url(#grad-growth)" strokeWidth="1.5" />
    <polyline points="8,26 16,20 24,13 32,6" stroke="url(#grad-growth)" strokeWidth="1.5" fill="none" />
    <circle cx="32" cy="6" r="2" fill="url(#grad-growth)" />
  </svg>
);

const IconData = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-data" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <path d="M8 28 L20 34 L32 28 L20 22 Z" stroke="url(#grad-data)" strokeWidth="1.5" fill="none" />
    <path d="M8 21 L20 27 L32 21 L20 15 Z" stroke="url(#grad-data)" strokeWidth="1.5" fill="none" />
    <path d="M8 14 L20 20 L32 14 L20 8 Z" stroke="url(#grad-data)" strokeWidth="1.5" fill="none" />
    <line x1="8" y1="14" x2="8" y2="28" stroke="url(#grad-data)" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
    <line x1="32" y1="14" x2="32" y2="28" stroke="url(#grad-data)" strokeWidth="1" strokeDasharray="2 2" strokeOpacity="0.5" />
  </svg>
);

const IconTag = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-tag" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <path d="M20 4 L36 20 L20 36 L4 20 Z" stroke="url(#grad-tag)" strokeWidth="1.5" fill="none" />
    <path d="M20 12 L28 20 L20 28 L12 20 Z" stroke="url(#grad-tag)" strokeWidth="1.5" fill="none" strokeOpacity="0.5" />
    <circle cx="20" cy="20" r="2.5" fill="url(#grad-tag)" />
    <circle cx="20" cy="4" r="1.5" fill="url(#grad-tag)" />
  </svg>
);

const IconAudit = (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
    <defs>
      <linearGradient id="grad-audit" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#00ff9d" />
        <stop offset="100%" stopColor="#00f0ff" />
      </linearGradient>
    </defs>
    <path d="M20 6 A14 14 0 1 1 34 20" stroke="url(#grad-audit)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    <path d="M20 11 A9 9 0 1 1 29 20" stroke="url(#grad-audit)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeOpacity="0.6" />
    <circle cx="20" cy="20" r="2" fill="url(#grad-audit)" />
    <line x1="20" y1="3" x2="20" y2="7" stroke="url(#grad-audit)" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="3" y1="20" x2="7" y2="20" stroke="url(#grad-audit)" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// ---------------------------------------------------------------------------
// Static data — hoisted outside component
// ---------------------------------------------------------------------------

const SERVICES: Service[] = [
  {
    svgIcon: IconDevOps,
    title: "DevOps & Infra",
    description:
      "CI/CD, containerização e infra como código para ambientes de alta disponibilidade.",
    tag: "Docker · Kubernetes",
    color: "green",
  },
  {
    svgIcon: IconTracking,
    title: "Tracking Setup",
    description:
      "GTM, GA4, Meta Pixel e custom events com datalayer arquitetado para não perder nada.",
    tag: "GTM · GA4 · Meta",
    color: "blue",
  },
  {
    svgIcon: IconGrowth,
    title: "Growth Analytics",
    description:
      "Dashboards, funis de conversão e modelos de atribuição que guiam decisões de budget.",
    tag: "Looker · BigQuery",
    color: "green",
  },
  {
    svgIcon: IconData,
    title: "Data Layer",
    description:
      "Camada de dados padronizada que alimenta tracking, analytics e BI com consistência.",
    tag: "BigQuery · dbt",
    color: "blue",
  },
  {
    svgIcon: IconTag,
    title: "Tag Management",
    description:
      "Arquitetura de tags limpa, versionada e auditável. Zero conflitos, máxima performance.",
    tag: "GTM · Tealium",
    color: "green",
  },
  {
    svgIcon: IconAudit,
    title: "Performance Audit",
    description:
      "Auditoria completa de tracking, identificando vazamentos de dados e oportunidades perdidas.",
    tag: "Lighthouse · Custom",
    color: "blue",
  },
];

// Variant objects at module level — avoids object recreation on every render
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

const headingVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

// ---------------------------------------------------------------------------
// ServiceCard — extracted to avoid inline component definition
// ---------------------------------------------------------------------------

interface ServiceCardProps {
  service: Service;
  index: number;
  inView: boolean;
}

function ServiceCard({ service, index, inView }: ServiceCardProps) {
  const { svgIcon, title, description, tag, color } = service;

  const isGreen = color === "green";

  const tagBg = isGreen ? "bg-neon-green/10" : "bg-neon-blue/10";
  const tagText = isGreen ? "text-neon-green" : "text-neon-blue";
  const hoverBorder = isGreen
    ? "hover:border-neon-green/40"
    : "hover:border-neon-blue/40";
  const hoverShadow = isGreen
    ? "hover:shadow-[0_0_24px_rgba(0,255,157,0.12)]"
    : "hover:shadow-[0_0_24px_rgba(0,240,255,0.12)]";

  return (
    <motion.div
      custom={index * 0.1}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={cardVariants}
      className={[
        "group glass p-6 rounded-2xl flex flex-col gap-4 relative overflow-hidden",
        "border border-transparent transition-all duration-300",
        hoverBorder,
        hoverShadow,
      ].join(" ")}
    >
      {/* Top accent line */}
      <div
        className={`absolute top-0 left-4 right-4 h-px ${
          isGreen
            ? "bg-gradient-to-r from-transparent via-neon-green/40 to-transparent"
            : "bg-gradient-to-r from-transparent via-neon-blue/40 to-transparent"
        }`}
        aria-hidden="true"
      />

      {/* Icon container */}
      <div className="relative w-14 h-14 flex-shrink-0">
        {/* Glow background */}
        <div
          className={`absolute inset-0 rounded-2xl opacity-60 blur-sm ${
            isGreen ? "bg-neon-green/10" : "bg-neon-blue/10"
          }`}
          aria-hidden="true"
        />
        {/* Border container */}
        <div
          className={`relative w-full h-full rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:border-opacity-50 ${
            isGreen
              ? "border border-neon-green/20 bg-gradient-to-br from-neon-green/5 to-transparent"
              : "border border-neon-blue/20 bg-gradient-to-br from-neon-blue/5 to-transparent"
          }`}
        >
          {svgIcon}
        </div>
      </div>

      {/* Title */}
      <h3 className="font-heading text-lg text-white">{title}</h3>

      {/* Description */}
      <p className="font-body text-sm text-white/60 leading-relaxed flex-1">
        {description}
      </p>

      {/* Tech badge */}
      <span
        className={[
          "self-start font-heading text-xs px-3 py-1 rounded-full",
          tagBg,
          tagText,
        ].join(" ")}
      >
        {tag}
      </span>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Servicos — main export
// ---------------------------------------------------------------------------

export default function Servicos() {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const headerInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const gridInView = useInView(gridRef, { once: true, margin: "-60px" });

  return (
    <section
      id="servicos"
      ref={sectionRef}
      className="bg-dark-bg py-24 lg:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="mb-16 max-w-2xl"
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={headingVariants}
        >
          <p className="font-heading text-xs tracking-[0.3em] mb-6 text-neon-green/60">
            SERVIÇOS
          </p>
          <h2 className="font-heading text-4xl md:text-5xl text-white mb-4">
            O que entregamos.
          </h2>
          <p className="font-body text-xl text-white/60">
            Cada serviço é projetado para complementar o outro, criando uma
            stack de performance completa.
          </p>
        </motion.div>

        {/* Grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {SERVICES.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              index={index}
              inView={gridInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
