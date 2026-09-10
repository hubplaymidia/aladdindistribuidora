import { NextRequest, NextResponse } from 'next/server'
import { generateAiText } from '@/lib/ai-provider'
import { verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `Você é o assistente de conteúdo do painel administrativo da Aladdin Distribuidora (distribuidora de cosméticos e produtos capilares em Goiás/DF).
Você ajuda o administrador a gerar textos curtos, profissionais e em português do Brasil para o site:
- descrições de produtos
- subtítulos de hero
- trechos de blog
- legendas para Instagram
- títulos de cursos

Regras:
- Responda SEMPRE em português do Brasil.
- Seja direto e útil.
- Quando o pedido for uma "descrição de produto", responda em 2-3 frases, em tom comercial mas elegante.
- Quando pedir "JSON", responda APENAS com JSON válido (sem markdown, sem comentários).`

export async function POST(req: NextRequest) {
  if (!(await verifyAdmin())) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const prompt = (body.prompt ?? '').toString().trim()
  const context = (body.context ?? '').toString().trim()
  if (!prompt) return NextResponse.json({ error: 'Prompt vazio' }, { status: 400 })

  try {
    const reply = await generateAiText([
      { role: 'assistant', content: SYSTEM_PROMPT + (context ? `\n\nCONTEXTO:\n${context}` : '') },
      { role: 'user', content: prompt },
    ])
    return NextResponse.json({ reply })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Erro na IA' }, { status: 500 })
  }
}
