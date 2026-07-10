# Observability

Este documento define a política oficial de Observability Engineering do GrowthBot DE.
Ele estabelece como a plataforma deve produzir visibilidade operacional, rastreabilidade, medição e capacidade de diagnóstico ao longo de todo o ciclo de vida do produto.

## Objetivo

Definir as regras obrigatórias que tornam o GrowthBot DE observável como AI Sales Platform.

Observability, neste projeto, não existe apenas para investigar erros técnicos. Ela existe para tornar visíveis:

- comportamento do sistema
- fluxos do produto
- decisões da camada de IA
- eventos comerciais
- qualidade operacional
- gargalos estruturais
- impacto real das mudanças

O objetivo é impedir que a plataforma cresça como uma caixa-preta, onde há respostas, automações, cliques, follow-ups e recomendações, mas pouca capacidade de entender o que realmente está acontecendo.

## Escopo

Este documento cobre:

- logs estruturados
- métricas técnicas e de produto
- tracing e correlação
- eventos do sistema
- eventos de IA
- eventos comerciais
- auditoria operacional
- diagnósticos de falha
- visibilidade da jornada
- dashboards
- alertabilidade futura
- critérios de decisão para introduzir observabilidade
- anti-patterns
- Definition of Done

Este documento não substitui Security Engineering, Testing, Product Engineering ou Architecture. Ele define como o sistema deve produzir visibilidade suficiente para que todas essas disciplinas operem com confiança.

## Regras

### 1. Observabilidade é requisito estrutural, não luxo operacional

No GrowthBot DE, observabilidade não deve ser tratada como melhoria opcional para depois.

Toda funcionalidade relevante, especialmente quando envolver:

- IA
- tracking
- follow-up
- persistência
- integração externa
- automação
- dashboard
- jornada comercial

deve ser pensada com algum nível de observabilidade desde o início.

Se o sistema não consegue explicar o que fez, ele ainda não está maduro.

### 2. O sistema deve ser compreensível por fora

Observability Engineering existe para tornar o comportamento interno visível a partir de sinais externos confiáveis.

Isso significa que deve ser possível entender, com nível suficiente de detalhe:

- o que aconteceu
- quando aconteceu
- em qual fluxo aconteceu
- com qual resultado
- com qual impacto
- por qual componente passou

Sem isso, o GrowthBot DE não consegue evoluir de forma segura.

### 3. Logs devem ser estruturados

Logs não devem ser pensados como texto solto orientado apenas à leitura humana.

Logs relevantes devem ser estruturados para permitir:

- filtragem
- correlação
- agrupamento
- diagnóstico
- análise posterior

Sempre que fizer sentido, os logs devem conter campos previsíveis, como:

- timestamp
- componente
- tipo de evento
- status
- correlation id
- user id ou equivalente permitido
- flow id ou contexto operacional

Sem estrutura, log vira ruído.

### 4. Logs devem ser úteis e proporcionais

O sistema não deve registrar tudo indiscriminadamente.

Cada log deve existir porque ajuda a:

- entender comportamento
- investigar falhas
- acompanhar decisões relevantes
- reconstruir fluxo
- analisar impacto

Log excessivo aumenta custo, ruído e risco.

Log insuficiente impede investigação.

O objetivo é utilidade proporcional.

### 5. Segurança e observabilidade devem coexistir

Logs, traces e métricas não podem expor indevidamente:

- segredos
- tokens
- credenciais
- payloads sensíveis completos
- contexto excessivo de usuário
- informações privadas sem justificativa

Observabilidade não pode degradar a postura de segurança do sistema.

Toda visibilidade deve respeitar minimização e proteção de dados.

### 6. Correlation ID deve existir para fluxos relevantes

Todo fluxo operacional relevante deve ser rastreável por identificador de correlação ou mecanismo equivalente.

Isso é especialmente importante em fluxos com múltiplas etapas, como:

- entrada do usuário
- classificação de intenção
- seleção de candidatos
- inferência
- persistência
- clique
- follow-up
- atualização de dashboard

Sem correlação, cada log vira evento isolado e perde valor investigativo.

### 7. O sistema deve medir eventos, não apenas páginas e erros

GrowthBot DE não é apenas uma aplicação web.

Sua observabilidade deve se concentrar em eventos de produto e operação, como:

- usuário entrou em contato
- intenção foi classificada
- recomendação foi gerada
- produto foi selecionado
- clique foi registrado
- follow-up foi agendado
- follow-up foi enviado
- falha ocorreu em integração
- fluxo foi interrompido

