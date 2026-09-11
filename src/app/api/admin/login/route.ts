import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createHash } from 'node:crypto'
import { setAdminSession, clearAdminSession, verifyAdmin } from '@/lib/api-helpers'

export const dynamic = 'force-dynamic'

function hash(p: string) {
  return createHash('sha256').update(p).digest('hex')
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const action = body.action ?? 'login'

  if (action === 'logout') {
    await clearAdminSession()
    return NextResponse.json({ ok: true })
  }

  if (action === 'check') {
    const user = await verifyAdmin()
    return NextResponse.json({ authed: !!user, user })
  }

  if (action === 'change-password') {
    const user = await verifyAdmin()
    if (!user) {
      return NextResponse.json({ error: 'Não autenticado.' }, { status: 401 })
    }
    const currentPassword = (body.currentPassword ?? '').toString()
    const newPassword = (body.newPassword ?? '').toString()
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Informe a senha atual e a nova senha.' }, { status: 400 })
    }
    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'A nova senha deve ter pelo menos 6 caracteres.' }, { status: 400 })
    }
    const admin = await db.adminUser.findUnique({ where: { username: user.username } })
    if (!admin || admin.passwordHash !== hash(currentPassword)) {
      return NextResponse.json({ error: 'Senha atual incorreta.' }, { status: 401 })
    }
    const newHash = hash(newPassword)
    await db.adminUser.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    })
    await setAdminSession(admin.username, newHash)
    return NextResponse.json({ ok: true })
  }

  // login
  const username = (body.username ?? '').toString().trim()
  const password = (body.password ?? '').toString()
  if (!username || !password) {
    return NextResponse.json({ error: 'Informe usuário e senha.' }, { status: 400 })
  }
  const admin = await db.adminUser.findUnique({ where: { username } })
  if (!admin || admin.passwordHash !== hash(password)) {
    return NextResponse.json({ error: 'Usuário ou senha inválidos.' }, { status: 401 })
  }
  await setAdminSession(admin.username, admin.passwordHash)
  return NextResponse.json({ ok: true, user: { id: admin.id, username: admin.username } })
}
