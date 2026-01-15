'use client'

/**
 * VIDEO PREVIEW PLAYER
 *
 * THE ONLY preview component for videos.
 * Uses VideoRenderer which REQUIRES templateId: "BASE44_PREMIUM".
 *
 * NO LEGACY PREVIEWS. NO ALTERNATIVES.
 */

import React, { useState, useEffect, Suspense } from 'react'
import type { Base44Plan } from '@/lib/templates/base44'

interface VideoPreviewPlayerProps {
  plan: Base44Plan
  className?: string
}

export const VideoPreviewPlayer: React.FC<VideoPreviewPlayerProps> = ({
  plan,
  className = '',
}) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('%c[VIDEO PREVIEW] Mounting with plan:', 'background: #6366F1; color: #fff;')
    console.log('%c[VIDEO PREVIEW] templateId:', 'color: #6366F1;', plan.templateId)
    console.log('%c[VIDEO PREVIEW] brand:', 'color: #6366F1;', plan.brand?.name)
  }, [plan])

  if (hasError) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-red-900/20 border-2 border-red-500 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '600px', minHeight: '400px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <div className="text-red-400 text-xl font-bold mb-2">RENDER ERROR</div>
          <div className="text-red-300 text-sm mb-4">
            templateId: "{plan.templateId || 'MISSING'}"
          </div>
          <div className="text-red-200 text-xs">
            Only "BASE44_PREMIUM" is allowed
          </div>
          <button
            onClick={() => setHasError(false)}
            className="mt-6 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded text-red-300 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!isClient) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-gray-900 border border-gray-700 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '600px', minHeight: '400px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-indigo-400 mt-3 text-sm font-mono">Loading renderer...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-black border-2 border-indigo-500 ${className}`}
      style={{ aspectRatio: '9/16', maxHeight: '600px', minHeight: '400px' }}
    >
      {/* Template badge */}
      <div className="absolute top-3 left-3 z-50 px-3 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded shadow-lg">
        {plan.templateId || 'NO TEMPLATE'}
      </div>

      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="text-indigo-400 font-mono">Loading video...</span>
          </div>
        }>
          <PlayerWrapper plan={plan} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Player wrapper with dynamic imports
const PlayerWrapper: React.FC<{ plan: Base44Plan }> = ({ plan }) => {
  const [components, setComponents] = useState<{
    Player: React.ComponentType<any> | null
    VideoRenderer: React.ComponentType<any> | null
  }>({ Player: null, VideoRenderer: null })

  useEffect(() => {
    console.log('%c[PLAYER] Loading Remotion components...', 'color: #6366F1;')

    Promise.all([
      import('@remotion/player'),
      import('@/remotion/VideoRenderer')
    ]).then(([playerMod, rendererMod]) => {
      console.log('%c[PLAYER] ✓ Components loaded!', 'color: #00FF00;')
      setComponents({
        Player: playerMod.Player,
        VideoRenderer: rendererMod.VideoRenderer
      })
    }).catch((err) => {
      console.error('%c[PLAYER] ✗ Failed to load:', 'color: #FF0000;', err)
    })
  }, [])

  if (!components.Player || !components.VideoRenderer) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-indigo-400 mt-3 text-sm font-mono">Loading player...</span>
      </div>
    )
  }

  const { Player, VideoRenderer } = components

  // Calculate duration based on settings
  const baseDuration = 480
  const multiplier = plan.settings?.duration === 'short' ? 0.67
    : plan.settings?.duration === 'long' ? 1.17 : 1
  const totalDuration = Math.round(baseDuration * multiplier)

  return (
    <Player
      component={VideoRenderer}
      inputProps={{ plan }}
      durationInFrames={totalDuration}
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

// Error Boundary
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
    console.error('%c[VIDEO PREVIEW] Render error:', 'color: #FF0000;', error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export default VideoPreviewPlayer
