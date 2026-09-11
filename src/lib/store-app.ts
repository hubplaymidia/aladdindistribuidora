'use client'

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// ─────────────────────────────────────────────────────────────────────────────
// SPA router. The user said "user can only see the / route defined in src/app/page.tsx".
// So we use a single-page-app navigation: a `view` state drives what the page renders.
// Supported views: home | catalog (general products) | brand | product-detail |
//                  academy | academy-course | blog | article | reps | contact | admin
// ─────────────────────────────────────────────────────────────────────────────
export type View =
  | { name: 'home' }
  | { name: 'catalog'; brandSlug?: string; categorySlug?: string; q?: string }
  | { name: 'brand'; brandSlug: string; categorySlug?: string; q?: string }
  | { name: 'product'; productSlug: string }
  | { name: 'academy'; category?: string }
  | { name: 'course'; courseSlug: string; lessonId?: string }
  | { name: 'blog'; category?: string }
  | { name: 'article'; articleSlug: string }
  | { name: 'reps' }
  | { name: 'contact' }
  | { name: 'admin' }

type AppState = {
  view: View
  // Brand theme cache (per-brand visual style). Keyed by brand slug.
  brandThemes: Record<string, BrandTheme>
  // Pending admin login flag
  adminAuthed: boolean
  navigate: (view: View) => void
  goBack: () => void
  setBrandTheme: (slug: string, theme: BrandTheme) => void
  setAdminAuthed: (v: boolean) => void
}

// Internal marker so we can tell "an in-app navigation" apart from the entry
// that existed before the app took over history (that one should exit normally).
type HistoryEntry = { __aladdinView: View }

let historySynced = false

/**
 * Wires the SPA `view` state to the real browser History API so the native
 * back/forward buttons (and mobile swipe-back gestures) move between the
 * app's own screens instead of immediately leaving the site.
 * Safe to call multiple times — only attaches listeners once.
 */
export function initHistorySync() {
  if (typeof window === 'undefined' || historySynced) return
  historySynced = true

  const current = window.history.state as HistoryEntry | null
  if (!current?.__aladdinView) {
    // Seed the entry we're already on, so the very first "back" press still
    // leaves the site as expected — only navigations made *inside* the app
    // create extra, back-able history entries.
    window.history.replaceState({ __aladdinView: useApp.getState().view }, '', window.location.href)
  }

  window.addEventListener('popstate', (event) => {
    const state = event.state as HistoryEntry | null
    if (state?.__aladdinView) {
      useApp.setState({ view: state.__aladdinView })
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
    }
  })
}

export type BrandTheme = {
  primaryColor: string
  accentColor: string
  bgColor: string
  surfaceColor: string
  textColor: string
  mutedColor: string
  themeMode: 'light' | 'dark'
  fontStyle: 'serif' | 'sans'
}

export const useApp = create<AppState>()(
  persist(
    (set) => ({
      view: { name: 'home' },
      brandThemes: {},
      adminAuthed: false,
      navigate: (view) => {
        set({ view })
        // Scroll to top on navigation
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior })
          // Push a real history entry so the browser/device back button (and
          // swipe-back gestures) return to the previous screen inside the
          // app instead of exiting the site.
          window.history.pushState({ __aladdinView: view } as HistoryEntry, '', window.location.href)
        }
      },
      goBack: () => {
        if (typeof window !== 'undefined' && (window.history.state as HistoryEntry | null)?.__aladdinView) {
          window.history.back()
        } else {
          set({ view: { name: 'home' } })
        }
      },
      setBrandTheme: (slug, theme) =>
        set((s) => ({ brandThemes: { ...s.brandThemes, [slug]: theme } })),
      setAdminAuthed: (v) => set({ adminAuthed: v }),
    }),
    {
      name: 'aladdin-app',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ view: s.view, adminAuthed: s.adminAuthed }),
    }
  )
)
