import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeRep } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET() {
  const reps = await db.representative.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  })
  return NextResponse.json(reps.map(serializeRep))
}
