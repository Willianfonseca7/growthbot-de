# Backend API

Este documento define a política oficial de Backend and API Engineering do GrowthBot DE.
Ele estabelece como o backend deve organizar fronteiras, contratos, validações, persistência, integrações e comportamento operacional para sustentar uma AI Sales Platform previsível, segura, testável e evolutiva.

## Objetivo

Definir as regras obrigatórias que governam o backend e as APIs do GrowthBot DE.

O objetivo deste documento é impedir que o backend evolua como um conjunto difuso de handlers, integrações e acessos a dados sem fronteiras claras.

Backend and API Engineering, neste projeto, deve garantir que o sistema:

- tenha limites explícitos entre camadas
- preserve coerência entre produto e implementação
- mantenha contratos previsíveis
- trate erros com disciplina
- seja compatível com segurança, testes e observabilidade
- suporte evolução futura sem colapso estrutural

O backend deve ser tratado como fronteira crítica entre interface, domínio, IA, integrações externas e persistência.

## Escopo

Este documento cobre:

- boundaries entre rotas, handlers, services, use cases e repositories
- validação de entradas e saídas
- contratos internos e externos
- classificação e tratamento de erros
- autenticação e autorização no servidor
- idempotência
- paginação, filtros e ordenação
- persistência e transações
- integrações externas
- webhooks
- comunicação com a AI Platform
- eventos de domínio
- logs, métricas e correlation IDs
- timeouts, retries e fallbacks
- versionamento e compatibilidade
- separação entre negócio e infraestrutura
- preparação para banco compartilhado, filas, workers e múltiplos runtimes

Este documento não redefine a missão do produto, não substitui a arquitetura geral e não detalha a política de segurança, testes ou observabilidade. Ele traduz essas diretrizes para o comportamento específico do backend e das APIs.

## Regras

### 1. O backend deve ser tratado como fronteira de controle

O backend do GrowthBot DE não é apenas camada de passagem entre request e database.

Ele é a fronteira que deve:

- validar entradas
- proteger regras de negócio
- coordenar casos de uso
- limitar integrações externas
- preservar contratos
- produzir rastreabilidade operacional

Sempre que uma requisição entra no sistema, o backend deve convertê-la em comportamento controlado e previsível.

### 2. Fronteiras entre camadas devem ser explícitas

O sistema deve preservar separação clara entre:

- rotas
- handlers
- services
- use cases
- repositories
- integrações externas

Cada camada deve existir com responsabilidade definida.

Misturar parsing de request, regra de negócio, acesso a banco, chamada externa e montagem de resposta no mesmo ponto do sistema deve ser tratado como degradação arquitetural.

### 3. Rotas devem ser finas

Rotas devem existir para:

- receber requests
- delegar ao handler ou caso de uso apropriado
- devolver resposta compatível com o contrato

Rotas não devem concentrar:

- regra de negócio relevante
- acesso direto a banco
- chamadas diretas complexas para integrações externas
- lógica condicional extensa

Quanto mais lógica de domínio existe na rota, mais frágil a fronteira do backend se torna.

### 4. Handlers devem orquestrar, não dominar o sistema

Handlers podem coordenar parsing, autorização contextual, chamada de caso de uso e normalização de resposta.

Mas não devem se transformar em centro de toda a lógica do backend.

Se o handler passa a decidir regras de negócio, persistência, retry, fallback, mapping e observabilidade profunda sozinho, a responsabilidade foi violada.

### 5. Use cases devem concentrar comportamento de negócio

Casos de uso devem representar intenções relevantes do sistema, como:

- gerar recomendação
- registrar clique
- agendar follow-up
- consultar visão operacional

Use cases devem conter a coordenação principal do comportamento de domínio.

Eles não devem depender de detalhes de framework ou de transporte HTTP.

### 6. Services não devem substituir modelagem de domínio

Services podem existir para encapsular lógica compartilhada, colaboração entre dependências ou coordenação operacional.

