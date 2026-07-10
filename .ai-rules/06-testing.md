# Testing

Este documento define a política oficial de Testing Engineering do GrowthBot DE.
Ele estabelece como a plataforma deve validar comportamento, reduzir regressões, proteger fluxos críticos e sustentar evolução segura ao longo do tempo.

## Objetivo

Definir as regras obrigatórias de testes para o GrowthBot DE como AI Sales Platform.

O objetivo deste documento não é maximizar quantidade de testes. O objetivo é garantir confiança proporcional ao risco.

Testing Engineering, neste projeto, deve:

- reduzir regressões
- validar comportamento crítico
- proteger a evolução do produto
- apoiar mudanças na camada de IA
- aumentar segurança de deploy
- permitir refatoração com controle

Testes devem ser tratados como parte do sistema de engenharia, não como atividade acessória ou ritual de qualidade.

## Escopo

Este documento cobre:

- estratégia geral de testes
- critérios de priorização
- testes unitários
- testes de integração
- testes end-to-end
- testes para AI Platform
- testes para persistência e tracking
- mocks e fixtures
- determinismo
- cobertura orientada a risco
- critérios de decisão
- anti-patterns
- Definition of Done

Este documento não substitui Security, Observability, Architecture ou Product Engineering. Ele define como o sistema deve ser validado para que essas disciplinas possam evoluir com confiança.

## Regras

### 1. Testes existem para proteger comportamento relevante

No GrowthBot DE, testes não devem ser escritos apenas para aumentar cobertura numérica ou satisfazer formalidade de processo.

Eles devem proteger:

- comportamento de negócio
- fluxos críticos
- decisões estruturais
- integrações relevantes
- evolução segura da plataforma

Se um teste não protege nada importante, seu valor deve ser questionado.

### 2. Cobertura deve ser orientada a risco

A plataforma não precisa do mesmo nível de teste em todas as áreas.

A prioridade deve recair sobre fluxos com maior impacto em:

- recomendação
- persistência
- tracking
- follow-up
- IA
- autenticação
- dashboard APIs
- integrações externas

Quanto maior o risco funcional, operacional ou comercial, maior deve ser a exigência de teste.

### 3. A estratégia de testes deve ser em camadas

O GrowthBot DE deve usar uma estratégia de validação composta por camadas com responsabilidades diferentes.

No mínimo:

- testes unitários para lógica isolada
- testes de integração para colaboração entre módulos
- testes end-to-end para fluxos reais da aplicação

Cada camada deve validar o que lhe cabe.

Não usar e2e para compensar ausência de testes unitários.

Não usar testes unitários para fingir que integrações complexas estão protegidas.

### 4. Testes unitários devem focar lógica e comportamento local

Testes unitários devem validar unidades coesas, rápidas e determinísticas.

Eles são especialmente adequados para:

- classificadores
- matchers
- formatadores
- validadores
- builders
- componentes visuais isolados
- regras puras de domínio

Esses testes devem ter setup mínimo e feedback rápido.

### 5. Testes de integração devem validar colaboração real entre partes do sistema

Testes de integração devem existir para validar fluxos onde o comportamento depende da interação entre:

- módulos
- persistência
- serviços
- repositórios
- camada de IA com abstrações controladas
- tracking
- automações

Integração não significa chamar tudo de verdade sem critério.

Significa validar a colaboração relevante com isolamento suficiente para manter previsibilidade.

### 6. End-to-end deve proteger jornadas críticas

Testes e2e devem ser reservados para jornadas importantes da aplicação.

No GrowthBot DE, isso inclui especialmente:

- carregamento do dashboard
- autenticação administrativa
- rotas críticas
- tracking de redirect
- fluxos principais de interface

E2E deve validar que o sistema funciona do ponto de vista do usuário ou operador.

Não deve ser a primeira linha de defesa para cada regra pequena.

### 7. A camada de IA deve ser testada de forma apropriada

A AI Platform não deve ser tratada como área impossível de testar.

