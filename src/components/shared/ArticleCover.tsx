'use client'

import * as React from 'react'

// Paleta premium sólida — sem verde, tons ricos que conversam com a identidade
// preto/grafite/dourado do site. Cada artigo recebe uma cor fixa (hash do slug),
// então a mesma capa nunca muda de cor entre a Home, o Blog e a página do artigo.
const PALETTE = [
  { base: '#141210', glow: '#C9A227' }, // grafite + dourado
  { base: '#5c1a2b', glow: '#e6a9bb' }, // bordô
  { base: '#1b2733', glow: '#8fb4d9' }, // azul-tinta
  { base: '#3a1f3d', glow: '#c99ad4' }, // ameixa
  { base: '#7a1f3a', glow: '#f2a6bf' }, // vinho rosado
  { base: '#3b2a1f', glow: '#d9a86c' }, // espresso
  { base: '#7a4a12', glow: '#f0c988' }, // âmbar
  { base: '#2b2f33', glow: '#c9c2b4' }, // chumbo
  { base: '#8a3b2a', glow: '#f0a688' }, // terracota
  { base: '#4a1f1f', glow: '#e2a2a2' }, // terracota escuro
]

function hashSeed(seed: string) {
  let h = 0
  for (let i = 0; i < seed.length; i++) {
    h = (h << 5) - h + seed.charCodeAt(i)
    h |= 0
  }
  return Math.abs(h)
}

export function coverColor(seed: string) {
  return PALETTE[hashSeed(seed) % PALETTE.length]
}

export function ArticleCover({
  seed,
  category,
  title,
  className = '',
}: {
  seed: string
  category?: string
  title?: string
  className?: string
}) {
  const { base, glow } = coverColor(seed)
  const initial = (title || category || 'A').trim().charAt(0).toUpperCase()

  return (
    <div
      className={`relative flex h-full w-full items-center justify-center overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at 20% -10%, ${glow}33, transparent 55%), radial-gradient(circle at 100% 120%, ${glow}22, transparent 45%), linear-gradient(135deg, ${base} 0%, ${base} 60%, ${glow}1a 100%)`,
      }}
    >
      {/* Diagonal shine effect */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-transform duration-700 group-hover:translate-x-2"
        style={{
          background: `linear-gradient(115deg, transparent 40%, ${glow}26 50%, transparent 62%)`,
        }}
      />
      {/* Fine grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '22px 22px',
        }}
      />
      {/* Oversized initial as background typography */}
      <span
        className="pointer-events-none select-none font-serif font-bold leading-none"
        style={{
          fontSize: '7.5rem',
          color: `${glow}2e`,
        }}
      >
        {initial}
      </span>
      {category && (
        <span
          className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur"
          style={{ background: `${glow}26`, color: glow }}
        >
          {category}
        </span>
      )}
    </div>
  )
}
