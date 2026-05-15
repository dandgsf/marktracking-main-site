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
          'peer w-full rounded-xl bg-bg-elevated px-4 pt-6 pb-2',
          'text-sm text-text-primary outline-none transition-all duration-300',
          'border',
          error
            ? 'border-red-500/30 focus:border-red-500/50 focus:ring-1 focus:ring-red-500/20'
            : 'border-border focus:border-text-tertiary focus:ring-1 focus:ring-text-tertiary/20',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />
      <label
        htmlFor={id}
        className={[
          'pointer-events-none absolute left-4 transition-all duration-300',
          isFloating
            ? 'top-2 text-[10px] text-text-tertiary'
            : 'top-1/2 -translate-y-1/2 text-sm text-text-muted',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {label}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-red-400/80" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
