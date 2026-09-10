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
  setBrandTheme: (slug: string, theme: BrandTheme) => void
  setAdminAuthed: (v: boolean) => void
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
