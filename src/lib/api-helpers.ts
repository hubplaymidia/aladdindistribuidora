import { db } from '@/lib/db'
import { readJson } from '@/lib/format'
import { cookies } from 'next/headers'
import { createHash } from 'node:crypto'

// ── Serialization ────────────────────────────────────────────────────────────
// Convert Prisma rows (with JSON-encoded image arrays) into plain API objects.

export function serializeBrand(b: any) {
  return {
    id: b.id,
    name: b.name,
    slug: b.slug,
    tagline: b.tagline ?? '',
    primaryColor: b.primaryColor,
    accentColor: b.accentColor,
    bgColor: b.bgColor,
    surfaceColor: b.surfaceColor,
    textColor: b.textColor,
    mutedColor: b.mutedColor,
    themeMode: b.themeMode,
    fontStyle: b.fontStyle,
    logoUrl: b.logoUrl ?? null,
    stripImageUrl: b.stripImageUrl ?? null,
    stripFit: b.stripFit ?? 'cover',
    heroImageUrl: b.heroImageUrl ?? null,
    description: b.description ?? '',
    featured: !!b.featured,
    order: b.order,
  }
}

export function serializeCategory(c: any) {
  return {
    id: c.id,
    name: c.name,
    slug: c.slug,
    order: c.order,
  }
}

export function serializeProduct(p: any) {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    brandId: p.brandId,
    brandName: p.brand?.name ?? null,
    brandSlug: p.brand?.slug ?? null,
    brandColor: p.brand?.primaryColor ?? null,
    categoryId: p.categoryId ?? null,
    categoryName: p.category?.name ?? null,
    categorySlug: p.category?.slug ?? null,
    price: p.price,
    oldPrice: p.oldPrice ?? null,
    showPrice: p.showPrice ?? true,
    quantity: p.quantity,
    minQuantity: p.minQuantity,
    unit: p.unit ?? null,
    description: p.description ?? '',
    images: readJson<string[]>(p.images, []),
    featured: !!p.featured,
    active: p.active ?? true,
    order: p.order,
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }
}

export function serializeRep(r: any) {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    photoUrl: r.photoUrl ?? null,
    whatsapp: r.whatsapp,
    bio: r.bio ?? '',
    instagram: r.instagram ?? null,
    region: r.region ?? null,
    active: !!r.active,
    order: r.order,
  }
}

export function serializeCourse(c: any) {
  return {
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description ?? '',
    category: c.category,
    coverUrl: c.coverUrl ?? null,
    instructor: c.instructor ?? null,
    duration: c.duration ?? null,
    level: c.level,
    featured: !!c.featured,
    order: c.order,
    lessonsCount: c.lessons?.length ?? 0,
    lessons: (c.lessons ?? []).map((l: any) => ({
      id: l.id,
      title: l.title,
      youtubeUrl: l.youtubeUrl,
      duration: l.duration ?? null,
      order: l.order,
    })),
  }
}

export function serializeArticle(a: any) {
  return {
    id: a.id,
    title: a.title,
    slug: a.slug,
    excerpt: a.excerpt,
    category: a.category,
    cover: a.cover ?? null,
    author: a.author,
    readTime: a.readTime,
    publishedAt: a.publishedAt,
    content: a.content,
  }
}

export function serializeSettings(s: any) {
  return {
    id: s.id,
    brandName: s.brandName,
    heroTitle: s.heroTitle,
    heroSubtitle: s.heroSubtitle,
    heroImageUrl: s.heroImageUrl ?? null,
    heroBadge: s.heroBadge,
    institutionalText: s.institutionalText,
    address: s.address,
    phone: s.phone,
    whatsapp: s.whatsapp,
    instagram1: s.instagram1,
    instagram2: s.instagram2,
    wazeUrl: s.wazeUrl ?? null,
    mapsUrl: s.mapsUrl ?? null,
    mapEmbed: s.mapEmbed ?? null,
    yearsExperience: s.yearsExperience,
    brandsCount: s.brandsCount,
  }
}

// ── Admin auth (cookie-session) ──────────────────────────────────────────────
const SESSION_COOKIE = 'aladdin_admin'
// Simple deterministic session token: sha256(username + ':' + passwordHash).
// Not cryptographic-grade, but fine for an admin panel on a content site.
function sessionToken(username: string, passwordHash: string) {
  return createHash('sha256')
    .update(`${username}:${passwordHash}`)
    .digest('hex')
}

export async function verifyAdmin() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  const admins = await db.adminUser.findMany()
  for (const a of admins) {
    if (sessionToken(a.username, a.passwordHash) === token) {
      return { id: a.id, username: a.username }
    }
  }
  return null
}

export async function setAdminSession(username: string, passwordHash: string) {
  const token = sessionToken(username, passwordHash)
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function clearAdminSession() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
}
