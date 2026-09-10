'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { api } from '@/lib/api'
import type { Brand, Category, Product } from '@/lib/types'
import { ProductCard } from '@/components/shared/ProductCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { ChevronLeft, Search, SlidersHorizontal, X } from 'lucide-react'

export function CatalogView({
  brands,
  categories,
  initialBrandSlug,
  initialCategorySlug,
}: {
  brands: Brand[]
  categories: Category[]
  initialBrandSlug?: string
  initialCategorySlug?: string
}) {
  const navigate = useApp((s) => s.navigate)
  const [products, setProducts] = React.useState<Product[]>([])
  const [loading, setLoading] = React.useState(true)
  const [brand, setBrand] = React.useState<string>(initialBrandSlug || 'all')
  const [cat, setCat] = React.useState<string>(initialCategorySlug || 'all')
  const [q, setQ] = React.useState('')
  const [sort, setSort] = React.useState('relevancia')
  const [showFilters, setShowFilters] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (brand !== 'all') params.set('brand', brand)
    if (cat !== 'all') params.set('category', cat)
    if (q.trim()) params.set('q', q.trim())
    api<Product[]>(`/api/products?${params.toString()}`)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [brand, cat, q])

  const sorted = React.useMemo(() => {
    const arr = [...products]
    switch (sort) {
      case 'price-asc':
        return arr.sort((a, b) => a.price - b.price)
      case 'price-desc':
        return arr.sort((a, b) => b.price - a.price)
      case 'name':
        return arr.sort((a, b) => a.name.localeCompare(b.name))
      default:
        return arr.sort((a, b) => Number(b.featured) - Number(a.featured))
    }
  }, [products, sort])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate({ name: 'home' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Início
      </button>

      <header className="mb-6">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Catálogo de Produtos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Todos os produtos das nossas marcas. Use os filtros para encontrar o que precisa.
        </p>
      </header>

      {/* Toolbar */}
      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[180px] flex-1">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar produto…"
            className="pl-8"
          />
        </div>
        <Select value={brand} onValueChange={setBrand}>
          <SelectTrigger className="w-[160px] sm:w-[180px]">
            <SelectValue placeholder="Marca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as marcas</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.slug}>
                {b.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={cat} onValueChange={setCat}>
          <SelectTrigger className="w-[160px] sm:w-[180px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.slug}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Ordenar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevancia">Relevância</SelectItem>
            <SelectItem value="price-asc">Menor preço</SelectItem>
            <SelectItem value="price-desc">Maior preço</SelectItem>
            <SelectItem value="name">Nome A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Active filters */}
      {(brand !== 'all' || cat !== 'all' || q) && (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          {brand !== 'all' && (
            <FilterChip
              label={brands.find((b) => b.slug === brand)?.name || brand}
              onClear={() => setBrand('all')}
            />
          )}
          {cat !== 'all' && (
            <FilterChip
              label={categories.find((c) => c.slug === cat)?.name || cat}
              onClear={() => setCat('all')}
            />
          )}
          {q && <FilterChip label={`"${q}"`} onClear={() => setQ('')} />}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
          Nenhum produto encontrado com esses filtros.
        </div>
      ) : (
        <>
          <div className="mb-3 text-sm text-muted-foreground">
            {sorted.length} produto{sorted.length > 1 ? 's' : ''} encontrado{sorted.length > 1 ? 's' : ''}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {sorted.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                slug={p.slug}
                image={p.images?.[0] ?? null}
                images={p.images}
                price={p.price}
                oldPrice={p.oldPrice}
                showPrice={p.showPrice}
                brandName={p.brandName}
                brandColor={p.brandColor}
                minQuantity={p.minQuantity}
                description={p.description}
                featured={p.featured}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function FilterChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <Badge variant="secondary" className="gap-1.5 rounded-full py-1 pl-3 pr-1.5">
      {label}
      <button
        onClick={onClear}
        aria-label="Remover filtro"
        className="grid h-4 w-4 place-items-center rounded-full hover:bg-foreground/10"
      >
        <X className="h-3 w-3" />
      </button>
    </Badge>
  )
}
