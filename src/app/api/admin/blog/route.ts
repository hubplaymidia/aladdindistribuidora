import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { serializeArticle, verifyAdmin } from '@/lib/api-helpers'
import { slugify } from '@/lib/format'

export const dynamic = 'force-dynamic'

export async function GET() {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const articles = await db.blogArticle.findMany({ orderBy: { publishedAt: 'desc' } })
  return NextResponse.json(articles.map(serializeArticle))
}

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json()
  const slug = body.slug?.toString() || slugify(body.title)
  const article = await db.blogArticle.create({
    data: {
      title: body.title,
      slug,
      excerpt: body.excerpt ?? '',
      category: body.category ?? 'Cuidados Pessoais',
      cover: body.cover ?? null,
      author: body.author ?? 'Equipe Aladdin Distribuidora',
      readTime: Number(body.readTime ?? 5),
      publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      content: body.content ?? '',
    },
  })
  return NextResponse.json(serializeArticle(article))
}