Eventos são a linguagem observável do produto.

### 8. A jornada comercial deve ser observável ponta a ponta

O sistema deve evoluir para tornar mensurável o funil completo da plataforma.

No mínimo, deve haver capacidade futura de observar encadeamentos como:

usuário entrou

→ intenção foi detectada

→ recomendação foi gerada

→ clique ocorreu

→ follow-up foi enviado

→ re-engajamento ocorreu

→ resultado comercial foi medido

Se o sistema enxerga apenas partes isoladas da jornada, a otimização do produto fica comprometida.

### 9. IA deve ser observável como camada própria

A AI Platform precisa produzir sinais específicos de observabilidade.

No mínimo, a evolução da plataforma deve permitir medir:

- volume de inferências
- latência por fluxo
- taxa de erro
- taxa de resposta inválida
- uso de tools
- uso de MCP Servers
- fallback acionado
- custo estimado
- impacto operacional da inferência

IA sem observabilidade é uma caixa-preta cara.

### 10. Métricas técnicas e métricas de produto devem coexistir

O GrowthBot DE precisa combinar duas visões:

- saúde técnica do sistema
- impacto comportamental e comercial do produto

Não basta medir:

- uptime
- erros
- tempo de resposta

Também é necessário evoluir para medir:

- recomendação gerada
- clique por recomendação
- follow-up por segmento
- conversão por fluxo
- perda de usuários por etapa
- efetividade operacional

Uma plataforma comercial precisa das duas camadas.

### 11. Dashboards devem servir decisão, não ornamentação

Dashboards não devem existir apenas para mostrar números bonitos.

Cada painel deve responder a perguntas operacionais reais, como:

- o sistema está saudável?
- onde o fluxo quebra?
- a IA está ajudando ou atrapalhando?
- quais recomendações performam melhor?
- há gargalo em follow-up?
- há aumento de erro ou queda de conversão?

Se um dashboard não apoia decisão, ele provavelmente está mal definido.

### 12. Observabilidade deve apoiar depuração e também aprendizado

O objetivo não é apenas descobrir bugs.

Observabilidade deve permitir:

- investigar incidentes
- entender regressões
- validar hipóteses de produto
- revisar impacto de arquitetura
- otimizar IA
- ajustar automações
- melhorar jornada

Isso transforma visibilidade em capacidade real de evolução.

### 13. Métricas precisam de semântica clara

Nenhuma métrica importante deve existir sem definição clara.

Para cada métrica relevante, deve estar claro:

- o que ela representa
- quando ela aumenta
- quando ela diminui
- o que não está incluído nela
- por que ela importa

Métricas sem semântica consistente geram decisões ruins.

### 14. Nem todo sinal precisa virar métrica permanente

O sistema não deve transformar qualquer dado disponível em métrica obrigatória.

Uma métrica só deve existir se houver motivo claro para:

- acompanhar tendência
- detectar risco
- apoiar decisão
- validar hipótese
- revelar degradação

Métrica demais sem propósito produz fadiga e confusão.

### 15. Falhas devem ser observáveis com contexto suficiente

Quando um fluxo falhar, o sistema deve oferecer contexto suficiente para responder:

- onde falhou
- em qual etapa
- sob qual condição
- com qual insumo principal
- com qual impacto
- se houve fallback

Sem esse contexto, o tempo de diagnóstico cresce desnecessariamente.

### 16. Observabilidade deve cobrir integrações externas

Integrações como:

- OpenAI
- Telegram
- MCP Servers
- tools externas
- tracking redirects

devem gerar sinais observáveis próprios.

Não basta saber que o sistema falhou.

É necessário entender se a falha veio de dependência externa, da plataforma interna ou da interação entre ambas.

### 17. Auditoria e observabilidade se complementam

Nem todo evento observável é evento auditável.

Mas ações críticas devem ser registradas com cuidado suficiente para permitir reconstrução posterior.

Isso inclui, quando aplicável:

- alterações de estado
- envio de follow-up
- registro de clique
- resposta operacional relevante
- acionamento de fallback
- uso sensível de tool ou MCP

Sem isso, incidentes se tornam difíceis de investigar com precisão.

### 18. O sistema deve preferir eventos de domínio úteis

Além de logs técnicos, o GrowthBot DE deve evoluir para produzir eventos de domínio com significado operacional.

Exemplos conceituais:

