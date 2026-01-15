/**
 * BASE44 PREMIUM TEMPLATE
 *
 * THE ONLY VIDEO TEMPLATE. NO ALTERNATIVES.
 *
 * Features:
 * - 6 fixed scenes: HOOK, PROBLEM, SOLUTION, DEMO, PROOF, CTA
 * - Premium glassmorphism design
 * - Film grain overlay
 * - Smooth transitions (crossBlur, parallaxPush)
 * - Beat-driven element animations
 *
 * DEBUG MODE: Set DEBUG_BG to verify this template is actually being used.
 */

import React from 'react'
import {
  AbsoluteFill,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
  Img,
  interpolate,
  Easing,
} from 'remotion'

import type { Base44Plan } from '../lib/templates/base44/planSchema'
import { PREMIUM_PALETTES, getGrainOverlayStyle, type ColorPalette } from '../lib/templates/base44/effects'

// =============================================================================
// DEBUG MODE - SET TO 'red' TO VERIFY TEMPLATE IS BEING USED
// =============================================================================

// ⚠️ TRUTH TEST: If video is NOT this color, template is NOT being used!
const DEBUG_BG: string | null = 'red'  // Set to null for production

// =============================================================================
// SCENE DURATIONS (in frames at 30fps)
// =============================================================================

const SCENE_DURATIONS = {
  short: { hook: 60, problem: 75, solution: 75, demo: 75, proof: 60, cta: 45 },
  standard: { hook: 75, problem: 90, solution: 90, demo: 90, proof: 75, cta: 60 },
  long: { hook: 90, problem: 105, solution: 105, demo: 105, proof: 90, cta: 75 },
}

// =============================================================================
// MAIN TEMPLATE COMPONENT
// =============================================================================

export interface Base44PremiumTemplateProps {
  plan?: Base44Plan  // Optional for Remotion Composition compatibility
}

