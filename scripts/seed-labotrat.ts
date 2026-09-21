/**
 * Aladdin Distribuidora — cadastro dos produtos LABOTRAT (catálogo real).
 *
 * Uso:  npm run db:seed:labotrat   (ou: npx tsx scripts/seed-labotrat.ts)
 *
 * Fonte: catálogo oficial LABOTRAT da plataforma Meus Pedidos (representada 454961,
 * categoria 3744620), extraído em 22/09/2026 — 72 produtos na mesma ordem de exibição
 * do site, com preços de tabela, imagens originais (arquivos.mercos.com) e categorias.
 *
 * Regras do cliente aplicadas na geração do JSON:
 *  - Somente produtos LABOTRAT (linhas LabotratPRO, Dermo Skin, Sens, Dia a Dia,
 *    Vai&Brilha e Epiltrat confirmadas como linhas oficiais da marca);
 *  - Excluídos produtos abaixo de R$ 1,00 (amostras) e produtos sem foto;
 *  - Esgotados seriam mantidos como "sem estoque" (não há esgotados hoje).
 *
 * Idempotente: pode rodar quantas vezes quiser.
 *  - Produtos são atualizados por slug (não duplica).
 *  - Produtos Labotrat antigos que não estão no JSON (placeholders de demonstração)
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

async function seedLabotrat() {
  const here = dirname(fileURLToPath(import.meta.url))
  const catalog: CatalogFile = JSON.parse(
    readFileSync(join(here, 'labotrat-catalog.json'), 'utf-8'),
  )

  console.log(`📦 Catálogo LABOTRAT: ${catalog.produtos.length} produtos, ${catalog.categorias.length} categorias`)

  // ── Marca Labotrat (mantém o tema visual existente caso já esteja cadastrada) ──
  const brand = await db.brand.upsert({
    where: { slug: 'labotrat' },
    create: {
      name: 'Labotrat',
      slug: 'labotrat',
      tagline: 'Dermocosméticos de alta performance',
      primaryColor: '#4C1D95',
      accentColor: '#C4B5FD',
      bgColor: '#FFFFFF',
      surfaceColor: '#F5F3FF',
      textColor: '#1E1B2E',
      mutedColor: '#6B7280',
      themeMode: 'light',
      fontStyle: 'serif',
      stripImageUrl: '/brands/strip-default.jpg',
      description:
        'Labotrat — dermocosméticos com DNA farmacêutico: skincare, proteção solar e cuidados de alta eficácia.',
      featured: true,
      order: 3,
    },
    update: {},
  })

  // ── Categorias (subcategorias do site, ex.: Dermo Skin, Sais Espumantes, Argila) ──
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

  // ── Limpeza: produtos Labotrat que não fazem parte do catálogo real ──
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
  console.log(`\n🎉 LABOTRAT cadastrada com excelência: ${total} produtos no catálogo.`)
  console.log(`   Preços, imagens, categorias e ordem de exibição idênticos ao site oficial da marca.`)
}

seedLabotrat()
  .catch((error) => {
    console.error('❌ Falha ao cadastrar os produtos LABOTRAT:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
