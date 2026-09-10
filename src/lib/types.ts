// Shared client-side types matching API responses.

export type Brand = {
  id: string
  name: string
  slug: string
  tagline: string
  primaryColor: string
  accentColor: string
  bgColor: string
  surfaceColor: string
  textColor: string
  mutedColor: string
  themeMode: 'light' | 'dark'
  fontStyle: 'serif' | 'sans'
  logoUrl: string | null
  stripImageUrl: string | null
  stripFit: string
  heroImageUrl: string | null
  description: string
  featured: boolean
  order: number
  productsCount?: number
}

export type BrandDetail = Brand & {
  products: BrandProduct[]
  videos: BrandVideo[]
  categories: Category[]
}

export type BrandVideo = {
  id: string
  title: string
  youtubeUrl: string
  thumbnail: string | null
  order: number
}

export type Category = {
  id: string
  name: string
  slug: string
  order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  brandId: string
  brandName: string | null
  brandSlug: string | null
  brandColor: string | null
  categoryId: string | null
  categoryName: string | null
  categorySlug: string | null
  price: number
  oldPrice: number | null
  showPrice: boolean
  quantity: number
  minQuantity: number
  unit: string | null
  description: string
  images: string[]
  featured: boolean
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
  related?: Product[]
}

export type BrandProduct = {
  id: string
  name: string
  slug: string
  categoryId: string | null
  categoryName: string | null
  categorySlug: string | null
  price: number
  oldPrice: number | null
  showPrice: boolean
  unit: string | null
  image: string | null
  featured: boolean
}

export type Representative = {
  id: string
  name: string
  slug: string
  photoUrl: string | null
  whatsapp: string
  bio: string
  instagram: string | null
  region: string | null
  active: boolean
  order: number
}

export type Lesson = {
  id: string
  title: string
  youtubeUrl: string
  duration: string | null
  order: number
}

export type Course = {
  id: string
  title: string
  slug: string
  description: string
  category: string
  coverUrl: string | null
  instructor: string | null
  duration: string | null
  level: string
  featured: boolean
  order: number
  lessonsCount: number
  lessons: Lesson[]
}

export type BlogArticle = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  cover: string | null
  author: string
  readTime: number
  publishedAt: string
  content: string
  related?: BlogArticle[]
}

export type SiteSettings = {
  id: string
  brandName: string
  heroTitle: string
  heroSubtitle: string
  heroImageUrl: string | null
  heroBadge: string
  institutionalText: string
  address: string
  phone: string
  whatsapp: string
  instagram1: string
  instagram2: string
  wazeUrl: string | null
  mapsUrl: string | null
  mapEmbed: string | null
  yearsExperience: number
  brandsCount: number
}
