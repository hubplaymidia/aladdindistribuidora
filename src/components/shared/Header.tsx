'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { cn } from '@/lib/utils'
import { useCart, cartCount } from '@/lib/store-cart'
import { Button } from '@/components/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import {
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  Home,
  BookOpen,
  Phone,
  ChevronRight,
  Grid3X3,
  ChevronDown,
} from 'lucide-react'

type BrandLite = {
  id: string
  name: string
  slug: string
  tagline: string
  primaryColor: string
  accentColor: string
  featured?: boolean
  productsCount?: number
}

export function Header({ brands }: { brands: BrandLite[] }) {
  const navigate = useApp((s) => s.navigate)
  const cartItems = useCart((s) => s.items)
  const openCart = useCart((s) => s.open)
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [catalogsOpen, setCatalogsOpen] = React.useState(false)
  const count = cartCount(cartItems)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const featuredBrands = brands.filter((b) => b.featured)
  const otherBrands = brands.filter((b) => !b.featured)

  const goBrand = (slug: string) => {
    navigate({ name: 'brand', brandSlug: slug })
    setMobileOpen(false)
    setCatalogsOpen(false)
  }

  const go = (view: any) => {
    navigate(view)
    setMobileOpen(false)
    setCatalogsOpen(false)
  }

  // Close on outside click
  React.useEffect(() => {
    if (!mobileOpen) return
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [mobileOpen])

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/90 backdrop-blur-md supports-[backdrop-filter]:bg-background/75">
      <div className="relative mx-auto flex h-[64px] max-w-7xl items-center justify-between gap-3 px-4 sm:h-[72px] sm:px-6" ref={menuRef}>
        {/* Logo */}
        <button
          onClick={() => go({ name: 'home' })}
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="Ir para a página inicial"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-full text-white shadow-md ring-1 ring-black/10 transition-transform duration-300 group-hover:scale-105 sm:h-10 sm:w-10"
            style={{
              background: 'linear-gradient(135deg, #080808 0%, #232323 62%, #C9A227 165%)',
            }}
          >
            <span className="font-serif text-lg font-bold leading-none sm:text-xl">A</span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-sm font-bold tracking-tight text-foreground sm:text-base">
              Aladdin
            </span>
            <span className="text-[9px] font-medium uppercase tracking-[0.18em] text-muted-foreground sm:text-[10px]">
              Distribuidora
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer select-none outline-none")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go({ name: 'home' })}
              >
                Início
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="cursor-pointer select-none outline-none" onMouseDown={(e) => e.preventDefault()}>Catálogos</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[640px] gap-2 p-4 md:grid-cols-2">
                  <div className="col-span-2 mb-1 flex items-center gap-2 border-b border-border pb-2">
                    <Sparkles className="h-4 w-4 text-amber-600" />
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Marcas em destaque
                    </span>
                  </div>
                  {featuredBrands.map((b) => (
                    <BrandCard key={b.id} brand={b} onClick={() => goBrand(b.slug)} />
                  ))}
                  <div className="col-span-2 mt-2 mb-1 flex items-center gap-2 border-b border-border pb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Todas as marcas
                    </span>
                  </div>
                  {otherBrands.map((b) => (
                    <BrandCard key={b.id} brand={b} onClick={() => goBrand(b.slug)} />
                  ))}
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer select-none outline-none")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go({ name: 'catalog' })}
              >
                Produtos
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer select-none outline-none")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go({ name: 'blog' })}
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={cn(navigationMenuTriggerStyle(), "cursor-pointer select-none outline-none")}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => go({ name: 'contact' })}
              >
                Contato
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#111] text-white shadow-sm ring-1 ring-black/10 transition-all duration-300 hover:scale-105 hover:shadow-md animate-pulse-ring"
            aria-label="Abrir sacola"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {count}
              </span>
            )}
          </button>

          {/* Mobile hamburger — dropdown abaixo */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Dropdown mobile — desce do header */}
        {mobileOpen && (
          <div className="absolute left-0 right-0 top-full z-50 border-b border-border bg-background/98 shadow-xl backdrop-blur-xl md:hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <nav className="mx-auto max-w-7xl px-3 py-3">
              <MobileRow icon={<Home className="h-4 w-4" />} label="Início" onClick={() => go({ name: 'home' })} />
              <MobileRow icon={<Grid3X3 className="h-4 w-4" />} label="Produtos" onClick={() => go({ name: 'catalog' })} />
              <MobileRow icon={<BookOpen className="h-4 w-4" />} label="Blog" onClick={() => go({ name: 'blog' })} />
              <MobileRow icon={<Phone className="h-4 w-4" />} label="Contato" onClick={() => go({ name: 'contact' })} />

              <button
                type="button"
                onClick={() => setCatalogsOpen((v) => !v)}
                className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/80"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted">
                  <Sparkles className="h-4 w-4 text-amber-600" />
                </span>
                <span className="flex-1 text-sm font-medium">Catálogos</span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${catalogsOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {catalogsOpen && (
                <div className="mb-2 ml-2 max-h-[40vh] space-y-0.5 overflow-y-auto border-l border-border/70 pl-2 scroll-area">
                  {brands.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => goBrand(b.slug)}
                      className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left transition-colors hover:bg-muted/70"
                    >
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: b.primaryColor }}
                      />
                      <span className="truncate text-sm text-foreground">{b.name}</span>
                      <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground/50" />
                    </button>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  openCart()
                  setMobileOpen(false)
                }}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#111] px-4 py-3 text-sm font-semibold text-white"
              >
                <ShoppingBag className="h-4 w-4" />
                Ver sacola
                {count > 0 && (
                  <span className="grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1.5 text-[10px] font-bold">
                    {count}
                  </span>
                )}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

function BrandCard({ brand, onClick }: { brand: BrandLite; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-start gap-3 rounded-xl p-2.5 text-left transition-all duration-200 hover:bg-muted/70"
    >
      <span
        className="mt-0.5 h-9 w-9 shrink-0 rounded-lg shadow-sm transition-transform duration-300 group-hover:scale-110"
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.accentColor} 130%)`,
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{brand.name}</span>
          {brand.featured && (
            <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700">
              Destaque
            </span>
          )}
        </div>
        <div className="line-clamp-1 text-xs text-muted-foreground">{brand.tagline}</div>
      </div>
    </button>
  )
}

function MobileRow({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-muted/80"
    >
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-muted text-foreground">
        {icon}
      </span>
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
    </button>
  )
}
