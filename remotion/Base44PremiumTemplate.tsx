/**
 * BASE44 PREMIUM TEMPLATE - EFFECTS EDITION
 *
 * Professional marketing video system with:
 * - Dynamic visual effects (image reveals, text animations)
 * - Design elements for empty scenes
 * - Smart scene compositions
 * - Smooth scene transitions
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

import type { Base44Plan, EffectPresetName } from '../lib/templates/base44/planSchema'
import { PREMIUM_PALETTES, type ColorPalette } from '../lib/templates/base44/effects'

// Import Effects System
import {
  ImageRevealRenderer,
  TextRevealRenderer,
  StatRevealRenderer,
  TransitionRenderer,
  PRESET_CONFIGS,
  getEffectForScene,
} from './effects/EffectRenderer'
import { SceneBackground } from './effects/DesignElements'

// =============================================================================
// CONFIG
// =============================================================================

const SCENE_DURATIONS = {
  short: { hook: 60, problem: 75, solution: 75, demo: 75, proof: 60, cta: 45 },
  standard: { hook: 75, problem: 90, solution: 90, demo: 90, proof: 75, cta: 60 },
  long: { hook: 90, problem: 105, solution: 105, demo: 105, proof: 90, cta: 75 },
}

// =============================================================================
// TYPOGRAPHY SYSTEM
// =============================================================================

const Typography = {
  headline: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 800 as const,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
  },
  subhead: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 600 as const,
    letterSpacing: '-0.02em',
    lineHeight: 1.2,
  },
  body: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 400 as const,
    letterSpacing: '-0.01em',
    lineHeight: 1.4,
  },
  accent: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 500 as const,
    letterSpacing: '0.02em',
    lineHeight: 1.3,
  },
  stat: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
    fontWeight: 900 as const,
    letterSpacing: '-0.04em',
    lineHeight: 1,
  },
}

// =============================================================================
// GRADIENT BACKGROUND
// =============================================================================

const GradientBackground: React.FC<{
  colors: string[]
  primary: string
}> = ({ colors, primary }) => {
  const frame = useCurrentFrame()
  const shimmer = Math.sin(frame * 0.02) * 5

  return (
    <AbsoluteFill
      style={{
        background: `
          radial-gradient(ellipse at ${50 + shimmer}% ${30 + shimmer}%, ${primary}15 0%, transparent 50%),
          linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 50%, ${colors[2] || colors[0]} 100%)
        `,
      }}
    />
  )
}

// =============================================================================
// ANIMATED TEXT WRAPPER
// =============================================================================

interface AnimatedTextProps {
  children: string
  effect: string
  delay?: number
  duration?: number
  color?: string
  accentColor?: string
  fontSize?: number
  fontWeight?: number
  style?: React.CSSProperties
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  effect,
  delay = 0,
  duration = 45,
  color = '#FFFFFF',
  accentColor,
  fontSize = 48,
  fontWeight = 800,
  style,
}) => {
  return (
    <TextRevealRenderer
      effect={effect as any}
      text={children}
      startFrame={delay}
      duration={duration}
      color={color}
      accentColor={accentColor}
      fontSize={fontSize}
      fontWeight={fontWeight}
      style={style}
    />
  )
}

// =============================================================================
// ANIMATED IMAGE WRAPPER
// =============================================================================

interface AnimatedImageProps {
  src: string
  effect: string
  delay?: number
  duration?: number
  accentColor?: string
  style?: React.CSSProperties
}

const AnimatedImage: React.FC<AnimatedImageProps> = ({
  src,
  effect,
  delay = 0,
  duration = 45,
  accentColor,
  style,
}) => {
  return (
    <ImageRevealRenderer
      effect={effect as any}
      src={src}
      startFrame={delay}
      duration={duration}
      accentColor={accentColor}
      style={style}
    />
  )
}

// =============================================================================
// SCENE WRAPPER WITH TRANSITION
// =============================================================================

interface SceneWrapperProps {
  children: React.ReactNode
  palette: ColorPalette
  sceneDesign?: { style: string; intensity: string }
  transitionEffect: string
  transitionDuration?: number
}

const SceneWrapper: React.FC<SceneWrapperProps> = ({
  children,
  palette,
  sceneDesign,
  transitionEffect,
  transitionDuration = 15,
}) => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()

  // Entry transition
  const entryProgress = interpolate(frame, [0, transitionDuration], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  // Exit transition
  const exitStart = durationInFrames - transitionDuration
  const exitProgress = interpolate(frame, [exitStart, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.in(Easing.cubic),
  })

  const progress = Math.min(entryProgress, exitProgress)

  return (
    <AbsoluteFill style={{ opacity: progress }}>
      {/* Design Background */}
      {sceneDesign && (
        <SceneBackground
          primaryColor={palette.primary}
          secondaryColor={palette.secondary}
          style={sceneDesign.style as any}
          intensity={sceneDesign.intensity as any}
        />
      )}
      {children}
    </AbsoluteFill>
  )
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

  // Get images
  const getImageUrl = (role: string): string | undefined => {
    const cast = plan.casting.images.find(c => c.role === role)
    if (!cast) return undefined
    const img = plan.providedImages?.find(i => i.id === cast.imageId)
    return img?.url
  }

  const logoUrl = getImageUrl('logo')
  const heroScreenshotUrl = getImageUrl('heroScreenshot')

  // Effects configuration
  const effectsConfig = plan.settings.effects || { preset: 'modern' as EffectPresetName }
  const effectPreset = effectsConfig.preset || 'modern'

  // Scene design (from AI or defaults)
  const sceneDesign = plan.sceneDesign || {
    hook: { style: 'dynamic', intensity: 'high' },
    problem: { style: 'geometric', intensity: 'medium' },
    solution: { style: 'dynamic', intensity: 'high' },
    demo: { style: 'tech', intensity: 'medium' },
    proof: { style: 'minimal', intensity: 'low' },
    cta: { style: 'dynamic', intensity: 'high' },
  }

  // Get effect for a scene
  const getTextEffect = (scene: string) => getEffectForScene(scene, 'textReveal', effectsConfig)
  const getImageEffect = (scene: string) => getEffectForScene(scene, 'imageReveal', effectsConfig)
  const getTransitionEffect = (scene: string) => getEffectForScene(scene, 'transition', effectsConfig)
  const getStatEffect = (scene: string) => getEffectForScene(scene, 'statReveal', effectsConfig)

  // Log on first frame
  if (frame === 0) {
    console.log('%c[BASE44 EFFECTS] Rendering with effects system', 'color: #6366F1; font-weight: bold;')
    console.log('[BASE44 EFFECTS] Brand:', plan.brand.name)
    console.log('[BASE44 EFFECTS] Effect Preset:', effectPreset)
    console.log('[BASE44 EFFECTS] Palette:', paletteName)
  }

  return (
    <AbsoluteFill>
      {/* Base gradient background */}
      <GradientBackground colors={brandPalette.background} primary={brandPalette.primary} />

      {/* SCENE 1: HOOK */}
      <Sequence from={sceneStarts.hook} durationInFrames={durations.hook} name="1-HOOK">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.hook}
          transitionEffect={getTransitionEffect('hook')}
        >
          <HookScene
            story={plan.story.hook}
            brand={plan.brand}
            palette={brandPalette}
            logoUrl={logoUrl}
            textEffect={getTextEffect('hook')}
            imageEffect={getImageEffect('hook')}
          />
        </SceneWrapper>
      </Sequence>

      {/* SCENE 2: PROBLEM */}
      <Sequence from={sceneStarts.problem} durationInFrames={durations.problem} name="2-PROBLEM">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.problem}
          transitionEffect={getTransitionEffect('problem')}
        >
          <ProblemScene
            story={plan.story.problem}
            palette={brandPalette}
            textEffect={getTextEffect('problem')}
          />
        </SceneWrapper>
      </Sequence>

      {/* SCENE 3: SOLUTION */}
      <Sequence from={sceneStarts.solution} durationInFrames={durations.solution} name="3-SOLUTION">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.solution}
          transitionEffect={getTransitionEffect('solution')}
        >
          <SolutionScene
            story={plan.story.solution}
            brand={plan.brand}
            palette={brandPalette}
            screenshotUrl={heroScreenshotUrl}
            textEffect={getTextEffect('solution')}
            imageEffect={getImageEffect('solution')}
          />
        </SceneWrapper>
      </Sequence>

      {/* SCENE 4: DEMO */}
      <Sequence from={sceneStarts.demo} durationInFrames={durations.demo} name="4-DEMO">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.demo}
          transitionEffect={getTransitionEffect('demo')}
        >
          <DemoScene
            story={plan.story.demo}
            palette={brandPalette}
            screenshotUrl={heroScreenshotUrl}
            textEffect={getTextEffect('demo')}
            imageEffect={getImageEffect('demo')}
          />
        </SceneWrapper>
      </Sequence>

      {/* SCENE 5: PROOF */}
      <Sequence from={sceneStarts.proof} durationInFrames={durations.proof} name="5-PROOF">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.proof}
          transitionEffect={getTransitionEffect('proof')}
        >
          <ProofScene
            story={plan.story.proof}
            palette={brandPalette}
            textEffect={getTextEffect('proof')}
            statEffect={getStatEffect('proof')}
          />
        </SceneWrapper>
      </Sequence>

      {/* SCENE 6: CTA */}
      <Sequence from={sceneStarts.cta} durationInFrames={durations.cta} name="6-CTA">
        <SceneWrapper
          palette={brandPalette}
          sceneDesign={sceneDesign.cta}
          transitionEffect={getTransitionEffect('cta')}
        >
          <CTAScene
            story={plan.story.cta}
            brand={plan.brand}
            palette={brandPalette}
            logoUrl={logoUrl}
            textEffect={getTextEffect('cta')}
          />
        </SceneWrapper>
      </Sequence>
    </AbsoluteFill>
  )
}

