/**
 * COMPOSITION GRID SYSTEM
 *
 * Professional layout system based on cinematographic principles.
 * Uses rule of thirds, golden ratio, and asymmetric balance.
 *
 * Instead of centering everything, this creates dynamic,
 * visually interesting compositions like real marketing videos.
 */

import React from 'react'
import { AbsoluteFill, useCurrentFrame, useVideoConfig, interpolate, Easing, spring } from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export type LayoutPreset =
  | 'center'           // Classic center (still useful for CTAs)
  | 'left-hero'        // Content left, space right (for images on right)
  | 'right-hero'       // Content right, space left (for images on left)
  | 'top-heavy'        // Content weighted to top
  | 'bottom-heavy'     // Content weighted to bottom
  | 'diagonal-left'    // Dynamic diagonal, content flows top-left to bottom-right
  | 'diagonal-right'   // Dynamic diagonal, content flows top-right to bottom-left
  | 'split-horizontal' // Top and bottom sections
  | 'split-vertical'   // Left and right sections
  | 'golden-left'      // Golden ratio, larger section left
  | 'golden-right'     // Golden ratio, larger section right
  | 'floating'         // Elements float freely in space

export interface ContentBlock {
  id: string
  element: React.ReactNode
  position?: 'primary' | 'secondary' | 'accent' | 'background'
  delay?: number  // Entrance delay in frames
  duration?: number  // Animation duration
  sticky?: boolean  // Stays visible across transitions
}

export interface CompositionGridProps {
  layout: LayoutPreset
  blocks: ContentBlock[]
  padding?: number
  gap?: number
  animate?: boolean
  staggerDelay?: number
}

// =============================================================================
// LAYOUT CONFIGURATIONS
// =============================================================================

interface LayoutConfig {
  primary: { x: string; y: string; width: string; align: string; justify: string }
  secondary: { x: string; y: string; width: string; align: string; justify: string }
  accent: { x: string; y: string; width: string; align: string; justify: string }
}

const LAYOUT_CONFIGS: Record<LayoutPreset, LayoutConfig> = {
  'center': {
    primary: { x: '50%', y: '50%', width: '80%', align: 'center', justify: 'center' },
    secondary: { x: '50%', y: '70%', width: '70%', align: 'center', justify: 'center' },
    accent: { x: '50%', y: '85%', width: '60%', align: 'center', justify: 'center' },
  },
  'left-hero': {
    primary: { x: '30%', y: '45%', width: '50%', align: 'flex-start', justify: 'center' },
    secondary: { x: '30%', y: '65%', width: '45%', align: 'flex-start', justify: 'center' },
    accent: { x: '75%', y: '50%', width: '40%', align: 'center', justify: 'center' },
  },
  'right-hero': {
    primary: { x: '70%', y: '45%', width: '50%', align: 'flex-end', justify: 'center' },
    secondary: { x: '70%', y: '65%', width: '45%', align: 'flex-end', justify: 'center' },
    accent: { x: '25%', y: '50%', width: '40%', align: 'center', justify: 'center' },
  },
  'top-heavy': {
    primary: { x: '50%', y: '30%', width: '80%', align: 'center', justify: 'center' },
    secondary: { x: '50%', y: '55%', width: '70%', align: 'center', justify: 'center' },
    accent: { x: '50%', y: '80%', width: '50%', align: 'center', justify: 'center' },
  },
  'bottom-heavy': {
    primary: { x: '50%', y: '70%', width: '80%', align: 'center', justify: 'center' },
    secondary: { x: '50%', y: '45%', width: '70%', align: 'center', justify: 'center' },
    accent: { x: '50%', y: '20%', width: '50%', align: 'center', justify: 'center' },
  },
  'diagonal-left': {
    primary: { x: '35%', y: '30%', width: '55%', align: 'flex-start', justify: 'flex-start' },
    secondary: { x: '55%', y: '55%', width: '50%', align: 'center', justify: 'center' },
    accent: { x: '70%', y: '80%', width: '40%', align: 'flex-end', justify: 'flex-end' },
  },
  'diagonal-right': {
    primary: { x: '65%', y: '30%', width: '55%', align: 'flex-end', justify: 'flex-start' },
    secondary: { x: '45%', y: '55%', width: '50%', align: 'center', justify: 'center' },
    accent: { x: '30%', y: '80%', width: '40%', align: 'flex-start', justify: 'flex-end' },
  },
  'split-horizontal': {
    primary: { x: '50%', y: '30%', width: '85%', align: 'center', justify: 'center' },
    secondary: { x: '50%', y: '70%', width: '85%', align: 'center', justify: 'center' },
    accent: { x: '50%', y: '50%', width: '30%', align: 'center', justify: 'center' },
  },
  'split-vertical': {
    primary: { x: '30%', y: '50%', width: '45%', align: 'center', justify: 'center' },
    secondary: { x: '70%', y: '50%', width: '45%', align: 'center', justify: 'center' },
    accent: { x: '50%', y: '85%', width: '60%', align: 'center', justify: 'center' },
  },
  'golden-left': {
    primary: { x: '31%', y: '50%', width: '52%', align: 'flex-start', justify: 'center' },  // 61.8%
    secondary: { x: '78%', y: '50%', width: '34%', align: 'flex-end', justify: 'center' },  // 38.2%
    accent: { x: '50%', y: '90%', width: '80%', align: 'center', justify: 'flex-end' },
  },
  'golden-right': {
    primary: { x: '69%', y: '50%', width: '52%', align: 'flex-end', justify: 'center' },
    secondary: { x: '22%', y: '50%', width: '34%', align: 'flex-start', justify: 'center' },
    accent: { x: '50%', y: '90%', width: '80%', align: 'center', justify: 'flex-end' },
  },
  'floating': {
    primary: { x: '40%', y: '35%', width: '60%', align: 'center', justify: 'center' },
    secondary: { x: '60%', y: '60%', width: '50%', align: 'center', justify: 'center' },
    accent: { x: '30%', y: '75%', width: '40%', align: 'center', justify: 'center' },
  },
}

