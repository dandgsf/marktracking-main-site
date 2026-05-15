export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative py-16 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-medium text-text-primary">mt</span>
            <span className="w-px h-4 bg-border" />
            <span className="text-[10px] font-medium tracking-[0.2em] text-text-tertiary uppercase">
              Marktracking
            </span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6">
            <a href="#servicos" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Serviços
            </a>
            <a href="#processo" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Processo
            </a>
            <a href="#cases" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Cases
            </a>
            <a href="#contato" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Contato
            </a>
            <a href="/legal" className="text-xs text-text-muted hover:text-text-secondary transition-colors">
              Legal
            </a>
          </nav>

          {/* Copyright */}
          <p className="text-[10px] text-text-muted tracking-wide">
            © {currentYear} Marktracking. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}
