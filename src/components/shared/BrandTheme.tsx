'use client'

import * as React from 'react'
import type { Brand } from '@/lib/types'

/**
 * Wraps children in a `.brand-themed` container with CSS variables
 * derived from the brand's theme fields.
 */
export function BrandTheme({
  brand,
  children,
  className = '',
  as: Tag = 'div',
}: {
  brand: Pick<
    Brand,
    | 'primaryColor' | 'accentColor' | 'bgColor' | 'surfaceColor' | 'textColor'
    | 'mutedColor' | 'themeMode' | 'fontStyle'
  >
  children: React.ReactNode
  className?: string
  as?: React.ElementType
}) {
  // Compute foreground colors that work on top of primary/accent
  const primaryFg = isLight(brand.primaryColor) ? '#0B0B0B' : '#FFFFFF'
  const accentFg = isLight(brand.accentColor) ? '#0B0B0B' : '#FFFFFF'
  const card = mix(brand.bgColor, brand.surfaceColor, 0.5)
  const border = mix(brand.textColor, brand.bgColor, 0.85)

  const style: React.CSSProperties = {
    ['--brand-primary' as any]: brand.primaryColor,
    ['--brand-primary-fg' as any]: primaryFg,
    ['--brand-accent' as any]: brand.accentColor,
    ['--brand-accent-fg' as any]: accentFg,
    ['--brand-bg' as any]: brand.bgColor,
    ['--brand-surface' as any]: brand.surfaceColor,
    ['--brand-fg' as any]: brand.textColor,
    ['--brand-muted' as any]: brand.mutedColor,
    ['--brand-card' as any]: card,
    ['--brand-border' as any]: border,
  }
  return (
    <Tag
      className={`brand-themed ${brand.fontStyle === 'serif' ? 'brand-serif' : ''} ${brand.themeMode === 'dark' ? 'dark' : ''} ${className}`}
      style={style}
    >
      {children}
    </Tag>
  )
}

// ── Color helpers ────────────────────────────────────────────────────────────

function hexToRgb(hex: string) {
  const h = hex.replace('#', '')
  const v =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h
  const n = parseInt(v, 16)
  if (isNaN(n)) return { r: 0, g: 0, b: 0 }
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function isLight(hex: string) {
  const { r, g, b } = hexToRgb(hex)
  // Relative luminance (approx)
  const l = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return l > 0.6
}

function mix(a: string, b: string, t: number) {
  const ca = hexToRgb(a)
  const cb = hexToRgb(b)
  const r = Math.round(ca.r * (1 - t) + cb.r * t)
  const g = Math.round(ca.g * (1 - t) + cb.g * t)
  const bl = Math.round(ca.b * (1 - t) + cb.b * t)
  return `#${[r, g, bl].map((x) => x.toString(16).padStart(2, '0')).join('')}`
}
