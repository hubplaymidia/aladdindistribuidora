import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeBrand, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const brands = await db.brand.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(brands.map(serializeBrand))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.name)
  const brand = await db.brand.create({
    data: {
      name: body.name,
      slug,
      tagline: body.tagline ?? null,
      primaryColor: body.primaryColor ?? '#111111',
      accentColor: body.accentColor ?? '#C9A227',
      bgColor: body.bgColor ?? '#FFFFFF',
      surfaceColor: body.surfaceColor ?? '#F5F4F1',
      textColor: body.textColor ?? '#0B0B0B',
      mutedColor: body.mutedColor ?? '#6B7280',
      themeMode: body.themeMode ?? 'light',
      fontStyle: body.fontStyle ?? 'serif',
      logoUrl: body.logoUrl ?? null,
      stripImageUrl: body.stripImageUrl ?? null,
      stripFit: body.stripFit ?? 'cover',
      heroImageUrl: body.heroImageUrl ?? null,
      description: body.description ?? null,
      order: body.order ?? 0,
      featured: !!body.featured,
    },
  })
  return NextResponse.json(serializeBrand(brand))
}
