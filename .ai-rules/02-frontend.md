# Frontend

Este documento define a política oficial de Frontend Engineering do GrowthBot DE.
Ele estabelece como interfaces, componentes, estados e fluxos visuais devem evoluir com clareza, consistência, acessibilidade e alinhamento com o produto.

## Objetivo

Definir as regras obrigatórias que orientam o frontend do GrowthBot DE.

O objetivo deste documento é impedir que a interface evolua como coleção dispersa de componentes, estilos e estados sem coerência estrutural.

## Escopo

Este documento cobre:

- organização de componentes
- boundaries entre UI, estado e lógica
- composição de interface
- acessibilidade
- consistência visual
- legibilidade
- estados de carregamento, erro e vazio
- integração com backend e AI Platform
- previsibilidade de UX
- testabilidade e observabilidade do frontend

## Regras

### 1. O frontend deve servir clareza operacional e de produto

O GrowthBot DE não precisa de interface decorativa.

Ele precisa de interface clara, compreensível e consistente para:

- usuários
- operadores
- administração

### 2. Componentes devem ter responsabilidade clara

Cada componente deve existir com propósito compreensível.

Evitar componentes genéricos demais, grandes demais ou misturados com lógica que não pertence à UI.

### 3. A UI não deve concentrar regra de negócio indevida

O frontend pode conter lógica de apresentação, composição e estado local.

Regras centrais de domínio, persistência, autenticação crítica e decisões estruturais devem permanecer fora da camada visual.

### 4. Estados vazios, erro e carregamento são obrigatórios

Interfaces não devem assumir apenas cenário feliz.

Toda área relevante deve considerar:

- loading
- empty state
- error state
- degraded state quando aplicável

### 5. Consistência vale mais que criatividade isolada

O GrowthBot DE pode evoluir visualmente, mas a interface não deve parecer feita por partes desconectadas.

Texto, spacing, padrões de ação, feedback e estrutura devem permanecer coerentes.

### 6. Acessibilidade deve ser tratada como requisito de qualidade

Sem acessibilidade mínima, a interface perde robustez.

Semântica, foco, legibilidade e interação previsível devem ser considerados.

### 7. O frontend deve ser observável

Fluxos críticos do frontend devem produzir sinais úteis para operação e produto quando necessário.

### 8. O frontend deve respeitar contratos do backend

A UI não deve improvisar comportamento em cima de contratos incertos.

Integrações precisam ser explícitas e previsíveis.

### 9. Componentes devem favorecer reuso responsável

Reuso é valioso quando reduz duplicação real.

Não criar abstração visual prematura sem padrão comprovado.

### 10. A interface deve preservar opcionalidade futura

O frontend deve poder evoluir para mais fluxos, mais estados e mais superfícies sem colapsar por acoplamento excessivo.

## Frontend Decision Framework

Antes de criar ou alterar componente ou fluxo relevante, deve ser possível responder:

1. qual problema de interface isso resolve?
2. isso melhora clareza do produto?
3. a responsabilidade está na camada correta?
4. existe estado de erro, loading e vazio?
5. isso respeita contratos do backend?
6. existe alternativa mais simples?
7. isso melhora consistência ou a piora?
8. a acessibilidade foi considerada?
9. a mudança é observável e testável quando necessário?
10. isso vale a complexidade criada?

## Frontend Anti-Patterns

Nunca:

- colocar regra de negócio central em componente visual
- criar componente genérico sem necessidade
- ignorar estados de erro
- duplicar UI por conveniência
- violar contratos do backend por improviso
- aumentar complexidade visual sem ganho de clareza
- usar interface para esconder problema estrutural do sistema
- tratar acessibilidade como detalhe opcional

## Future Compatibility

O frontend deve permanecer preparado para:

- novos painéis
- novos canais administrativos
- multi-language
- multi-tenant
- novos fluxos operacionais
- superfícies mais ricas de analytics e IA

## Definition of Done

Uma alteração relevante no frontend só pode ser considerada concluída quando, de forma proporcional ao seu escopo:

- melhora clareza ou valor real do produto
- respeita boundaries corretos
- trata estados relevantes de interface
- mantém consistência visual e comportamental
- respeita contratos do backend
- é testável quando necessário
- considera acessibilidade
- evita anti-patterns conhecidos

## Checklist

- A responsabilidade está na camada correta?
- A mudança melhora clareza?
- Estados de loading, erro e vazio foram tratados?
- Há acoplamento indevido com negócio?
- O contrato do backend foi respeitado?
- A acessibilidade foi considerada?
- A mudança mantém consistência?
- A entrega atende ao Definition of Done?

## Observações

Frontend Engineering no GrowthBot DE deve servir entendimento, previsibilidade e operação.

Interface boa não é a que apenas parece moderna.

É a que deixa o sistema mais claro, confiável e utilizável.
