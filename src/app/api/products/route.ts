import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const brandSlug = searchParams.get('brand')
  const categorySlug = searchParams.get('category')
  const q = searchParams.get('q')?.trim()
  const featured = searchParams.get('featured')
  const limit = parseInt(searchParams.get('limit') || '0', 10) || undefined

  const where: any = { active: true }
  if (brandSlug) where.brand = { slug: brandSlug }
  if (categorySlug) where.category = { slug: categorySlug }
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { description: { contains: q } },
      { brand: { name: { contains: q } } },
    ]
  }
  if (featured === '1') where.featured = true

  const products = await db.product.findMany({
    where,
    include: { brand: true, category: true },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    take: limit,
  })
  return NextResponse.json(products.map(serializeProduct))
}
