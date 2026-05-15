interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={[
        'bezel-outer',
        hover
          ? 'transition-all duration-500 hover:bg-white/[0.06] cursor-pointer'
          : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="bezel-inner">
        {children}
      </div>
    </div>
  )
}
