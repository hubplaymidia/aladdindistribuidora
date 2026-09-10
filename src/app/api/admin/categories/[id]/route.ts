import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCategory, verifyAdmin } from '@/lib/api-helpers'
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
  if ('name' in body) { data.name = body.name; data.slug = body.slug?.toString() || slugify(body.name) }
  if ('order' in body) data.order = Number(body.order)
  const cat = await db.category.update({ where: { id }, data })
  return NextResponse.json(serializeCategory(cat))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.category.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
