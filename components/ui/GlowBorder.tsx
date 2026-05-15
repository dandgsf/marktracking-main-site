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
            ? 'bg-gradient-to-r from-accent via-accent-light to-accent bg-[length:200%_100%] animate-shimmer'
            : 'bg-border',
        ]
          .filter(Boolean)
          .join(' ')}
        aria-hidden="true"
      />
      {/* Inner content on dark background */}
      <div className="relative rounded-[11px] bg-bg">
        {children}
      </div>
    </div>
  )
}
