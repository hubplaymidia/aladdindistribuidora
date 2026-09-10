import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeBrand } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const brands = await db.brand.findMany({
    orderBy: { order: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  return NextResponse.json(
    brands.map((b) => ({ ...serializeBrand(b), productsCount: b._count.products }))
  )
}
