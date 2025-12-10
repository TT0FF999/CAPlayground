import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import Link from "next/link"
import { Send, Filter as NotificationIcon, Github, Star, Download } from "lucide-react"
import Image from "next/image"

export const runtime = 'edge'

interface WallpaperItem {
  id: string | number
  name: string
  creator: string
  description: string
  file: string
  preview: string
  from: string
}

interface WallpapersResponse {
  base_url: string
  wallpapers: WallpaperItem[]
}

function isVideo(src: string) {
  const lower = src.toLowerCase()
  return lower.endsWith(".mp4") || lower.endsWith(".mov") || lower.includes("/video/")
}

export default async function HomePage() {
  let stars: number | null = null
  let mostDownloaded: { wallpaper: WallpaperItem; baseUrl: string; downloads: number } | null = null
  try {
    const res = await fetch(
      "https://api.github.com/repos/CAPlayground/CAPlayground",
      { next: { revalidate: 3600 }, headers: { Accept: "application/vnd.github+json" } }
    )
    if (res.ok) {
      const data = await res.json()
      stars = typeof data?.stargazers_count === "number" ? data.stargazers_count : null
    }
    try {
      const wallpapersRes = await fetch(
        "https://raw.githubusercontent.com/CAPlayground/wallpapers/refs/heads/main/wallpapers.json",
        {
          next: { revalidate: 1800 },
          headers: { Accept: "application/json" },
        }
      )

      if (wallpapersRes.ok) {
        const data = (await wallpapersRes.json()) as WallpapersResponse

        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (supabaseUrl && supabaseAnonKey && Array.isArray(data.wallpapers)) {
          const statsRes = await fetch(
            `${supabaseUrl}/rest/v1/wallpaper_stats?select=id,downloads&order=downloads.desc&limit=1`,
            {
              headers: {
                apikey: supabaseAnonKey,
                Authorization: `Bearer ${supabaseAnonKey}`,
              },
              cache: "no-store",
            }
          )

          if (statsRes.ok) {
            const stats = (await statsRes.json()) as Array<{ id: string; downloads: number }>
            if (Array.isArray(stats) && stats.length > 0) {
              const top = stats[0]
              const wallpaper = data.wallpapers.find((w) => String(w.id) === top.id)

              if (wallpaper) {
                mostDownloaded = {
                  wallpaper,
                  baseUrl: data.base_url,
                  downloads: top.downloads,
                }
              }
            }
          }
        }
      }
    } catch (e) {
      console.error(e)
    }
  } catch (e) {
    console.error(e)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="blob-cont">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <Navigation />

      <section className="relative w-full overflow-hidden pt-12 md:pt-16 lg:pt-24 pb-12 md:pb-16 lg:pb-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center animate-in fade-in-0 slide-in-from-bottom-6 duration-2000 ease-out fill-mode-forwards">
              <div className="space-y-8 text-center lg:text-left">
                <Link href="/projects">
                  <div className="inline-flex items-center justify-center lg:justify-start px-6 py-2.5 rounded-full glass-panel transition-all duration-200 hover:bg-white/15 hover:border-white/50 hover:shadow-xl cursor-pointer w-auto shadow-white/5">
                    <NotificationIcon className="h-4 w-4 text-accent mr-2" aria-hidden="true" />
                    <span className="text-accent font-sans font-medium text-sm">Les modes de fusion et les filtres sont sortis !</span>
                  </div>
                </Link>
                <h1 className="font-heading text-4xl min-[600px]:text-6xl lg:text-6xl font-bold text-foreground dark:text-white leading-tight mt-4">
                  <span className="hero-gradient">Créez des fonds d&apos;écran animés</span>
                  <br />
                  pour iOS/iPadOS depuis votre bureau.
                </h1>
                <p className="text-lg text-muted-foreground dark:text-white/70 max-w-xl mx-auto lg:mx-0">
                  Notre éditeur en ligne simplifie la création de fonds d&apos;écran en boucle.
                  Aucune application iOS ou Mac requise. Entièrement gratuit.
                </p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                  <Link href="/editor/new">
                    <Button
                      size="lg"
                      className="w-full h-12 text-base px-6 liquid-button bg-accent hover:bg-accent/90 text-white font-semibold shadow-xl shadow-accent/30 hover:shadow-accent/40 transition-all duration-300"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Commencer à créer
                    </Button>
                  </Link>
                  <Link href="https://github.com/CAPlayground/CAPlayground" target="_blank" rel="noopener noreferrer" className="w-full">
                    <Button size="lg" variant="outline" className="w-full h-12 text-base px-6 liquid-button bg-white/5 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/20 shadow-lg shadow-black/30 hover:bg-white/15 dark:hover:bg-white/15 text-foreground dark:text-white transition-all duration-300">
                      <Github className="h-4 w-4 mr-2" />
                      Voir sur GitHub
                      {stars !== null && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-accent/20 px-3 py-0.5 text-sm font-medium text-accent dark:text-accent/80">
                          <Star className="h-3 w-3 mr-1" />
                          {stars.toLocaleString()}
                        </span>
                      )}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-1/2 flex justify-center items-center relative animate-in fade-in-0 slide-in-from-bottom-6 duration-2000 ease-out fill-mode-forwards lg:order-last order-first">
              <div className="relative w-full max-w-lg mx-auto aspect-[9/19.5] glass-panel rounded-[3rem] p-3 shadow-2xl shadow-black/50 overflow-hidden">
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <Image
                    src="/hero.webp"
                    alt="Animated wallpaper preview"
                    fill
                    className="object-cover"
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className="w-full h-full rounded-[2rem] border-4 border-black/50 dark:border-white/50" />
                </div>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/4 h-6 rounded-b-xl bg-black/50 dark:bg-white/50 z-20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {mostDownloaded && (
        <section className="relative w-full overflow-hidden py-12 md:py-16 lg:py-24">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl mx-auto">
              <div className="w-full lg:w-1/2 flex justify-center items-center relative lg:order-first order-last">
                <Card className="w-full max-w-md mx-auto glass-card transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20">
                  <CardContent className="p-4">
                    <AspectRatio ratio={9 / 19.5} className="overflow-hidden rounded-xl">
                      {isVideo(mostDownloaded.wallpaper.preview) ? (
                        <video
                          src={`${mostDownloaded.baseUrl}/${mostDownloaded.wallpaper.file}/${mostDownloaded.wallpaper.preview}`}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="object-cover w-full h-full"
                          poster={
                            mostDownloaded.wallpaper.preview.replace(
                              /\.(mp4|mov)$/i,
                              ".jpg"
                            )
                          }
                        />
                      ) : (
                        <Image
                          src={`${mostDownloaded.baseUrl}/${mostDownloaded.wallpaper.file}/${mostDownloaded.wallpaper.preview}`}
                          alt={mostDownloaded.wallpaper.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      )}
                    </AspectRatio>
                    <div className="pt-4 space-y-2">
                      <h3 className="text-2xl font-semibold text-foreground dark:text-white">
                        {mostDownloaded.wallpaper.name}
                      </h3>
                      <p className="text-sm text-muted-foreground dark:text-white/70">
                        Par {mostDownloaded.wallpaper.creator}
                      </p>
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center text-accent font-medium">
                          <Download className="h-4 w-4 mr-1" />
                          <span>
                            {mostDownloaded.downloads.toLocaleString()} téléchargements
                          </span>
                        </div>
                        <Link href={`/wallpapers?id=${mostDownloaded.wallpaper.id}`}>
                          <Button size="sm" variant="outline" className="liquid-button">
                            Voir
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center lg:justify-start items-center">
                <div className="space-y-4 text-center lg:text-left">
                  <h2 className="font-heading text-3xl md:text-4xl lg:text-4xl font-bold text-foreground dark:text-white">
                    Le fond d&apos;écran le plus téléchargé
                  </h2>
                  <p className="text-lg text-muted-foreground dark:text-white/70 max-w-xl mx-auto lg:mx-0">
                    Voyez ce que la communauté préfère, puis plongez dans la galerie complète pour découvrir d&apos;autres fonds d&apos;écran animés pour vos appareils.
                  </p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-3 pt-2">
                    <Link href={`/wallpapers?id=${mostDownloaded.wallpaper.id}`}>
                      <Button 
                        size="lg" 
                        className="px-6 liquid-button text-white font-semibold shadow-xl shadow-accent/30 hover:shadow-accent/40 transition-all duration-300"
                      >
                        Voir ce fond d&apos;écran
                      </Button>
                    </Link>
                    <Link href="/wallpapers">
                      
                      <Button 
                        size="lg" 
                        variant="outline" 
                        className="px-6 liquid-button bg-white/5 dark:bg-white/10 backdrop-blur-xl border border-white/20 dark:border-white/20 shadow-lg shadow-black/30 hover:bg-white/15 dark:hover:bg-white/15 text-foreground dark:text-white transition-all duration-300"
                      >
                        Voir la galerie de fonds d&apos;écran
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      
      <Footer className="relative z-10 border-t border-white/10 glass-panel mt-auto" />
    </div>
  )
}
