# Code Review

Este documento define a política oficial de Code Review do GrowthBot DE.
Ele estabelece como alterações devem ser avaliadas antes de serem tratadas como mudanças aceitáveis na plataforma.

## Objetivo

Definir as regras obrigatórias de revisão de código do GrowthBot DE.

O objetivo deste documento é garantir qualidade técnica, segurança de mudança, consistência arquitetural e disciplina operacional antes da promoção de alterações entre branches e ambientes.

## Escopo

Este documento cobre:

- critérios de revisão
- alinhamento com o handbook
- análise de risco
- revisão de comportamento
- revisão de arquitetura
- revisão de segurança
- revisão de testes
- revisão de observabilidade
- disciplina entre `develop` e `main`

## Regras

### 1. Code review é mecanismo de proteção estrutural

Review não existe apenas para aprovar estilo ou sintaxe.

Ele deve proteger:

- arquitetura
- produto
- segurança
- testabilidade
- observabilidade
- coerência operacional

### 2. Toda revisão deve considerar o handbook

Uma alteração não pode ser avaliada isoladamente do Engineering Handbook.

Revisão deve considerar alinhamento com:

- missão
- arquitetura
- product engineering
- ai platform
- security
- testing
- observability
- backend, frontend, performance e deployment quando aplicável

### 3. Review deve focar comportamento e risco primeiro

A ordem correta de revisão é:

- comportamento
- risco
- regressão
- arquitetura
- segurança
- observabilidade
- testes
- estilo e detalhes menores

Detalhes cosméticos não podem ocupar o lugar de riscos reais.

### 4. Branch flow continua obrigatório

O fluxo oficial do projeto continua sendo:

- desenvolvimento e integração em `develop`
- promoção controlada para `main`

Review deve reforçar esse fluxo, não enfraquecê-lo.

### 5. Review deve avaliar impacto, não apenas diff local

Uma boa revisão considera:

- o que mudou
- por que mudou
- o que isso pode quebrar
- qual parte do sistema foi afetada
- qual risco futuro foi criado

Sem análise de impacto, review fica superficial.

### 6. Mudanças críticas exigem revisão mais rigorosa

Alterações em áreas como:

- autenticação
- autorização
- persistência
- AI Platform
- tracking
- follow-up
- observabilidade
- deploy
- integrações externas

devem receber escrutínio adicional.

### 7. Code review deve exigir testes proporcionais ao risco

Nem toda mudança precisa da mesma profundidade de teste.

Mas mudanças relevantes não devem ser aceitas sem validação compatível com impacto.

### 8. Review deve proteger fronteiras arquiteturais

Se a alteração viola boundaries, mistura camadas, aumenta acoplamento ou esconde lógica estrutural em pontos errados, isso deve ser apontado como problema real.

### 9. Review deve considerar observabilidade e operabilidade

Alterações que afetam comportamento relevante devem ser avaliadas também sob a perspectiva de:

- logs
- métricas
- rastreabilidade
- diagnóstico
- impacto operacional

### 10. Aprovar código não significa aprovar pressa

Velocidade é importante.

Mas review não deve sacrificar critérios fundamentais em nome de conveniência imediata.

## Code Review Decision Framework

Antes de aprovar mudança relevante, deve ser possível responder:

1. essa alteração resolve o problema certo?
2. ela respeita o handbook?
3. há risco de regressão?
4. a arquitetura ficou melhor, igual ou pior?
5. segurança foi preservada?
6. observabilidade e operação foram consideradas?
7. testes são proporcionais ao risco?
8. existe mudança sensível em persistência, IA ou integração?
9. a mudança está madura para `develop` ou para promoção posterior?
10. o que pode quebrar depois dessa alteração?

## Code Review Anti-Patterns

Nunca:

- revisar apenas estilo e ignorar comportamento
- aprovar sem entender impacto
- ignorar quebra de boundary
- aceitar ausência de testes sem justificativa
- tratar risco de segurança como detalhe
- ignorar observabilidade em mudança relevante
- normalizar mudança direta em `main`
- reduzir review a checklist vazia
- confundir rapidez com qualidade
- aprovar por confiança pessoal em vez de evidência técnica

## Future Compatibility

A política de review deve permanecer preparada para:

- equipe maior
- múltiplos revisores
- PRs mais complexos
- pipelines formais
- mudanças multi-runtime
- deploys mais sofisticados
- integração com CI/CD

## Definition of Done

Uma alteração só pode ser considerada suficientemente revisada quando, de forma proporcional ao seu escopo:

- respeita o handbook
- tem comportamento compreendido
- teve risco avaliado
- preserva arquitetura
- preserva segurança
- possui testes compatíveis
- considera observabilidade e operação
- está coerente com o fluxo `develop -> main`
- evita anti-patterns de review

## Checklist

- O problema e a solução estão claros?
- A mudança respeita o handbook?
- Há risco estrutural, funcional ou operacional?
- Security foi considerada?
- Testing foi considerado?
- Observability foi considerada?
- Há boundary quebrado ou acoplamento indevido?
- A mudança está correta para `develop`?
- A promoção futura para `main` permanece segura?
- A entrega atende ao Definition of Done?

## Observações

Code Review no GrowthBot DE deve ser tratado como filtro de qualidade e coerência da plataforma.

A revisão correta não apenas encontra bugs.

Ela protege a direção do produto e a saúde da engenharia.
