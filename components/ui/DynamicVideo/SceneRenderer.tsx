'use client'

/**
 * SCENE RENDERER
 *
 * Rend une scène complète avec son fond et tous ses éléments.
 */

import React, { useEffect, useRef } from 'react'
import type { Scene } from '@/lib/video-components/types'
import { getBackgroundCSS } from '@/lib/video-components/backgrounds'
import { LayoutRenderer } from './LayoutRenderer'

interface SceneRendererProps {
  scene: Scene
  isActive: boolean
  transitionState: 'entering' | 'active' | 'exiting' | 'hidden'
  transitionDuration: number
}

// Composant Particles animé
function ParticlesBackground({ color, density, speed }: {
  color: string
  density: 'low' | 'medium' | 'high'
  speed: 'slow' | 'medium' | 'fast'
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Configuration
    const particleCount = density === 'low' ? 30 : density === 'medium' ? 60 : 100
    const baseSpeed = speed === 'slow' ? 0.3 : speed === 'medium' ? 0.6 : 1

    // Créer les particules
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
    }> = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * baseSpeed,
        speedY: (Math.random() - 0.5) * baseSpeed,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    // Animation
    let animationId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(particle => {
        // Mouvement
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Rebond aux bords
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1

        // Dessiner
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = color.replace(')', `, ${particle.opacity})`).replace('rgb', 'rgba')
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    // Resize handler
    function resize() {
      if (!canvas) return
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    resize()
    animate()

    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
    }
  }, [color, density, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  )
}

// Premium cinematic transition styles
function getTransitionStyle(
  state: SceneRendererProps['transitionState'],
  transitionType: string,
  duration: number
): React.CSSProperties {
  // Premium easing curves for cinematic feel
  const premiumEasing = 'cubic-bezier(0.4, 0, 0.2, 1)'

  const baseStyles: React.CSSProperties = {
    position: 'absolute',
    inset: 0,
    transition: `all ${duration}s ${premiumEasing}`,
    willChange: 'transform, opacity, filter',
  }

  switch (state) {
    case 'entering':
      switch (transitionType) {
        case 'blur':
          return {
            ...baseStyles,
            opacity: 0,
            filter: 'blur(20px)',
            transform: 'scale(1.05)',
          }
        case 'slideLeft':
          return { ...baseStyles, transform: 'translateX(100%)', opacity: 0.5 }
        case 'slideRight':
          return { ...baseStyles, transform: 'translateX(-100%)', opacity: 0.5 }
        case 'slideUp':
          return { ...baseStyles, transform: 'translateY(100%)', opacity: 0.5 }
        case 'zoomIn':
          return { ...baseStyles, transform: 'scale(0.9)', opacity: 0, filter: 'blur(10px)' }
        case 'fade':
        default:
          return { ...baseStyles, opacity: 0, filter: 'blur(8px)' }
      }

    case 'active':
      return {
        ...baseStyles,
        transform: 'translate(0) scale(1)',
        opacity: 1,
        filter: 'blur(0)',
      }

    case 'exiting':
      switch (transitionType) {
        case 'blur':
          return {
            ...baseStyles,
            opacity: 0,
            filter: 'blur(20px)',
            transform: 'scale(0.95)',
          }
        case 'slideLeft':
          return { ...baseStyles, transform: 'translateX(-100%)', opacity: 0.5 }
        case 'slideRight':
          return { ...baseStyles, transform: 'translateX(100%)', opacity: 0.5 }
        case 'slideUp':
          return { ...baseStyles, transform: 'translateY(-100%)', opacity: 0.5 }
        case 'zoomIn':
          return { ...baseStyles, transform: 'scale(1.1)', opacity: 0, filter: 'blur(10px)' }
        case 'fade':
        default:
          return { ...baseStyles, opacity: 0, filter: 'blur(8px)' }
      }

    case 'hidden':
      return { ...baseStyles, opacity: 0, pointerEvents: 'none', filter: 'blur(10px)' }

    default:
      return baseStyles
  }
}

export const SceneRenderer: React.FC<SceneRendererProps> = ({
  scene,
  isActive,
  transitionState,
  transitionDuration,
}) => {
  const backgroundStyles = getBackgroundCSS(scene.background)
  const transitionStyles = getTransitionStyle(
    transitionState,
    scene.transition?.type ?? 'fade',
    transitionDuration
  )

  const isParticlesBg = scene.background.type === 'particles'

  return (
    <div
      style={{
        ...transitionStyles,
        ...backgroundStyles,
        overflow: 'hidden',
      }}
    >
      {/* Particles overlay si background particles */}
      {isParticlesBg && scene.background.type === 'particles' && (
        <ParticlesBackground
          color={scene.background.color}
          density={scene.background.density ?? 'medium'}
          speed={scene.background.speed ?? 'medium'}
        />
      )}

      {/* Grain texture overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          opacity: 0.03,
          pointerEvents: 'none',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Éléments de la scène via LayoutRenderer */}
      <LayoutRenderer
        scene={scene}
        isActive={transitionState === 'active'}
      />

      {/* Label de scène (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div
          style={{
            position: 'absolute',
            bottom: 8,
            left: 8,
            padding: '4px 8px',
            background: 'rgba(0,0,0,0.5)',
            color: '#fff',
            fontSize: '10px',
            borderRadius: 4,
            fontFamily: 'monospace',
          }}
        >
          {scene.name} | {scene.layout ?? 'hero-central'} | {scene.duration}s
        </div>
      )}
    </div>
  )
}

export default SceneRenderer
