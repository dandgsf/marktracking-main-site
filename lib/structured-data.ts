/**
 * MARKTRACKING — Structured Data (JSON-LD)
 * Rich snippets for SEO: Organization, WebSite, Service
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Marktracking",
  alternateName: "Marktracking Performance Solutions",
  url: "https://marktracking.com.br",
  logo: "https://marktracking.com.br/logo.png",
  sameAs: [
    // Add social profiles when available
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    availableLanguage: ["Portuguese", "English"],
  },
  description:
    "Marktracking integra DevOps, Tracking e Growth para produtos digitais de alta escala.",
  foundingDate: "2023",
  areaServed: "BR",
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Marktracking — Performance Solutions",
  url: "https://marktracking.com.br",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://marktracking.com.br/?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Performance Solutions",
  provider: {
    "@type": "Organization",
    name: "Marktracking",
  },
  areaServed: {
    "@type": "Country",
    name: "Brasil",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Serviços de Performance",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "DevOps & Infraestrutura",
          description:
            "Arquitetura de infraestrutura robusta e escalável para produtos digitais.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tracking Setup",
          description:
            "Configuração completa de rastreamento para máxima precisão de dados.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Growth Analytics",
          description:
            "Análise de dados orientada a crescimento e tomada de decisão.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Data Layer",
          description:
            "Implementação de camada de dados estruturada e governada.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tag Management",
          description:
            "Gestão profissional de tags e pixels de marketing.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Performance Audit",
          description:
            "Auditoria completa de performance e otimização de conversão.",
        },
      },
    ],
  },
};