Mas não devem virar categoria genérica onde qualquer coisa sem lugar definido é colocada.

Service é conceito válido apenas quando sua responsabilidade é clara.

### 7. Repositories devem abstrair persistência, não negócio

Repositories existem para lidar com leitura e escrita de dados.

Eles não devem:

- decidir regra de negócio
- validar semântica principal de domínio
- conhecer detalhes de UI
- coordenar fluxos de produto

Repository deve proteger a separação entre domínio e mecanismo de persistência.

### 8. Entradas devem ser validadas na borda

Toda entrada externa deve ser validada antes de produzir efeito relevante no sistema.

Isso inclui:

- parâmetros de rota
- query params
- payloads
- headers relevantes
- dados vindos de webhooks
- dados vindos de integrações

Não confiar em input externo apenas porque ele vem de frontend próprio, Telegram, dashboard interno ou parceiro conhecido.

### 9. Saídas também devem ser controladas

O backend não deve tratar resposta como detalhe espontâneo da implementação.

Saídas devem ser consistentes, previsíveis e alinhadas ao contrato esperado.

Isso vale tanto para respostas externas quanto para contratos internos entre módulos.

Retornar dados excessivos, inconsistentes ou mal normalizados enfraquece a estabilidade da plataforma.

### 10. Contratos internos e externos devem ser explícitos

Todo fluxo relevante deve operar sobre contratos compreensíveis.

Deve estar claro:

- o que entra
- o que sai
- o que é obrigatório
- o que é opcional
- o que representa falha

Contratos implícitos, inferidos informalmente pelo código, aumentam acoplamento e fragilidade.

### 11. O backend deve classificar erros com disciplina

Erros não devem ser tratados como massa homogênea.

O sistema deve distinguir, conceitualmente, entre:

- erro de validação
- erro de autenticação
- erro de autorização
- erro de domínio
- erro de integração externa
- erro de infraestrutura
- erro inesperado

Sem classificação, tratamento e observabilidade de erro ficam pobres.

### 12. Erros devem ser úteis, seguros e observáveis

Toda falha relevante deve produzir:

- comportamento seguro
- contexto suficiente para diagnóstico
- resposta adequada ao consumidor
- rastreabilidade operacional

Erro útil não significa erro verboso para o cliente.

Significa erro claro internamente e controlado externamente.

### 13. Autenticação e autorização devem existir no servidor

O backend não deve delegar confiança apenas ao cliente.

Toda ação sensível deve ser protegida no servidor por mecanismos compatíveis com o risco.

Além de autenticar quem faz a chamada, o sistema deve autorizar o que pode ser feito naquele contexto.

### 14. Idempotência deve ser tratada explicitamente em fluxos sensíveis

Operações sujeitas a repetição por retry, webhook, refresh, rede instável ou comportamento duplicado do cliente devem considerar idempotência.

Isso é especialmente importante para:

- registro de eventos
- agendamentos
- follow-ups
- integrações externas
- webhooks
- escritas críticas

Se uma repetição puder causar estado incorreto, o fluxo precisa de proteção explícita.

### 15. Paginação, filtros e ordenação devem ser estáveis

Sempre que o backend expuser coleções relevantes, o comportamento de paginação, filtragem e ordenação deve ser previsível.

Não permitir endpoints que cresçam sem limites claros ou retornem listas arbitrárias sem critério de ordenação.

Coerência nesses contratos melhora:

- performance
- previsibilidade
- experiência do consumidor
- evolução futura

### 16. Persistência deve respeitar fronteiras transacionais

O backend deve tratar operações de escrita com clareza sobre:

- unidade de consistência
- momento da persistência
- dependências entre registros
- impacto de falhas parciais

Sempre que um fluxo depender de múltiplas alterações relacionadas, a consistência deve ser pensada explicitamente.

Transação não é detalhe tardio.

É decisão de integridade.

