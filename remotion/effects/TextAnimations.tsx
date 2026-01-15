/**
 * TEXT ANIMATION EFFECTS
 *
 * Dynamic text animations that make headlines and copy pop.
 * Each effect transforms text appearance into something memorable.
 */

import React from 'react'
import {
  interpolate,
  useCurrentFrame,
  useVideoConfig,
  spring,
  Easing,
} from 'remotion'

// =============================================================================
// TYPES
// =============================================================================

export interface TextAnimationProps {
  text: string
  startFrame?: number
  duration?: number
  color?: string
  accentColor?: string
  fontSize?: number
  fontWeight?: number
  style?: React.CSSProperties
}

// =============================================================================
// TYPEWRITER EFFECT
// =============================================================================

export const TextTypewriter: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 60,
  color = '#ffffff',
  accentColor = '#6366F1',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration * 0.8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const visibleChars = Math.floor(progress * text.length)
  const visibleText = text.slice(0, visibleChars)

  // Cursor blink
  const cursorOpacity = Math.sin((frame - startFrame) * 0.3) > 0 ? 1 : 0
  const showCursor = progress < 1

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', ...style }}>
      <span
        style={{
          fontSize,
          fontWeight,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {visibleText}
      </span>
      {showCursor && (
        <span
          style={{
            width: 3,
            height: fontSize * 0.8,
            backgroundColor: accentColor,
            marginLeft: 4,
            opacity: cursorOpacity,
          }}
        />
      )}
    </div>
  )
}

// =============================================================================
// LETTER BOUNCE EFFECT
// =============================================================================

export const TextLetterBounce: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 35,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const letters = text.split('')

  return (
    <div style={{ display: 'inline-flex', flexWrap: 'wrap', ...style }}>
      {letters.map((letter, i) => {
        const letterDelay = i * 2 // 2 frames delay per letter
        const letterFrame = frame - startFrame - letterDelay

        const springValue = spring({
          frame: letterFrame,
          fps,
          config: { damping: 8, stiffness: 200 },
          durationInFrames: 20,
        })

        const translateY = interpolate(springValue, [0, 1], [40, 0])
        const opacity = interpolate(springValue, [0, 0.5], [0, 1], {
          extrapolateRight: 'clamp',
        })
        const scale = interpolate(springValue, [0, 0.5, 1], [0.5, 1.2, 1])
        const rotation = interpolate(springValue, [0, 1], [-10, 0])

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight,
              color,
              transform: `translateY(${translateY}px) scale(${scale}) rotate(${rotation}deg)`,
              opacity,
              letterSpacing: letter === ' ' ? '0.3em' : '-0.02em',
            }}
          >
            {letter === ' ' ? '\u00A0' : letter}
          </span>
        )
      })}
    </div>
  )
}

// =============================================================================
// GLITCH TEXT EFFECT
// =============================================================================

export const TextGlitch: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 20,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Glitch intensity decreases over time
  const glitchIntensity = interpolate(progress, [0, 0.7, 1], [1, 0.2, 0])

  // Random values based on frame for glitch effect
  const seed = (frame - startFrame) * 13
  const offsetX = Math.sin(seed) * 10 * glitchIntensity
  const offsetY = Math.cos(seed * 0.7) * 5 * glitchIntensity
  const skew = Math.sin(seed * 1.3) * 5 * glitchIntensity

  // RGB split
  const rgbSplit = glitchIntensity * 6

  // Opacity (flicker during glitch)
  const flicker = glitchIntensity > 0.3 && Math.random() > 0.9 ? 0.7 : 1
  const baseOpacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Cyan layer */}
      {glitchIntensity > 0.1 && (
        <span
          style={{
            position: 'absolute',
            left: -rgbSplit,
            top: 0,
            fontSize,
            fontWeight,
            color: '#00ffff',
            opacity: 0.7,
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </span>
      )}

      {/* Magenta layer */}
      {glitchIntensity > 0.1 && (
        <span
          style={{
            position: 'absolute',
            left: rgbSplit,
            top: 0,
            fontSize,
            fontWeight,
            color: '#ff00ff',
            opacity: 0.7,
            mixBlendMode: 'screen',
          }}
        >
          {text}
        </span>
      )}

      {/* Main text */}
      <span
        style={{
          position: 'relative',
          fontSize,
          fontWeight,
          color,
          opacity: baseOpacity * flicker,
          transform: `translate(${offsetX}px, ${offsetY}px) skewX(${skew}deg)`,
          display: 'inline-block',
        }}
      >
        {text}
      </span>
    </div>
  )
}

// =============================================================================
// GRADIENT SWEEP EFFECT
// =============================================================================

