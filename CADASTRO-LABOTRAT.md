# Cadastro dos Produtos LABOTRAT — Guia Rápido

## O que foi feito

Todos os produtos da marca **LABOTRAT** foram extraídos do catálogo oficial da
plataforma Meus Pedidos (aladdingoiania.meuspedidos.com.br) — 22/09/2026 — e
convertidos em um cadastro pronto para o banco de dados do site.

### Filtros aplicados (as mesmas regras da DAILUS)

| Regra | Resultado |
|---|---|
| Somente produtos LABOTRAT | 100% dos itens confirmados como da marca (linhas Labotrat Pro, Dermo Skin, Sens, Dia a Dia, Vai&Brilha e Epiltrat verificadas na internet) |
| Não cadastrar sem foto | 0 encontrados sem foto |
| Não cadastrar abaixo de R$ 1,00 | 0 encontrados (nenhuma amostra nesta categoria) |
| Produtos esgotados | nenhum esgotado no momento (regra pronta: seriam marcados SEM ESTOQUE) |
| Ordem, nomes, preços e fotos | **idênticos ao site oficial** |

**Resultado: 72 produtos**, 20 categorias (Labotrat Pro, Argila, Dermo Skin,
Body Splash, Sais Espumantes, Shower Gel etc.), 1 produto com múltiplas fotos.

## Como cadastrar

### Jeito automático (já configurado — recomendado)

O script `seed-labotrat.ts` já está incluído no **build do deploy**, junto com o
da DAILUS. Basta publicar o site (push no GitHub) que os 72 produtos são
cadastrados/atualizados automaticamente no banco de produção.

- Produtos já existentes são **atualizados** (não duplica).
- Idempotente: seguro em deploys repetidos.
- Os produtos antigos de demonstração da Labotrat são removidos automaticamente.

> **Atenção:** como o seed roda a cada deploy, os preços do catálogo oficial
> (`scripts/labotrat-catalog.json`) prevalecem sobre edições manuais no painel.

### Jeito manual (alternativa)

```bash
npm install
npm run db:seed:labotrat
```

## Arquivos importantes

- `scripts/seed-labotrat.ts` — script de cadastro (idempotente)
- `scripts/labotrat-catalog.json` — os 72 produtos com preços, fotos, categorias e ordem
- Planilha de conferência: `labotrat-produtos-cadastrados.csv` (na pasta de download)

## Dúvidas comuns

**Os produtos têm descrição?** Na plataforma oficial, os itens LABOTRAT não têm
"informações adicionais" preenchidas (o nome já traz apresentação, tamanho e linha).
O cadastro reflete exatamente isso.

**As imagens são hospedadas onde?** Nos servidores oficiais Labotrat/Mercos
(`arquivos.mercos.com`) — as mesmas fotos do site da marca.

**E se a Labotrat lançar produtos novos?** Basta pedir nova extração: o JSON é
regenerado com as mesmas regras e o próximo deploy cadastra as novidades.
