'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { api } from '@/lib/api'
import type { Brand, Product, Course, SiteSettings } from '@/lib/types'
import { ProductCard } from '@/components/shared/ProductCard'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight, ArrowUpRight, Sparkles, Star, GraduationCap, MapPin, Phone,
} from 'lucide-react'
import { WhatsAppIcon, InstagramIcon } from '@/components/icons/SocialIcons'

export function HomeView({
  settings,
  brands,
}: {
  settings: SiteSettings
  brands: Brand[]
}) {
  const navigate = useApp((s) => s.navigate)
  const [featured, setFeatured] = React.useState<Product[]>([])
  const [courses, setCourses] = React.useState<Course[]>([])

  React.useEffect(() => {
    api<Product[]>('/api/products?featured=1&limit=4').then(setFeatured).catch(() => {})
    api<Course[]>('/api/courses').then((cs) => setCourses(cs.slice(0, 3))).catch(() => {})
  }, [])

  return (
    <div className="flex flex-col">
      {/* ─── HERO ─── */}
      <section className="hero-magenta relative overflow-hidden text-foreground">
        {/* Decorative floating shapes */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-amber-200/25 blur-3xl animate-float-slow" />
          <div className="absolute right-[8%] top-16 h-[30rem] w-[30rem] rounded-full bg-stone-300/20 blur-3xl" />
          <div className="absolute bottom-[-8rem] left-[35%] h-80 w-80 rounded-full bg-black/5 blur-3xl animate-float-slow" style={{ animationDelay: '2s' }} />
          <div className="hero-noise absolute inset-0 opacity-30" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
          {/* Left: copy */}
          <div className="reveal-up">
            <Badge className="mb-4 border-[#C9A227]/40 bg-[#C9A227]/12 text-[#8a6a10]">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              {settings.heroBadge}
            </Badge>
            <h1 className="font-serif text-4xl font-bold leading-[1.05] tracking-tight text-[#141210] sm:text-5xl md:text-6xl">
              {settings.heroTitle}
            </h1>
            <p className="mt-4 max-w-md text-base text-[#4a463f] sm:text-lg">
              {settings.heroSubtitle}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                size="lg"
                onClick={() => navigate({ name: 'catalog' })}
                className="bg-[#141210] text-white hover:bg-[#2a2622]"
              >
                Ver catálogo
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate({ name: 'reps' })}
                className="border-[#141210]/25 bg-transparent text-[#141210] hover:bg-[#141210]/5"
              >
                Falar com representante
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-6 text-sm">
              <Stat icon={<Star className="h-4 w-4 text-[#B8860B]" />} value={`${settings.yearsExperience} anos`} label="de experiência" dark />
              <Stat icon={<Sparkles className="h-4 w-4 text-[#B8860B]" />} value={`${settings.brandsCount} marcas`} label="parceiras" dark />
              <Stat icon={<MapPin className="h-4 w-4 text-[#B8860B]" />} value="GO + DF" label="atuação regional" dark />
            </div>
          </div>

          {/* Right: framed FIBER PRO image */}
          <div className="relative reveal-up" style={{ animationDelay: '0.1s' }}>
            <div className="frame-premium mx-auto max-w-md md:max-w-lg">
              { }
              <img
                src={settings.heroImageUrl || '/hero/hero-main.png'}
                alt="Linha Fiber Pro — Knut Hair Care"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#141210]/85 px-4 py-1.5 text-xs font-medium text-amber-200 backdrop-blur">
              Linha <strong>Fiber Pro</strong> · Knut Hair Care
            </div>
          </div>
        </div>
      </section>

      {/* ─── MARQUEE: brands strip ─── */}
      <section className="border-b border-border bg-background py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-hidden px-4">
          <div className="flex shrink-0 items-center gap-2 pr-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Marcas parceiras
          </div>
          <div className="relative flex-1 overflow-hidden">
            <div className="flex w-max animate-marquee gap-3">
              {[...brands, ...brands].map((b, i) => (
                <button
                  key={`${b.id}-${i}`}
                  onClick={() => navigate({ name: 'brand', brandSlug: b.slug })}
                  className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-all hover:scale-105 hover:border-foreground/30"
                >
                  <span
                    className="inline-block h-2.5 w-2.5 rounded-full"
                    style={{ background: b.primaryColor }}
                  />
                  {b.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── CATALOGOS section ─── */}
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <SectionHeader
            eyebrow="Marcas parceiras"
            title="Oito marcas, uma só distribuidora"
            subtitle="Toque em uma marca para abrir um catálogo exclusivo, com identidade própria e sem misturar produtos de outras linhas."
          />
        </div>
        <div className="mt-9 grid gap-3">
          {brands.map((b, index) => (
            <button
              key={b.id}
              onClick={() => navigate({ name: 'brand', brandSlug: b.slug })}
              className="brand-strip-card group relative min-h-[112px] overflow-hidden rounded-[1.4rem] border border-white/10 text-left text-white"
              style={{
                background: `linear-gradient(115deg, ${b.primaryColor} 0%, ${b.primaryColor}e6 35%, ${b.accentColor}b8 135%)`,
              }}
            >
              <div className="absolute inset-0 opacity-55">
                <div className="absolute -right-10 -top-20 h-56 w-56 rounded-full border border-white/25" />
                <div className="absolute right-24 top-[-4rem] h-48 w-48 rounded-full bg-white/10 blur-2xl transition-transform duration-700 group-hover:translate-x-4" />
                <div className="absolute inset-y-0 left-[52%] w-px bg-white/15" />
                <div className="absolute inset-y-0 left-[68%] w-px bg-white/10" />
              </div>
              <div className="relative flex min-h-[112px] items-center justify-between gap-5 px-6 py-5 sm:px-8">
                <div>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/65">
                    Catálogo {String(index + 1).padStart(2, '0')}
                  </div>
                  <div className="font-serif text-2xl font-bold tracking-tight sm:text-3xl">{b.name}</div>
                  <div className="mt-1 text-sm text-white/80 sm:text-base">{b.tagline}</div>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-black/15 backdrop-blur transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white group-hover:text-black">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Featured products ─── */}
      <section className="bg-secondary/30 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Produtos em destaque"
            title="Selecionados para o seu cliente"
            subtitle="Os queridinhos das nossas marcas. Toque para ver detalhes e mais fotos."
            action={
              <Button variant="outline" onClick={() => navigate({ name: 'catalog' })}>
                Ver tudo <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            }
          />
          <div className="mt-8 grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 xl:grid-cols-4">
            {featured.length === 0
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="aspect-[3/4] animate-pulse rounded-xl bg-muted" />
                ))
              : featured.map((p) => (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    slug={p.slug}
                    image={p.images?.[0] ?? null}
                    images={p.images}
                    price={p.price}
                    oldPrice={p.oldPrice}
                    showPrice={p.showPrice}
                    brandName={p.brandName}
                    brandColor={p.brandColor}
                    minQuantity={p.minQuantity}
                    description={p.description}
                    featured={p.featured}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ─── Academy preview ─── */}
      <section className="academy-dark relative overflow-hidden py-16 text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-white/5 blur-3xl" />
          <div className="absolute -left-20 bottom-[-5rem] h-72 w-72 rounded-full bg-fuchsia-500/5 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeader
            eyebrow="Aladdin Academy"
            eyebrowColor="text-amber-300"
            title="Cursos livres para crescer no mercado da beleza"
            subtitle="Vendas, maquiagem, finanças, gestão e educação financeira — tudo gratuito, direto do YouTube."
            action={
              <Button
                onClick={() => navigate({ name: 'academy' })}
                className="bg-amber-500 text-black hover:bg-amber-400"
              >
                Entrar na Academy <GraduationCap className="ml-1 h-4 w-4" />
              </Button>
            }
            light
          />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <button
                key={c.id}
                onClick={() => navigate({ name: 'course', courseSlug: c.slug })}
                className="card-hover group rounded-xl border border-white/15 bg-white/5 p-5 text-left backdrop-blur transition-colors hover:bg-white/10"
              >
                <div className="flex items-center gap-2 text-xs text-amber-300">
                  <GraduationCap className="h-4 w-4" />
                  <span className="uppercase tracking-wider">{c.category}</span>
                </div>
                <h3 className="mt-2 font-serif text-lg font-bold">{c.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-white/70">{c.description}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-white/60">
                  <span>{c.lessonsCount} aulas</span>
                  <span>{c.duration}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Contact strip / map CTA ─── */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 rounded-2xl border border-border bg-card p-6 md:grid-cols-2 md:p-8">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> Contato
            </div>
            <h2 className="font-serif text-2xl font-bold">
              Venha nos visitar ou falar com a gente
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{settings.address}</p>
            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700"
              >
                <WhatsAppIcon size={16} /> {settings.phone}
              </a>
              <a
                href={`https://instagram.com/${settings.instagram1.replace('@','')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
              >
                <InstagramIcon size={16} /> @{settings.instagram1.replace('@','')}
              </a>
            </div>
            <Button
              className="mt-4"
              variant="outline"
              onClick={() => navigate({ name: 'contact' })}
            >
              Ver no mapa <MapPin className="ml-1 h-4 w-4" />
            </Button>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-muted">
            <iframe
              title="Mapa Aladdin Distribuidora"
              src={settings.mapEmbed || ''}
              className="h-64 w-full md:h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function Stat({ icon, value, label, dark }: { icon: React.ReactNode; value: string; label: string; dark?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-9 w-9 place-items-center rounded-full ${dark ? 'bg-[#141210]/6' : 'bg-white/10'}`}>{icon}</span>
      <div className="leading-tight">
        <div className={`font-serif text-lg font-bold ${dark ? 'text-[#141210]' : ''}`}>{value}</div>
        <div className={`text-[11px] uppercase tracking-wider ${dark ? 'text-[#4a463f]' : 'text-white/60'}`}>{label}</div>
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  eyebrowColor,
  title,
  subtitle,
  action,
  light,
}: {
  eyebrow: string
  eyebrowColor?: string
  title: string
  subtitle?: string
  action?: React.ReactNode
  light?: boolean
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <div className={`mb-1 text-xs font-semibold uppercase tracking-wider ${eyebrowColor ?? 'text-amber-600'}`}>
          {eyebrow}
        </div>
        <h2 className={`font-serif text-2xl font-bold sm:text-3xl ${light ? 'text-white' : ''}`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-1 max-w-xl text-sm ${light ? 'text-white/70' : 'text-muted-foreground'}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  )
}
