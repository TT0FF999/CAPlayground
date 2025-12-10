import type { Metadata } from "next"
import { Outfit } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Favicon } from "@/components/favicon"
import UnofficialDomainBanner from "@/components/unofficial-domain-banner"
import { PostHogProvider } from "@/components/posthog-provider"

const outfit = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-outfit",
  weight: ["300", "400", "600", "800"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "CAPlayground - Éditeur de Fonds d'écran Animés",
  description: "Créez de magnifiques fonds d'écran animés pour iOS et iPadOS sur n'importe quel ordinateur de bureau",
  verification: {
    google: "xNuTnO5iYYm2op2KXAClg0oYMmslpl35wOv-9RfySxU",
  },
  openGraph: {
    title: "CAPlayground - Éditeur de Fonds d'écran Animés",
    description: "Créez de magnifiques fonds d'écran animés pour iOS et iPadOS sur n'importe quel ordinateur de bureau",
    type: "website",
    images: [
      { url: "/icon-light.png", alt: "CAPlayground icône (clair)" },
      { url: "/icon-dark.png", alt: "CAPlayground icône (sombre)" },
    ],
  },
  icons: {
    icon: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
    shortcut: [
      { url: "/icon-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" className={`${outfit.variable}`} suppressHydrationWarning>
      <body 
        className="font-sans antialiased min-h-screen bg-white dark:bg-[#0f172a] dark:text-white"
      >
        <PostHogProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <UnofficialDomainBanner />
            <Favicon />
            {children}
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  )
}
