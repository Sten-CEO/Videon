/**
 * Type definitions for Remotion video composition
 *
 * Extended to support AI strategy data:
 * - shotType: The type of shot from Shot Library
 * - energy: low | medium | high
 * - recommendedEffect: Effect from AI
 * - recommendedFont: Font from AI
 */

export interface Scene {
  /** Main headline text */
  headline: string
  /** Secondary text */
  subtext?: string
  /** Optional image URL */
  imageUrl?: string
  /** Background color for the scene */
  backgroundColor?: string
  /** Text color */
  textColor?: string
  /** Shot type from AI (e.g., AGGRESSIVE_HOOK) */
  shotType?: string
  /** Energy level from AI */
  energy?: 'low' | 'medium' | 'high'
  /** Recommended effect from AI */
  recommendedEffect?: string
  /** Recommended font from AI */
  recommendedFont?: string
}

export interface Brand {
  primaryColor: string
  secondaryColor?: string
  logoUrl?: string
  fontFamily?: string
}

export interface VideoProps {
  scenes: Scene[]
  brand: Brand
}

// Default props for preview/testing
export const defaultVideoProps: VideoProps = {
  scenes: [
    {
      headline: 'Stop wasting time',
      subtext: 'on manual planning',
      shotType: 'AGGRESSIVE_HOOK',
      energy: 'high',
      recommendedEffect: 'TEXT_POP_SCALE',
      recommendedFont: 'SPACE_GROTESK',
    },
    {
      headline: 'The Problem',
      subtext: 'Spreadsheets kill productivity',
      shotType: 'PROBLEM_PRESSURE',
      energy: 'medium',
      recommendedEffect: 'TEXT_SLIDE_UP',
      recommendedFont: 'INTER',
    },
    {
      headline: 'The Solution',
      subtext: 'AI-powered planning in seconds',
      shotType: 'SOLUTION_REVEAL',
      energy: 'high',
      recommendedEffect: 'IMAGE_REVEAL_MASK',
      recommendedFont: 'SATOSHI',
    },
    {
      headline: 'Try it free',
      subtext: 'Start now →',
      shotType: 'CTA_DIRECT',
      energy: 'high',
      recommendedEffect: 'BACKGROUND_FLASH',
      recommendedFont: 'SPACE_GROTESK',
    },
  ],
  brand: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    fontFamily: 'Inter',
  },
}
