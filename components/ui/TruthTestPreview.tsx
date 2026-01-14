'use client'

/**
 * Truth Test Preview Component
 *
 * Renders the HARDCODED TruthTestVideo component directly.
 * This bypasses ALL dynamic logic to prove Remotion is working.
 *
 * If you see:
 *   Scene 1: HOT PINK (#FF1493)
 *   Scene 2: CYAN (#00FFFF)
 *   Scene 3: LIME GREEN (#32CD32)
 *
 * Then Remotion is rendering correctly.
 * If you see anything else, there's a fundamental rendering issue.
 */

import React, { useState, useEffect, Suspense } from 'react'

interface TruthTestPreviewProps {
  className?: string
}

export const TruthTestPreview: React.FC<TruthTestPreviewProps> = ({
  className = ''
}) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('%c[TRUTH TEST PREVIEW] Component mounted', 'background: #f0f; color: #000; font-weight: bold;')
  }, [])

  if (hasError) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-red-900/20 border border-red-500/50 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-400 text-lg font-semibold mb-2">Truth Test Error</span>
          <span className="text-red-300 text-sm">Failed to load Truth Test component.</span>
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

  if (!isClient) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-gray-900 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-10 h-10 border-2 border-fuchsia-500/50 border-t-fuchsia-500 rounded-full animate-spin" />
          <span className="text-fuchsia-400 mt-3 text-sm font-mono">Loading Truth Test...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-black border-2 border-fuchsia-500 ${className}`}
      style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
    >
      {/* Truth Test Badge */}
      <div className="absolute top-2 left-2 z-50 px-2 py-1 bg-fuchsia-500 text-black text-xs font-bold rounded">
        🧪 TRUTH TEST MODE
      </div>

      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="text-fuchsia-400 font-mono">Loading hardcoded test...</span>
          </div>
        }>
          <TruthTestPlayerWrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Separate component to handle dynamic import
const TruthTestPlayerWrapper: React.FC = () => {
  const [components, setComponents] = useState<{
    Player: React.ComponentType<any> | null
    TruthTestVideo: React.ComponentType<any> | null
  }>({ Player: null, TruthTestVideo: null })

  useEffect(() => {
    console.log('%c[TRUTH TEST] Loading Player and TruthTestVideo...', 'color: #f0f;')

    Promise.all([
      import('@remotion/player'),
      import('@/remotion/TruthTestVideo')
    ]).then(([playerMod, truthTestMod]) => {
      console.log('%c[TRUTH TEST] Components loaded successfully!', 'color: #0f0; font-weight: bold;')
      setComponents({
        Player: playerMod.Player,
        TruthTestVideo: truthTestMod.TruthTestVideo
      })
    }).catch((err) => {
      console.error('%c[TRUTH TEST] Failed to load components:', 'color: #f00;', err)
    })
  }, [])

  if (!components.Player || !components.TruthTestVideo) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-fuchsia-500/50 border-t-fuchsia-500 rounded-full animate-spin" />
        <span className="text-fuchsia-400 mt-3 text-sm font-mono">Loading Remotion Player...</span>
      </div>
    )
  }

  const { Player, TruthTestVideo } = components

  return (
    <Player
      component={TruthTestVideo}
      inputProps={{}}  // Empty props - component ignores them
      durationInFrames={270}  // 3 scenes × 90 frames
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

// Simple Error Boundary
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
    console.error('%c[TRUTH TEST] Render error:', 'color: #f00; font-weight: bold;', error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export default TruthTestPreview
