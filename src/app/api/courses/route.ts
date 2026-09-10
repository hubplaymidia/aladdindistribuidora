import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeCourse } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const where: any = {}
  if (category) where.category = category

  const courses = await db.course.findMany({
    where,
    include: { lessons: { orderBy: { order: 'asc' } } },
    orderBy: [{ featured: 'desc' }, { order: 'asc' }],
  })
  return NextResponse.json(courses.map(serializeCourse))
}
