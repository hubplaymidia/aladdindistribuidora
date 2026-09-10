import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeSettings, verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const s = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
  return NextResponse.json(serializeSettings(s))
}

export async function PUT(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const allowed = [
    'brandName','heroTitle','heroSubtitle','heroImageUrl','heroBadge',
    'institutionalText','address','phone','whatsapp','instagram1','instagram2',
    'wazeUrl','mapsUrl','mapEmbed',
  ]
  const data: any = {}
  for (const k of allowed) if (k in body) data[k] = body[k]
  if ('yearsExperience' in body) data.yearsExperience = Number(body.yearsExperience)
  if ('brandsCount' in body) data.brandsCount = Number(body.brandsCount)

  const s = await db.siteSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...data },
    update: data,
  })
  return NextResponse.json(serializeSettings(s))
}
