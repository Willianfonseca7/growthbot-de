# Agent Chain

Este documento define a política oficial de Agent Chain Engineering do GrowthBot DE.
Ele estabelece como cadeias de agentes, coordenação multi-etapas, handoffs, uso de tools e autonomia controlada devem ser tratados na evolução da plataforma.

## Objetivo

Definir as regras obrigatórias para introdução, revisão e evolução de agent chains no GrowthBot DE.

O objetivo deste documento não é incentivar multiagente como sinal de sofisticação.
O objetivo é impedir que a plataforma evolua para fluxos opacos, caros, frágeis e inseguros apenas porque múltiplos agentes parecem tecnicamente atraentes.

Agent Chain Engineering, neste projeto, deve garantir que:

- complexidade seja justificada
- papéis sejam explícitos
- autonomia seja contida
- handoffs sejam rastreáveis
- tools e MCPs operem com limite claro
- falhas sejam compreensíveis
- custo e latência permaneçam governáveis
- segurança, testes e observabilidade não sejam degradados

Mais agentes só são aceitáveis quando geram valor estrutural real.

## Escopo

Este documento cobre:

- critérios para introdução de agent chains
- responsabilidade individual de agentes
- coordenação entre etapas
- handoffs e contexto compartilhado
- orquestração e decisão
- contenção de autonomia
- uso de tools e MCPs
- custo, latência e performance
- segurança aplicada a agentes
- observabilidade e rastreabilidade
- testes de cadeias multiagente
- fallback, interrupção e recuperação
- compatibilidade futura com workers, filas e runtimes múltiplos

Este documento não substitui AI Platform, Security, Testing, Performance, Observability ou Architecture.
Ele traduz essas disciplinas para o caso específico de fluxos com múltiplos agentes e coordenação encadeada.

## Regras

### 1. Agent chain não é default arquitetural

O GrowthBot DE deve preferir:

- fluxo determinístico
- orquestração simples
- um único agente
- sequência explícita de passos

sempre que isso resolver o problema com menor risco.

Agent chain só deve ser introduzida quando houver necessidade real de decomposição multi-etapas que não possa ser atendida adequadamente por fluxo mais simples.

### 2. Complexidade multiagente precisa de justificativa explícita

Antes de introduzir uma chain, deve estar claro:

- por que um fluxo simples não basta
- qual ganho real a decomposição produz
- qual risco ela reduz ou qual capacidade ela habilita
- por que esse ganho justifica o custo adicional

Sem justificativa explícita, multiagente deve ser tratado como complexidade indevida.

### 3. Cada agente deve ter papel definido e restrito

Nenhum agente deve existir como executor genérico de qualquer tarefa.

Cada agente precisa ter:

- objetivo claro
- responsabilidade delimitada
- entradas conhecidas
- saídas conhecidas
- critérios de sucesso
- critérios de falha
- ferramentas autorizadas
- limites operacionais explícitos

Se um agente pode “fazer qualquer coisa”, ele já está mal modelado.

### 4. A cadeia deve ser explicável ponta a ponta

Deve ser possível explicar, de forma simples:

- quem inicia o fluxo
- quem decide o próximo passo
- quem delega
- quem usa ferramenta
- quem produz saída final
- em qual ponto a cadeia pode interromper

Se a cadeia não pode ser explicada de forma clara, ela ainda não está madura para entrar no sistema.

### 5. Handoffs devem ser controlados e minimizados

Toda passagem entre agentes deve operar com:

- contexto suficiente
- contexto minimizado
- formato previsível
- semântica clara
- limite explícito de escopo

Não transferir histórico irrestrito, contexto sensível excessivo ou instruções implícitas por conveniência.

Handoff ruim amplifica custo, latência, risco e opacidade.

### 6. Contexto compartilhado não deve virar memória caótica

Agent chains não devem usar contexto compartilhado como depósito informal de tudo que aconteceu.

O contexto entre agentes deve conter apenas:

- o que o próximo agente realmente precisa
- dados compatíveis com segurança
- instruções relevantes para aquela etapa
- referências rastreáveis ao estado do fluxo

Mais contexto não significa melhor coordenação.

### 7. Um agente não deve corrigir indefinidamente o outro

O sistema não deve criar loops abertos de revisão, crítica e reexecução entre agentes sem limite claro.

