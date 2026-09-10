'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import type { BlogArticle } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, Clock, ArrowRight } from 'lucide-react'
import { useApp } from '@/lib/store-app'
import { ArticleCover } from '@/components/shared/ArticleCover'

const CATEGORIES = [
  'Todos', 'Cuidados Pessoais', 'Dicas de Beleza', 'Dicas de Vendas', 'Tendências & Mercado',
]

export function BlogView() {
  const navigate = useApp((s) => s.navigate)
  const [articles, setArticles] = React.useState<BlogArticle[]>([])
  const [loading, setLoading] = React.useState(true)
  const [cat, setCat] = React.useState('Todos')

  React.useEffect(() => {
    setLoading(true)
    const params = cat !== 'Todos' ? `?category=${encodeURIComponent(cat)}` : ''
    api<BlogArticle[]>(`/api/blog${params}`)
      .then(setArticles)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [cat])

  const featured = articles[0]
  const rest = articles.slice(1)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate({ name: 'home' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Início
      </button>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Blog Aladdin</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Dicas de vendas, cuidados pessoais e tendências do mercado de beleza.
        </p>
      </header>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors ${
              cat === c
                ? 'bg-primary text-primary-foreground'
                : 'border border-border bg-background hover:bg-muted'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : articles.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border p-16 text-center text-muted-foreground">
          Nenhum artigo nesta categoria.
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {featured && (
            <button
              onClick={() => navigate({ name: 'article', articleSlug: featured.slug })}
              className="card-hover group grid overflow-hidden rounded-2xl border border-border text-left md:grid-cols-2"
            >
              <div className="aspect-[16/9] overflow-hidden bg-muted md:h-full">
                <ArticleCover seed={featured.slug} category={featured.category} title={featured.title} />
              </div>
              <div className="flex flex-col justify-center p-6">
                <Badge className="mb-2 w-fit">{featured.category}</Badge>
                <h2 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
                  {featured.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">{featured.excerpt}</p>
                <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                  <span>{featured.author}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {featured.readTime} min de leitura
                  </span>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Ler artigo <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </button>
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((a) => (
              <button
                key={a.id}
                onClick={() => navigate({ name: 'article', articleSlug: a.slug })}
                className="card-hover group flex flex-col overflow-hidden rounded-xl border border-border text-left"
              >
                <div className="aspect-[16/9] overflow-hidden bg-muted">
                  <ArticleCover seed={a.slug} category={a.category} title={a.title} />
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <Badge variant="secondary" className="mb-2 w-fit">{a.category}</Badge>
                  <h3 className="font-serif text-lg font-bold leading-tight">{a.title}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{a.excerpt}</p>
                  <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-muted-foreground">
                    <Clock className="h-3.5 w-3.5" /> {a.readTime} min
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
