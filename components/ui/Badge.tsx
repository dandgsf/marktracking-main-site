interface BadgeProps {
  children: React.ReactNode
  color?: 'green' | 'blue' | 'white'
  className?: string
}

const colorClasses = {
  green: 'text-neon-green bg-neon-green/10 border border-neon-green/30',
  blue: 'text-neon-blue bg-neon-blue/10 border border-neon-blue/30',
  white: 'text-white/70 bg-white/5 border border-white/10',
}

export default function Badge({ children, color = 'green', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1',
        'font-heading text-xs uppercase tracking-wider',
        colorClasses[color],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
