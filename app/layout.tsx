import type { Metadata } from 'next'
import localFont from 'next/font/local'
import './globals.css'

const outfit = localFont({
  src: [
    {
      path: '../public/fonts/outfit-latin-wght-normal.woff2',
      style: 'normal',
    },
    {
      path: '../public/fonts/outfit-latin-ext-wght-normal.woff2',
      style: 'normal',
    },
  ],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Upnext — We build digital business',
  description: 'We build digital business. Website coming soon.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.variable}>{children}</body>
    </html>
  )
}
