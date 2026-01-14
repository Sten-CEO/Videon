'use client'

/**
 * Beat-Driven Demo Preview Component
 *
 * Renders the Beat-Driven Demo showing all 5 patterns.
 * This proves that the new beat-based system creates dramatically
 * different visuals for each pattern.
 *
 * Patterns shown:
 * 1. SAAS_HERO_REVEAL - Bold headline → product reveal
 * 2. PROBLEM_TENSION - Slow tension build
 * 3. IMAGE_FOCUS_REVEAL - Image dominates
 * 4. PROOF_HIGHLIGHTS - Big stat number
 * 5. CTA_PUNCH - Urgent action
 */

import React, { useState, useEffect, Suspense } from 'react'

interface BeatDrivenPreviewProps {
  className?: string
}

export const BeatDrivenPreview: React.FC<BeatDrivenPreviewProps> = ({
  className = ''
}) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('%c[BEAT-DRIVEN PREVIEW] Component mounted', 'background: #0f0; color: #000; font-weight: bold;')
  }, [])

  if (hasError) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-red-900/20 border border-red-500/50 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-400 text-lg font-semibold mb-2">Beat-Driven Error</span>
          <span className="text-red-300 text-sm">Failed to load Beat-Driven Demo.</span>
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
          <div className="w-10 h-10 border-2 border-green-500/50 border-t-green-500 rounded-full animate-spin" />
          <span className="text-green-400 mt-3 text-sm font-mono">Loading Beat-Driven Demo...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-black border-2 border-green-500 ${className}`}
      style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
    >
      {/* Beat-Driven Badge */}
      <div className="absolute top-2 left-2 z-50 px-2 py-1 bg-green-500 text-black text-xs font-bold rounded">
        🎬 BEAT-DRIVEN DEMO
      </div>

      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="text-green-400 font-mono">Loading patterns...</span>
          </div>
        }>
          <BeatDrivenPlayerWrapper />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Separate component to handle dynamic import
const BeatDrivenPlayerWrapper: React.FC = () => {
  const [components, setComponents] = useState<{
    Player: React.ComponentType<any> | null
    BeatDrivenDemo: React.ComponentType<any> | null
  }>({ Player: null, BeatDrivenDemo: null })

  useEffect(() => {
    console.log('%c[BEAT-DRIVEN] Loading Player and BeatDrivenDemo...', 'color: #0f0;')

    Promise.all([
      import('@remotion/player'),
      import('@/remotion/BeatDrivenDemo')
    ]).then(([playerMod, demoMod]) => {
      console.log('%c[BEAT-DRIVEN] Components loaded successfully!', 'color: #0f0; font-weight: bold;')
      setComponents({
        Player: playerMod.Player,
        BeatDrivenDemo: demoMod.BeatDrivenDemo
      })
    }).catch((err) => {
      console.error('%c[BEAT-DRIVEN] Failed to load components:', 'color: #f00;', err)
    })
  }, [])

  if (!components.Player || !components.BeatDrivenDemo) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-green-500/50 border-t-green-500 rounded-full animate-spin" />
        <span className="text-green-400 mt-3 text-sm font-mono">Loading Remotion Player...</span>
      </div>
    )
  }

  const { Player, BeatDrivenDemo } = components

  return (
    <Player
      component={BeatDrivenDemo}
      inputProps={{}}
      durationInFrames={450}  // 5 scenes × 90 frames
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
    console.error('%c[BEAT-DRIVEN] Render error:', 'color: #f00; font-weight: bold;', error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export default BeatDrivenPreview
