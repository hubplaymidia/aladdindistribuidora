import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeRep, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const reps = await db.representative.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(reps.map(serializeRep))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.name)
  const rep = await db.representative.create({
    data: {
      name: body.name,
      slug,
      photoUrl: body.photoUrl ?? null,
      whatsapp: body.whatsapp,
      bio: body.bio ?? null,
      instagram: body.instagram ?? null,
      region: body.region ?? null,
      active: body.active ?? true,
      order: body.order ?? 0,
    },
  })
  return NextResponse.json(serializeRep(rep))
}
