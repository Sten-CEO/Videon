/**
 * Image Utilities Library
 *
 * Converts AI ImageSpec decisions into renderable CSS styles and animation configs.
 * The AI decides HOW images are used - this library executes those decisions precisely.
 */

import type {
  ImageSpec,
  ImageTreatment,
  ImageEffect,
  ImagePosition,
  ImageSize,
  ImageEntryEffect,
} from './schema'

// =============================================================================
// IMAGE TREATMENT → CSS STYLES
// =============================================================================

/**
 * Converts ImageTreatment to CSS styles for the image container
 */
export function getImageTreatmentStyles(treatment: ImageTreatment): React.CSSProperties {
  const styles: React.CSSProperties = {}

  // Corner radius
  if (treatment.cornerRadius !== undefined) {
    styles.borderRadius = treatment.cornerRadius
  }

  // Shadow
  if (treatment.shadow && treatment.shadow !== 'none') {
    switch (treatment.shadow) {
      case 'subtle':
        styles.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)'
        break
      case 'medium':
        styles.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.25)'
        break
      case 'strong':
        styles.boxShadow = '0 16px 48px rgba(0, 0, 0, 0.35)'
        break
    }
  }

  // Border
  if (treatment.border && treatment.border !== 'none') {
    switch (treatment.border) {
      case 'subtle':
        styles.border = '1px solid rgba(255, 255, 255, 0.1)'
        break
      case 'accent':
        styles.border = `2px solid ${treatment.borderColor || '#ffffff'}`
        break
    }
  }

  // Visual adjustments via filter
  const filters: string[] = []
  if (treatment.brightness !== undefined && treatment.brightness !== 1) {
    filters.push(`brightness(${treatment.brightness})`)
  }
  if (treatment.contrast !== undefined && treatment.contrast !== 1) {
    filters.push(`contrast(${treatment.contrast})`)
  }
  if (treatment.blur !== undefined && treatment.blur > 0) {
    filters.push(`blur(${treatment.blur}px)`)
  }
  if (filters.length > 0) {
    styles.filter = filters.join(' ')
  }

  // Opacity
  if (treatment.opacity !== undefined && treatment.opacity !== 1) {
    styles.opacity = treatment.opacity
  }

  return styles
}

// =============================================================================
// IMAGE POSITION → CSS STYLES
// =============================================================================

/**
 * Converts ImagePosition to CSS positioning styles
 */
export function getImagePositionStyles(position: ImagePosition): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: 'absolute',
  }

  // Horizontal positioning
  if (typeof position.horizontal === 'number') {
    styles.left = `${position.horizontal}%`
    styles.transform = 'translateX(-50%)'
  } else {
    switch (position.horizontal) {
      case 'left':
        styles.left = '10%'
        break
      case 'center':
        styles.left = '50%'
        styles.transform = 'translateX(-50%)'
        break
      case 'right':
        styles.right = '10%'
        break
    }
  }

  // Vertical positioning
  if (typeof position.vertical === 'number') {
    styles.top = `${position.vertical}%`
    // Combine transforms if needed
    if (styles.transform) {
      styles.transform = `translateX(-50%) translateY(-50%)`
    } else {
      styles.transform = 'translateY(-50%)'
    }
  } else {
    switch (position.vertical) {
      case 'top':
        styles.top = '10%'
        break
      case 'center':
        styles.top = '50%'
        // Combine transforms if needed
        if (styles.transform === 'translateX(-50%)') {
          styles.transform = 'translate(-50%, -50%)'
        } else {
          styles.transform = 'translateY(-50%)'
        }
        break
      case 'bottom':
        styles.bottom = '10%'
        break
    }
  }

  // Offsets
  if (position.offsetX) {
    styles.marginLeft = position.offsetX
  }
  if (position.offsetY) {
    styles.marginTop = position.offsetY
  }

  return styles
}

// =============================================================================
// IMAGE SIZE → CSS STYLES
// =============================================================================

/**
 * Converts ImageSize to CSS sizing styles
 */
export function getImageSizeStyles(size: ImageSize): React.CSSProperties {
  const styles: React.CSSProperties = {}

  switch (size.mode) {
    case 'contain':
      styles.objectFit = 'contain'
      styles.maxWidth = size.maxWidth ? `${size.maxWidth}px` : '80%'
      styles.maxHeight = size.maxHeight ? `${size.maxHeight}px` : '60%'
      break

    case 'cover':
      styles.objectFit = 'cover'
      styles.width = '100%'
      styles.height = '100%'
      break

    case 'fixed':
      if (size.width) styles.width = size.width
      if (size.height) styles.height = size.height
      styles.objectFit = 'contain'
      break

    case 'percentage':
      if (size.width) styles.width = `${size.width}%`
      if (size.height) styles.height = `${size.height}%`
      styles.objectFit = 'contain'
      break
  }

  // Apply max constraints
  if (size.maxWidth && size.mode !== 'cover') {
    styles.maxWidth = size.maxWidth
  }
  if (size.maxHeight && size.mode !== 'cover') {
    styles.maxHeight = size.maxHeight
  }

  return styles
}