// =============================================================================
// SCENE COMPONENTS - Redesigned with Effects
// =============================================================================

// ----- HOOK SCENE -----
const HookScene: React.FC<{
  story: Base44Plan['story']['hook']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
  textEffect: string
  imageEffect: string
}> = ({ story, brand, palette, logoUrl, textEffect, imageEffect }) => {
  const frame = useCurrentFrame()

  // Brand badge fade in
  const brandOpacity = interpolate(frame, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Brand badge - top left */}
      <div
        style={{
          position: 'absolute',
          top: 80,
          left: 80,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: brandOpacity,
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
      </div>

      {/* Main content - centered with proper margins */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '120px 100px',
      }}>
        {/* Main headline with effect */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={45}
          color={palette.text.primary}
          accentColor={palette.primary}
          fontSize={72}
          fontWeight={800}
          style={{
            ...Typography.headline,
            textAlign: 'center',
            maxWidth: '90%',
            textShadow: `0 4px 60px ${palette.primary}40`,
          }}
        >
          {story.headline}
        </AnimatedText>

        {story.subtext && (
          <AnimatedText
            effect="REVEAL_TEXT_BLUR_IN"
            delay={25}
            duration={30}
            color={palette.text.secondary}
            fontSize={28}
            fontWeight={400}
            style={{
              ...Typography.body,
              textAlign: 'center',
              marginTop: 24,
              maxWidth: '70%',
            }}
          >
            {story.subtext}
          </AnimatedText>
        )}
      </AbsoluteFill>

      {/* Accent line - animated */}
      <AccentLine color={palette.primary} delay={35} />
    </AbsoluteFill>
  )
}

// ----- PROBLEM SCENE -----
const ProblemScene: React.FC<{
  story: Base44Plan['story']['problem']
  palette: ColorPalette
  textEffect: string
}> = ({ story, palette, textEffect }) => {
  return (
    <AbsoluteFill style={{ padding: 100 }}>
      {/* Content - centered */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={45}
          color={palette.text.primary}
          accentColor={palette.primary}
          fontSize={56}
          fontWeight={800}
          style={{
            ...Typography.headline,
            textAlign: 'center',
            maxWidth: '85%',
          }}
        >
          {story.headline}
        </AnimatedText>

        {story.subtext && (
          <AnimatedText
            effect="REVEAL_TEXT_BLUR_IN"
            delay={20}
            duration={30}
            color={palette.text.secondary}
            fontSize={24}
            fontWeight={400}
            style={{
              ...Typography.body,
              marginTop: 24,
              textAlign: 'center',
              maxWidth: '75%',
            }}
          >
            {story.subtext}
          </AnimatedText>
        )}

        {/* Bullets - staggered appearance */}
        {story.bullets && story.bullets.length > 0 && (
          <div style={{ marginTop: 50, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
            {story.bullets.map((bullet, i) => (
              <BulletPoint
                key={i}
                text={bullet}
                color={palette.primary}
                textColor={palette.text.muted}
                delay={35 + i * 10}
              />
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
  textEffect: string
  imageEffect: string
}> = ({ story, brand, palette, screenshotUrl, textEffect, imageEffect }) => {
  return (
    <AbsoluteFill style={{ padding: 80 }}>
      {/* Split layout or centered if no image */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* "Introducing" label */}
        <div style={{
          ...Typography.accent,
          fontSize: 16,
          color: palette.primary,
          textTransform: 'uppercase',
          marginBottom: 20,
          letterSpacing: '0.15em',
        }}>
          Introducing
        </div>

        {/* Main headline */}
        <AnimatedText
          effect={textEffect}
          delay={10}
          duration={40}
          color={palette.text.primary}
          accentColor={palette.primary}
          fontSize={52}
          fontWeight={800}
          style={{
            ...Typography.headline,
            textAlign: 'center',
            maxWidth: '80%',
          }}
        >
          {story.headline}
        </AnimatedText>

        {story.subtext && (
          <AnimatedText
            effect="REVEAL_TEXT_BLUR_IN"
            delay={25}
            duration={30}
            color={palette.text.secondary}
            fontSize={24}
            fontWeight={400}
            style={{
              ...Typography.body,
              marginTop: 20,
              textAlign: 'center',
              maxWidth: '70%',
              lineHeight: 1.5,
            }}
          >
            {story.subtext}
          </AnimatedText>
        )}

        {/* Image with reveal effect */}
        {screenshotUrl && (
          <div style={{ marginTop: 40, width: '100%', display: 'flex', justifyContent: 'center' }}>
            <AnimatedImage
              src={screenshotUrl}
              effect={imageEffect}
              delay={35}
              duration={45}
              accentColor={palette.primary}
              style={{
                width: 450,
                height: 'auto',
                borderRadius: 16,
                boxShadow: `0 25px 80px ${palette.primary}30`,
              }}
            />
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
  textEffect: string
  imageEffect: string
}> = ({ story, palette, screenshotUrl, textEffect, imageEffect }) => {
  return (
    <AbsoluteFill style={{ padding: 80 }}>
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 100,
      }}>
        {/* Headline */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={40}
          color={palette.text.primary}
          accentColor={palette.primary}
          fontSize={40}
          fontWeight={700}
          style={{
            ...Typography.subhead,
            textAlign: 'center',
            marginBottom: 40,
          }}
        >
          {story.headline}
        </AnimatedText>

        {/* Screenshot - large with device frame effect */}
        {screenshotUrl && (
          <AnimatedImage
            src={screenshotUrl}
            effect={imageEffect}
            delay={20}
            duration={50}
            accentColor={palette.primary}
            style={{
              width: 700,
              maxWidth: '90%',
              height: 'auto',
              borderRadius: 20,
              boxShadow: `
                0 30px 100px rgba(0,0,0,0.4),
                0 0 0 1px rgba(255,255,255,0.1),
                inset 0 1px 0 rgba(255,255,255,0.1)
              `,
            }}
          />
        )}

        {/* Feature points - horizontal at bottom */}
        {story.featurePoints && story.featurePoints.length > 0 && (
          <div style={{
            position: 'absolute',
            bottom: 100,
            display: 'flex',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center',
            padding: '0 80px',
          }}>
            {story.featurePoints.map((point, i) => (
              <FeatureCard
                key={i}
                text={point}
                color={palette.text.secondary}
                delay={50 + i * 8}
              />
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
  textEffect: string
  statEffect: string
}> = ({ story, palette, textEffect, statEffect }) => {
  // Parse stat value
  const statValue = story.stat ? parseInt(story.stat.replace(/[^0-9]/g, '')) || 0 : 0
  const statSuffix = story.stat?.replace(/[0-9]/g, '').trim() || ''

  return (
    <AbsoluteFill style={{ padding: 100 }}>
      {/* Centered dramatic stat */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Glass card for premium feel */}
        <div style={{
          padding: '70px 100px',
          background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(30px)',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.2)',
          textAlign: 'center',
          boxShadow: `
            0 30px 100px ${palette.primary}30,
            inset 0 1px 0 rgba(255,255,255,0.2)
          `,
        }}>
          {/* Big stat with counter effect */}
          {story.stat && (
            <StatRevealRenderer
              effect={statEffect as any}
              value={statValue}
              suffix={statSuffix}
              startFrame={5}
              duration={50}
              color={palette.text.primary}
              accentColor={palette.primary}
              fontSize={120}
              fontWeight={900}
              style={{
                ...Typography.stat,
                textShadow: `0 0 80px ${palette.primary}50`,
              }}
            />
          )}

          {/* Headline */}
          <AnimatedText
            effect={textEffect}
            delay={30}
            duration={35}
            color={palette.text.primary}
            fontSize={42}
            fontWeight={800}
            style={{
              ...Typography.headline,
              marginTop: story.stat ? 20 : 0,
            }}
          >
            {story.headline}
          </AnimatedText>

          {/* Subtext */}
          {story.subtext && (
            <AnimatedText
              effect="REVEAL_TEXT_BLUR_IN"
              delay={45}
              duration={25}
              color={palette.text.secondary}
              fontSize={22}
              fontWeight={400}
              style={{
                ...Typography.body,
                marginTop: 16,
              }}
            >
              {story.subtext}
            </AnimatedText>
          )}
        </div>
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
  textEffect: string
}> = ({ story, brand, palette, logoUrl, textEffect }) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  // Pulsing button
  const pulse = 1 + Math.sin((frame / fps) * Math.PI * 3) * 0.03
  const buttonOpacity = interpolate(frame, [15, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ padding: 100 }}>
      {/* Centered CTA */}
      <AbsoluteFill style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Headline */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={35}
          color={palette.text.primary}
          accentColor={palette.primary}
          fontSize={56}
          fontWeight={800}
          style={{
            ...Typography.headline,
            textAlign: 'center',
            maxWidth: '80%',
            textShadow: `0 4px 40px ${palette.primary}30`,
          }}
        >
          {story.headline}
        </AnimatedText>

        {/* CTA Button with glow */}
        <div
          style={{
            marginTop: 50,
            padding: '26px 70px',
            backgroundColor: '#fff',
            color: palette.primary,
            ...Typography.subhead,
            fontSize: 28,
            borderRadius: 20,
            boxShadow: `
              0 15px 50px rgba(0,0,0,0.3),
              0 0 100px ${palette.primary}40,
              inset 0 1px 0 rgba(255,255,255,0.5)
            `,
            transform: `scale(${pulse})`,
            opacity: buttonOpacity,
          }}
        >
          {story.buttonText}
        </div>

        {/* Reassurance text */}
        {story.subtext && (
          <AnimatedText
            effect="REVEAL_TEXT_BLUR_IN"
            delay={35}
            duration={25}
            color={palette.text.muted}
            fontSize={18}
            fontWeight={400}
            style={{
              ...Typography.body,
              marginTop: 24,
            }}
          >
            {story.subtext}
          </AnimatedText>
        )}
      </AbsoluteFill>

      {/* Brand at bottom */}
      <div
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: interpolate(frame, [40, 55], [0, 0.8], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
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
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// HELPER COMPONENTS
// =============================================================================

const AccentLine: React.FC<{ color: string; delay: number }> = ({ color, delay }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame - delay, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 150,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120 * progress,
        height: 4,
        backgroundColor: color,
        borderRadius: 2,
        boxShadow: `0 0 20px ${color}`,
      }}
    />
  )
}

const BulletPoint: React.FC<{
  text: string
  color: string
  textColor: string
  delay: number
}> = ({ text, color, textColor, delay }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.5)),
  })

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        opacity: progress,
        transform: `translateY(${(1 - progress) * 20}px)`,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: color,
          boxShadow: `0 0 15px ${color}`,
        }}
      />
      <span style={{
        ...Typography.accent,
        fontSize: 20,
        color: textColor,
      }}>
        {text}
      </span>
    </div>
  )
}

const FeatureCard: React.FC<{
  text: string
  color: string
  delay: number
}> = ({ text, color, delay }) => {
  const frame = useCurrentFrame()
  const progress = interpolate(frame - delay, [0, 20], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.back(1.2)),
  })

  return (
    <div
      style={{
        padding: '16px 28px',
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.1)',
        opacity: progress,
        transform: `scale(${0.8 + progress * 0.2}) translateY(${(1 - progress) * 15}px)`,
      }}
    >
      <span style={{
        ...Typography.accent,
        fontSize: 16,
        color,
      }}>
        {text}
      </span>
    </div>
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
