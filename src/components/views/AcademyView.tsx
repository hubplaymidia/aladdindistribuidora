'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import type { Course } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { YouTubeIcon } from '@/components/icons/SocialIcons'
import {
  Search, GraduationCap, Star, Clock, PlayCircle, Sparkles,
} from 'lucide-react'
import { useApp } from '@/lib/store-app'
import { BackBar } from '@/components/shared/BackBar'
import { youtubeThumb } from '@/lib/format'

const CATEGORY_LABELS: Record<string, string> = {
  vendas: 'Vendas',
  maquiagem: 'Maquiagem',
  financas: 'Finanças',
  gestao: 'Gestão',
  'desenvolvimento-pessoal': 'Desenvolvimento Pessoal',
  'educacao-financeira': 'Educação Financeira',
  atendimento: 'Atendimento',
}

export function AcademyView() {
  const navigate = useApp((s) => s.navigate)
  const [courses, setCourses] = React.useState<Course[]>([])
  const [loading, setLoading] = React.useState(true)
  const [q, setQ] = React.useState('')

  React.useEffect(() => {
    api<Course[]>('/api/courses')
      .then(setCourses)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = React.useMemo(() => {
    if (!q.trim()) return courses
    const t = q.toLowerCase()
    return courses.filter(
      (c) => c.title.toLowerCase().includes(t) || c.description?.toLowerCase().includes(t)
    )
  }, [courses, q])

  const byCategory = (cat: string) =>
    filtered.filter((c) => c.category === cat)

  const featured = filtered.filter((c) => c.featured)
  const eduFin = byCategory('educacao-financeira')

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <BackBar label="Início" onBack={() => navigate({ name: 'home' })} />

      <header className="relative mb-8 overflow-hidden rounded-2xl academy-dark p-8 text-white sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative">
          <Badge className="mb-3 border-amber-400/40 bg-amber-400/15 text-amber-200">
            <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Aladdin Academy · Livre e gratuito
          </Badge>
          <h1 className="font-serif text-3xl font-bold sm:text-4xl">
            Aprenda a crescer no mercado da beleza
          </h1>
          <p className="mt-2 max-w-2xl text-white/80">
            Cursos gratuitos sobre vendas, maquiagem, finanças, gestão e desenvolvimento pessoal.
            Conteúdo 100% online — assista quando quiser.
          </p>
          <div className="mt-5 relative max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar curso…"
              className="border-white/20 bg-white/10 pl-9 text-white placeholder:text-white/60"
            />
          </div>
        </div>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <Tabs defaultValue="destaque">
          <div className="-mx-4 mb-6 overflow-x-auto overscroll-x-contain px-4 scroll-area touch-pan-x sm:mx-0 sm:px-0">
            <TabsList className="inline-flex h-auto min-w-max w-max gap-1 rounded-xl bg-muted/80 p-1">
              <TabsTrigger value="destaque" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Destaques
              </TabsTrigger>
              <TabsTrigger value="educacao-financeira" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Educação Financeira
              </TabsTrigger>
              <TabsTrigger value="vendas" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Vendas
              </TabsTrigger>
              <TabsTrigger value="maquiagem" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Maquiagem
              </TabsTrigger>
              <TabsTrigger value="financas" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Finanças
              </TabsTrigger>
              <TabsTrigger value="gestao" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Gestão
              </TabsTrigger>
              <TabsTrigger value="atendimento" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Atendimento
              </TabsTrigger>
              <TabsTrigger value="desenvolvimento-pessoal" className="shrink-0 whitespace-nowrap px-3 py-2 text-xs sm:text-sm">
                Desenvolvimento Pessoal
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="destaque" className="mt-0">
            <CourseGrid
              title="Cursos em destaque"
              courses={featured}
              onOpen={(slug) => navigate({ name: 'course', courseSlug: slug })}
            />
          </TabsContent>

          <TabsContent value="educacao-financeira" className="mt-0">
            <div className="rounded-2xl border border-amber-300/40 bg-amber-50 p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-amber-600" />
                <h2 className="font-serif text-xl font-bold">Educação Financeira</h2>
              </div>
              <p className="mb-6 text-sm text-muted-foreground">
                Dicas, investimentos e hábitos para organizar suas finanças — pessoais e do
                seu negócio de cosméticos.
              </p>
              <CourseGrid
                courses={eduFin}
                onOpen={(slug) => navigate({ name: 'course', courseSlug: slug })}
              />
            </div>
          </TabsContent>

          {(['vendas', 'maquiagem', 'financas', 'gestao', 'atendimento', 'desenvolvimento-pessoal'] as const).map((cat) => (
            <TabsContent key={cat} value={cat} className="mt-0">
              <CourseGrid
                title={CATEGORY_LABELS[cat]}
                courses={byCategory(cat)}
                onOpen={(slug) => navigate({ name: 'course', courseSlug: slug })}
              />
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  )
}

function CourseGrid({
  title,
  courses,
  onOpen,
}: {
  title?: string
  courses: Course[]
  onOpen: (slug: string) => void
}) {
  if (courses.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        Nenhum curso nesta categoria ainda.
      </div>
    )
  }
  return (
    <div>
      {title && (
        <h2 className="mb-4 font-serif text-2xl font-bold">{title}</h2>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {courses.map((c) => (
          <button
            key={c.id}
            onClick={() => onOpen(c.slug)}
            className="card-hover group overflow-hidden rounded-xl border border-border bg-card text-left"
          >
            <div className="relative aspect-video overflow-hidden bg-muted">
              {c.lessons[0] ? (
                 
                <img
                  src={youtubeThumb(c.lessons[0].youtubeUrl)}
                  alt={c.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="grid h-full place-items-center text-muted-foreground">
                  <GraduationCap className="h-10 w-10" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {c.lessonsCount > 0 ? (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  <YouTubeIcon size={11} /> {c.lessonsCount} aula{c.lessonsCount > 1 ? 's' : ''}
                </div>
              ) : (
                <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                  Em breve
                </div>
              )}
              {c.featured && (
                <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-white">
                  <Star className="h-3 w-3" /> Destaque
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-amber-600">
                {CATEGORY_LABELS[c.category] || c.category} · {c.level}
              </div>
              <h3 className="font-serif text-lg font-bold leading-snug">{c.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{c.description}</p>
              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {c.duration && (
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" /> {c.duration}
                  </span>
                )}
                <span className="inline-flex items-center gap-1">
                  <PlayCircle className="h-3.5 w-3.5" /> {c.lessonsCount} aula{c.lessonsCount > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