Toda cadeia precisa ter:

- critério de parada
- limite de tentativas
- condição de fallback
- condição de falha explícita

Sem isso, a cadeia pode degradar custo, latência e previsibilidade sem produzir melhor resultado.

### 8. Tools e MCPs devem ser autorizados por agente, não por cadeia genérica

Cada agente deve ter acesso apenas às tools e aos MCPs necessários para seu papel.

Não conceder o mesmo conjunto amplo de capacidades para todos os agentes da cadeia.

Deve estar claro:

- qual agente pode usar qual tool
- por que precisa dela
- que tipo de efeito ela pode produzir
- como esse uso será observado

### 9. Menor privilégio continua obrigatório em multiagente

Quanto mais agentes existem, maior a superfície de risco.

Por isso, cadeias multiagente devem reforçar:

- escopo mínimo de contexto
- escopo mínimo de ferramentas
- autonomia limitada
- validação antes de efeito crítico
- possibilidade de interrupção

Multiagente nunca justifica relaxamento de segurança.

### 10. Agent chain deve respeitar a AI Platform, não substituí-la informalmente

Agent chains fazem parte da evolução da AI Platform.

Elas não devem surgir como solução paralela, improvisada ou desacoplada das regras centrais da plataforma de IA.

Toda chain deve respeitar:

- estratégia de modelos
- governança de prompt
- limites de inferência
- validação de saída
- política de tools
- regras de Security
- regras de Observability

### 11. Cadeias devem ser observáveis como fluxo, não apenas como agentes isolados

Não basta logar eventos soltos de cada agente.

A observabilidade da chain deve permitir entender:

- qual fluxo foi iniciado
- quais agentes participaram
- em que ordem atuaram
- qual handoff ocorreu
- onde houve falha
- quanto tempo e custo foram consumidos
- se houve fallback

Sem visão do fluxo completo, multiagente vira caixa-preta fragmentada.

### 12. Correlation ID é obrigatório em fluxos multiagente relevantes

Toda chain relevante deve ter mecanismo de correlação entre:

- entrada inicial
- etapas intermediárias
- chamadas de tool
- integrações externas
- decisão final

Sem correlação, investigação de falha e análise de custo ficam estruturalmente pobres.

### 13. Agent chain deve ser testável

Mesmo que a coordenação seja sofisticada, o sistema deve preservar capacidade de testar:

- papel de cada agente
- contrato de handoff
- cenários de falha
- fallback
- tool usage relevante
- limites de autonomia

Chain que não pode ser testada não está madura para produção.

### 14. Falha de um agente não pode colapsar tudo silenciosamente

A cadeia deve prever:

- falha explícita
- interrupção controlada
- devolução compreensível do estado
- fallback quando fizer sentido
- rastreabilidade do ponto de quebra

Falhar silenciosamente em multiagente é uma forma grave de opacidade operacional.

### 15. Cadeias devem ser economicamente justificáveis

Agent chain não deve consumir múltiplas inferências, tools e contexto adicional sem que isso produza valor proporcional.

Toda decisão multiagente deve considerar:

- custo por execução
- latência agregada
- volume esperado de uso
- impacto operacional
- retorno real em qualidade ou capacidade

Complexidade cara sem ganho claro deve ser rejeitada.

### 16. Agent chain deve preservar opcionalidade futura

As decisões de hoje não devem bloquear evolução futura para:

- workers
- filas
- jobs assíncronos
- múltiplos runtimes
- múltiplos modelos
- novos canais
- agentes especializados

Isso não exige implementar toda a infraestrutura agora.

Exige não modelar cadeias de forma tão rígida que qualquer evolução futura se torne reescrita total.

### 17. A cadeia deve ter ownership conceitual claro

Mesmo que múltiplos agentes participem, deve estar claro qual componente ou camada:

- inicia a chain
- possui a responsabilidade principal pelo fluxo
- responde por falhas
- consolida a decisão final

Sem ownership claro, responsabilidade se dilui e incidentes ficam difíceis de fechar.

### 18. Autonomia deve ser proporcional ao risco da etapa

Nem toda etapa exige o mesmo grau de liberdade.

Agentes em tarefas como:

- classificação
- resumo
- roteamento
- preparação de contexto

podem operar com liberdade diferente de agentes envolvidos em:

