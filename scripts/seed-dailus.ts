/**
 * Aladdin Distribuidora — cadastro dos produtos DAILUS (catálogo real).
 *
 * Uso:  npm run db:seed:dailus   (ou: npx tsx scripts/seed-dailus.ts)
 *
 * Fonte: catálogo oficial DAILUS da plataforma Meus Pedidos (representada 454961),
 * extraído em 21/09/2026 — 666 produtos na mesma ordem de exibição do site,
 * com preços de tabela, imagens originais (arquivos.mercos.com) e descrições.
 *
 * Idempotente: pode rodar quantas vezes quiser.
 *  - Produtos são atualizados por slug (não duplica).
 *  - Produtos Dailus antigos que não estão no JSON (placeholders de demonstração)
 *    são removidos para o catálogo ficar 100% fiel à marca.
 *  - Categorias (subcategorias do site) são criadas por slug e vinculadas.
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

async function seedDailus() {
  const here = dirname(fileURLToPath(import.meta.url))
  const catalog: CatalogFile = JSON.parse(
    readFileSync(join(here, 'dailus-catalog.json'), 'utf-8'),
  )

  console.log(`📦 Catálogo DAILUS: ${catalog.produtos.length} produtos, ${catalog.categorias.length} categorias`)

  // ── Marca Dailus (mantém o tema visual existente caso já esteja cadastrada) ──
  const brand = await db.brand.upsert({
    where: { slug: 'dailus' },
    create: {
      name: 'Dailus',
      slug: 'dailus',
      tagline: 'Maquiagem que traduz sua beleza',
      primaryColor: '#C9184A',
      accentColor: '#1A1A1A',
      bgColor: '#FFFFFF',
      surfaceColor: '#FFF1F5',
      textColor: '#1A1A1A',
      mutedColor: '#7A6B70',
      themeMode: 'light',
      fontStyle: 'sans',
      stripImageUrl: '/brands/strip-dailus.jpg',
      description:
        'Dailus — maquiagem profissional brasileira. Batons matte, paletas de sombras, bases HD e tudo para um make impecável.',
      featured: true,
      order: 2,
    },
    update: {},
  })

  // ── Categorias (subcategorias do site, ex.: Esmaltes, Base Líquida, Blush) ──
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
    const slug = slugify(p.nome)
    keptSlugs.push(slug)
    const data = {
      name: p.nome,
      slug,
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
    const existing = await db.product.findUnique({ where: { slug }, select: { id: true } })
    if (existing) {
      await db.product.update({ where: { slug }, data })
      updated++
    } else {
      await db.product.create({ data })
      created++
    }
  }
  console.log(`✓ Produtos criados: ${created} | atualizados: ${updated}`)

  // ── Limpeza: produtos Dailus que não fazem parte do catálogo real ──
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
  console.log(`\n🎉 DAILUS cadastrada com excelência: ${total} produtos no catálogo.`)
  console.log(`   Preços, imagens (incluindo produtos com múltiplas fotos), descrições e`)
  console.log(`   ordem de exibição idênticos ao site oficial da marca.`)
}

seedDailus()
  .catch((error) => {
    console.error('❌ Falha ao cadastrar os produtos DAILUS:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
