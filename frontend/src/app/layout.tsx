import type { Metadata } from 'next'
import './globals.css'
import { Sidebar } from '@/components/Sidebar'

// Use system fonts as fallback to avoid Google Fonts issues
const fontClass = 'font-sans'

export const metadata: Metadata = {
  title: 'EventFlow - Modern Event Management',
  description: 'Create, manage, and track events with style and ease',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={fontClass} style={{ margin: 0, padding: 0 }}>
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 50%, #e8eaf6 100%)' }}>
          <Sidebar />
          
          {/* Content Area */}
          <div style={{ flex: 1, marginLeft: '256px', minHeight: '100vh' }}>
            <div style={{ padding: '32px' }}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}