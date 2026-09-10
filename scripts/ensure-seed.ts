/**
 * Inicializa os dados essenciais somente quando o banco esta vazio.
 * Assim `npm run dev` funciona em uma instalacao nova sem ficar preso
 * eternamente na tela "Carregando Aladdin Distribuidora...".
 */
import { db } from '../src/lib/db'
import { seedDatabase } from './seed'

async function main() {
  const [settingsCount, brandCount, categoryCount] = await Promise.all([
    db.siteSettings.count(),
    db.brand.count(),
    db.category.count(),
  ])

  const needsSeed = settingsCount === 0 || brandCount === 0 || categoryCount === 0

  if (!needsSeed) {
    console.log('✓ Banco ja inicializado; seed automatico ignorado.')
    return
  }

  console.log('🌱 Banco novo/vazio detectado. Criando dados iniciais...')
  await seedDatabase()
}

main()
  .catch((error) => {
    console.error('Falha ao preparar o banco local:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await db.$disconnect()
  })
