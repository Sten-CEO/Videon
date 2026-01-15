'use client'

import { useState, useEffect } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'

const fontOptions = [
  'Inter',
  'Outfit',
  'Poppins',
  'Montserrat',
  'Roboto',
  'Open Sans',
  'Lato',
  'Playfair Display',
  'Merriweather',
  'Source Sans Pro',
]

interface BrandSettings {
  brandName: string
  logoUrl: string | null
  primaryColor: string
  secondaryColor: string
  fontPreference: string
}

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState<BrandSettings>({
    brandName: 'My Brand',
    logoUrl: null,
    primaryColor: '#0D9488',
    secondaryColor: '#F97316',
    fontPreference: 'Inter',
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate save - in production, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#18181B] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
          Brand Settings
        </h1>
        <p className="text-[#52525B]">
          Configure your brand assets for consistent video styling.
        </p>
      </div>

      {/* Success message */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-[#D1FAE5] border border-[#059669]/20 text-[#059669] text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Brand settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Logo */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Upload your company logo. Recommended size: 512x512px, PNG or SVG.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Logo preview */}
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#F0FDFA] to-[#FFF7ED] border-2 border-dashed border-[#E4E4E7] flex items-center justify-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-xl" />
                ) : (
                  <svg className="w-8 h-8 text-[#A1A1AA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <Button variant="outline" size="md">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Logo
                </Button>
                <p className="text-xs text-[#A1A1AA] mt-2">
                  PNG, SVG, or JPG up to 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Name */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Brand Name</CardTitle>
            <CardDescription>
              Your company or product name as it should appear in videos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Input
              value={settings.brandName}
              onChange={(e) => setSettings({ ...settings, brandName: e.target.value })}
              placeholder="Enter your brand name"
              className="bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488] focus:ring-[#0D9488]"
            />
          </CardContent>
        </Card>

        {/* Colors */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Brand Colors</CardTitle>
            <CardDescription>
              Choose your primary and secondary brand colors.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Primary color */}
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[#E4E4E7]"
                    />
                  </div>
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    placeholder="#0D9488"
                    className="font-mono bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488]"
                  />
                </div>
              </div>

              {/* Secondary color */}
              <div>
                <label className="block text-sm font-medium text-[#52525B] mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer border-2 border-[#E4E4E7]"
                    />
                  </div>
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    placeholder="#F97316"
                    className="font-mono bg-[#FAFAF9] border-[#E4E4E7] focus:border-[#0D9488]"
                  />
                </div>
              </div>
            </div>

            {/* Color preview */}
            <div className="mt-6 p-4 rounded-xl bg-[#FAFAF9]">
              <p className="text-sm text-[#52525B] mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl shadow-sm"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <div
                  className="w-16 h-16 rounded-xl shadow-sm"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <div
                  className="flex-1 h-16 rounded-xl shadow-sm"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card variant="elevated" padding="lg">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Choose the font style for your video text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-[#52525B] mb-2">
                Font Preference
              </label>
              <select
                value={settings.fontPreference}
                onChange={(e) => setSettings({ ...settings, fontPreference: e.target.value })}
                className="w-full bg-[#FAFAF9] border border-[#E4E4E7] rounded-xl px-4 py-3 text-[#18181B] focus:outline-none focus:border-[#0D9488] focus:ring-1 focus:ring-[#0D9488]"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font preview */}
            <div className="mt-6 p-6 rounded-xl bg-[#FAFAF9] text-center">
              <p
                className="text-2xl font-bold text-[#18181B] mb-2"
                style={{ fontFamily: settings.fontPreference }}
              >
                {settings.brandName || 'Your Brand'}
              </p>
              <p
                className="text-[#52525B]"
                style={{ fontFamily: settings.fontPreference }}
              >
                The quick brown fox jumps over the lazy dog.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Save button */}
        <div className="flex justify-end">
          <Button variant="primary" size="lg" onClick={handleSave} isLoading={isSaving}>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
