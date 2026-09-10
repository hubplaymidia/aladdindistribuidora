'use client'

import * as React from 'react'
import { useApp } from '@/lib/store-app'
import { api } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { MessageCircle, X, Send, Sparkles } from 'lucide-react'
import { WhatsAppIcon } from '@/components/icons/SocialIcons'

type Msg = { role: 'user' | 'assistant'; content: string }

export function Chatbot({ whatsapp }: { whatsapp: string }) {
  const navigate = useApp((s) => s.navigate)
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<Msg[]>([
    {
      role: 'assistant',
      content:
        'Olá! 👋 Sou a assistente virtual da Aladdin Distribuidora. Posso ajudar com produtos, marcas, indicar representante… Como posso ajudar?',
    },
  ])
  const [input, setInput] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [sessionId] = React.useState(
    () => `s${Math.random().toString(36).slice(2, 10)}`
  )
  const scrollRef = React.useRef<HTMLDivElement>(null)
  const wppLink = `https://wa.me/${whatsapp.replace(/\D/g, '')}`

  React.useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, open])

  const send = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    setMessages((m) => [...m, { role: 'user', content: text }])
    setLoading(true)
    try {
      const res = await api<{ reply: string }>('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ message: text, sessionId }),
      })
      setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
    } catch (e: any) {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content:
            'Desculpe, tive um problema técnico agora. Que tal falar com um representante pelo WhatsApp?',
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Floating toggle */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Fechar chat' : 'Abrir chat'}
        className="fixed bottom-5 right-5 z-50 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 animate-pulse-ring"
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 flex h-[min(560px,75vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl reveal-up">
          {/* Header with close button */}
          <div className="flex items-center justify-between border-b border-border bg-primary px-4 py-3 text-primary-foreground">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-primary-foreground/15">
                <Sparkles className="h-4 w-4" />
              </span>
              <div className="leading-tight">
                <div className="text-sm font-semibold">Assistente Aladdin</div>
                <div className="text-[10px] opacity-80">Online · responde em segundos</div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Fechar chat"
              className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-primary-foreground/15"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 px-3 py-3 scroll-area">
            <div ref={scrollRef} className="flex flex-col gap-2.5">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    m.role === 'user'
                      ? 'self-end bg-primary text-primary-foreground'
                      : 'self-start bg-muted text-foreground'
                  }`}
                >
                  {m.content}
                </div>
              ))}
              {loading && (
                <div className="self-start rounded-2xl bg-muted px-3.5 py-2.5 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <Dot /> <Dot d={0.15} /> <Dot d={0.3} />
                  </span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-1.5 border-t border-border px-3 py-2">
            <Quick
              onClick={() =>
                setMessages((m) => [
                  ...m,
                  { role: 'user', content: 'Quero falar com um representante' },
                ]) || send2('Quero falar com um representante')
              }
            >
              Falar com representante
            </Quick>
            <Quick onClick={() => navigate({ name: 'catalog' })}>Ver produtos</Quick>
            <a
              href={wppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:scale-105"
            >
              <WhatsAppIcon size={14} />
              WhatsApp
            </a>
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-border p-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              placeholder="Escreva sua mensagem…"
              disabled={loading}
              className="flex-1"
            />
            <Button
              size="icon"
              onClick={send}
              disabled={loading || !input.trim()}
              aria-label="Enviar"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  )

  function send2(text: string) {
    // Helper to send a programmatically-injected message.
    setInput('')
    void (async () => {
      setMessages((m) => [...m, { role: 'user', content: text }])
      setLoading(true)
      try {
        const res = await api<{ reply: string }>('/api/chat', {
          method: 'POST',
          body: JSON.stringify({ message: text, sessionId }),
        })
        setMessages((m) => [...m, { role: 'assistant', content: res.reply }])
      } catch {
        setMessages((m) => [
          ...m,
          {
            role: 'assistant',
            content: 'Tive um probleminha agora. Fale com um representante pelo WhatsApp.',
          },
        ])
      } finally {
        setLoading(false)
      }
    })()
  }
}

function Dot({ d = 0 }: { d?: number }) {
  return (
    <span
      className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-current"
      style={{ animationDelay: `${d}s` }}
    />
  )
}

function Quick({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-all hover:scale-105"
    >
      {children}
    </button>
  )
}
