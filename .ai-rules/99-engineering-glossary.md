# Engineering Glossary

Este documento define o glossário oficial de termos de engenharia do GrowthBot DE.
Ele existe para reduzir ambiguidade conceitual entre produto, arquitetura, IA, backend, segurança, testes e operação.

## Objetivo

Definir linguagem comum para o Engineering Handbook.

## Escopo

Este documento cobre termos recorrentes do projeto, seus significados oficiais e o uso esperado dentro da documentação e das decisões técnicas.

## Regras

### 1. Termos críticos devem ter significado estável

Quando um termo relevante aparecer no handbook, ele deve ser entendido com o mesmo significado ao longo dos documentos.

### 2. O glossário reduz ambiguidade

Quando houver risco de interpretações múltiplas, este documento deve servir como referência conceitual.

### 3. O glossário deve evoluir com disciplina

Novos termos só devem entrar quando houver uso recorrente ou valor real de alinhamento.

### 4. Termos preferenciais do projeto

- `AI Sales Platform`: identidade oficial do GrowthBot DE
- `Product Engineering`: disciplina que conecta produto, engenharia, experiência e operação
- `AI Platform`: camada responsável por modelos, prompts, contexto, tools, MCPs e inferência
- `Observability`: capacidade de entender comportamento do sistema por sinais externos confiáveis
- `Security Engineering`: disciplina que protege dados, acessos, integrações e operação
- `Testing Engineering`: disciplina que protege comportamento crítico e reduz regressões
- `Deployment Engineering`: disciplina de promoção, rollout, rollback e gestão de ambientes
- `Agent Chain`: coordenação multi-etapas entre agentes com papéis explícitos
- `Use Case`: intenção de negócio executável pelo sistema
- `Repository`: fronteira de acesso a persistência
- `Handler`: ponto de orquestração entre entrada e caso de uso
- `Fallback`: comportamento alternativo seguro quando o fluxo principal falha
- `Idempotência`: capacidade de repetir uma operação sem produzir efeito indevido adicional
- `Correlation ID`: identificador para correlacionar eventos de um mesmo fluxo

## Engineering Glossary Decision Framework

Antes de adicionar termo novo ao glossário, deve ser possível responder:

1. o termo é recorrente no handbook?
2. existe ambiguidade real sem ele?
3. o significado proposto melhora alinhamento entre documentos?
4. esse termo deve ser oficial ou apenas contextual?

## Engineering Glossary Anti-Patterns

Nunca:

- adicionar termo desnecessário
- manter termo ambíguo sem definição
- usar nomes diferentes para o mesmo conceito oficial
- transformar o glossário em lista inflada sem utilidade real

## Future Compatibility

O glossário deve permanecer preparado para acompanhar a evolução do handbook sem perder clareza, estabilidade conceitual e utilidade prática.

## Definition of Done

Um termo só pode ser considerado maduro para entrar no glossário quando:

- é recorrente
- reduz ambiguidade real
- possui significado claro
- não duplica conceito já existente

## Checklist

- O termo já existe com significado oficial?
- Há ambiguidade que este documento precisa resolver?
- O novo termo é recorrente o suficiente para entrar no glossário?
- O uso do termo está consistente com o handbook?

## Observações

O glossário não substitui os documentos específicos.

Ele existe para alinhar linguagem.

Quando houver conflito entre uso informal de um termo e seu significado oficial no handbook, o significado oficial deve prevalecer.
