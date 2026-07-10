# Performance

Este documento define a política oficial de Performance Engineering do GrowthBot DE.
Ele estabelece como a plataforma deve tratar latência, throughput, custo computacional, eficiência operacional e escalabilidade ao longo de sua evolução como AI Sales Platform.

## Objetivo

Definir as regras obrigatórias que orientam decisões de performance no GrowthBot DE.

O objetivo deste documento não é otimizar tudo antecipadamente. O objetivo é impedir que o sistema cresça com gargalos previsíveis, custos descontrolados, latência degradante ou decisões arquiteturais que comprometam sua evolução operacional.

Performance Engineering, neste projeto, deve equilibrar:

- velocidade de resposta
- custo de execução
- estabilidade operacional
- previsibilidade de carga
- capacidade de escalar
- qualidade da experiência

Performance não é apenas eficiência técnica. Ela é parte da confiabilidade do produto e da sustentabilidade da plataforma.

## Escopo

Este documento cobre:

- latência
- throughput
- uso de recursos
- custo computacional
- custo de inferência
- eficiência de queries
- eficiência de integração externa
- performance da AI Platform
- performance do backend
- performance de persistência
- paginação e volume de dados
- comportamento sob crescimento de carga
- performance observável
- critérios de decisão
- anti-patterns
- Definition of Done

Este documento não substitui Architecture, Backend API, Observability, Security, Testing ou AI Platform. Ele define como a plataforma deve manter desempenho sustentável sem sacrificar clareza, segurança ou capacidade de evolução.

## Regras

### 1. Performance deve ser tratada como requisito de engenharia, não como reação tardia

No GrowthBot DE, performance não deve ser discutida apenas quando o sistema já está lento.

Toda funcionalidade relevante deve considerar:

- impacto em latência
- impacto em custo
- impacto em carga
- impacto em persistência
- impacto em integrações
- impacto em experiência do usuário ou operador

Isso não significa micro-otimizar tudo.

Significa não projetar com cegueira para gargalos óbvios.

### 2. O sistema deve otimizar os fluxos que realmente importam

Performance Engineering deve ser guiado por fluxos críticos, não por obsessão técnica descontextualizada.

No GrowthBot DE, atenção especial deve recair sobre:

- geração de recomendação
- classificação de intenção
- montagem de contexto
- tracking
- follow-up
- leitura operacional de dashboard
- integrações externas
- rotas com maior frequência ou maior impacto

O foco deve estar no que afeta a plataforma de verdade.

### 3. Performance deve ser orientada por medição

Nenhuma otimização relevante deve ser tratada como verdade apenas por intuição.

Antes de otimizar, deve ser possível responder:

- o que está lento?
- em qual etapa?
- com qual frequência?
- com qual impacto?
- em qual volume?

Sem medição, “otimização” vira suposição cara.

### 4. Latência deve ser tratada como parte da experiência

Tempo de resposta afeta:

- fluidez da conversa
- confiança do usuário
- capacidade operacional
- produtividade do operador
- percepção de qualidade

Latência não deve ser avaliada apenas como métrica técnica.

Ela é parte da experiência do produto.

### 5. Custo e performance devem ser pensados juntos

No GrowthBot DE, desempenho não pode ser analisado sem considerar custo.

Isso é especialmente importante para:

- inferências
- chamadas externas
- consultas repetidas
- automações
- operações de dashboard

A melhor performance técnica nem sempre justifica o custo.

O melhor custo nem sempre preserva a experiência necessária.

Performance Engineering deve equilibrar ambos conscientemente.

### 6. O sistema deve evitar trabalho desnecessário

Toda camada da plataforma deve evitar processamento, leitura, escrita, serialização, inferência ou tráfego sem motivo claro.

Sempre que possível, evitar:

- chamadas duplicadas
- recomputação desnecessária
- consultas excessivas
- payloads maiores do que o necessário
- processamento de contexto irrelevante
- logs excessivos sem propósito

Performance ruim frequentemente nasce de desperdício, não apenas de algoritmo ruim.

### 7. A AI Platform deve ser tratada como superfície de custo e latência

Inferência é uma das áreas com maior potencial de impacto em performance da plataforma.

