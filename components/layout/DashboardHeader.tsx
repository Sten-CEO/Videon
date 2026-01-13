'use client'

import { Button } from '@/components/ui'
import { signOut } from '@/lib/actions/auth'

interface DashboardHeaderProps {
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
}

export function DashboardHeader({ title, description, action }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">{title}</h1>
        {description && (
          <p className="text-foreground-muted mt-1">{description}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {action && (
          action.href ? (
            <a href={action.href}>
              <Button variant="primary" size="sm">
                {action.label}
              </Button>
            </a>
          ) : (
            <Button variant="primary" size="sm" onClick={action.onClick}>
              {action.label}
            </Button>
          )
        )}

        {/* Sign out button */}
        <form action={signOut}>
          <Button type="submit" variant="ghost" size="sm">
            Sign out
          </Button>
        </form>
      </div>
    </header>
  )
}
