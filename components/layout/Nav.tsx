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

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const closeMobile = () => setMobileOpen(false)

  return (
    <>
      <header
        className={`glass-nav fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'border-b border-white/10' : 'border-b border-transparent'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <a
            href="#"
            className="flex items-baseline gap-2 select-none"
            aria-label="Marktracking — home"
          >
            <span className="font-heading text-lg font-black tracking-[0.2em] text-glow-green">
              MT
            </span>
            <span className="font-heading text-[0.65rem] font-semibold tracking-[0.25em] text-white/80 uppercase">
              MARKTRACKING
            </span>
          </a>

          {/* Desktop links */}
          <ul className="hidden items-center gap-8 md:flex" role="list">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <DesktopNavLink href={link.href}>{link.label}</DesktopNavLink>
              </li>
            ))}
          </ul>

          {/* Desktop CTA */}
          <div className="hidden md:flex">
            <a
              href="#contato"
              className="font-body font-semibold tracking-wider text-sm text-neon-green border border-neon-green/50 px-5 py-2 rounded-lg transition-all duration-200 hover:border-neon-green hover:bg-neon-green/10 hover:shadow-[0_0_16px_rgba(0,255,157,0.25)]"
            >
              Falar Agora
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden items-center justify-center text-white/70 hover:text-neon-green transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex flex-col bg-dark-bg/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex-1 flex flex-col items-center justify-center gap-10">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobile}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07, duration: 0.3 }}
                  className="font-heading text-2xl font-semibold tracking-widest text-white/70 hover:text-glow-green transition-colors uppercase"
                >
                  {link.label}
                </motion.a>
              ))}

              <motion.a
                href="#contato"
                onClick={closeMobile}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.07, duration: 0.3 }}
                className="mt-4 font-body font-semibold tracking-wider text-base text-neon-green border border-neon-green/50 px-8 py-3 rounded-lg hover:bg-neon-green/10 hover:border-neon-green transition-all duration-200"
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

interface DesktopNavLinkProps {
  href: string
  children: React.ReactNode
}

function DesktopNavLink({ href, children }: DesktopNavLinkProps) {
  return (
    <a
      href={href}
      className="font-body font-medium tracking-wider text-sm text-white/70 hover:text-neon-green transition-colors relative group"
    >
      {children}
      <span
        className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-neon-green transition-transform duration-300 group-hover:scale-x-100"
      />
    </a>
  )
}
