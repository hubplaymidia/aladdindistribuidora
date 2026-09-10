import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  const body = await req.json()
  const data: any = {}
  for (const k of ['courseId','title','youtubeUrl','duration']) {
    if (k in body) data[k] = body[k]
  }
  if ('order' in body) data.order = Number(body.order)
  const lesson = await db.lesson.update({ where: { id }, data })
  return NextResponse.json(lesson)
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.lesson.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