- resposta ao usuário
- uso de tool sensível
- escrita crítica
- decisão com impacto operacional

Quanto maior o risco, maior deve ser a contenção.

### 19. Agent chain deve evoluir de forma incremental

O sistema não deve migrar abruptamente de fluxo simples para cadeia sofisticada sem capacidade de comparar impacto.

Sempre que possível, multiagente deve evoluir por etapas:

- necessidade identificada
- chain pequena e explícita
- instrumentação suficiente
- validação de ganho real
- expansão controlada

Sofisticação incremental é preferível a salto opaco.

### 20. Mais agentes não significam automaticamente melhor produto

O objetivo do GrowthBot DE não é parecer avançado.

O objetivo é gerar valor com clareza, segurança, rastreabilidade e disciplina estrutural.

Se uma chain aumenta complexidade sem melhorar:

- qualidade da recomendação
- robustez do fluxo
- capacidade operacional
- governança de IA
- escalabilidade real

ela deve ser considerada regressão disfarçada de avanço.

## Agent Chain Decision Framework

Antes de introduzir ou alterar uma agent chain relevante, deve ser possível responder:

1. por que um fluxo simples não basta?
2. qual problema real a cadeia resolve?
3. qual papel cada agente exerce?
4. quais entradas e saídas cada agente possui?
5. qual handoff existe entre eles?
6. quais tools e MCPs cada agente pode usar?
7. qual risco operacional, de segurança e de custo isso adiciona?
8. como o fluxo será observado ponta a ponta?
9. como falhas e loops serão contidos?
10. essa complexidade é realmente justificável para o produto?

Sem essas respostas, a cadeia ainda não está madura.

## Agent Chain Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que degradam governança multiagente.

Nunca:

- criar múltiplos agentes sem necessidade real
- usar agente genérico para tudo
- permitir handoff opaco
- transferir contexto irrestrito entre agentes
- dar ferramentas amplas demais a todos os agentes
- criar loops sem critério de parada
- aceitar cadeia sem teste, sem logs e sem fallback
- usar multiagente apenas porque parece sofisticado
- ignorar custo e latência agregados
- distribuir responsabilidade de forma confusa
- tratar observabilidade como detalhe posterior

Esses anti-patterns transformam agent chains em risco estrutural.

## Future Compatibility

A política de Agent Chain Engineering deve permanecer preparada para a evolução futura da plataforma, incluindo:

- agentes especializados
- planning agents
- reasoning chains controladas
- coordenação com tools e MCPs
- workers
- filas
- jobs assíncronos
- múltiplos runtimes
- múltiplos modelos
- multi-channel
- multi-language
- workflows mais sofisticados de produto e operação

Preparação futura não significa adotar multiagente agora em todo lugar.

Significa manter a arquitetura pronta para evoluir sem perder governança.

## Definition of Done

Uma alteração relevante em agent chain só pode ser considerada concluída quando, de forma proporcional ao seu escopo:

- possui justificativa clara
- define papéis e handoffs explicitamente
- limita tools e escopo de cada agente
- respeita AI Platform, Security, Testing, Performance e Observability
- possui correlação e rastreabilidade suficientes
- trata custo, latência e fallback
- evita loops e autonomia excessiva
- preserva ownership do fluxo
- evita anti-patterns conhecidos
- preserva compatibilidade futura razoável

Sem esses critérios, a cadeia ainda não está madura para integrar a plataforma com confiança.

## Checklist

- Há necessidade real de chain?
- Um fluxo mais simples foi descartado com justificativa?
- Papéis dos agentes estão claros?
- Entradas, saídas e handoffs estão claros?
- Tools e MCPs estão limitados por agente?
- Existe contenção de loops e falhas?
- Há observabilidade ponta a ponta suficiente?
- O custo e a latência adicionais são justificáveis?
- Existe fallback ou interrupção controlada?
- Security, Testing e AI Platform foram respeitados?
- A complexidade criada é proporcional ao valor?
- A entrega atende ao Definition of Done?

## Observações

Agent Chain Engineering no GrowthBot DE deve ser tratado como evolução controlada, não como default de sofisticação.

Primeiro a plataforma deve provar valor com fluxos simples, observáveis e seguros.

Só depois faz sentido expandir para coordenação multiagente onde isso realmente ampliar capacidade sem destruir clareza operacional.
