'use client'

import { ButtonHTMLAttributes, forwardRef } from 'react'

// Button variants for different use cases
type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'accent'
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  fullWidth?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: `
    bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white
    shadow-sm hover:shadow-lg hover:shadow-[#0D9488]/20
    hover:-translate-y-0.5 active:translate-y-0
  `,
  accent: `
    bg-gradient-to-r from-[#F97316] to-[#FB923C] text-white
    shadow-sm hover:shadow-lg hover:shadow-[#F97316]/20
    hover:-translate-y-0.5 active:translate-y-0
  `,
  secondary: `
    bg-white text-[#18181B] border border-[#E4E4E7]
    shadow-sm hover:shadow-md hover:border-[#D4D4D8]
    hover:-translate-y-0.5 active:translate-y-0
  `,
  outline: `
    bg-transparent border border-[#E4E4E7] text-[#18181B]
    hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-[#F0FDFA]
  `,
  ghost: `
    bg-transparent text-[#52525B]
    hover:bg-[#F5F5F4] hover:text-[#18181B]
  `,
  danger: `
    bg-gradient-to-r from-[#EF4444] to-[#F87171] text-white
    shadow-sm hover:shadow-lg hover:shadow-[#EF4444]/20
    hover:-translate-y-0.5 active:translate-y-0
  `,
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5 rounded-lg',
  md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
  lg: 'px-6 py-3 text-base gap-2 rounded-xl',
  xl: 'px-8 py-4 text-lg gap-3 rounded-2xl',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({
    variant = 'primary',
    size = 'md',
    isLoading = false,
    fullWidth = false,
    icon,
    iconPosition = 'left',
    className = '',
    disabled,
    children,
    ...props
  }, ref) => {
    const iconElement = icon && (
      <span className={`flex-shrink-0 ${isLoading ? 'opacity-0' : ''}`}>
        {icon}
      </span>
    )

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          relative inline-flex items-center justify-center
          font-medium transition-all duration-200 ease-out
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0D9488] focus-visible:ring-offset-2
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${fullWidth ? 'w-full' : ''}
          ${className}
        `}
        {...props}
      >
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12" cy="12" r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          </span>
        )}
        <span className={`inline-flex items-center gap-2 ${isLoading ? 'opacity-0' : ''}`}>
          {iconPosition === 'left' && iconElement}
          {children}
          {iconPosition === 'right' && iconElement}
        </span>
      </button>
    )
  }
)

Button.displayName = 'Button'
