'use client'

import * as React from 'react'
import { api } from '@/lib/api'
import { useApp } from '@/lib/store-app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select'
import {
  LogOut, Lock, Sparkles, Plus, Pencil, Trash2, Save, X, Check, ShoppingBag,
  Tags, Users, GraduationCap, FileText, Settings as SettingsIcon, LayoutGrid, Video,
} from 'lucide-react'
import { toast } from 'sonner'
import type {
  Brand, Category, Product, Representative, Course, BlogArticle, SiteSettings,
} from '@/lib/types'
import { formatCurrency, slugify } from '@/lib/format'

export function AdminView() {
  const setAdminAuthed = useApp((s) => s.setAdminAuthed)
  const navigate = useApp((s) => s.navigate)
  const [authed, setAuthed] = React.useState<boolean | null>(null)
  const [username, setUsername] = React.useState('admin')
  const [password, setPassword] = React.useState('')

  React.useEffect(() => {
    api<{ authed: boolean }>('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ action: 'check' }),
    })
      .then((r) => {
        setAuthed(r.authed)
        setAdminAuthed(r.authed)
      })
      .catch(() => setAuthed(false))
  }, [setAdminAuthed])

  const login = async () => {
    try {
      await api('/api/admin/login', {
        method: 'POST',
        body: JSON.stringify({ action: 'login', username, password }),
      })
      setAuthed(true)
      setAdminAuthed(true)
      toast.success('Login efetuado!')
    } catch (e: any) {
      toast.error(e.message || 'Falha no login')
    }
  }

  const logout = async () => {
    await api('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ action: 'logout' }),
    })
    setAuthed(false)
    setAdminAuthed(false)
    navigate({ name: 'home' })
  }

  if (authed === null) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center text-muted-foreground">
        Verificando sessão…
      </div>
    )
  }

  if (!authed) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-4 py-16">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground">
          <Lock className="h-6 w-6" />
        </div>
        <h1 className="font-serif text-2xl font-bold">Painel administrativo</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Acesso restrito à equipe Aladdin Distribuidora.
        </p>
        <Card className="mt-6 w-full">
          <CardContent className="space-y-3 p-5">
            <div>
              <Label htmlFor="u">Usuário</Label>
              <Input id="u" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="p">Senha</Label>
              <Input
                id="p"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && login()}
              />
            </div>
            <Button className="w-full" onClick={login}>
              Entrar
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Demo: <code className="bg-muted px-1 py-0.5 rounded">admin</code> / <code className="bg-muted px-1 py-0.5 rounded">aladdin123</code>
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl font-bold">Painel administrativo</h1>
          <p className="text-sm text-muted-foreground">
            Edite todo o conteúdo do site: textos, imagens, produtos, marcas, cursos, etc.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate({ name: 'home' })}>
            Ver site
          </Button>
          <Button variant="outline" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" /> Sair
          </Button>
        </div>
      </header>

      <Tabs defaultValue="settings">
        <ScrollArea className="w-full whitespace-nowrap scroll-area">
          <TabsList className="flex">
            <TabsTrigger value="settings"><SettingsIcon className="mr-1.5 h-4 w-4" />Site</TabsTrigger>
            <TabsTrigger value="brands"><LayoutGrid className="mr-1.5 h-4 w-4" />Marcas</TabsTrigger>
            <TabsTrigger value="categories"><Tags className="mr-1.5 h-4 w-4" />Categorias</TabsTrigger>
            <TabsTrigger value="products"><ShoppingBag className="mr-1.5 h-4 w-4" />Produtos</TabsTrigger>
            <TabsTrigger value="reps"><Users className="mr-1.5 h-4 w-4" />Representantes</TabsTrigger>
            <TabsTrigger value="courses"><GraduationCap className="mr-1.5 h-4 w-4" />Cursos</TabsTrigger>
            <TabsTrigger value="blog"><FileText className="mr-1.5 h-4 w-4" />Blog</TabsTrigger>
          </TabsList>
        </ScrollArea>

        <TabsContent value="settings" className="mt-4"><SettingsAdmin /></TabsContent>
        <TabsContent value="brands" className="mt-4"><BrandsAdmin /></TabsContent>
        <TabsContent value="categories" className="mt-4"><CategoriesAdmin /></TabsContent>
        <TabsContent value="products" className="mt-4"><ProductsAdmin /></TabsContent>
        <TabsContent value="reps" className="mt-4"><RepsAdmin /></TabsContent>
        <TabsContent value="courses" className="mt-4"><CoursesAdmin /></TabsContent>
        <TabsContent value="blog" className="mt-4"><BlogAdmin /></TabsContent>
      </Tabs>
    </div>
  )
}

