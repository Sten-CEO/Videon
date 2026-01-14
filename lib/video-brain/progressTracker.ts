/**
 * Progress Tracker
 *
 * Real-time generation progress indicator for user trust.
 * Tracks all phases from concept analysis to final render.
 */

import type { GenerationProgress, GenerationPhase, PHASE_WEIGHTS } from './types'

// =============================================================================
// PHASE DEFINITIONS
// =============================================================================

export const PHASE_INFO: Record<GenerationPhase, { label: string; description: string }> = {
  analyzing_intent: {
    label: 'Analyzing Intent',
    description: 'Understanding your request and goals',
  },
  detecting_style: {
    label: 'Detecting Style',
    description: 'Choosing optimal video style',
  },
  planning_narrative: {
    label: 'Planning Narrative',
    description: 'Building story structure and emotional arc',
  },
  structuring_scenes: {
    label: 'Structuring Scenes',
    description: 'Creating scene layouts and compositions',
  },
  creating_beats: {
    label: 'Creating Beats',
    description: 'Adding visual rhythm and timing',
  },
  validating_quality: {
    label: 'Validating Quality',
    description: 'Ensuring premium standards',
  },
  finalizing: {
    label: 'Finalizing',
    description: 'Completing video specification',
  },
  complete: {
    label: 'Complete',
    description: 'Video ready!',
  },
}

// Phase weights for overall progress calculation
const WEIGHTS: Record<GenerationPhase, { start: number; end: number }> = {
  analyzing_intent: { start: 0, end: 10 },
  detecting_style: { start: 10, end: 15 },
  planning_narrative: { start: 15, end: 30 },
  structuring_scenes: { start: 30, end: 50 },
  creating_beats: { start: 50, end: 75 },
  validating_quality: { start: 75, end: 90 },
  finalizing: { start: 90, end: 100 },
  complete: { start: 100, end: 100 },
}

// =============================================================================
// PROGRESS TRACKER CLASS
// =============================================================================

export type ProgressCallback = (progress: GenerationProgress) => void

export class ProgressTracker {
  private callback?: ProgressCallback
  private currentPhase: GenerationPhase = 'analyzing_intent'
  private phaseProgress: number = 0
  private startTime: number = Date.now()

  constructor(callback?: ProgressCallback) {
    this.callback = callback
  }

  /**
   * Calculate overall progress based on phase and phase progress
   */
  private calculateOverallProgress(): number {
    const weights = WEIGHTS[this.currentPhase]
    const phaseRange = weights.end - weights.start
    return Math.round(weights.start + (phaseRange * this.phaseProgress / 100))
  }

  /**
   * Build progress message
   */
  private buildMessage(): string {
    const info = PHASE_INFO[this.currentPhase]
    return info.description
  }

  /**
   * Emit progress update
   */
  private emit(extra?: Partial<GenerationProgress>): void {
    const progress: GenerationProgress = {
      phase: this.currentPhase,
      phaseProgress: this.phaseProgress,
      overallProgress: this.calculateOverallProgress(),
      message: this.buildMessage(),
      ...extra,
    }

    if (this.callback) {
      this.callback(progress)
    }

    // Also log
    const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1)
    console.log(
      `[Progress] ${progress.overallProgress}% | ${progress.phase} | ${elapsed}s | ${progress.message}`
    )
  }

  /**
   * Start a new phase
   */
  startPhase(phase: GenerationPhase): void {
    this.currentPhase = phase
    this.phaseProgress = 0
    this.emit()
  }

  /**
   * Update progress within current phase
   */
  updateProgress(phaseProgress: number, extra?: Partial<GenerationProgress>): void {
    this.phaseProgress = Math.min(100, Math.max(0, phaseProgress))
    this.emit(extra)
  }

  /**
   * Complete current phase
   */
  completePhase(): void {
    this.phaseProgress = 100
    this.emit()
  }

  /**
   * Mark generation as complete
   */
  complete(): void {
    this.currentPhase = 'complete'
    this.phaseProgress = 100
    this.emit()
  }

  /**
   * Get current progress snapshot
   */
  getProgress(): GenerationProgress {
    return {
      phase: this.currentPhase,
      phaseProgress: this.phaseProgress,
      overallProgress: this.calculateOverallProgress(),
      message: this.buildMessage(),
    }
  }

  /**
   * Get elapsed time in seconds
   */
  getElapsedTime(): number {
    return (Date.now() - this.startTime) / 1000
  }
}

// =============================================================================
// STREAMING PROGRESS
// =============================================================================

/**
 * Create a ReadableStream that emits progress updates
 */
export function createProgressStream(
  generateFn: (tracker: ProgressTracker) => Promise<any>
): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder()

  return new ReadableStream({
    async start(controller) {
      const tracker = new ProgressTracker((progress) => {
        const data = JSON.stringify(progress) + '\n'
        controller.enqueue(encoder.encode(`data: ${data}\n`))
      })

      try {
        const result = await generateFn(tracker)

        // Send final result
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'result', data: result })}\n\n`)
        )
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: 'error',
              error: error instanceof Error ? error.message : 'Unknown error',
            })}\n\n`
          )
        )
      } finally {
        controller.close()
      }
    },
  })
}

// =============================================================================
// PROGRESS HELPERS
// =============================================================================

/**
 * Format progress for display
 */
export function formatProgress(progress: GenerationProgress): string {
  const info = PHASE_INFO[progress.phase]
  const bar = createProgressBar(progress.overallProgress)
  return `${bar} ${progress.overallProgress}% - ${info.label}`
}

/**
 * Create ASCII progress bar
 */
export function createProgressBar(percent: number, width: number = 20): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled
  return `[${'█'.repeat(filled)}${'░'.repeat(empty)}]`
}

/**
 * Estimate remaining time based on progress
 */
export function estimateRemainingTime(
  elapsedSeconds: number,
  progressPercent: number
): number | null {
  if (progressPercent <= 0) return null
  if (progressPercent >= 100) return 0

  const rate = progressPercent / elapsedSeconds
  const remaining = (100 - progressPercent) / rate
  return Math.round(remaining)
}
