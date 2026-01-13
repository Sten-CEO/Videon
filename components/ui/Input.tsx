'use client'

import { InputHTMLAttributes, TextareaHTMLAttributes, forwardRef } from 'react'

// Base input styles
const baseStyles = `
  w-full bg-background-secondary border border-border rounded-xl
  px-4 py-3 text-foreground placeholder:text-foreground-subtle
  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
  transition-all duration-200
  disabled:opacity-50 disabled:cursor-not-allowed
`

// Input component
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground-muted mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`${baseStyles} ${error ? 'border-error focus:border-error focus:ring-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

// Textarea component
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-foreground-muted mb-2">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          className={`${baseStyles} resize-none ${error ? 'border-error focus:border-error focus:ring-error' : ''} ${className}`}
          {...props}
        />
        {error && (
          <p className="mt-1.5 text-sm text-error">{error}</p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'
