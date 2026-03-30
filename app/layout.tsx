import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '300', '400', '600', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Upnext — We build digital business',
  description: 'We build digital business. Website coming soon.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={outfit.className}>{children}</body>
    </html>
  )
}
