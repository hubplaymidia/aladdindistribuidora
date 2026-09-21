# Cadastro dos Produtos DAILUS — Guia Rápido

## O que foi feito

Todos os produtos da marca **DAILUS** foram extraídos do catálogo oficial da plataforma
Meus Pedidos (aladdingoiania.meuspedidos.com.br) — 21/09/2026 — e convertidos em um
cadastro pronto para o banco de dados do site.

### Filtros aplicados (suas regras)

| Regra | Resultado |
|---|---|
| Somente produtos DAILUS | 182 itens "VZ" (Vizella) **excluídos** |
| Não cadastrar sem foto | 179 produtos sem imagem **excluídos** |
| Não cadastrar abaixo de R$ 1,00 | provadores de centavos **excluídos** |
| Produtos esgotados (sem preço no site) | **cadastrados marcados como SEM ESTOQUE** |
| Ordem, nomes, preços e fotos | **idênticos ao site oficial** |

**Resultado: 305 produtos** (288 disponíveis + 17 sem estoque), 38 categorias,
262 produtos com mais de uma foto, 285 com descrição completa.

## Como cadastrar no seu banco de produção

### Jeito automático (já configurado — recomendado)

O cadastro agora roda **sozinho durante o deploy**. O comando de build do projeto
inclui o seed DAILUS, então basta publicar o site (push no GitHub) que os 305
produtos são cadastrados automaticamente no banco de produção, usando o mesmo
`DATABASE_URL` da Vercel.

- Se um produto já existe, ele é **atualizado** (não duplica).
- Se rodar de novo em outro deploy, continua seguro (idempotente).

> **Atenção:** como o seed roda a cada deploy, os preços/estoque do catálogo oficial
> (arquivo `scripts/dailus-catalog.json`) prevalecem sobre edições manuais feitas no
> painel admin. Se editar um preço manualmente e depois fizer um deploy, o valor volta
> ao do catálogo oficial.

### Jeito manual (alternativa)

1. Coloque o arquivo `.env` com o `DATABASE_URL` do seu PostgreSQL (o mesmo do deploy).
2. Na raiz do projeto, rode:

```bash
npm install            # apenas se ainda não instalou as dependências
npm run db:seed:dailus
```

## O que mudou no site (código)

- **Página da marca Dailus**: mostra os 305 produtos organizados, com filtro por
  38 categorias (Esmaltes, Base Líquida, Blush etc.) e busca.
- **Selos "Sem estoque"**: produtos esgotados aparecem com selo cinza no cartão e
  destaque amarelo na página do produto, com botão de compra desabilitado.
- **Painel administrativo → Produtos**:
  - Novo **filtro por marca** + busca — o que é DAILUS fica separado das outras marcas;
  - Novo **checkbox "Sem estoque (esgotado)"** no formulário do produto
    (quantidade 0 = esgotado);
  - Selo "Sem estoque" na lista de produtos.
- API das marcas agora retorna `quantity` para alimentar os selos.

## Arquivos importantes

- `scripts/seed-dailus.ts` — script de cadastro (idempotente)
- `scripts/dailus-catalog.json` — os 305 produtos com preços, fotos, descrições e ordem
- `dailus-produtos-cadastrados.csv` — planilha de conferência (fora do projeto, na pasta de download)

## Dúvidas comuns

**As imagens são hospedadas onde?** Elas apontam para os servidores oficiais da
Dailus/Mercos (`arquivos.mercos.com`). São as mesmas fotos do site da marca, em alta
qualidade, incluindo as fotos adicionais de cada produto (que aparecem ao passar o
mouse no cartão e na galeria da página do produto).

**E se um produto mudar de preço?** Dá para editar pelo painel admin normalmente,
ou rodar o seed novamente após atualizar o JSON.

**Os produtos sem estoque aparecem para os clientes?** Sim, com o selo "Sem estoque" —
igual ao site da Dailus. Se preferir esconder algum, desmarque "Ativo" no painel.
