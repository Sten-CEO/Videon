import { HTMLAttributes, forwardRef } from 'react'
import type { VideoStatus } from '@/lib/types'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info'

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-background-tertiary text-foreground-muted border-border',
  success: 'bg-success/10 text-success border-success/20',
  warning: 'bg-warning/10 text-warning border-warning/20',
  error: 'bg-error/10 text-error border-error/20',
  info: 'bg-primary/10 text-primary border-primary/20',
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ variant = 'default', className = '', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={`
          inline-flex items-center px-2.5 py-0.5
          text-xs font-medium rounded-full border
          ${variantStyles[variant]}
          ${className}
        `}
        {...props}
      >
        {children}
      </span>
    )
  }
)

Badge.displayName = 'Badge'

// Helper component for video status badges
interface StatusBadgeProps {
  status: VideoStatus
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config: Record<VideoStatus, { variant: BadgeVariant; label: string }> = {
    draft: { variant: 'default', label: 'Draft' },
    generating: { variant: 'warning', label: 'Generating' },
    ready: { variant: 'success', label: 'Ready' },
    failed: { variant: 'error', label: 'Failed' },
  }

  const { variant, label } = config[status]

  return (
    <Badge variant={variant}>
      {status === 'generating' && (
        <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current animate-pulse" />
      )}
      {label}
    </Badge>
  )
}