- `intent_detected`
- `recommendation_generated`
- `click_registered`
- `followup_scheduled`
- `followup_sent`
- `ai_fallback_triggered`
- `catalog_match_failed`

Esses eventos aproximam engenharia, produto e operação.

### 19. Observabilidade deve ser incremental, mas intencional

Nem tudo precisa ser instrumentado com profundidade máxima na primeira versão.

Mas toda evolução importante deve perguntar:

- o que precisamos enxergar nesse fluxo?
- o que pode quebrar aqui?
- o que precisamos medir para melhorar isso depois?

Instrumentação pode crescer em etapas.

Falta de intenção não pode virar desculpa para cegueira estrutural.

### 20. Alertabilidade futura deve ser considerada

Mesmo quando o projeto ainda não possui alerting completo, as métricas e eventos devem ser desenhados de modo que futuramente possam sustentar:

- alertas de falha
- alertas de degradação
- alertas de latência
- alertas de custo
- alertas de volume anômalo
- alertas de conversão anormal

Observabilidade madura prepara o terreno para operações mais robustas.

## Observability Decision Framework

Antes de adicionar ou alterar instrumentação relevante, deve ser possível responder:

1. qual fluxo estamos tentando tornar visível?
2. qual decisão essa visibilidade permitirá tomar?
3. qual evento, log, métrica ou trace realmente ajuda?
4. existe risco de excesso de ruído?
5. existe risco de exposição de dados?
6. qual correlação será necessária?
7. essa observabilidade serve depuração, produto, operação ou todos?
8. como essa informação será consumida?
9. qual custo de manter essa instrumentação?
10. essa visibilidade é proporcional ao valor e ao risco do fluxo?

Sem essas respostas, a instrumentação ainda não está madura.

## Observability Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que enfraquecem visibilidade real do sistema.

Nunca:

- logar tudo sem critério
- criar métricas sem semântica clara
- instrumentar apenas erros e ignorar fluxo de negócio
- expor dados sensíveis em logs ou dashboards
- medir volume sem medir qualidade
- gerar dashboards sem pergunta operacional real
- criar eventos duplicados e inconsistentes
- observar apenas frontend e ignorar backend ou IA
- registrar sinais sem correlation id quando o fluxo exige correlação
- confundir quantidade de dashboards com maturidade operacional

Esses anti-patterns geram falsa sensação de visibilidade.

## Future Compatibility

A política de observabilidade deve permanecer preparada para a evolução futura da plataforma, incluindo:

- multi-tenant
- multi-language
- multi-channel
- múltiplos modelos de IA
- múltiplos MCP Servers
- novos parceiros
- filas e workers
- serviços distribuídos
- bancos mais robustos
- tracing distribuído
- APIs públicas
- automações mais sofisticadas

Preparação para compatibilidade futura não significa antecipar toda a complexidade.

Significa não criar instrumentação que só funcione em um cenário pequeno e frágil demais.

## Definition of Done

Uma alteração relevante só pode ser considerada concluída, do ponto de vista de observabilidade, quando de forma proporcional ao seu escopo:

- torna o fluxo principal visível
- registra sinais úteis e não apenas ruído
- respeita segurança e minimização de dados
- possui logs estruturados quando necessário
- possui correlação suficiente quando o fluxo exige
- mede impacto técnico ou de produto de forma coerente
- permite diagnóstico razoável em caso de falha
- produz eventos com semântica clara
- possui documentação suficiente
- evita anti-patterns conhecidos
- preserva compatibilidade futura relevante

Sem isso, a mudança pode funcionar, mas continua difícil de operar e evoluir.

## Checklist

- O fluxo relevante está observável?
- Está claro qual decisão essa instrumentação apoia?
- Logs estão estruturados quando necessário?
- Há risco de ruído excessivo?
- Há risco de exposição sensível?
- Existe correlation id ou mecanismo equivalente quando necessário?
- Eventos de domínio foram considerados?
- Métricas possuem semântica clara?
- O fluxo de IA está observável?
- O impacto comercial ou operacional está mensurável?
- A instrumentação evita anti-patterns conhecidos?
- A compatibilidade futura foi preservada?
- A entrega atende ao Definition of Done de Observability Engineering?

## Observações

Observabilidade no GrowthBot DE deve servir simultaneamente engenharia, produto, IA e operação.

Isso significa que o sistema precisa ser observável não apenas como software, mas como plataforma comercial orientada por conversas, decisões e automações.

Sempre que houver tensão entre conveniência de implementação e visibilidade estrutural mínima, a visibilidade estrutural deve prevalecer.