### 17. O backend não deve depender estruturalmente do banco atual

Mesmo que hoje a persistência use SQLite, o backend deve evoluir sem acoplamento irreversível a esse contexto local.

As decisões de modelagem devem considerar que o sistema poderá migrar para:

- banco compartilhado
- banco remoto
- banco com concorrência maior
- cenários multi-tenant

O backend deve proteger o domínio contra detalhes transitórios da infraestrutura atual.

### 18. Integrações externas devem ser encapsuladas

OpenAI, Telegram, MCP-related bridges, tracking targets e quaisquer serviços externos devem ser acessados por fronteiras explícitas.

O restante do sistema não deve depender diretamente de detalhes operacionais de cada integração.

Encapsulamento melhora:

- testabilidade
- segurança
- troca de provedor
- observabilidade
- fallback

### 19. Webhooks devem ser tratados como entrada hostil por padrão

Webhooks não devem ser considerados confiáveis apenas por existirem em integração conhecida.

Eles devem ser tratados com:

- validação
- autenticação ou verificação de origem quando aplicável
- idempotência
- controle de efeito colateral
- observabilidade

Webhook sem contenção é porta de inconsistência.

### 20. Comunicação com a AI Platform deve ser mediada

O backend não deve expor diretamente a complexidade da AI Platform para cada rota.

A comunicação com a camada de IA deve acontecer por contratos internos claros, com:

- contexto minimizado
- validação de saída
- fallback
- rastreabilidade

O backend deve proteger o restante da plataforma contra comportamento imprevisível da inferência.

### 21. Eventos de domínio devem ter semântica clara

Sempre que o backend produzir eventos internos ou operacionais, eles devem representar fatos relevantes do sistema.

Eventos não devem ser criados como efeito decorativo ou duplicação confusa de logs.

Deve estar claro:

- o que o evento significa
- quando ele ocorre
- quem o produz
- quem pode consumi-lo

### 22. Logs, métricas e correlation IDs são parte do backend

Backend não termina na resposta HTTP.

Ele também é responsável por produzir sinais úteis para:

- observabilidade
- auditoria
- análise de produto
- diagnóstico técnico

Todo fluxo relevante deve considerar logs estruturados, métricas coerentes e mecanismos de correlação quando necessário.

### 23. Timeouts, retries e fallbacks devem ser intencionais

Chamadas externas e fluxos sujeitos a falha não podem depender de esperança implícita.

Sempre que houver integração relevante, deve estar claro:

- quanto tempo esperar
- se retry faz sentido
- em que condição retry deve parar
- qual fallback existe
- qual impacto é aceitável

Retry sem critério amplifica problema.

Ausência total de fallback em fluxo crítico também.

### 24. Versionamento e compatibilidade devem ser pensados antes da ruptura

APIs, contratos internos e estruturas de resposta devem evoluir com disciplina.

Mesmo quando o sistema ainda é pequeno, o backend não deve ser tratado como território descartável sem preocupação de compatibilidade.

Mudanças que quebram consumidores ou fluxos internos precisam ser intencionais, justificadas e observáveis.

### 25. Separação entre negócio e infraestrutura é obrigatória

O backend deve proteger a regra de negócio contra acoplamento excessivo a:

- framework
- banco
- provider externo
- runtime específico
- detalhe de transporte

Quanto mais o domínio depende desses detalhes, mais cara fica a evolução futura.

### 26. O backend deve ser preparado para múltiplos runtimes

Mesmo sem implementar isso agora, a engenharia deve considerar que partes do sistema poderão rodar futuramente em:

- runtime web
- workers
- jobs assíncronos
- filas
- processos especializados

Backend bom não assume que tudo sempre acontecerá dentro do mesmo request-response síncrono.

### 27. O backend deve preservar compatibilidade com evolução operacional

Decisões de hoje não devem impedir amanhã:

