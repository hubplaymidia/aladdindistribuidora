/**
 * Aladdin Distribuidora — seed script.
 *
 * Usage:  bun run scripts/seed.ts
 *
 * Idempotent: re-running updates existing rows by slug rather than duplicating.
 */
import { db } from '../src/lib/db'
import { slugify } from '../src/lib/format'

// ─────────────────────────────────────────────────────────────────────────────
// BRANDS — each with its own visual theme (per the user's spec)
// ─────────────────────────────────────────────────────────────────────────────
const brands = [
  {
    name: 'Knut Hair Care',
    slug: 'knut-hair-care',
    tagline: 'Cuidado profissional para os fios',
    // Black / white / a bit of gold / light gray (user spec)
    primaryColor: '#0B0B0B',
    accentColor: '#C9A227',
    bgColor: '#FFFFFF',
    surfaceColor: '#F5F4F1',
    textColor: '#0B0B0B',
    mutedColor: '#6B7280',
    themeMode: 'light',
    fontStyle: 'serif',
    stripImageUrl: '/brands/strip-knut.jpg',
    heroImageUrl: '/hero/hero-main.png',
    description:
      'Linha profissional Knut Hair Care: detox, reconstrução, hidratação e finalização. Fórmulas de alta performance para salão e uso doméstico.',
    featured: true,
    order: 1,
  },
  {
    name: 'Dailus',
    slug: 'dailus',
    tagline: 'Maquiagem que traduz sua beleza',
    // Pink / black / white premium makeup palette
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
  {
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
    featured: false,
    order: 3,
  },
  {
    name: 'Sffumato Beauty',
    slug: 'sffumato-beauty',
    tagline: 'Pincéis e acessórios de make',
    primaryColor: '#5B4A5A',
    accentColor: '#D4A574',
    bgColor: '#FFFFFF',
    surfaceColor: '#F7F3F0',
    textColor: '#2A2326',
    mutedColor: '#7A6E72',
    themeMode: 'light',
    fontStyle: 'serif',
    stripImageUrl: '/brands/strip-default.jpg',
    description:
      'Sffumato Beauty — skincare premium com ativos como ácido hialurônico e vitamina C. Sofisticação em cada gesto.',
    featured: false,
    order: 4,
  },
  {
    name: '#SUPER PODERES',
    slug: 'super-poderes',
    tagline: 'Poder feminino em cada produto',
    primaryColor: '#831843',
    accentColor: '#F59E0B',
    bgColor: '#FFFFFF',
    surfaceColor: '#FFF7ED',
    textColor: '#2A1A20',
    mutedColor: '#7A6B70',
    themeMode: 'light',
    fontStyle: 'sans',
    stripImageUrl: '/brands/strip-default.jpg',
    description:
      '#SUPER PODERES — linha de cosméticos e maquiagem que empodera mulheres empreendedoras.',
    featured: false,
    order: 5,
  },
  {
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
    description:
      'SP Colors — esmaltes de alta cobertura, paletas corretivas e dermográficos para maquiagem profissional.',
    featured: false,
    order: 6,
  },
  {
    name: 'DO.HA Professional',
    slug: 'doha-professional',
    tagline: 'Performance profissional nos fios',
    primaryColor: '#92400E',
    accentColor: '#FCD34D',
    bgColor: '#FFFFFF',
    surfaceColor: '#FFFBEB',
    textColor: '#1F1A12',
    mutedColor: '#7A6E5A',
    themeMode: 'light',
    fontStyle: 'serif',
    stripImageUrl: '/brands/strip-default.jpg',
    description:
      'Doha Professional — produtos de uso salão: shampoos neutros, progressivas orgânicas e protetores térmicos.',
    featured: false,
    order: 7,
  },
  {
    name: 'City Girls',
    slug: 'city-girls',
    tagline: 'Beleza jovem, ousada e vibrante',
    primaryColor: '#DB2777',
    accentColor: '#F472B6',
    bgColor: '#FFFFFF',
    surfaceColor: '#FDF2F8',
    textColor: '#2A1A20',
    mutedColor: '#7A6B70',
    themeMode: 'light',
    fontStyle: 'sans',
    stripImageUrl: '/brands/strip-default.jpg',
    description:
      'City Girls — linha jovem e vibrante de maquiagem: glosses, blushes iluminadores e kits de pincéis.',
    featured: false,
    order: 8,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORIES
// ─────────────────────────────────────────────────────────────────────────────
const categories = [
  { name: 'Shampoo', slug: 'shampoo', order: 1 },
  { name: 'Condicionador', slug: 'condicionador', order: 2 },
  { name: 'Máscara / Creme', slug: 'mascara-creme', order: 3 },
  { name: 'Tratamentos', slug: 'tratamentos', order: 4 },
  { name: 'Finalizadores', slug: 'finalizadores', order: 5 },
  { name: 'Maquiagem', slug: 'maquiagem', order: 6 },
  { name: 'Skincare', slug: 'skincare', order: 7 },
  { name: 'Unhas', slug: 'unhas', order: 8 },
  { name: 'Acessórios', slug: 'acessorios', order: 9 },
]

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCTS — placeholder images; admin can replace later via painel admin.
// Real product images for KNUT and Dailus come from the official KNUT/Dailus
// catalog search hits stored under /products/real/.
// ─────────────────────────────────────────────────────────────────────────────
type SeedProduct = {
  name: string
  brandSlug: string
  catSlug: string
  price: number
  oldPrice?: number
  qty: number
  minQty: number
  unit?: string
  desc: string
  images: string[]
  featured?: boolean
}

const products: SeedProduct[] = [
  // ── KNUT HAIR CARE ───────────────────────────────────────────────────────
  {
    name: 'Shampoo Detox Knut 300ml',
    brandSlug: 'knut-hair-care',
    catSlug: 'shampoo',
    price: 39.9,
    qty: 120,
    minQty: 3,
    unit: '300ml',
    desc: 'Shampoo detox com ação purificante que remove resíduos e impurezas sem ressecar os fios.',
    images: ['/products/placeholder-hair-1.jpg'],
    featured: true,
  },
  {
    name: 'Condicionador Reconstrutor Knut 300ml',
    brandSlug: 'knut-hair-care',
    catSlug: 'condicionador',
    price: 42.9,
    qty: 100,
    minQty: 3,
    unit: '300ml',
    desc: 'Condicionador reconstrutor com proteínas e queratina que devolve a massa e o brilho aos fios danificados.',
    images: ['/products/placeholder-hair-2.jpg'],
  },
  {
    name: 'Máscara Capilar Hidratante Knut 1kg',
    brandSlug: 'knut-hair-care',
    catSlug: 'mascara-creme',
    price: 89.9,
    qty: 60,
    minQty: 2,
    unit: '1kg',
    desc: 'Máscara de hidratação profunda em embalagem profissional. Repara a fibra capilar e prolonga o alinhamento dos fios.',
    images: ['/products/placeholder-hair-1.jpg'],
    featured: true,
  },
  {
    name: 'Leave-in Defrizante Knut 200ml',
    brandSlug: 'knut-hair-care',
    catSlug: 'finalizadores',
    price: 49.9,
    qty: 80,
    minQty: 3,
    unit: '200ml',
    desc: 'Leave-in defrizante com proteção térmica que controla o frizz e facilita a finalização.',
    images: ['/products/placeholder-hair-2.jpg'],
  },
  {
    name: 'Óleo de Tratamento Capilar Knut 60ml',
    brandSlug: 'knut-hair-care',
    catSlug: 'tratamentos',
    price: 54.9,
    qty: 90,
    minQty: 3,
    unit: '60ml',
    desc: 'Óleo multifuncional com argan e macadâmia para selar as pontas e dar brilho instantâneo.',
    images: ['/products/placeholder-hair-2.jpg', '/products/placeholder-hair-1.jpg'],
  },
  // ── DAILUS ───────────────────────────────────────────────────────────────
  {
    name: 'Batom Líquido Matte Dailus',
    brandSlug: 'dailus',
    catSlug: 'maquiagem',
    price: 29.9,
    qty: 150,
    minQty: 6,
    desc: 'Batom líquido de longa duração com acabamento matte aveludado. Não transfere e não resseca os lábios.',
    images: ['/products/placeholder-makeup-1.jpg'],
    featured: true,
  },
  {
    name: 'Paleta de Sombras Dailus 12 Cores',
    brandSlug: 'dailus',
    catSlug: 'maquiagem',
    price: 69.9,
    qty: 70,
    minQty: 3,
    desc: 'Paleta com 12 tons entre matte e cintilantes, alta pigmentação e fácil esfumado.',
    images: ['/products/placeholder-makeup-2.jpg', '/products/placeholder-makeup-1.jpg'],
  },
  {
    name: 'Base Líquida HD Dailus',
    brandSlug: 'dailus',
    catSlug: 'maquiagem',
    price: 44.9,
    qty: 85,
    minQty: 4,
    desc: 'Base de cobertura média a full com acabamento natural e FPS. Disponível em vários tons.',
    images: ['/products/placeholder-makeup-1.jpg'],
  },
  {
    name: 'Máscara para Cílios Volume Dailus',
    brandSlug: 'dailus',
    catSlug: 'maquiagem',
    price: 27.9,
    qty: 110,
    minQty: 6,
    desc: 'Rímel que dá volume e alongamento imediatos sem empelotar.',
    images: ['/products/placeholder-makeup-1.jpg', '/products/placeholder-makeup-2.jpg'],
  },
  // ── LABOTRAT ──────────────────────────────────────────────────────────────
  {
    name: 'Tônico Antiqueda Labotrat 120ml',
    brandSlug: 'labotrat',
    catSlug: 'tratamentos',
    price: 79.9,
    qty: 50,
    minQty: 2,
    desc: 'Tônico capilar com ativos que estimulam o folículo e reduzem a queda. Uso diário.',
    images: ['/products/placeholder-hair-2.jpg'],
    featured: true,
  },
  {
    name: 'Botox Capilar Labotrat 1kg',
    brandSlug: 'labotrat',
    catSlug: 'tratamentos',
    price: 119.9,
    qty: 40,
    minQty: 1,
    desc: 'Tratamento de botox capilar profissional para alinhamento, redução de volume e brilho intenso.',
    images: ['/products/placeholder-hair-1.jpg', '/products/placeholder-hair-2.jpg'],
  },
  {
    name: 'Repositor de Massa Labotrat 500ml',
    brandSlug: 'labotrat',
    catSlug: 'tratamentos',
    price: 64.9,
    qty: 55,
    minQty: 2,
    desc: 'Repositor de massa capilar que reconstrói fios fragilizados por química.',
    images: ['/products/placeholder-hair-2.jpg'],
  },
  // ── DOHA PROFESSIONAL ─────────────────────────────────────────────────────
  {
    name: 'Shampoo Professionnel Doha 1L',
    brandSlug: 'doha-professional',
    catSlug: 'shampoo',
    price: 89.9,
    qty: 65,
    minQty: 2,
    desc: 'Shampoo profissional de uso salão com pH equilibrado para limpeza profunda sem agredir.',
    images: ['/products/placeholder-hair-1.jpg'],
    featured: true,
  },
  {
    name: 'Progressiva Orgânica Doha',
    brandSlug: 'doha-professional',
    catSlug: 'tratamentos',
    price: 159.9,
    qty: 30,
    minQty: 1,
    desc: 'Tratamento de progressiva orgânica sem formol para alisamento natural e redução de volume.',
    images: ['/products/placeholder-hair-2.jpg', '/products/placeholder-hair-1.jpg'],
  },
  {
    name: 'Protetor Térmico Doha 200ml',
    brandSlug: 'doha-professional',
    catSlug: 'finalizadores',
    price: 46.9,
    qty: 75,
    minQty: 3,
    desc: 'Protetor térmico que blinda os fios contra danos do secador e chapinha.',
    images: ['/products/placeholder-hair-1.jpg'],
  },
  // ── CITY GIRLS ────────────────────────────────────────────────────────────
  {
    name: 'Gloss Labiel City Girls',
    brandSlug: 'city-girls',
    catSlug: 'maquiagem',
    price: 22.9,
    qty: 130,
    minQty: 6,
    desc: 'Gloss labiel com brilho intenso e efeito plump. Embalagem prática para o dia a dia.',
    images: ['/products/placeholder-makeup-1.jpg'],
  },
  {
    name: 'Blush Iluminador City Girls',
    brandSlug: 'city-girls',
    catSlug: 'maquiagem',
    price: 34.9,
    qty: 90,
    minQty: 4,
    desc: 'Blush iluminador que dá um ar saudável e luminoso à pele.',
    images: ['/products/placeholder-makeup-2.jpg', '/products/placeholder-makeup-1.jpg'],
    featured: true,
  },
  {
    name: 'Kit Pincéis City Girls 12 Peças',
    brandSlug: 'city-girls',
    catSlug: 'acessorios',
    price: 59.9,
    qty: 45,
    minQty: 2,
    desc: 'Kit completo com 12 pincéis profissionais para maquiagem, com bolsa organizadora.',
    images: ['/products/placeholder-makeup-2.jpg'],
  },
  // ── SP COLORS ──────────────────────────────────────────────────────────────
  {
    name: 'Esmalte SP Colors 8ml',
    brandSlug: 'sp-colors',
    catSlug: 'unhas',
    price: 9.9,
    qty: 300,
    minQty: 12,
    desc: 'Esmalte de alta cobertura e brilho, secagem rápida. Diversas cores disponíveis.',
    images: ['/products/placeholder-makeup-2.jpg'],
  },
  {
    name: 'Paleta Corretiva SP Colors',
    brandSlug: 'sp-colors',
    catSlug: 'maquiagem',
    price: 49.9,
    qty: 60,
    minQty: 3,
    desc: 'Paleta corretiva multiuso com tons que neutralizam olheiras, manchas e imperfeições.',
    images: ['/products/placeholder-makeup-2.jpg', '/products/placeholder-makeup-1.jpg'],
  },
  {
    name: 'Dermográfico para Olhos SP Colors',
    brandSlug: 'sp-colors',
    catSlug: 'maquiagem',
    price: 26.9,
    qty: 100,
    minQty: 6,
    desc: 'Lápis dermográfico de longa duração para olhos e sobrancelhas.',
    images: ['/products/placeholder-makeup-1.jpg'],
  },
  // ── SFFUMATO BEAUTY ─────────────────────────────────────────────────────────
  {
    name: 'Sérum Facial Sffumato 30ml',
    brandSlug: 'sffumato-beauty',
    catSlug: 'skincare',
    price: 89.9,
    qty: 50,
    minQty: 2,
    desc: 'Sérum facial com ácido hialurônico e vitamina C para iluminar e hidratar a pele.',
    images: ['/products/placeholder-cosmetic-1.jpg'],
    featured: true,
  },
  {
    name: 'Hidratante Facial Sffumato 50ml',
    brandSlug: 'sffumato-beauty',
    catSlug: 'skincare',
    price: 64.9,
    qty: 65,
    minQty: 3,
    desc: 'Hidratante facial de textura leve com FPS para uso diário em todos os tipos de pele.',
    images: ['/products/placeholder-cosmetic-1.jpg'],
  },
  {
    name: 'Sabonete Líquido Facial Sffumato 200ml',
    brandSlug: 'sffumato-beauty',
    catSlug: 'skincare',
    price: 39.9,
    qty: 80,
    minQty: 3,
    desc: 'Sabonete líquido facial que limpa sem ressecar, equilibrando o pH da pele.',
    images: ['/products/placeholder-cosmetic-1.jpg'],
  },
  // ── SUPER PODERESAS ─────────────────────────────────────────────────────────
  {
    name: 'Kit Maquiagem #SUPER PODERES',
    brandSlug: 'super-poderes',
    catSlug: 'maquiagem',
    price: 99.9,
    oldPrice: 129.9,
    qty: 40,
    minQty: 2,
    desc: 'Kit completo #SUPER PODERES com paleta, batons e pincéis. Empoderamento em cada detalhe.',
    images: ['/products/placeholder-makeup-1.jpg'],
    featured: true,
  },
  {
    name: 'Base #SUPER PODERES',
    brandSlug: 'super-poderes',
    catSlug: 'maquiagem',
    price: 49.9,
    qty: 70,
    minQty: 3,
    desc: 'Base de longa duração com cobertura natural e FPS para o dia a dia.',
    images: ['/products/placeholder-makeup-2.jpg'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// BRAND VIDEOS (YouTube)
// ─────────────────────────────────────────────────────────────────────────────
const brandVideos: { brandSlug: string; videos: { title: string; url: string }[] }[] = [
  {
    brandSlug: 'dailus',
    videos: [
      { title: 'Dailus — Lançamento', url: 'https://www.youtube.com/watch?v=fCwK48GCXpM' },
      { title: 'Dailus — Tutorial', url: 'https://www.youtube.com/watch?v=uKU2uMKDhO8' },
      { title: 'Dailus — Produto', url: 'https://www.youtube.com/watch?v=IjUz-m0Wm9c' },
      { title: 'Dailus — Demonstração', url: 'https://www.youtube.com/watch?v=9xfJhzB0w_8' },
      { title: 'Dailus — Review', url: 'https://www.youtube.com/watch?v=JAtkISA_Q8c' },
      { title: 'Dailus — Unboxing', url: 'https://www.youtube.com/watch?v=r8xFmlUGfqU' },
      { title: 'Dailus — Make Completo', url: 'https://www.youtube.com/watch?v=CrDZUFAHWjY' },
      { title: 'Dailus — Bastidores', url: 'https://www.youtube.com/watch?v=y2qd5EjigFc' },
      { title: 'Dailus — Tendência', url: 'https://www.youtube.com/watch?v=0M2b5TKQ9yo' },
      { title: 'Dailus — Dicas', url: 'https://www.youtube.com/watch?v=BImHInD7gbo' },
      { title: 'Dailus — Look', url: 'https://www.youtube.com/watch?v=SHP1s6K2t6s' },
      { title: 'Dailus — Aplicação', url: 'https://www.youtube.com/watch?v=kf63PlWji6c' },
      { title: 'Dailus — Passo a passo', url: 'https://www.youtube.com/watch?v=h1vUxYqTyuM' },
      { title: 'Dailus — Comparativo', url: 'https://www.youtube.com/watch?v=s2pH2jYff-E' },
      { title: 'Dailus — Top', url: 'https://www.youtube.com/watch?v=E8eJU4iEdEE' },
      { title: 'Dailus — Edição', url: 'https://www.youtube.com/watch?v=mACcZm1Zi6Q' },
      { title: 'Dailus — Final', url: 'https://www.youtube.com/watch?v=UVGpEmkwVvc' },
    ],
  },
  {
    brandSlug: 'knut-hair-care',
    videos: [
      { title: 'Knut Hair Care — Apresentação', url: 'https://www.youtube.com/watch?v=zSorKboUcNI' },
      { title: 'Knut Hair Care — Tratamento', url: 'https://www.youtube.com/watch?v=vjBL0m2c7D0' },
      { title: 'Knut Hair Care — Salão', url: 'https://www.youtube.com/watch?v=e072NPtlwkE' },
      { title: 'Knut Hair Care — Resultado', url: 'https://www.youtube.com/watch?v=lHUBvJcH5-Q' },
      { title: 'Knut Hair Care — Profissional', url: 'https://www.youtube.com/watch?v=SWr--GvwozA' },
      { title: 'Knut Hair Care — Linha Completa', url: 'https://www.youtube.com/watch?v=dUPNSNrh0jc' },
      { title: 'Knut Hair Care — Detox', url: 'https://www.youtube.com/watch?v=XNXhhLtA_c4' },
      { title: 'Knut Hair Care — Reconstrução', url: 'https://www.youtube.com/watch?v=EMVdpiZcOvE' },
      { title: 'Knut Hair Care — Hidratação', url: 'https://www.youtube.com/watch?v=pAqbIxPQicE' },
      { title: 'Knut Hair Care — Finalização', url: 'https://www.youtube.com/watch?v=18No0CiSZj8' },
      { title: 'Knut Hair Care — Cuidados', url: 'https://www.youtube.com/watch?v=sF3Nc2EilcU' },
      { title: 'Knut Hair Care — Dicas', url: 'https://www.youtube.com/watch?v=6IDeIifsyic' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// REPRESENTATIVES (provided by the user)
// ─────────────────────────────────────────────────────────────────────────────
const representatives = [
  { name: 'Elba', whatsapp: '556281813418', region: 'Goiânia e região', bio: 'Representante oficial Aladdin em Goiânia e região.' },
  { name: 'Gilvanira', whatsapp: '556281246718', region: 'Goiás', bio: 'Representante Aladdin — atendimento personalizado.' },
  { name: 'Regiane', whatsapp: '556292175455', region: 'Goiânia', bio: 'Representante Aladdin — cosméticos e capilares.' },
  { name: 'Silvane', whatsapp: '556293179994', region: 'Goiás', bio: 'Representante Aladdin — maquiagem e tratamentos.' },
  { name: 'Fernando', whatsapp: '556296566900', region: 'Distrito Federal', bio: 'Representante Aladdin no DF.' },
  { name: 'Comercial Aladdin', whatsapp: '556291636421', region: 'Atendimento comercial', bio: 'Atendimento comercial Aladdin Distribuidora.' },
]

// ─────────────────────────────────────────────────────────────────────────────
// COURSES + LESSONS (YouTube)
// ─────────────────────────────────────────────────────────────────────────────
type SeedCourse = {
  title: string
  category: string
  description: string
  instructor?: string
  duration?: string
  level?: string
  featured?: boolean
  lessons: { title: string; url: string }[]
}

// NOTE (Vini): as aulas abaixo usam apenas os vídeos reais que você enviou.
// Não é possível abrir playlists do YouTube automaticamente aqui (sem acesso à internet
// nesse ambiente), então cada curso de maquiagem recebe o vídeo principal informado; quando
// você tiver a lista completa da playlist, é só me passar os links de cada aula que eu
// distribuo dentro do curso certo. Os cursos de finanças/gestão/desenvolvimento pessoal ficam
// com `lessons: []` (badge "Em breve" no Academy) até você mandar vídeos reais para eles —
// preferi isso a reaproveitar vídeo de vendas fingindo ser aula de finanças, que era o motivo
// dos cursos "duplicados".
const courses: SeedCourse[] = [
  {
    title: 'Maquiagem Profissional — Curso Completo',
    category: 'maquiagem',
    description: 'Aprenda maquiagem profissional do zero ao avançado: pele, olhos, lábios e finalização.',
    instructor: 'Especialista convidado',
    duration: '6h',
    level: 'iniciante',
    featured: true,
    lessons: [
      { title: 'Aula 1 — Playlist Maquiagem Profissional', url: 'https://www.youtube.com/watch?v=QeGiq9nBeLc&list=PLuL15Nw4V0B_oiJgLkKnYvxLHEp9163xD' },
    ],
  },
  {
    title: 'Maquiagem Profissional 2',
    category: 'maquiagem',
    description: 'Sequência do curso de maquiagem: técnicas avançadas de contorno, coloração e acabamento.',
    instructor: 'Especialista convidado',
    duration: '5h',
    level: 'intermediario',
    lessons: [
      { title: 'Aula 1 — Playlist Maquiagem 2', url: 'https://www.youtube.com/watch?v=u7B33_j8mgU&list=PL-QAz5R5Rlm7oGTs7CCUy8bKYl-TOv-ls' },
    ],
  },
  {
    title: 'Como Fazer Maquiagem Profissional em Casa',
    category: 'maquiagem',
    description: 'Guia prático para fazer uma maquiagem profissional em casa, com produtos acessíveis.',
    instructor: 'Especialista convidado',
    duration: '1h',
    level: 'iniciante',
    lessons: [{ title: 'Aula única', url: 'https://www.youtube.com/watch?v=P0pvphMAeUY' }],
  },
  {
    title: 'Treinamento de Vendas em Perfumaria e Cosméticos',
    category: 'vendas',
    description: 'Técnicas avançadas para vender cosméticos todos os dias. Foco em revenda e fidelização.',
    instructor: 'Especialista em vendas',
    duration: '2h',
    level: 'intermediario',
    featured: true,
    lessons: [
      { title: 'Aula principal', url: 'https://www.youtube.com/watch?v=5FqmKWq0M78' },
    ],
  },
  {
    title: 'Como Vender Cosméticos Todos os Dias',
    category: 'vendas',
    description: 'Método prático para criar rotina de vendas diárias e aumentar seu faturamento.',
    instructor: 'Especialista em vendas',
    duration: '1h30',
    level: 'iniciante',
    lessons: [{ title: 'Aula principal', url: 'https://www.youtube.com/watch?v=iLhPFER-4z8' }],
  },
  {
    title: 'Marketing e Vendas para Cosméticos',
    category: 'vendas',
    description: 'Curso completo de marketing e vendas aplicado ao setor de beleza.',
    instructor: 'Especialista em marketing',
    duration: '4h',
    level: 'intermediario',
    featured: true,
    lessons: [
      { title: 'Aula 1 — Playlist Marketing e Vendas', url: 'https://www.youtube.com/watch?v=lQV5myhSqCs&list=PLUkv8hZ8kunVjEKfgPdLQlD_Nk1vdILgq' },
    ],
  },
  {
    title: 'Técnicas de Vendas para Produtos',
    category: 'vendas',
    description: 'Aprenda técnicas de vendas consultivas para produtos de beleza e cuidado pessoal.',
    instructor: 'Especialista em vendas',
    duration: '1h30',
    level: 'intermediario',
    lessons: [{ title: 'Aula principal', url: 'https://www.youtube.com/watch?v=TsGUn40akOc' }],
  },
  {
    title: 'Atendimento ao Cliente — Vendas de Cosméticos',
    category: 'atendimento',
    description: 'Curso de atendimento ao cliente para quem trabalha com vendas de cosméticos, produtos capilares e maquiagem.',
    instructor: 'Equipe Aladdin Academy',
    duration: '2h',
    level: 'iniciante',
    featured: true,
    lessons: [],
  },
  {
    title: 'Curso de Vendas para Mulheres',
    category: 'desenvolvimento-pessoal',
    description: 'Estratégias de vendas pensadas para mulheres empreendedoras no setor de beleza.',
    instructor: 'Especialista em vendas',
    duration: '3h',
    level: 'iniciante',
    featured: true,
    lessons: [],
  },
  {
    title: 'Curso de Finanças Pessoais',
    category: 'financas',
    description: 'Aprenda a organizar suas finanças, controlar gastos e planejar o futuro.',
    instructor: 'Especialista em finanças',
    duration: '4h',
    level: 'iniciante',
    lessons: [],
  },
  {
    title: 'Curso de Gestão Empresarial',
    category: 'gestao',
    description: 'Fundamentos de gestão empresarial aplicados a pequenos negócios de cosméticos.',
    instructor: 'Especialista em gestão',
    duration: '5h',
    level: 'intermediario',
    lessons: [],
  },
  {
    title: 'Curso de Gestão Pessoal',
    category: 'desenvolvimento-pessoal',
    description: 'Organize sua rotina, defina metas e alcance resultados pessoais e profissionais.',
    instructor: 'Coach convidado',
    duration: '3h',
    level: 'iniciante',
    lessons: [],
  },
  {
    title: 'Educação Financeira — Investimentos para Iniciantes',
    category: 'educacao-financeira',
    description: 'Dicas práticas de educação financeira: como começar a investir mesmo com pouco dinheiro.',
    instructor: 'Especialista em investimentos',
    duration: '2h',
    level: 'iniciante',
    featured: true,
    lessons: [],
  },
  {
    title: 'Educação Financeira — Reserva de Emergência',
    category: 'educacao-financeira',
    description: 'Como montar sua reserva de emergência e garantir tranquilidade financeira.',
    instructor: 'Especialista em finanças',
    duration: '1h30',
    level: 'iniciante',
    lessons: [],
  },
  {
    title: 'Educação Financeira — Controle de Gastos',
    category: 'educacao-financeira',
    description: 'Planilha, método 50/30/20 e dicas para controlar seus gastos mensais.',
    instructor: 'Especialista em finanças',
    duration: '1h',
    level: 'iniciante',
    lessons: [],
  },
  {
    title: 'Maquiagem para Revendedoras',
    category: 'maquiagem',
    description: 'Curso de maquiagem rápido para revendedoras demonstrarem produtos aos clientes.',
    instructor: 'Especialista convidado',
    duration: '2h',
    level: 'iniciante',
    lessons: [
      { title: 'Aula única', url: 'https://www.youtube.com/watch?v=P0pvphMAeUY' },
    ],
  },
  {
    title: 'Marketing Digital para Cosméticos',
    category: 'vendas',
    description: 'Como vender cosméticos no Instagram, WhatsApp e TikTok usando marketing digital.',
    instructor: 'Especialista em marketing',
    duration: '3h',
    level: 'intermediario',
    lessons: [],
  },
  {
    title: 'Gestão de Estoque para Revendedoras',
    category: 'gestao',
    description: 'Controle de estoque, giro de produtos e identificação dos campeões de venda.',
    instructor: 'Especialista em gestão',
    duration: '1h30',
    level: 'intermediario',
    lessons: [],
  },
  {
    title: 'Precificação e Margem de Lucro',
    category: 'financas',
    description: 'Como precificar cosméticos revendidos e calcular sua margem de lucro com segurança.',
    instructor: 'Especialista em finanças',
    duration: '2h',
    level: 'intermediario',
    lessons: [],
  },
  {
    title: 'Atendimento Premium no WhatsApp',
    category: 'atendimento',
    description: 'Transforme o WhatsApp na sua principal vitrine e canal de vendas.',
    instructor: 'Equipe Aladdin Academy',
    duration: '1h30',
    level: 'iniciante',
    lessons: [],
  },
  {
    title: 'Liderança para Mulheres Empreendedoras',
    category: 'desenvolvimento-pessoal',
    description: 'Desenvolva sua liderança, confiança e presença no mercado de beleza.',
    instructor: 'Coach convidado',
    duration: '2h',
    level: 'avancado',
    lessons: [],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// BLOG ARTICLES (a couple of starter articles; admin can add more)
// ─────────────────────────────────────────────────────────────────────────────
const blogArticles = [
  {
    title: '5 Dicas de Vendas para Revendedoras de Cosméticos',
    slug: '5-dicas-vendas-cosmeticos',
    excerpt: 'Aprenda 5 técnicas práticas para aumentar suas vendas de cosméticos todos os dias.',
    category: 'Dicas de Vendas',
    cover: '/brands/strip-dailus.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 5,
    content:
      'Vender cosméticos exige técnica, persistência e relacionamento. Neste artigo compartilhamos 5 dicas que funcionam no dia a dia:\n\n## 1. Conheça profundamente cada produto\nAntes de vender, teste. Clientes confiam em quem usa.\n\n## 2. Crie uma vitrine no WhatsApp\nCatalogue seus produtos com fotos reais e preços claros.\n\n## 3. Ofereça amostras\nUma pequena amostra converte em compra.\n\n## 4. Acompanhe pós-venda\nPergunte se gostou. Isso gera recompra.\n\n## 5. Aposte em combo\nShampoo + condicionador + máscara vendem mais juntos.',
  },
  {
    title: 'Como Montar uma Rotina de Skincare em 5 Passos',
    slug: 'rotina-skincare-5-passos',
    excerpt: 'Limpeza, tonificação, sérum, hidratação e proteção. Veja a ordem certa.',
    category: 'Cuidados Pessoais',
    cover: '/brands/strip-knut.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 4,
    content:
      'Uma rotina de skincare bem feita transforma a pele. Siga estes 5 passos:\n\n## 1. Limpeza\nUse um sabonete facial adequado ao seu tipo de pele, manhã e noite.\n\n## 2. Tonificação\nTônico equilibra o pH e prepara a pele para os próximos passos.\n\n## 3. Sérum\nO sérum com vitamina C ilumina e uniformiza.\n\n## 4. Hidratação\nHidratante sela a água na pele.\n\n## 5. Proteção solar\nFPS é o passo mais importante, de dia.',
  },
  {
    title: 'Tendências de Maquiagem: o que está em alta',
    slug: 'tendencias-maquiagem-em-alta',
    excerpt: 'O que vai bombar em maquiagem neste ano: pele glow, olhos gráficos e lábios em tons terrosos.',
    category: 'Tendências & Mercado',
    cover: '/brands/strip-default.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 6,
    content:
      'O mercado de maquiagem combina naturalidade e pontos de ousadia. Confira as principais tendências:\n\n## Pele glow\nIluminadores discretos e base leve continuam em alta.\n\n## Olhos gráficos\nLinhas pretas geométricas e gráficos nos cantos dos olhos.\n\n## Lábios terrosos\nTons nudes, terracota e marrom ganham destaque.\n\n## Sobrancelhas naturais\nModelagem leve, sem excessos.',
  },
  {
    title: 'Como Organizar o Estoque de Cosméticos sem Perder Vendas',
    slug: 'organizar-estoque-cosmeticos',
    excerpt: 'Um método simples para acompanhar giro, reposição e produtos parados no estoque.',
    category: 'Dicas de Vendas',
    cover: '/brands/strip-default.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 6,
    content:
      'Estoque organizado protege sua margem e melhora o atendimento.\n\n## Classifique por giro\nSepare itens de giro alto, médio e baixo para definir prioridades de reposição.\n\n## Registre entradas e saídas\nUma rotina simples de conferência evita falta de produto e compras duplicadas.\n\n## Observe validade e sazonalidade\nTrabalhe campanhas antes que itens fiquem parados e planeje reposições com antecedência.',
  },
  {
    title: 'Venda Consultiva: Como Indicar o Produto Certo para Cada Cliente',
    slug: 'venda-consultiva-cosmeticos',
    excerpt: 'Perguntas práticas que ajudam a entender a necessidade do cliente antes de oferecer um cosmético.',
    category: 'Dicas de Vendas',
    cover: '/brands/strip-dailus.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 5,
    content:
      'Venda consultiva começa antes da apresentação do produto.\n\n## Pergunte antes de sugerir\nEntenda objetivo, rotina, preferências e experiências anteriores.\n\n## Explique o porquê\nMostre de forma simples por que aquela categoria faz sentido para a necessidade relatada.\n\n## Evite excesso de opções\nUma seleção curta e bem explicada costuma facilitar a decisão.',
  },
  {
    title: 'Como Fotografar Cosméticos para WhatsApp e Instagram',
    slug: 'fotografar-cosmeticos-whatsapp-instagram',
    excerpt: 'Iluminação, enquadramento e composição para valorizar produtos sem complicação.',
    category: 'Dicas de Beleza',
    cover: '/brands/strip-dailus.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 5,
    content:
      'Boas fotos aumentam a percepção de cuidado e profissionalismo.\n\n## Priorize luz natural\nFotografe perto de uma janela e evite misturar temperaturas de luz.\n\n## Use fundo limpo\nUm cenário simples direciona atenção ao produto.\n\n## Mostre escala e textura\nDetalhes aproximados ajudam o cliente a compreender acabamento, cor e tamanho.',
  },
  {
    title: 'Cronograma Capilar: Hidratação, Nutrição e Reconstrução',
    slug: 'cronograma-capilar-guia',
    excerpt: 'Entenda a função de cada etapa e como montar uma rotina capilar equilibrada.',
    category: 'Cuidados Pessoais',
    cover: '/brands/strip-knut.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 7,
    content:
      'O cronograma capilar alterna cuidados conforme a necessidade dos fios.\n\n## Hidratação\nAjuda a devolver água, maciez e maleabilidade.\n\n## Nutrição\nRepõe lipídios e pode ajudar no controle do frizz e brilho.\n\n## Reconstrução\nÉ indicada quando os fios precisam de reposição de massa e força, com frequência ajustada ao estado do cabelo.',
  },
  {
    title: 'Como Criar Combos de Cosméticos que Fazem Sentido',
    slug: 'combos-cosmeticos-para-vender',
    excerpt: 'Monte kits por necessidade, rotina e faixa de compra sem parecer venda empurrada.',
    category: 'Dicas de Vendas',
    cover: '/brands/strip-default.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 5,
    content:
      'Combos funcionam melhor quando resolvem uma necessidade completa.\n\n## Pense em sequência de uso\nCombine produtos que naturalmente fazem parte da mesma rotina.\n\n## Crie opções de entrada e premium\nFaixas diferentes ampliam a chance de encaixe no orçamento do cliente.\n\n## Explique o benefício do conjunto\nMostre por que os itens se complementam, sem prometer resultados garantidos.',
  },
  {
    title: 'Atendimento no WhatsApp: 7 Práticas para Vender Melhor',
    slug: 'atendimento-whatsapp-cosmeticos',
    excerpt: 'Organização, agilidade e linguagem clara para transformar conversa em relacionamento comercial.',
    category: 'Dicas de Vendas',
    cover: '/brands/strip-dailus.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 6,
    content:
      'Atendimento digital precisa ser rápido sem perder qualidade.\n\n## Responda com contexto\nEvite mensagens soltas; confirme o que o cliente procura.\n\n## Use catálogo de forma objetiva\nEnvie poucas opções relevantes e destaque diferenças importantes.\n\n## Faça acompanhamento\nUma mensagem educada depois da compra pode aumentar confiança e recompra.',
  },
  {
    title: 'Margem, Giro e Mix: Três Indicadores para Revenda de Beleza',
    slug: 'margem-giro-mix-revenda-beleza',
    excerpt: 'Veja por que olhar apenas para faturamento pode esconder problemas no negócio.',
    category: 'Tendências & Mercado',
    cover: '/brands/strip-default.jpg',
    author: 'Equipe Aladdin Distribuidora',
    readTime: 7,
    content:
      'Faturamento sozinho não mostra a qualidade das vendas.\n\n## Margem\nAjuda a entender quanto sobra em cada venda depois do custo do produto.\n\n## Giro\nMostra a velocidade com que o estoque se transforma em venda.\n\n## Mix\nAvalia se o portfólio está equilibrado entre categorias, faixas de preço e necessidades do público.',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// SITE SETTINGS
// ─────────────────────────────────────────────────────────────────────────────
const settings = {
  brandName: 'Aladdin Distribuidora',
  heroTitle: 'Beleza que move o seu negócio',
  heroSubtitle:
    'Distribuidora oficial de cosméticos e produtos capilares em Goiás e no Distrito Federal.',
  heroImageUrl: '/hero/hero-main.png',
  heroBadge: '+9 anos de experiência',
  institutionalText:
    'A Aladdin Distribuidora é referência na distribuição de cosméticos e produtos capilares em Goiás e no Distrito Federal, representando grandes marcas como Knut Hair Care, Dailus, Labotrat, Doha Professional, City Girls, SP Colors, Sffumato Beauty e #SUPER PODERES. Com mais de 9 anos de experiência, garantimos um atendimento diferenciado e uma parceria sólida com nossos clientes.',
  address:
    'Av. Dr. Ismerino Soares de Carvalho, 292 - Quadra 16-A Lote 16 - St. Aeroporto, Goiânia - GO, 74075-040',
  phone: '(62) 99546-0509',
  whatsapp: '5562995460509',
  instagram1: 'aladdin.distribuidora',
  instagram2: 'knutgoias',
  wazeUrl:
    'https://waze.com/ul?q=Av.%20Dr.%20Ismerino%20Soares%20de%20Carvalho%2C%20292%2C%20Goi%C3%A2nia%20-%20GO',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Av.+Dr.+Ismerino+Soares+de+Carvalho,+292,+Goi%C3%A2nia+-+GO',
  mapEmbed:
    'https://www.google.com/maps?q=Av.+Dr.+Ismerino+Soares+de+Carvalho,+292,+Setor+Aeroporto,+Goi%C3%A2nia+-+GO&output=embed',
  yearsExperience: 9,
  brandsCount: 8,
}

// ─────────────────────────────────────────────────────────────────────────────
// SEED RUN
// ─────────────────────────────────────────────────────────────────────────────
export async function seedDatabase() {
  console.log('🌱 Seeding database…')

  // Settings
  await db.siteSettings.upsert({
    where: { id: 'singleton' },
    create: { id: 'singleton', ...settings },
    update: settings,
  })
  console.log(`✓ site settings`)

  // Brands
  const brandIdBySlug: Record<string, string> = {}
  for (const b of brands) {
    const row = await db.brand.upsert({
      where: { slug: b.slug },
      create: b,
      update: b,
    })
    brandIdBySlug[b.slug] = row.id
  }
  console.log(`✓ ${brands.length} brands`)

  // Categories
  const catIdBySlug: Record<string, string> = {}
  for (const c of categories) {
    const row = await db.category.upsert({
      where: { slug: c.slug },
      create: c,
      update: c,
    })
    catIdBySlug[c.slug] = row.id
  }
  console.log(`✓ ${categories.length} categories`)

  // Brand videos
  for (const bv of brandVideos) {
    const brandId = brandIdBySlug[bv.brandSlug]
    if (!brandId) continue
    // Clear existing then re-insert
    await db.brandVideo.deleteMany({ where: { brandId } })
    for (const [i, v] of bv.videos.entries()) {
      await db.brandVideo.create({
        data: {
          brandId,
          title: v.title,
          youtubeUrl: v.url,
          order: i,
        },
      })
    }
  }
  console.log(`✓ brand videos`)

  // Products
  for (const p of products) {
    const slug = slugify(p.name)
    const data = {
      name: p.name,
      slug,
      brandId: brandIdBySlug[p.brandSlug],
      categoryId: catIdBySlug[p.catSlug] ?? null,
      price: p.price,
      oldPrice: p.oldPrice ?? null,
      quantity: p.qty,
      minQuantity: p.minQty,
      unit: p.unit ?? null,
      description: p.desc,
      images: JSON.stringify(p.images),
      featured: p.featured ?? false,
    }
    await db.product.upsert({
      where: { slug },
      create: data,
      update: data,
    })
  }
  console.log(`✓ ${products.length} products`)

  // Representatives
  for (const [i, r] of representatives.entries()) {
    const slug = slugify(r.name)
    await db.representative.upsert({
      where: { slug },
      create: { ...r, slug, order: i },
      update: { ...r, slug, order: i },
    })
  }
  console.log(`✓ ${representatives.length} representatives`)

  // Courses + lessons
  for (const [ci, c] of courses.entries()) {
    const slug = slugify(c.title)
    const course = await db.course.upsert({
      where: { slug },
      create: {
        title: c.title,
        slug,
        description: c.description,
        category: c.category,
        instructor: c.instructor ?? null,
        duration: c.duration ?? null,
        level: c.level ?? 'iniciante',
        featured: c.featured ?? false,
        order: ci,
      },
      update: {
        title: c.title,
        description: c.description,
        category: c.category,
        instructor: c.instructor ?? null,
        duration: c.duration ?? null,
        level: c.level ?? 'iniciante',
        featured: c.featured ?? false,
        order: ci,
      },
    })
    await db.lesson.deleteMany({ where: { courseId: course.id } })
    for (const [li, l] of c.lessons.entries()) {
      await db.lesson.create({
        data: {
          courseId: course.id,
          title: l.title,
          youtubeUrl: l.url,
          order: li,
        },
      })
    }
  }
  console.log(`✓ ${courses.length} courses with lessons`)

  // Blog articles
  for (const a of blogArticles) {
    await db.blogArticle.upsert({
      where: { slug: a.slug },
      create: a,
      update: a,
    })
  }
  console.log(`✓ ${blogArticles.length} blog articles`)

  // Default admin (admin / aladdin123)
  const adminUsername = 'admin'
  const adminPassword = 'aladdin123'
  const { createHash } = await import('node:crypto')
  const passwordHash = createHash('sha256').update(adminPassword).digest('hex')
  await db.adminUser.upsert({
    where: { username: adminUsername },
    create: { username: adminUsername, passwordHash },
    update: { passwordHash },
  })
  console.log(`✓ admin user (${adminUsername} / ${adminPassword})`)

  console.log('\n✅ Seed complete.')
}

// Executa diretamente apenas quando chamado por `tsx scripts/seed.ts`.
// Quando importado por ensure-seed.ts, a funcao e reutilizada sem disparar duas vezes.
const isDirectRun = /(?:^|[\\/])seed\.ts$/i.test(process.argv[1] ?? '')

if (isDirectRun) {
  seedDatabase()
    .catch((e) => {
      console.error(e)
      process.exitCode = 1
    })
    .finally(async () => {
      await db.$disconnect()
    })
}
