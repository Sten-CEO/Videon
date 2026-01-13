import Link from 'next/link'
import { Logo } from '@/components/ui'

// Auth pages layout - minimal with logo
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header with logo */}
      <header className="h-16 flex items-center px-6 border-b border-border">
        <Logo size="md" href="/" />
      </header>

      {/* Centered content */}
      <main className="flex-1 flex items-center justify-center p-6">
        {children}
      </main>

      {/* Simple footer */}
      <footer className="py-4 px-6 text-center text-sm text-foreground-subtle border-t border-border">
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
        {' · '}
        <Link href="/privacy" className="hover:text-foreground transition-colors">
          Privacy
        </Link>
      </footer>
    </div>
  )
}
