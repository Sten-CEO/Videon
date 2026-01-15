'use client'

/**
 * GENERATE V2 - Test page for dynamic video generation
 *
 * Cette page utilise le nouveau système de composants dynamiques.
 * L'IA décide de la composition visuelle de chaque scène.
 */

import { useState } from 'react'
import { Button, Textarea, Card } from '@/components/ui'
import { DynamicVideoPlayer } from '@/components/ui/DynamicVideo'
import type { VideoPlan } from '@/lib/video-components/types'

export default function GenerateV2Page() {
  const [description, setDescription] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [videoPlan, setVideoPlan] = useState<VideoPlan | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [showJson, setShowJson] = useState(false)

  async function handleGenerate() {
    if (!description.trim()) return

    setIsGenerating(true)
    setError(null)
    setVideoPlan(null)

    try {
      const response = await fetch('/api/generate-dynamic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate')
      }

      setVideoPlan(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const examplePrompts = [
    'App de fitness "FitPro" pour jeunes actifs, moderne et énergique',
    'SaaS de gestion de projet "TaskFlow" pour équipes tech, professionnel',
    'App de méditation "ZenMind" pour réduire le stress, calme et apaisant',
    'Plateforme e-learning "LearnFast" pour professionnels, inspirant',
  ]

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1
            className="text-2xl font-bold text-[#18181B]"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Generate V2
          </h1>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-[#F97316]/10 text-[#F97316]">
            BETA
          </span>
        </div>
        <p className="text-[#52525B]">
          Nouveau système de génération avec composition dynamique. L'IA décide du placement et des animations.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="space-y-6">
          {/* Main Input */}
          <Card variant="elevated" padding="lg">
            <h2 className="font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
              Décrivez votre vidéo
            </h2>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre produit, votre cible, le ton souhaité...

Exemple: Application de productivité pour freelances, moderne et minimaliste. Cible: 25-40 ans, entrepreneurs. Ton: professionnel mais accessible."
              rows={6}
              className="mb-4 bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488]"
            />

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#A1A1AA]">
                {description.length} caractères
              </span>
              <Button
                variant="primary"
                size="lg"
                onClick={handleGenerate}
                isLoading={isGenerating}
                disabled={!description.trim()}
              >
                {isGenerating ? 'Génération...' : 'Générer la vidéo'}
              </Button>
            </div>
          </Card>

          {/* Example Prompts */}
          <div>
            <h3 className="text-sm font-semibold text-[#18181B] mb-3">
              Exemples
            </h3>
            <div className="space-y-2">
              {examplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => setDescription(prompt)}
                  className="w-full text-left px-4 py-3 text-sm bg-white rounded-xl border border-[#E4E4E7] text-[#52525B] hover:border-[#0D9488] hover:text-[#0D9488] transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          {/* Error */}
          {error && (
            <Card variant="elevated" padding="md" className="border-[#DC2626]/30 bg-[#FEE2E2]">
              <h3 className="font-semibold text-[#DC2626] mb-1">Erreur</h3>
              <p className="text-sm text-[#52525B]">{error}</p>
            </Card>
          )}
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          {videoPlan ? (
            <>
              {/* Video Player */}
              <DynamicVideoPlayer
                plan={videoPlan}
                autoPlay={true}
                loop={true}
                showControls={true}
              />

              {/* Plan Info */}
              <Card variant="elevated" padding="md">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-[#18181B]" style={{ fontFamily: 'var(--font-display)' }}>
                    Plan généré
                  </h3>
                  <button
                    onClick={() => setShowJson(!showJson)}
                    className="text-sm text-[#0D9488] hover:text-[#0F766E]"
                  >
                    {showJson ? 'Masquer JSON' : 'Voir JSON'}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-[#A1A1AA]">Marque</span>
                    <p className="font-medium text-[#18181B]">{videoPlan.brand.name}</p>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA]">Durée</span>
                    <p className="font-medium text-[#18181B]">{videoPlan.settings.totalDuration}s</p>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA]">Scènes</span>
                    <p className="font-medium text-[#18181B]">{videoPlan.scenes.length}</p>
                  </div>
                  <div>
                    <span className="text-[#A1A1AA]">Format</span>
                    <p className="font-medium text-[#18181B]">{videoPlan.settings.aspectRatio}</p>
                  </div>
                </div>

                {/* Colors */}
                <div className="mt-4 pt-4 border-t border-[#E4E4E7]">
                  <span className="text-sm text-[#A1A1AA]">Couleurs</span>
                  <div className="flex gap-2 mt-2">
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: videoPlan.brand.colors.primary }}
                      title="Primary"
                    />
                    <div
                      className="w-8 h-8 rounded-lg shadow-sm"
                      style={{ backgroundColor: videoPlan.brand.colors.secondary }}
                      title="Secondary"
                    />
                    {videoPlan.brand.colors.accent && (
                      <div
                        className="w-8 h-8 rounded-lg shadow-sm"
                        style={{ backgroundColor: videoPlan.brand.colors.accent }}
                        title="Accent"
                      />
                    )}
                  </div>
                </div>

                {/* JSON View */}
                {showJson && (
                  <div className="mt-4 pt-4 border-t border-[#E4E4E7]">
                    <pre className="text-xs bg-[#0a0a0a] text-[#00FF00] p-4 rounded-xl overflow-auto max-h-80 font-mono">
                      {JSON.stringify(videoPlan, null, 2)}
                    </pre>
                  </div>
                )}
              </Card>

              {/* Scenes List */}
              <Card variant="elevated" padding="md">
                <h3 className="font-semibold text-[#18181B] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                  Scènes ({videoPlan.scenes.length})
                </h3>
                <div className="space-y-3">
                  {videoPlan.scenes.map((scene, index) => (
                    <div
                      key={scene.id || index}
                      className="p-3 rounded-xl bg-[#FAFAF9] border border-[#E4E4E7]"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#0D9488] uppercase">
                          {scene.name}
                        </span>
                        <span className="text-xs text-[#A1A1AA]">
                          {scene.duration}s · {scene.elements.length} éléments
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {scene.elements.map((el, elIndex) => (
                          <span
                            key={elIndex}
                            className="px-2 py-0.5 text-xs bg-white border border-[#E4E4E7] rounded-full text-[#52525B]"
                          >
                            {el.type}
                          </span>
                        ))}
                      </div>
                      {scene.transition && (
                        <div className="mt-2 text-xs text-[#A1A1AA]">
                          Transition: {scene.transition.type}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            /* Empty State */
            <Card variant="elevated" padding="xl" className="text-center">
              <div className="max-w-sm mx-auto">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-[#0D9488]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[#18181B] mb-2" style={{ fontFamily: 'var(--font-display)' }}>
                  Nouvelle génération dynamique
                </h3>
                <p className="text-[#52525B] mb-4">
                  L'IA va créer une vidéo avec des compositions visuelles uniques et créatives.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  <span className="px-3 py-1 text-xs bg-[#F0FDFA] text-[#0D9488] rounded-full">
                    Positions dynamiques
                  </span>
                  <span className="px-3 py-1 text-xs bg-[#FFF7ED] text-[#F97316] rounded-full">
                    Animations variées
                  </span>
                  <span className="px-3 py-1 text-xs bg-[#F5F5F4] text-[#52525B] rounded-full">
                    Transitions fluides
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
