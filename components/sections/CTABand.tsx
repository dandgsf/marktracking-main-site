"use client";

import { motion } from "framer-motion";

// ---------------------------------------------------------------------------
// Shimmer Button
// ---------------------------------------------------------------------------

function ShimmerButton() {
  return (
    <motion.a
      href="#contato"
      className="inline-block rounded-lg font-heading font-bold text-lg px-10 py-5 text-black relative overflow-hidden"
      style={{
        background:
          "linear-gradient(90deg, #00ff9d 0%, #00f0ff 50%, #00ff9d 100%)",
        backgroundSize: "200% 100%",
        animation: "shimmer-btn 2.5s linear infinite",
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring" as const, stiffness: 400, damping: 25 }}
    >
      Falar com Especialista →
    </motion.a>
  );
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CTABand() {
  return (
    <section
      id="cta"
      className="relative py-20 overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #050505 0%, #0a0a0a 50%, #050505 100%)",
        borderTop: "1px solid rgba(0,255,157,0.2)",
        borderBottom: "1px solid rgba(0,255,157,0.2)",
      }}
    >
      {/* Radial glow overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(0,255,157,0.08) 0%, transparent 70%)",
        }}
      />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,157,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,157,1) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        {/* Eyebrow */}
        <p
          className="font-heading text-xs tracking-[0.4em] mb-6"
          style={{ color: "rgba(0,255,157,0.6)" }}
        >
          PRONTO PARA CRESCER?
        </p>

        {/* Heading */}
        <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
          Dados precisos.{" "}
          <span className="text-glow-green">Decisões melhores.</span>
        </h2>

        {/* Sub */}
        <p
          className="font-body text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          Agende uma conversa gratuita com nossos especialistas e descubra
          quanto dado você está perdendo agora.
        </p>

        {/* CTA Button */}
        <div className="mb-6">
          <ShimmerButton />
        </div>

        {/* Trust line */}
        <p
          className="font-body text-sm"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Sem compromisso · Diagnóstico gratuito · Resposta em 24h
        </p>
      </div>
    </section>
  );
}
