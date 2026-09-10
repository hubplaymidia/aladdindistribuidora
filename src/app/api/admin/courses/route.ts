import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCourse, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const courses = await db.course.findMany({
    include: { lessons: { orderBy: { order: 'asc' } } },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  })
  return NextResponse.json(courses.map(serializeCourse))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.title)
  const course = await db.course.create({
    data: {
      title: body.title,
      slug,
      description: body.description ?? null,
      category: body.category ?? 'vendas',
      coverUrl: body.coverUrl ?? null,
      instructor: body.instructor ?? null,
      duration: body.duration ?? null,
      level: body.level ?? 'iniciante',
      featured: !!body.featured,
      order: body.order ?? 0,
    },
    include: { lessons: true },
  })
  return NextResponse.json(serializeCourse(course))
}
