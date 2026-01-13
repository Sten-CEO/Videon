import Link from 'next/link'
import { Button, Card, StatusBadge } from '@/components/ui'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { mockVideos } from '@/lib/data/mock'
import { getUser } from '@/lib/actions/auth'

export default async function DashboardPage() {
  const user = await getUser()
  const recentVideos = mockVideos.slice(0, 4)

  // Calculate stats
  const stats = {
    totalVideos: mockVideos.length,
    readyVideos: mockVideos.filter(v => v.status === 'ready').length,
    generatingVideos: mockVideos.filter(v => v.status === 'generating').length,
    draftVideos: mockVideos.filter(v => v.status === 'draft').length,
  }

  return (
    <div className="max-w-6xl">
      <DashboardHeader
        title={`Welcome back${user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}`}
        description="Here's what's happening with your videos."
        action={{
          label: 'Create new video',
          href: '/generate',
        }}
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card padding="md">
          <div className="text-sm text-foreground-muted mb-1">Total Videos</div>
          <div className="text-3xl font-bold">{stats.totalVideos}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted mb-1">Ready</div>
          <div className="text-3xl font-bold text-success">{stats.readyVideos}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted mb-1">Generating</div>
          <div className="text-3xl font-bold text-warning">{stats.generatingVideos}</div>
        </Card>
        <Card padding="md">
          <div className="text-sm text-foreground-muted mb-1">Drafts</div>
          <div className="text-3xl font-bold text-foreground-subtle">{stats.draftVideos}</div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <Link href="/generate">
          <Card variant="interactive" padding="lg" className="h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Create New Video</h3>
                <p className="text-sm text-foreground-muted">Start generating a new marketing video</p>
              </div>
            </div>
          </Card>
        </Link>

        <Link href="/brand-settings">
          <Card variant="interactive" padding="lg" className="h-full">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold">Brand Settings</h3>
                <p className="text-sm text-foreground-muted">Configure your brand assets</p>
              </div>
            </div>
          </Card>
        </Link>
      </div>

      {/* Recent Videos */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Recent Videos</h2>
          <Link href="/my-videos" className="text-sm text-primary hover:text-primary-hover transition-colors">
            View all
          </Link>
        </div>

        {recentVideos.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {recentVideos.map((video) => (
              <Link key={video.id} href={`/generate/${video.id}`}>
                <Card variant="interactive" padding="none" className="overflow-hidden">
                  {/* Thumbnail */}
                  <div className="aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary flex items-center justify-center">
                    <svg className="w-12 h-12 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                      <StatusBadge status={video.status} />
                    </div>
                    <p className="text-sm text-foreground-muted line-clamp-1 mb-2">
                      {video.description}
                    </p>
                    <p className="text-xs text-foreground-subtle">
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
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
          <Card padding="lg" className="text-center">
            <div className="text-foreground-subtle mb-4">
              <svg className="w-12 h-12 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              <p>No videos yet. Create your first one!</p>
            </div>
            <Link href="/generate">
              <Button variant="primary">Create your first video</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}
