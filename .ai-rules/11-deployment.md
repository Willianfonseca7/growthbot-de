# Deployment

Este documento prepara a base para diretrizes futuras de deploy e operação dos ambientes do projeto.
Ele servirá como referência para infraestrutura, publicação, ambientes e evolução operacional da plataforma.

## Objetivo

Definir as regras de promoção operacional do projeto entre branches e, futuramente, entre ambientes.

## Escopo

Este documento cobre o fluxo oficial de promoção de mudanças, disciplina entre branches e a base para futuras regras de deploy e release.

## Regras

### 1. Fluxo oficial de promoção

O fluxo oficial do projeto é:

- mudanças entram primeiro em `develop`
- `main` recebe apenas alterações promovidas de forma controlada

Esse fluxo existe para reduzir risco e preservar segurança operacional.

### 2. Papel das branches

`develop` deve concentrar integração contínua, validação e evolução normal do projeto.

`main` deve representar o estado mais estável e confiável do repositório.

### 3. Regra de atualização

Antes de atualizar `main`, a mudança deve existir, ser revisada e estar coerente em `develop`.

Não usar `main` como branch de experimentação, iteração diária ou validação inicial.

## Checklist

- A mudança foi integrada primeiro em `develop`?
- A promoção para `main` foi feita de forma intencional?
- Há risco de divergência entre `develop` e `main`?
- O estado promovido para `main` está adequado para representar estabilidade?

## Observações

Este fluxo deve ser mantido até nova decisão explícita do Engineering Handbook.
