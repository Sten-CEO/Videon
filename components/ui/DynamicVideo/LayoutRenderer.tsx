'use client'

/**
 * LAYOUT RENDERER
 *
 * Rend les éléments d'une scène selon son layout.
 * Les éléments sont automatiquement placés dans les zones du layout.
 */

import React from 'react'
import type { Scene, SceneElement, TextElement, BadgeElement } from '@/lib/video-components/types'
import { layouts, type LayoutZone, type LayoutName } from '@/lib/video-components/layouts'
import { getTextStyleCSS, fontWeights, badgeVariants } from '@/lib/video-components/styles'
import { getAnimationStyle } from '@/lib/video-components/animations'

interface LayoutRendererProps {
  scene: Scene
  isActive: boolean
}

// Mapping element type to zone element types
function getElementZoneType(element: SceneElement): string {
  if (element.type === 'text') {
    const textEl = element as TextElement
    switch (textEl.style.style) {
      case 'hero':
      case 'headline':
        return 'headline'
      case 'subtitle':
      case 'body':
        return 'subtext'
      case 'caption':
        return 'text'
      case 'cta':
        return 'cta'
      default:
        return 'text'
    }
  }
  if (element.type === 'badge') return 'badge'
  if (element.type === 'image') return 'image'
  if (element.type === 'shape') return 'decoration'
  return 'text'
}

// Check if element type matches zone allowed types
function elementMatchesZone(element: SceneElement, zone: LayoutZone): boolean {
  const elementZoneType = getElementZoneType(element)
  return zone.elementTypes.includes(elementZoneType as any)
}

// Distribute elements into zones based on layout
function distributeElementsToZones(
  elements: SceneElement[],
  layoutName: LayoutName
): Map<string, SceneElement[]> {
  const layout = layouts[layoutName] ?? layouts['hero-central']
  const distribution = new Map<string, SceneElement[]>()

  // Initialize empty arrays for each zone
  layout.zones.forEach(zone => {
    distribution.set(zone.name, [])
  })

  // Distribute elements to matching zones
  const remainingElements = [...elements]

  for (const zone of layout.zones) {
    const zoneElements = distribution.get(zone.name)!

    // Find elements that match this zone
    for (let i = remainingElements.length - 1; i >= 0; i--) {
      const element = remainingElements[i]

      if (elementMatchesZone(element, zone) && zoneElements.length < zone.maxElements) {
        zoneElements.push(element)
        remainingElements.splice(i, 1)
      }
    }
  }

  // Place remaining elements in first available zone
  for (const element of remainingElements) {
    for (const zone of layout.zones) {
      const zoneElements = distribution.get(zone.name)!
      if (zoneElements.length < zone.maxElements) {
        zoneElements.push(element)
        break
      }
    }
  }

  return distribution
}

// Render a single element
function renderElement(
  element: SceneElement,
  isActive: boolean,
  index: number
): React.ReactNode {
  // When active: apply animation if present, otherwise show immediately
  // When not active: hide the element
  const animationStyles: React.CSSProperties = isActive
    ? element.animation
      ? getAnimationStyle(
          element.animation.type,
          element.animation.duration,
          element.animation.delay
        )
      : { opacity: 1 } // No animation = show immediately
    : { opacity: 0 }   // Not active = hidden

  switch (element.type) {
    case 'text': {
      const textEl = element as TextElement
      const textStyles = getTextStyleCSS(
        textEl.style.style,
        textEl.style.color,
        textEl.style.weight
      )

      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...textStyles,
            ...animationStyles,
            textAlign: textEl.style.align ?? 'center',
            maxWidth: textEl.style.maxWidth ? `${textEl.style.maxWidth}%` : '100%',
            fontFamily: 'var(--font-display), system-ui, sans-serif',
          }}
        >
          {textEl.content}
        </div>
      )
    }

    case 'badge': {
      const badgeEl = element as BadgeElement
      const variantKey = badgeEl.variant ?? 'primary'
      const variant = badgeVariants[variantKey as keyof typeof badgeVariants] ?? badgeVariants.primary

      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...animationStyles,
            background: variant.background,
            color: variant.color,
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            display: 'inline-block',
          }}
        >
          {badgeEl.content}
        </div>
      )
    }

    case 'image': {
      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...animationStyles,
            maxWidth: '80%',
          }}
        >
          <img
            src={element.src}
            alt=""
            style={{
              width: '100%',
              borderRadius: element.borderRadius ?? 12,
              objectFit: element.objectFit ?? 'cover',
              boxShadow: element.shadow ? '0 20px 40px rgba(0,0,0,0.3)' : 'none',
            }}
          />
        </div>
      )
    }

    case 'shape': {
      let shapeStyles: React.CSSProperties = {
        width: typeof element.width === 'number' ? `${element.width}px` : element.width,
        height: typeof element.height === 'number' ? `${element.height}px` : element.height,
        backgroundColor: element.color,
      }

      if (element.shape === 'circle') {
        shapeStyles.borderRadius = '50%'
      } else if (element.shape === 'rounded') {
        shapeStyles.borderRadius = '16px'
      } else if (element.shape === 'line') {
        shapeStyles.height = '2px'
      }

      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...shapeStyles,
            ...animationStyles,
          }}
        />
      )
    }

    default:
      return null
  }
}

// Render a zone with its elements
function ZoneRenderer({
  zone,
  elements,
  isActive,
}: {
  zone: LayoutZone
  elements: SceneElement[]
  isActive: boolean
}) {
  if (elements.length === 0) return null

  return (
    <div
      style={{
        position: 'absolute',
        top: `${zone.y}%`,
        left: zone.align === 'left' ? '5%' : zone.align === 'right' ? 'auto' : '50%',
        right: zone.align === 'right' ? '5%' : 'auto',
        transform: zone.align === 'center' ? 'translateX(-50%)' : 'none',
        width: zone.align === 'center' ? '90%' : '45%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: zone.align === 'center' ? 'center' : zone.align === 'left' ? 'flex-start' : 'flex-end',
        gap: '12px',
        textAlign: zone.align,
      }}
    >
      {elements.map((element, index) => renderElement(element, isActive, index))}
    </div>
  )
}

export const LayoutRenderer: React.FC<LayoutRendererProps> = ({
  scene,
  isActive,
}) => {
  const layoutName = scene.layout ?? 'hero-central'
  const layout = layouts[layoutName] ?? layouts['hero-central']
  const distribution = distributeElementsToZones(scene.elements, layoutName)

  return (
    <>
      {layout.zones.map(zone => (
        <ZoneRenderer
          key={zone.name}
          zone={zone}
          elements={distribution.get(zone.name) ?? []}
          isActive={isActive}
        />
      ))}
    </>
  )
}

export default LayoutRenderer
