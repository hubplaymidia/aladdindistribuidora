'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { useCart } from '@/lib/store-cart'
import { formatCurrency } from '@/lib/format'
import { ShoppingBag, Plus } from 'lucide-react'

type CardProps = {
  id: string
  name: string
  slug: string
  image: string | null
  images?: string[]
  price: number
  oldPrice?: number | null
  showPrice?: boolean
  brandName?: string | null
  brandColor?: string | null
  minQuantity?: number
  description?: string
  featured?: boolean
}

export function ProductCard({
  id,
  name,
  slug,
  image,
  images,
  price,
  oldPrice,
  showPrice = true,
  brandName,
  brandColor,
  minQuantity = 1,
  description,
  featured,
}: CardProps) {
  const navigate = useApp((s) => s.navigate)
  const add = useCart((s) => s.add)
  const [hover, setHover] = React.useState(false)
  const [added, setAdded] = React.useState(false)
  const secondImage = images?.[1] ?? null
  const shown = hover && secondImage ? secondImage : image
  const glow = brandColor ?? '#C9A227'

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation()
    add({
      productId: id,
      slug,
      name,
      brandName: brandName ?? 'Aladdin',
      price,
      showPrice,
      image: image ?? '',
      minQuantity,
    })
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1100)
  }

  return (
    <article
      className="product-card-premium group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-black/[0.06] bg-card"
      style={{ '--card-glow': glow } as React.CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate({ name: 'product', productSlug: slug })}
    >
      {/* Image — square, no overlay buttons */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        {shown ? (
          <img
            src={shown}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-xs">Sem imagem</span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />

        {featured && (
          <span className="absolute left-2 top-2 rounded-md bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white shadow">
            Destaque
          </span>
        )}

        {showPrice && oldPrice && oldPrice > price && (
          <span className="absolute right-2 top-2 rounded-md bg-red-500 px-2 py-0.5 text-[9px] font-bold text-white shadow">
            -{Math.round((1 - price / oldPrice) * 100)}%
          </span>
        )}
      </div>

      {/* Body — info + add button OUTSIDE the photo */}
      <div className="flex flex-1 flex-col gap-2 p-3 sm:p-3.5">
        {brandName && (
          <div className="flex items-center gap-1.5">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full"
              style={{ background: brandColor ?? '#111' }}
            />
            <span className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {brandName}
            </span>
          </div>
        )}

        <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-snug text-foreground sm:text-sm">
          {name}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 pt-1">
          <div className="min-w-0">
            {showPrice ? (
              <>
                {oldPrice && oldPrice > price && (
                  <div className="text-[11px] text-muted-foreground line-through">
                    {formatCurrency(oldPrice)}
                  </div>
                )}
                <div className="font-serif text-base font-bold leading-none tracking-tight sm:text-lg">
                  {formatCurrency(price)}
                </div>
              </>
            ) : (
              <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                Sob consulta
              </div>
            )}
            {minQuantity > 1 && (
              <div className="mt-0.5 text-[10px] text-muted-foreground">
                Mín. {minQuantity} un.
              </div>
            )}
          </div>

          <button
            aria-label="Adicionar à sacola"
            title="Adicionar à sacola"
            className={`grid h-10 w-10 shrink-0 place-items-center rounded-full shadow-md transition-all duration-200 hover:scale-110 active:scale-95 ${
              added
                ? 'bg-emerald-500 text-white'
                : 'bg-[#111] text-white hover:bg-[#2a2a2a]'
            }`}
            onClick={handleAdd}
          >
            {added ? (
              <span className="text-sm font-bold">✓</span>
            ) : (
              <Plus className="h-5 w-5" strokeWidth={2.4} />
            )}
          </button>
        </div>
      </div>
    </article>
  )
}
