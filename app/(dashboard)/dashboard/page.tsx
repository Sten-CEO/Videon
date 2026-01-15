import Link from 'next/link'
import { Button, Card } from '@/components/ui'
import { getUser } from '@/lib/actions/auth'
import { getUserVideos, getDashboardStats } from '@/lib/database'

// Status badge component
function StatusBadge({ status }: { status: string }) {
  const styles = {
    ready: 'bg-[#D1FAE5] text-[#059669]',
    generating: 'bg-[#FEF3C7] text-[#D97706]',
    draft: 'bg-[#F5F5F4] text-[#52525B]',
    failed: 'bg-[#FEE2E2] text-[#DC2626]',
  }
  const labels = {
    ready: 'Ready',
    generating: 'Generating',
    draft: 'Draft',
    failed: 'Failed',
  }

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

export default async function DashboardPage() {
  const user = await getUser()
  const videos = await getUserVideos()
  const stats = await getDashboardStats()

  const recentVideos = videos.slice(0, 4)
  const userName = user?.user_metadata?.full_name || 'there'

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Welcome back, {userName}
            </h1>
            <p className="text-[#52525B]">
              Here&apos;s what&apos;s happening with your videos.
            </p>
          </div>
          <Link href="/generate">
            <Button variant="primary" size="lg">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create video
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0FDFA] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-[#52525B] mb-1">Total Videos</div>
          <div className="text-3xl font-bold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
            {stats?.totalVideos || 0}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#D1FAE5] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#059669]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-[#52525B] mb-1">Ready</div>
          <div className="text-3xl font-bold text-[#059669]" style={{ fontFamily: 'var(--font-display)' }}>
            {stats?.readyVideos || 0}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#D97706]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-[#52525B] mb-1">Generating</div>
          <div className="text-3xl font-bold text-[#D97706]" style={{ fontFamily: 'var(--font-display)' }}>
            {stats?.generatingVideos || 0}
          </div>
        </Card>

        <Card variant="elevated" padding="lg">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFEDD5] flex items-center justify-center">
              <svg className="w-5 h-5 text-[#F97316]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
          </div>
          <div className="text-sm text-[#52525B] mb-1">Remaining</div>
          <div className="text-3xl font-bold text-[#F97316]" style={{ fontFamily: 'var(--font-display)' }}>
            {stats?.videosRemaining ?? 3}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/generate">
          <Card variant="elevated" padding="lg" hover className="h-full group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center text-white shadow-lg shadow-[#0D9488]/20 group-hover:shadow-xl group-hover:shadow-[#0D9488]/30 transition-shadow">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#18181B] text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Create New Video
                </h3>
                <p className="text-sm text-[#52525B]">
                  Start generating a professional marketing video
                </p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/brand-settings">
          <Card variant="elevated" padding="lg" hover className="h-full group">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#F97316] to-[#FB923C] flex items-center justify-center text-white shadow-lg shadow-[#F97316]/20 group-hover:shadow-xl group-hover:shadow-[#F97316]/30 transition-shadow">
                <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#18181B] text-lg" style={{ fontFamily: 'var(--font-display)' }}>
                  Brand Settings
                </h3>
                <p className="text-sm text-[#52525B]">
                  Configure your brand assets and colors
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Videos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
            Recent Videos
          </h2>
          <Link
            href="/my-videos"
            className="text-sm font-medium text-[#0D9488] hover:text-[#0F766E] transition-colors flex items-center gap-1"
          >
            View all
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {recentVideos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {recentVideos.map((video) => (
              <Link key={video.id} href={`/generate/${video.id}`}>
                <Card variant="elevated" padding="none" hover className="overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center relative overflow-hidden">
                    {video.thumbnail_url ? (
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center mx-auto mb-2">
                          <svg className="w-7 h-7 text-[#0D9488]" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                          </svg>
                        </div>
                      </div>
                    )}

                    {/* Status overlay for generating */}
                    {video.status === 'generating' && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <div className="text-center">
                          <svg className="w-8 h-8 text-[#0D9488] animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <p className="text-sm font-medium text-[#0D9488]">
                            Generating... {video.generation_progress}%
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-[#18181B] line-clamp-1">{video.title}</h3>
                      <StatusBadge status={video.status} />
                    </div>
                    {video.description && (
                      <p className="text-sm text-[#52525B] line-clamp-1 mb-2">
                        {video.description}
                      </p>
                    )}
                    <p className="text-xs text-[#A1A1AA]">
                      {new Date(video.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <Card variant="elevated" padding="xl" className="text-center">
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                No videos yet
              </h3>
              <p className="text-[#52525B] mb-6">
                Create your first marketing video and watch your ideas come to life.
              </p>
              <Link href="/generate">
                <Button variant="primary" size="lg">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create your first video
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </div>

      {/* Tips Section */}
      <Card variant="gradient" padding="lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[#0D9488]/10 flex items-center justify-center flex-shrink-0">
            <svg className="w-5 h-5 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              Pro Tip
            </h3>
            <p className="text-sm text-[#52525B]">
              For best results, describe your product&apos;s key benefits and target audience clearly.
              The more context you provide, the better your video will be!
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
