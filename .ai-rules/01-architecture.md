# Architecture

Este documento define as regras arquiteturais do GrowthBot DE.
Ele é a principal referência para mudanças estruturais e para a evolução segura da plataforma ao longo do tempo.

## Objetivo

Definir os princípios, limites e critérios arquiteturais que orientam a evolução do GrowthBot DE como AI Sales Platform. Este documento existe para garantir consistência estrutural, reduzir acoplamento indevido e permitir crescimento contínuo sem reescritas completas.

## Escopo

Este documento cobre arquitetura de software, organização modular, regras de dependência, critérios para abstrações, evolução estrutural, desenho de serviços, relação com persistência, uso de eventos e requisitos mínimos de observabilidade arquitetural.

Ele não define missão do produto, regras de negócio detalhadas, padrões visuais de frontend ou instruções específicas de implementação. Esses tópicos pertencem a outros documentos da base `.ai-rules/`.

## Regras

### 1. Direção Arquitetural

GrowthBot DE deve ser tratado arquiteturalmente como uma AI Sales Platform, e não como um bot isolado, um assistente simples ou uma integração pontual com LLM.

Toda decisão arquitetural deve assumir que o sistema evoluirá para suportar:

- múltiplos canais de entrada
- múltiplos LLMs
- múltiplos MCP Servers
- múltiplos tenants
- banco compartilhado
- serviços distribuídos
- filas
- workers
- analytics
- automações

A arquitetura deve permitir crescimento incremental. Mudanças futuras devem ser acomodadas por extensão estrutural, e não por reescrita ampla do núcleo do sistema.

### 2. Princípios Arquiteturais

#### 2.1 Modularidade

O sistema deve ser dividido em módulos com fronteiras claras. Cada módulo existe para resolver um problema delimitado e deve poder evoluir com o mínimo possível de impacto colateral.

Modularidade não significa multiplicar arquivos ou camadas sem necessidade. Significa estabelecer unidades de responsabilidade compreensíveis, previsíveis e sustentáveis.

#### 2.2 Alta Coesão

Cada módulo deve concentrar elementos que pertencem ao mesmo contexto funcional. Arquivos, regras e fluxos relacionados a um mesmo domínio devem permanecer próximos.

Um módulo coeso facilita manutenção, leitura e testes porque o comportamento relevante está concentrado onde faz sentido.

#### 2.3 Baixo Acoplamento

Módulos não devem depender de detalhes internos uns dos outros. Eles devem interagir por contratos simples e previsíveis.

Baixo acoplamento reduz impacto de mudanças locais, facilita substituição de implementações e melhora a capacidade de evolução incremental.

#### 2.4 Single Responsibility

Cada unidade de software deve ter uma razão principal para mudar. Um arquivo, serviço ou módulo não deve acumular responsabilidades de naturezas diferentes apenas por conveniência.

Se uma alteração em regras de negócio, persistência, integração externa e interface afeta o mesmo arquivo, a responsabilidade provavelmente está mal definida.

#### 2.5 Separation of Concerns

Interface, orquestração, regras de negócio, integrações externas, persistência e observabilidade devem permanecer separadas.

Separar preocupações não é burocracia. É o mecanismo que impede que o sistema se torne difícil de entender e perigoso de alterar.

#### 2.6 Composition over Inheritance

A composição deve ser preferida à herança como forma de construir comportamento. Dependências explícitas e composição de serviços tendem a ser mais previsíveis, mais testáveis e menos rígidas.

Herança só deve aparecer quando houver uma justificativa muito clara e um ganho concreto de modelagem.

#### 2.7 Evolução Incremental

A arquitetura deve ser preparada para crescer por pequenas decisões consistentes. Em vez de antecipar toda complexidade futura, o sistema deve abrir caminhos para evolução controlada.

O objetivo não é prever tudo. O objetivo é não bloquear o que provavelmente virá.

#### 2.8 Simplicidade Antes da Complexidade

A solução mais simples que respeita os limites arquiteturais deve ser preferida. Complexidade só é aceitável quando reduz risco real, resolve restrição concreta ou prepara um caminho inevitável de evolução.

Sofisticação estrutural sem necessidade comprovada é dívida cognitiva.

#### 2.9 Arquitetura Orientada ao Domínio

A organização deve refletir o domínio do negócio antes de refletir tecnologia. O eixo principal do projeto deve ser o fluxo comercial e operacional da plataforma, e não o framework utilizado.

