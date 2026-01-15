import Link from 'next/link'
import { Button } from '@/components/ui'

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
    icon?: React.ReactNode
  }
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
          {title}
        </h1>
        {description && (
          <p className="text-[#52525B] mt-1">{description}</p>
        )}
      </div>

      {action && (
        action.href ? (
          <Link href={action.href}>
            <Button variant="primary" size="lg">
              {action.icon}
              {action.label}
            </Button>
          </Link>
        ) : (
          <Button variant="primary" size="lg" onClick={action.onClick}>
            {action.icon}
            {action.label}
          </Button>
        )
      )}
    </header>
  )
}
