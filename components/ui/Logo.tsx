import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
}

const sizeStyles = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

const textStyles = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
}

export function Logo({ size = 'md', showText = true, href = '/' }: LogoProps) {
  const content = (
    <div className="flex items-center gap-2">
      {/* Logo icon */}
      <div className={`${sizeStyles[size]} relative`}>
        <svg viewBox="0 0 40 40" fill="none" className="w-full h-full">
          {/* Background circle with gradient */}
          <circle cx="20" cy="20" r="20" fill="url(#logoGradient)" />

          {/* Play triangle */}
          <path
            d="M16 12L28 20L16 28V12Z"
            fill="white"
            fillOpacity="0.95"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="logoGradient" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <span className={`font-bold ${textStyles[size]} text-foreground`}>
          Videon
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="flex items-center gap-2 hover:opacity-90 transition-opacity">
        {content}
      </Link>
    )
  }

  return content
}
