'use client'

/**
 * LAYOUT RENDERER - Premium Video Composition
 *
 * Renders scene elements with professional spacing, staggered animations,
 * and cinematic timing for Base44-level quality.
 */

import React from 'react'
import type { Scene, SceneElement, TextElement, BadgeElement } from '@/lib/video-components/types'
import { layouts, type LayoutZone, type LayoutName } from '@/lib/video-components/layouts'
import { getTextStyleCSS, badgeVariants } from '@/lib/video-components/styles'

interface LayoutRendererProps {
  scene: Scene
  isActive: boolean
}

// Premium animation configurations with professional timing
const PREMIUM_ANIMATIONS = {
  // Smooth entrance with subtle scale
  smoothReveal: (delay: number) => ({
    animation: `smoothReveal 0.8s cubic-bezier(0.16, 1, 0.3, 1) ${delay}s forwards`,
    opacity: 0,
  }),
  // Elegant fade up with slight blur
  elegantFadeUp: (delay: number) => ({
    animation: `elegantFadeUp 0.7s cubic-bezier(0.33, 1, 0.68, 1) ${delay}s forwards`,
    opacity: 0,
  }),
  // Cinematic scale reveal
  cinematicScale: (delay: number) => ({
    animation: `cinematicScale 0.9s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s forwards`,
    opacity: 0,
  }),
  // Subtle slide
  subtleSlide: (delay: number) => ({
    animation: `subtleSlide 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s forwards`,
    opacity: 0,
  }),
}

// Get premium staggered animation based on element index and type
function getPremiumAnimation(
  elementIndex: number,
  totalElements: number,
  elementType: string
): React.CSSProperties {
  // Base delay with stagger
  const baseDelay = 0.1
  const staggerDelay = 0.15
  const delay = baseDelay + (elementIndex * staggerDelay)

  // Choose animation based on element type for variety
  if (elementType === 'badge') {
    return PREMIUM_ANIMATIONS.subtleSlide(delay)
  }
  if (elementType === 'headline' || elementType === 'hero') {
    return PREMIUM_ANIMATIONS.cinematicScale(delay)
  }
  return PREMIUM_ANIMATIONS.elegantFadeUp(delay)
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

// Render a single element with premium styling
function renderElement(
  element: SceneElement,
  isActive: boolean,
  index: number,
  totalElements: number
): React.ReactNode {
  // Get element type for animation selection
  const elementType = element.type === 'text'
    ? (element as TextElement).style.style
    : element.type

  // Apply premium staggered animation when active
  const animationStyles: React.CSSProperties = isActive
    ? getPremiumAnimation(index, totalElements, elementType)
    : { opacity: 0 }

  switch (element.type) {
    case 'text': {
      const textEl = element as TextElement
      const textStyles = getTextStyleCSS(
        textEl.style.style,
        textEl.style.color,
        textEl.style.weight
      )

      // Premium text styling with better line height and spacing
      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...textStyles,
            ...animationStyles,
            textAlign: textEl.style.align ?? 'center',
            maxWidth: textEl.style.style === 'hero' ? '95%' : '85%',
            fontFamily: 'var(--font-display), system-ui, sans-serif',
            lineHeight: textEl.style.style === 'hero' ? 1.05 : 1.3,
            textShadow: '0 2px 20px rgba(0,0,0,0.3)',
            willChange: 'transform, opacity',
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
            padding: '10px 20px',
            borderRadius: '24px',
            fontSize: '0.8rem',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            fontFamily: 'var(--font-body), system-ui, sans-serif',
            display: 'inline-block',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            willChange: 'transform, opacity',
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
            maxWidth: '85%',
            willChange: 'transform, opacity',
          }}
        >
          <img
            src={element.src}
            alt=""
            style={{
              width: '100%',
              borderRadius: element.borderRadius ?? 16,
              objectFit: element.objectFit ?? 'cover',
              boxShadow: '0 25px 50px rgba(0,0,0,0.4)',
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
        shapeStyles.height = '3px'
        shapeStyles.borderRadius = '2px'
      }

      return (
        <div
          key={element.id ?? `el-${index}`}
          style={{
            ...shapeStyles,
            ...animationStyles,
            willChange: 'transform, opacity',
          }}
        />
      )
    }

    default:
      return null
  }
}

// Render a zone with its elements - Premium spacing
function ZoneRenderer({
  zone,
  elements,
  isActive,
  zoneIndex,
}: {
  zone: LayoutZone
  elements: SceneElement[]
  isActive: boolean
  zoneIndex: number
}) {
  if (elements.length === 0) return null

  // Calculate total elements for proper stagger timing
  const totalElements = elements.length

  return (
    <div
      style={{
        position: 'absolute',
        top: `${zone.y}%`,
        left: zone.align === 'left' ? '8%' : zone.align === 'right' ? 'auto' : '50%',
        right: zone.align === 'right' ? '8%' : 'auto',
        transform: zone.align === 'center' ? 'translateX(-50%)' : 'none',
        width: zone.align === 'center' ? '84%' : '42%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: zone.align === 'center' ? 'center' : zone.align === 'left' ? 'flex-start' : 'flex-end',
        gap: '24px', // Increased gap for premium spacing
        textAlign: zone.align,
        padding: '0 4%', // Add horizontal padding
      }}
    >
      {elements.map((element, index) =>
        renderElement(element, isActive, zoneIndex * 10 + index, totalElements)
      )}
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
      {layout.zones.map((zone, zoneIndex) => (
        <ZoneRenderer
          key={zone.name}
          zone={zone}
          elements={distribution.get(zone.name) ?? []}
          isActive={isActive}
          zoneIndex={zoneIndex}
        />
      ))}
    </>
  )
}

export default LayoutRenderer
