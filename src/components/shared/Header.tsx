'use client'

import * as React from 'react'
import Link from 'next/link'
import { useApp } from '@/lib/store-app'
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Menu, ShoppingBag, Sparkles } from 'lucide-react'
import { api } from '@/lib/api'

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
  const count = cartCount(cartItems)

  const featuredBrands = brands.filter((b) => b.featured)
  const otherBrands = brands.filter((b) => !b.featured)

  const goBrand = (slug: string) => {
    navigate({ name: 'brand', brandSlug: slug })
    setMobileOpen(false)
  }

  const go = (view: any) => {
    navigate(view)
    setMobileOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        {/* Logo */}
        <button
          onClick={() => go({ name: 'home' })}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="Ir para a página inicial"
        >
          <span
            className="grid h-10 w-10 place-items-center rounded-full text-white shadow-sm"
            style={{
              background:
                'linear-gradient(135deg, #080808 0%, #232323 62%, #C9A227 165%)',
            }}
          >
            <span className="font-serif text-xl font-bold leading-none">A</span>
          </span>
          <span className="flex flex-col leading-tight">
            <span className="font-serif text-base font-bold tracking-tight text-foreground">
              Aladdin
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Distribuidora
            </span>
          </span>
        </button>

        {/* Desktop nav */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => go({ name: 'home' })}
              >
                Inicial
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Catálogos</NavigationMenuTrigger>
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
                className={navigationMenuTriggerStyle()}
                onClick={() => go({ name: 'catalog' })}
              >
                Produtos
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => go({ name: 'blog' })}
              >
                Blog
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                onClick={() => go({ name: 'contact' })}
              >
                Contato
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-2">
          {/* Pulsing cart */}
          <button
            onClick={openCart}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#111] text-white shadow-sm ring-1 ring-black/10 transition-transform hover:scale-105 animate-pulse-ring"
            aria-label="Abrir sacola"
          >
            <ShoppingBag className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-amber-500 px-1 text-[10px] font-bold text-white ring-2 ring-background">
                {count}
              </span>
            )}
          </button>

          {/* Mobile menu trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Abrir menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[340px]">
              <SheetHeader>
                <SheetTitle className="font-serif">Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 flex flex-col gap-1">
                <MobileLink onClick={() => go({ name: 'home' })}>Inicial</MobileLink>
                <div className="px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Catálogos
                </div>
                <div className="ml-3 flex flex-col gap-0.5 max-h-72 overflow-y-auto scroll-area pr-1">
                  {brands.map((b) => (
                    <MobileLink key={b.id} onClick={() => goBrand(b.slug)}>
                      <span
                        className="mr-2 inline-block h-2 w-2 rounded-full"
                        style={{ background: b.primaryColor }}
                      />
                      {b.name}
                    </MobileLink>
                  ))}
                </div>
                <MobileLink onClick={() => go({ name: 'catalog' })}>Produtos</MobileLink>
                <MobileLink onClick={() => go({ name: 'blog' })}>Blog</MobileLink>
                <MobileLink onClick={() => go({ name: 'contact' })}>Contato</MobileLink>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

function BrandCard({ brand, onClick }: { brand: BrandLite; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-start gap-3 rounded-lg p-2.5 text-left transition-colors hover:bg-muted/70"
    >
      <span
        className="mt-0.5 h-9 w-9 shrink-0 rounded-md shadow-sm transition-transform group-hover:scale-105"
        style={{
          background: `linear-gradient(135deg, ${brand.primaryColor} 0%, ${brand.accentColor} 130%)`,
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-sm text-foreground">{brand.name}</span>
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

function MobileLink({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-md px-3 py-2 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
    >
      {children}
    </button>
  )
}
