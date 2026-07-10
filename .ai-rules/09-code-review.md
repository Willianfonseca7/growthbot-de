# Code Review

Este documento concentra a base futura para critérios de revisão de código.
Ele servirá para alinhar qualidade, consistência e avaliação das alterações no projeto.

## Objetivo

Definir as regras de revisão que garantem qualidade técnica, segurança de mudança e disciplina operacional antes da promoção de código entre branches.

## Escopo

Este documento cobre critérios de revisão de alterações, validação de impacto, integridade de branch flow e requisitos mínimos antes de promover mudanças de `develop` para `main`.

## Regras

### 1. Fluxo de branches

O fluxo oficial do projeto é:

- desenvolvimento e integração primeiro em `develop`
- promoção posterior e controlada para `main`

Alterações não devem ser implementadas diretamente em `main` como fluxo padrão.

### 2. Regra de promoção

Toda mudança deve ser revisada e estabilizada em `develop` antes de qualquer promoção para `main`.

`main` deve ser tratada como branch protegida do ponto de vista operacional e narrativo do projeto.

### 3. Exceções

Mudanças diretas em `main` só devem acontecer em situações excepcionais, justificadas e controladas, como correções críticas urgentes.

Mesmo nesses casos, a mudança deve ser reconciliada com `develop` para evitar divergência entre branches.

## Checklist

- A mudança foi realizada primeiro em `develop`?
- O impacto estrutural, funcional e operacional foi revisado?
- Existe justificativa explícita caso a mudança toque `main`?
- `develop` e `main` permanecem coerentes após a promoção?

## Observações

O fluxo `develop -> main` é regra oficial do Engineering Handbook e deve ser mantido por segurança, previsibilidade e controle de evolução.
