interface GlowBorderProps {
  children: React.ReactNode
  className?: string
  active?: boolean
}

export default function GlowBorder({ children, className = '', active = true }: GlowBorderProps) {
  return (
    <div className={['relative rounded-xl p-px', className].filter(Boolean).join(' ')}>
      {/* Gradient border layer */}
      <div
        className={[
          'absolute inset-0 rounded-xl',
          active
            ? 'bg-gradient-to-r from-neon-green via-neon-blue to-neon-green bg-[length:200%_100%] animate-shimmer'
            : 'bg-white/10',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
      {/* Inner content on dark background */}
      <div className="relative rounded-[11px] bg-dark-bg">
        {children}
      </div>
    </div>
  )
}
