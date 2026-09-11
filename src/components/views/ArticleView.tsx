'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import type { BlogArticle } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, ArrowRight } from 'lucide-react'
import { useApp } from '@/lib/store-app'
import { BackBar } from '@/components/shared/BackBar'
import { ArticleCover } from '@/components/shared/ArticleCover'

export function ArticleView({ articleSlug }: { articleSlug: string }) {
  const navigate = useApp((s) => s.navigate)
  const [article, setArticle] = React.useState<(BlogArticle & { related?: BlogArticle[] }) | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setLoading(true)
    api<BlogArticle & { related?: BlogArticle[] }>(`/api/blog/${articleSlug}`)
      .then(setArticle)
      .catch(() => setArticle(null))
      .finally(() => setLoading(false))
  }, [articleSlug])

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted-foreground">
        Carregando artigo…
      </div>
    )
  }

  if (!article) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Artigo não encontrado.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'blog' })}>
          Voltar ao blog
        </Button>
      </div>
    )
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <BackBar label="Blog" onBack={() => navigate({ name: 'blog' })} />

      <Badge className="mb-3">{article.category}</Badge>
      <h1 className="font-serif text-3xl font-bold leading-tight sm:text-4xl">
        {article.title}
      </h1>
      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span>{article.author}</span>
        <span className="inline-flex items-center gap-1">
          <Clock className="h-3.5 w-3.5" /> {article.readTime} min de leitura
        </span>
        <span>
          {new Date(article.publishedAt).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </span>
      </div>

      <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl border border-border">
        <ArticleCover seed={article.slug} category={article.category} title={article.title} />
      </div>

      <div className="prose prose-zinc mt-8 max-w-none">
        <ArticleContent content={article.content} />
      </div>

      {article.related && article.related.length > 0 && (
        <section className="mt-12 border-t border-border pt-8">
          <h2 className="mb-4 font-serif text-2xl font-bold">Artigos relacionados</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {article.related.map((r) => (
              <button
                key={r.id}
                onClick={() => navigate({ name: 'article', articleSlug: r.slug })}
                className="card-hover group overflow-hidden rounded-xl border border-border text-left"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <ArticleCover seed={r.slug} category={r.category} title={r.title} />
                </div>
                <div className="p-3">
                  <h3 className="font-serif text-sm font-bold leading-tight">{r.title}</h3>
                  <span className="mt-1 inline-flex items-center gap-1 text-xs text-primary">
                    Ler <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}
    </article>
  )
}

// Minimal markdown-ish renderer (headings, paragraphs, lists).
function ArticleContent({ content }: { content: string }) {
  const lines = content.split('\n')
  const blocks: React.ReactNode[] = []
  let list: string[] = []

  const flushList = () => {
    if (list.length === 0) return
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-3 ml-5 list-disc space-y-1">
        {list.map((li, i) => (
          <li key={i}>{inline(li)}</li>
        ))}
      </ul>
    )
    list = []
  }

  const inline = (s: string) => {
    // bold **text**
    const parts = s.split(/(\*\*[^*]+\*\*)/g)
    return parts.map((p, i) =>
      p.startsWith('**') && p.endsWith('**') ? (
        <strong key={i}>{p.slice(2, -2)}</strong>
      ) : (
        <span key={i}>{p}</span>
      )
    )
  }

  lines.forEach((raw, i) => {
    const line = raw.trim()
    if (!line) {
      flushList()
      return
    }
    if (line.startsWith('## ')) {
      flushList()
      blocks.push(
        <h2 key={i} className="mt-6 font-serif text-2xl font-bold">
          {line.slice(3)}
        </h2>
      )
    } else if (line.startsWith('# ')) {
      flushList()
      blocks.push(
        <h1 key={i} className="mt-6 font-serif text-3xl font-bold">
          {line.slice(2)}
        </h1>
      )
    } else if (line.startsWith('- ')) {
      list.push(line.slice(2))
    } else {
      flushList()
      blocks.push(
        <p key={i} className="my-3 leading-relaxed">
          {inline(line)}
        </p>
      )
    }
  })
  flushList()
  return <>{blocks}</>
}
