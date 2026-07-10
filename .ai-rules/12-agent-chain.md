# Agent Chain

Este documento define a política oficial de Agent Chain Engineering do GrowthBot DE.
Ele estabelece como cadeias de agentes, coordenação entre agentes e decomposição multi-etapas devem ser tratadas na evolução futura da plataforma.

## Objetivo

Definir as regras obrigatórias para introdução e evolução de agent chains no GrowthBot DE.

O objetivo deste documento é impedir que a plataforma evolua para múltiplos agentes sem governança, sem fronteiras claras e sem capacidade de observação e controle.

## Escopo

Este documento cobre:

- papel das agent chains
- coordenação entre agentes
- responsabilidade individual de agentes
- handoff entre etapas
- uso de tools e MCPs
- limites operacionais
- segurança, observabilidade e testes
- fallback e contenção

## Regras

### 1. Agent chain não é default

O GrowthBot DE deve preferir fluxo simples e determinístico quando isso resolver bem o problema.

Agent chain só deve existir quando houver necessidade real de coordenação multi-etapas.

### 2. Cada agente deve ter papel explícito

Nenhum agente deve existir como executor genérico de qualquer tarefa.

Cada agente precisa ter:

- objetivo claro
- entradas claras
- saídas claras
- ferramentas autorizadas
- limites operacionais

### 3. A cadeia deve ser compreensível

Deve ser possível explicar:

- quem inicia
- quem delega
- quem decide
- quem executa
- quem finaliza

Se a cadeia não é explicável, ela não está madura.

### 4. Handoffs devem ser controlados

Toda passagem entre agentes deve operar com contexto suficiente, mas minimizado.

Não transferir contexto irrestrito por conveniência.

### 5. Agent chain deve respeitar AI Platform, Security e Observability

Mais agentes significam mais risco, mais custo e mais opacidade.

Por isso, cadeias multiagente exigem maior rigor de segurança, rastreabilidade e controle.

### 6. Falha de um agente não pode colapsar tudo silenciosamente

A cadeia deve prever:

- fallback
- interrupção controlada
- devolução de erro compreensível
- rastreabilidade do ponto de falha

### 7. Agent chains devem ser testáveis

Mesmo que a coordenação seja sofisticada, o sistema deve manter capacidade de testar handoffs, decisões e falhas relevantes.

## Agent Chain Decision Framework

Antes de introduzir ou alterar uma agent chain, deve ser possível responder:

1. por que um fluxo simples não basta?
2. qual papel cada agente exerce?
3. qual handoff existe entre eles?
4. quais tools e MCPs cada agente pode usar?
5. qual risco operacional isso adiciona?
6. como a cadeia será observada?
7. como falhas serão tratadas?
8. essa complexidade é justificável?

## Agent Chain Anti-Patterns

Nunca:

- criar múltiplos agentes sem necessidade real
- usar agente genérico para tudo
- permitir handoff opaco
- dar ferramentas amplas demais a todos os agentes
- aceitar cadeia sem teste, sem logs e sem fallback
- usar multiagente apenas porque parece sofisticado

## Future Compatibility

Este documento deve permanecer preparado para:

- agentes especializados
- planning agents
- coordenação com tools e MCPs
- workers
- filas
- runtimes múltiplos

## Definition of Done

Uma alteração relevante em agent chain só pode ser considerada concluída quando, de forma proporcional ao seu escopo:

- possui justificativa clara
- define papéis e handoffs explicitamente
- limita tools e escopo de cada agente
- respeita Security, AI Platform, Testing e Observability
- possui fallback e rastreabilidade
- evita anti-patterns conhecidos

## Checklist

- Há necessidade real de chain?
- Papéis estão claros?
- Handoffs estão claros?
- Tools e MCPs estão limitados?
- Existe fallback?
- Há observabilidade suficiente?
- A complexidade é proporcional?
- A entrega atende ao Definition of Done?

## Observações

Agent Chain Engineering no GrowthBot DE deve ser tratado como evolução controlada, não como default de sofisticação.

Mais agentes não significam automaticamente melhor produto.