Por isso, a camada de IA deve considerar explicitamente:

- tempo de inferência
- tamanho de contexto
- número de chamadas
- fallback entre modelos
- uso de tools
- uso de MCP Servers
- custo por execução

A AI Platform não pode ser uma zona sem governança de performance.

### 8. Mais contexto nem sempre significa melhor performance

Enviar mais contexto para o modelo pode:

- aumentar latência
- aumentar custo
- aumentar instabilidade
- reduzir previsibilidade

O sistema deve preferir contexto suficiente, e não contexto máximo.

Performance da IA depende tanto de qualidade de contexto quanto de quantidade.

### 9. Consultas e persistência devem crescer com disciplina

A camada de persistência deve evitar padrões que degradam com crescimento de volume.

É obrigatório pensar sobre:

- consultas repetidas
- leitura excessiva de registros
- ordenações caras sem necessidade
- retornos sem limite
- escrita redundante
- scans desnecessários

O fato de o volume atual ser pequeno não justifica decisões evidentemente frágeis.

### 10. Paginação, filtros e ordenação são também decisões de performance

Toda listagem relevante deve considerar:

- limite de volume
- critério claro de ordenação
- filtros úteis
- comportamento estável

Endpoints e consultas que retornam coleções sem limites são risco funcional e de performance.

### 11. Timeouts são proteção de performance

Esperar indefinidamente por integração, inferência ou operação crítica é comportamento estruturalmente ruim.

Timeouts devem ser definidos conforme o papel do fluxo.

Isso protege:

- usuário
- operador
- recursos do sistema
- previsibilidade operacional

Timeout ausente costuma transformar lentidão em indisponibilidade cascata.

### 12. Retries devem ser seletivos

Retry não deve ser reflexo automático.

Antes de adicionar retry, deve estar claro:

- qual falha pode ser transitória
- quantas tentativas fazem sentido
- qual intervalo é aceitável
- qual custo isso adiciona
- quando parar

Retry mal desenhado piora consumo, latência e impacto em dependências externas.

### 13. Fallback é parte da resiliência de performance

Quando performance ideal não for possível, o sistema deve preferir comportamento degradado mas útil, em vez de colapso total.

Isso pode incluir, conforme o fluxo:

- resposta simplificada
- modelo alternativo
- resultado parcial
- operação assíncrona futura
- fila para processamento posterior

Fallback bem pensado melhora resiliência sem esconder problema.

### 14. O backend deve preservar previsibilidade de carga

O backend do GrowthBot DE não deve ser desenhado apenas para funcionar em baixa carga local.

Suas decisões devem evitar:

- explosão de chamadas por request
- dependência síncrona excessiva
- acoplamento rígido entre etapas
- respostas desnecessariamente pesadas

Backend previsível é base para escala futura.

### 15. Dashboards devem ser operacionais e eficientes

Camadas administrativas e operacionais não devem depender de consultas ou agregações ingênuas que degradem com facilidade.

Dashboards devem ser construídos de forma a equilibrar:

- valor operacional
- custo de leitura
- atualidade dos dados
- simplicidade de manutenção

Painel útil não precisa recalcular tudo o tempo todo.

### 16. Processamento síncrono deve ser usado com critério

Nem toda tarefa precisa acontecer dentro do fluxo síncrono principal.

Sempre que o custo operacional ou a latência justificarem, o sistema deve estar preparado para evoluir parte do trabalho para:

- jobs
- filas
- workers
- processamento posterior

A arquitetura não deve presumir que toda lógica sempre caberá com segurança dentro do request-response imediato.

### 17. Performance deve preservar legibilidade e segurança estrutural

Otimização não pode justificar:

- violação de boundaries
- lógica obscura
- redução de segurança
- contratos frágeis
- comportamento difícil de testar

Performance Engineering não deve destruir Architecture para ganhar velocidade aparente.

### 18. Caching só deve existir quando fizer sentido real

Cache pode ser valioso, mas também aumenta:

- complexidade
- risco de inconsistência
- dificuldade de depuração

Antes de introduzir cache, deve estar claro:

- que problema ele resolve
- por quanto tempo o dado pode envelhecer
- como ocorre invalidação
- qual impacto de incoerência

