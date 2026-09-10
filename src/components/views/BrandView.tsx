'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { api } from '@/lib/api'
import type { BrandDetail } from '@/lib/types'
import { BrandTheme } from '@/components/shared/BrandTheme'
import { ProductCard } from '@/components/shared/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { YouTubeIcon } from '@/components/icons/SocialIcons'
import { youtubeEmbed, youtubeId, youtubeThumb } from '@/lib/format'
import {
  ChevronLeft, Search, Play, X, ArrowLeft, Tag, Package,
} from 'lucide-react'

export function BrandView({ brandSlug }: { brandSlug: string }) {
  const navigate = useApp((s) => s.navigate)
  const [brand, setBrand] = React.useState<BrandDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState('')
  const [catSlug, setCatSlug] = React.useState<string | null>(null)
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLoading(true)
    api<BrandDetail>(`/api/brands/${brandSlug}`)
      .then(setBrand)
      .catch(() => setBrand(null))
      .finally(() => setLoading(false))
  }, [brandSlug])

  const products = React.useMemo(() => {
    if (!brand) return []
    let list = brand.products
    if (catSlug) list = list.filter((p) => p.categorySlug === catSlug)
    if (q.trim()) {
      const t = q.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(t))
    }
    return list
  }, [brand, catSlug, q])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        Carregando catálogo…
      </div>
    )
  }

  if (!brand) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Marca não encontrada.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'home' })}>
          Voltar ao início
        </Button>
      </div>
    )
  }

  return (
    <BrandTheme brand={brand} className="min-h-screen">
      {/* Brand hero strip — abstract identity, no product imagery */}
      <section
        className="relative overflow-hidden border-b border-white/10 text-white"
        style={{ background: `linear-gradient(118deg, ${brand.primaryColor} 0%, ${brand.primaryColor}e8 54%, ${brand.accentColor}c9 145%)` }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-14 -top-24 h-80 w-80 rounded-full border border-white/20" />
          <div className="absolute right-[18%] top-[-7rem] h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute inset-y-0 left-[62%] w-px bg-white/12" />
          <div className="absolute inset-y-0 left-[76%] w-px bg-white/8" />
          <div className="absolute bottom-[-7rem] left-[42%] h-64 w-64 rounded-full bg-black/15 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-7xl items-end gap-6 px-4 py-14 sm:px-6 md:py-20">
          <button
            onClick={() => navigate({ name: 'home' })}
            className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/15 px-3 py-1.5 text-xs text-white backdrop-blur transition-colors hover:bg-black/25"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Voltar
          </button>
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur">
              Catálogo exclusivo · {brand.name}
            </div>
            <h1 className="font-serif text-4xl font-bold leading-none tracking-tight sm:text-6xl">
              {brand.name}
            </h1>
            <p className="mt-3 text-base text-white/85 sm:text-xl">{brand.tagline}</p>
            {brand.description && (
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/72 sm:text-base">{brand.description}</p>
            )}
          </div>
        </div>
      </section>

      {/* Body: left sidebar + products */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 md:grid-cols-[260px_1fr]">
          {/* Left sidebar */}
          <aside className="md:sticky md:top-20 md:self-start">
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" style={{ color: brand.primaryColor }} />
                <span className="font-serif text-lg font-bold">{brand.name}</span>
              </div>
              <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Produtos
              </div>
              <ul className="space-y-0.5 text-sm">
                {brand.products.slice(0, 12).map((p) => (
                  <li key={p.id}>
                    <button
                      onClick={() => navigate({ name: 'product', productSlug: p.slug })}
                      className="block w-full truncate rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted"
                    >
                      {p.name}
                    </button>
                  </li>
                ))}
                {brand.products.length > 12 && (
                  <li className="px-2 pt-1 text-xs text-muted-foreground">
                    +{brand.products.length - 12} produtos…
                  </li>
                )}
              </ul>

              <div className="mt-5 mb-2 flex items-center gap-2 border-t border-border pt-4">
                <Tag className="h-4 w-4" style={{ color: brand.accentColor }} />
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Categorias
                </span>
              </div>
              <ul className="space-y-0.5 text-sm">
                <li>
                  <button
                    onClick={() => setCatSlug(null)}
                    className={`block w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted ${catSlug === null ? 'font-semibold' : ''}`}
                    style={catSlug === null ? { color: brand.primaryColor } : undefined}
                  >
                    Todas
                  </button>
                </li>
                {brand.categories.map((c) => (
                  <li key={c.id}>
                    <button
                      onClick={() => setCatSlug(c.slug)}
                      className={`block w-full rounded-md px-2 py-1.5 text-left transition-colors hover:bg-muted ${catSlug === c.slug ? 'font-semibold' : ''}`}
                      style={catSlug === c.slug ? { color: brand.primaryColor } : undefined}
                    >
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Main: search + grid */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-serif text-xl font-bold">
                {catSlug
                  ? brand.categories.find((c) => c.slug === catSlug)?.name
                  : 'Todos os produtos'}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({products.length})
                </span>
              </h2>
              <div className="relative w-48 sm:w-64">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  placeholder="Buscar nesta marca…"
                  className="h-9 pl-8"
                />
              </div>
            </div>

            {products.length === 0 ? (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                Nenhum produto encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
                {products.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    image={p.image}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    showPrice={p.showPrice}
                    brandName={brand.name}
                    brandColor={brand.primaryColor}
                    minQuantity={1}
                  />
                ))}
              </div>
            )}

            {/* Brand videos */}
            {brand.videos.length > 0 && (
              <div className="mt-12">
                <div className="mb-4 flex items-center gap-2">
                  <YouTubeIcon size={22} style={{ color: '#FF0000' }} />
                  <h2 className="font-serif text-xl font-bold">
                    Vídeos da {brand.name}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {brand.videos.map((v) => {
                    const id = youtubeId(v.youtubeUrl)
                    return (
                      <button
                        key={v.id}
                        onClick={() => setActiveVideo(v.youtubeUrl)}
                        className="card-hover group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
                      >
                        { }
                        <img
                          src={youtubeThumb(v.youtubeUrl)}
                          alt={v.title}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-colors group-hover:bg-black/40">
                          <span className="grid h-10 w-10 place-items-center rounded-full bg-red-600 text-white shadow-lg transition-transform group-hover:scale-110">
                            <Play className="h-4 w-4 translate-x-0.5 fill-white" />
                          </span>
                        </div>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-left text-xs font-medium text-white">
                          <div className="line-clamp-2">{v.title}</div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Video modal */}
      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveVideo(null)}
              aria-label="Fechar"
              className="absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
            <iframe
              src={youtubeEmbed(activeVideo) + '?autoplay=1'}
              title="Vídeo da marca"
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </BrandTheme>
  )
}
