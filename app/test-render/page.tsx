'use client'

/**
 * Test Render Page
 *
 * MVP test interface to:
 * 1. Generate AI blueprint (hook + scenes)
 * 2. Optionally generate images
 * 3. Render video with Remotion
 */

import { useState } from 'react'

interface AIBlueprint {
  hook: string
  angle: string
  video_structure: Array<{
    scene: number
    duration: string
    purpose: string
    content: string
    text_overlay?: string
  }>
  reasoning: string
  visual_suggestions: string[]
}

interface Scene {
  headline: string
  subtext?: string
  imageUrl?: string
}

export default function TestRenderPage() {
  // State
  const [prompt, setPrompt] = useState('I want to promote the planning feature of my SaaS to founders')
  const [blueprint, setBlueprint] = useState<AIBlueprint | null>(null)
  const [scenes, setScenes] = useState<Scene[]>([])
  const [videoUrl, setVideoUrl] = useState<string | null>(null)

  // Loading states
  const [loadingBlueprint, setLoadingBlueprint] = useState(false)
  const [loadingImage, setLoadingImage] = useState<number | null>(null)
  const [loadingRender, setLoadingRender] = useState(false)

  // Error state
  const [error, setError] = useState<string | null>(null)

  // Step 1: Generate AI Blueprint
  async function generateBlueprint() {
    setError(null)
    setLoadingBlueprint(true)
    setBlueprint(null)
    setScenes([])
    setVideoUrl(null)

    try {
      const res = await fetch('/api/ai-test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: prompt }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate blueprint')
      }

      setBlueprint(data.data)

      // Convert video_structure to scenes
      const newScenes: Scene[] = data.data.video_structure.slice(0, 4).map(
        (vs: AIBlueprint['video_structure'][0]) => ({
          headline: vs.text_overlay || vs.content.substring(0, 30),
          subtext: vs.purpose,
        })
      )
      setScenes(newScenes)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingBlueprint(false)
    }
  }

  // Step 2: Generate Image for a Scene
  async function generateImage(sceneIndex: number) {
    if (!blueprint) return

    setError(null)
    setLoadingImage(sceneIndex)

    try {
      const scene = scenes[sceneIndex]
      const imagePrompt = `Marketing visual for SaaS: ${scene.headline}. ${blueprint.visual_suggestions[0] || ''}. Modern, minimal, dark theme.`

      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: imagePrompt,
          size: '1024x1792', // Vertical for 9:16
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate image')
      }

      // Update scene with image URL
      const updatedScenes = [...scenes]
      updatedScenes[sceneIndex] = {
        ...updatedScenes[sceneIndex],
        imageUrl: data.imageUrl,
      }
      setScenes(updatedScenes)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingImage(null)
    }
  }

  // Step 3: Render Video
  async function renderVideo() {
    setError(null)
    setLoadingRender(true)
    setVideoUrl(null)

    try {
      const res = await fetch('/api/video/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes,
          brand: {
            primaryColor: '#6366f1',
            secondaryColor: '#8b5cf6',
          },
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || data.message || 'Failed to render video')
      }

      setVideoUrl(data.downloadUrl)

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoadingRender(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Video Render Test</h1>
        <p className="text-gray-400 mb-8">MVP test for AI blueprint → Image → Video pipeline</p>

        {/* Error display */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Step 1: Prompt Input */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">1</span>
            Enter Prompt
          </h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full h-24 bg-[#18181b] border border-[#27272a] rounded-lg p-4 text-white resize-none focus:border-indigo-500 focus:outline-none"
            placeholder="Describe what you want to promote..."
          />
          <button
            onClick={generateBlueprint}
            disabled={loadingBlueprint || !prompt.trim()}
            className="mt-3 px-6 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
          >
            {loadingBlueprint ? 'Generating Blueprint...' : 'Generate AI Blueprint'}
          </button>
        </section>

        {/* Step 2: Blueprint & Scenes */}
        {blueprint && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">2</span>
              AI Blueprint
            </h2>

            {/* Hook */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-1">Hook</div>
              <div className="text-2xl font-bold text-indigo-400">{blueprint.hook}</div>
            </div>

            {/* Angle */}
            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4 mb-4">
              <div className="text-sm text-gray-400 mb-1">Marketing Angle</div>
              <div className="text-gray-200">{blueprint.angle}</div>
            </div>

            {/* Scenes */}
            <div className="grid grid-cols-2 gap-4">
              {scenes.map((scene, i) => (
                <div key={i} className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
                  <div className="text-sm text-gray-400 mb-1">Scene {i + 1}</div>
                  <div className="font-semibold mb-1">{scene.headline}</div>
                  <div className="text-sm text-gray-400 mb-3">{scene.subtext}</div>

                  {scene.imageUrl ? (
                    <img
                      src={scene.imageUrl}
                      alt={`Scene ${i + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <button
                      onClick={() => generateImage(i)}
                      disabled={loadingImage !== null}
                      className="w-full py-2 bg-[#27272a] hover:bg-[#3f3f46] disabled:opacity-50 rounded-lg text-sm transition-colors"
                    >
                      {loadingImage === i ? 'Generating...' : 'Generate Image'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Step 3: Render Video */}
        {scenes.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-sm flex items-center justify-center">3</span>
              Render Video
            </h2>

            <button
              onClick={renderVideo}
              disabled={loadingRender}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loadingRender ? 'Rendering Video... (this may take a minute)' : 'Render MP4 Video'}
            </button>

            {loadingRender && (
              <p className="mt-2 text-sm text-gray-400">
                Bundling composition and rendering frames... Please wait.
              </p>
            )}
          </section>
        )}

        {/* Step 4: Video Result */}
        {videoUrl && (
          <section>
            <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-green-500 text-sm flex items-center justify-center">✓</span>
              Video Ready!
            </h2>

            <div className="bg-[#18181b] border border-[#27272a] rounded-lg p-4">
              <video
                src={videoUrl}
                controls
                className="w-full max-w-sm mx-auto rounded-lg"
                style={{ aspectRatio: '9/16' }}
              />

              <div className="mt-4 text-center">
                <a
                  href={videoUrl}
                  download
                  className="inline-block px-6 py-2 bg-indigo-500 hover:bg-indigo-600 rounded-lg font-medium transition-colors"
                >
                  Download MP4
                </a>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
