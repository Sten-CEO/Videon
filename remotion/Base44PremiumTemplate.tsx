/**
 * BASE44 PREMIUM TEMPLATE - CINEMATIC EDITION
 *
 * A continuous-flow marketing video system that creates professional,
 * agency-quality videos like Base44, Lovable, and other top SaaS brands.
 *
 * Key differences from traditional templates:
 * - Continuous camera movement (no discrete "slides")
 * - Layered depth with parallax
 * - Orchestrated motion choreography
 * - Asymmetric professional compositions
 * - Persistent evolving design elements
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
  spring,
} from 'remotion'

import type { Base44Plan, SceneVisualConfig } from '../lib/templates/base44/planSchema'
import { PREMIUM_PALETTES, type ColorPalette } from '../lib/templates/base44/effects'
import { CinematicCanvas, type CameraState } from './components/CinematicCanvas'
import { MotionOrchestrator, OrchestratedHeadline, OrchestratedSubtext, OrchestratedButton, OrchestratedAccent } from './components/MotionOrchestrator'
import { CompositionGrid, getLayoutForScene, type LayoutPreset, type ContentBlock } from './components/CompositionGrid'

// =============================================================================
// CONFIG
// =============================================================================

const DEBUG_BG: string | null = null

const SCENE_DURATIONS = {
  short: { hook: 60, problem: 75, solution: 75, demo: 75, proof: 60, cta: 45 },
  standard: { hook: 75, problem: 90, solution: 90, demo: 90, proof: 75, cta: 60 },
  long: { hook: 90, problem: 105, solution: 105, demo: 105, proof: 90, cta: 75 },
}

// Motion style based on visual preset
const getMotionStyle = (preset: string): 'smooth' | 'snappy' | 'elastic' | 'dramatic' => {
  const map: Record<string, 'smooth' | 'snappy' | 'elastic' | 'dramatic'> = {
    minimal: 'smooth',
    modern: 'snappy',
    bold: 'dramatic',
    tech: 'snappy',
    elegant: 'smooth',
    energetic: 'elastic',
    cinematic: 'dramatic',
    playful: 'elastic',
  }
  return map[preset] || 'smooth'
}

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

const Typography = {
  headline: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  subhead: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 600,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  body: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 400,
    letterSpacing: '-0.01em',
    lineHeight: 1.4,
  },
  accent: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 500,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  stat: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 900,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
}

// =============================================================================
// MAIN TEMPLATE
// =============================================================================

export interface Base44PremiumTemplateProps {
  plan?: Base44Plan
}

export const Base44PremiumTemplate: React.FC<Base44PremiumTemplateProps> = ({ plan }) => {
  const frame = useCurrentFrame()
  const { fps, durationInFrames } = useVideoConfig()

  if (!plan) {
    return (
      <AbsoluteFill style={{ backgroundColor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FFF', fontSize: 40, fontWeight: 'bold' }}>NO PLAN PROVIDED</div>
      </AbsoluteFill>
    )
  }

  // Get palette and brand colors
  const paletteName = plan.settings.palette === 'auto' ? 'midnight' : plan.settings.palette
  const palette = PREMIUM_PALETTES[paletteName] || PREMIUM_PALETTES.midnight
  const brandPalette: ColorPalette = {
    ...palette,
    primary: plan.brand.accentColor || palette.primary,
  }

  // Scene timing
  const durations = SCENE_DURATIONS[plan.settings.duration]
  const sceneStarts = {
    hook: 0,
    problem: durations.hook,
    solution: durations.hook + durations.problem,
    demo: durations.hook + durations.problem + durations.solution,
    proof: durations.hook + durations.problem + durations.solution + durations.demo,
    cta: durations.hook + durations.problem + durations.solution + durations.demo + durations.proof,
  }
  const totalFrames = Object.values(durations).reduce((a, b) => a + b, 0)

  // Get images
  const getImageUrl = (role: string): string | undefined => {
    const cast = plan.casting.images.find(c => c.role === role)
    if (!cast) return undefined
    const img = plan.providedImages?.find(i => i.id === cast.imageId)
    return img?.url
  }

  const logoUrl = getImageUrl('logo')
  const heroScreenshotUrl = getImageUrl('heroScreenshot')

  // Visual style
  const visualStyle = plan.settings.visualStyle || { preset: 'modern' }
  const motionStyle = getMotionStyle(visualStyle.preset || 'modern')

  // Camera timeline - creates the continuous flow feeling
  const cameraTimeline: Array<{ frame: number; state: Partial<CameraState> }> = [
    // Start centered
    { frame: 0, state: { x: 0, y: 0, zoom: 1, rotation: 0 } },
    // Slight pull back on hook
    { frame: sceneStarts.hook + 30, state: { x: 0, y: -5, zoom: 1.02, rotation: 0 } },
    // Pan left for problem
    { frame: sceneStarts.problem, state: { x: -8, y: 0, zoom: 1, rotation: -0.5 } },
    // Pan right and zoom for solution
    { frame: sceneStarts.solution, state: { x: 8, y: -3, zoom: 1.05, rotation: 0.5 } },
    // Pull back for demo
    { frame: sceneStarts.demo, state: { x: 0, y: 5, zoom: 0.98, rotation: 0 } },
    // Dramatic push for proof
    { frame: sceneStarts.proof, state: { x: 0, y: 0, zoom: 1.08, rotation: 0 } },
    // Center and zoom for CTA
    { frame: sceneStarts.cta, state: { x: 0, y: -2, zoom: 1.03, rotation: 0 } },
    // Final frame
    { frame: totalFrames - 1, state: { x: 0, y: 0, zoom: 1, rotation: 0 } },
  ]

  // Log on first frame
  if (frame === 0) {
    console.log('%c[BASE44 CINEMATIC] Rendering premium video', 'color: #6366F1; font-weight: bold;')
    console.log('[BASE44 CINEMATIC] Brand:', plan.brand.name)
    console.log('[BASE44 CINEMATIC] Style:', visualStyle.preset || 'modern')
    console.log('[BASE44 CINEMATIC] Motion:', motionStyle)
    console.log('[BASE44 CINEMATIC] Duration:', totalFrames, 'frames')
  }

  return (
    <CinematicCanvas
      primaryColor={brandPalette.primary}
      secondaryColor={brandPalette.secondary}
      backgroundColor={brandPalette.background[0]}
      cameraTimeline={cameraTimeline}
      intensity="moderate"
    >
      {/* SCENE 1: HOOK */}
      <Sequence from={sceneStarts.hook} durationInFrames={durations.hook} name="1-HOOK">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.3, floatIntensity: 0.2, beatInterval: 15, timing: { headline: 5, subtext: 15, image: 20, accent: 25, button: 30 } }}>
          <HookScene
            story={plan.story.hook}
            brand={plan.brand}
            palette={brandPalette}
            logoUrl={logoUrl}
          />
        </MotionOrchestrator>
      </Sequence>

      {/* SCENE 2: PROBLEM */}
      <Sequence from={sceneStarts.problem} durationInFrames={durations.problem} name="2-PROBLEM">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.2, floatIntensity: 0.15, beatInterval: 12, timing: { headline: 5, subtext: 12, image: 18, accent: 8, button: 25 } }}>
          <ProblemScene
            story={plan.story.problem}
            palette={brandPalette}
          />
        </MotionOrchestrator>
      </Sequence>

      {/* SCENE 3: SOLUTION */}
      <Sequence from={sceneStarts.solution} durationInFrames={durations.solution} name="3-SOLUTION">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.25, floatIntensity: 0.2, beatInterval: 15, timing: { headline: 5, subtext: 12, image: 18, accent: 25, button: 30 } }}>
          <SolutionScene
            story={plan.story.solution}
            brand={plan.brand}
            palette={brandPalette}
            screenshotUrl={heroScreenshotUrl}
          />
        </MotionOrchestrator>
      </Sequence>

      {/* SCENE 4: DEMO */}
      <Sequence from={sceneStarts.demo} durationInFrames={durations.demo} name="4-DEMO">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.2, floatIntensity: 0.25, beatInterval: 12, timing: { headline: 5, subtext: 10, image: 8, accent: 30, button: 35 } }}>
          <DemoScene
            story={plan.story.demo}
            palette={brandPalette}
            screenshotUrl={heroScreenshotUrl}
          />
        </MotionOrchestrator>
      </Sequence>

      {/* SCENE 5: PROOF */}
      <Sequence from={sceneStarts.proof} durationInFrames={durations.proof} name="5-PROOF">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.15, floatIntensity: 0.1, beatInterval: 18, timing: { headline: 8, subtext: 18, image: 25, accent: 5, button: 30 } }}>
          <ProofScene
            story={plan.story.proof}
            palette={brandPalette}
          />
        </MotionOrchestrator>
      </Sequence>

      {/* SCENE 6: CTA */}
      <Sequence from={sceneStarts.cta} durationInFrames={durations.cta} name="6-CTA">
        <MotionOrchestrator config={{ style: motionStyle, breatheIntensity: 0.2, floatIntensity: 0.15, beatInterval: 10, timing: { headline: 3, subtext: 18, image: 25, accent: 30, button: 10 } }}>
          <CTAScene
            story={plan.story.cta}
            brand={plan.brand}
            palette={brandPalette}
            logoUrl={logoUrl}
          />
        </MotionOrchestrator>
      </Sequence>
    </CinematicCanvas>
  )
}

