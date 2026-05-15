'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

interface NavLink {
  label: string
  href: string
}

const NAV_LINKS: NavLink[] = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Cases', href: '#cases' },
  { label: 'Contato', href: '#contato' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      {/* Floating pill navbar */}
      <header
        className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-2xl border border-border shadow-[0_8px_32px_rgba(0,0,0,0.4)]'
            : 'bg-transparent border border-transparent'
        }`}
        style={{ borderRadius: '9999px' }}
      >
        <nav className="flex items-center gap-1 px-2 py-2">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-2 px-4 py-2 select-none"
            aria-label="Marktracking — home"
          >
            <span className="font-mono text-sm font-medium tracking-tight text-text-primary">
              mt
            </span>
            <span className="w-px h-4 bg-border" />
            <span className="text-[10px] font-medium tracking-[0.2em] text-text-tertiary uppercase">
              Marktracking
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-0.5">
            {NAV_LINKS.map((link) => (
              <DesktopNavLink key={link.href} href={link.href}>
                {link.label}
              </DesktopNavLink>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:block pl-2">
            <a
              href="#contato"
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-wide text-bg bg-text-primary rounded-full transition-all duration-300 hover:bg-text-secondary"
            >
              <span>Falar Agora</span>
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-bg/10 transition-transform duration-300 group-hover:translate-x-0.5">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="text-bg">
                  <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center p-2 text-text-secondary hover:text-text-primary transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={18} strokeWidth={1.5} /> : <Menu size={18} strokeWidth={1.5} />}
          </button>
        </nav>
      </header>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col bg-bg/95 backdrop-blur-3xl md:hidden"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                  className="text-2xl font-medium tracking-tight text-text-secondary hover:text-text-primary transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#contato"
                onClick={closeMobile}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07, duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                className="mt-4 px-8 py-3 text-sm font-medium tracking-wide text-bg bg-text-primary rounded-full hover:bg-text-secondary transition-colors"
              >
                Falar Agora
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

/* ---- Desktop nav link with animated underline ---- */
function DesktopNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="relative px-4 py-2 text-xs font-medium tracking-wide text-text-secondary hover:text-text-primary transition-colors duration-300 group"
    >
      {children}
      <span className="absolute bottom-1 left-4 right-4 h-px origin-center scale-x-0 bg-text-primary/50 transition-transform duration-300 group-hover:scale-x-100" />
    </a>
  )
}
