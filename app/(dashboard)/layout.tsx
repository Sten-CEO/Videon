import { Sidebar } from '@/components/layout/Sidebar'
import { getUser } from '@/lib/actions/auth'

// Dashboard layout with sidebar
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar
        user={{
          email: user?.email,
          fullName: user?.user_metadata?.full_name,
        }}
      />

      {/* Main content */}
      <main className="ml-64 min-h-screen p-8">
        {children}
      </main>
    </div>
  )
}
