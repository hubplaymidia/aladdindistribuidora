import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeProduct, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  for (const k of [
    'name', 'brandId', 'categoryId', 'unit', 'description',
  ]) {
    if (k in body) data[k] = body[k]
  }
  if (data.name) data.slug = body.slug?.toString() || slugify(data.name)
  if ('price' in body) data.price = Number(body.price)
  if ('oldPrice' in body) data.oldPrice = body.oldPrice ? Number(body.oldPrice) : null
  if ('quantity' in body) data.quantity = Number(body.quantity)
  if ('minQuantity' in body) data.minQuantity = Number(body.minQuantity)
  if ('images' in body) data.images = JSON.stringify((Array.isArray(body.images) ? body.images : []).slice(0, 6))
  if ('showPrice' in body) data.showPrice = !!body.showPrice
  if ('featured' in body) data.featured = !!body.featured
  if ('active' in body) data.active = !!body.active
  if ('order' in body) data.order = Number(body.order)

  const product = await db.product.update({
    where: { id },
    data,
    include: { brand: true, category: true },
  })
  return NextResponse.json(serializeProduct(product))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.product.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
