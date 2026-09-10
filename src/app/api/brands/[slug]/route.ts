import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeBrand } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const brand = await db.brand.findUnique({
    where: { slug },
    include: {
      products: {
        where: { active: true },
        include: { category: true },
        orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
      },
      videos: { orderBy: { order: 'asc' } },
    },
  })
  if (!brand) return NextResponse.json({ error: 'Marca não encontrada' }, { status: 404 })

  // Pull distinct categories used by this brand's products
  const cats = await db.category.findMany({
    where: { products: { some: { brandId: brand.id, active: true } } },
    orderBy: { order: 'asc' },
  })

  return NextResponse.json({
    ...serializeBrand(brand),
    products: brand.products.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      categoryId: p.categoryId,
      categoryName: p.category?.name ?? null,
      categorySlug: p.category?.slug ?? null,
      price: p.price,
      oldPrice: p.oldPrice,
      showPrice: p.showPrice ?? true,
      unit: p.unit,
      image: (() => {
        try { return JSON.parse(p.images)?.[0] ?? null } catch { return null }
      })(),
      featured: p.featured,
    })),
    videos: brand.videos.map((v) => ({
      id: v.id,
      title: v.title,
      youtubeUrl: v.youtubeUrl,
      thumbnail: v.thumbnail,
      order: v.order,
    })),
    categories: cats.map((c) => ({ id: c.id, name: c.name, slug: c.slug, order: c.order })),
  })
}
