import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeBrand, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: any = { ...body }
  if (data.name) data.slug = data.slug?.toString() || slugify(data.name)
  if (typeof data.featured !== 'undefined') data.featured = !!data.featured
  // Strip undefined fields that Prisma would reject as "unknown"
  Object.keys(data).forEach((k) => (data[k] === undefined && delete data[k]))
  const brand = await db.brand.update({ where: { id }, data })
  return NextResponse.json(serializeBrand(brand))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.brand.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
