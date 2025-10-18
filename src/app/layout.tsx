import type { Metadata } from 'next'
import { Inter, Crimson_Pro } from 'next/font/google'
import './globals.css'
import { Toaster } from 'sonner'
import { Chrome } from '@/components/layout/Chrome'
import ScrollToTop from '@/components/ScrollToTop'
import { ThemeProvider } from '@/components/providers/theme-provider'

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
})

const crimsonPro = Crimson_Pro({ 
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'lunoSpaces',
    template: '%s | lunoSpaces'
  },
  description: 'Delegate tasks to specialized AI Spaces that work like human experts. Scale your business without hiring with autonomous AI teams for Sales, Marketing, HR, Finance, and more.',
  keywords: ['AI agents', 'business automation', 'AI Spaces', 'autonomous AI', 'AI workforce', 'business AI', 'AI teams'],
  authors: [{ name: 'lunoSpaces' }],
  creator: 'lunoSpaces',
  publisher: 'lunoSpaces',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lunospaces.com',
    title: 'lunoSpaces - AI Spaces That Work Like Humans',
    description: 'Delegate tasks to specialized AI Spaces that work like human experts',
    siteName: 'lunoSpaces',
    images: [{
      url: '/images/og-image.png',
      width: 1200,
      height: 630,
      alt: 'lunoSpaces - AI Spaces',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'lunoSpaces - AI Spaces That Work Like Humans',
    description: 'Delegate tasks to specialized AI Spaces that work like human experts',
    images: ['/images/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/images/fovvydotted.png' },
      { url: '/images/fovvydotted.png', sizes: '32x32', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonPro.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased bg-background text-foreground flex flex-col min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <ScrollToTop />
          <Chrome which="navbar" />
          <main className="flex-1">
            {children}
          </main>
          <Chrome which="footer" />
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  )
}
