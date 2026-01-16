'use client'

/**
 * PREMIUM VIDEO PLAYER
 *
 * No slide transitions - elements animate in/out on a stable canvas.
 * Background morphs smoothly between scenes.
 * Cinematic, Base44-level quality.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { VideoPlan, Scene, SceneElement, TextElement, BadgeElement } from '@/lib/video-components/types'
import { getBackgroundCSS } from '@/lib/video-components/backgrounds'
import { badgeVariants } from '@/lib/video-components/styles'

interface PremiumVideoPlayerProps {
  plan: VideoPlan
  autoPlay?: boolean
  loop?: boolean
  showControls?: boolean
  className?: string
}

// Premium easing curves
const EASING = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  elegant: 'cubic-bezier(0.16, 1, 0.3, 1)',
}

// Element animation styles
function getElementAnimation(
  isVisible: boolean,
  isExiting: boolean,
  index: number,
  elementType: string
): React.CSSProperties {
  const baseDelay = index * 0.12
  const duration = 0.7

  if (!isVisible && !isExiting) {
    return { opacity: 0, transform: 'translateY(30px) scale(0.95)' }
  }

  if (isExiting) {
    return {
      opacity: 0,
      transform: 'translateY(-20px) scale(0.98)',
      transition: `all 0.4s ${EASING.smooth}`,
    }
  }

  // Entering animation
  return {
    opacity: 1,
    transform: 'translateY(0) scale(1)',
    transition: `all ${duration}s ${EASING.elegant} ${baseDelay}s`,
  }
}

// Get text size based on style and content length
function getTextSize(style: string, contentLength: number): string {
  // Reduce size for longer text
  const lengthFactor = contentLength > 30 ? 0.8 : contentLength > 20 ? 0.9 : 1

  const baseSizes: Record<string, number> = {
    hero: 3.5,
    headline: 2.2,
    subtitle: 1.3,
    body: 1,
    caption: 0.85,
    cta: 1.2,
  }

  const size = (baseSizes[style] || 1.5) * lengthFactor
  return `${size}rem`
}

// Render a single element with proper constraints
function ElementView({
  element,
  isVisible,
  isExiting,
  index,
}: {
  element: SceneElement
  isVisible: boolean
  isExiting: boolean
  index: number
}) {
  const elementType = element.type === 'text'
    ? (element as TextElement).style.style
    : element.type

  const animationStyle = getElementAnimation(isVisible, isExiting, index, elementType)

  if (element.type === 'text') {
    const textEl = element as TextElement
    const fontSize = getTextSize(textEl.style.style, textEl.content.length)

    return (
      <div
        style={{
          ...animationStyle,
          fontSize,
          fontWeight: textEl.style.style === 'hero' ? 800 : textEl.style.style === 'headline' ? 700 : 500,
          color: textEl.style.color || '#ffffff',
          textAlign: 'center',
          lineHeight: textEl.style.style === 'hero' ? 1.1 : 1.3,
          letterSpacing: textEl.style.style === 'hero' ? '-0.03em' : '-0.01em',
          maxWidth: '88%',
          margin: '0 auto',
          textShadow: '0 4px 30px rgba(0,0,0,0.3)',
          fontFamily: 'var(--font-display), system-ui, sans-serif',
          wordBreak: 'break-word',
          willChange: 'transform, opacity',
        }}
      >
        {textEl.content}
      </div>
    )
  }

  if (element.type === 'badge') {
    const badgeEl = element as BadgeElement
    const variantKey = badgeEl.variant ?? 'primary'
    const variant = badgeVariants[variantKey as keyof typeof badgeVariants] ?? badgeVariants.primary

    return (
      <div
        style={{
          ...animationStyle,
          display: 'inline-block',
          background: variant.background,
          color: variant.color,
          padding: '10px 24px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          fontFamily: 'var(--font-body), system-ui, sans-serif',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          willChange: 'transform, opacity',
        }}
      >
        {badgeEl.content}
      </div>
    )
  }

  if (element.type === 'shape') {
    const shapeEl = element
    let shapeStyle: React.CSSProperties = {
      width: typeof shapeEl.width === 'number' ? shapeEl.width : 60,
      height: typeof shapeEl.height === 'number' ? shapeEl.height : 60,
      backgroundColor: shapeEl.color || 'rgba(255,255,255,0.1)',
      borderRadius: shapeEl.shape === 'circle' ? '50%' : shapeEl.shape === 'rounded' ? 16 : 0,
    }

    if (shapeEl.shape === 'line') {
      shapeStyle = {
        width: typeof shapeEl.width === 'number' ? shapeEl.width : 100,
        height: 3,
        backgroundColor: shapeEl.color || 'rgba(255,255,255,0.3)',
        borderRadius: 2,
      }
    }

    return (
      <div
        style={{
          ...animationStyle,
          ...shapeStyle,
          willChange: 'transform, opacity',
        }}
      />
    )
  }

  return null
}

// Scene content renderer - positions elements vertically
function SceneContent({
  scene,
  isVisible,
  isExiting,
}: {
  scene: Scene
  isVisible: boolean
  isExiting: boolean
}) {
  // Sort elements: badges first, then headlines, then subtitles
  const sortedElements = [...scene.elements].sort((a, b) => {
    const order = { badge: 0, text: 1, shape: 2, image: 3 }
    const aOrder = a.type === 'text'
      ? ((a as TextElement).style.style === 'hero' || (a as TextElement).style.style === 'headline' ? 1 : 2)
      : (order[a.type as keyof typeof order] ?? 3)
    const bOrder = b.type === 'text'
      ? ((b as TextElement).style.style === 'hero' || (b as TextElement).style.style === 'headline' ? 1 : 2)
      : (order[b.type as keyof typeof order] ?? 3)
    return aOrder - bOrder
  })

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '28px',
        padding: '10%',
        zIndex: 10,
      }}
    >
      {sortedElements.map((element, index) => (
        <ElementView
          key={element.id || `el-${index}`}
          element={element}
          isVisible={isVisible}
          isExiting={isExiting}
          index={index}
        />
      ))}
    </div>
  )
}

// Decorative floating shapes
function DecorationLayer({ scene }: { scene: Scene }) {
  // Extract primary color from background
  const bgColor = scene.background.type === 'gradient'
    ? scene.background.colors[0]
    : scene.background.type === 'solid'
      ? scene.background.color
      : '#0D9488'

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {/* Subtle glow orbs */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          right: '-10%',
          width: '40%',
          height: '40%',
          background: `radial-gradient(circle, ${bgColor}33 0%, transparent 70%)`,
          filter: 'blur(60px)',
          animation: 'floatSubtle 8s ease-in-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '5%',
          left: '-15%',
          width: '50%',
          height: '50%',
          background: `radial-gradient(circle, ${bgColor}22 0%, transparent 70%)`,
          filter: 'blur(80px)',
          animation: 'floatSubtle 10s ease-in-out infinite reverse',
        }}
      />
    </div>
  )
}