// ── AI Assist button (Gemini-powered) ─────────────────────────────────────────
function AIAssistButton({
  context,
  onApply,
  label = 'Gerar com IA',
}: {
  context: string
  onApply: (text: string) => void
  label?: string
}) {
  const [loading, setLoading] = React.useState(false)
  const run = async () => {
    setLoading(true)
    try {
      const res = await api<{ reply: string }>('/api/admin/ai-assist', {
        method: 'POST',
        body: JSON.stringify({ prompt: context }),
      })
      onApply(res.reply.trim())
      toast.success('Texto gerado pela IA!')
    } catch (e: any) {
      toast.error(e.message || 'Erro ao gerar com IA')
    } finally {
      setLoading(false)
    }
  }
  return (
    <Button type="button" variant="outline" size="sm" onClick={run} disabled={loading}>
      <Sparkles className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
      {loading ? 'Gerando…' : label}
    </Button>
  )
}

// ── Settings ──────────────────────────────────────────────────────────────────
function SettingsAdmin() {
  const [s, setS] = React.useState<SiteSettings | null>(null)
  const [saving, setSaving] = React.useState(false)

  const load = () => api<SiteSettings>('/api/admin/settings').then(setS)
  React.useEffect(() => { load() }, [])

  if (!s) return <div className="text-muted-foreground">Carregando…</div>

  const save = async () => {
    setSaving(true)
    try {
      await api('/api/admin/settings', { method: 'PUT', body: JSON.stringify(s) })
      toast.success('Configurações salvas!')
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setSaving(false)
    }
  }

  const upd = (k: keyof SiteSettings, v: any) => setS((p) => p ? { ...p, [k]: v } : p)

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Configurações do site</CardTitle>
        <Button size="sm" onClick={save} disabled={saving}>
          <Save className="h-4 w-4" /> {saving ? 'Salvando…' : 'Salvar'}
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <Field label="Nome da marca">
          <Input value={s.brandName} onChange={(e) => upd('brandName', e.target.value)} />
        </Field>
        <Field label="Selo do hero (ex: +9 anos de experiência)">
          <Input value={s.heroBadge} onChange={(e) => upd('heroBadge', e.target.value)} />
        </Field>
        <Field label="Título do hero">
          <Input value={s.heroTitle} onChange={(e) => upd('heroTitle', e.target.value)} />
        </Field>
        <Field label="Subtítulo do hero" action={
          <AIAssistButton
            context="Escreva um subtítulo curto e elegante (1 frase, até 120 caracteres) para o hero de uma distribuidora de cosméticos e produtos capilares em Goiás/DF."
            onApply={(t) => upd('heroSubtitle', t)}
          />
        }>
          <Textarea value={s.heroSubtitle} onChange={(e) => upd('heroSubtitle', e.target.value)} rows={2} />
        </Field>
        <Field label="URL da imagem do hero">
          <Input value={s.heroImageUrl ?? ''} onChange={(e) => upd('heroImageUrl', e.target.value)} />
        </Field>
        <Field label="Texto institucional" action={
          <AIAssistButton
            context={`Reescreva o texto institucional em português, mantendo o sentido e o tom profissional, em até 2 parágrafos:\n\n${s.institutionalText}`}
            onApply={(t) => upd('institutionalText', t)}
          />
        }>
          <Textarea value={s.institutionalText} onChange={(e) => upd('institutionalText', e.target.value)} rows={5} />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Endereço">
            <Input value={s.address} onChange={(e) => upd('address', e.target.value)} />
          </Field>
          <Field label="Telefone">
            <Input value={s.phone} onChange={(e) => upd('phone', e.target.value)} />
          </Field>
          <Field label="WhatsApp (com DDI, ex: 5562995460509)">
            <Input value={s.whatsapp} onChange={(e) => upd('whatsapp', e.target.value)} />
          </Field>
          <Field label="Instagram 1">
            <Input value={s.instagram1} onChange={(e) => upd('instagram1', e.target.value)} />
          </Field>
          <Field label="Instagram 2">
            <Input value={s.instagram2} onChange={(e) => upd('instagram2', e.target.value)} />
          </Field>
          <Field label="Anos de experiência">
            <Input type="number" value={s.yearsExperience} onChange={(e) => upd('yearsExperience', Number(e.target.value))} />
          </Field>
          <Field label="Qtd. de marcas">
            <Input type="number" value={s.brandsCount} onChange={(e) => upd('brandsCount', Number(e.target.value))} />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label="URL Waze">
            <Input value={s.wazeUrl ?? ''} onChange={(e) => upd('wazeUrl', e.target.value)} />
          </Field>
          <Field label="URL Google Maps">
            <Input value={s.mapsUrl ?? ''} onChange={(e) => upd('mapsUrl', e.target.value)} />
          </Field>
          <Field label="Embed Google Maps (URL src)">
            <Input value={s.mapEmbed ?? ''} onChange={(e) => upd('mapEmbed', e.target.value)} />
          </Field>
        </div>
      </CardContent>
    </Card>
  )
}

