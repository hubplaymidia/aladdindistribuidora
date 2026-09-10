# Aladdin Distribuidora — ajustes aplicados

## Direção visual
- Hero da página inicial em vinho/magenta premium, conforme a referência mais recente.
- Seção escura inferior em preto + cinza grafite com gradiente linear e efeitos discretos.
- Verde removido da identidade principal; o verde permanece apenas quando ligado ao reconhecimento oficial do WhatsApp.
- Moldura do hero redesenhada: mais fina, delicada, moderna e com profundidade sutil.
- Tipografia atualizada para Manrope + DM Serif Display, com leitura maior e aparência premium.
- Cards de produtos e catálogos com cantos, sombras, hover e microinterações mais sofisticados.
- Catálogos da home em faixas abstratas por marca, sem imagens de embalagens de outras marcas.
- Header de catálogo de marca passou a usar composição abstrata baseada nas cores da própria marca.

## Catálogo e produtos
- Cada marca mantém sua página exclusiva.
- Cadastro de até 6 imagens por produto no painel admin.
- Galeria no detalhe do produto com imagem principal + miniaturas.
- Controle por produto para mostrar preço ou exibir “Valor sob consulta”.
- Home limitada a 4 produtos em destaque.

## Sacola e pedido
- Removido o envio do pedido pelo WhatsApp a partir da sacola.
- Novo fluxo “Gerar pedido PDF”.
- O documento abre formatado em A4 e usa o recurso do navegador “Salvar como PDF”.
- Produtos com preço oculto aparecem como “Sob consulta” e não distorcem o total visível.

## Conteúdo e navegação
- +9 anos de experiência aplicado ao site e SEO.
- Bloco de representantes removido da home.
- Menu principal simplificado para: Inicial / Catálogos / Produtos / Blog / Contato.
- Academy continua acessível pela home.
- Página de representantes continua disponível por CTAs e pode ser gerenciada no admin.
- Seed do blog ampliado para pelo menos 10 artigos.

## IA
- Integração preparada para Google Gemini / Google AI Studio via `GEMINI_API_KEY`.
- O chatbot e o assistente do painel admin usam Gemini quando a chave está configurada.
- Mantido fallback do provedor anterior para não quebrar desenvolvimento local sem chave.
- Veja `.env.example`.

## Deploy
- Script de produção alterado para Node.js.
- O projeto segue preparado para Next.js/Vercel.
- Para produção real no Vercel, recomenda-se substituir o SQLite local por um banco persistente apropriado antes de publicar dados administrativos.
