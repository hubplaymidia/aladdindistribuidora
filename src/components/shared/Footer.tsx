'use client'

import { useApp } from '@/lib/store-app'
import { InstagramIcon, WhatsAppIcon, WazeIcon, GoogleMapsIcon } from '@/components/icons/SocialIcons'
import type { SiteSettings } from '@/lib/types'

export function Footer({ settings }: { settings: SiteSettings }) {
  const navigate = useApp((s) => s.navigate)
  const wppLink = `https://wa.me/${settings.whatsapp.replace(/\D/g, '')}`
  const ig1 = settings.instagram1?.replace('@', '')
  const ig2 = settings.instagram2?.replace('@', '')

  return (
    <footer className="mt-auto border-t border-border bg-secondary/40 text-foreground">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-10 w-10 place-items-center rounded-full text-white"
                style={{
                  background:
                    'linear-gradient(135deg, #080808 0%, #232323 62%, #C9A227 165%)',
                }}
              >
                <span className="font-serif text-xl font-bold leading-none">A</span>
              </span>
              <div className="leading-tight">
                <div className="font-serif text-lg font-bold">{settings.brandName}</div>
                <div className="text-xs text-muted-foreground">
                  Cosméticos e produtos capilares · GO + DF
                </div>
              </div>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              {settings.institutionalText}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Badge>+{settings.yearsExperience} anos de experiência</Badge>
              <Badge>{settings.brandsCount} marcas parceiras</Badge>
              <Badge>Goiás + DF</Badge>
            </div>
          </div>

          {/* Nav */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Navegação
            </div>
            <ul className="space-y-2 text-sm">
              <FooterLink onClick={() => navigate({ name: 'home' })}>Início</FooterLink>
              <FooterLink onClick={() => navigate({ name: 'catalog' })}>Produtos</FooterLink>
              <FooterLink onClick={() => navigate({ name: 'academy' })}>Academy</FooterLink>
              <FooterLink onClick={() => navigate({ name: 'blog' })}>Blog</FooterLink>
              <FooterLink onClick={() => navigate({ name: 'reps' })}>Representantes</FooterLink>
              <FooterLink onClick={() => navigate({ name: 'contact' })}>Contato</FooterLink>
            </ul>
          </div>

          {/* Contact + maps */}
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Atendimento
            </div>
            <div className="mb-3 text-sm text-muted-foreground">{settings.address}</div>
            <div className="flex flex-wrap gap-2">
              <SocialButton
                href={wppLink}
                label="WhatsApp"
                external
              >
                <WhatsAppIcon size={18} />
                <span>WhatsApp</span>
              </SocialButton>
              <SocialButton
                href={settings.wazeUrl || '#'}
                label="Abrir no Waze"
                external
              >
                <WazeIcon size={18} />
                <span>Waze</span>
              </SocialButton>
              <SocialButton
                href={settings.mapsUrl || '#'}
                label="Google Maps"
                external
              >
                <GoogleMapsIcon size={18} />
                <span>Maps</span>
              </SocialButton>
              <SocialButton
                href={`https://instagram.com/${ig1}`}
                label="@aladdin.distribuidora"
                external
              >
                <InstagramIcon size={18} />
                <span>@{ig1}</span>
              </SocialButton>
              <SocialButton
                href={`https://instagram.com/${ig2}`}
                label="@knutgoias"
                external
              >
                <InstagramIcon size={18} />
                <span>@{ig2}</span>
              </SocialButton>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <div>
            © {new Date().getFullYear()} {settings.brandName}. Todos os direitos reservados.
          </div>
          <button
            onClick={() => navigate({ name: 'admin' })}
            className="text-muted-foreground/60 transition-colors hover:text-foreground"
          >
            Painel admin
          </button>
        </div>
      </div>
    </footer>
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground">
      {children}
    </span>
  )
}

function FooterLink({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className="text-left text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        {children}
      </button>
    </li>
  )
}

function SocialButton({
  href,
  label,
  external,
  children,
}: {
  href: string
  label: string
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noopener noreferrer' : undefined}
      aria-label={label}
      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-all hover:scale-105 hover:border-foreground/30 hover:shadow-sm"
    >
      {children}
    </a>
  )
}