Ela deve ser validada por meio de testes proporcionais ao seu comportamento, como:

- testes de construção de prompt
- testes de seleção de contexto
- testes de validação de saída
- testes de fallback
- testes de orquestração com respostas mockadas
- testes de integração com dependências substituídas de forma controlada

Não depender exclusivamente de chamadas reais a modelo para ter confiança na camada de IA.

### 8. Testes devem preferir comportamento observável a implementação interna

O foco do teste deve ser o que o sistema faz, não como ele está implementado internamente.

Evitar testes que:

- travam refatoração sem ganho real
- acoplam a detalhes internos
- verificam estrutura privada sem necessidade
- duplicam a implementação em forma de expectativa

Quanto mais o teste depende de detalhe interno, menor seu valor de longo prazo.

### 9. Determinismo é requisito importante

Testes devem ser previsíveis.

Sempre que possível, controlar:

- tempo
- banco de teste
- dados de entrada
- respostas externas mockadas
- ordem de execução relevante

Teste que passa ou falha de forma instável é custo, não proteção.

### 10. Banco de dados de produção nunca deve ser usado em testes

Testes devem usar ambiente isolado.

Persistência em teste deve operar com:

- banco próprio de teste
- dados controlados
- limpeza explícita
- independência entre execuções

Misturar teste com estado real compromete confiança e segurança.

### 11. Mocks devem ser pequenos, focados e honestos

Mocks devem existir para isolar dependências ou controlar cenários específicos.

Eles não devem:

- replicar metade do sistema real
- esconder comportamento importante
- simular cenários irreais sem motivo
- introduzir mais complexidade do que a dependência original

Mock bom é o menor mock que preserva intenção do teste.

### 12. Fixtures devem representar domínio, não lixo de teste

Fixtures devem ser:

- pequenas
- legíveis
- reutilizáveis quando faz sentido
- próximas do domínio real

Evitar grandes blocos de dados genéricos que ninguém entende e ninguém confia.

Fixtures devem tornar o comportamento do teste mais claro.

### 13. Cada teste deve ter propósito explícito

Antes de adicionar um teste, deve estar claro:

- qual comportamento ele protege
- por que esse comportamento importa
- qual regressão ele evitará

Teste sem propósito explícito tende a virar peso morto.

### 14. O sistema deve testar tanto sucesso quanto falha

Fluxos críticos não devem ser testados apenas no cenário feliz.

Sempre que relevante, devem existir testes para:

- falha de integração
- resposta inválida
- ausência de dado esperado
- fallback acionado
- persistência inconsistente
- fluxo interrompido

Uma plataforma robusta precisa provar também como falha com segurança.

### 15. Segurança, observabilidade e testes devem conversar

Mudanças sensíveis devem ser validadas também sob perspectivas como:

- vazamento indevido de dados
- comportamento de fallback
- preservação de logs úteis
- bloqueio de fluxos inseguros

Testing Engineering não pode ignorar requisitos de Security e Observability.

### 16. Testes devem apoiar refatoração e não impedi-la artificialmente

Boa suíte de testes permite melhorar arquitetura sem medo excessivo.

Má suíte de testes:

- quebra por detalhe irrelevante
- exige manutenção excessiva
- desincentiva mudança saudável

O objetivo é proteger comportamento, não congelar implementação.

### 17. Cobertura numérica não deve dirigir sozinha a estratégia

Percentual de cobertura pode ser útil como sinal.

Mas não deve ser tratado como prova suficiente de qualidade.

Cobertura alta com testes fracos continua sendo proteção fraca.

Cobertura menor, mas concentrada nos fluxos críticos, costuma ser mais valiosa que cobertura ampla e superficial.

### 18. Testes devem acompanhar a evolução do handbook

À medida que Architecture, AI Platform, Security, Product Engineering e Observability amadurecem, a estratégia de testes também deve amadurecer.

Isso significa que testes precisam refletir:

- novos riscos
- novas integrações
- novas jornadas
- novas garantias esperadas

