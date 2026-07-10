# MCP Setup

Este documento registra a configuracao oficial dos MCPs utilizados no ambiente de desenvolvimento do GrowthBot DE.
O objetivo e manter um setup minimo, auditavel e alinhado ao principio do menor privilegio.

## MCPs configurados

### Playwright MCP

- Implementacao oficial: `@playwright/mcp`
- Transporte: `stdio`
- Autenticacao: nao aplicavel
- Objetivo: automacao e validacao de navegador durante desenvolvimento e testes locais

### Context7 MCP

- Implementacao oficial: Context7 Platform / MCP
- Transporte: `streamable_http`
- Autenticacao: OAuth oficial do proprio servidor
- Objetivo: consulta de documentacao atualizada de bibliotecas e APIs

### GitHub MCP

- Implementacao oficial: GitHub MCP Server
- Transporte: `streamable_http`
- Autenticacao: bearer token via variavel `GITHUB_PAT_TOKEN`
- Objetivo: acesso controlado a recursos do GitHub a partir do agente

## MCP nao configurado

### OpenAI Developer Documentation MCP

Em 10 de julho de 2026, nao foi localizada uma implementacao oficial publica de um MCP dedicado a documentacao de desenvolvedor da OpenAI com instrucoes oficiais de instalacao para este fluxo.
Por esse motivo, nenhum MCP desse tipo foi instalado neste projeto.

## Variaveis de ambiente

As credenciais nao devem ser versionadas.
Utilize apenas placeholders e configure os valores reais fora do repositorio.

- `GITHUB_PAT_TOKEN`

## Como validar

### Playwright MCP

1. Verificar a configuracao com `codex mcp get playwright`
2. Validar o binario com `npx @playwright/mcp@latest --help`

### Context7 MCP

1. Verificar a configuracao com `codex mcp get context7`
2. Confirmar que o login OAuth foi concluido com sucesso no fluxo oficial do `codex mcp add`

### GitHub MCP

1. Verificar a configuracao com `codex mcp get github`
2. Confirmar que a variavel `GITHUB_PAT_TOKEN` esta definida antes do uso
3. Considerar a validacao funcional apenas apos definir um token real

## Atualizacao

- Playwright: atualizar a referencia `@latest` somente apos validacao do ambiente
- Context7: revisar periodicamente a documentacao oficial do servidor
- GitHub: acompanhar mudancas do servidor oficial e revisar periodicamente os escopos do token

## Permissoes e seguranca

### GitHub MCP

O servidor oficial do GitHub permite diferentes estrategias de autenticacao.
Nesta maquina, a configuracao oficial ja existente foi reaproveitada e usa `GITHUB_PAT_TOKEN`, que deve ser definido fora do repositorio.

Para seguir o menor privilegio:

- use um token separado para este contexto
- conceda apenas os escopos realmente necessarios
- prefira o menor acesso possivel aos repositorios
- rotacione o token periodicamente

Como referencia minima publicada pelo repositorio oficial, os escopos classicos mais comuns sao:

- `repo`
- `read:packages`
- `read:org`

Se um fine-grained PAT atender o seu caso com menos acesso, ele e preferivel.

## Remocao

- `codex mcp remove playwright`
- `codex mcp remove context7`
- `codex mcp remove github`

Depois, remover quaisquer variaveis de ambiente associadas ao MCP removido.
