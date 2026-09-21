/**
 * Aladdin Distribuidora — cadastro dos produtos SP COLORS (catálogo real).
 *
 * Uso:  npm run db:seed:sp-colors   (ou: npx tsx scripts/seed-sp-colors.ts)
 *
 * Fonte: catálogo oficial da plataforma Meus Pedidos (representada 454961,
 * categoria 3144687), extraído em 22/09/2026, na mesma ordem de exibição do site,
 * com preços de tabela, imagens originais (arquivos.mercos.com) e categorias.
 *
 * Idempotente: pode rodar quantas vezes quiser.
 *  - Produtos são atualizados por slug (não duplica).
 *  - Slugs que pertencem a outra marca recebem sufixo com o slug desta marca
 *    (nunca rouba o produto de outra marca).
 *  - Produtos antigos de demonstração desta marca que não estão no JSON são
 *    removidos para o catálogo ficar 100% fiel.
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { db } from '../src/lib/db'
import { slugify } from '../src/lib/format'

type CatalogProduct = {
  ordem: number
  nome: string
  codigo: string
  unidade: string
  preco: number
  categoria: string | null
  esgotado: boolean
  saldo: number
  imagens: string[]
  descricao: string | null
}

type CatalogFile = {
  fonte: string
  total: number
  categorias: { nome: string; slug: string; ordem: number }[]
  produtos: CatalogProduct[]
}

async function seedBrand() {
  const here = dirname(fileURLToPath(import.meta.url))
  const catalog: CatalogFile = JSON.parse(
    readFileSync(join(here, 'sp-colors-catalog.json'), 'utf-8'),
  )

  console.log(`📦 Catálogo SP COLORS: ${catalog.produtos.length} produtos, ${catalog.categorias.length} categorias`)

  // ── Marca (mantém o tema visual existente caso já esteja cadastrada) ──
  const brand = await db.brand.upsert({
    where: { slug: 'sp-colors' },
    create: {
      name: 'SP Colors',
      slug: 'sp-colors',
      tagline: 'Cores que transformam o look',
      primaryColor: '#B91C1C',
      accentColor: '#F59E0B',
      bgColor: '#FFFFFF',
      surfaceColor: '#FEF2F2',
      textColor: '#1F1A1A',
      mutedColor: '#6B7280',
      themeMode: 'light',
      fontStyle: 'sans',
      stripImageUrl: '/brands/strip-default.jpg',
      description: 'SP Colors — esmaltes de alta cobertura, paletas corretivas e dermográficos para maquiagem profissional.',
      featured: false,
      order: 6,
    },
    update: {},
  })

  // ── Categorias (subcategorias do site) ──
  const catIdBySlug: Record<string, string> = {}
  for (const c of catalog.categorias) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      create: { name: c.nome, slug: c.slug, order: c.ordem },
      update: { name: c.nome, order: c.ordem },
    })
    catIdBySlug[c.slug] = row.id
  }
  console.log(`✓ ${catalog.categorias.length} categorias prontas`)

  // ── Produtos ──
  const keptSlugs: string[] = []
  let created = 0
  let updated = 0

  for (const p of catalog.produtos) {
    let slugFinal = slugify(p.nome)
    const dono = await db.product.findUnique({ where: { slug: slugFinal }, select: { brandId: true } })
    if (dono && dono.brandId !== brand.id) {
      slugFinal = `${slugFinal}-${brand.slug}`
    }
    const existente = await db.product.findUnique({ where: { slug: slugFinal }, select: { brandId: true } })
    if (existente && existente.brandId !== brand.id) {
      console.warn(`⚠️ Conflito de slug não resolvido para "${p.nome}" (${slugFinal}); produto ignorado.`)
      continue
    }
    keptSlugs.push(slugFinal)
    const data = {
      name: p.nome,
      slug: slugFinal,
      brandId: brand.id,
      categoryId: p.categoria ? (catIdBySlug[p.categoria] ?? null) : null,
      price: p.preco,
      oldPrice: null,
      // esgotado no site → quantidade 0 (o produto continua visível no catálogo)
      quantity: p.esgotado ? 0 : Math.min(p.saldo || 0, 9999),
      minQuantity: 1,
      unit: p.unidade,
      description: p.descricao,
      images: JSON.stringify(p.imagens.slice(0, 6)),
      showPrice: true,
      featured: false,
      active: true,
      order: p.ordem,
    }
    if (existente) {
      await db.product.update({ where: { slug: slugFinal }, data })
      updated++
    } else {
      await db.product.create({ data })
      created++
    }
  }
  console.log(`✓ Produtos criados: ${created} | atualizados: ${updated}`)

  // ── Limpeza: produtos desta marca que não fazem parte do catálogo real ──
  const brandProducts = await db.product.findMany({
    where: { brandId: brand.id },
    select: { slug: true, name: true },
  })
  const kept = new Set(keptSlugs)
  const stale = brandProducts.filter((p) => !kept.has(p.slug))
  for (const s of stale) {
    await db.product.delete({ where: { slug: s.slug } })
  }
  if (stale.length) {
    console.log(`🧹 ${stale.length} produtos antigos de demonstração removidos:`)
    for (const s of stale) console.log(`   - ${s.name}`)
  }

  const total = await db.product.count({ where: { brandId: brand.id } })
  console.log(`\n🎉 SP COLORS cadastrada com excelência: ${total} produtos no catálogo.`)
}

seedBrand()
  .catch((error) => {
    console.error('❌ Falha ao cadastrar os produtos SP COLORS:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