export const Base44PremiumTemplate: React.FC<Base44PremiumTemplateProps> = ({ plan }) => {
  // Handle missing plan (shouldn't happen in normal flow)
  if (!plan) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FFF', fontSize: 40, fontWeight: 'bold' }}>NO PLAN PROVIDED</div>
      </AbsoluteFill>
    )
  }

  const frame = useCurrentFrame()
  const { fps, width, height } = useVideoConfig()

  // Get palette
  const paletteName = plan.settings.palette === 'auto' ? 'midnight' : plan.settings.palette
  const palette = PREMIUM_PALETTES[paletteName] || PREMIUM_PALETTES.midnight

  // Override with brand accent color
  const brandPalette: ColorPalette = {
    ...palette,
    primary: plan.brand.accentColor || palette.primary,
  }

  // Get scene durations based on settings
  const durations = SCENE_DURATIONS[plan.settings.duration]

  // Calculate scene start frames
  const sceneStarts = {
    hook: 0,
    problem: durations.hook,
    solution: durations.hook + durations.problem,
    demo: durations.hook + durations.problem + durations.solution,
    proof: durations.hook + durations.problem + durations.solution + durations.demo,
    cta: durations.hook + durations.problem + durations.solution + durations.demo + durations.proof,
  }

  const totalDuration = Object.values(durations).reduce((a, b) => a + b, 0)

  // Find images by role
  const getImageUrl = (role: string): string | undefined => {
    const cast = plan.casting.images.find(c => c.role === role)
    if (!cast) return undefined
    const img = plan.providedImages?.find(i => i.id === cast.imageId)
    return img?.url
  }

  const logoUrl = getImageUrl('logo')
  const heroScreenshotUrl = getImageUrl('heroScreenshot')
  const extraScreen1Url = getImageUrl('extraScreen1')

  // Log at frame 0
  if (frame === 0) {
    console.log('%c╔══════════════════════════════════════════════════════════════╗', 'background: #6366F1; color: #fff;')
    console.log('%c║           BASE44 PREMIUM TEMPLATE RENDERING                   ║', 'background: #6366F1; color: #fff; font-size: 16px; font-weight: bold;')
    console.log('%c╚══════════════════════════════════════════════════════════════╝', 'background: #6366F1; color: #fff;')
    console.log('%c[BASE44] Plan ID:', 'color: #6366F1;', plan.id)
    console.log('%c[BASE44] Brand:', 'color: #6366F1;', plan.brand.name)
    console.log('%c[BASE44] Palette:', 'color: #6366F1;', paletteName)
    console.log('%c[BASE44] Duration:', 'color: #6366F1;', plan.settings.duration, `(${totalDuration} frames)`)
    console.log('%c[BASE44] Images:', 'color: #6366F1;', plan.casting.images.length)
    if (DEBUG_BG) {
      console.log('%c[BASE44] ⚠️ DEBUG MODE: Background is', 'color: #FF0000; font-weight: bold;', DEBUG_BG)
    }
  }

  return (
    <AbsoluteFill style={{ backgroundColor: DEBUG_BG || '#000' }}>
      {/* Scene 1: HOOK */}
      <Sequence from={sceneStarts.hook} durationInFrames={durations.hook} name="1-HOOK">
        <HookScene
          story={plan.story.hook}
          brand={plan.brand}
          palette={brandPalette}
          logoUrl={logoUrl}
          duration={durations.hook}
        />
      </Sequence>

      {/* Scene 2: PROBLEM */}
      <Sequence from={sceneStarts.problem} durationInFrames={durations.problem} name="2-PROBLEM">
        <ProblemScene
          story={plan.story.problem}
          palette={brandPalette}
          duration={durations.problem}
        />
      </Sequence>

      {/* Scene 3: SOLUTION */}
      <Sequence from={sceneStarts.solution} durationInFrames={durations.solution} name="3-SOLUTION">
        <SolutionScene
          story={plan.story.solution}
          brand={plan.brand}
          palette={brandPalette}
          screenshotUrl={heroScreenshotUrl}
          duration={durations.solution}
        />
      </Sequence>

      {/* Scene 4: DEMO */}
      <Sequence from={sceneStarts.demo} durationInFrames={durations.demo} name="4-DEMO">
        <DemoScene
          story={plan.story.demo}
          palette={brandPalette}
          screenshotUrl={heroScreenshotUrl || extraScreen1Url}
          duration={durations.demo}
        />
      </Sequence>

      {/* Scene 5: PROOF */}
      <Sequence from={sceneStarts.proof} durationInFrames={durations.proof} name="5-PROOF">
        <ProofScene
          story={plan.story.proof}
          palette={brandPalette}
          duration={durations.proof}
        />
      </Sequence>

      {/* Scene 6: CTA */}
      <Sequence from={sceneStarts.cta} durationInFrames={durations.cta} name="6-CTA">
        <CTAScene
          story={plan.story.cta}
          brand={plan.brand}
          palette={brandPalette}
          logoUrl={logoUrl}
          duration={durations.cta}
        />
      </Sequence>

      {/* Film grain overlay */}
      {plan.settings.includeGrain && !DEBUG_BG && (
        <div style={getGrainOverlayStyle(0.04, frame)} />
      )}

      {/* Debug badge */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '8px 16px',
          backgroundColor: DEBUG_BG ? '#000' : 'rgba(99,102,241,0.9)',
          color: '#fff',
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 6,
          zIndex: 9999,
        }}
      >
        {DEBUG_BG ? '⚠️ DEBUG MODE' : 'BASE44 PREMIUM'}
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// SCENE COMPONENTS
// =============================================================================