// =============================================================================
// ANIMATED BLOCK WRAPPER
// =============================================================================

const AnimatedBlock: React.FC<{
  children: React.ReactNode
  config: { x: string; y: string; width: string; align: string; justify: string }
  delay: number
  duration: number
  index: number
  animate: boolean
}> = ({ children, config, delay, duration, index, animate }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Spring animation for entrance
  const springValue = spring({
    frame: frame - delay,
    fps,
    config: {
      damping: 80,
      stiffness: 100,
      mass: 1,
    },
  })

  // Calculate entrance animation
  const opacity = animate ? interpolate(springValue, [0, 1], [0, 1]) : 1
  const translateY = animate ? interpolate(springValue, [0, 1], [30, 0]) : 0
  const scale = animate ? interpolate(springValue, [0, 1], [0.95, 1]) : 1

  return (
    <div
      style={{
        position: 'absolute',
        left: config.x,
        top: config.y,
        transform: `translate(-50%, -50%) translateY(${translateY}px) scale(${scale})`,
        width: config.width,
        display: 'flex',
        flexDirection: 'column',
        alignItems: config.align as any,
        justifyContent: config.justify as any,
        opacity,
        zIndex: 10 - index,
      }}
    >
      {children}
    </div>
  )
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const CompositionGrid: React.FC<CompositionGridProps> = ({
  layout,
  blocks,
  padding = 60,
  gap = 20,
  animate = true,
  staggerDelay = 8,
}) => {
  const layoutConfig = LAYOUT_CONFIGS[layout]

  // Group blocks by position
  const primaryBlocks = blocks.filter(b => !b.position || b.position === 'primary')
  const secondaryBlocks = blocks.filter(b => b.position === 'secondary')
  const accentBlocks = blocks.filter(b => b.position === 'accent')

  const renderBlockGroup = (
    blockGroup: ContentBlock[],
    config: typeof layoutConfig.primary,
    baseIndex: number
  ) => {
    return blockGroup.map((block, i) => {
      const delay = block.delay ?? (baseIndex + i) * staggerDelay
      const duration = block.duration ?? 20

      return (
        <AnimatedBlock
          key={block.id}
          config={config}
          delay={delay}
          duration={duration}
          index={baseIndex + i}
          animate={animate && !block.sticky}
        >
          {block.element}
        </AnimatedBlock>
      )
    })
  }

  return (
    <AbsoluteFill style={{ padding }}>
      {/* Primary content area */}
      {renderBlockGroup(primaryBlocks, layoutConfig.primary, 0)}

      {/* Secondary content area */}
      {renderBlockGroup(secondaryBlocks, layoutConfig.secondary, primaryBlocks.length)}

      {/* Accent content area */}
      {renderBlockGroup(accentBlocks, layoutConfig.accent, primaryBlocks.length + secondaryBlocks.length)}
    </AbsoluteFill>
  )
}

// =============================================================================
// HELPER: Get recommended layout for scene type
// =============================================================================

export const getLayoutForScene = (sceneType: string): LayoutPreset => {
  const recommendations: Record<string, LayoutPreset[]> = {
    hook: ['center', 'top-heavy', 'diagonal-left'],
    problem: ['left-hero', 'diagonal-right', 'split-horizontal'],
    solution: ['right-hero', 'golden-left', 'center'],
    demo: ['split-vertical', 'golden-right', 'left-hero'],
    proof: ['center', 'top-heavy', 'floating'],
    cta: ['center', 'bottom-heavy', 'floating'],
  }

  const options = recommendations[sceneType] || ['center']
  // For now, return first option. In future, could randomize or base on content
  return options[0]
}

export default CompositionGrid
