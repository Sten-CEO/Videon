/**
 * REMOTION ROOT CONFIGURATION
 *
 * CRITICAL: Only ONE video composition is registered.
 * All video rendering goes through VideoRenderer.
 * VideoRenderer will CRASH if templateId !== "BASE44_PREMIUM".
 *
 * NO LEGACY COMPOSITIONS. NO ALTERNATIVES.
 */

import React from 'react'
import { Composition } from 'remotion'
import { VideoRenderer, VIDEO_RENDERER_CONFIG } from './VideoRenderer'
import { Base44PremiumTemplate, BASE44_PREMIUM_TEMPLATE_CONFIG } from './Base44PremiumTemplate'
import { createDefaultBase44Plan } from '../lib/templates/base44'

// =============================================================================
// ROOT COMPONENT
// =============================================================================

export const RemotionRoot: React.FC = () => {
  // Create default plan for preview
  const defaultPlan = createDefaultBase44Plan('Demo Product')

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          MAIN VIDEO RENDERER - THE ONLY WAY TO RENDER VIDEOS
          All other compositions are DEPRECATED and will be removed.
          ═══════════════════════════════════════════════════════════════════════ */}
      <Composition
        id="VideoRenderer"
        component={VideoRenderer}
        durationInFrames={480}
        fps={VIDEO_RENDERER_CONFIG.fps}
        width={VIDEO_RENDERER_CONFIG.width}
        height={VIDEO_RENDERER_CONFIG.height}
        defaultProps={{
          plan: defaultPlan,
        }}
        calculateMetadata={({ props }) => {
          const plan = props.plan as any
          const baseDuration = 480
          const multiplier = plan?.settings?.duration === 'short' ? 0.67
            : plan?.settings?.duration === 'long' ? 1.17 : 1
          return { durationInFrames: Math.round(baseDuration * multiplier) }
        }}
      />

      {/* Direct template access for Remotion Studio preview */}
      <Composition
        id="Base44PremiumTemplate"
        component={Base44PremiumTemplate}
        durationInFrames={BASE44_PREMIUM_TEMPLATE_CONFIG.defaultDurationInFrames}
        fps={BASE44_PREMIUM_TEMPLATE_CONFIG.fps}
        width={BASE44_PREMIUM_TEMPLATE_CONFIG.width}
        height={BASE44_PREMIUM_TEMPLATE_CONFIG.height}
        defaultProps={{
          plan: defaultPlan,
        }}
        calculateMetadata={({ props }) => {
          const plan = props.plan as any
          const baseDuration = 480
          const multiplier = plan?.settings?.duration === 'short' ? 0.67
            : plan?.settings?.duration === 'long' ? 1.17 : 1
          return { durationInFrames: Math.round(baseDuration * multiplier) }
        }}
      />

      {/* ═══════════════════════════════════════════════════════════════════════
          ⚠️ NO OTHER COMPOSITIONS ALLOWED ⚠️
          If you add legacy compositions here, you're doing it WRONG.
          Everything must go through VideoRenderer with templateId: "BASE44_PREMIUM"
          ═══════════════════════════════════════════════════════════════════════ */}
    </>
  )
}

export default RemotionRoot
