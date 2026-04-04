import { ExternalLink } from 'lucide-react'

interface FooterLink {
  label: string
  href: string
  external?: boolean
}

const NAV_LINKS: FooterLink[] = [
  { label: 'Serviços', href: '#servicos' },
  { label: 'Processo', href: '#processo' },
  { label: 'Cases', href: '#cases' },
  { label: 'Contato', href: '#contato' },
]

const LEGAL_LINKS: FooterLink[] = [
  { label: 'Política de Privacidade', href: '/legal' },
  { label: 'LGPD Compliance', href: '/legal#lgpd' },
]

const SOCIAL_LINKS: FooterLink[] = [
  { label: 'LinkedIn', href: 'https://linkedin.com', external: true },
  { label: 'Instagram', href: 'https://instagram.com', external: true },
]

const CURRENT_YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="bg-dark-surface border-t border-white/5">
      {/* Main grid */}
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Column 1 — Brand */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="font-heading text-lg font-black tracking-[0.2em] text-glow-green">
                MARKTRACKING
              </span>
              <p className="font-body text-sm font-semibold tracking-[0.15em] text-white/40 uppercase mt-1">
                Performance Solutions
              </p>
            </div>
            <p className="font-body text-sm text-white/50 leading-relaxed max-w-xs">
              DevOps · Tracking · Growth para produtos digitais de alta escala.
            </p>
          </div>

          {/* Column 2 — Navigation */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xs font-semibold tracking-[0.2em] text-white/30 uppercase">
              Navegação
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-neon-green transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Legal / Social */}
          <div className="flex flex-col gap-4">
            <h3 className="font-heading text-xs font-semibold tracking-[0.2em] text-white/30 uppercase">
              Informações
            </h3>
            <ul className="flex flex-col gap-3" role="list">
              {LEGAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-body text-sm text-white/60 hover:text-neon-green transition-colors duration-200"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="font-body text-xs text-white/30 leading-relaxed mt-2">
              Marcas registradas de seus respectivos proprietários.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row lg:px-8">
          <p className="font-body text-xs text-white/30">
            © {CURRENT_YEAR} Marktracking. Todos os direitos reservados.
          </p>

          <ul className="flex items-center gap-6" role="list">
            {SOCIAL_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-body text-xs text-white/40 hover:text-neon-green transition-colors duration-200 inline-flex items-center gap-1"
                  aria-label={`${link.label} (abre em nova aba)`}
                >
                  {link.label}
                  <ExternalLink size={10} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  )
}