// =============================================================================
// SCENE COMPONENTS - Redesigned with professional compositions
// =============================================================================

// ----- HOOK SCENE -----
const HookScene: React.FC<{
  story: Base44Plan['story']['hook']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
}> = ({ story, brand, palette, logoUrl }) => {
  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Brand badge - top left for asymmetry */}
      <OrchestratedAccent
        delay={0}
        style={{
          position: 'absolute',
          top: 60,
          left: 60,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {logoUrl && (
          <Img src={logoUrl} style={{ height: 36, width: 'auto' }} />
        )}
        <span style={{
          ...Typography.accent,
          fontSize: 18,
          color: palette.text.muted,
          textTransform: 'uppercase',
        }}>
          {brand.name}
        </span>
      </OrchestratedAccent>

      {/* Main content - slightly off-center for visual interest */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingLeft: '8%',
        paddingRight: '15%',
      }}>
        <OrchestratedHeadline style={{
          ...Typography.headline,
          fontSize: 72,
          color: palette.text.primary,
          maxWidth: '90%',
          textShadow: `0 4px 60px ${palette.primary}40`,
        }}>
          {story.headline}
        </OrchestratedHeadline>

        {story.subtext && (
          <OrchestratedSubtext
            delay={5}
            style={{
              ...Typography.body,
              fontSize: 28,
              color: palette.text.secondary,
              marginTop: 24,
              maxWidth: '70%',
            }}
          >
            {story.subtext}
          </OrchestratedSubtext>
        )}
      </AbsoluteFill>

      {/* Accent line - adds visual interest */}
      <OrchestratedAccent
        delay={15}
        style={{
          position: 'absolute',
          bottom: 120,
          left: '8%',
          width: 120,
          height: 4,
          backgroundColor: palette.primary,
          borderRadius: 2,
        }}
      />
    </AbsoluteFill>
  )
}

