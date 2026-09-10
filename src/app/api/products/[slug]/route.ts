import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const product = await db.product.findUnique({
    where: { slug },
    include: { brand: true, category: true },
  })
  if (!product) return NextResponse.json({ error: 'Produto não encontrado' }, { status: 404 })

  // Related: same brand, exclude self
  const related = await db.product.findMany({
    where: { brandId: product.brandId, id: { not: product.id }, active: true },
    include: { brand: true, category: true },
    take: 4,
    orderBy: { featured: 'desc' },
  })

  return NextResponse.json({
    ...serializeProduct(product),
    related: related.map(serializeProduct),
  })
}
