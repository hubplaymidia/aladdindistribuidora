'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { ChevronLeft, Home } from 'lucide-react'

/**
 * Consistent "Voltar" control used at the top of every sub-page.
 * - Clicking the label navigates contextually (e.g. back to the brand's
 *   catalog from a product page) via `onBack`.
 * - The small home icon is always a one-tap escape hatch back to the
 *   homepage, so users never feel stuck deep in the site.
 * Pairs with the real browser-history fix in store-app.ts: the device/
 * browser back button now also works, this bar is for in-page navigation.
 */
export function BackBar({
  label,
  onBack,
  tone = 'light',
  className = '',
}: {
  label: string
  onBack: () => void
  tone?: 'light' | 'dark'
  className?: string
}) {
  const navigate = useApp((s) => s.navigate)
  const isDark = tone === 'dark'

  return (
    <div className={`mb-5 flex items-center gap-2 ${className}`}>
      <button
        type="button"
        onClick={onBack}
        className={
          isDark
            ? 'inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/15 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur transition-all hover:-translate-x-0.5 hover:bg-black/25'
            : 'nav-back-btn'
        }
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        {label}
      </button>
      {label !== 'Início' && (
        <button
          type="button"
          onClick={() => navigate({ name: 'home' })}
          aria-label="Ir para o início"
          title="Ir para o início"
          className={
            isDark
              ? 'inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/15 text-white backdrop-blur transition-colors hover:bg-black/25'
              : 'nav-close-btn'
          }
        >
          <Home className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
