/**
 * Scene Component — The Core Render Unit
 *
 * This component renders a single shot using:
 * - Dynamic layouts (based on shot type & energy)
 * - Dynamic effects (based on AI recommendations)
 * - Dynamic backgrounds (based on shot type & energy)
 * - Dynamic fonts (based on AI recommendations)
 *
 * IMPORTANT: This component makes AI decisions VISIBLE.
 * Different AI recommendations = Different visual output.
 */

import React from 'react'
import { AbsoluteFill } from 'remotion'
import type { Scene as SceneType, Brand } from './types'

// Import render systems
import { getEffectComponent } from './effects'
import { getLayoutComponent, selectLayout, type LayoutName } from './layouts'
import { getBackgroundComponent, selectBackground, getTextColorForBackground, type BackgroundName } from './backgrounds'
import { getFontFamily, getWeightForEnergy } from './fonts'

// ============================================================================
// SCENE PROPS TYPE (Updated to support render decisions)
// ============================================================================

export interface SceneProps {
  scene: SceneType & {
    /** Shot type from AI */
    shotType?: string
    /** Energy level */
    energy?: 'low' | 'medium' | 'high'
    /** Recommended effect from AI */
    recommendedEffect?: string
    /** Recommended font from AI */
    recommendedFont?: string
  }
  brand: Brand
  sceneIndex: number
  /** Previous layout to avoid repetition */
  previousLayout?: LayoutName | null
  /** Previous background to avoid repetition */
  previousBackground?: BackgroundName | null
}

// ============================================================================
// SCENE COMPONENT
// ============================================================================

export const Scene: React.FC<SceneProps> = ({
  scene,
  brand,
  sceneIndex,
  previousLayout = null,
  previousBackground = null,
}) => {
  // Extract AI decisions (with defaults)
  const shotType = scene.shotType || getDefaultShotType(sceneIndex)
  const energy = scene.energy || 'medium'
  const recommendedEffect = scene.recommendedEffect || getDefaultEffect(shotType)
  const recommendedFont = scene.recommendedFont || 'INTER'

  // Select layout based on shot type (avoiding consecutive duplicates)
  const layout = selectLayout(shotType, previousLayout, energy)

  // Select background based on shot type (avoiding consecutive duplicates)
  const background = selectBackground(shotType, energy, previousBackground)

  // Get font configuration
  const fontFamily = getFontFamily(recommendedFont)
  const fontWeight = getWeightForEnergy(recommendedFont, energy)

  // Get text color for background
  const textColor = getTextColorForBackground(background)

  // Get components
  const BackgroundComponent = getBackgroundComponent(background)
  const LayoutComponent = getLayoutComponent(layout)
  const EffectComponent = getEffectComponent(recommendedEffect)

  return (
    <AbsoluteFill>
      {/* Background Layer */}
      <BackgroundComponent
        primaryColor={scene.backgroundColor || brand.primaryColor}
        secondaryColor={brand.secondaryColor}
      >
        {/* Effect Layer (wraps content with animation) */}
        <AbsoluteFill>
          <EffectComponent>
            {/* Layout Layer (positions content) */}
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
  )
}

// ============================================================================
// DEFAULT MAPPINGS (when AI data not available)
// ============================================================================

/**
 * Get default shot type based on scene index
 */
function getDefaultShotType(sceneIndex: number): string {
  const shotSequence = [
    'AGGRESSIVE_HOOK',
    'PROBLEM_PRESSURE',
    'SOLUTION_REVEAL',
    'VALUE_PROOF',
    'CTA_DIRECT',
  ]
  return shotSequence[sceneIndex % shotSequence.length]
}

/**
 * Get default effect based on shot type
 */
function getDefaultEffect(shotType: string): string {
  const defaults: Record<string, string> = {
    AGGRESSIVE_HOOK: 'TEXT_POP_SCALE',
    PATTERN_INTERRUPT: 'HARD_CUT_TEXT',
    PROBLEM_PRESSURE: 'TEXT_SLIDE_UP',
    PROBLEM_CLARITY: 'TEXT_FADE_IN',
    SOLUTION_REVEAL: 'IMAGE_REVEAL_MASK',
    VALUE_PROOF: 'TEXT_SLIDE_LEFT',
    POWER_STAT: 'TEXT_POP_SCALE',
    CTA_DIRECT: 'BACKGROUND_FLASH',
  }
  return defaults[shotType] || 'TEXT_FADE_IN'
}

export default Scene