export const PremiumVideoPlayer: React.FC<PremiumVideoPlayerProps> = ({
  plan,
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const sceneStartTime = useRef<number>(Date.now())

  const currentScene = plan.scenes[currentSceneIndex]
  const totalDuration = plan.settings.totalDuration

  // Clear all timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  // Go to next scene with element animations (no slide)
  const goToNextScene = useCallback(() => {
    const nextIndex = (currentSceneIndex + 1) % plan.scenes.length

    if (!loop && nextIndex === 0) {
      setIsPlaying(false)
      return
    }

    // Start exit animation
    setIsTransitioning(true)

    // After elements exit, switch scene and enter new elements
    setTimeout(() => {
      setCurrentSceneIndex(nextIndex)
      sceneStartTime.current = Date.now()

      // Small delay then show new elements
      setTimeout(() => {
        setIsTransitioning(false)
      }, 100)
    }, 400) // Exit animation duration

  }, [currentSceneIndex, plan.scenes.length, loop])

  // Playback control
  useEffect(() => {
    if (!isPlaying) {
      clearTimers()
      return
    }

    const sceneDuration = currentScene.duration * 1000

    // Timer for next scene
    timerRef.current = setTimeout(goToNextScene, sceneDuration)

    // Progress bar update
    sceneStartTime.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - sceneStartTime.current
      const sceneProgress = Math.min(elapsed / sceneDuration, 1)

      const previousDuration = plan.scenes
        .slice(0, currentSceneIndex)
        .reduce((sum, s) => sum + s.duration, 0)
      const currentProgress = previousDuration + currentScene.duration * sceneProgress
      setProgress((currentProgress / totalDuration) * 100)
    }, 50)

    return clearTimers
  }, [isPlaying, currentSceneIndex, currentScene, goToNextScene, clearTimers, plan.scenes, totalDuration])

  // Controls
  const togglePlay = () => setIsPlaying(!isPlaying)

  const goToScene = (index: number) => {
    clearTimers()
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSceneIndex(index)
      sceneStartTime.current = Date.now()
      setTimeout(() => setIsTransitioning(false), 100)
    }, 300)
  }

  const restart = () => {
    goToScene(0)
    setIsPlaying(true)
  }

  // Aspect ratio
  const aspectRatio = plan.settings.aspectRatio === '16:9' ? '16/9'
    : plan.settings.aspectRatio === '1:1' ? '1/1'
    : plan.settings.aspectRatio === '4:5' ? '4/5'
    : '9/16'

  // Background transition
  const backgroundStyles = getBackgroundCSS(currentScene.background)

  return (
    <div className={`relative ${className}`}>
      {/* Video container */}
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '16px',
          aspectRatio,
          maxHeight: aspectRatio === '9/16' ? '600px' : 'auto',
          background: '#0a0a0a',
        }}
      >
        {/* Background layer with smooth transition */}
        <div
          style={{
            ...backgroundStyles,
            position: 'absolute',
            inset: 0,
            transition: `all 0.8s ${EASING.smooth}`,
          }}
        />

        {/* Decorative layer */}
        <DecorationLayer scene={currentScene} />

        {/* Grain texture */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            opacity: 0.04,
            pointerEvents: 'none',
            mixBlendMode: 'overlay',
          }}
        />

        {/* Scene content - elements animate, not the scene */}
        <SceneContent
          scene={currentScene}
          isVisible={!isTransitioning}
          isExiting={isTransitioning}
        />

        {/* Brand watermark */}
        <div
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 50,
            padding: '8px 14px',
            borderRadius: 10,
            fontSize: '0.7rem',
            fontWeight: 600,
            background: 'rgba(0,0,0,0.4)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          {plan.brand.name}
        </div>

        {/* Debug label */}
        {process.env.NODE_ENV === 'development' && (
          <div
            style={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              padding: '4px 8px',
              background: 'rgba(0,0,0,0.6)',
              color: '#fff',
              fontSize: '10px',
              borderRadius: 4,
              fontFamily: 'monospace',
              zIndex: 50,
            }}
          >
            {currentScene.name} | {currentScene.duration}s
          </div>
        )}
      </div>

      {/* Controls */}
      {showControls && (
        <div className="mt-4 space-y-3">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full"
              style={{
                width: `${progress}%`,
                transition: 'width 0.1s linear',
              }}
            />
            {/* Scene markers */}
            {plan.scenes.map((scene, index) => {
              const markerPosition = plan.scenes
                .slice(0, index)
                .reduce((sum, s) => sum + s.duration, 0) / totalDuration * 100

              return index > 0 ? (
                <div
                  key={index}
                  className="absolute top-0 bottom-0 w-0.5 bg-white/50"
                  style={{ left: `${markerPosition}%` }}
                />
              ) : null
            })}
          </div>

          {/* Control buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Play/Pause */}
              <button
                onClick={togglePlay}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#0D9488] hover:bg-[#0F766E] text-white transition-colors"
              >
                {isPlaying ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              {/* Restart */}
              <button
                onClick={restart}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-[#F5F5F4] hover:bg-[#E4E4E7] text-[#52525B] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Time */}
              <span className="text-sm text-[#52525B] font-mono ml-2">
                {Math.floor(progress / 100 * totalDuration)}s / {totalDuration}s
              </span>
            </div>

            {/* Scene indicators */}
            <div className="flex gap-1.5">
              {plan.scenes.map((scene, index) => (
                <button
                  key={index}
                  onClick={() => goToScene(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentSceneIndex
                      ? 'bg-[#0D9488] scale-125'
                      : 'bg-[#E4E4E7] hover:bg-[#D4D4D8]'
                  }`}
                  title={scene.name}
                />
              ))}
            </div>
          </div>

          {/* Scene name */}
          <div className="text-center">
            <span className="text-xs text-[#A1A1AA] uppercase tracking-wider">
              {currentScene.name}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default PremiumVideoPlayer
