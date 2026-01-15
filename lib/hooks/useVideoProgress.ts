/**
 * USE VIDEO PROGRESS HOOK
 *
 * React hook for tracking video generation progress in real-time.
 *
 * Usage:
 * ```tsx
 * const { progress, status, message, startGeneration } = useVideoProgress()
 *
 * // Start generation
 * const result = await startGeneration({ message: "Mon SaaS..." })
 *
 * // Progress updates automatically
 * <ProgressBar value={progress} />
 * <span>{message}</span>
 * ```
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export type GenerationStatus = 'idle' | 'connecting' | 'running' | 'completed' | 'failed'

export interface ProgressState {
  jobId: string | null
  progress: number
  status: GenerationStatus
  message: string
  stage: string
  score?: number
  error?: string
}

export interface GenerationOptions {
  message: string
  providedImages?: Array<{
    id: string
    url: string
    intent?: string
    description?: string
  }>
  enableRefinement?: boolean
  maxIterations?: number
}

// =============================================================================
// HOOK
// =============================================================================

export function useVideoProgress() {
  const [state, setState] = useState<ProgressState>({
    jobId: null,
    progress: 0,
    status: 'idle',
    message: '',
    stage: 'idle',
  })

  const eventSourceRef = useRef<EventSource | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Subscribe to progress updates
  const subscribeToProgress = useCallback((jobId: string) => {
    // Close existing connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    setState(prev => ({ ...prev, status: 'connecting' }))

    const eventSource = new EventSource(`/api/progress/${jobId}`)
    eventSourceRef.current = eventSource

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        setState(prev => ({
          ...prev,
          jobId: data.jobId,
          progress: data.progress,
          message: data.message,
          stage: data.stage,
          score: data.details?.score,
          status: data.stage === 'complete' ? 'completed' :
                  data.stage === 'error' ? 'failed' : 'running',
          error: data.stage === 'error' ? data.message : undefined,
        }))

        // Close connection when done
        if (data.stage === 'complete' || data.stage === 'error') {
          eventSource.close()
          eventSourceRef.current = null
        }
      } catch (e) {
        console.error('[useVideoProgress] Failed to parse event:', e)
      }
    }

    eventSource.onerror = () => {
      console.error('[useVideoProgress] EventSource error')
      setState(prev => ({
        ...prev,
        status: prev.status === 'completed' ? 'completed' : 'failed',
        error: prev.error || 'Connection lost',
      }))
      eventSource.close()
      eventSourceRef.current = null
    }
  }, [])

  // Start video generation
  const startGeneration = useCallback(async (options: GenerationOptions): Promise<any> => {
    // Reset state
    setState({
      jobId: null,
      progress: 0,
      status: 'running',
      message: 'Démarrage...',
      stage: 'initializing',
    })

    // Create abort controller
    abortControllerRef.current = new AbortController()

    try {
      // Generate a job ID first so we can start listening before the request completes
      const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Start listening for progress
      subscribeToProgress(jobId)

      // Make the API request
      const response = await fetch('/api/creative-refined', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...options,
          jobId, // Pass our job ID to the server
        }),
        signal: abortControllerRef.current.signal,
      })

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Generation failed')
      }

      return result

    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        setState(prev => ({
          ...prev,
          status: 'idle',
          message: 'Annulé',
        }))
        return null
      }

      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        message: `Erreur: ${error instanceof Error ? error.message : 'Unknown error'}`,
      }))
      throw error
    }
  }, [subscribeToProgress])

  // Cancel generation
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setState({
      jobId: null,
      progress: 0,
      status: 'idle',
      message: '',
      stage: 'idle',
    })
  }, [])

  // Reset to idle state
  const reset = useCallback(() => {
    cancel()
  }, [cancel])

  return {
    // State
    jobId: state.jobId,
    progress: state.progress,
    status: state.status,
    message: state.message,
    stage: state.stage,
    score: state.score,
    error: state.error,

    // Computed
    isIdle: state.status === 'idle',
    isRunning: state.status === 'running' || state.status === 'connecting',
    isCompleted: state.status === 'completed',
    isFailed: state.status === 'failed',

    // Actions
    startGeneration,
    cancel,
    reset,
  }
}

export default useVideoProgress
