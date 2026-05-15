'use client'

interface SectionDividerProps {
  variant?: 'wave' | 'glow' | 'data'
}

export default function SectionDivider({ variant = 'glow' }: SectionDividerProps) {
  if (variant === 'wave') {
    return (
      <div className="relative h-24 md:h-32 overflow-hidden">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="absolute bottom-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 60C240 20 480 100 720 60C960 20 1200 100 1440 60V120H0V60Z"
            fill="url(#wave-gradient)"
            fillOpacity="0.05"
          />
          <path
            d="M0 80C240 40 480 120 720 80C960 40 1200 120 1440 80V120H0V80Z"
            fill="url(#wave-gradient-2)"
            fillOpacity="0.03"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="1440" y2="0">
              <stop stopColor="#22c55e" />
               <stop offset="0.5" stopColor="#4ade80" />
               <stop offset="1" stopColor="#22c55e" />
             </linearGradient>
             <linearGradient id="wave-gradient-2" x1="0" y1="0" x2="1440" y2="0">
               <stop stopColor="#4ade80" />
               <stop offset="1" stopColor="#22c55e" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    )
  }

  if (variant === 'data') {
    return (
      <div className="relative h-16 md:h-24 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-accent to-transparent"
              style={{
                width: `${Math.random() * 200 + 100}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: Math.random() * 0.2 + 0.05,
                animation: `pulse ${Math.random() * 3 + 2}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-bg via-transparent to-bg" />
      </div>
    )
  }

  // Glow variant (default)
  return (
    <div className="relative h-px">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, #22c55e 20%, #4ade80 50%, #22c55e 80%, transparent 100%)',
          opacity: 0.2,
        }}
      />
      <div
        className="absolute inset-x-0 top-0 h-8"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(34,197,94,0.02) 20%, rgba(74,222,128,0.02) 50%, rgba(34,197,94,0.02) 80%, transparent 100%)',
        }}
      />
    </div>
  )
}
