# Deploy no Vercel — Aladdin Distribuidora

O projeto foi migrado de SQLite para PostgreSQL (o Vercel não tem sistema de
arquivos persistente, então SQLite em arquivo não funciona em produção).

## O que foi ajustado

1. `prisma/schema.prisma` — `datasource db` agora usa `provider = "postgresql"`
   (antes estava `"sqlite"`), e o `generator client` ganhou
   `binaryTargets = ["native", "rhel-openssl-3.0.x"]` para rodar no runtime
   do Vercel.
2. `package.json`:
   - novo script `postinstall: "prisma generate"` — sem isso o Prisma Client
     não é gerado no ambiente do Vercel e o build quebra.
   - `build` agora roda `prisma generate && prisma db push --accept-data-loss
     && tsx scripts/ensure-seed.ts && next build`, ou seja, a cada deploy o
     schema é sincronizado com o banco e o seed inicial roda se o banco
     estiver vazio (mesmo comportamento que já existia localmente).
3. `.env.example` e `.env` — `DATABASE_URL` trocado do formato
   `file:./dev.db` para uma connection string PostgreSQL.
4. `.gitignore` criado (não existia) — sem ele, `node_modules`, `.next` e
   `.env` seriam enviados ao repositório.

## Passo a passo no Vercel

1. **Crie um banco PostgreSQL.** Opções fáceis e com camada gratuita:
   Vercel Postgres (Storage → Create Database, dentro do próprio projeto),
   Neon (neon.tech) ou Supabase.
2. **Configure as variáveis de ambiente do projeto no Vercel:**
   - `DATABASE_URL` = connection string do Postgres (peça a versão com
     `sslmode=require` / pooled, se o provedor oferecer).
   - `GEMINI_API_KEY` = sua chave do Google AI Studio (opcional, só é
     necessária para o chatbot/assistente do painel).
   - `GEMINI_MODEL` = `gemini-2.5-flash` (ou outro modelo desejado).
3. **Importe o repositório** (framework é detectado automaticamente como
   Next.js). Não precisa mexer em Build Command / Install Command — os
   scripts do `package.json` já fazem tudo.
4. **Deploy.** No primeiro deploy, `prisma db push` cria as tabelas no banco
   novo e `ensure-seed.ts` popula os dados iniciais (marcas, produtos de
   exemplo etc.) porque o banco estará vazio.

## Observação sobre `prisma db push` no build

Rodar `db push` a cada build é simples e funciona bem para este projeto
(não há pasta `prisma/migrations`, o fluxo sempre foi por `db push`). Isso é
suficiente para o estágio atual. Se no futuro quiser um histórico de
migrações versionado (recomendado para não perder controle de mudanças no
schema conforme o projeto cresce), aí sim vale migrar para
`prisma migrate deploy` com migrations commitadas — mas isso é uma melhoria
posterior, não bloqueia o deploy de agora.