// ----- PROBLEM SCENE -----
const ProblemScene: React.FC<{
  story: Base44Plan['story']['problem']
  palette: ColorPalette
}> = ({ story, palette }) => {
  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Content - right-aligned for variety */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: '8%',
        paddingLeft: '20%',
      }}>
        <OrchestratedHeadline style={{
          ...Typography.headline,
          fontSize: 56,
          color: palette.text.primary,
          textAlign: 'right',
          maxWidth: '85%',
        }}>
          {story.headline}
        </OrchestratedHeadline>

        {story.subtext && (
          <OrchestratedSubtext
            delay={5}
            style={{
              ...Typography.body,
              fontSize: 24,
              color: palette.text.secondary,
              marginTop: 20,
              textAlign: 'right',
              maxWidth: '75%',
            }}
          >
            {story.subtext}
          </OrchestratedSubtext>
        )}

        {/* Bullets - staggered appearance */}
        {story.bullets && story.bullets.length > 0 && (
          <div style={{ marginTop: 40, textAlign: 'right' }}>
            {story.bullets.map((bullet, i) => (
              <OrchestratedAccent
                key={i}
                delay={15 + i * 8}
                style={{
                  ...Typography.accent,
                  fontSize: 20,
                  color: palette.text.muted,
                  marginBottom: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: 12,
                }}
              >
                {bullet}
                <span style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: palette.primary,
                  opacity: 0.6,
                }} />
              </OrchestratedAccent>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ----- SOLUTION SCENE -----
const SolutionScene: React.FC<{
  story: Base44Plan['story']['solution']
  brand: Base44Plan['brand']
  palette: ColorPalette
  screenshotUrl?: string
}> = ({ story, brand, palette, screenshotUrl }) => {
  const frame = useCurrentFrame()

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Split layout - text left, image right */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
        {/* Text side */}
        <div style={{
          flex: '0 0 45%',
          paddingLeft: '5%',
          paddingRight: '5%',
        }}>
          <OrchestratedAccent
            delay={0}
            style={{
              ...Typography.accent,
              fontSize: 14,
              color: palette.primary,
              textTransform: 'uppercase',
              marginBottom: 16,
              letterSpacing: '0.1em',
            }}
          >
            Introducing
          </OrchestratedAccent>

          <OrchestratedHeadline style={{
            ...Typography.headline,
            fontSize: 48,
            color: palette.text.primary,
          }}>
            {story.headline}
          </OrchestratedHeadline>

          {story.subtext && (
            <OrchestratedSubtext
              delay={8}
              style={{
                ...Typography.body,
                fontSize: 22,
                color: palette.text.secondary,
                marginTop: 20,
                lineHeight: 1.5,
              }}
            >
              {story.subtext}
            </OrchestratedSubtext>
          )}
        </div>

        {/* Image side */}
        {screenshotUrl && (
          <div style={{
            flex: '0 0 50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <OrchestratedAccent
              delay={12}
              style={{
                padding: 12,
                background: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: 20,
                border: '1px solid rgba(255,255,255,0.1)',
                boxShadow: `0 20px 60px ${palette.primary}20`,
              }}
            >
              <Img
                src={screenshotUrl}
                style={{
                  width: 420,
                  height: 'auto',
                  borderRadius: 12,
                  display: 'block',
                }}
              />
            </OrchestratedAccent>
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ----- DEMO SCENE -----
const DemoScene: React.FC<{
  story: Base44Plan['story']['demo']
  palette: ColorPalette
  screenshotUrl?: string
}> = ({ story, palette, screenshotUrl }) => {
  return (
    <AbsoluteFill style={{ padding: 60 }}>
      {/* Hero image centered, text below */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 60,
      }}>
        {/* Headline */}
        <OrchestratedHeadline style={{
          ...Typography.subhead,
          fontSize: 36,
          color: palette.text.primary,
          marginBottom: 30,
        }}>
          {story.headline}
        </OrchestratedHeadline>

        {/* Screenshot - large and prominent */}
        {screenshotUrl && (
          <OrchestratedAccent
            delay={5}
            style={{
              padding: 8,
              background: 'linear-gradient(145deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.15)',
              boxShadow: `
                0 25px 80px rgba(0,0,0,0.4),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `,
            }}
          >
            <Img
              src={screenshotUrl}
              style={{
                width: 800,
                height: 'auto',
                borderRadius: 18,
                display: 'block',
              }}
            />
          </OrchestratedAccent>
        )}

        {/* Feature points - horizontal at bottom */}
        {story.featurePoints && story.featurePoints.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 80,
            display: 'flex',
            gap: 24,
          }}>
            {story.featurePoints.map((point, i) => (
              <OrchestratedAccent
                key={i}
                delay={25 + i * 6}
                style={{
                  padding: '14px 28px',
                  background: 'rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <span style={{
                  ...Typography.accent,
                  fontSize: 16,
                  color: palette.text.secondary,
                }}>
                  {point}
                </span>
              </OrchestratedAccent>
            ))}
          </div>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ----- PROOF SCENE -----
const ProofScene: React.FC<{
  story: Base44Plan['story']['proof']
  palette: ColorPalette
}> = ({ story, palette }) => {
  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Centered dramatic stat */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glass card for premium feel */}
        <OrchestratedAccent
          delay={0}
          style={{
            padding: '60px 80px',
            background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(30px)',
            borderRadius: 32,
            border: '1px solid rgba(255,255,255,0.2)',
            textAlign: 'center',
            boxShadow: `
              0 30px 100px ${palette.primary}30,
              inset 0 1px 0 rgba(255,255,255,0.2)
            `,
          }}
        >
          {/* Big stat */}
          {story.stat && (
            <OrchestratedHeadline style={{
              ...Typography.stat,
              fontSize: 120,
              color: palette.text.primary,
              textShadow: `0 0 80px ${palette.primary}50`,
            }}>
              {story.stat}
            </OrchestratedHeadline>
          )}

          {/* Headline */}
          <OrchestratedSubtext
            delay={10}
            style={{
              ...Typography.headline,
              fontSize: 40,
              color: palette.text.primary,
              marginTop: story.stat ? 16 : 0,
            }}
          >
            {story.headline}
          </OrchestratedSubtext>

          {/* Subtext */}
          {story.subtext && (
            <OrchestratedSubtext
              delay={18}
              style={{
                ...Typography.body,
                fontSize: 22,
                color: palette.text.secondary,
                marginTop: 12,
              }}
            >
              {story.subtext}
            </OrchestratedSubtext>
          )}
        </OrchestratedAccent>
      </AbsoluteFill>
    </AbsoluteFill>
  )
}

// ----- CTA SCENE -----
const CTAScene: React.FC<{
  story: Base44Plan['story']['cta']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
}> = ({ story, brand, palette, logoUrl }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Pulsing button
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 2) * 0.02

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Centered CTA */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Headline */}
        <OrchestratedHeadline style={{
          ...Typography.headline,
          fontSize: 56,
          color: palette.text.primary,
          textAlign: 'center',
          maxWidth: '80%',
          textShadow: `0 4px 40px ${palette.primary}30`,
        }}>
          {story.headline}
        </OrchestratedHeadline>

        {/* CTA Button */}
        <OrchestratedButton
          delay={5}
          style={{
            marginTop: 40,
            padding: '24px 64px',
            backgroundColor: '#fff',
            color: palette.primary,
            ...Typography.subhead,
            fontSize: 26,
            borderRadius: 16,
            boxShadow: `
              0 15px 50px rgba(0,0,0,0.3),
              0 0 80px ${palette.primary}30,
              inset 0 1px 0 rgba(255,255,255,0.5)
            `,
            transform: `scale(${pulse})`,
            cursor: 'pointer',
          }}
        >
          {story.buttonText}
        </OrchestratedButton>

        {/* Reassurance text */}
        {story.subtext && (
          <OrchestratedSubtext
            delay={15}
            style={{
              ...Typography.body,
              fontSize: 18,
              color: palette.text.muted,
              marginTop: 20,
            }}
          >
            {story.subtext}
          </OrchestratedSubtext>
        )}
      </AbsoluteFill>

      {/* Brand at bottom */}
      <OrchestratedAccent
        delay={20}
        style={{
          position: 'absolute',
          bottom: 60,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
        }}
      >
        {logoUrl && (
          <Img src={logoUrl} style={{ height: 28, width: 'auto', opacity: 0.8 }} />
        )}
        <span style={{
          ...Typography.accent,
          fontSize: 16,
          color: palette.text.muted,
        }}>
          {brand.name}
        </span>
      </OrchestratedAccent>
    </AbsoluteFill>
  )
}

// =============================================================================
// EXPORTS
// =============================================================================

export const BASE44_PREMIUM_TEMPLATE_CONFIG = {
  id: 'Base44PremiumTemplate',
  component: Base44PremiumTemplate,
  fps: 30,
  width: 1080,
  height: 1920,
  defaultDurationInFrames: 480,
}

export default Base44PremiumTemplate