// ----- HOOK SCENE -----
const HookScene: React.FC<{
  story: Base44Plan['story']['hook']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
  duration: number
}> = ({ story, brand, palette, logoUrl, duration }) => {
  const frame = useCurrentFrame()

  // Animations
  const headlineOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [5, 20], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const subtextOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })
  const subtextY = interpolate(frame, [20, 35], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Logo */}
      {logoUrl && (
        <div style={{ position: 'absolute', top: 80, opacity: logoOpacity }}>
          <Img
            src={logoUrl}
            style={{
              height: 60,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 56,
          fontWeight: 800,
          color: palette.text.primary,
          textAlign: 'center',
          lineHeight: 1.1,
          textShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        {story.headline}
      </div>

      {/* Subtext */}
      {story.subtext && (
        <div
          style={{
            opacity: subtextOpacity,
            transform: `translateY(${subtextY}px)`,
            marginTop: 24,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 28,
            fontWeight: 400,
            color: palette.text.secondary,
            textAlign: 'center',
          }}
        >
          {story.subtext}
        </div>
      )}
    </AbsoluteFill>
  )
}

// ----- PROBLEM SCENE -----
const ProblemScene: React.FC<{
  story: Base44Plan['story']['problem']
  palette: ColorPalette
  duration: number
}> = ({ story, palette, duration }) => {
  const frame = useCurrentFrame()

  const headlineOpacity = interpolate(frame, [5, 20], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [5, 20], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const subtextOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || `linear-gradient(180deg, ${palette.background[0]}, ${palette.background[1] || palette.background[0]})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 48,
          fontWeight: 700,
          color: palette.text.primary,
          textAlign: 'center',
          lineHeight: 1.2,
        }}
      >
        {story.headline}
      </div>

      {/* Subtext */}
      {story.subtext && (
        <div
          style={{
            opacity: subtextOpacity,
            marginTop: 20,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 24,
            fontWeight: 400,
            color: palette.text.secondary,
            textAlign: 'center',
            maxWidth: '85%',
          }}
        >
          {story.subtext}
        </div>
      )}

      {/* Bullets */}
      {story.bullets && story.bullets.length > 0 && (
        <div style={{ marginTop: 40 }}>
          {story.bullets.map((bullet, i) => {
            const bulletOpacity = interpolate(
              frame,
              [30 + i * 8, 40 + i * 8],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            const bulletX = interpolate(
              frame,
              [30 + i * 8, 40 + i * 8],
              [-30, 0],
              { extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
            )
            return (
              <div
                key={i}
                style={{
                  opacity: bulletOpacity,
                  transform: `translateX(${bulletX}px)`,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 22,
                  color: palette.text.muted,
                  marginBottom: 12,
                }}
              >
                • {bullet}
              </div>
            )
          })}
        </div>
      )}
    </AbsoluteFill>
  )
}

// ----- SOLUTION SCENE -----
const SolutionScene: React.FC<{
  story: Base44Plan['story']['solution']
  brand: Base44Plan['brand']
  palette: ColorPalette
  screenshotUrl?: string
  duration: number
}> = ({ story, brand, palette, screenshotUrl, duration }) => {
  const frame = useCurrentFrame()

  const headlineOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [5, 18], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const subtextOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' })
  const imageOpacity = interpolate(frame, [20, 35], [0, 1], { extrapolateRight: 'clamp' })
  const imageY = interpolate(frame, [20, 35], [50, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const imageScale = interpolate(frame, [35, duration], [1, 1.02], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || `linear-gradient(160deg, ${palette.background[0]}, ${palette.primary}30)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          marginTop: 80,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 44,
          fontWeight: 700,
          color: palette.text.primary,
          textAlign: 'center',
        }}
      >
        {story.headline}
      </div>

      {/* Subtext */}
      {story.subtext && (
        <div
          style={{
            opacity: subtextOpacity,
            marginTop: 16,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 24,
            fontWeight: 400,
            color: palette.text.secondary,
            textAlign: 'center',
          }}
        >
          {story.subtext}
        </div>
      )}

      {/* Screenshot */}
      {screenshotUrl && (
        <div
          style={{
            opacity: imageOpacity,
            transform: `translateY(${imageY}px) scale(${imageScale})`,
            marginTop: 40,
            padding: 16,
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.4)',
          }}
        >
          <Img
            src={screenshotUrl}
            style={{
              width: 800,
              maxHeight: 600,
              objectFit: 'contain',
              borderRadius: 16,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  )
}

// ----- DEMO SCENE -----
const DemoScene: React.FC<{
  story: Base44Plan['story']['demo']
  palette: ColorPalette
  screenshotUrl?: string
  duration: number
}> = ({ story, palette, screenshotUrl, duration }) => {
  const frame = useCurrentFrame()

  const headlineOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' })
  const imageOpacity = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: 'clamp' })
  const imageY = interpolate(frame, [10, 25], [40, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || palette.background[0],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 60,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          marginTop: 60,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 40,
          fontWeight: 700,
          color: palette.text.primary,
          textAlign: 'center',
        }}
      >
        {story.headline}
      </div>

      {/* Screenshot - Hero style */}
      {screenshotUrl && (
        <div
          style={{
            opacity: imageOpacity,
            transform: `translateY(${imageY}px)`,
            marginTop: 40,
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            borderRadius: 20,
            overflow: 'hidden',
            border: '4px solid #222',
          }}
        >
          <Img
            src={screenshotUrl}
            style={{
              width: 900,
              maxHeight: 700,
              objectFit: 'contain',
            }}
          />
        </div>
      )}

      {/* Feature points */}
      {story.featurePoints && story.featurePoints.length > 0 && (
        <div
          style={{
            position: 'absolute',
            bottom: 100,
            display: 'flex',
            gap: 30,
          }}
        >
          {story.featurePoints.map((point, i) => {
            const pointOpacity = interpolate(
              frame,
              [35 + i * 6, 45 + i * 6],
              [0, 1],
              { extrapolateRight: 'clamp' }
            )
            return (
              <div
                key={i}
                style={{
                  opacity: pointOpacity,
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 12,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  fontSize: 18,
                  color: palette.text.secondary,
                }}
              >
                {point}
              </div>
            )
          })}
        </div>
      )}
    </AbsoluteFill>
  )
}

