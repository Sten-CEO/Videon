'use client'

/**
 * DYNAMIC VIDEO PLAYER
 *
 * Player principal qui orchestre la lecture des scènes.
 * Lit un VideoPlan et affiche les scènes avec transitions.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react'
import type { VideoPlan, Scene } from '@/lib/video-components/types'
import { SceneRenderer } from './SceneRenderer'

interface DynamicVideoPlayerProps {
  plan: VideoPlan
  autoPlay?: boolean
  loop?: boolean
  showControls?: boolean
  className?: string
}

type TransitionState = 'entering' | 'active' | 'exiting' | 'hidden'

export const DynamicVideoPlayer: React.FC<DynamicVideoPlayerProps> = ({
  plan,
  autoPlay = true,
  loop = true,
  showControls = true,
  className = '',
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(autoPlay)
  const [sceneStates, setSceneStates] = useState<TransitionState[]>(
    plan.scenes.map((_, i) => (i === 0 ? 'active' : 'hidden'))
  )
  const [progress, setProgress] = useState(0)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const progressRef = useRef<NodeJS.Timeout | null>(null)
  const sceneStartTime = useRef<number>(Date.now())

  const currentScene = plan.scenes[currentSceneIndex]
  const totalDuration = plan.settings.totalDuration
  const defaultTransitionDuration = plan.settings.defaultTransition?.duration ?? 0.5

  // Nettoyer les timers
  const clearTimers = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressRef.current) clearInterval(progressRef.current)
  }, [])

  // Aller à la scène suivante
  const goToNextScene = useCallback(() => {
    const nextIndex = (currentSceneIndex + 1) % plan.scenes.length

    // Si on boucle pas et qu'on est à la fin
    if (!loop && nextIndex === 0) {
      setIsPlaying(false)
      return
    }

    // Transition sortante pour la scène actuelle
    setSceneStates(prev => {
      const newStates = [...prev]
      newStates[currentSceneIndex] = 'exiting'
      return newStates
    })

    // Transition entrante pour la nouvelle scène
    setTimeout(() => {
      setSceneStates(prev => {
        const newStates = [...prev]
        newStates[currentSceneIndex] = 'hidden'
        newStates[nextIndex] = 'entering'
        return newStates
      })

      // Activation après l'entrée
      setTimeout(() => {
        setSceneStates(prev => {
          const newStates = [...prev]
          newStates[nextIndex] = 'active'
          return newStates
        })
        setCurrentSceneIndex(nextIndex)
        sceneStartTime.current = Date.now()
      }, defaultTransitionDuration * 1000)
    }, defaultTransitionDuration * 500)
  }, [currentSceneIndex, plan.scenes.length, loop, defaultTransitionDuration])

  // Gestion de la lecture
  useEffect(() => {
    if (!isPlaying) {
      clearTimers()
      return
    }

    const sceneDuration = currentScene.duration * 1000

    // Timer pour passer à la scène suivante
    timerRef.current = setTimeout(goToNextScene, sceneDuration)

    // Progress bar
    sceneStartTime.current = Date.now()
    progressRef.current = setInterval(() => {
      const elapsed = Date.now() - sceneStartTime.current
      const sceneProgress = Math.min(elapsed / sceneDuration, 1)

      // Calculer le progrès total
      const previousDuration = plan.scenes
        .slice(0, currentSceneIndex)
        .reduce((sum, s) => sum + s.duration, 0)
      const currentProgress = previousDuration + currentScene.duration * sceneProgress
      setProgress((currentProgress / totalDuration) * 100)
    }, 50)

    return clearTimers
  }, [isPlaying, currentSceneIndex, currentScene, goToNextScene, clearTimers, plan.scenes, totalDuration])

  // Contrôles
  const togglePlay = () => setIsPlaying(!isPlaying)

  const goToScene = (index: number) => {
    clearTimers()
    setSceneStates(prev => prev.map((_, i) => (i === index ? 'active' : 'hidden')))
    setCurrentSceneIndex(index)
    sceneStartTime.current = Date.now()
    if (isPlaying) {
      // Redémarre le timer
      setTimeout(() => setIsPlaying(true), 0)
    }
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

  return (
    <div className={`relative ${className}`}>
      {/* Container vidéo */}
      <div
        className="relative overflow-hidden rounded-2xl bg-black"
        style={{
          aspectRatio,
          maxHeight: aspectRatio === '9/16' ? '600px' : 'auto',
        }}
      >
        {/* Scènes */}
        {plan.scenes.map((scene, index) => (
          <SceneRenderer
            key={scene.id ?? `scene-${index}`}
            scene={scene}
            isActive={index === currentSceneIndex}
            transitionState={sceneStates[index]}
            transitionDuration={scene.transition?.duration ?? defaultTransitionDuration}
          />
        ))}

        {/* Brand watermark */}
        <div
          className="absolute top-4 right-4 z-50 px-3 py-1.5 rounded-lg text-xs font-semibold"
          style={{
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            backdropFilter: 'blur(10px)',
          }}
        >
          {plan.brand.name}
        </div>
      </div>

      {/* Contrôles */}
      {showControls && (
        <div className="mt-4 space-y-3">
          {/* Progress bar */}
          <div className="relative h-1.5 bg-[#E4E4E7] rounded-full overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#0D9488] to-[#14B8A6] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
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

          {/* Boutons de contrôle */}
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

              {/* Temps */}
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

export default DynamicVideoPlayer
