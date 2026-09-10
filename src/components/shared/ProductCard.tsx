'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { useCart } from '@/lib/store-cart'
import { formatCurrency } from '@/lib/format'
import { ShoppingBag, Eye } from 'lucide-react'

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
  const secondImage = images?.[1] ?? null
  const shown = hover && secondImage ? secondImage : image
  const glow = brandColor ?? '#C9A227'

  return (
    <article
      className="product-card-premium group relative flex cursor-pointer flex-col overflow-hidden rounded-[1.75rem] border border-black/8 bg-card p-4 sm:p-5"
      style={{ '--card-glow': glow } as React.CSSProperties}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => navigate({ name: 'product', productSlug: slug })}
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
        {shown ? (
           
          <img
            src={shown}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted-foreground">
            <span className="text-xs">Sem imagem</span>
          </div>
        )}

        {/* Diagonal shine sweep on hover */}
        <div className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-all duration-700 ease-out group-hover:translate-x-full group-hover:opacity-100" />

        {featured && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-500 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
            Destaque
          </span>
        )}

        {showPrice && oldPrice && oldPrice > price && (
          <span className="absolute right-2.5 top-2.5 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            -{Math.round((1 - price / oldPrice) * 100)}%
          </span>
        )}

        {images && images.length > 1 && (
          <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            1/{images.length}
          </span>
        )}

        {/* Hover actions */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex translate-y-2 justify-center gap-2 p-2.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-background/95 px-3.5 py-2 text-xs font-medium text-foreground shadow-md backdrop-blur transition-colors hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.stopPropagation()
              navigate({ name: 'product', productSlug: slug })
            }}
          >
            <Eye className="h-3.5 w-3.5" /> Ver
          </button>
          <button
            className="pointer-events-auto inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-medium text-primary-foreground shadow-md transition-colors hover:bg-primary/90"
            onClick={(e) => {
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
            }}
          >
            <ShoppingBag className="h-3.5 w-3.5" /> Adicionar
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        {brandName && (
          <div className="mb-1.5 flex items-center gap-1.5">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: brandColor ?? '#111111' }}
            />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {brandName}
            </span>
          </div>
        )}
        <h3 className="line-clamp-2 text-base font-medium leading-snug text-foreground">
          {name}
        </h3>
        {description && (
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            {showPrice ? (
              <>
                {showPrice && oldPrice && oldPrice > price && (
                  <div className="text-sm text-muted-foreground line-through">
                    {formatCurrency(oldPrice)}
                  </div>
                )}
                <div className="font-serif text-2xl font-bold leading-none tracking-tight">
                  {formatCurrency(price)}
                </div>
              </>
            ) : (
              <div className="inline-flex rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Valor sob consulta
              </div>
            )}
            {minQuantity > 1 && (
              <div className="mt-1 text-xs text-muted-foreground">
                Mín. {minQuantity} un.
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}