// ----- PROOF SCENE -----
const ProofScene: React.FC<{
  story: Base44Plan['story']['proof']
  palette: ColorPalette
  duration: number
}> = ({ story, palette, duration }) => {
  const frame = useCurrentFrame()

  const statOpacity = interpolate(frame, [5, 15], [0, 1], { extrapolateRight: 'clamp' })
  const statScale = interpolate(frame, [5, 15], [0.7, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  })
  const headlineOpacity = interpolate(frame, [15, 28], [0, 1], { extrapolateRight: 'clamp' })
  const subtextOpacity = interpolate(frame, [25, 38], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || `linear-gradient(135deg, ${palette.secondary}, ${palette.primary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Glass card */}
      <div
        style={{
          padding: 60,
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
        }}
      >
        {/* Stat */}
        {story.stat && (
          <div
            style={{
              opacity: statOpacity,
              transform: `scale(${statScale})`,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 96,
              fontWeight: 900,
              color: palette.text.primary,
              textShadow: `0 0 60px ${palette.primary}40`,
            }}
          >
            {story.stat}
          </div>
        )}

        {/* Headline */}
        <div
          style={{
            opacity: headlineOpacity,
            marginTop: story.stat ? 16 : 0,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 42,
            fontWeight: 700,
            color: palette.text.primary,
          }}
        >
          {story.headline}
        </div>

        {/* Subtext */}
        {story.subtext && (
          <div
            style={{
              opacity: subtextOpacity,
              marginTop: 12,
              fontFamily: 'Inter, system-ui, sans-serif',
              fontSize: 24,
              color: palette.text.secondary,
            }}
          >
            {story.subtext}
          </div>
        )}
      </div>
    </AbsoluteFill>
  )
}

// ----- CTA SCENE -----
const CTAScene: React.FC<{
  story: Base44Plan['story']['cta']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
  duration: number
}> = ({ story, brand, palette, logoUrl, duration }) => {
  const frame = useCurrentFrame()

  const headlineOpacity = interpolate(frame, [5, 18], [0, 1], { extrapolateRight: 'clamp' })
  const headlineY = interpolate(frame, [5, 18], [30, 0], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })
  const buttonOpacity = interpolate(frame, [15, 25], [0, 1], { extrapolateRight: 'clamp' })
  const buttonScale = interpolate(frame, [15, 25], [0.8, 1], {
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.3)),
  })
  const buttonPulse = interpolate(
    frame % 30,
    [0, 15, 30],
    [1, 1.03, 1],
    { extrapolateRight: 'clamp' }
  )
  const subtextOpacity = interpolate(frame, [25, 35], [0, 1], { extrapolateRight: 'clamp' })
  const logoOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill
      style={{
        background: DEBUG_BG || `linear-gradient(135deg, ${palette.primary}, ${palette.accent || palette.secondary})`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 60,
      }}
    >
      {/* Headline */}
      <div
        style={{
          opacity: headlineOpacity,
          transform: `translateY(${headlineY}px)`,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 52,
          fontWeight: 800,
          color: palette.text.primary,
          textAlign: 'center',
          textShadow: '0 4px 30px rgba(0,0,0,0.3)',
        }}
      >
        {story.headline}
      </div>

      {/* CTA Button */}
      <div
        style={{
          opacity: buttonOpacity,
          transform: `scale(${buttonScale * buttonPulse})`,
          marginTop: 40,
          padding: '24px 64px',
          backgroundColor: '#fff',
          color: palette.primary,
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: 28,
          fontWeight: 700,
          borderRadius: 16,
          boxShadow: `0 10px 40px rgba(0,0,0,0.3)`,
        }}
      >
        {story.buttonText}
      </div>

      {/* Subtext */}
      {story.subtext && (
        <div
          style={{
            opacity: subtextOpacity,
            marginTop: 20,
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: 20,
            color: palette.text.secondary,
          }}
        >
          {story.subtext}
        </div>
      )}

      {/* Logo */}
      {logoUrl && (
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            opacity: logoOpacity,
          }}
        >
          <Img
            src={logoUrl}
            style={{
              height: 40,
              objectFit: 'contain',
              opacity: 0.8,
            }}
          />
        </div>
      )}
    </AbsoluteFill>
  )
}

// =============================================================================
// CONFIG EXPORT
// =============================================================================

export const BASE44_PREMIUM_TEMPLATE_CONFIG = {
  id: 'Base44PremiumTemplate',
  component: Base44PremiumTemplate,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultDurationInFrames: 480, // ~16 seconds
}

export default Base44PremiumTemplate
