import { NextRequest, NextResponse } from 'next/server'
import { generateAiText } from '@/lib/ai-provider'
import { db } from '@/lib/db'
import { readJson } from '@/lib/format'

export const dynamic = 'force-dynamic'

// In-memory conversation cache (sessionId → messages). Fine for a content site.
const sessions = new Map<string, { messages: any[]; expires: number }>()
const SESSION_TTL = 1000 * 60 * 30 // 30 min

async function buildSystemPrompt() {
  const [settings, brands, reps] = await Promise.all([
    db.siteSettings.findUnique({ where: { id: 'singleton' } }),
    db.brand.findMany({ orderBy: { order: 'asc' }, select: { name: true, tagline: true, slug: true } }),
    db.representative.findMany({ where: { active: true }, orderBy: { order: 'asc' } }),
  ])

  const brandList = brands.map((b) => `- ${b.name} (${b.slug}): ${b.tagline ?? ''}`).join('\n')
  const repList = reps
    .map((r) => `- ${r.name} (${r.region ?? 'Goiás'}): WhatsApp ${r.whatsapp}`)
    .join('\n')

  return `Você é a assistente virtual da ${settings?.brandName ?? 'Aladdin Distribuidora'}, uma distribuidora oficial de cosméticos e produtos capilares em Goiás e no Distrito Federal com mais de ${settings?.yearsExperience ?? 9} anos de experiência.

INFORMAÇÕES DA EMPRESA:
- Endereço: ${settings?.address ?? 'Goiânia - GO'}
- Telefone: ${settings?.phone ?? '(62) 99546-0509'}
- WhatsApp principal: ${settings?.whatsapp ?? '5562995460509'}
- Instagram: @${settings?.instagram1 ?? 'aladdin.distribuidora'}

MARCAS PARCEIRAS:
${brandList}

REPRESENTANTES:
${repList}

SEU PAPEL:
- Atender clientes e revendedoras com cordialidade e objetividade.
- Ajudar a escolher produtos, indicar marcas, tirar dúvidas sobre tratamentos capilares e maquiagem.
- Sempre que fizer sentido, convidar o cliente a falar com um representante no WhatsApp.
- Responder em português do Brasil, de forma clara e simpática.
- Se não souber algo específico (preço exato, estoque), oriente a falar com um representante.
- Não invente preços. Não invente produtos que não estão nas marcas listadas.
- Respostas curtas (2-4 frases), exceto se o cliente pedir detalhes.`
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const message = (body.message ?? '').toString().trim()
    const sessionId = (body.sessionId ?? 'guest').toString()
    if (!message) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
    }

    const systemPrompt = await buildSystemPrompt()

    // Get/create session
    const now = Date.now()
    let session = sessions.get(sessionId)
    if (!session || session.expires < now) {
      session = { messages: [], expires: now + SESSION_TTL }
      sessions.set(sessionId, session)
    }
    // Trim history to last 10 turns
    if (session.messages.length > 20) {
      session.messages = session.messages.slice(-20)
    }

    const messages = [
      { role: 'assistant' as const, content: systemPrompt },
      ...session.messages,
      { role: 'user' as const, content: message },
    ]

    const reply = (await generateAiText(messages)) || 'Desculpe, não consegui responder agora.'

    // Save turn
    session.messages.push({ role: 'user', content: message })
    session.messages.push({ role: 'assistant', content: reply })
    session.expires = now + SESSION_TTL

    return NextResponse.json({ reply, sessionId })
  } catch (e: any) {
    console.error('[chat] error', e)
    return NextResponse.json(
      { error: 'Não foi possível responder agora. Tente novamente em instantes.', detail: e?.message },
      { status: 500 }
    )
  }
}
