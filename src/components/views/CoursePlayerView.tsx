'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import type { Course, Lesson } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft, ChevronRight, PlayCircle, CheckCircle2, Clock, GraduationCap, ListVideo,
} from 'lucide-react'
import { useApp } from '@/lib/store-app'
import { youtubeEmbed, youtubeThumb, youtubeId } from '@/lib/format'

const CATEGORY_LABELS: Record<string, string> = {
  vendas: 'Vendas',
  maquiagem: 'Maquiagem',
  financas: 'Finanças',
  gestao: 'Gestão',
  'desenvolvimento-pessoal': 'Desenvolvimento Pessoal',
  'educacao-financeira': 'Educação Financeira',
  atendimento: 'Atendimento',
}

export function CoursePlayerView({ courseSlug }: { courseSlug: string }) {
  const navigate = useApp((s) => s.navigate)
  const [course, setCourse] = React.useState<Course | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [activeIdx, setActiveIdx] = React.useState(0)
  const [completed, setCompleted] = React.useState<Record<string, boolean>>({})

  React.useEffect(() => {
    setLoading(true)
    setActiveIdx(0)
    api<Course>(`/api/courses/${courseSlug}`)
      .then(setCourse)
      .catch(() => setCourse(null))
      .finally(() => setLoading(false))
  }, [courseSlug])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center text-muted-foreground">
        Carregando curso…
      </div>
    )
  }

  if (!course) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <p className="text-muted-foreground">Curso não encontrado.</p>
        <Button className="mt-4" onClick={() => navigate({ name: 'academy' })}>
          Voltar para a Academy
        </Button>
      </div>
    )
  }

  const lesson: Lesson | undefined = course.lessons[activeIdx]
  const totalLessons = course.lessons.length
  const completedCount = course.lessons.filter((l) => completed[l.id]).length
  const progress = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <button
        onClick={() => navigate({ name: 'academy' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Academy
      </button>

      <header className="mb-5">
        <div className="mb-1 flex flex-wrap items-center gap-2">
          <Badge variant="secondary">{CATEGORY_LABELS[course.category] || course.category}</Badge>
          <Badge variant="outline">{course.level}</Badge>
          {course.duration && (
            <Badge variant="outline">
              <Clock className="mr-1 h-3 w-3" /> {course.duration}
            </Badge>
          )}
        </div>
        <h1 className="font-serif text-2xl font-bold sm:text-3xl">{course.title}</h1>
        {course.description && (
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{course.description}</p>
        )}
      </header>

      <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
        {/* Player */}
        <div>
          <div className="aspect-video overflow-hidden rounded-xl border border-border bg-black shadow-lg">
            {lesson && youtubeId(lesson.youtubeUrl) ? (
              <iframe
                key={lesson.id}
                src={youtubeEmbed(lesson.youtubeUrl) + '?autoplay=1&rel=0'}
                title={lesson.title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="grid h-full place-items-center text-white/70">
                Vídeo indisponível
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs text-muted-foreground">
                Aula {activeIdx + 1} de {totalLessons}
              </div>
              <h2 className="font-serif text-xl font-bold">
                {lesson?.title || '—'}
              </h2>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveIdx((i) => Math.max(0, i - 1))}
                disabled={activeIdx === 0}
              >
                <ChevronLeft className="h-4 w-4" /> Anterior
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  if (lesson) setCompleted((c) => ({ ...c, [lesson.id]: true }))
                  setActiveIdx((i) => Math.min(totalLessons - 1, i + 1))
                }}
                disabled={activeIdx === totalLessons - 1}
              >
                Próxima <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-4 rounded-xl border border-border bg-card p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <GraduationCap className="h-4 w-4 text-amber-600" />
                Seu progresso
              </span>
              <span className="text-muted-foreground">
                {completedCount}/{totalLessons} aulas · {progress}%
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-rose-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            {progress === 100 && (
              <div className="mt-3 flex items-center gap-2 text-sm font-medium text-rose-700">
                <CheckCircle2 className="h-4 w-4" /> Parabéns! Você concluiu o curso.
              </div>
            )}
          </div>
        </div>

        {/* Lessons menu */}
        <aside className="lg:sticky lg:top-20 lg:self-start">
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <ListVideo className="h-4 w-4 text-amber-600" />
              <span className="font-serif font-bold">Aulas do curso</span>
              <span className="ml-auto text-xs text-muted-foreground">{totalLessons}</span>
            </div>
            <ScrollArea className="max-h-[60vh] scroll-area">
              <ul>
                {course.lessons.map((l, i) => {
                  const isActive = i === activeIdx
                  const isDone = !!completed[l.id]
                  return (
                    <li key={l.id}>
                      <button
                        onClick={() => setActiveIdx(i)}
                        className={`flex w-full items-center gap-3 border-b border-border px-3 py-2.5 text-left transition-colors ${
                          isActive ? 'bg-primary/10' : 'hover:bg-muted/70'
                        }`}
                      >
                        <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-md bg-muted">
                          { }
                          <img
                            src={youtubeThumb(l.youtubeUrl)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 grid place-items-center bg-black/30 text-white">
                            <PlayCircle className="h-5 w-5" />
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="line-clamp-2 text-sm font-medium">
                            {l.title}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">
                            Aula {i + 1}
                            {isDone && (
                              <span className="ml-1.5 inline-flex items-center gap-0.5 text-rose-600">
                                <CheckCircle2 className="h-3 w-3" /> concluída
                              </span>
                            )}
                          </div>
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            </ScrollArea>
          </div>
        </aside>
      </div>
    </div>
  )
}
