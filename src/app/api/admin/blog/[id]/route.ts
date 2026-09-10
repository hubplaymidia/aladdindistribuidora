import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeArticle, verifyAdmin } from '@/lib/api-helpers'
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
  for (const k of ['excerpt','category','cover','author','content']) {
    if (k in body) data[k] = body[k]
  }
  if ('title' in body) { data.title = body.title; data.slug = body.slug?.toString() || slugify(body.title) }
  if ('readTime' in body) data.readTime = Number(body.readTime)
  if ('publishedAt' in body) data.publishedAt = body.publishedAt ? new Date(body.publishedAt) : new Date()
  const article = await db.blogArticle.update({ where: { id }, data })
  return NextResponse.json(serializeArticle(article))
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const { id } = await params
  await db.blogArticle.delete({ where: { id } })
  return NextResponse.json({ ok: true })
}
