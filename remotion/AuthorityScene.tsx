/**
 * Authority Scene Component
 *
 * This is the MAIN scene component that enforces the Visual Authority System.
 * It renders each shot using the strict priority order:
 *
 * 1. Brand Constraints (background, colors)
 * 2. Composition (safe zones, focal points)
 * 3. Layout (marketing-safe templates)
 * 4. Effects (motion/animation)
 * 5. Typography (fonts, sizes)
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion'
import type { RenderScene } from '../lib/video/renderer'

// =============================================================================
// PROPS TYPE
// =============================================================================

export interface AuthoritySceneProps {
  scene: RenderScene
  sceneIndex: number
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const AuthorityScene: React.FC<AuthoritySceneProps> = ({
  scene,
  sceneIndex,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // ===========================================================================
  // LAYER 1: BACKGROUND (from Brand Constraints)
  // ===========================================================================
  const BackgroundLayer = () => (
    <AbsoluteFill
      style={{
        backgroundColor: scene.backgroundColor,
      }}
    >
      {/* Texture overlay */}
      {scene.backgroundTexture !== 'none' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: scene.textureOpacity,
            ...getTextureStyle(scene.backgroundTexture),
          }}
        />
      )}
    </AbsoluteFill>
  )

  // ===========================================================================
  // LAYER 2: COMPOSITION (safe zones and positioning)
  // ===========================================================================
  const getContentPosition = () => {
    const layout = scene.layoutConfig

    return {
      top: `${layout.contentTop}%`,
      height: `${layout.contentHeight}%`,
      paddingLeft: `${layout.paddingX}%`,
      paddingRight: `${layout.paddingX}%`,
      justifyContent: getVerticalAlignment(layout.contentTop),
      alignItems: getHorizontalAlignment(layout.alignment),
      textAlign: layout.textAlign as React.CSSProperties['textAlign'],
    }
  }

  // ===========================================================================
  // LAYER 3: LAYOUT (content arrangement)
  // ===========================================================================
  const ContentLayout = () => {
    const position = getContentPosition()

    return (
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          ...position,
        }}
      >
        {/* Headline */}
        <div
          style={{
            fontFamily: scene.fontFamily,
            fontSize: scene.headlineFontSize,
            fontWeight: scene.headlineWeight,
            letterSpacing: `${scene.letterSpacing}em`,
            lineHeight: scene.lineHeight,
            color: scene.textColor,
            textAlign: scene.layoutConfig.textAlign as React.CSSProperties['textAlign'],
            whiteSpace: 'pre-line',
          }}
        >
          {scene.headlineLines.join('\n')}
        </div>

        {/* Subtext */}
        {scene.subtext && (
          <div
            style={{
              marginTop: 24,
              fontFamily: scene.fontFamily,
              fontSize: scene.subtextFontSize,
              fontWeight: scene.layoutConfig.name === 'MINIMAL_CTA' ? scene.headlineWeight : 400,
              color: scene.textColor,
              opacity: 0.8,
              textAlign: scene.layoutConfig.textAlign as React.CSSProperties['textAlign'],
            }}
          >
            {scene.subtext}
          </div>
        )}

        {/* Visual anchor */}
        {scene.layoutConfig.anchor !== 'none' && (
          <VisualAnchor
            type={scene.layoutConfig.anchor}
            color={scene.accentColor}
          />
        )}
      </AbsoluteFill>
    )
  }

  // ===========================================================================
  // LAYER 4: EFFECTS (animation wrapper)
  // ===========================================================================
  const effectStyle = getEffectStyle(scene.effect, frame, fps, scene.effectDuration)

  // ===========================================================================
  // LAYER 5: TYPOGRAPHY (already applied in ContentLayout)
  // ===========================================================================

  // ===========================================================================
  // RENDER
  // ===========================================================================
  return (
    <AbsoluteFill>
      <BackgroundLayer />

      {/* Effect Flash (for BACKGROUND_FLASH effect) */}
      {scene.effect === 'BACKGROUND_FLASH' && (
        <FlashOverlay frame={frame} />
      )}

      {/* Content with effect */}
      <div style={effectStyle}>
        <ContentLayout />
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// VISUAL ANCHOR COMPONENT
// =============================================================================

interface VisualAnchorProps {
  type: 'underline' | 'box' | 'glow'
  color: string
}

const VisualAnchor: React.FC<VisualAnchorProps> = ({ type, color }) => {
  const baseStyle: React.CSSProperties = {
    marginTop: 32,
  }

  switch (type) {
    case 'underline':
      return (
        <div
          style={{
            ...baseStyle,
            width: 80,
            height: 4,
            backgroundColor: color,
            borderRadius: 2,
          }}
        />
      )
    case 'box':
      return (
        <div
          style={{
            ...baseStyle,
            width: 60,
            height: 60,
            border: `3px solid ${color}`,
            borderRadius: 8,
          }}
        />
      )
    case 'glow':
      return (
        <div
          style={{
            ...baseStyle,
            width: 100,
            height: 4,
            background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
            boxShadow: `0 0 20px ${color}`,
          }}
        />
      )
    default:
      return null
  }
}

// =============================================================================
// FLASH OVERLAY COMPONENT
// =============================================================================

const FlashOverlay: React.FC<{ frame: number }> = ({ frame }) => {
  const opacity = interpolate(frame, [0, 8], [0.8, 0], { extrapolateRight: 'clamp' })

  if (opacity <= 0) return null

  return (
    <AbsoluteFill
      style={{
        backgroundColor: 'white',
        opacity,
      }}
    />
  )
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

function getTextureStyle(texture: string): React.CSSProperties {
  switch (texture) {
    case 'subtle-grain':
      return {
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        filter: 'contrast(150%) brightness(100%)',
      }
    case 'noise':
      return {
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'turbulence\' baseFrequency=\'0.8\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
        filter: 'contrast(200%) brightness(100%)',
      }
    case 'gradient-overlay':
      return {
        background: 'radial-gradient(ellipse at 50% 0%, rgba(100,100,200,0.1) 0%, transparent 60%)',
      }
    default:
      return {}
  }
}

function getVerticalAlignment(contentTop: number): React.CSSProperties['justifyContent'] {
  if (contentTop < 35) return 'flex-start'
  if (contentTop > 45) return 'flex-end'
  return 'center'
}

function getHorizontalAlignment(alignment: string): React.CSSProperties['alignItems'] {
  switch (alignment) {
    case 'left':
      return 'flex-start'
    case 'right':
      return 'flex-end'
    default:
      return 'center'
  }
}

function getEffectStyle(
  effect: string,
  frame: number,
  fps: number,
  duration: number
): React.CSSProperties {
  const progress = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' })

  switch (effect) {
    case 'TEXT_POP_SCALE': {
      const scale = spring({ frame, fps, config: { damping: 10, stiffness: 100, mass: 0.5 } })
      const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
      return {
        transform: `scale(${scale})`,
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    case 'TEXT_SLIDE_UP': {
      const translateY = interpolate(frame, [0, duration], [100, 0], { extrapolateRight: 'clamp' })
      const opacity = interpolate(frame, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
      return {
        transform: `translateY(${translateY}px)`,
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    case 'TEXT_SLIDE_LEFT': {
      const translateX = interpolate(frame, [0, duration], [200, 0], { extrapolateRight: 'clamp' })
      const opacity = interpolate(frame, [0, duration * 0.5], [0, 1], { extrapolateRight: 'clamp' })
      return {
        transform: `translateX(${translateX}px)`,
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    case 'TEXT_FADE_IN': {
      const opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
      return {
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    case 'HARD_CUT_TEXT': {
      // Instant appear
      return {
        opacity: 1,
        width: '100%',
        height: '100%',
      }
    }

    case 'TEXT_MASK_REVEAL': {
      const clipProgress = interpolate(frame, [0, duration], [0, 100], { extrapolateRight: 'clamp' })
      return {
        clipPath: `inset(0 ${100 - clipProgress}% 0 0)`,
        width: '100%',
        height: '100%',
      }
    }

    case 'SOFT_ZOOM_IN': {
      const scale = interpolate(frame, [0, duration * 2], [1, 1.05], { extrapolateRight: 'clamp' })
      const opacity = interpolate(frame, [0, duration], [0, 1], { extrapolateRight: 'clamp' })
      return {
        transform: `scale(${scale})`,
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    case 'BACKGROUND_FLASH': {
      // Flash handled separately
      const opacity = interpolate(frame, [0, 5], [0, 1], { extrapolateRight: 'clamp' })
      return {
        opacity,
        width: '100%',
        height: '100%',
      }
    }

    default: {
      // Default fade in
      const opacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })
      return {
        opacity,
        width: '100%',
        height: '100%',
      }
    }
  }
}

export default AuthorityScene
