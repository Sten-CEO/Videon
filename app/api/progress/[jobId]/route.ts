/**
 * PROGRESS STREAMING ENDPOINT (Server-Sent Events)
 *
 * Streams real-time progress updates to the client.
 *
 * Usage:
 * const eventSource = new EventSource('/api/progress/job_123')
 * eventSource.onmessage = (event) => {
 *   const data = JSON.parse(event.data)
 *   console.log(`${data.progress}% - ${data.message}`)
 * }
 */

import { progressEmitter, type ProgressUpdate } from '@/lib/services/progressTracker'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params

  console.log(`[SSE] Client connected for job: ${jobId}`)

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      // Send initial connection message
      const sendEvent = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`
        controller.enqueue(encoder.encode(message))
      }

      // Check if job exists
      const existingJob = progressEmitter.getJob(jobId)
      if (existingJob) {
        // Send current state immediately
        sendEvent({
          jobId: existingJob.id,
          stage: existingJob.stage,
          progress: existingJob.progress,
          message: existingJob.history[existingJob.history.length - 1]?.message || 'En cours...',
          status: existingJob.status,
          timestamp: Date.now(),
        })
      } else {
        // Job not found yet, send waiting message
        sendEvent({
          jobId,
          stage: 'initializing',
          progress: 0,
          message: 'En attente de démarrage...',
          status: 'pending',
          timestamp: Date.now(),
        })
      }

      // Listen for progress updates
      const onProgress = (update: ProgressUpdate) => {
        if (update.jobId === jobId) {
          sendEvent(update)

          // Close stream if job is complete or failed
          if (update.stage === 'complete' || update.stage === 'error') {
            console.log(`[SSE] Job ${jobId} finished, closing stream`)
            setTimeout(() => {
              try {
                controller.close()
              } catch (e) {
                // Stream might already be closed
              }
            }, 1000) // Give client time to receive final message
          }
        }
      }

      progressEmitter.on('progress', onProgress)

      // Heartbeat to keep connection alive
      const heartbeat = setInterval(() => {
        try {
          const message = `: heartbeat\n\n`
          controller.enqueue(encoder.encode(message))
        } catch (e) {
          // Stream closed
          clearInterval(heartbeat)
        }
      }, 15000)

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE] Client disconnected: ${jobId}`)
        progressEmitter.off('progress', onProgress)
        clearInterval(heartbeat)
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
