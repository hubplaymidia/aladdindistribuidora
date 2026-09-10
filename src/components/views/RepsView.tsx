'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import type { Representative } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { WhatsAppIcon, InstagramIcon } from '@/components/icons/SocialIcons'
import { ChevronLeft, Users } from 'lucide-react'
import { useApp } from '@/lib/store-app'

export function RepsView() {
  const navigate = useApp((s) => s.navigate)
  const [reps, setReps] = React.useState<Representative[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    api<Representative[]>('/api/reps')
      .then(setReps)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate({ name: 'home' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Início
      </button>

      <header className="mb-8">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-600">
          <Users className="h-4 w-4" /> Representantes
        </div>
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Fale com um representante</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Atendimento personalizado em Goiás e no Distrito Federal. Clique no WhatsApp do
          representante da sua região para conversar agora.
        </p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-muted" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reps.map((r) => {
            const wppLink = `https://wa.me/${r.whatsapp.replace(/\D/g, '')}`
            return (
              <div
                key={r.id}
                className="card-hover group flex flex-col rounded-2xl border border-border bg-card p-5"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
                    {r.photoUrl ? (
                       
                      <img
                        src={r.photoUrl}
                        alt={r.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center font-serif text-2xl font-bold text-muted-foreground">
                        {r.name.charAt(0)}
                      </div>
                    )}
                    <span className="absolute bottom-0 right-0 grid h-6 w-6 place-items-center rounded-full bg-green-500 text-white ring-2 ring-background">
                      <WhatsAppIcon size={13} />
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-lg font-bold">{r.name}</div>
                    {r.region && (
                      <div className="text-xs text-muted-foreground">{r.region}</div>
                    )}
                  </div>
                </div>

                {r.bio && (
                  <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{r.bio}</p>
                )}

                <div className="mt-4 flex gap-2">
                  <a
                    href={wppLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
                  >
                    <WhatsAppIcon size={16} /> WhatsApp
                  </a>
                  {r.instagram && (
                    <a
                      href={`https://instagram.com/${r.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
                      aria-label={`Instagram de ${r.name}`}
                    >
                      <InstagramIcon size={16} />
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-10 rounded-2xl border border-border bg-secondary/40 p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Quer ser representante Aladdin na sua região?
        </p>
        <Button
          className="mt-3"
          onClick={() => navigate({ name: 'contact' })}
        >
          Fale com o comercial
        </Button>
      </div>
    </div>
  )
}
