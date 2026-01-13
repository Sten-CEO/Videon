/**
 * Type definitions for Remotion video composition
 */

export interface Scene {
  headline: string
  subtext?: string
  imageUrl?: string
}

export interface Brand {
  primaryColor: string
  secondaryColor?: string
  logoUrl?: string
}

export interface VideoProps {
  scenes: Scene[]
  brand: Brand
}

// Default props for preview/testing
export const defaultVideoProps: VideoProps = {
  scenes: [
    { headline: 'Stop wasting time', subtext: 'on manual planning' },
    { headline: 'The Problem', subtext: 'Spreadsheets kill productivity' },
    { headline: 'The Solution', subtext: 'AI-powered planning in seconds' },
    { headline: 'Try it free', subtext: 'Start now →' },
  ],
  brand: {
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
  },
}
