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

import type { Base44Plan, SceneVisualConfig } from '../lib/templates/base44/planSchema'
import { PREMIUM_PALETTES, getGrainOverlayStyle, type ColorPalette } from '../lib/templates/base44/effects'
import { AnimatedText } from './components/AnimatedText'
import { AnimatedImage } from './components/AnimatedImage'
import { BackgroundLayer } from './components/BackgroundLayer'
import { TransitionOverlay } from './components/TransitionOverlay'
import { EFFECT_PRESETS } from '../lib/templates/base44/visualEffects'

// =============================================================================
// DEBUG MODE - SET TO 'red' TO VERIFY TEMPLATE IS BEING USED
// =============================================================================

// ⚠️ TRUTH TEST: Set to 'red' to verify template is being used
const DEBUG_BG: string | null = null  // Production mode

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

  // Get visual style configuration
  const visualStyle = plan.settings.visualStyle || {
    preset: 'modern',
    backgroundPattern: 'mesh',
    designElements: ['gradientBlobs', 'vignette'],
  }

  // If preset is specified, merge preset defaults
  const presetConfig = visualStyle.preset ? EFFECT_PRESETS[visualStyle.preset] : null
  const backgroundPattern = visualStyle.backgroundPattern || presetConfig?.backgroundPattern || 'gradient'
  const designElements = visualStyle.designElements || presetConfig?.designElements || ['vignette']
  const sceneEffects = visualStyle.sceneEffects || {}

  // Log at frame 0
  if (frame === 0) {
    console.log('%c╔══════════════════════════════════════════════════════════════╗', 'background: #6366F1; color: #fff;')
    console.log('%c║           BASE44 PREMIUM TEMPLATE RENDERING                   ║', 'background: #6366F1; color: #fff; font-size: 16px; font-weight: bold;')
    console.log('%c╚══════════════════════════════════════════════════════════════╝', 'background: #6366F1; color: #fff;')
    console.log('%c[BASE44] Plan ID:', 'color: #6366F1;', plan.id)
    console.log('%c[BASE44] Brand:', 'color: #6366F1;', plan.brand.name)
    console.log('%c[BASE44] Palette:', 'color: #6366F1;', paletteName)
    console.log('%c[BASE44] Visual Style:', 'color: #6366F1;', visualStyle.preset || 'custom')
    console.log('%c[BASE44] Background:', 'color: #6366F1;', backgroundPattern)
    console.log('%c[BASE44] Design Elements:', 'color: #6366F1;', designElements.join(', '))
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
          effects={sceneEffects.hook}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
        />
      </Sequence>

      {/* Scene 2: PROBLEM */}
      <Sequence from={sceneStarts.problem} durationInFrames={durations.problem} name="2-PROBLEM">
        <ProblemScene
          story={plan.story.problem}
          palette={brandPalette}
          duration={durations.problem}
          effects={sceneEffects.problem}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
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
          effects={sceneEffects.solution}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
        />
      </Sequence>

      {/* Scene 4: DEMO */}
      <Sequence from={sceneStarts.demo} durationInFrames={durations.demo} name="4-DEMO">
        <DemoScene
          story={plan.story.demo}
          palette={brandPalette}
          screenshotUrl={heroScreenshotUrl || extraScreen1Url}
          duration={durations.demo}
          effects={sceneEffects.demo}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
        />
      </Sequence>

      {/* Scene 5: PROOF */}
      <Sequence from={sceneStarts.proof} durationInFrames={durations.proof} name="5-PROOF">
        <ProofScene
          story={plan.story.proof}
          palette={brandPalette}
          duration={durations.proof}
          effects={sceneEffects.proof}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
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
          effects={sceneEffects.cta}
          backgroundPattern={backgroundPattern}
          designElements={designElements}
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

// ----- BRAND LOCKUP (Logo + Name together) -----
const BrandLockup: React.FC<{
  logoUrl?: string
  brandName: string
  palette: ColorPalette
  opacity: number
  size?: 'small' | 'medium' | 'large'
}> = ({ logoUrl, brandName, palette, opacity, size = 'medium' }) => {
  const sizes = {
    small: { logo: 32, text: 18, gap: 10 },
    medium: { logo: 48, text: 24, gap: 14 },
    large: { logo: 64, text: 32, gap: 18 },
  }
  const s = sizes[size]

  return (
    <div
      style={{
        opacity,
        display: 'flex',
        alignItems: 'center',
        gap: s.gap,
      }}
    >
      {logoUrl && (
        <Img
          src={logoUrl}
          style={{
            height: s.logo,
            width: 'auto',
            objectFit: 'contain',
          }}
        />
      )}
      <div
        style={{
          fontFamily: 'Inter, system-ui, sans-serif',
          fontSize: s.text,
          fontWeight: 700,
          color: palette.text.primary,
          letterSpacing: '-0.02em',
        }}
      >
        {brandName}
      </div>
    </div>
  )
}

// ----- HOOK SCENE -----
const HookScene: React.FC<{
  story: Base44Plan['story']['hook']
  brand: Base44Plan['brand']
  palette: ColorPalette
  logoUrl?: string
  duration: number
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, brand, palette, logoUrl, duration, effects, backgroundPattern, designElements }) => {
  const frame = useCurrentFrame()
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' })

  // Get effect configuration
  const textEffect = effects?.textEffect || 'scaleUp'

  return (
    <AbsoluteFill>
      {/* Dynamic Background with Pattern and Design Elements */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={[palette.primary, palette.secondary]}
          pattern={backgroundPattern as any}
          designElements={designElements as any[]}
          intensity={0.4}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Brand Lockup (Logo + Name) at top */}
        <div style={{ position: 'absolute', top: 80 }}>
          <BrandLockup
            logoUrl={logoUrl}
            brandName={brand.name}
            palette={palette}
            opacity={logoOpacity}
            size="medium"
          />
        </div>

        {/* Animated Headline */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={20}
          fontSize={56}
          fontWeight={800}
          color={palette.text.primary}
          style={{
            textShadow: '0 4px 30px rgba(0,0,0,0.3)',
            lineHeight: 1.1,
          }}
        >
          {story.headline}
        </AnimatedText>

        {/* Animated Subtext */}
        {story.subtext && (
          <div style={{ marginTop: 24 }}>
            <AnimatedText
              effect="fadeUp"
              delay={20}
              duration={15}
              fontSize={28}
              fontWeight={400}
              color={palette.text.secondary}
            >
              {story.subtext}
            </AnimatedText>
          </div>
        )}
      </AbsoluteFill>

      {/* Scene Transition */}
      {effects?.transition && effects.transition !== 'cut' && (
        <TransitionOverlay
          type={effects.transition}
          startFrame={duration - 15}
          durationFrames={15}
          color="#000"
        />
      )}
    </AbsoluteFill>
  )
}

// ----- PROBLEM SCENE -----
const ProblemScene: React.FC<{
  story: Base44Plan['story']['problem']
  palette: ColorPalette
  duration: number
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, palette, duration, effects, backgroundPattern, designElements }) => {
  const frame = useCurrentFrame()
  const textEffect = effects?.textEffect || 'slideLeft'

  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={palette.background}
          pattern={backgroundPattern as any}
          designElements={designElements as any[]}
          intensity={0.3}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Animated Headline */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={18}
          fontSize={48}
          fontWeight={700}
          color={palette.text.primary}
          style={{ lineHeight: 1.2, maxWidth: '90%' }}
        >
          {story.headline}
        </AnimatedText>

        {/* Animated Subtext */}
        {story.subtext && (
          <div style={{ marginTop: 20, maxWidth: '85%' }}>
            <AnimatedText
              effect="fadeUp"
              delay={20}
              duration={15}
              fontSize={24}
              fontWeight={400}
              color={palette.text.secondary}
            >
              {story.subtext}
            </AnimatedText>
          </div>
        )}

        {/* Animated Bullets */}
        {story.bullets && story.bullets.length > 0 && (
          <div style={{ marginTop: 40 }}>
            {story.bullets.map((bullet, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <AnimatedText
                  effect="slideRight"
                  delay={30 + i * 8}
                  duration={12}
                  fontSize={22}
                  fontWeight={500}
                  color={palette.text.muted}
                >
                  {`• ${bullet}`}
                </AnimatedText>
              </div>
            ))}
          </div>
        )}
      </AbsoluteFill>

      {/* Scene Transition */}
      {effects?.transition && effects.transition !== 'cut' && (
        <TransitionOverlay
          type={effects.transition}
          startFrame={duration - 15}
          durationFrames={15}
          color="#000"
        />
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
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, brand, palette, screenshotUrl, duration, effects, backgroundPattern, designElements }) => {
  const textEffect = effects?.textEffect || 'fadeUp'
  const imageEffect = effects?.imageEffect || 'slideUp'

  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={[palette.background[0], `${palette.primary}30`]}
          pattern={backgroundPattern as any}
          designElements={designElements as any[]}
          intensity={0.35}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 60,
        }}
      >
        {/* Animated Headline */}
        <div style={{ marginTop: 80 }}>
          <AnimatedText
            effect={textEffect}
            delay={5}
            duration={18}
            fontSize={44}
            fontWeight={700}
            color={palette.text.primary}
          >
            {story.headline}
          </AnimatedText>
        </div>

        {/* Animated Subtext */}
        {story.subtext && (
          <div style={{ marginTop: 16 }}>
            <AnimatedText
              effect="fadeUp"
              delay={15}
              duration={15}
              fontSize={24}
              fontWeight={400}
              color={palette.text.secondary}
            >
              {story.subtext}
            </AnimatedText>
          </div>
        )}

        {/* Animated Screenshot with glassmorphism */}
        {screenshotUrl && (
          <div
            style={{
              marginTop: 40,
              padding: 16,
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(20px)',
              borderRadius: 24,
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <AnimatedImage
              src={screenshotUrl}
              effect={imageEffect}
              delay={20}
              duration={25}
              width={800}
              height="auto"
              borderRadius={16}
              shadow={true}
            />
          </div>
        )}
      </AbsoluteFill>

      {/* Scene Transition */}
      {effects?.transition && effects.transition !== 'cut' && (
        <TransitionOverlay
          type={effects.transition}
          startFrame={duration - 15}
          durationFrames={15}
          color="#000"
        />
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
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, palette, screenshotUrl, duration, effects, backgroundPattern, designElements }) => {
  const frame = useCurrentFrame()
  const textEffect = effects?.textEffect || 'slideLeft'
  const imageEffect = effects?.imageEffect || 'float'

  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={palette.background}
          pattern={backgroundPattern as any}
          designElements={designElements as any[]}
          intensity={0.3}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 60,
        }}
      >
        {/* Animated Headline */}
        <div style={{ marginTop: 60 }}>
          <AnimatedText
            effect={textEffect}
            delay={5}
            duration={18}
            fontSize={40}
            fontWeight={700}
            color={palette.text.primary}
          >
            {story.headline}
          </AnimatedText>
        </div>

        {/* Animated Screenshot - Hero style with floating effect */}
        {screenshotUrl && (
          <div style={{ marginTop: 40 }}>
            <AnimatedImage
              src={screenshotUrl}
              effect={imageEffect}
              delay={10}
              duration={25}
              width={900}
              height="auto"
              borderRadius={20}
              shadow={true}
              style={{ border: '4px solid #222' }}
            />
          </div>
        )}

        {/* Feature points with staggered animation */}
        {story.featurePoints && story.featurePoints.length > 0 && (
          <div
            style={{
              position: 'absolute',
              bottom: 100,
              display: 'flex',
              gap: 20,
            }}
          >
            {story.featurePoints.map((point, i) => (
              <div
                key={i}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <AnimatedText
                  effect="fadeUp"
                  delay={35 + i * 6}
                  duration={12}
                  fontSize={18}
                  fontWeight={500}
                  color={palette.text.secondary}
                >
                  {point}
                </AnimatedText>
              </div>
            ))}
          </div>
        )}
      </AbsoluteFill>

      {/* Scene Transition */}
      {effects?.transition && effects.transition !== 'cut' && (
        <TransitionOverlay
          type={effects.transition}
          startFrame={duration - 15}
          durationFrames={15}
          color="#000"
        />
      )}
    </AbsoluteFill>
  )
}

