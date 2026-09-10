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
