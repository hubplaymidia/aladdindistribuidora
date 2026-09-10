import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCourse, verifyAdmin } from '@/lib/api-helpers'
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
  for (const k of ['description','category','coverUrl','instructor','duration','level']) {
    if (k in body) data[k] = body[k]
  }
  if ('title' in body) { data.title = body.title; data.slug = body.slug?.toString() || slugify(body.title) }
  if ('featured' in body) data.featured = !!body.featured
  if ('order' in body) data.order = Number(body.order)
  const course = await db.course.update({
    where: { id },
    data,
    include: { lessons: { orderBy: { order: 'asc' } } },
  })
  return NextResponse.json(serializeCourse(course))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.course.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
