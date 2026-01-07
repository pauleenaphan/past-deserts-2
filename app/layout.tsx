import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Past Deserts',
  description: 'A collection of dessert recipes and baking adventures',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-bgcolor">
        <Nav />
        {children}
      </body>
    </html>
  )
}

