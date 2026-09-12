import './globals.css'
import { ThemeProvider } from 'next-themes'
import { IconGitHub } from '@/components/ui/icons'
import NimbusLogo from '@/components/NimbusLogo'
import { Analytics } from "@vercel/analytics/react"

export const metadata = {
  title: 'Nimbus â€” Open-source Grok alternative',
  description:
    'Nimbus is a free, MIT-licensed Grok-style AI chatbot. Bring your own API key (DeepSeek, OpenAI, Groq, xAI, OpenRouter, or local Ollama).',
  keywords: [
    'Nimbus', 'Grok', 'AI chatbot', 'open source', 'MIT',
    'DeepSeek', 'OpenAI', 'Groq', 'xAI', 'OpenRouter', 'Ollama',
    'multi-provider', 'BYOK', 'self-hosted',
  ],
  authors: [{ name: 'Nimbus contributors' }],
  creator: 'Nimbus',
  publisher: 'Nimbus',
  manifest: '/manifest.json',
  openGraph: {
    title: 'Nimbus â€” Open-source Grok alternative',
    description: 'Grok-style AI chatbot. Multi-provider. MIT. Self-hostable.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nimbus â€” Open-source Grok alternative',
    description: 'Grok-style AI chatbot. Multi-provider. MIT. Self-hostable.',
  },
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}

const Footer = () => (
  <footer className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-sm border-t border-border/40">
    <div className="max-w-3xl mx-auto p-2 flex items-center justify-center gap-3 text-xs text-muted-foreground">
      <span>Nimbus Â· MIT licensed</span>
      <a
        href="https://github.com/DatoBHJ/grok-clone"
        target="_blank"
        rel="noopener noreferrer"
        className="p-1.5 rounded-full hover:bg-accent transition-colors"
        aria-label="Original repo (DatoBHJ/grok-clone)"
        title="Built on DatoBHJ/grok-clone (MIT)"
      >
        <IconGitHub className="h-4 w-4 text-muted-foreground hover:text-foreground" />
      </a>
      <span>100% unaffiliated with xAI</span>
    </div>
  </footer>
);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="bg-background text-foreground min-h-screen">
            {children}
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}