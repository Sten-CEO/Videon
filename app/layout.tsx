import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Videon - AI-Powered Marketing Videos',
  description: 'Transform your ideas into professional marketing videos with AI. No video editing skills needed. Built for SaaS founders and small teams.',
  keywords: ['AI video', 'marketing video', 'video generator', 'SaaS', 'video creation'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
