'use client'

import * as React from 'react'
import type { SiteSettings } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  WhatsAppIcon, InstagramIcon, WazeIcon, GoogleMapsIcon,
} from '@/components/icons/SocialIcons'
import { ChevronLeft, Phone, MapPin, Mail, Clock } from 'lucide-react'
import { useApp } from '@/lib/store-app'
import { toast } from 'sonner'

export function ContactView({ settings }: { settings: SiteSettings }) {
  const navigate = useApp((s) => s.navigate)
  const wppLink = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const fd = new FormData(e.target as HTMLFormElement)
    const name = fd.get('name')
    const msg = fd.get('message')
    const text = `Olá! Sou ${name}.\n\n${msg}`
    window.open(`${wppLink}?text=${encodeURIComponent(text)}`, '_blank')
    toast.success('Abrimos o WhatsApp com a sua mensagem!')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <button
        onClick={() => navigate({ name: 'home' })}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ChevronLeft className="h-4 w-4" /> Início
      </button>

      <header className="mb-8">
        <h1 className="font-serif text-3xl font-bold sm:text-4xl">Contato</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          Estamos prontos para atender você. Escolha o canal que preferir.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left: info + map */}
        <div className="flex flex-col gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <InfoCard icon={<MapPin className="h-4 w-4" />} title="Endereço">
              {settings.address}
            </InfoCard>
            <InfoCard icon={<Phone className="h-4 w-4" />} title="Telefone">
              {settings.phone}
            </InfoCard>
            <InfoCard icon={<Clock className="h-4 w-4" />} title="Atendimento">
              Seg–Sex 8h às 18h · Sáb 8h às 12h
            </InfoCard>
            <InfoCard icon={<Mail className="h-4 w-4" />} title="Redes">
              @{settings.instagram1} · @{settings.instagram2}
            </InfoCard>
          </div>

          {/* Map */}
          <div className="overflow-hidden rounded-xl border border-border">
            <iframe
              title="Mapa Aladdin Distribuidora"
              src={settings.mapEmbed || ''}
              className="h-72 w-full lg:h-80"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          {/* Map quick links */}
          <div className="flex flex-wrap gap-2">
            <a
              href={settings.wazeUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-[#33CCFF] px-4 py-2 text-sm font-medium text-black transition-transform hover:scale-105"
            >
              <WazeIcon size={16} /> Abrir no Waze
            </a>
            <a
              href={settings.mapsUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-4 py-2 text-sm font-medium text-foreground transition-transform hover:scale-105"
            >
              <GoogleMapsIcon size={16} /> Google Maps
            </a>
            <a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              <WhatsAppIcon size={16} /> WhatsApp
            </a>
            <a
              href={`https://instagram.com/${settings.instagram1.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-fuchsia-600 to-amber-500 px-4 py-2 text-sm font-medium text-white transition-transform hover:scale-105"
            >
              <InstagramIcon size={16} /> Instagram
            </a>
          </div>
        </div>

        {/* Right: form */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-1 font-serif text-xl font-bold">Envie uma mensagem</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Preencha o formulário e abriremos o WhatsApp com a mensagem pronta.
          </p>
          <form onSubmit={onSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Nome</Label>
                <Input id="name" name="name" required placeholder="Seu nome" />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input id="phone" name="phone" placeholder="(00) 0000-0000" />
              </div>
            </div>
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input id="subject" name="subject" placeholder="Sobre o que é?" />
            </div>
            <div>
              <Label htmlFor="message">Mensagem</Label>
              <Textarea
                id="message"
                name="message"
                required
                rows={5}
                placeholder="Escreva sua mensagem…"
              />
            </div>
            <Button type="submit" className="w-full">
              <WhatsAppIcon size={18} />
              <span className="ml-1.5">Enviar no WhatsApp</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <span className="text-amber-600">{icon}</span>
        {title}
      </div>
      <div className="text-sm text-foreground">{children}</div>
    </div>
  )
}
