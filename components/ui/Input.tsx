'use client'

import { useId, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, className = '', ...rest }: InputProps) {
  const id = useId()
  const [focused, setFocused] = useState(false)

  const hasValue =
    rest.value !== undefined
      ? String(rest.value).length > 0
      : rest.defaultValue !== undefined
        ? String(rest.defaultValue).length > 0
        : false

  const isFloating = focused || hasValue

  return (
    <div className="relative w-full">
      <input
        {...rest}
        id={id}
        onFocus={(e) => {
          setFocused(true)
          rest.onFocus?.(e)
        }}
        onBlur={(e) => {
          setFocused(false)
          rest.onBlur?.(e)
        }}
        placeholder=""
        className={[
          'peer w-full rounded-lg bg-dark-elevated px-4 pt-6 pb-2',
          'text-base text-white outline-none transition-all duration-200',
          'border',
          error
            ? 'border-red-500 focus:border-red-500 focus:shadow-[0_0_0_3px_rgba(239,68,68,0.15)]'
            : 'border-white/10 focus:border-neon-green focus:shadow-[0_0_0_3px_rgba(0,255,157,0.12)]',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <label
        htmlFor={id}
        className={[
          'pointer-events-none absolute left-4 font-body transition-all duration-200',
          isFloating
            ? 'top-2 text-xs text-neon-green/80'
            : 'top-1/2 -translate-y-1/2 text-base text-white/40',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
