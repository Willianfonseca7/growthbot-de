# Code Review

Este documento define a política oficial de Code Review do GrowthBot DE.
Ele estabelece como alterações devem ser avaliadas antes de serem tratadas como mudanças aceitáveis na plataforma.

## Objetivo

Definir as regras obrigatórias de revisão de código do GrowthBot DE.

O objetivo deste documento não é transformar review em ritual burocrático.
Seu papel é garantir qualidade técnica, segurança de mudança, consistência arquitetural, proteção operacional e alinhamento com o Engineering Handbook antes da promoção entre branches e ambientes.

Code Review, neste projeto, deve:

- reduzir risco de regressão
- proteger fronteiras estruturais
- impedir erosão arquitetural silenciosa
- validar aderência ao handbook
- reforçar disciplina entre `develop` e `main`
- melhorar qualidade da decisão, não apenas da sintaxe

Review existe para proteger a plataforma, não apenas para “aprovar código”.

## Escopo

Este documento cobre:

- critérios de revisão
- alinhamento com o handbook
- análise de comportamento e risco
- revisão de arquitetura
- revisão de segurança
- revisão de testes
- revisão de observabilidade
- revisão de performance quando aplicável
- coerência entre produto e implementação
- disciplina entre `develop` e `main`
- critérios para maturidade de promoção

Este documento não substitui Architecture, Security, Testing, Product Engineering, Observability ou Deployment.
Ele define como essas disciplinas devem aparecer no momento de avaliar uma alteração antes de aceitá-la como parte do sistema.

## Regras

### 1. Code review é mecanismo de proteção estrutural

Review não existe apenas para aprovar estilo, sintaxe ou preferências locais.

Ele deve proteger:

- arquitetura
- produto
- segurança
- testabilidade
- observabilidade
- performance quando relevante
- coerência operacional

Se a revisão não protege esses elementos, ela está superficial.

### 2. Toda revisão deve considerar o handbook

Uma alteração não pode ser avaliada isoladamente do Engineering Handbook.

Review deve considerar alinhamento com:

- missão
- arquitetura
- product engineering
- ai platform
- security
- testing
- observability
- backend, frontend, performance e deployment quando aplicável

O handbook não é referência decorativa.

Ele é o critério oficial da plataforma.

### 3. Review deve focar comportamento e risco primeiro

A ordem correta de revisão é:

- comportamento
- risco
- regressão
- arquitetura
- segurança
- observabilidade
- testes
- performance quando relevante
- estilo e detalhes menores

Detalhes cosméticos não podem ocupar o lugar de riscos reais.

### 4. Aprovação exige entendimento suficiente da mudança

Ninguém deve aprovar alteração relevante sem entender suficientemente:

- o que mudou
- por que mudou
- o que isso pode quebrar
- quais partes do sistema foram afetadas
- qual risco adicional foi criado

Aprovação sem entendimento é formalidade vazia.

### 5. Review deve avaliar impacto, não apenas diff local

Uma boa revisão considera:

- o diff visível
- o comportamento sistêmico
- dependências indiretas
- risco futuro
- efeitos colaterais operacionais

Sem análise de impacto, review vira inspeção parcial de texto.

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
- agent chains

devem receber escrutínio adicional.

Risco maior exige revisão mais profunda.

### 7. Code review deve exigir testes proporcionais ao risco

Nem toda mudança precisa da mesma profundidade de teste.

Mas mudanças relevantes não devem ser aceitas sem validação compatível com impacto.

Review deve perguntar:

- o comportamento crítico está protegido?
- existe regressão plausível?
- a camada de teste escolhida faz sentido?
- a ausência de teste foi justificada?

### 8. Review deve proteger fronteiras arquiteturais

Se a alteração:

- viola boundaries
- mistura camadas
- aumenta acoplamento
- concentra lógica estrutural em ponto errado
- enfraquece contratos

isso deve ser apontado como problema real, não como detalhe de estilo.

### 9. Review deve considerar produto, não apenas engenharia local

Toda mudança relevante deve ser avaliada também sob a pergunta:

isso melhora o produto da forma certa?

Isso inclui considerar:

- clareza da experiência
- qualidade da recomendação
- integridade da jornada
- impacto operacional
- valor real para o usuário e para a plataforma

Código tecnicamente aceitável ainda pode ser ruim para o produto.

### 10. Review deve considerar segurança explicitamente

Mudanças que envolvam dados, integrações, IA, autenticação, tools, MCPs ou operação não devem passar por review sem avaliação explícita de risco de segurança.

Security não deve ser presumida.

Deve ser verificada.

### 11. Review deve considerar observabilidade e operabilidade

Alterações que afetam comportamento relevante devem ser avaliadas também sob a perspectiva de:

- logs
- métricas
- rastreabilidade
- diagnóstico
- impacto operacional
- monitoramento pós-release

Sistema difícil de operar também é problema de engenharia.

### 12. Review deve considerar performance quando o fluxo justificar

Mudanças em IA, consultas, tracking, dashboard, webhooks, automações ou fluxos de alto volume devem ser avaliadas também sob a ótica de:

- latência
- custo
- carga
- desperdício computacional

