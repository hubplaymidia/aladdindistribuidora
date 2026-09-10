'use client'

import * as React from 'react'
import { useCart, cartTotal } from '@/lib/store-cart'
import { useApp } from '@/lib/store-app'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Minus, Plus, Trash2, ShoppingBag, FileText, CheckCircle2 } from 'lucide-react'
import { formatCurrency } from '@/lib/format'

export function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen)
  const close = useCart((s) => s.close)
  const items = useCart((s) => s.items)
  const setQty = useCart((s) => s.setQty)
  const remove = useCart((s) => s.remove)
  const clear = useCart((s) => s.clear)
  const navigate = useApp((s) => s.navigate)
  const [name, setName] = React.useState('')
  const [generated, setGenerated] = React.useState(false)

  const total = cartTotal(items)

  const generateOrderPdf = () => {
    if (items.length === 0) return

    const popup = window.open('', '_blank', 'width=980,height=760')
    if (!popup) return

    const htmlEntities: Record<string, string> = {
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#039;',
    }
    const esc = (value: string) => value.replace(/[&<>\"']/g, (char) => htmlEntities[char] ?? char)

    const now = new Date()
    const orderId = `ALD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`
    const rows = items.map((i) => {
      const price = i.showPrice !== false ? formatCurrency(i.price) : 'Sob consulta'
      const subtotal = i.showPrice !== false ? formatCurrency(i.price * i.quantity) : 'Sob consulta'
      return `<tr><td><strong>${esc(i.name)}</strong><br><span>${esc(i.brandName)}</span></td><td>${i.quantity}</td><td>${price}</td><td>${subtotal}</td></tr>`
    }).join('')
    const hasHiddenPrice = items.some((i) => i.showPrice === false)

    popup.document.write(`<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8"><title>Pedido ${orderId}</title>
<style>
@page{size:A4;margin:16mm}*{box-sizing:border-box}body{font-family:Arial,Helvetica,sans-serif;color:#161616;margin:0;background:#fff;font-size:12px;line-height:1.45}.top{display:flex;justify-content:space-between;gap:24px;border-bottom:2px solid #111;padding-bottom:18px;margin-bottom:24px}.brand{font-size:26px;font-weight:800;letter-spacing:-.7px}.muted{color:#696969}.pill{display:inline-block;border:1px solid #d6d6d6;border-radius:999px;padding:5px 10px;margin-top:8px}.meta{text-align:right}.meta b{display:block;font-size:15px;margin-bottom:5px}h1{font-size:20px;margin:0 0 14px}table{width:100%;border-collapse:collapse;margin-top:8px}th{background:#111;color:#fff;text-align:left;padding:10px 9px;font-size:11px;text-transform:uppercase;letter-spacing:.05em}td{padding:12px 9px;border-bottom:1px solid #e6e6e6;vertical-align:top}td:nth-child(2),td:nth-child(3),td:nth-child(4),th:nth-child(2),th:nth-child(3),th:nth-child(4){text-align:right}.total{margin-top:18px;margin-left:auto;width:310px;border:1px solid #dedede;border-radius:12px;padding:14px}.total-row{display:flex;justify-content:space-between;gap:16px;font-size:16px;font-weight:800}.note{margin-top:20px;padding:12px 14px;border-radius:10px;background:#f4f4f4;color:#555}.footer{margin-top:36px;border-top:1px solid #ddd;padding-top:12px;color:#777;font-size:10px}.actions{position:fixed;right:22px;bottom:22px}@media print{.actions{display:none}}button{border:0;border-radius:999px;background:#111;color:#fff;padding:12px 18px;font-weight:700;cursor:pointer}
</style></head><body>
<div class="top"><div><div class="brand">Aladdin Distribuidora</div><div class="muted">Pedido gerado pelo catálogo digital</div><span class="pill">Documento para envio à representante</span></div><div class="meta"><b>${orderId}</b><div>${now.toLocaleDateString('pt-BR')} · ${now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</div><div>Cliente: ${esc(name || 'Não informado')}</div></div></div>
<h1>Itens do pedido</h1>
<table><thead><tr><th>Produto</th><th>Qtd.</th><th>Valor unit.</th><th>Subtotal</th></tr></thead><tbody>${rows}</tbody></table>
<div class="total"><div class="total-row"><span>${hasHiddenPrice ? 'Total visível' : 'Total'}</span><span>${formatCurrency(total)}</span></div></div>
${hasHiddenPrice ? '<div class="note">Este pedido contém item(ns) com valor sob consulta. O total acima considera apenas os produtos com preço exibido no catálogo.</div>' : ''}
<div class="footer">Este documento é uma solicitação de pedido e pode ser salvo em PDF pelo navegador. Valores e disponibilidade podem ser confirmados pela representante comercial.</div>
<div class="actions"><button onclick="window.print()">Salvar / imprimir PDF</button></div>
<script>setTimeout(()=>window.print(),350)<\/script></body></html>` )
    popup.document.close()
    setGenerated(true)
  }

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && close()}>
      <SheetContent side="right" className="flex w-[100%] flex-col sm:w-[420px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 font-serif">
            <ShoppingBag className="h-5 w-5" />
            Sua sacola
          </SheetTitle>
        </SheetHeader>

        {generated ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-zinc-100 text-zinc-900">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <div className="text-lg font-semibold">Pedido preparado</div>
            <p className="text-sm text-muted-foreground">
              A janela de impressão foi aberta. Escolha “Salvar como PDF” e envie o arquivo diretamente para sua representante.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" onClick={() => setGenerated(false)}>Voltar à sacola</Button>
              <Button
                onClick={() => {
                  setGenerated(false)
                  clear()
                  close()
                  navigate({ name: 'catalog' })
                }}
              >
                Finalizar e continuar
              </Button>
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <div className="text-lg font-semibold">Sua sacola está vazia</div>
            <p className="text-sm text-muted-foreground">
              Explore os catálogos e adicione produtos para começar.
            </p>
            <Button
              onClick={() => {
                close()
                navigate({ name: 'catalog' })
              }}
            >
              Ver produtos
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-4 py-3 scroll-area">
              <ul className="flex flex-col gap-3">
                {items.map((i) => (
                  <li
                    key={i.productId}
                    className="flex gap-3 rounded-xl border border-border bg-background p-2.5"
                  >
                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {i.image ? (
                         
                        <img
                          src={i.image}
                          alt={i.name}
                          className="h-full w-full object-cover"
                        />
                      ) : null}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-medium">{i.name}</div>
                          <div className="text-xs text-muted-foreground">{i.brandName}</div>
                        </div>
                        <button
                          onClick={() => remove(i.productId)}
                          aria-label="Remover"
                          className="text-muted-foreground transition-colors hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setQty(i.productId, i.quantity - 1)}
                            aria-label="Diminuir"
                            className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted disabled:opacity-40"
                            disabled={i.quantity <= i.minQuantity}
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {i.quantity}
                          </span>
                          <button
                            onClick={() => setQty(i.productId, i.quantity + 1)}
                            aria-label="Aumentar"
                            className="grid h-7 w-7 place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-muted"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                        </div>
                        <div className="text-sm font-semibold">
                          {i.showPrice !== false ? formatCurrency(i.price * i.quantity) : 'Sob consulta'}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total dos itens com preço</span>
                <span className="font-serif text-xl font-bold">
                  {formatCurrency(total)}
                </span>
              </div>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome (opcional)"
                className="mb-2"
              />
              <Button
                className="w-full bg-[#111] text-white hover:bg-[#2a2a2a]"
                onClick={generateOrderPdf}
              >
                <FileText className="h-4 w-4" />
                <span className="ml-1.5">Gerar pedido PDF</span>
              </Button>
              <button
                onClick={clear}
                className="mt-2 w-full text-center text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                Esvaziar sacola
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