export const TextGradientSweep: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 20,
  color = '#ffffff',
  accentColor = '#6366F1',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  )

  // Gradient position sweeps from left to right
  const gradientPosition = interpolate(progress, [0, 1], [-100, 200])

  // Calculate a lighter version of accent color
  const gradientHighlight = accentColor

  return (
    <div
      style={{
        position: 'relative',
        ...style,
      }}
    >
      {/* Background text (dimmed) */}
      <span
        style={{
          fontSize,
          fontWeight,
          color: `${color}30`,
          letterSpacing: '-0.02em',
        }}
      >
        {text}
      </span>

      {/* Gradient sweep overlay */}
      <span
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          fontSize,
          fontWeight,
          letterSpacing: '-0.02em',
          background: `linear-gradient(90deg,
            transparent ${gradientPosition - 50}%,
            ${gradientHighlight} ${gradientPosition - 20}%,
            ${color} ${gradientPosition}%,
            ${color} ${gradientPosition + 50}%,
            ${color} 100%
          )`,
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        {text}
      </span>
    </div>
  )
}

// =============================================================================
// WORD CASCADE EFFECT
// =============================================================================

export const TextWordCascade: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 30,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const words = text.split(' ')

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em', ...style }}>
      {words.map((word, i) => {
        const wordDelay = i * 4 // 4 frames delay per word
        const wordFrame = frame - startFrame - wordDelay

        const springValue = spring({
          frame: wordFrame,
          fps,
          config: { damping: 15, stiffness: 150 },
          durationInFrames: 20,
        })

        const translateY = interpolate(springValue, [0, 1], [30, 0])
        const opacity = interpolate(springValue, [0, 0.3], [0, 1], {
          extrapolateRight: 'clamp',
        })

        return (
          <span
            key={i}
            style={{
              display: 'inline-block',
              fontSize,
              fontWeight,
              color,
              transform: `translateY(${translateY}px)`,
              opacity,
              letterSpacing: '-0.02em',
            }}
          >
            {word}
          </span>
        )
      })}
    </div>
  )
}

// =============================================================================
// BLUR FOCUS EFFECT
// =============================================================================

export const TextBlurFocus: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 20,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  )

  const blur = interpolate(progress, [0, 0.7], [20, 0], {
    extrapolateRight: 'clamp',
  })

  const opacity = interpolate(progress, [0, 0.5], [0, 1], {
    extrapolateRight: 'clamp',
  })

  const scale = interpolate(progress, [0, 1], [1.1, 1])

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight,
        color,
        filter: `blur(${blur}px)`,
        opacity,
        transform: `scale(${scale})`,
        letterSpacing: '-0.02em',
        ...style,
      }}
    >
      {text}
    </span>
  )
}

// =============================================================================
// COUNTER ROLL EFFECT (for stats)
// =============================================================================

interface CounterRollProps extends Omit<TextAnimationProps, 'text'> {
  value: number
  prefix?: string
  suffix?: string
}

export const TextCounterRoll: React.FC<CounterRollProps> = ({
  value,
  prefix = '',
  suffix = '',
  startFrame = 0,
  duration = 45,
  color = '#ffffff',
  accentColor = '#6366F1',
  fontSize = 72,
  fontWeight = 800,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration * 0.8],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }
  )

  const currentValue = Math.round(progress * value)

  // Format number with locale
  const formattedValue = currentValue.toLocaleString()

  // Scale pop at the end
  const scale = interpolate(
    frame - startFrame,
    [duration * 0.75, duration * 0.85, duration],
    [1, 1.1, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const opacity = interpolate(progress, [0, 0.1], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        transform: `scale(${scale})`,
        opacity,
        ...style,
      }}
    >
      {prefix && (
        <span
          style={{
            fontSize: fontSize * 0.6,
            fontWeight,
            color: accentColor,
            marginRight: '0.1em',
          }}
        >
          {prefix}
        </span>
      )}
      <span
        style={{
          fontSize,
          fontWeight,
          color,
          fontVariantNumeric: 'tabular-nums',
          letterSpacing: '-0.02em',
        }}
      >
        {formattedValue}
      </span>
      {suffix && (
        <span
          style={{
            fontSize: fontSize * 0.5,
            fontWeight,
            color: accentColor,
            marginLeft: '0.1em',
          }}
        >
          {suffix}
        </span>
      )}
    </div>
  )
}

// =============================================================================
// STAT PULSE EFFECT
// =============================================================================