- banco compartilhado
- filas
- workers
- múltiplos canais
- múltiplos tenants
- múltiplos runtimes
- integrações mais complexas

Isso não exige superarquitetura.

Exige não colapsar tudo em handlers frágeis e acoplados.

## Backend Decision Framework

Antes de criar ou alterar comportamento relevante no backend, deve ser possível responder:

1. qual fronteira está sendo criada ou modificada?
2. em qual camada esse comportamento realmente pertence?
3. qual contrato de entrada e saída está sendo estabelecido?
4. qual validação precisa acontecer na borda?
5. qual regra de negócio está sendo protegida?
6. qual erro pode acontecer e como ele será classificado?
7. existe escrita ou operação que exige idempotência?
8. existe integração externa envolvida?
9. como esse fluxo será observado, medido e correlacionado?
10. essa decisão preserva evolução futura do backend?

Sem essas respostas, a mudança ainda não está madura.

## Backend Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que degradam a qualidade do backend.

Nunca:

- concentrar regra de negócio em rotas
- usar handlers como depósito genérico de lógica
- acessar banco diretamente de qualquer camada sem disciplina
- confiar em input sem validação
- misturar contratos externos e internos sem clareza
- tratar todos os erros da mesma forma
- acoplar domínio a framework ou provider específico
- usar retry sem critério
- aceitar efeitos críticos sem idempotência quando ela é necessária
- expor respostas instáveis ou excessivas por conveniência
- tratar webhook como entrada confiável por padrão
- esconder ausência de modelagem atrás de services genéricos

Esses anti-patterns devem ser tratados como sinais de erosão arquitetural.

## Future Compatibility

O backend do GrowthBot DE deve permanecer preparado para evoluções futuras como:

- banco compartilhado
- PostgreSQL ou outras persistências mais robustas
- multi-tenant
- multi-language
- multi-channel
- filas e workers
- jobs assíncronos
- APIs públicas
- múltiplos runtimes
- parceiros externos
- integrações mais complexas
- coordenação com AI Platform mais sofisticada

Preparação para compatibilidade futura não significa antecipar toda complexidade agora.

Significa não construir um backend que dependa estruturalmente de um cenário único, local e frágil.

## Definition of Done

Uma alteração relevante no backend ou nas APIs só pode ser considerada concluída quando, de forma proporcional ao seu escopo:

- respeita a missão do produto
- respeita a arquitetura
- pertence à camada correta
- possui contratos claros de entrada e saída
- valida inputs e controla outputs
- classifica erros de forma adequada
- protege autenticação e autorização quando necessário
- trata idempotência quando relevante
- respeita segurança, observabilidade e testes
- possui comportamento previsível diante de timeout, retry ou fallback
- evita anti-patterns conhecidos
- preserva compatibilidade futura razoável

Sem esses critérios, a mudança ainda não está madura para integrar o backend com confiança.

## Checklist

- A responsabilidade está na camada correta?
- O contrato de entrada e saída está claro?
- Há validação suficiente na borda?
- O fluxo separa negócio de infraestrutura?
- Os erros relevantes estão classificados?
- Existe necessidade de autenticação ou autorização?
- Existe risco de repetição que exige idempotência?
- Há integração externa, timeout, retry ou fallback a considerar?
- O fluxo produz logs, métricas e correlation id quando necessário?
- A persistência respeita integridade e consistência?
- A mudança evita anti-patterns conhecidos?
- A decisão preserva evolução futura do backend?
- A entrega atende ao Definition of Done?

## Observações

O backend do GrowthBot DE deve ser entendido como uma fronteira de estabilidade entre produto, IA, persistência, integrações e operação.

Seu papel não é apenas “fazer funcionar”.

Seu papel é fazer funcionar com previsibilidade, limites claros, segurança, observabilidade e capacidade de evolução.

Sempre que houver tensão entre conveniência imediata e disciplina estrutural do backend, a disciplina estrutural deve prevalecer.
