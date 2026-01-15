/**
 * PROGRESS TRACKER SERVICE
 *
 * Tracks video generation progress and broadcasts updates.
 * Uses an in-memory store with event emitter pattern.
 */

import { EventEmitter } from 'events'

// =============================================================================
// TYPES
// =============================================================================

export type GenerationStage =
  | 'initializing'      // 0%
  | 'analyzing'         // 5%
  | 'generating_plan'   // 10%
  | 'plan_complete'     // 20%
  | 'rendering_frames'  // 25-40%
  | 'vision_analysis'   // 40-50%
  | 'applying_fixes'    // 50-60%
  | 'iteration_2'       // 60-75%
  | 'iteration_3'       // 75-85%
  | 'finalizing'        // 85-95%
  | 'complete'          // 100%
  | 'error'             // Error state

export interface ProgressUpdate {
  jobId: string
  stage: GenerationStage
  progress: number        // 0-100
  message: string         // Human readable message
  details?: {
    currentStep?: string
    totalSteps?: number
    currentIteration?: number
    maxIterations?: number
    score?: number
  }
  timestamp: number
}

export interface GenerationJob {
  id: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  progress: number
  stage: GenerationStage
  history: ProgressUpdate[]
  result?: any
  error?: string
  createdAt: number
  updatedAt: number
}

// =============================================================================
// PROGRESS EMITTER (Singleton)
// =============================================================================

class ProgressEmitter extends EventEmitter {
  private jobs: Map<string, GenerationJob> = new Map()

  constructor() {
    super()
    this.setMaxListeners(100) // Allow many concurrent listeners
  }