Cache sem disciplina é fonte clássica de comportamento estranho.

### 19. Performance deve ser observável

O sistema deve evoluir com visibilidade suficiente sobre:

- latência por fluxo
- tempo de inferência
- custo estimado
- volume de chamadas
- tempo de consultas
- taxa de fallback
- degradação sob carga

Sem observabilidade, performance vira discussão subjetiva.

### 20. Testes e performance devem conversar

Mudanças com impacto relevante em performance devem ser acompanhadas, quando fizer sentido, por validação adequada.

Isso pode incluir:

- testes de comportamento sob volume
- testes de tempo relativo
- validação de regressão evidente
- cobertura de cenários de fallback

Performance Engineering não deve operar isolado de Testing.

## Performance Decision Framework

Antes de introduzir mudança relevante com impacto em performance, deve ser possível responder:

1. qual fluxo precisa ser otimizado ou protegido?
2. qual problema real de latência, custo ou carga existe?
3. isso foi medido ou apenas suposto?
4. qual é a principal fonte de custo ou lentidão?
5. existe alternativa mais simples?
6. existe risco de aumentar complexidade sem ganho real?
7. qual impacto essa decisão terá em IA, backend, persistência ou dashboard?
8. como essa mudança será observada depois?
9. qual trade-off está sendo aceito?
10. essa otimização preserva evolução futura da plataforma?

Sem essas respostas, a mudança ainda não está madura.

## Performance Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que degradam eficiência e previsibilidade.

Nunca:

- otimizar sem medir
- micro-otimizar código irrelevante
- ignorar latência de integrações externas
- usar IA sem considerar custo e tempo
- retornar listas sem limites
- repetir chamadas e consultas desnecessárias
- adicionar retry indiscriminado
- introduzir cache sem política clara
- sacrificar arquitetura por otimização prematura
- confundir resposta rápida local com prontidão para escalar
- esconder gargalos por falta de observabilidade

Esses anti-patterns criam sistemas frágeis, caros e difíceis de evoluir.

## Future Compatibility

A política de Performance Engineering deve permanecer preparada para cenários futuros como:

- banco compartilhado
- PostgreSQL ou outras persistências mais robustas
- multi-tenant
- multi-language
- multi-channel
- múltiplos modelos de IA
- múltiplos MCP Servers
- filas e workers
- jobs assíncronos
- APIs públicas
- serviços distribuídos
- dashboards mais complexos

Preparação para compatibilidade futura não significa antecipar toda complexidade agora.

Significa não projetar o sistema como se o contexto atual fosse o limite definitivo de crescimento.

## Definition of Done

Uma alteração relevante só pode ser considerada concluída, do ponto de vista de performance, quando de forma proporcional ao seu escopo:

- considera latência, custo e carga
- protege fluxo realmente importante
- evita trabalho desnecessário
- respeita arquitetura e boundaries
- preserva segurança, testes e observabilidade
- trata timeout, retry ou fallback quando necessário
- evita anti-patterns conhecidos
- possui trade-offs compreendidos
- mantém compatibilidade futura razoável

Sem isso, a mudança ainda não está madura em termos de desempenho sustentável.

## Checklist

- O fluxo crítico está claramente identificado?
- O problema de performance foi medido?
- Existe custo computacional ou de inferência relevante?
- Há trabalho desnecessário que pode ser removido?
- Há consultas, payloads ou chamadas excessivas?
- Timeout, retry e fallback foram considerados?
- O impacto em IA, backend e persistência está claro?
- A mudança preserva arquitetura, segurança e testabilidade?
- O comportamento está observável?
- A decisão evita anti-patterns conhecidos?
- A compatibilidade futura foi preservada?
- A entrega atende ao Definition of Done de Performance Engineering?

## Observações

Performance no GrowthBot DE deve ser tratada como disciplina de sustentabilidade operacional.

O objetivo não é buscar velocidade máxima abstrata.

O objetivo é manter a plataforma responsiva, eficiente, previsível e economicamente saudável à medida que produto, IA, integrações e operação crescem.

Sempre que houver tensão entre conveniência imediata e performance estrutural sustentável, a performance estrutural sustentável deve prevalecer.