export const TextStatPulse: React.FC<CounterRollProps> = ({
  value,
  prefix = '',
  suffix = '',
  startFrame = 0,
  duration = 25,
  color = '#ffffff',
  accentColor = '#6366F1',
  fontSize = 72,
  fontWeight = 800,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  // Pulse ring
  const ringScale = interpolate(progress, [0.2, 0.8], [0.5, 3], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  })

  const ringOpacity = interpolate(progress, [0.2, 0.8], [0.8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  // Number appearance
  const numberScale = interpolate(
    progress,
    [0, 0.3, 0.5],
    [0, 1.2, 1],
    { extrapolateRight: 'clamp', easing: Easing.out(Easing.back(2)) }
  )

  const numberOpacity = interpolate(progress, [0, 0.2], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...style,
      }}
    >
      {/* Pulse rings */}
      <div
        style={{
          position: 'absolute',
          width: fontSize * 2,
          height: fontSize * 2,
          borderRadius: '50%',
          border: `3px solid ${accentColor}`,
          transform: `scale(${ringScale})`,
          opacity: ringOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: fontSize * 2,
          height: fontSize * 2,
          borderRadius: '50%',
          border: `2px solid ${accentColor}`,
          transform: `scale(${ringScale * 0.7})`,
          opacity: ringOpacity * 0.7,
        }}
      />

      {/* Stat value */}
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          transform: `scale(${numberScale})`,
          opacity: numberOpacity,
        }}
      >
        {prefix && (
          <span style={{ fontSize: fontSize * 0.6, fontWeight, color: accentColor, marginRight: '0.1em' }}>
            {prefix}
          </span>
        )}
        <span style={{ fontSize, fontWeight, color, letterSpacing: '-0.02em' }}>
          {value.toLocaleString()}
        </span>
        {suffix && (
          <span style={{ fontSize: fontSize * 0.5, fontWeight, color: accentColor, marginLeft: '0.1em' }}>
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}

// =============================================================================
// HIGHLIGHT EMPHASIS EFFECT
// =============================================================================

interface HighlightTextProps extends TextAnimationProps {
  highlightWords?: string[] // Words to highlight
}

export const TextWithHighlight: React.FC<HighlightTextProps> = ({
  text,
  highlightWords = [],
  startFrame = 0,
  duration = 30,
  color = '#ffffff',
  accentColor = '#6366F1',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()
  const { fps } = useVideoConfig()

  const words = text.split(' ')

  // Base text animation
  const baseProgress = interpolate(
    frame - startFrame,
    [0, duration * 0.5],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3em', ...style }}>
      {words.map((word, i) => {
        const isHighlighted = highlightWords.some(hw =>
          word.toLowerCase().includes(hw.toLowerCase())
        )

        // Word entrance
        const wordDelay = i * 3
        const wordSpring = spring({
          frame: frame - startFrame - wordDelay,
          fps,
          config: { damping: 15, stiffness: 150 },
          durationInFrames: 15,
        })

        const wordOpacity = interpolate(wordSpring, [0, 0.3], [0, 1], {
          extrapolateRight: 'clamp',
        })

        // Highlight animation (delayed)
        const highlightDelay = duration * 0.6
        const highlightProgress = interpolate(
          frame - startFrame - highlightDelay,
          [0, 15],
          [0, 1],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        )

        // Underline draw for highlighted words
        const underlineWidth = isHighlighted ? highlightProgress * 100 : 0

        return (
          <span
            key={i}
            style={{
              position: 'relative',
              display: 'inline-block',
              fontSize,
              fontWeight: isHighlighted ? 800 : fontWeight,
              color: isHighlighted && highlightProgress > 0.5 ? accentColor : color,
              opacity: wordOpacity,
              letterSpacing: '-0.02em',
              transition: 'color 0.2s ease',
            }}
          >
            {word}
            {isHighlighted && (
              <span
                style={{
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: `${underlineWidth}%`,
                  height: 4,
                  backgroundColor: accentColor,
                  borderRadius: 2,
                }}
              />
            )}
          </span>
        )
      })}
    </div>
  )
}

// =============================================================================
// SCRAMBLE TEXT EFFECT
// =============================================================================

export const TextScramble: React.FC<TextAnimationProps> = ({
  text,
  startFrame = 0,
  duration = 30,
  color = '#ffffff',
  fontSize = 48,
  fontWeight = 700,
  style,
}) => {
  const frame = useCurrentFrame()

  const progress = interpolate(
    frame - startFrame,
    [0, duration],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  )

  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%'

  // How many characters are "locked in" (revealed)
  const lockedChars = Math.floor(progress * text.length)

  const displayText = text.split('').map((char, i) => {
    if (i < lockedChars) {
      return char
    }
    if (char === ' ') return ' '
    // Scramble with random char based on frame
    const randomIndex = ((frame - startFrame) * 7 + i * 13) % chars.length
    return chars[randomIndex]
  }).join('')

  const opacity = interpolate(progress, [0, 0.1], [0, 1], {
    extrapolateRight: 'clamp',
  })

  return (
    <span
      style={{
        display: 'inline-block',
        fontSize,
        fontWeight,
        color,
        opacity,
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
        ...style,
      }}
    >
      {displayText}
    </span>
  )
}

// =============================================================================
// EXPORT ALL TEXT ANIMATIONS
// =============================================================================

export const TextAnimations = {
  TextTypewriter,
  TextLetterBounce,
  TextGlitch,
  TextGradientSweep,
  TextWordCascade,
  TextBlurFocus,
  TextCounterRoll,
  TextStatPulse,
  TextWithHighlight,
  TextScramble,
}

export default TextAnimations
