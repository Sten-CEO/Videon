'use client'

/**
 * Creative Preview Component
 *
 * Uses the EXACT same CreativeVideo component as the render
 * to ensure preview matches the final video.
 */

import React, { useMemo, useState, useEffect, Suspense } from 'react'
import type { SceneSpec, ImageIntent } from '@/lib/creative'

interface CreativePreviewProps {
  scenes: SceneSpec[]
  providedImages?: ImageIntent[]
  className?: string
}

export const CreativePreview: React.FC<CreativePreviewProps> = ({
  scenes,
  providedImages,
  className = ''
}) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  // Ensure we're on the client before rendering Remotion
  useEffect(() => {
    setIsClient(true)
  }, [])

  const totalFrames = useMemo(() => {
    return scenes.reduce((sum, s) => sum + (s.durationFrames || 75), 0)
  }, [scenes])

  // Error boundary fallback
  if (hasError) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-red-900/20 border border-red-500/50 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-400 text-lg font-semibold mb-2">Preview Error</span>
          <span className="text-red-300 text-sm">The video preview encountered an error.</span>
          <button
            onClick={() => setHasError(false)}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // No scenes fallback
  if (!scenes || scenes.length === 0) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-gray-900 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-gray-400">No scenes to preview</span>
        </div>
      </div>
    )
  }

  // Loading state while Player loads (SSR disabled)
  if (!isClient) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-gray-900 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-gray-400 mt-3 text-sm">Loading preview...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-black ${className}`}
      style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
    >
      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={<div className="absolute inset-0 bg-black flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>}>
          <PlayerWrapper
            scenes={scenes}
            providedImages={providedImages || []}
            totalFrames={totalFrames}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Separate component to handle Player import and rendering
const PlayerWrapper: React.FC<{
  scenes: SceneSpec[]
  providedImages: ImageIntent[]
  totalFrames: number
}> = ({ scenes, providedImages, totalFrames }) => {
  const [components, setComponents] = useState<{
    Player: React.ComponentType<any> | null
    CreativeVideo: React.ComponentType<any> | null
  }>({ Player: null, CreativeVideo: null })

  useEffect(() => {
    // Load both Player and CreativeVideo together
    Promise.all([
      import('@remotion/player'),
      import('@/remotion/CreativeVideo')
    ]).then(([playerMod, videoMod]) => {
      setComponents({
        Player: playerMod.Player,
        CreativeVideo: videoMod.CreativeVideo
      })
    })
  }, [])

  if (!components.Player || !components.CreativeVideo) {
    return (
      <div className="absolute inset-0 bg-black flex items-center justify-center">
        <span className="text-gray-400">Loading player...</span>
      </div>
    )
  }

  const { Player, CreativeVideo } = components

  return (
    <Player
      component={CreativeVideo}
      inputProps={{
        scenes,
        providedImages
      }}
      durationInFrames={Math.max(totalFrames, 75)}
      fps={30}
      compositionWidth={1080}
      compositionHeight={1920}
      style={{
        width: '100%',
        height: '100%',
      }}
      controls
      autoPlay
      loop
    />
  )
}

// Simple Error Boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; onError: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onError: () => void }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error('[CreativePreview] Render error:', error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export default CreativePreview