// =============================================================================
// IMAGE ENTRY ANIMATIONS
// =============================================================================

/**
 * Get animation styles for image entry based on current frame
 */
export function getImageEntryAnimationStyles(
  effect: ImageEntryEffect,
  frame: number,
  entryDelay: number,
  entryDuration: number
): React.CSSProperties {
  // If we haven't reached the entry delay, image is invisible
  const adjustedFrame = frame - entryDelay
  if (adjustedFrame < 0) {
    return { opacity: 0 }
  }

  // Calculate progress (0 to 1)
  const progress = Math.min(adjustedFrame / entryDuration, 1)
  // Eased progress for smooth animations
  const eased = easeOutCubic(progress)

  switch (effect) {
    case 'fade_in':
      return {
        opacity: eased,
      }

    case 'slide_up':
      return {
        opacity: eased,
        transform: `translateY(${(1 - eased) * 50}px)`,
      }

    case 'slide_down':
      return {
        opacity: eased,
        transform: `translateY(${(eased - 1) * 50}px)`,
      }

    case 'slide_left':
      return {
        opacity: eased,
        transform: `translateX(${(1 - eased) * 50}px)`,
      }

    case 'slide_right':
      return {
        opacity: eased,
        transform: `translateX(${(eased - 1) * 50}px)`,
      }

    case 'scale_in':
      return {
        opacity: eased,
        transform: `scale(${0.9 + eased * 0.1})`,
      }

    case 'mask_reveal':
      return {
        opacity: 1,
        clipPath: `inset(0 ${(1 - eased) * 100}% 0 0)`,
      }

    case 'blur_in':
      return {
        opacity: eased,
        filter: `blur(${(1 - eased) * 10}px)`,
      }

    case 'pop':
      const popScale = progress < 0.6
        ? 0.5 + (progress / 0.6) * 0.6 // Scale to 1.1
        : 1.1 - ((progress - 0.6) / 0.4) * 0.1 // Scale back to 1.0
      return {
        opacity: eased,
        transform: `scale(${popScale})`,
      }

    case 'none':
    default:
      return { opacity: 1 }
  }
}

// =============================================================================
// IMAGE EXIT ANIMATIONS
// =============================================================================

/**
 * Get animation styles for image exit based on current frame
 */
export function getImageExitAnimationStyles(
  exit: 'fade' | 'slide_out' | 'scale_down' | 'none' | undefined,
  frame: number,
  exitStart: number,
  exitDuration: number
): React.CSSProperties {
  if (!exit || exit === 'none') {
    return {}
  }

  const adjustedFrame = frame - exitStart
  if (adjustedFrame < 0) {
    return {}
  }

  const progress = Math.min(adjustedFrame / exitDuration, 1)
  const eased = easeInCubic(progress)

  switch (exit) {
    case 'fade':
      return {
        opacity: 1 - eased,
      }

    case 'slide_out':
      return {
        opacity: 1 - eased,
        transform: `translateY(${eased * -30}px)`,
      }

    case 'scale_down':
      return {
        opacity: 1 - eased,
        transform: `scale(${1 - eased * 0.1})`,
      }

    default:
      return {}
  }
}

// =============================================================================
// IMAGE HOLD ANIMATIONS
// =============================================================================

/**
 * Get continuous animation styles while image is visible
 */
export function getImageHoldAnimationStyles(
  hold: 'none' | 'subtle_zoom' | 'parallax' | 'float' | undefined,
  frame: number,
  fps: number = 30
): React.CSSProperties {
  if (!hold || hold === 'none') {
    return {}
  }

  const seconds = frame / fps

  switch (hold) {
    case 'subtle_zoom':
      // Very slow zoom from 100% to 105% over time
      const zoomScale = 1 + Math.min(seconds * 0.01, 0.05)
      return {
        transform: `scale(${zoomScale})`,
      }

    case 'parallax':
      // Subtle horizontal drift
      const parallaxX = Math.sin(seconds * 0.3) * 5
      return {
        transform: `translateX(${parallaxX}px)`,
      }

    case 'float':
      // Gentle vertical floating
      const floatY = Math.sin(seconds * 0.5) * 8
      return {
        transform: `translateY(${floatY}px)`,
      }

    default:
      return {}
  }
}

// =============================================================================
// COMBINED IMAGE STYLES
// =============================================================================