Testing não é estático.

### 19. Testes devem existir antes de promover mudança crítica

Mudanças com impacto relevante não devem depender apenas de inspeção manual antes de promoção entre branches.

Quando o risco justificar, a alteração deve estar protegida por testes compatíveis com seu impacto antes de ser promovida.

Revisão humana é necessária.

Sozinha, não é suficiente.

### 20. O custo dos testes também deve ser considerado

Toda suíte tem custo de:

- escrita
- manutenção
- execução
- diagnóstico

Por isso, a estratégia correta não é testar tudo.

É testar o que realmente merece proteção com a técnica certa.

## Testing Decision Framework

Antes de adicionar, alterar ou deixar de criar um teste relevante, deve ser possível responder:

1. qual comportamento precisa ser protegido?
2. qual risco existe se isso quebrar?
3. qual camada de teste é mais apropriada?
4. existe forma mais simples de validar esse comportamento?
5. o teste será determinístico?
6. há dependência externa que precisa ser isolada?
7. o valor do teste justifica seu custo de manutenção?
8. esse teste protege comportamento ou apenas implementação?
9. existe cenário de falha que também deve ser coberto?
10. esse teste melhora realmente a confiança do projeto?

Sem essas respostas, o teste ou a ausência dele ainda não estão bem justificados.

## Testing Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que enfraquecem a estratégia de testes.

Nunca:

- criar testes só para inflar cobertura
- testar implementação interna sem motivo forte
- criar mocks gigantes
- usar banco real do projeto em testes
- depender de rede externa sem necessidade
- criar testes não determinísticos
- duplicar o mesmo teste em múltiplas camadas sem ganho real
- usar e2e para cobrir tudo
- ignorar cenários de falha em fluxos críticos
- escrever testes que ninguém entende
- aceitar suíte lenta e frágil como normal

Esses anti-patterns reduzem confiança e aumentam custo de evolução.

## Future Compatibility

A política de Testing Engineering deve permanecer preparada para a evolução futura da plataforma, incluindo:

- multi-tenant
- multi-language
- multi-channel
- múltiplos provedores de IA
- múltiplos MCP Servers
- novos fluxos de automação
- autenticação mais robusta
- filas e workers
- banco mais complexo
- APIs públicas
- dashboards mais ricos

Preparação para compatibilidade futura não significa construir toda a suíte agora.

Significa não adotar uma estratégia de testes que colapse quando a plataforma crescer.

## Definition of Done

Uma alteração relevante só pode ser considerada concluída, do ponto de vista de testes, quando de forma proporcional ao seu escopo:

- possui validação compatível com o risco
- protege comportamento relevante
- usa a camada de teste apropriada
- evita dependência desnecessária de detalhes internos
- cobre sucesso e falha quando relevante
- é determinística
- não usa estado real indevido
- possui mocks e fixtures legíveis quando necessários
- respeita segurança e observabilidade
- evita anti-patterns conhecidos
- possui custo de manutenção justificável

Sem isso, a mudança ainda não está suficientemente protegida.

## Checklist

- O comportamento crítico foi identificado?
- O risco de regressão foi avaliado?
- A camada de teste escolhida é a correta?
- O teste é determinístico?
- Há dependências externas que precisam ser isoladas?
- Existe cenário de falha relevante coberto?
- O teste protege comportamento observável?
- Há uso indevido de banco, rede ou estado real?
- Mocks e fixtures estão claros e proporcionais?
- A mudança respeita Security e Observability?
- A estratégia evita anti-patterns conhecidos?
- A entrega atende ao Definition of Done de Testing Engineering?

## Observações

Testing Engineering no GrowthBot DE deve ser lido como mecanismo de confiança contínua.

O objetivo não é provar perfeição.

O objetivo é reduzir incerteza suficiente para que a plataforma possa evoluir com velocidade, responsabilidade e controle.

Sempre que houver tensão entre conveniência de curto prazo e proteção real contra regressão, a proteção real deve prevalecer.