Performance não deve ser ignorada quando fizer parte do risco real.

### 13. Review deve sinalizar dívida estrutural com honestidade

Nem toda alteração imperfeita precisa ser rejeitada automaticamente.

Mas toda dívida relevante identificada deve ser:

- reconhecida
- explicitada
- dimensionada
- tratada como decisão consciente

Ignorar dívida conhecida durante review gera erosão silenciosa.

### 14. Aprovar código não significa aprovar pressa

Velocidade é importante.

Mas review não deve sacrificar:

- critérios fundamentais
- segurança de mudança
- clareza arquitetural
- qualidade operacional

Pressa não é justificativa para relaxar governança.

### 15. Review deve reforçar o fluxo oficial entre branches

O fluxo oficial do projeto continua sendo:

- integração e validação em `develop`
- promoção controlada para `main`

Review deve reforçar esse fluxo, não enfraquecê-lo.

Mudanças diretas em `main` como rotina normal devem ser tratadas como desvio de processo.

### 16. Review deve produzir decisão defensável

Toda aprovação ou reprovação relevante deve ser intelectualmente defensável.

Deve ser possível explicar:

- por que a mudança foi aceita
- por que determinado risco foi considerado aceitável
- o que ainda precisa ser acompanhado depois

Review madura não depende de autoridade implícita.

Depende de argumento técnico coerente.

### 17. Revisão deve diferenciar bloqueadores de melhorias

Nem todo comentário de review tem o mesmo peso.

Deve estar claro quando algo é:

- bloqueador real
- risco importante
- melhoria recomendada
- observação futura

Misturar tudo como se tivesse mesma gravidade reduz clareza e eficiência do processo.

### 18. Code review deve melhorar o sistema e também a tomada de decisão

Além de detectar problemas pontuais, review deve fortalecer o padrão de pensamento do projeto.

Boa revisão ajuda a equipe a:

- identificar riscos cedo
- manter coerência com o handbook
- aprender com decisões anteriores
- evitar repetição de erros estruturais

### 19. Review sem contexto suficiente deve parar, não adivinhar

Se o revisor não tem contexto suficiente para avaliar uma mudança relevante, a resposta correta não é aprovar por inércia.

A resposta correta é interromper a decisão até haver contexto suficiente.

Adivinhação não é revisão.

### 20. O objetivo final do review é preservar confiança de evolução

Code Review existe para permitir que a plataforma evolua com confiança.

Se o processo de revisão deixa passar regressões, violações arquiteturais, riscos operacionais ou desalinhamento com o produto, ele falhou em sua função principal.

## Code Review Decision Framework

Antes de aprovar mudança relevante, deve ser possível responder:

1. essa alteração resolve o problema certo?
2. ela respeita o handbook?
3. o comportamento mudou de forma compreendida?
4. há risco de regressão funcional, estrutural ou operacional?
5. a arquitetura ficou melhor, igual ou pior?
6. segurança foi preservada?
7. observabilidade e operação foram consideradas?
8. testes são proporcionais ao risco?
9. existe mudança sensível em persistência, IA, integração ou deploy?
10. a mudança está madura para `develop` ou para promoção posterior?

Sem essas respostas, a aprovação ainda não está madura.

## Code Review Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que enfraquecem a revisão.

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
- esconder bloqueador atrás de comentário ambíguo
- relativizar dívida estrutural sem registrá-la

Esses anti-patterns degradam o papel do review como filtro de qualidade.

## Future Compatibility

A política de review deve permanecer preparada para:

- equipe maior
- múltiplos revisores
- PRs mais complexos
- pipelines formais
- mudanças multi-runtime
- deploys mais sofisticados
- integração com CI/CD
- fluxos com agentes, tools e MCPs mais avançados
- maior exigência de segurança e observabilidade

Preparação futura não significa burocratizar o processo agora.

Significa manter um modelo de revisão que continue útil quando o projeto crescer.

## Definition of Done

Uma alteração só pode ser considerada suficientemente revisada quando, de forma proporcional ao seu escopo:

- respeita o handbook
- tem comportamento compreendido
- teve risco avaliado
- preserva arquitetura
- preserva segurança
- possui testes compatíveis
- considera observabilidade e operação
- considera performance quando relevante
- está coerente com o fluxo `develop -> main`
- evita anti-patterns de review

Sem isso, a revisão ainda não protege suficientemente a plataforma.

## Checklist

- O problema e a solução estão claros?
- A mudança respeita o handbook?
- O comportamento alterado está compreendido?
- Há risco estrutural, funcional ou operacional?
- Security foi considerada?
- Testing foi considerado?
- Observability foi considerada?
- Performance foi considerada quando aplicável?
- Há boundary quebrado ou acoplamento indevido?
- Existe dívida estrutural relevante sendo introduzida?
- A mudança está correta para `develop`?
- A promoção futura para `main` permanece segura?
- A entrega atende ao Definition of Done?

## Observações

Code Review no GrowthBot DE deve ser tratado como filtro de qualidade, coerência e maturidade operacional da plataforma.

A revisão correta não apenas encontra bugs.

Ela protege a direção do produto, a disciplina da engenharia e a capacidade de evolução segura do sistema.