/**
 * Get all combined styles for an image at a specific frame
 */
export function getImageStyles(
  spec: ImageSpec,
  frame: number,
  sceneDuration: number,
  fps: number = 30
): React.CSSProperties {
  const entryDelay = spec.entryDelay || 0
  const entryDuration = spec.effect.entryDuration
  const exitDuration = spec.effect.exitDuration || 0
  const exitStart = (spec.duration || sceneDuration) - exitDuration

  // Base styles
  const treatmentStyles = getImageTreatmentStyles(spec.treatment)
  const positionStyles = getImagePositionStyles(spec.position)
  const sizeStyles = getImageSizeStyles(spec.size)

  // Animation phase detection
  const adjustedFrame = frame - entryDelay
  const isInEntry = adjustedFrame >= 0 && adjustedFrame < entryDuration
  const isInExit = frame >= exitStart && spec.effect.exit && spec.effect.exit !== 'none'
  const isInHold = !isInEntry && !isInExit

  // Get animation styles
  let animationStyles: React.CSSProperties = {}

  if (adjustedFrame < 0) {
    // Before entry delay - invisible
    animationStyles = { opacity: 0 }
  } else if (isInEntry) {
    animationStyles = getImageEntryAnimationStyles(
      spec.effect.entry,
      frame,
      entryDelay,
      entryDuration
    )
  } else if (isInExit) {
    animationStyles = getImageExitAnimationStyles(
      spec.effect.exit,
      frame,
      exitStart,
      exitDuration
    )
  } else if (isInHold && spec.effect.hold) {
    animationStyles = getImageHoldAnimationStyles(spec.effect.hold, frame - entryDelay - entryDuration, fps)
  }

  // Combine all styles
  return {
    ...sizeStyles,
    ...positionStyles,
    ...treatmentStyles,
    ...animationStyles,
    // Handle transform combination
    transform: combineTransforms(
      positionStyles.transform as string | undefined,
      animationStyles.transform as string | undefined
    ),
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Combine multiple CSS transform values
 */
function combineTransforms(...transforms: (string | undefined)[]): string | undefined {
  const valid = transforms.filter(Boolean) as string[]
  return valid.length > 0 ? valid.join(' ') : undefined
}

/**
 * Ease out cubic - fast start, slow end
 */
function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

/**
 * Ease in cubic - slow start, fast end
 */
function easeInCubic(t: number): number {
  return t * t * t
}

// =============================================================================
// Z-INDEX MANAGEMENT
// =============================================================================

/**
 * Get z-index for image based on importance
 */
export function getImageZIndex(importance: ImageSpec['importance']): number {
  switch (importance) {
    case 'background':
      return 1
    case 'accent':
      return 5
    case 'supporting':
      return 10
    case 'hero':
      return 15
    default:
      return 10
  }
}

// =============================================================================
// IMAGE LAYOUT HELPERS
// =============================================================================

/**
 * Get smart position based on layout type
 */
export function getSmartPositionForLayout(
  layoutType: string,
  imageRole: string
): ImagePosition {
  // Default positions based on common layout + role combinations
  const positions: Record<string, Record<string, ImagePosition>> = {
    TEXT_LEFT: {
      hero: { horizontal: 'right', vertical: 'center' },
      supporting: { horizontal: 'right', vertical: 'bottom' },
      background: { horizontal: 'center', vertical: 'center' },
    },
    TEXT_RIGHT: {
      hero: { horizontal: 'left', vertical: 'center' },
      supporting: { horizontal: 'left', vertical: 'bottom' },
      background: { horizontal: 'center', vertical: 'center' },
    },
    TEXT_CENTER: {
      hero: { horizontal: 'center', vertical: 'bottom' },
      supporting: { horizontal: 'center', vertical: 'top' },
      background: { horizontal: 'center', vertical: 'center' },
    },
    TEXT_BOTTOM: {
      hero: { horizontal: 'center', vertical: 30 },
      supporting: { horizontal: 'center', vertical: 'top' },
      background: { horizontal: 'center', vertical: 'center' },
    },
    TEXT_TOP: {
      hero: { horizontal: 'center', vertical: 70 },
      supporting: { horizontal: 'center', vertical: 'bottom' },
      background: { horizontal: 'center', vertical: 'center' },
    },
    FULLSCREEN_STATEMENT: {
      hero: { horizontal: 'center', vertical: 'center' },
      supporting: { horizontal: 'center', vertical: 'center' },
      background: { horizontal: 'center', vertical: 'center' },
    },
  }

  const layoutPositions = positions[layoutType] || positions.TEXT_CENTER
  return layoutPositions[imageRole] || layoutPositions.supporting || {
    horizontal: 'center',
    vertical: 'center',
  }
}
