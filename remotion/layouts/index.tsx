/**
 * Layout Templates — Visual Composition System
 *
 * 5 distinct layout templates for video scenes.
 * Each layout creates a DIFFERENT visual composition.
 *
 * LAYOUTS:
 * 1. CENTERED - Full-screen centered text (impact moments)
 * 2. LEFT_ALIGNED - Marketing style, left-aligned (professional)
 * 3. SPLIT_SCREEN - Text left, image area right (comparative)
 * 4. IMAGE_DOMINANT - Large background with text overlay (visual)
 * 5. MINIMAL - Lots of negative space (elegant)
 *
 * HOW TO ADD A NEW LAYOUT:
 * 1. Create a new component following the pattern
 * 2. Export it from the LAYOUTS object
 * 3. Add rules in the shot-to-layout mapping
 */

import React from 'react'

// ============================================================================
// LAYOUT PROPS TYPE
// ============================================================================

export interface LayoutProps {
  /** Main headline text */
  headline: string
  /** Secondary text (optional) */
  subtext?: string
  /** Font family to use */
  fontFamily: string
  /** Text color */
  textColor: string
  /** Children for additional content */
  children?: React.ReactNode
}

// ============================================================================
// LAYOUT 1: CENTERED
// Full-screen centered text
// Best for: Hooks, CTAs, Power stats
// ============================================================================

