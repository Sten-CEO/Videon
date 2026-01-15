/**
 * VIDEO RENDERER - SINGLE ENTRY POINT
 *
 * This is the ONLY way to render a video.
 * ALL video generation MUST go through this component.
 *
 * RULES:
 * 1. templateId MUST be "BASE44_PREMIUM"
 * 2. Any other templateId = CRASH (no fallback)
 * 3. Missing templateId = CRASH (no fallback)
 * 4. Legacy plan format = CRASH (no fallback)
 *
 * NO EXCEPTIONS. NO SILENT FAILURES.
 */

import React from 'react'
import { AbsoluteFill } from 'remotion'
import {
  TEMPLATE_ID,
  validateBase44Plan,
  InvalidTemplateError,
  type Base44Plan,
} from '../lib/templates/base44/planSchema'
import { Base44PremiumTemplate } from './Base44PremiumTemplate'

// =============================================================================
// PROPS
// =============================================================================

export interface VideoRendererProps {
  plan?: Base44Plan | Record<string, unknown>  // Optional for Remotion compatibility
}

// =============================================================================
// ERROR DISPLAY (shown in Remotion preview when crash)
// =============================================================================

const RenderError: React.FC<{ error: Error }> = ({ error }) => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#FF0000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
      }}
    >
      <div
        style={{
          backgroundColor: '#000',
          padding: 40,
          borderRadius: 20,
          maxWidth: '90%',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            fontSize: 48,
            fontWeight: 900,
            color: '#FF0000',
            marginBottom: 20,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          RENDER BLOCKED
        </div>
        <div
          style={{
            fontSize: 24,
            color: '#FFF',
            marginBottom: 30,
            fontFamily: 'monospace',
          }}
        >
          {error.message}
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#FF6666',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          Only templateId: "{TEMPLATE_ID}" is allowed.
          <br />
          NO FALLBACKS. NO EXCEPTIONS.
        </div>
      </div>
    </AbsoluteFill>
  )
}

// =============================================================================
// MAIN RENDERER
// =============================================================================

export const VideoRenderer: React.FC<VideoRendererProps> = ({ plan }) => {
  // Log what we received
  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')
  console.log('%c[VIDEO RENDERER] Received plan:', 'background: #6366F1; color: #fff; font-size: 14px;')
  console.log('%c[VIDEO RENDERER] templateId:', 'color: #6366F1;', (plan as Record<string, unknown>)?.templateId || 'MISSING')
  console.log('%c════════════════════════════════════════════════════════════', 'background: #6366F1; color: #fff;')

  // Handle missing plan
  if (!plan) {
    return <RenderError error={new InvalidTemplateError(undefined)} />
  }

  try {
    // VALIDATE - This will throw if templateId !== "BASE44_PREMIUM"
    validateBase44Plan(plan)

    // At this point, plan is guaranteed to be a valid Base44Plan
    console.log('%c[VIDEO RENDERER] ✓ Plan validated! Rendering BASE44_PREMIUM', 'color: #00FF00; font-weight: bold;')

    // RENDER - Only BASE44_PREMIUM is possible here
    return <Base44PremiumTemplate plan={plan} />

  } catch (error) {
    // CRASH VISUALLY - Show error in the video itself
    console.error('%c[VIDEO RENDERER] ✗ RENDER BLOCKED!', 'color: #FF0000; font-size: 20px; font-weight: bold;')
    console.error(error)

    // Show error screen instead of video
    return <RenderError error={error instanceof Error ? error : new Error(String(error))} />
  }
}

// =============================================================================
// STRICT RENDERER - THROWS INSTEAD OF SHOWING ERROR SCREEN
// =============================================================================

export const VideoRendererStrict: React.FC<VideoRendererProps> = ({ plan }) => {
  // This version throws immediately, crashing the render process
  if (!plan) {
    throw new InvalidTemplateError(undefined)
  }
  validateBase44Plan(plan)
  return <Base44PremiumTemplate plan={plan} />
}

// =============================================================================
// CONFIG EXPORT
// =============================================================================

export const VIDEO_RENDERER_CONFIG = {
  id: 'VideoRenderer',
  component: VideoRenderer,
  fps: 30,
  width: 1080,
  height: 1920,
}

export default VideoRenderer