Quando houver dúvida entre estruturar por camada técnica ou por contexto de negócio, a preferência deve ser por domínio, desde que a clareza seja mantida.

#### 2.10 Dependências Apontando para o Núcleo do Negócio

O núcleo da lógica de negócio deve ser o elemento mais estável do sistema. Integrações, frameworks e detalhes de infraestrutura devem apontar para ele, e não o contrário.

A regra central é simples: tecnologia externa pode conhecer o domínio; o domínio não deve conhecer detalhes da tecnologia externa.

#### 2.11 Interfaces Somente Quando Houver Necessidade Real

Interfaces, contratos e portas de abstração devem ser introduzidos quando houver motivo concreto, como múltiplas implementações, redução clara de acoplamento ou proteção de uma fronteira importante.

Não criar interfaces por hábito, por estilo ou por expectativa abstrata de futura necessidade.

#### 2.12 Abstrações Apenas Quando Justificadas

Toda abstração deve pagar seu custo cognitivo. Uma abstração sem justificativa tende a esconder fluxo, aumentar indireção e tornar mudanças mais lentas.

Abstrair cedo demais é uma forma comum de overengineering.

### 3. Organização dos Módulos

Cada módulo deve possuir responsabilidade única e fronteira explícita.

Exemplos de domínios esperados para a evolução do projeto:

- Conversation
- Intent
- Recommendations
- Catalog
- AI Platform
- Tracking
- Follow-up
- Analytics
- Persistence
- Authentication
- Dashboard

Cada domínio deve evoluir como unidade relativamente independente. Isso significa:

- não misturar regras de múltiplos domínios no mesmo módulo
- não usar um módulo como “depósito genérico” de lógica variada
- não centralizar decisões de negócio de todos os contextos em um único arquivo ou serviço

Se uma implementação começa a atender mais de um domínio sem justificativa clara, ela deve ser reavaliada e potencialmente reorganizada.

### 4. Regras de Dependência

As dependências devem seguir um fluxo previsível.

A lógica de negócio não pode depender diretamente de:

- framework web
- banco de dados
- Telegram
- OpenAI
- MCP
- SDKs externos

Essas integrações devem permanecer isoladas em adapters, providers, gateways ou camadas equivalentes.

O núcleo do negócio deve operar sobre intenções, recomendações, eventos, sessões, decisões e estados do sistema, e não sobre detalhes específicos de transporte, SDK ou persistência.

Qualquer dependência externa que entre diretamente no núcleo tende a dificultar testes, migração tecnológica e evolução estrutural.

### 5. Responsabilidade dos Componentes

Cada arquivo deve possuir uma responsabilidade clara.

Devem ser evitados arquivos que simultaneamente:

- buscam dados
- transformam dados
- executam regras de negócio
- renderizam interface
- chamam APIs

Essa mistura de responsabilidades reduz previsibilidade, dificulta testes, espalha efeitos colaterais e torna manutenção mais cara.

Componentes, serviços, repositories, providers e módulos devem existir com fronteiras entendíveis e consistentes com sua função real.

### 6. Abstrações

Não criar abstrações apenas por elegância arquitetural.

Uma abstração só deve nascer quando existir pelo menos um dos seguintes fatores:

- duplicação real
- mais de uma implementação
- necessidade futura comprovada
- redução clara de acoplamento

Evitar overengineering é uma regra arquitetural explícita.

Abstrações mal justificadas:

- escondem fluxo sem necessidade
- criam múltiplos pontos de leitura para entender algo simples
- dificultam onboarding
- aumentam o custo de alteração

### 7. Regras de Evolução

Antes de criar um novo módulo, serviço ou camada, responder:

- Já existe um módulo responsável?
- Estou duplicando responsabilidade?
- Posso reutilizar uma implementação existente?
- Estou aumentando complexidade?
- Essa mudança melhora manutenção?

Se a resposta indicar duplicação, sobreposição de escopo ou complexidade sem ganho claro, a mudança deve ser repensada.

Arquitetura não deve crescer por impulso. Deve crescer por necessidade estruturada.

### 8. Regras para Novos Serviços

Todo novo serviço deve possuir definição explícita de:

- objetivo
- entradas
- saídas
- dependências
- falhas possíveis
- métricas
- testes

Serviços que nascem sem esse enquadramento tendem a virar pontos opacos do sistema.

