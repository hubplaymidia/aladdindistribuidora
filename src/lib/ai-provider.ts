import ZAI from 'z-ai-web-dev-sdk'

export type AiMessage = {
  role: 'assistant' | 'user'
  content: string
}

/**
 * Primary provider: Google Gemini / Google AI Studio when GEMINI_API_KEY is set.
 * Fallback: the project's existing ZAI provider, so local development does not break.
 */
export async function generateAiText(messages: AiMessage[]) {
  const apiKey = process.env.GEMINI_API_KEY?.trim()
  if (apiKey) {
    const model = process.env.GEMINI_MODEL?.trim() || 'gemini-2.5-flash'
    const [first, ...rest] = messages
    const hasSystemPrompt = first?.role === 'assistant'
    const conversation = hasSystemPrompt ? rest : messages

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...(hasSystemPrompt
            ? { system_instruction: { parts: [{ text: first.content }] } }
            : {}),
          contents: conversation.map((message) => ({
            role: message.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: message.content }],
          })),
          generationConfig: {
            temperature: 0.55,
            topP: 0.9,
          },
        }),
      }
    )

    if (!response.ok) {
      const detail = await response.text().catch(() => '')
      throw new Error(`Gemini API ${response.status}: ${detail || response.statusText}`)
    }

    const data = await response.json() as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>
    }
    const text = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text ?? '')
      .join('')
      .trim()

    if (!text) throw new Error('Gemini retornou uma resposta vazia.')
    return text
  }

  const zai = await ZAI.create()
  const completion = await zai.chat.completions.create({
    messages,
    thinking: { type: 'disabled' },
  })
  return completion.choices?.[0]?.message?.content?.trim() || ''
}
