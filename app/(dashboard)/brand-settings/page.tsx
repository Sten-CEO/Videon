'use client'

import { useState } from 'react'
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { mockBrandSettings, fontOptions } from '@/lib/data/mock'

export default function BrandSettingsPage() {
  const [settings, setSettings] = useState(mockBrandSettings)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  async function handleSave() {
    setIsSaving(true)
    setSaveSuccess(false)

    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))

    setIsSaving(false)
    setSaveSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  return (
    <div className="max-w-3xl">
      <DashboardHeader
        title="Brand Settings"
        description="Configure your brand assets for consistent video styling."
      />

      {/* Success message */}
      {saveSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-success/10 border border-success/20 text-success text-sm flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Brand settings saved successfully!
        </div>
      )}

      <div className="space-y-6">
        {/* Logo */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>
              Upload your company logo. Recommended size: 512x512px, PNG or SVG.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {/* Logo preview */}
              <div className="w-24 h-24 rounded-xl bg-background-tertiary border-2 border-dashed border-border flex items-center justify-center">
                {settings.logoUrl ? (
                  <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain" />
                ) : (
                  <svg className="w-8 h-8 text-foreground-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                )}
              </div>

              <div className="flex-1">
                <Button variant="outline" size="sm">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Upload Logo
                </Button>
                <p className="text-xs text-foreground-subtle mt-2">
                  PNG, SVG, or JPG up to 2MB
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Brand Name */}
        <Card padding="lg">
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
            />
          </CardContent>
        </Card>

        {/* Colors */}
        <Card padding="lg">
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
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Primary Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                  <Input
                    value={settings.primaryColor}
                    onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                    placeholder="#6366f1"
                    className="font-mono"
                  />
                </div>
              </div>

              {/* Secondary color */}
              <div>
                <label className="block text-sm font-medium text-foreground-muted mb-2">
                  Secondary Color
                </label>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                  </div>
                  <Input
                    value={settings.secondaryColor}
                    onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                    placeholder="#22d3ee"
                    className="font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Color preview */}
            <div className="mt-6 p-4 rounded-xl bg-background-tertiary">
              <p className="text-sm text-foreground-muted mb-3">Preview</p>
              <div className="flex items-center gap-4">
                <div
                  className="w-16 h-16 rounded-xl"
                  style={{ backgroundColor: settings.primaryColor }}
                />
                <div
                  className="w-16 h-16 rounded-xl"
                  style={{ backgroundColor: settings.secondaryColor }}
                />
                <div
                  className="flex-1 h-16 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${settings.primaryColor}, ${settings.secondaryColor})`,
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Typography */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>
              Choose the font style for your video text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <label className="block text-sm font-medium text-foreground-muted mb-2">
                Font Preference
              </label>
              <select
                value={settings.fontPreference}
                onChange={(e) => setSettings({ ...settings, fontPreference: e.target.value })}
                className="w-full bg-background-secondary border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                {fontOptions.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>

            {/* Font preview */}
            <div className="mt-6 p-6 rounded-xl bg-background-tertiary text-center">
              <p
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: settings.fontPreference }}
              >
                {settings.brandName || 'Your Brand'}
              </p>
              <p
                className="text-foreground-muted"
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
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}
