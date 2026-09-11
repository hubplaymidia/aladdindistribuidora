'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { useCart } from '@/lib/store-cart'
import { api } from '@/lib/api'
import type { Product, Brand } from '@/lib/types'
import { ProductCard } from '@/components/shared/ProductCard'
import { BrandTheme } from '@/components/shared/BrandTheme'
import { BackBar } from '@/components/shared/BackBar'
import { Button } from '@/components/ui/button'
import { formatCurrency } from '@/lib/format'
import { ShoppingBag, Minus, Plus, Check, Truck, ShieldCheck, Star } from 'lucide-react'

export function ProductDetailView({
  productSlug,
  brands,
}: {
  productSlug: string
  brands: Brand[]
}) {
  const navigate = useApp((s) => s.navigate)
  const add = useCart((s) => s.add)
  const [product, setProduct] = React.useState<Product | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeImg, setActiveImg] = React.useState(0)
  const [qty, setQty] = React.useState(1)
  const [added, setAdded] = React.useState(false)

  React.useEffect(() => {
    setLoading(true)
    setActiveImg(0)
    setQty(1)
    setAdded(false)
    api<{ related?: Product[] } & Product>(`/api/products/${productSlug}`)
      .then((p) => {
        setProduct(p)
        if (p.minQuantity) setQty(p.minQuantity)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [productSlug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        Carregando produto…
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Produto não encontrado.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'catalog' })}>
          Ver catálogo
        </Button>
      </div>
    )
  }

  const brand = brands.find((b) => b.id === product.brandId)
  const images = product.images?.length ? product.images : ['/products/placeholder-hair-1.jpg']
  const related = product.related ?? []

  const handleAdd = () => {
    add({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      brandName: product.brandName ?? 'Aladdin',
      price: product.price,
      showPrice: product.showPrice,
      image: images[0],
      minQuantity: product.minQuantity,
    }, qty)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  // Wrap in brand theme if we know the brand
  const content = (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BackBar
        label={brand ? `Catálogo ${brand.name}` : 'Catálogo'}
        onBack={() => navigate(brand ? { name: 'brand', brandSlug: brand.slug } : { name: 'catalog' })}
      />

      <div className="grid gap-8 md:grid-cols-2">
        {/* Gallery */}
        <div>
          <div className="frame-premium aspect-square">
            { }
            <img
              src={images[activeImg]}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto scroll-area pb-1">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative aspect-square w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${activeImg === i ? 'border-primary' : 'border-transparent hover:border-border'}`}
                >
                  { }
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          {brand && (
            <button
              onClick={() => navigate({ name: 'brand', brandSlug: brand.slug })}
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider"
              style={{ color: brand.primaryColor }}
            >
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: brand.primaryColor }}
              />
              {brand.name}
            </button>
          )}
          <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-3">
            {product.showPrice ? (
              <>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCurrency(product.oldPrice)}
                  </span>
                )}
                <span className="font-serif text-3xl font-bold">
                  {formatCurrency(product.price)}
                </span>
                {product.oldPrice && product.oldPrice > product.price && (
                  <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-bold text-white">
                    -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                  </span>
                )}
              </>
            ) : (
              <span className="inline-flex rounded-full border border-border bg-muted/70 px-4 py-2 text-sm font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Valor sob consulta
              </span>
            )}
          </div>

          {product.unit && (
            <div className="mt-1 text-sm text-muted-foreground">Embalagem: {product.unit}</div>
          )}

          {product.description && (
            <p className="mt-5 leading-relaxed text-foreground/90">{product.description}</p>
          )}

          {/* Quantity + add */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
              <button
                onClick={() => setQty((q) => Math.max(product.minQuantity, q - 1))}
                disabled={qty <= product.minQuantity}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted disabled:opacity-40"
                aria-label="Diminuir"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center font-medium">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid h-9 w-9 place-items-center rounded-full transition-colors hover:bg-muted"
                aria-label="Aumentar"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="lg"
              onClick={handleAdd}
              className={added ? 'bg-rose-600 hover:bg-rose-600 text-white' : ''}
            >
              {added ? (
                <>
                  <Check className="mr-1.5 h-5 w-5" /> Adicionado!
                </>
              ) : (
                <>
                  <ShoppingBag className="mr-1.5 h-5 w-5" /> Adicionar à sacola
                </>
              )}
            </Button>
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {product.showPrice ? (
              <>Subtotal: <strong className="text-foreground">{formatCurrency(product.price * qty)}</strong></>
            ) : (
              <>Valor: <strong className="text-foreground">sob consulta</strong></>
            )}
            {product.minQuantity > 1 && ` · Mín. ${product.minQuantity} un.`}
          </div>

          {/* Trust badges */}
          <div className="mt-8 grid gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <Trust icon={<ShieldCheck className="h-4 w-4" />} title="Produto original" desc="Direto da marca" />
            <Trust icon={<Truck className="h-4 w-4" />} title="Entrega GO + DF" desc="Consulte prazos" />
            <Trust icon={<Star className="h-4 w-4" />} title="+9 anos" desc="de experiência" />
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-bold">Produtos relacionados</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {related.map((p) => (
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
        </section>
      )}
    </div>
  )

  return brand ? (
    <BrandTheme brand={brand} className="min-h-screen">
      {content}
    </BrandTheme>
  ) : (
    content
  )
}

function Trust({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-muted text-foreground">
        {icon}
      </span>
      <div className="leading-tight">
        <div className="text-sm font-medium">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  )
}
