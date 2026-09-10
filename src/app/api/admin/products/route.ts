import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const products = await db.product.findMany({
    include: { brand: true, category: true },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
  })
  return NextResponse.json(products.map(serializeProduct))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.name)
  const product = await db.product.create({
    data: {
      name: body.name,
      slug,
      brandId: body.brandId,
      categoryId: body.categoryId || null,
      price: Number(body.price ?? 0),
      oldPrice: body.oldPrice ? Number(body.oldPrice) : null,
      quantity: Number(body.quantity ?? 0),
      minQuantity: Number(body.minQuantity ?? 1),
      unit: body.unit ?? null,
      description: body.description ?? null,
      images: JSON.stringify(Array.isArray(body.images) ? body.images.slice(0, 6) : []),
      showPrice: body.showPrice ?? true,
      featured: !!body.featured,
      active: body.active ?? true,
      order: body.order ?? 0,
    },
    include: { brand: true, category: true },
  })
  return NextResponse.json(serializeProduct(product))
}
