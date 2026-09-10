import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeArticle } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const where: any = {}
  if (category) where.category = category

  const articles = await db.blogArticle.findMany({
    where,
    orderBy: { publishedAt: 'desc' },
  })
  return NextResponse.json(articles.map(serializeArticle))
}
