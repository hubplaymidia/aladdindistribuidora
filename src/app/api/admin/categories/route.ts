import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCategory, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const cats = await db.category.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(cats.map(serializeCategory))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.name)
  const cat = await db.category.create({
    data: { name: body.name, slug, order: body.order ?? 0 },
  })
  return NextResponse.json(serializeCategory(cat))
}
