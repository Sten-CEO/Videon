'use client'

/**
 * ELEMENT RENDERER
 *
 * Rend un élément individuel (texte, image, shape, etc.)
 * selon sa configuration dans le plan.
 */

import React from 'react'
import type { SceneElement, TextElement, ImageElement, ShapeElement, BadgeElement } from '@/lib/video-components/types'
import { getTextStyleCSS, fontWeights, badgeVariants, elementSizes } from '@/lib/video-components/styles'
import { getAnimationStyle } from '@/lib/video-components/animations'

interface ElementRendererProps {
  element: SceneElement
  isActive: boolean // Si la scène est active (pour jouer l'animation)
}

// Convertit position en CSS - avec des marges sécurisées pour éviter le débordement
function getPositionCSS(x: SceneElement['position']['x'], y: SceneElement['position']['y']): React.CSSProperties {
  const styles: React.CSSProperties = {
    position: 'absolute',
  }

  // Safe margins - plus généreuses pour éviter le texte collé aux bords
  const safeMarginX = '8%' // 8% de marge horizontale minimum
  const safeMarginTop = '12%' // 12% de marge en haut (pour badge/brand)
  const safeMarginBottom = '10%' // 10% de marge en bas

  // Position X
  if (x === 'left') {
    styles.left = safeMarginX
  } else if (x === 'center') {
    styles.left = '50%'
    styles.transform = 'translateX(-50%)'
  } else if (x === 'right') {
    styles.right = safeMarginX
  } else if (typeof x === 'number') {
    // Clamp values to safe zone
    const clampedX = Math.max(8, Math.min(92, x))
    styles.left = `${clampedX}%`
  }

  // Position Y
  if (y === 'top') {
    styles.top = safeMarginTop
  } else if (y === 'center') {
    styles.top = '50%'
    styles.transform = styles.transform
      ? `${styles.transform} translateY(-50%)`
      : 'translateY(-50%)'
  } else if (y === 'bottom') {
    styles.bottom = safeMarginBottom
  } else if (typeof y === 'number') {
    // Clamp values to safe zone
    const clampedY = Math.max(10, Math.min(90, y))
    styles.top = `${clampedY}%`
  }

  return styles
}

// Rend un élément texte
function TextRenderer({ element, isActive }: { element: TextElement; isActive: boolean }) {
  const positionStyles = getPositionCSS(element.position.x, element.position.y)
  const textStyles = getTextStyleCSS(
    element.style.style,
    element.style.color,
    element.style.weight
  )

  const animationStyles = isActive && element.animation
    ? getAnimationStyle(
        element.animation.type,
        element.animation.duration,
        element.animation.delay
      )
    : { opacity: 0 }

  return (
    <div
      style={{
        ...positionStyles,
        ...textStyles,
        ...animationStyles,
        textAlign: element.style.align ?? 'center',
        maxWidth: element.style.maxWidth ? `${element.style.maxWidth}%` : '90%',
        zIndex: element.zIndex ?? 1,
        fontFamily: 'var(--font-display), system-ui, sans-serif',
      }}
    >
      {element.content}
    </div>
  )
}

// Rend un élément image
function ImageRenderer({ element, isActive }: { element: ImageElement; isActive: boolean }) {
  const positionStyles = getPositionCSS(element.position.x, element.position.y)

  // Taille
  let sizeStyles: React.CSSProperties = {}
  if (typeof element.size === 'string' && element.size in elementSizes) {
    sizeStyles = elementSizes[element.size as keyof typeof elementSizes]
  } else if (typeof element.size === 'number') {
    sizeStyles = { width: `${element.size}%` }
  } else {
    sizeStyles = elementSizes.medium
  }

  const animationStyles = isActive && element.animation
    ? getAnimationStyle(
        element.animation.type,
        element.animation.duration,
        element.animation.delay
      )
    : { opacity: 0 }

  return (
    <div
      style={{
        ...positionStyles,
        ...animationStyles,
        zIndex: element.zIndex ?? 1,
      }}
    >
      <img
        src={element.src}
        alt=""
        style={{
          ...sizeStyles,
          borderRadius: element.borderRadius ?? 12,
          objectFit: element.objectFit ?? 'cover',
          boxShadow: element.shadow ? '0 20px 40px rgba(0,0,0,0.3)' : 'none',
        }}
      />
    </div>
  )
}