// ----- PROOF SCENE -----
const ProofScene: React.FC<{
  story: Base44Plan['story']['proof']
  palette: ColorPalette
  duration: number
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, palette, duration, effects, backgroundPattern, designElements }) => {
  const textEffect = effects?.textEffect || 'scaleUp'

  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={[palette.secondary, palette.primary]}
          pattern={backgroundPattern as any}
          designElements={designElements as any[]}
          intensity={0.4}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
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
          {/* Animated Stat */}
          {story.stat && (
            <AnimatedText
              effect={textEffect}
              delay={5}
              duration={15}
              fontSize={96}
              fontWeight={900}
              color={palette.text.primary}
              style={{ textShadow: `0 0 60px ${palette.primary}40` }}
            >
              {story.stat}
            </AnimatedText>
          )}

          {/* Animated Headline */}
          <div style={{ marginTop: story.stat ? 16 : 0 }}>
            <AnimatedText
              effect="fadeUp"
              delay={15}
              duration={15}
              fontSize={42}
              fontWeight={700}
              color={palette.text.primary}
            >
              {story.headline}
            </AnimatedText>
          </div>

          {/* Animated Subtext */}
          {story.subtext && (
            <div style={{ marginTop: 12 }}>
              <AnimatedText
                effect="fadeUp"
                delay={25}
                duration={12}
                fontSize={24}
                fontWeight={400}
                color={palette.text.secondary}
              >
                {story.subtext}
              </AnimatedText>
            </div>
          )}
        </div>
      </AbsoluteFill>

      {/* Scene Transition */}
      {effects?.transition && effects.transition !== 'cut' && (
        <TransitionOverlay
          type={effects.transition}
          startFrame={duration - 15}
          durationFrames={15}
          color="#000"
        />
      )}
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
  effects?: SceneVisualConfig
  backgroundPattern: string
  designElements: string[]
}> = ({ story, brand, palette, logoUrl, duration, effects, backgroundPattern, designElements }) => {
  const frame = useCurrentFrame()
  const textEffect = effects?.textEffect || 'bounce'

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
  const logoOpacity = interpolate(frame, [30, 40], [0, 1], { extrapolateRight: 'clamp' })

  return (
    <AbsoluteFill>
      {/* Dynamic Background */}
      {!DEBUG_BG && (
        <BackgroundLayer
          colors={[palette.primary, palette.accent || palette.secondary]}
          pattern={backgroundPattern as any}
          designElements={[...designElements as any[], 'glow']}
          intensity={0.5}
          animated={true}
        />
      )}
      {DEBUG_BG && <AbsoluteFill style={{ backgroundColor: DEBUG_BG }} />}

      {/* Content */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 60,
        }}
      >
        {/* Animated Headline */}
        <AnimatedText
          effect={textEffect}
          delay={5}
          duration={18}
          fontSize={52}
          fontWeight={800}
          color={palette.text.primary}
          style={{ textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}
        >
          {story.headline}
        </AnimatedText>

        {/* Animated CTA Button */}
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
            boxShadow: `0 10px 40px rgba(0,0,0,0.3), 0 0 60px ${palette.primary}30`,
          }}
        >
          {story.buttonText}
        </div>

        {/* Animated Subtext */}
        {story.subtext && (
          <div style={{ marginTop: 20 }}>
            <AnimatedText
              effect="fadeUp"
              delay={25}
              duration={12}
              fontSize={20}
              fontWeight={400}
              color={palette.text.secondary}
            >
              {story.subtext}
            </AnimatedText>
          </div>
        )}

        {/* Brand Lockup (Logo + Name) at bottom */}
        <div style={{ position: 'absolute', bottom: 80 }}>
          <BrandLockup
            logoUrl={logoUrl}
            brandName={brand.name}
            palette={palette}
            opacity={logoOpacity}
            size="small"
          />
        </div>
      </AbsoluteFill>
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
