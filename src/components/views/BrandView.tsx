'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { api } from '@/lib/api'
import type { BrandDetail } from '@/lib/types'
import { BrandTheme } from '@/components/shared/BrandTheme'
import { ProductCard } from '@/components/shared/ProductCard'
import { BackBar } from '@/components/shared/BackBar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { YouTubeIcon } from '@/components/icons/SocialIcons'
import { youtubeId, youtubeThumb } from '@/lib/format'
import {
  Search, Play, X, Tag, Package, ChevronDown, ShoppingBag, FileText, Users,
} from 'lucide-react'

export function BrandView({ brandSlug }: { brandSlug: string }) {
  const navigate = useApp((s) => s.navigate)
  const [brand, setBrand] = React.useState<BrandDetail | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState('')
  const [catSlug, setCatSlug] = React.useState<string | null>(null)
  const [activeVideo, setActiveVideo] = React.useState<string | null>(null)
  const [openProducts, setOpenProducts] = React.useState(false)
  const [openCategories, setOpenCategories] = React.useState(false)

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
      <section
        className="relative overflow-hidden border-b border-white/10 text-white"
        style={{ background: `linear-gradient(128deg, ${brand.primaryColor} 0%, ${brand.primaryColor}e8 46%, ${brand.accentColor}c9 145%)` }}
      >
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)',
              backgroundSize: '44px 44px',
              maskImage: 'linear-gradient(to bottom, black, transparent 92%)',
            }}
          />
          <div className="absolute -right-16 -top-28 h-96 w-96 rounded-full border border-white/20" />
          <div className="absolute right-[22%] top-[-8rem] h-80 w-80 rounded-full bg-white/12 blur-3xl" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 md:pb-16 md:pt-8">
          <BackBar label="Voltar" onBack={() => navigate({ name: 'home' })} tone="dark" />

          <div className="mt-6 flex flex-col gap-8 md:mt-10 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/85 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Catálogo exclusivo · {brand.name}
              </div>
              <h1 className="font-serif text-4xl font-bold leading-[0.95] tracking-tight sm:text-6xl md:text-7xl">
                {brand.name}
              </h1>
              <p className="mt-4 max-w-xl text-base text-white/90 sm:text-xl">{brand.tagline}</p>
              {brand.description && (
                <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/72 sm:text-base">{brand.description}</p>
              )}
            </div>

            <div className="flex shrink-0 gap-3 rounded-2xl border border-white/20 bg-black/15 p-4 backdrop-blur-md sm:gap-6 sm:p-5">
              <div className="text-left">
                <div className="font-serif text-2xl font-bold sm:text-3xl">{brand.products.length}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/65">produtos</div>
              </div>
              <div className="w-px bg-white/20" />
              <div className="text-left">
                <div className="font-serif text-2xl font-bold sm:text-3xl">{brand.categories.length}</div>
                <div className="text-[11px] uppercase tracking-wider text-white/65">categorias</div>
              </div>
              {brand.videos.length > 0 && (
                <>
                  <div className="w-px bg-white/20" />
                  <div className="text-left">
                    <div className="font-serif text-2xl font-bold sm:text-3xl">{brand.videos.length}</div>
                    <div className="text-[11px] uppercase tracking-wider text-white/65">vídeos</div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {/* How to order tip */}
        <div className="mb-6 flex gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:items-center sm:p-5">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#111] text-white">
            <ShoppingBag className="h-4.5 w-4.5 h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1 text-sm leading-relaxed text-muted-foreground">
            <span className="font-medium text-foreground">Como pedir: </span>
            toque no <strong className="text-foreground">+</strong> para adicionar à sacola,
            abra a sacola, <strong className="text-foreground">gere o PDF</strong> do pedido e
            envie para o seu <strong className="text-foreground">representante</strong>.
          </div>
          <button
            type="button"
            onClick={() => navigate({ name: 'reps' })}
            className="hidden shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-muted sm:inline-flex"
          >
            <Users className="h-3.5 w-3.5" /> Representantes
          </button>
        </div>

        <div className="grid gap-5 md:grid-cols-[240px_1fr]">
          {/* Sidebar accordion */}
          <aside className="md:sticky md:top-20 md:self-start">
            <div className="overflow-hidden rounded-2xl border border-border bg-card">
              <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                <Package className="h-4 w-4" style={{ color: brand.primaryColor }} />
                <span className="font-serif text-base font-bold">{brand.name}</span>
              </div>

              {/* Produtos accordion */}
              <button
                type="button"
                onClick={() => setOpenProducts((v) => !v)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-muted/60"
              >
                <Package className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Produtos
                </span>
                <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {brand.products.length}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${openProducts ? 'rotate-180' : ''}`}
                />
              </button>
              {openProducts && (
                <ul className="max-h-40 space-y-0.5 overflow-y-auto overscroll-contain border-t border-border/60 px-2 pb-3 pt-1 scroll-area sm:max-h-48">
                  {brand.products.slice(0, 20).map((p) => (
                    <li key={p.id}>
                      <button
                        onClick={() => navigate({ name: 'product', productSlug: p.slug })}
                        className="block w-full truncate rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted"
                      >
                        {p.name}
                      </button>
                    </li>
                  ))}
                  {brand.products.length > 20 && (
                    <li className="px-2.5 pt-1 text-xs text-muted-foreground">
                      +{brand.products.length - 20} produtos…
                    </li>
                  )}
                </ul>
              )}

              {/* Categorias accordion */}
              <button
                type="button"
                onClick={() => setOpenCategories((v) => !v)}
                className="flex w-full items-center gap-2 border-t border-border px-4 py-3 text-left transition-colors hover:bg-muted/60"
              >
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="flex-1 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Categorias
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${openCategories ? 'rotate-180' : ''}`}
                />
              </button>
              {openCategories && (
                <ul className="max-h-40 space-y-0.5 overflow-y-auto overscroll-contain border-t border-border/60 px-2 pb-3 pt-1 scroll-area sm:max-h-48">
                  <li>
                    <button
                      onClick={() => setCatSlug(null)}
                      className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted ${catSlug === null ? 'font-semibold' : ''}`}
                      style={catSlug === null ? { color: brand.primaryColor } : undefined}
                    >
                      Todas
                    </button>
                  </li>
                  {brand.categories.map((c) => (
                    <li key={c.id}>
                      <button
                        onClick={() => setCatSlug(c.slug)}
                        className={`block w-full rounded-lg px-2.5 py-2 text-left text-sm transition-colors hover:bg-muted ${catSlug === c.slug ? 'font-semibold' : ''}`}
                        style={catSlug === c.slug ? { color: brand.primaryColor } : undefined}
                      >
                        {c.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          {/* Main */}
          <div>
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-serif text-xl font-bold">
                {catSlug
                  ? brand.categories.find((c) => c.slug === catSlug)?.name
                  : 'Todos os produtos'}
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({products.length})
                </span>
              </h2>
              <div className="relative w-full sm:w-64">
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
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
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

            {brand.videos.length > 0 && (
              <div className="mt-12">
                <div className="mb-4 flex items-center gap-2">
                  <YouTubeIcon size={22} style={{ color: '#FF0000' }} />
                  <h2 className="font-serif text-xl font-bold">
                    Vídeos da {brand.name}
                  </h2>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
                  {brand.videos.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveVideo(v.youtubeUrl)}
                      className="card-hover group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted"
                    >
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
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {activeVideo && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 p-4"
          onClick={() => setActiveVideo(null)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl bg-black"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-2 top-2 z-10 grid h-9 w-9 place-items-center rounded-full bg-black/70 text-white"
              onClick={() => setActiveVideo(null)}
            >
              <X className="h-5 w-5" />
            </button>
            <div className="aspect-video">
              <iframe
                title="Vídeo"
                src={`https://www.youtube.com/embed/${youtubeId(activeVideo)}?autoplay=1`}
                className="h-full w-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </BrandTheme>
  )
}
