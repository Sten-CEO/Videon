'use client'

/**
 * Base44 Premium Preview Component
 *
 * Renders the Base44 premium video template in preview mode.
 * Shows the 6-scene marketing video with demo content.
 */

import React, { useState, useEffect, Suspense } from 'react'
import { createDefaultPlan, castImagesToScenes } from '@/lib/templates/base44'

interface Base44PreviewProps {
  className?: string
  productName?: string
}

export const Base44Preview: React.FC<Base44PreviewProps> = ({
  className = '',
  productName = 'Acme',
}) => {
  const [hasError, setHasError] = useState(false)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    console.log('%c[BASE44 PREVIEW] Component mounted', 'background: #6366F1; color: #fff; font-weight: bold;')
  }, [])

  if (hasError) {
    return (
      <div
        className={`relative rounded-xl overflow-hidden bg-red-900/20 border border-red-500/50 ${className}`}
        style={{ aspectRatio: '9/16', maxHeight: '500px' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
          <span className="text-red-400 text-lg font-semibold mb-2">Base44 Error</span>
          <span className="text-red-300 text-sm">Failed to load Base44 Preview.</span>
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
          <div className="w-10 h-10 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
          <span className="text-indigo-400 mt-3 text-sm font-mono">Loading Base44 Premium...</span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative rounded-xl overflow-hidden bg-black border-2 border-indigo-500 ${className}`}
      style={{ aspectRatio: '9/16', maxHeight: '500px', minHeight: '300px' }}
    >
      {/* Base44 Badge */}
      <div className="absolute top-2 left-2 z-50 px-2 py-1 bg-indigo-500 text-white text-xs font-bold rounded">
        BASE44 PREMIUM
      </div>

      <ErrorBoundary onError={() => setHasError(true)}>
        <Suspense fallback={
          <div className="absolute inset-0 bg-black flex items-center justify-center">
            <span className="text-indigo-400 font-mono">Loading template...</span>
          </div>
        }>
          <Base44PlayerWrapper productName={productName} />
        </Suspense>
      </ErrorBoundary>
    </div>
  )
}

// Separate component to handle dynamic import
const Base44PlayerWrapper: React.FC<{ productName: string }> = ({ productName }) => {
  const [components, setComponents] = useState<{
    Player: React.ComponentType<any> | null
    Base44Video: React.ComponentType<any> | null
  }>({ Player: null, Base44Video: null })

  useEffect(() => {
    console.log('%c[BASE44] Loading Player and Base44Video...', 'color: #6366F1;')

    Promise.all([
      import('@remotion/player'),
      import('@/remotion/Base44Video')
    ]).then(([playerMod, videoMod]) => {
      console.log('%c[BASE44] Components loaded successfully!', 'color: #6366F1; font-weight: bold;')
      setComponents({
        Player: playerMod.Player,
        Base44Video: videoMod.Base44Video
      })
    }).catch((err) => {
      console.error('%c[BASE44] Failed to load components:', 'color: #f00;', err)
    })
  }, [])

  if (!components.Player || !components.Base44Video) {
    return (
      <div className="absolute inset-0 bg-black flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-2 border-indigo-500/50 border-t-indigo-500 rounded-full animate-spin" />
        <span className="text-indigo-400 mt-3 text-sm font-mono">Loading Remotion Player...</span>
      </div>
    )
  }

  const { Player, Base44Video } = components

  // Create demo plan with the product name
  const demoPlan = createDefaultPlan(productName)
  const imageCastings = castImagesToScenes(demoPlan.images)

  // Calculate total duration based on plan
  const totalDuration = demoPlan.scenes.reduce((sum, scene) => {
    const baseDurations: Record<string, number> = {
      HOOK: 75,
      PROBLEM: 90,
      SOLUTION: 90,
      DEMO: 90,
      PROOF: 75,
      CTA: 60,
    }
    return sum + (baseDurations[scene.role] || 75)
  }, 0)

  return (
    <Player
      component={Base44Video}
      inputProps={{
        plan: demoPlan,
        imageCastings,
      }}
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
    console.error('%c[BASE44] Render error:', 'color: #f00; font-weight: bold;', error)
    this.props.onError()
  }

  render() {
    if (this.state.hasError) {
      return null
    }
    return this.props.children
  }
}

export default Base44Preview
