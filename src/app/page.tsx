'use client'

import * as React from 'react'
import { useApp, initHistorySync } from '@/lib/store-app'
import { api } from '@/lib/api'
import type { Brand, Category, SiteSettings } from '@/lib/types'
import { Header } from '@/components/shared/Header'
import { Footer } from '@/components/shared/Footer'
import { CartDrawer } from '@/components/shared/CartDrawer'
import { Chatbot } from '@/components/shared/Chatbot'
import { HomeView } from '@/components/views/HomeView'
import { BrandView } from '@/components/views/BrandView'
import { CatalogView } from '@/components/views/CatalogView'
import { ProductDetailView } from '@/components/views/ProductDetailView'
import { RepsView } from '@/components/views/RepsView'
import { ContactView } from '@/components/views/ContactView'
import { AcademyView } from '@/components/views/AcademyView'
import { CoursePlayerView } from '@/components/views/CoursePlayerView'
import { BlogView } from '@/components/views/BlogView'
import { ArticleView } from '@/components/views/ArticleView'
import { AdminView } from '@/components/admin/AdminView'

export default function Page() {
  const view = useApp((s) => s.view)
  const [settings, setSettings] = React.useState<SiteSettings | null>(null)
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [categories, setCategories] = React.useState<Category[]>([])
  const [loading, setLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState<string | null>(null)

  const loadSite = React.useCallback(async () => {
    setLoading(true)
    setLoadError(null)

    try {
      const [s, b, c] = await Promise.all([
        api<SiteSettings>('/api/settings'),
        api<(Brand & { productsCount?: number })[]>('/api/brands'),
        api<Category[]>('/api/categories'),
      ])

      if (!s) throw new Error('As configuracoes do site nao foram encontradas.')
      if (!Array.isArray(b) || b.length === 0) {
        throw new Error('O banco esta sem marcas cadastradas.')
      }

      setSettings(s)
      setBrands(b)
      setCategories(c)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Falha ao carregar os dados do site.'
      console.error('[Aladdin] erro na inicializacao:', error)
      setLoadError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  React.useEffect(() => {
    void loadSite()
  }, [loadSite])

  React.useEffect(() => {
    // Makes the browser/device back button (and swipe-back gestures) move
    // between the app's own screens instead of leaving the site.
    initHistorySync()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f7f6f2] px-6 text-center">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-neutral-900/20 border-t-neutral-900" />
        <div>
          <p className="text-base font-medium text-neutral-900">Carregando Aladdin Distribuidora…</p>
          <p className="mt-1 text-sm text-neutral-500">Preparando catalogos e configuracoes.</p>
        </div>
      </div>
    )
  }

  if (loadError || !settings || brands.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f6f2] px-6">
        <div className="w-full max-w-xl rounded-3xl border border-black/10 bg-white p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-950 text-xl text-white">A</div>
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-950">Nao foi possivel carregar o site</h1>
          <p className="mt-3 text-base leading-7 text-neutral-600">
            {loadError ?? 'O banco local ainda nao possui os dados iniciais.'}
          </p>
          <p className="mt-3 text-sm leading-6 text-neutral-500">
            Feche o servidor, execute <strong>npm run setup</strong> uma vez e depois <strong>npm run dev</strong>.
          </p>
          <button
            type="button"
            onClick={() => void loadSite()}
            className="mt-6 rounded-xl bg-neutral-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header brands={brands} />

      <main className="flex-1">
        {view.name === 'home' && <HomeView settings={settings} brands={brands} />}
        {view.name === 'brand' && <BrandView brandSlug={view.brandSlug} />}
        {view.name === 'catalog' && (
          <CatalogView
            brands={brands}
            categories={categories}
            initialBrandSlug={view.brandSlug}
            initialCategorySlug={view.categorySlug}
          />
        )}
        {view.name === 'product' && <ProductDetailView productSlug={view.productSlug} brands={brands} />}
        {view.name === 'reps' && <RepsView />}
        {view.name === 'contact' && <ContactView settings={settings} />}
        {view.name === 'academy' && <AcademyView />}
        {view.name === 'course' && <CoursePlayerView courseSlug={view.courseSlug} />}
        {view.name === 'blog' && <BlogView />}
        {view.name === 'article' && <ArticleView articleSlug={view.articleSlug} />}
        {view.name === 'admin' && <AdminView />}
      </main>

      <Footer settings={settings} />
      <CartDrawer />
      <Chatbot whatsapp={settings.whatsapp} />
    </div>
  )
}
