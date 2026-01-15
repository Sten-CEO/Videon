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
    <div className="min-h-screen bg-[#FAFAF9]">
      {/* Sidebar */}
      <Sidebar
        user={{
          email: user?.email,
          fullName: user?.user_metadata?.full_name,
        }}
      />

      {/* Main content - adjusts based on sidebar width */}
      <main className="ml-[260px] min-h-screen transition-all duration-300">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
