import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const video = await db.brandVideo.create({
    data: {
      brandId: body.brandId,
      title: body.title,
      youtubeUrl: body.youtubeUrl,
      thumbnail: body.thumbnail ?? null,
      order: body.order ?? 0,
    },
  })
  return NextResponse.json(video)
}