export const CenteredLayout: React.FC<LayoutProps> = ({
  headline,
  subtext,
  fontFamily,
  textColor,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px 50px',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 72,
          fontWeight: 800,
          color: textColor,
          lineHeight: 1.1,
          margin: 0,
          maxWidth: '90%',
        }}
      >
        {headline}
      </h1>
      {subtext && (
        <p
          style={{
            fontFamily,
            fontSize: 32,
            fontWeight: 400,
            color: textColor,
            opacity: 0.8,
            marginTop: 30,
            maxWidth: '85%',
            lineHeight: 1.4,
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// LAYOUT 2: LEFT_ALIGNED
// Marketing style, left-aligned text
// Best for: Problem statements, Value props
// ============================================================================

export const LeftAlignedLayout: React.FC<LayoutProps> = ({
  headline,
  subtext,
  fontFamily,
  textColor,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '80px 60px',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 64,
          fontWeight: 700,
          color: textColor,
          lineHeight: 1.15,
          margin: 0,
          maxWidth: '95%',
          textAlign: 'left',
        }}
      >
        {headline}
      </h1>
      {subtext && (
        <p
          style={{
            fontFamily,
            fontSize: 28,
            fontWeight: 400,
            color: textColor,
            opacity: 0.75,
            marginTop: 25,
            maxWidth: '90%',
            lineHeight: 1.5,
            textAlign: 'left',
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// LAYOUT 3: SPLIT_SCREEN
// Text on left, colored block on right
// Best for: Solution reveals, Comparisons
// ============================================================================

export const SplitScreenLayout: React.FC<LayoutProps & { accentColor?: string }> = ({
  headline,
  subtext,
  fontFamily,
  textColor,
  accentColor = '#6366f1',
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'row',
      }}
    >
      {/* Text side */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '60px 40px',
        }}
      >
        <h1
          style={{
            fontFamily,
            fontSize: 52,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.2,
            margin: 0,
            textAlign: 'left',
          }}
        >
          {headline}
        </h1>
        {subtext && (
          <p
            style={{
              fontFamily,
              fontSize: 24,
              fontWeight: 400,
              color: textColor,
              opacity: 0.7,
              marginTop: 20,
              lineHeight: 1.4,
              textAlign: 'left',
            }}
          >
            {subtext}
          </p>
        )}
      </div>
      {/* Accent side */}
      <div
        style={{
          width: '40%',
          backgroundColor: accentColor,
          opacity: 0.9,
        }}
      />
    </div>
  )
}

// ============================================================================
// LAYOUT 4: IMAGE_DOMINANT
// Full background with text overlay at bottom
// Best for: Visual moments, Product shots
// ============================================================================

export const ImageDominantLayout: React.FC<LayoutProps & { overlayOpacity?: number }> = ({
  headline,
  subtext,
  fontFamily,
  textColor,
  overlayOpacity = 0.6,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(to top, rgba(0,0,0,${overlayOpacity}) 0%, rgba(0,0,0,0) 60%)`,
        }}
      />
      {/* Text content */}
      <div
        style={{
          position: 'relative',
          padding: '60px 50px',
          paddingBottom: '100px',
        }}
      >
        <h1
          style={{
            fontFamily,
            fontSize: 56,
            fontWeight: 700,
            color: textColor,
            lineHeight: 1.2,
            margin: 0,
            textShadow: '0 2px 20px rgba(0,0,0,0.5)',
          }}
        >
          {headline}
        </h1>
        {subtext && (
          <p
            style={{
              fontFamily,
              fontSize: 26,
              fontWeight: 400,
              color: textColor,
              opacity: 0.9,
              marginTop: 15,
              lineHeight: 1.4,
              textShadow: '0 1px 10px rgba(0,0,0,0.5)',
            }}
          >
            {subtext}
          </p>
        )}
      </div>
    </div>
  )
}

// ============================================================================
// LAYOUT 5: MINIMAL
// Lots of negative space, small centered text
// Best for: Elegant moments, Pattern interrupts
// ============================================================================

export const MinimalLayout: React.FC<LayoutProps> = ({
  headline,
  subtext,
  fontFamily,
  textColor,
}) => {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '100px 80px',
      }}
    >
      <h1
        style={{
          fontFamily,
          fontSize: 48,
          fontWeight: 500,
          color: textColor,
          lineHeight: 1.3,
          margin: 0,
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}
      >
        {headline}
      </h1>
      {subtext && (
        <p
          style={{
            fontFamily,
            fontSize: 22,
            fontWeight: 400,
            color: textColor,
            opacity: 0.6,
            marginTop: 40,
            textAlign: 'center',
            letterSpacing: '0.02em',
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  )
}

// ============================================================================
// LAYOUTS REGISTRY
// Maps layout names to components
// ============================================================================

export const LAYOUTS = {
  CENTERED: CenteredLayout,
  LEFT_ALIGNED: LeftAlignedLayout,
  SPLIT_SCREEN: SplitScreenLayout,
  IMAGE_DOMINANT: ImageDominantLayout,
  MINIMAL: MinimalLayout,
} as const

export type LayoutName = keyof typeof LAYOUTS

/**
 * Get layout component by name
 */
export function getLayoutComponent(name: string): React.FC<LayoutProps> {
  return LAYOUTS[name as LayoutName] || CenteredLayout
}

// ============================================================================
// SHOT TYPE → LAYOUT MAPPING
// Determines which layouts work best for each shot type
// ============================================================================

export const SHOT_LAYOUT_MAP: Record<string, LayoutName[]> = {
  AGGRESSIVE_HOOK: ['CENTERED', 'MINIMAL'],
  PATTERN_INTERRUPT: ['MINIMAL', 'CENTERED'],
  PROBLEM_PRESSURE: ['LEFT_ALIGNED', 'CENTERED'],
  PROBLEM_CLARITY: ['LEFT_ALIGNED', 'MINIMAL'],
  SOLUTION_REVEAL: ['SPLIT_SCREEN', 'IMAGE_DOMINANT', 'CENTERED'],
  VALUE_PROOF: ['LEFT_ALIGNED', 'SPLIT_SCREEN'],
  POWER_STAT: ['CENTERED', 'MINIMAL'],
  CTA_DIRECT: ['CENTERED', 'IMAGE_DOMINANT'],
}

/**
 * Get recommended layouts for a shot type
 */
export function getLayoutsForShot(shotType: string): LayoutName[] {
  return SHOT_LAYOUT_MAP[shotType] || ['CENTERED']
}

/**
 * Select layout ensuring no consecutive repeats
 */
export function selectLayout(
  shotType: string,
  previousLayout: LayoutName | null,
  energy: 'low' | 'medium' | 'high'
): LayoutName {
  const options = getLayoutsForShot(shotType)

  // Filter out previous layout if possible
  const filtered = previousLayout
    ? options.filter(l => l !== previousLayout)
    : options

  const choices = filtered.length > 0 ? filtered : options

  // Energy affects layout choice
  if (energy === 'high') {
    // Prefer impactful layouts
    if (choices.includes('CENTERED')) return 'CENTERED'
  } else if (energy === 'low') {
    // Prefer subtle layouts
    if (choices.includes('MINIMAL')) return 'MINIMAL'
    if (choices.includes('LEFT_ALIGNED')) return 'LEFT_ALIGNED'
  }

  return choices[0]
}