// Rend un élément shape
function ShapeRenderer({ element, isActive }: { element: ShapeElement; isActive: boolean }) {
  const positionStyles = getPositionCSS(element.position.x, element.position.y)

  const animationStyles = isActive && element.animation
    ? getAnimationStyle(
        element.animation.type,
        element.animation.duration,
        element.animation.delay
      )
    : { opacity: 0 }

  let shapeStyles: React.CSSProperties = {
    width: typeof element.width === 'number' ? `${element.width}px` : element.width,
    height: typeof element.height === 'number' ? `${element.height}px` : element.height,
    backgroundColor: element.color,
    borderColor: element.borderColor,
    borderWidth: element.borderWidth ?? 0,
    borderStyle: element.borderWidth ? 'solid' : 'none',
  }

  // Forme
  switch (element.shape) {
    case 'circle':
      shapeStyles.borderRadius = '50%'
      break
    case 'rounded':
      shapeStyles.borderRadius = '16px'
      break
    case 'line':
      shapeStyles.height = '2px'
      break
    case 'triangle':
      shapeStyles = {
        ...shapeStyles,
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderLeft: `${parseInt(String(element.width)) / 2}px solid transparent`,
        borderRight: `${parseInt(String(element.width)) / 2}px solid transparent`,
        borderBottom: `${element.height} solid ${element.color}`,
      }
      break
  }

  return (
    <div
      style={{
        ...positionStyles,
        ...shapeStyles,
        ...animationStyles,
        zIndex: element.zIndex ?? 0,
      }}
    />
  )
}

// Rend un badge
function BadgeRenderer({ element, isActive }: { element: BadgeElement; isActive: boolean }) {
  const positionStyles = getPositionCSS(element.position.x, element.position.y)

  // Fallback to primary if variant doesn't exist
  const variantKey = element.variant ?? 'primary'
  const variant = badgeVariants[variantKey as keyof typeof badgeVariants] ?? badgeVariants.primary

  const animationStyles = isActive && element.animation
    ? getAnimationStyle(
        element.animation.type,
        element.animation.duration,
        element.animation.delay
      )
    : { opacity: 0 }

  return (
    <div
      style={{
        ...positionStyles,
        ...animationStyles,
        background: variant.background,
        color: variant.color,
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        zIndex: element.zIndex ?? 1,
        fontFamily: 'var(--font-body), system-ui, sans-serif',
      }}
    >
      {element.content}
    </div>
  )
}

// Composant principal
export const ElementRenderer: React.FC<ElementRendererProps> = ({ element, isActive }) => {
  switch (element.type) {
    case 'text':
      return <TextRenderer element={element} isActive={isActive} />

    case 'image':
      return <ImageRenderer element={element} isActive={isActive} />

    case 'shape':
      return <ShapeRenderer element={element} isActive={isActive} />

    case 'badge':
      return <BadgeRenderer element={element} isActive={isActive} />

    case 'divider':
      return (
        <div
          style={{
            ...getPositionCSS(element.position.x, element.position.y),
            width: element.width ?? '80%',
            height: element.thickness ?? 1,
            backgroundColor: element.color ?? 'rgba(255,255,255,0.3)',
            zIndex: element.zIndex ?? 0,
            ...(isActive && element.animation
              ? getAnimationStyle(element.animation.type, element.animation.duration, element.animation.delay)
              : { opacity: 0 }),
          }}
        />
      )

    case 'spacer':
      return null // Spacer is just for layout, doesn't render

    default:
      // Fallback: essayer de rendre comme du texte si contenu présent
      const unknownElement = element as any
      if (unknownElement.content && typeof unknownElement.content === 'string') {
        console.warn('Unknown element type, rendering as text:', unknownElement.type)
        return (
          <div
            style={{
              ...getPositionCSS(unknownElement.position?.x || 'center', unknownElement.position?.y || 'center'),
              ...(isActive && unknownElement.animation
                ? getAnimationStyle(unknownElement.animation.type, unknownElement.animation.duration, unknownElement.animation.delay)
                : { opacity: 0 }),
              color: unknownElement.color || '#ffffff',
              fontSize: '1rem',
              textAlign: 'center',
              zIndex: unknownElement.zIndex ?? 1,
            }}
          >
            {unknownElement.content}
          </div>
        )
      }
      console.warn('Unknown element type without content:', unknownElement.type)
      return null
  }
}

export default ElementRenderer
