import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeSettings } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const s = await db.siteSettings.findUnique({ where: { id: 'singleton' } })
  if (!s) return NextResponse.json({ error: 'Sem configurações' }, { status: 500 })
  return NextResponse.json(serializeSettings(s))
}