// ── Brands ────────────────────────────────────────────────────────────────────
function BrandsAdmin() {
  const [items, setItems] = React.useState<Brand[]>([])
  const [editing, setEditing] = React.useState<Partial<Brand> | null>(null)

  const load = () => api<Brand[]>('/api/admin/brands').then(setItems)
  React.useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    try {
      if (editing.id) {
        await api(`/api/admin/brands/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
      } else {
        await api('/api/admin/brands', { method: 'POST', body: JSON.stringify(editing) })
      }
      toast.success('Marca salva!')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }

  const del = async (id: string) => {
    if (!confirm('Excluir esta marca? Todos os produtos dela serão removidos.')) return
    try {
      await api(`/api/admin/brands/${id}`, { method: 'DELETE' })
      toast.success('Marca excluída')
      load()
    } catch (e: any) { toast.error(e.message) }
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Marcas ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setEditing({ name: '', slug: '', primaryColor: '#111111', accentColor: '#C9A227', bgColor: '#FFFFFF', surfaceColor: '#F5F4F1', textColor: '#0B0B0B', mutedColor: '#6B7280', themeMode: 'light', fontStyle: 'serif', order: items.length, featured: false })}>
          <Plus className="h-4 w-4" /> Nova marca
        </Button>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Editar marca' : 'Nova marca'}</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome"><Input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></Field>
              <Field label="Slug"><Input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Tagline"><Input value={editing.tagline ?? ''} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} /></Field>
              <Field label="Ordem"><Input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
              <Field label="Cor primária"><ColorInput value={editing.primaryColor ?? ''} onChange={(v) => setEditing({ ...editing, primaryColor: v })} /></Field>
              <Field label="Cor de destaque"><ColorInput value={editing.accentColor ?? ''} onChange={(v) => setEditing({ ...editing, accentColor: v })} /></Field>
              <Field label="Cor de fundo"><ColorInput value={editing.bgColor ?? ''} onChange={(v) => setEditing({ ...editing, bgColor: v })} /></Field>
              <Field label="Cor da superfície"><ColorInput value={editing.surfaceColor ?? ''} onChange={(v) => setEditing({ ...editing, surfaceColor: v })} /></Field>
              <Field label="Cor do texto"><ColorInput value={editing.textColor ?? ''} onChange={(v) => setEditing({ ...editing, textColor: v })} /></Field>
              <Field label="Cor sutil (muted)"><ColorInput value={editing.mutedColor ?? ''} onChange={(v) => setEditing({ ...editing, mutedColor: v })} /></Field>
              <Field label="Modo do tema">
                <Select value={editing.themeMode ?? 'light'} onValueChange={(v) => setEditing({ ...editing, themeMode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="light">Claro</SelectItem><SelectItem value="dark">Escuro</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Fonte dos títulos">
                <Select value={editing.fontStyle ?? 'serif'} onValueChange={(v) => setEditing({ ...editing, fontStyle: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="serif">Serifada (premium)</SelectItem><SelectItem value="sans">Sem serifa (moderna)</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="URL da logo"><Input value={editing.logoUrl ?? ''} onChange={(e) => setEditing({ ...editing, logoUrl: e.target.value })} /></Field>
              <Field label="URL da tira/banner"><Input value={editing.stripImageUrl ?? ''} onChange={(e) => setEditing({ ...editing, stripImageUrl: e.target.value })} /></Field>
              <Field label="URL da imagem hero"><Input value={editing.heroImageUrl ?? ''} onChange={(e) => setEditing({ ...editing, heroImageUrl: e.target.value })} /></Field>
            </div>
            <Field label="Descrição" action={
              <AIAssistButton context={`Escreva uma descrição curta (2-3 frases) para a marca "${editing.name}" de cosméticos/produtos capilares.`} onApply={(t) => setEditing({ ...editing, description: t })} />
            }>
              <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
            </Field>
            <div className="mt-3 flex items-center gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Marca em destaque
              </label>
              <Button className="ml-auto" size="sm" onClick={save}><Save className="h-4 w-4" /> Salvar</Button>
            </div>
          </div>
        )}

        <div className="space-y-2">
          {items.map((b) => (
            <div key={b.id} className="flex items-center gap-3 rounded-lg border border-border p-3">
              <span className="h-8 w-8 shrink-0 rounded-md" style={{ background: `linear-gradient(135deg, ${b.primaryColor}, ${b.accentColor})` }} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{b.name}</span>
                  {b.featured && <Badge className="bg-amber-500">Destaque</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{b.tagline} · /{b.slug}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(b)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(b.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Categories ─────────────────────────────────────────────────────────────────
function CategoriesAdmin() {
  const [items, setItems] = React.useState<Category[]>([])
  const [name, setName] = React.useState('')

  const load = () => api<Category[]>('/api/admin/categories').then(setItems)
  React.useEffect(() => { load() }, [])

  const add = async () => {
    if (!name.trim()) return
    try {
      await api('/api/admin/categories', { method: 'POST', body: JSON.stringify({ name, order: items.length }) })
      setName('')
      load()
      toast.success('Categoria adicionada')
    } catch (e: any) { toast.error(e.message) }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir categoria?')) return
    await api(`/api/admin/categories/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Card>
      <CardHeader><CardTitle>Categorias ({items.length})</CardTitle></CardHeader>
      <CardContent className="space-y-3">
        <div className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nova categoria (ex: Shampoo)" onKeyDown={(e) => e.key === 'Enter' && add()} />
          <Button onClick={add}><Plus className="h-4 w-4" /> Adicionar</Button>
        </div>
        <div className="space-y-1">
          {items.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
              <span className="text-sm">{c.name} <span className="text-xs text-muted-foreground">/{c.slug}</span></span>
              <Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Products ──────────────────────────────────────────────────────────────────
function ProductsAdmin() {
  const [items, setItems] = React.useState<Product[]>([])
  const [brands, setBrands] = React.useState<Brand[]>([])
  const [cats, setCats] = React.useState<Category[]>([])
  const [editing, setEditing] = React.useState<Partial<Product> & { images?: string[] } | null>(null)

  const load = React.useCallback(() => {
    Promise.all([
      api<Product[]>('/api/admin/products'),
      api<Brand[]>('/api/admin/brands'),
      api<Category[]>('/api/admin/categories'),
    ]).then(([p, b, c]) => { setItems(p); setBrands(b); setCats(c) })
  }, [])
  React.useEffect(() => { load() }, [load])

  const save = async () => {
    if (!editing) return
    try {
      if (editing.id) {
        await api(`/api/admin/products/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
      } else {
        await api('/api/admin/products', { method: 'POST', body: JSON.stringify(editing) })
      }
      toast.success('Produto salvo!')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir produto?')) return
    await api(`/api/admin/products/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Produtos ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setEditing({ name: '', price: 0, showPrice: true, quantity: 0, minQuantity: 1, images: [], featured: false, active: true, order: 0 })}>
          <Plus className="h-4 w-4" /> Novo produto
        </Button>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Editar produto' : 'Novo produto'}</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome">
                <Input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} />
              </Field>
              <Field label="Slug"><Input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Marca">
                <Select value={editing.brandId ?? ''} onValueChange={(v) => setEditing({ ...editing, brandId: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecionar marca" /></SelectTrigger>
                  <SelectContent>{brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Categoria">
                <Select value={editing.categoryId ?? 'none'} onValueChange={(v) => setEditing({ ...editing, categoryId: v === 'none' ? null : v })}>
                  <SelectTrigger><SelectValue placeholder="Sem categoria" /></SelectTrigger>
                  <SelectContent><SelectItem value="none">— Sem categoria —</SelectItem>{cats.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </Field>
              <Field label="Preço (R$)"><Input type="number" step="0.01" value={editing.price ?? 0} onChange={(e) => setEditing({ ...editing, price: Number(e.target.value) })} /></Field>
              <Field label="Preço antigo (opcional)"><Input type="number" step="0.01" value={editing.oldPrice ?? ''} onChange={(e) => setEditing({ ...editing, oldPrice: e.target.value ? Number(e.target.value) : null })} /></Field>
              <Field label="Quantidade em estoque"><Input type="number" value={editing.quantity ?? 0} onChange={(e) => setEditing({ ...editing, quantity: Number(e.target.value) })} /></Field>
              <Field label="Quantidade mínima"><Input type="number" value={editing.minQuantity ?? 1} onChange={(e) => setEditing({ ...editing, minQuantity: Number(e.target.value) })} /></Field>
              <Field label="Unidade (ex: 300ml)"><Input value={editing.unit ?? ''} onChange={(e) => setEditing({ ...editing, unit: e.target.value })} /></Field>
              <Field label="Ordem"><Input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Descrição" action={
              <AIAssistButton context={`Escreva uma descrição comercial elegante (2-3 frases) para o produto de cosméticos/capilares: "${editing.name}".`} onApply={(t) => setEditing({ ...editing, description: t })} />
            }>
              <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} />
            </Field>
            <ImageManager
              images={editing.images ?? []}
              onChange={(images) => setEditing({ ...editing, images })}
            />
            <div className="mt-3 flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.showPrice ?? true} onChange={(e) => setEditing({ ...editing, showPrice: e.target.checked })} />
                Mostrar preço no catálogo
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} />
                Destaque
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} />
                Ativo
              </label>
              <Button className="ml-auto" size="sm" onClick={save}><Save className="h-4 w-4" /> Salvar</Button>
            </div>
          </div>
        )}

        <div className="space-y-1">
          {items.map((p) => (
            <div key={p.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
                {p.images?.[0] ? <img src={p.images[0]} alt="" className="h-full w-full object-cover" /> : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 truncate text-sm font-medium">
                  {p.name}
                  {p.featured && <Badge className="bg-amber-500">Destaque</Badge>}
                  {!p.active && <Badge variant="secondary">Inativo</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{p.brandName} · {formatCurrency(p.price)}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(p as any)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Reps ──────────────────────────────────────────────────────────────────────
function RepsAdmin() {
  const [items, setItems] = React.useState<Representative[]>([])
  const [editing, setEditing] = React.useState<Partial<Representative> | null>(null)
  const load = () => api<Representative[]>('/api/admin/reps').then(setItems)
  React.useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    try {
      if (editing.id) {
        await api(`/api/admin/reps/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
      } else {
        await api('/api/admin/reps', { method: 'POST', body: JSON.stringify(editing) })
      }
      toast.success('Representante salvo!')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir representante?')) return
    await api(`/api/admin/reps/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Representantes ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setEditing({ name: '', whatsapp: '', active: true, order: items.length })}>
          <Plus className="h-4 w-4" /> Novo representante
        </Button>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Editar' : 'Novo'} representante</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Nome"><Input value={editing.name ?? ''} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></Field>
              <Field label="WhatsApp (ex: 5562995460509)"><Input value={editing.whatsapp ?? ''} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} /></Field>
              <Field label="Região"><Input value={editing.region ?? ''} onChange={(e) => setEditing({ ...editing, region: e.target.value })} /></Field>
              <Field label="Instagram"><Input value={editing.instagram ?? ''} onChange={(e) => setEditing({ ...editing, instagram: e.target.value })} /></Field>
              <Field label="Foto URL"><Input value={editing.photoUrl ?? ''} onChange={(e) => setEditing({ ...editing, photoUrl: e.target.value })} /></Field>
              <Field label="Ordem"><Input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Bio"><Textarea value={editing.bio ?? ''} onChange={(e) => setEditing({ ...editing, bio: e.target.value })} rows={2} /></Field>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing.active ?? true} onChange={(e) => setEditing({ ...editing, active: e.target.checked })} /> Ativo
            </label>
            <Button className="mt-3" size="sm" onClick={save}><Save className="h-4 w-4" /> Salvar</Button>
          </div>
        )}
        <div className="space-y-1">
          {items.map((r) => (
            <div key={r.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {r.name}
                  {!r.active && <Badge variant="secondary">Inativo</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{r.region} · {r.whatsapp}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(r as any)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(r.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Courses ──────────────────────────────────────────────────────────────────
function CoursesAdmin() {
  const [items, setItems] = React.useState<Course[]>([])
  const [editing, setEditing] = React.useState<Partial<Course> & { lessons?: any[] } | null>(null)
  const load = () => api<Course[]>('/api/admin/courses').then(setItems)
  React.useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    try {
      const payload = { ...editing }
      let courseId = editing.id
      if (editing.id) {
        await api(`/api/admin/courses/${editing.id}`, { method: 'PUT', body: JSON.stringify(payload) })
      } else {
        const created = await api<Course>('/api/admin/courses', { method: 'POST', body: JSON.stringify(payload) })
        courseId = created.id
      }
      // Sync lessons: simple delete-all + recreate
      if (courseId && editing.lessons) {
        // delete existing lessons via individual DELETE then POST new ones
        const existing = items.find((c) => c.id === courseId)?.lessons ?? []
        for (const l of existing) {
          await api(`/api/admin/lessons/${l.id}`, { method: 'DELETE' }).catch(() => {})
        }
        for (const [i, l] of editing.lessons.entries()) {
          if (l.youtubeUrl) {
            await api('/api/admin/lessons', { method: 'POST', body: JSON.stringify({ courseId, title: l.title || `Aula ${i + 1}`, youtubeUrl: l.youtubeUrl, order: i }) }).catch(() => {})
          }
        }
      }
      toast.success('Curso salvo!')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir curso e todas as aulas?')) return
    await api(`/api/admin/courses/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Cursos ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setEditing({ title: '', category: 'vendas', level: 'iniciante', featured: false, order: items.length, lessons: [{ title: 'Aula 1', youtubeUrl: '' }] })}>
          <Plus className="h-4 w-4" /> Novo curso
        </Button>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Editar curso' : 'Novo curso'}</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título"><Input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></Field>
              <Field label="Slug"><Input value={editing.slug ?? ''} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} /></Field>
              <Field label="Categoria">
                <Select value={editing.category ?? 'vendas'} onValueChange={(v) => setEditing({ ...editing, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vendas">Vendas</SelectItem>
                    <SelectItem value="maquiagem">Maquiagem</SelectItem>
                    <SelectItem value="financas">Finanças</SelectItem>
                    <SelectItem value="gestao">Gestão</SelectItem>
                    <SelectItem value="desenvolvimento-pessoal">Desenvolvimento Pessoal</SelectItem>
                    <SelectItem value="educacao-financeira">Educação Financeira</SelectItem>
                    <SelectItem value="atendimento">Atendimento</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field label="Nível">
                <Select value={editing.level ?? 'iniciante'} onValueChange={(v) => setEditing({ ...editing, level: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="iniciante">Iniciante</SelectItem><SelectItem value="intermediario">Intermediário</SelectItem><SelectItem value="avancado">Avançado</SelectItem></SelectContent>
                </Select>
              </Field>
              <Field label="Instrutor"><Input value={editing.instructor ?? ''} onChange={(e) => setEditing({ ...editing, instructor: e.target.value })} /></Field>
              <Field label="Duração (ex: 2h)"><Input value={editing.duration ?? ''} onChange={(e) => setEditing({ ...editing, duration: e.target.value })} /></Field>
              <Field label="Capa URL"><Input value={editing.coverUrl ?? ''} onChange={(e) => setEditing({ ...editing, coverUrl: e.target.value })} /></Field>
              <Field label="Ordem"><Input type="number" value={editing.order ?? 0} onChange={(e) => setEditing({ ...editing, order: Number(e.target.value) })} /></Field>
            </div>
            <Field label="Descrição" action={
              <AIAssistButton context={`Escreva uma descrição curta e atrativa (1-2 frases) para o curso "${editing.title}" da categoria ${editing.category}.`} onApply={(t) => setEditing({ ...editing, description: t })} />
            }>
              <Textarea value={editing.description ?? ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={2} />
            </Field>
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={!!editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Curso em destaque
            </label>

            {/* Lessons editor */}
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold flex items-center gap-1.5"><Video className="h-4 w-4" /> Aulas (URLs do YouTube)</span>
                <Button type="button" variant="outline" size="sm" onClick={() => setEditing({ ...editing, lessons: [...(editing.lessons ?? []), { title: `Aula ${(editing.lessons?.length ?? 0) + 1}`, youtubeUrl: '' }] })}>
                  <Plus className="h-3.5 w-3.5" /> Aula
                </Button>
              </div>
              <div className="space-y-2">
                {(editing.lessons ?? []).map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={`Título da aula ${i + 1}`} value={l.title ?? ''} onChange={(e) => { const ll = [...(editing.lessons ?? [])]; ll[i] = { ...ll[i], title: e.target.value }; setEditing({ ...editing, lessons: ll }) }} />
                    <Input placeholder="https://youtube.com/watch?v=…" value={l.youtubeUrl ?? ''} onChange={(e) => { const ll = [...(editing.lessons ?? [])]; ll[i] = { ...ll[i], youtubeUrl: e.target.value }; setEditing({ ...editing, lessons: ll }) }} />
                    <Button type="button" variant="ghost" size="icon" onClick={() => { const ll = [...(editing.lessons ?? [])]; ll.splice(i, 1); setEditing({ ...editing, lessons: ll }) }}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <Button className="mt-4" size="sm" onClick={save}><Save className="h-4 w-4" /> Salvar curso</Button>
          </div>
        )}
        <div className="space-y-1">
          {items.map((c) => (
            <div key={c.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 truncate text-sm font-medium">
                  {c.title}
                  {c.featured && <Badge className="bg-amber-500">Destaque</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{c.category} · {c.lessonsCount} aulas · {c.level}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing({ ...c, lessons: c.lessons.map((l) => ({ title: l.title, youtubeUrl: l.youtubeUrl })) } as any)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(c.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Blog ──────────────────────────────────────────────────────────────────────
function BlogAdmin() {
  const [items, setItems] = React.useState<BlogArticle[]>([])
  const [editing, setEditing] = React.useState<Partial<BlogArticle> | null>(null)
  const load = () => api<BlogArticle[]>('/api/admin/blog').then(setItems)
  React.useEffect(() => { load() }, [])

  const save = async () => {
    if (!editing) return
    try {
      if (editing.id) {
        await api(`/api/admin/blog/${editing.id}`, { method: 'PUT', body: JSON.stringify(editing) })
      } else {
        await api('/api/admin/blog', { method: 'POST', body: JSON.stringify(editing) })
      }
      toast.success('Artigo salvo!')
      setEditing(null)
      load()
    } catch (e: any) { toast.error(e.message) }
  }
  const del = async (id: string) => {
    if (!confirm('Excluir artigo?')) return
    await api(`/api/admin/blog/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Blog ({items.length})</CardTitle>
        <Button size="sm" onClick={() => setEditing({ title: '', excerpt: '', category: 'Cuidados Pessoais', readTime: 5, content: '' })}>
          <Plus className="h-4 w-4" /> Novo artigo
        </Button>
      </CardHeader>
      <CardContent>
        {editing && (
          <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-semibold">{editing.id ? 'Editar' : 'Novo'} artigo</h3>
              <Button variant="ghost" size="icon" onClick={() => setEditing(null)}><X className="h-4 w-4" /></Button>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Título"><Input value={editing.title ?? ''} onChange={(e) => setEditing({ ...editing, title: e.target.value, slug: editing.slug || slugify(e.target.value) })} /></Field>
              <Field label="Categoria"><Input value={editing.category ?? ''} onChange={(e) => setEditing({ ...editing, category: e.target.value })} /></Field>
              <Field label="Autor"><Input value={editing.author ?? ''} onChange={(e) => setEditing({ ...editing, author: e.target.value })} /></Field>
              <Field label="Tempo de leitura (min)"><Input type="number" value={editing.readTime ?? 5} onChange={(e) => setEditing({ ...editing, readTime: Number(e.target.value) })} /></Field>
              <Field label="Capa URL"><Input value={editing.cover ?? ''} onChange={(e) => setEditing({ ...editing, cover: e.target.value })} /></Field>
            </div>
            <Field label="Resumo" action={
              <AIAssistButton context={`Escreva um resumo curto (1 frase, até 140 caracteres) para o artigo "${editing.title}".`} onApply={(t) => setEditing({ ...editing, excerpt: t })} />
            }>
              <Input value={editing.excerpt ?? ''} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} />
            </Field>
            <Field label="Conteúdo (markdown simples: ## título, - item)" action={
              <AIAssistButton context={`Escreva um artigo curto (3-5 parágrafos, em markdown simples com ## subtítulos) sobre: "${editing.title}". Categoria: ${editing.category}. Público: revendedoras de cosméticos.`} onApply={(t) => setEditing({ ...editing, content: t })} />
            }>
              <Textarea value={editing.content ?? ''} onChange={(e) => setEditing({ ...editing, content: e.target.value })} rows={8} />
            </Field>
            <Button className="mt-3" size="sm" onClick={save}><Save className="h-4 w-4" /> Salvar artigo</Button>
          </div>
        )}
        <div className="space-y-1">
          {items.map((a) => (
            <div key={a.id} className="flex items-center gap-3 rounded-md border border-border p-2">
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground">{a.category} · {a.readTime} min · {new Date(a.publishedAt).toLocaleDateString('pt-BR')}</div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setEditing(a as any)}><Pencil className="h-4 w-4" /></Button>
              <Button variant="ghost" size="icon" onClick={() => del(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ── Shared field + helpers ───────────────────────────────────────────────────
function Field({
  label, children, action,
}: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">{label}</label>
        {action}
      </div>
      {children}
    </div>
  )
}

function ColorInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2">
      <input
        type="color"
        value={value || '#000000'}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-12 shrink-0 cursor-pointer rounded-md border border-border bg-transparent p-1"
      />
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function ImageManager({
  images,
  onChange,
}: {
  images: string[]
  onChange: (imgs: string[]) => void
}) {
  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between">
        <label className="text-xs font-medium text-muted-foreground">
          Imagens do produto (até 6)
        </label>
        {images.length < 6 && (
          <Button type="button" variant="outline" size="sm" onClick={() => onChange([...images, ''])}>
            <Plus className="h-3.5 w-3.5" /> Adicionar imagem
          </Button>
        )}
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {images.map((img, i) => (
          <div key={i} className="flex gap-2">
            <div className="h-10 w-10 shrink-0 overflow-hidden rounded bg-muted">
              {img ? <img src={img} alt="" className="h-full w-full object-cover" /> : null}
            </div>
            <Input
              value={img}
              placeholder="/products/..."
              onChange={(e) => { const next = [...images]; next[i] = e.target.value; onChange(next) }}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => { const next = [...images]; next.splice(i, 1); onChange(next) }}>
              <X className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
