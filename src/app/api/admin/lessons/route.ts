import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

// Lessons are created/updated via course editor. This route allows direct creation.
export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const lesson = await db.lesson.create({
    data: {
      courseId: body.courseId,
      title: body.title,
      youtubeUrl: body.youtubeUrl,
      duration: body.duration ?? null,
      order: body.order ?? 0,
    },
  })
  return NextResponse.json(lesson)
}