O serviço não precisa necessariamente começar complexo, mas deve nascer inteligível. A clareza da responsabilidade é obrigatória desde o primeiro dia.

### 9. Regras para Banco de Dados

A lógica do domínio não pode conhecer detalhes do banco.

Toda persistência deve passar por repositories ou por uma camada equivalente que concentre acesso a dados e proteja o restante da aplicação de detalhes operacionais.

Regras obrigatórias:

- não espalhar SQL pela aplicação
- não misturar queries com regras de negócio
- não acoplar fluxo de domínio a particularidades de um banco específico
- projetar sempre pensando em futura migração de banco

Persistência é infraestrutura. O domínio consome capacidades de armazenamento; ele não deve depender dos detalhes concretos de como isso é feito.

### 10. Eventos

A arquitetura deve estimular uso de eventos como forma de tornar o sistema mais observável, rastreável e pronto para automações futuras.

Eventos importantes esperados no ecossistema do projeto:

- SessionStarted
- IntentDetected
- RecommendationGenerated
- RecommendationAccepted
- RecommendationRejected
- AffiliateClicked
- FollowupScheduled
- FollowupSent
- ConversionRegistered

Toda alteração relevante no fluxo comercial ou operacional deve ser elegível para emissão de evento observável.

Eventos não devem ser tratados como detalhe periférico. Eles são parte da arquitetura da plataforma porque conectam operação, analytics, automação e evolução futura.

### 11. Observabilidade Arquitetural

Todo fluxo importante deve ser rastreável.

Observabilidade deve existir para aumentar clareza operacional, debugar comportamento, medir qualidade do funil e sustentar evolução da plataforma.

Diretrizes obrigatórias:

- registrar apenas informações úteis
- nunca registrar segredos
- nunca registrar tokens
- nunca registrar prompts completos
- nunca registrar dados sensíveis sem necessidade e controle explícito
- criar correlação entre eventos usando IDs consistentes

Observabilidade não é ruído. Também não é logging indiscriminado. Ela deve ser estruturada para sustentar compreensão real do sistema.

### 12. Critério Arquitetural de Qualidade

Uma mudança estrutural só deve ser considerada boa quando melhora pelo menos alguns dos seguintes eixos sem degradar os demais de forma desproporcional:

- clareza
- manutenção
- separação de responsabilidades
- testabilidade
- capacidade de evolução
- previsibilidade
- observabilidade

Mudanças que apenas “parecem mais sofisticadas” não são melhorias arquiteturais por si só.

## Architecture Decision Framework

Antes de introduzir mudança estrutural relevante, deve ser possível responder:

1. qual boundary está sendo afetado?
2. a responsabilidade está no módulo correto?
3. a mudança reduz ou aumenta acoplamento?
4. existe abstração desnecessária?
5. a evolução futura fica mais fácil ou mais difícil?
6. a arquitetura ficou mais clara ou apenas mais sofisticada?

## Architecture Anti-Patterns

Nunca:

- misturar domínio com framework
- espalhar persistência pela aplicação
- criar abstrações sem necessidade real
- usar módulo genérico como depósito de lógica
- sacrificar clareza por sofisticação aparente

## Future Compatibility

A arquitetura deve permanecer compatível com crescimento incremental da plataforma, múltiplos canais, múltiplos modelos, múltiplos runtimes, serviços mais distribuídos e maior observabilidade operacional.

## Definition of Done

Uma mudança arquitetural só pode ser considerada concluída quando:

- respeita boundaries claros
- reduz ou controla acoplamento
- melhora clareza e manutenção
- preserva testabilidade e observabilidade
- evita anti-patterns arquiteturais

## Checklist

- A mudança respeita fronteiras de domínio?
- O núcleo de negócio continua isolado de frameworks e SDKs externos?
- Existe responsabilidade clara para cada módulo afetado?
- A solução evita acoplamento desnecessário?
- Houve criação de abstração sem justificativa real?
- A persistência continua protegida por repositories?
- O fluxo alterado continua observável?
- Há eventos relevantes para mudanças importantes de estado?
- A mudança prepara evolução futura sem adicionar complexidade excessiva?
- A arquitetura ficou mais clara, e não apenas mais sofisticada?

## Observações

Este documento deve ser tratado como referência arquitetural principal do projeto.

Nenhuma alteração estrutural relevante deve ignorar estas regras.

Quando houver conflito entre conveniência local e integridade arquitetural, a integridade arquitetural deve prevalecer.
