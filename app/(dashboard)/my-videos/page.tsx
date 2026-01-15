import Link from 'next/link'
import { Card, Button } from '@/components/ui'
import { getUserVideos } from '@/lib/database'

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
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full ${styles[status as keyof typeof styles] || styles.draft}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

export default async function MyVideosPage() {
  const videos = await getUserVideos()

  return (
    <div className="max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            My Videos
          </h1>
          <p className="text-[#52525B]">
            {videos.length} video{videos.length !== 1 ? 's' : ''} in your library
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

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="text-sm text-[#52525B]">Filter by:</span>
        <div className="flex gap-2">
          {['All', 'Ready', 'Generating', 'Draft', 'Failed'].map((filter, index) => (
            <button
              key={filter}
              className={`px-4 py-2 text-sm font-medium rounded-xl transition-all ${
                index === 0
                  ? 'bg-gradient-to-r from-[#0D9488] to-[#14B8A6] text-white shadow-sm'
                  : 'bg-white text-[#52525B] hover:text-[#18181B] border border-[#E4E4E7] hover:border-[#0D9488]/30'
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
              <Card variant="elevated" padding="none" hover className="overflow-hidden h-full group">
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] relative overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center">
                        <svg className="w-7 h-7 text-[#0D9488]" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M8 5v14l11-7z"/>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-xl">
                      <svg className="w-6 h-6 text-[#0D9488] ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration badge */}
                  {video.duration_seconds && (
                    <div className="absolute bottom-2 right-2 px-2 py-1 rounded-lg bg-black/70 text-xs text-white font-medium">
                      {Math.floor(video.duration_seconds / 60)}:{(video.duration_seconds % 60).toString().padStart(2, '0')}
                    </div>
                  )}

                  {/* Generating overlay */}
                  {video.status === 'generating' && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <svg className="w-8 h-8 text-[#0D9488] animate-spin mx-auto mb-2" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <p className="text-sm font-medium text-[#0D9488]">
                          {video.generation_progress}%
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
                    <p className="text-sm text-[#52525B] line-clamp-2 mb-3">
                      {video.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#A1A1AA]">
                      {new Date(video.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <div className="flex gap-1">
                      <button
                        className="p-2 rounded-lg hover:bg-[#F5F5F4] text-[#A1A1AA] hover:text-[#0D9488] transition-colors"
                        title="Download"
                        onClick={(e) => e.preventDefault()}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-[#F5F5F4] text-[#A1A1AA] hover:text-[#0D9488] transition-colors"
                        title="Share"
                        onClick={(e) => e.preventDefault()}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                      </button>
                      <button
                        className="p-2 rounded-lg hover:bg-[#FEE2E2] text-[#A1A1AA] hover:text-[#DC2626] transition-colors"
                        title="Delete"
                        onClick={(e) => e.preventDefault()}
                      >
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
        <Card variant="elevated" padding="xl" className="text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
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
  )
}
