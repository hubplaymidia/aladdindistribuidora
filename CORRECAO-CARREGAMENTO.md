# Correcao da tela de carregamento infinito

A tela ficava em "Carregando Aladdin Distribuidora..." porque o frontend aguardava configuracoes e marcas da API, mas um banco novo criado com `prisma db push` nao possui dados iniciais.

Esta versao corrige isso de quatro formas:

1. `.env` usa um caminho SQLite local e portavel: `file:./dev.db`.
2. `npm run dev` executa automaticamente o preparo do Prisma antes de iniciar o Next.js.
3. `scripts/ensure-seed.ts` popula os dados iniciais somente quando o banco esta vazio.
4. A pagina inicial agora mostra um erro util e botao de nova tentativa caso uma API falhe, em vez de girar infinitamente.

## Primeira execucao

```bash
npm install
npm run dev
```

O `predev` faz automaticamente `prisma generate`, `prisma db push` e o seed inicial quando necessario.

Se preferir preparar manualmente:

```bash
npm run setup
npm run dev
```
