import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeArticle } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const article = await db.blogArticle.findUnique({ where: { slug } })
  if (!article) return NextResponse.json({ error: 'Artigo não encontrado' }, { status: 404 })

  const related = await db.blogArticle.findMany({
    where: { category: article.category, id: { not: article.id } },
    orderBy: { publishedAt: 'desc' },
    take: 3,
  })
  return NextResponse.json({ ...serializeArticle(article), related: related.map(serializeArticle) })
}
