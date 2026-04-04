import type { Metadata } from "next";
import { Orbitron, Rajdhani } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
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
  ],
  authors: [{ name: "Marktracking" }],
  creator: "Marktracking",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marktracking.com.br"
  ),
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "/",
    siteName: "Marktracking",
    title: "Marktracking — Performance Solutions",
    description:
      "DevOps, Tracking e Growth para produtos digitais de alta escala.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marktracking — Performance Solutions",
    description:
      "DevOps, Tracking e Growth para produtos digitais de alta escala.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${orbitron.variable} ${rajdhani.variable}`}
    >
      <body className="min-h-screen bg-dark-bg text-white antialiased">
        {children}
      </body>
    </html>
  );
}
