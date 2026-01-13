'use client'

/**
 * Remotion Preview Component
 *
 * Renders the marketing video in real-time using Remotion Player.
 * This allows users to preview videos without server-side rendering.
 */

import React, { useMemo } from 'react'
import { Player } from '@remotion/player'
import type { Scene, Brand } from '@/remotion/types'

// Inline the MarketingVideo component to avoid SSR issues
// We need a self-contained version for the Player

const FRAMES_PER_SHOT = 75

interface ExtendedScene extends Scene {
  shotType?: string
  energy?: 'low' | 'medium' | 'high'
  recommendedEffect?: string
  recommendedFont?: string
}

interface VideoProps {
  scenes: ExtendedScene[]
  brand: Brand
}

// Simple scene component for preview
const PreviewScene: React.FC<{
  scene: ExtendedScene
  brand: Brand
}> = ({ scene, brand }) => {
  const bgColor = scene.backgroundColor || brand.primaryColor

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
        background: `linear-gradient(135deg, ${bgColor} 0%, ${brand.secondaryColor || bgColor} 100%)`,
      }}
    >
      <h1
        style={{
          fontSize: 64,
          fontWeight: 700,
          color: scene.textColor || '#ffffff',
          textAlign: 'center',
          marginBottom: 24,
          lineHeight: 1.2,
        }}
      >
        {scene.headline}
      </h1>
      {scene.subtext && (
        <p
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: scene.textColor || '#ffffff',
            opacity: 0.8,
            textAlign: 'center',
          }}
        >
          {scene.subtext}
        </p>
      )}
      {/* Shot type indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: 40,
          left: 40,
          fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          letterSpacing: 2,
        }}
      >
        {scene.shotType?.replace(/_/g, ' ') || 'SCENE'}
      </div>
    </div>
  )
}

// Preview video composition
const PreviewVideo: React.FC<VideoProps> = ({ scenes, brand }) => {
  const normalizedScenes = scenes.length > 0
    ? scenes
    : [{ headline: 'Your Video', subtext: 'Add content to generate' }]

  // Calculate which scene is currently visible based on frame
  const [currentSceneIndex, setCurrentSceneIndex] = React.useState(0)

  // Use Remotion's useCurrentFrame in a real implementation
  // For now, we'll render all scenes with CSS

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => (
        <div
          key={index}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: currentSceneIndex === index ? 1 : 0,
            transition: 'opacity 0.1s',
          }}
        >
          <PreviewScene scene={scene} brand={brand} />
        </div>
      ))}
    </div>
  )
}

// Import the actual composition for rendering
import { AbsoluteFill, useCurrentFrame, Sequence } from 'remotion'
import { selectLayout, getLayoutComponent, type LayoutName } from '@/remotion/layouts'
import { selectBackground, getBackgroundComponent, getTextColorForBackground, type BackgroundName } from '@/remotion/backgrounds'
import { getEffectComponent } from '@/remotion/effects'
import { getFontFamily, getWeightForEnergy } from '@/remotion/fonts'

// Actual Remotion composition for Player
const MarketingVideoForPlayer: React.FC<VideoProps> = ({ scenes, brand }) => {
  const normalizedScenes = scenes.length > 0
    ? scenes
    : [{ headline: 'Your Video', subtext: 'Add content to generate' }]

  // Pre-calculate layouts and backgrounds
  const sceneDecisions = useMemo(() => {
    const decisions: Array<{ layout: LayoutName; background: BackgroundName }> = []
    let prevLayout: LayoutName | null = null
    let prevBackground: BackgroundName | null = null

    for (const scene of normalizedScenes) {
      const shotType = scene.shotType || 'AGGRESSIVE_HOOK'
      const energy = scene.energy || 'medium'

      const layout = selectLayout(shotType, prevLayout, energy)
      const background = selectBackground(shotType, energy, prevBackground)

      decisions.push({ layout, background })

      prevLayout = layout
      prevBackground = background
    }

    return decisions
  }, [normalizedScenes])

  return (
    <AbsoluteFill style={{ backgroundColor: '#0a0a0b' }}>
      {normalizedScenes.map((scene, index) => {
        const decision = sceneDecisions[index]
        const shotType = scene.shotType || 'AGGRESSIVE_HOOK'
        const energy = scene.energy || 'medium'
        const recommendedEffect = scene.recommendedEffect || 'TEXT_FADE_IN'
        const recommendedFont = scene.recommendedFont || 'INTER'

        const fontFamily = getFontFamily(recommendedFont)
        const textColor = getTextColorForBackground(decision.background)

        const BackgroundComponent = getBackgroundComponent(decision.background)
        const LayoutComponent = getLayoutComponent(decision.layout)
        const EffectComponent = getEffectComponent(recommendedEffect)

        return (
          <Sequence
            key={index}
            from={index * FRAMES_PER_SHOT}
            durationInFrames={FRAMES_PER_SHOT}
            name={`Shot ${index + 1}`}
          >
            <AbsoluteFill>
              <BackgroundComponent
                primaryColor={scene.backgroundColor || brand.primaryColor}
                secondaryColor={brand.secondaryColor}
              >
                <AbsoluteFill>
                  <EffectComponent>
                    <LayoutComponent
                      headline={scene.headline || ''}
                      subtext={scene.subtext}
                      fontFamily={fontFamily}
                      textColor={textColor}
                    />
                  </EffectComponent>
                </AbsoluteFill>
              </BackgroundComponent>
            </AbsoluteFill>
          </Sequence>
        )
      })}
    </AbsoluteFill>
  )
}

interface RemotionPreviewProps {
  scenes: ExtendedScene[]
  brand: Brand
  className?: string
}

export const RemotionPreview: React.FC<RemotionPreviewProps> = ({
  scenes,
  brand,
  className = '',
}) => {
  const durationInFrames = Math.max(scenes.length, 1) * FRAMES_PER_SHOT

  return (
    <div className={`relative rounded-xl overflow-hidden ${className}`}>
      <Player
        component={MarketingVideoForPlayer}
        inputProps={{ scenes, brand }}
        durationInFrames={durationInFrames}
        fps={30}
        compositionWidth={1080}
        compositionHeight={1920}
        style={{
          width: '100%',
          aspectRatio: '9/16',
          maxHeight: '500px',
        }}
        controls
        autoPlay={false}
        loop
      />
    </div>
  )
}

export default RemotionPreview
