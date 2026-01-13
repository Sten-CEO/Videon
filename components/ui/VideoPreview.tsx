'use client'

import { useState, useRef, useEffect } from 'react'

interface VideoPreviewProps {
  isLoading?: boolean
  thumbnailUrl?: string
  videoUrl?: string
  progress?: number
  showControls?: boolean
  className?: string
  statusText?: string
}

// Video preview component styled like a modern video player
export function VideoPreview({
  isLoading = false,
  thumbnailUrl,
  videoUrl,
  progress = 0,
  showControls = true,
  className = '',
  statusText = 'Generating video...',
}: VideoPreviewProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Update time display
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => setCurrentTime(video.currentTime)
    const handleLoadedMetadata = () => setDuration(video.duration)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoUrl])

  function togglePlay() {
    const video = videoRef.current
    if (!video) return

    if (isPlaying) {
      video.pause()
    } else {
      video.play()
    }
    setIsPlaying(!isPlaying)
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const videoProgress = duration > 0 ? (currentTime / duration) * 100 : progress

  return (
    <div className={`relative rounded-2xl overflow-hidden bg-background-tertiary border border-border ${className}`}>
      {/* Video container - 9:16 for vertical video */}
      <div className="relative bg-gradient-to-br from-background-secondary to-background-tertiary" style={{ aspectRatio: '9/16', maxHeight: '500px' }}>
        {/* Actual video element */}
        {videoUrl ? (
          <video
            ref={videoRef}
            src={videoUrl}
            className="absolute inset-0 w-full h-full object-contain bg-black"
            playsInline
            onClick={togglePlay}
          />
        ) : thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            {isLoading ? (
              <div className="flex flex-col items-center gap-3">
                <div className="relative w-16 h-16">
                  <svg className="animate-spin w-full h-full" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor"
                      strokeWidth="2"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      d="M4 12a8 8 0 018-8"
                    />
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span className="text-sm text-foreground-muted">{statusText}</span>
                {progress > 0 && progress < 100 && (
                  <span className="text-xs text-foreground-subtle">{Math.round(progress)}%</span>
                )}
              </div>
            ) : (
              <div className="text-foreground-subtle">
                <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
            )}
          </div>
        )}

        {/* Play button overlay for video */}
        {videoUrl && !isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/40 transition-colors"
          >
            <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <svg className="w-6 h-6 text-background ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Controls bar */}
      {showControls && (
        <div className="p-3 bg-background-secondary border-t border-border">
          {/* Progress bar */}
          <div className="relative h-1 bg-border rounded-full overflow-hidden mb-3">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-300"
              style={{ width: `${videoProgress}%` }}
            />
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                disabled={!videoUrl}
                className="text-foreground-muted hover:text-foreground transition-colors disabled:opacity-50"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Volume */}
              <button className="text-foreground-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
              </button>

              {/* Time */}
              <span className="text-xs text-foreground-subtle">
                {formatTime(currentTime)} / {formatTime(duration || 10)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Download */}
              {videoUrl && (
                <a
                  href={videoUrl}
                  download
                  className="text-foreground-muted hover:text-foreground transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </a>
              )}

              {/* Fullscreen */}
              <button className="text-foreground-muted hover:text-foreground transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
