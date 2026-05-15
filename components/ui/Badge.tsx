interface BadgeProps {
  children: React.ReactNode
  color?: 'green' | 'emerald' | 'white'
  className?: string
}

const colorClasses = {
  green: 'text-accent bg-accent-dim border border-accent/20',
  emerald: 'text-accent-light bg-accent-dim border border-accent-light/20',
  white: 'text-text-secondary bg-white/5 border border-border',
}

export default function Badge({ children, color = 'green', className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center rounded-full px-3 py-1',
        'text-[10px] font-medium uppercase tracking-[0.15em]',
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
