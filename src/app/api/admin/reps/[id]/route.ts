import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeRep, verifyAdmin } from '@/lib/api-helpers'
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
  for (const k of ['photoUrl','whatsapp','bio','instagram','region']) {
    if (k in body) data[k] = body[k]
  }
  if ('name' in body) { data.name = body.name; data.slug = body.slug?.toString() || slugify(body.name) }
  if ('active' in body) data.active = !!body.active
  if ('order' in body) data.order = Number(body.order)
  const rep = await db.representative.update({ where: { id }, data })
  return NextResponse.json(serializeRep(rep))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.representative.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
