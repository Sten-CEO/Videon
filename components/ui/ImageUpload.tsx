'use client'

/**
 * Image Upload Component
 *
 * Allows users to upload images for video generation.
 * Users specify the INTENT (what the image is), AI decides HOW to use it.
 */

import React, { useState, useRef, useCallback } from 'react'
import type { ImageIntent, ImageIntentType } from '@/lib/creative'

interface ImageUploadProps {
  images: ImageIntent[]
  onChange: (images: ImageIntent[]) => void
  maxImages?: number
  className?: string
}

// Intent options with user-friendly labels
const INTENT_OPTIONS: { value: ImageIntentType; label: string; description: string }[] = [
  { value: 'product_screenshot', label: 'Product Screenshot', description: 'Main product or feature screenshot' },
  { value: 'dashboard_overview', label: 'Dashboard', description: 'Dashboard or app overview' },
  { value: 'ui_detail', label: 'UI Detail', description: 'Specific UI element or feature' },
  { value: 'logo', label: 'Logo', description: 'Brand logo' },
  { value: 'testimonial', label: 'Testimonial', description: 'Person photo for testimonial' },
  { value: 'proof_element', label: 'Proof Element', description: 'Stats, graphs, social proof' },
  { value: 'hero_visual', label: 'Hero Visual', description: 'Main hero/featured image' },
  { value: 'background_asset', label: 'Background', description: 'Subtle background element' },
]

export const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const remainingSlots = maxImages - images.length
    const filesToProcess = Array.from(files).slice(0, remainingSlots)

    const newImages: ImageIntent[] = await Promise.all(
      filesToProcess.map(async (file) => {
        const base64 = await fileToBase64(file)
        return {
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          url: base64,
          intent: 'product_screenshot' as ImageIntentType, // Default intent
          description: file.name,
          priority: 'primary' as const,
        }
      })
    )

    onChange([...images, ...newImages])
  }, [images, maxImages, onChange])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }, [handleFileSelect])

  const handleClick = () => {
    fileInputRef.current?.click()
  }

  const handleRemove = (id: string) => {
    onChange(images.filter(img => img.id !== id))
  }

  const handleIntentChange = (id: string, intent: ImageIntentType) => {
    onChange(images.map(img =>
      img.id === id ? { ...img, intent } : img
    ))
  }

  const handlePriorityChange = (id: string, priority: 'primary' | 'secondary' | 'optional') => {
    onChange(images.map(img =>
      img.id === id ? { ...img, priority } : img
    ))
  }

  const canAddMore = images.length < maxImages

  return (
    <div className={className}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          onClick={handleClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`
            border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
            ${isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-border-hover hover:bg-background-secondary'
            }
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <svg
            className={`w-10 h-10 mx-auto mb-3 ${isDragging ? 'text-primary' : 'text-foreground-subtle'}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>

          <p className="text-foreground-muted mb-1">
            {isDragging ? 'Drop images here' : 'Click or drag images here'}
          </p>
          <p className="text-sm text-foreground-subtle">
            PNG, JPG, WebP - Max {maxImages} images
          </p>
        </div>
      )}

      {/* Uploaded Images Grid */}
      {images.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-medium text-foreground-muted">
            {images.length} image{images.length > 1 ? 's' : ''} added
          </p>

          <div className="space-y-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="flex gap-3 p-3 bg-background-secondary rounded-lg border border-border"
              >
                {/* Thumbnail */}
                <div className="flex-shrink-0 w-20 h-20 rounded overflow-hidden bg-background-tertiary">
                  <img
                    src={image.url}
                    alt={image.description || 'Uploaded image'}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Controls */}
                <div className="flex-1 min-w-0">
                  {/* Intent selector */}
                  <div className="mb-2">
                    <label className="text-xs text-foreground-subtle block mb-1">
                      Type d'image
                    </label>
                    <select
                      value={image.intent}
                      onChange={(e) => handleIntentChange(image.id, e.target.value as ImageIntentType)}
                      className="w-full px-2 py-1.5 text-sm bg-background border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      {INTENT_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Priority */}
                  <div className="flex gap-2">
                    {(['primary', 'secondary', 'optional'] as const).map((priority) => (
                      <button
                        key={priority}
                        onClick={() => handlePriorityChange(image.id, priority)}
                        className={`
                          px-2 py-0.5 text-xs rounded transition-colors
                          ${image.priority === priority
                            ? 'bg-primary text-white'
                            : 'bg-background-tertiary text-foreground-muted hover:bg-background-tertiary/80'
                          }
                        `}
                      >
                        {priority === 'primary' ? 'Principal' : priority === 'secondary' ? 'Secondaire' : 'Optionnel'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Remove button */}
                <button
                  onClick={() => handleRemove(image.id)}
                  className="flex-shrink-0 p-1.5 text-foreground-subtle hover:text-danger transition-colors"
                  title="Supprimer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help text */}
      {images.length > 0 && (
        <p className="mt-3 text-xs text-foreground-subtle">
          L'IA decidera comment, quand et si utiliser ces images en fonction de votre concept video.
        </p>
      )}
    </div>
  )
}

/**
 * Convert a File to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default ImageUpload
