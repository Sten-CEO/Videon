import Link from 'next/link'
import { Card, StatusBadge, Button } from '@/components/ui'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { mockVideos } from '@/lib/data/mock'

export default function MyVideosPage() {
  const videos = mockVideos

  return (
    <div className="max-w-6xl">
      <DashboardHeader
        title="My Videos"
        description={`${videos.length} videos in your library`}
        action={{
          label: 'Create new video',
          href: '/generate',
        }}
      />

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm text-foreground-muted">Filter by:</span>
        <div className="flex gap-2">
          {['All', 'Ready', 'Generating', 'Draft'].map((filter) => (
            <button
              key={filter}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                filter === 'All'
                  ? 'bg-primary text-white'
                  : 'bg-background-tertiary text-foreground-muted hover:text-foreground border border-border'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Videos grid */}
      {videos.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <Link key={video.id} href={`/generate/${video.id}`}>
              <Card variant="interactive" padding="none" className="overflow-hidden h-full">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-background-tertiary to-background-secondary relative group">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-12 h-12 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center">
                      <svg className="w-6 h-6 text-background ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs text-white">
                    0:30
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold line-clamp-1">{video.title}</h3>
                    <StatusBadge status={video.status} />
                  </div>
                  <p className="text-sm text-foreground-muted line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-foreground-subtle">
                    <span>
                      {new Date(video.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex gap-2">
                      <button className="p-1 hover:text-foreground transition-colors" title="Download">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-1 hover:text-foreground transition-colors" title="Share">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button className="p-1 hover:text-error transition-colors" title="Delete">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card padding="lg" className="text-center">
          <div className="text-foreground-subtle mb-4">
            <svg className="w-16 h-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-foreground mb-2">No videos yet</h3>
            <p className="mb-6">Create your first marketing video with AI.</p>
          </div>
          <Link href="/generate">
            <Button variant="primary" size="lg">
              Create your first video
            </Button>
          </Link>
        </Card>
      )}
    </div>
  )
}
