import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import SmoothScroll from "@/components/ui/SmoothScroll";
import {
  organizationSchema,
  websiteSchema,
  serviceSchema,
} from "@/lib/structured-data";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marktracking.com.br"
  ),
  title: {
    default: "Marktracking — Performance Solutions",
    template: "%s | Marktracking",
  },
  description:
    "Marktracking integra DevOps, Tracking e Growth para produtos digitais de alta escala. Arquitetura de dados robusta, rastreamento preciso e crescimento sustentável.",
  keywords: [
    "tracking",
    "performance",
    "devops",
    "growth analytics",
    "data layer",
    "GTM",
    "tag management",
    "GA4",
    "Meta Ads",
    "Google Ads",
    "LGPD",
  ],
  authors: [{ name: "Marktracking", url: "https://marktracking.com.br" }],
  creator: "Marktracking",
  publisher: "Marktracking",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Marktracking",
    title: "Marktracking — Performance Solutions",
    description:
      "DevOps, Tracking e Growth para produtos digitais de alta escala. Arquitetura de dados robusta e rastreamento preciso.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Marktracking — Performance Solutions",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marktracking — Performance Solutions",
    description:
      "DevOps, Tracking e Growth para produtos digitais de alta escala.",
    images: ["/og-image.png"],
    creator: "@marktracking",
  },
  alternates: {
    canonical: "/",
  },
  category: "technology",
  classification: "Business & Technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA manifest */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#030303" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Marktracking" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Structured Data — JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(serviceSchema),
          }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} font-sans min-h-[100dvh] bg-bg text-text-primary antialiased`}>
        {/* Background layers */}
        <div className="mesh-gradient" aria-hidden="true" />
        <div className="noise-overlay" aria-hidden="true" />

        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent focus:text-bg focus:px-4 focus:py-2 focus:rounded-full focus:text-sm focus:font-medium"
        >
          Pular para o conteúdo principal
        </a>

        <SmoothScroll>
          <Nav />
          <main id="main-content" className="relative z-10">
            {children}
          </main>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
