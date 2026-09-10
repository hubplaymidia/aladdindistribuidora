import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCategory } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const cats = await db.category.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json(cats.map(serializeCategory))
}
