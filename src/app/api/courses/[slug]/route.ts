import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCourse } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const course = await db.course.findUnique({
    where: { slug },
    include: { lessons: { orderBy: { order: 'asc' } } },
  })
  if (!course) return NextResponse.json({ error: 'Curso não encontrado' }, { status: 404 })
  return NextResponse.json(serializeCourse(course))
}