  /**
   * Create a new generation job
   */
  createJob(jobId?: string): string {
    const id = jobId || `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    const job: GenerationJob = {
      id,
      status: 'pending',
      progress: 0,
      stage: 'initializing',
      history: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    }

    this.jobs.set(id, job)
    console.log(`[PROGRESS] Job created: ${id}`)

    return id
  }

  /**
   * Update job progress
   */
  updateProgress(
    jobId: string,
    stage: GenerationStage,
    progress: number,
    message: string,
    details?: ProgressUpdate['details']
  ): void {
    const job = this.jobs.get(jobId)
    if (!job) {
      console.warn(`[PROGRESS] Job not found: ${jobId}`)
      return
    }

    const update: ProgressUpdate = {
      jobId,
      stage,
      progress: Math.min(100, Math.max(0, progress)),
      message,
      details,
      timestamp: Date.now(),
    }

    job.progress = update.progress
    job.stage = stage
    job.status = stage === 'complete' ? 'completed' : stage === 'error' ? 'failed' : 'running'
    job.history.push(update)
    job.updatedAt = Date.now()

    console.log(`[PROGRESS] ${jobId}: ${progress}% - ${message}`)

    // Emit event for SSE listeners
    this.emit(`progress:${jobId}`, update)
    this.emit('progress', update)
  }

  /**
   * Mark job as complete
   */
  completeJob(jobId: string, result?: any): void {
    const job = this.jobs.get(jobId)
    if (!job) return

    job.status = 'completed'
    job.progress = 100
    job.stage = 'complete'
    job.result = result
    job.updatedAt = Date.now()

    this.updateProgress(jobId, 'complete', 100, 'Vidéo générée avec succès!')
  }

  /**
   * Mark job as failed
   */
  failJob(jobId: string, error: string): void {
    const job = this.jobs.get(jobId)
    if (!job) return

    job.status = 'failed'
    job.stage = 'error'
    job.error = error
    job.updatedAt = Date.now()

    this.updateProgress(jobId, 'error', job.progress, `Erreur: ${error}`)
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): GenerationJob | undefined {
    return this.jobs.get(jobId)
  }

  /**
   * Clean up old jobs (call periodically)
   */
  cleanupOldJobs(maxAgeMs: number = 30 * 60 * 1000): void {
    const now = Date.now()
    for (const [id, job] of this.jobs.entries()) {
      if (now - job.updatedAt > maxAgeMs) {
        this.jobs.delete(id)
        console.log(`[PROGRESS] Cleaned up old job: ${id}`)
      }
    }
  }
}

// Singleton instance
export const progressEmitter = new ProgressEmitter()

// =============================================================================
// HELPER: Progress stages with default percentages
// =============================================================================

export const STAGE_PROGRESS: Record<GenerationStage, { min: number; max: number; label: string }> = {
  initializing:     { min: 0,  max: 5,   label: 'Initialisation...' },
  analyzing:        { min: 5,  max: 10,  label: 'Analyse de la demande...' },
  generating_plan:  { min: 10, max: 20,  label: 'Génération du plan créatif...' },
  plan_complete:    { min: 20, max: 25,  label: 'Plan créatif prêt!' },
  rendering_frames: { min: 25, max: 40,  label: 'Rendu des images...' },
  vision_analysis:  { min: 40, max: 50,  label: 'Analyse visuelle IA...' },
  applying_fixes:   { min: 50, max: 60,  label: 'Application des corrections...' },
  iteration_2:      { min: 60, max: 75,  label: 'Raffinement (2ème passe)...' },
  iteration_3:      { min: 75, max: 85,  label: 'Raffinement final...' },
  finalizing:       { min: 85, max: 95,  label: 'Finalisation...' },
  complete:         { min: 100, max: 100, label: 'Terminé!' },
  error:            { min: 0,  max: 0,   label: 'Erreur' },
}

// =============================================================================
// HELPER: Create progress helper for a job
// =============================================================================

export function createProgressHelper(jobId: string) {
  return {
    start: () => {
      progressEmitter.updateProgress(jobId, 'initializing', 0, 'Démarrage de la génération...')
    },

    analyzing: () => {
      progressEmitter.updateProgress(jobId, 'analyzing', 5, 'Analyse de votre demande...')
    },

    generatingPlan: () => {
      progressEmitter.updateProgress(jobId, 'generating_plan', 15, 'Création du plan créatif...')
    },

    planComplete: () => {
      progressEmitter.updateProgress(jobId, 'plan_complete', 20, 'Plan créatif terminé!')
    },

    renderingFrames: (current: number, total: number) => {
      const progress = 25 + (current / total) * 15
      progressEmitter.updateProgress(
        jobId,
        'rendering_frames',
        progress,
        `Rendu de la scène ${current}/${total}...`,
        { currentStep: `scene_${current}`, totalSteps: total }
      )
    },

    visionAnalysis: (iteration: number, maxIterations: number) => {
      const baseProgress = iteration === 1 ? 40 : iteration === 2 ? 60 : 75
      progressEmitter.updateProgress(
        jobId,
        'vision_analysis',
        baseProgress,
        `Analyse visuelle (itération ${iteration}/${maxIterations})...`,
        { currentIteration: iteration, maxIterations }
      )
    },

    applyingFixes: (iteration: number, score: number) => {
      const baseProgress = iteration === 1 ? 50 : iteration === 2 ? 70 : 80
      progressEmitter.updateProgress(
        jobId,
        'applying_fixes',
        baseProgress,
        `Application des corrections (score: ${score}/10)...`,
        { currentIteration: iteration, score }
      )
    },

    iteration: (num: 2 | 3) => {
      const stage = num === 2 ? 'iteration_2' : 'iteration_3'
      const progress = num === 2 ? 60 : 75
      progressEmitter.updateProgress(
        jobId,
        stage as GenerationStage,
        progress,
        `Raffinement ${num === 2 ? '(2ème passe)' : 'final'}...`
      )
    },

    finalizing: () => {
      progressEmitter.updateProgress(jobId, 'finalizing', 90, 'Finalisation de la vidéo...')
    },

    complete: (score?: number) => {
      progressEmitter.updateProgress(
        jobId,
        'complete',
        100,
        score ? `Vidéo générée! Score qualité: ${score}/10` : 'Vidéo générée avec succès!',
        score ? { score } : undefined
      )
    },

    error: (message: string) => {
      progressEmitter.failJob(jobId, message)
    }
  }
}

export default progressEmitter
