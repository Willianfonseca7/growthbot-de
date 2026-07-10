# AI Platform

Este documento define as regras da plataforma de IA do GrowthBot DE.
Ele orienta como modelos, prompts, contexto, ferramentas, memória, MCP Servers e agentes devem ser estruturados para gerar recomendações confiáveis, auditáveis e evolutivas.

## Objetivo

Definir os princípios e regras que governam o uso de Inteligência Artificial dentro do GrowthBot DE como AI Sales Platform.

Este documento existe para impedir que a camada de IA evolua de forma improvisada, opaca ou excessivamente acoplada ao restante do sistema. O objetivo não é apenas integrar modelos, mas estruturar uma plataforma de decisão assistida por IA que seja segura, mensurável, extensível e operacionalmente responsável.

## Escopo

Este documento cobre:

- papel da IA dentro da plataforma
- organização da camada de modelos
- uso de prompts
- gestão de contexto
- regras para memória
- uso de ferramentas
- uso de MCP Servers
- desenho de agentes
- critérios para inferência
- tolerância a falhas da camada de IA
- requisitos de rastreabilidade e governança

Este documento não define missão do produto, estrutura geral de frontend, contratos detalhados de API, políticas completas de segurança ou processos de deploy. Esses tópicos pertencem aos demais documentos do Engineering Handbook.

## Regras

### 1. Papel da IA na plataforma

A IA é componente central do GrowthBot DE, mas não é o produto inteiro.

Seu papel é ampliar a capacidade do sistema de:

- interpretar intenção
- organizar contexto
- apoiar recomendações
- melhorar qualidade de resposta
- permitir automação responsável
- aumentar eficiência operacional

A IA não deve ser tratada como camada mágica, autônoma ou infalível. Ela faz parte de um sistema maior, composto também por regras de negócio, dados, rastreamento, persistência, observabilidade e validação operacional.

Toda decisão de IA deve ser pensada como parte de um fluxo comercial mensurável.

### 2. A camada de IA deve ser modular

A plataforma de IA deve ser organizada em responsabilidades separadas.

No mínimo, o sistema deve distinguir conceitualmente:

- seleção e chamada de modelo
- construção de prompt
- montagem de contexto
- uso de ferramentas
- interpretação de saída
- validação de resposta
- persistência de sinais relevantes

Não misturar, em um mesmo ponto do sistema, regras de negócio, montagem de prompt, chamada de modelo, parsing de resposta e efeitos colaterais operacionais sem separação explícita.

Quanto mais a plataforma crescer, mais importante será isolar essas responsabilidades.

### 3. Modelos devem ser tratados como dependências substituíveis

Nenhum fluxo crítico deve nascer acoplado permanentemente a um único modelo, provedor ou formato específico de resposta.

A arquitetura da AI Platform deve assumir, desde cedo, que o projeto poderá evoluir para:

- múltiplos modelos
- múltiplos provedores
- múltiplas estratégias de inferência
- múltiplos custos e níveis de latência
- múltiplas políticas de fallback

Isso não significa criar abstrações excessivas antes da hora.

Significa evitar dependências estruturais irreversíveis.

Trocar de modelo, ajustar temperatura, mudar formato de saída ou introduzir fallback entre provedores deve ser uma evolução controlada, e não uma reescrita do sistema.

### 4. IA deve operar sobre contexto estruturado

Modelos não devem receber contexto bruto sem critério.

Todo contexto enviado para inferência deve ser selecionado, reduzido e organizado com intenção clara.

O sistema deve distinguir entre:

- contexto atual da interação
- histórico conversacional relevante
- dados persistidos do usuário
- catálogo ou base de produtos
- sinais operacionais
- regras de negócio aplicáveis
- instruções permanentes do sistema

Mais contexto nem sempre significa melhor inferência.

A qualidade da AI Platform depende da capacidade de enviar o contexto certo, no momento certo, na forma certa.

### 5. Prompt engineering é disciplina de produto e engenharia

Prompts não devem ser tratados como texto improvisado embutido em fluxos críticos sem critério de manutenção.

Prompts representam parte do comportamento do sistema e devem ser tratados como artefatos de engenharia.

Todo prompt relevante deve:

- ter objetivo claro
- operar dentro de um contexto delimitado
- refletir regras do produto
- minimizar ambiguidade
- restringir saídas inválidas quando necessário
- ser fácil de revisar e evoluir

Prompts longos, confusos, redundantes ou contraditórios aumentam custo, instabilidade e dificuldade de manutenção.

O GrowthBot DE deve preferir prompts explícitos, estruturados e orientados a comportamento desejado.

### 6. Saídas do modelo não devem ser aceitas cegamente

Toda saída de IA que influencie recomendação, automação, tracking, follow-up, qualificação ou decisão operacional deve passar por validação adequada.

Isso inclui, quando aplicável:

- validação de formato
- validação de campos obrigatórios
- validação semântica mínima
- checagem contra entidades existentes
- fallback seguro em caso de inconsistência

O modelo pode sugerir, mas o sistema é responsável por decidir se a resposta pode ou não ser promovida para uso operacional.

IA sem validação é risco estrutural.

### 7. Ferramentas devem ampliar capacidade, não mascarar fragilidade

Ferramentas existem para ampliar a capacidade do sistema de consultar, agir ou enriquecer respostas com base em informação externa ou operacional.

Ferramentas não devem ser introduzidas para compensar falta de arquitetura, falta de dados organizados ou ausência de contratos claros.

Antes de adicionar uma tool, deve estar claro:

- qual problema ela resolve
- qual dado ela consome
- qual efeito ela produz
- qual limite operacional ela possui
- como sua execução será rastreada
- como falhas serão tratadas

Ferramentas que executam ações externas devem operar com limites explícitos.

### 8. MCP Servers são parte formal da AI Platform

MCP Servers devem ser tratados como componentes oficiais de expansão de contexto e capacidade da plataforma de IA.

Seu uso deve seguir os mesmos critérios de rigor aplicados a qualquer integração estrutural:

- propósito claro
- autenticação segura
- escopo mínimo de acesso
- previsibilidade de uso
- rastreabilidade
- manutenção controlada

Nem todo MCP disponível deve ser integrado.

O critério não é quantidade de ferramentas. O critério é valor real com risco controlado.

### 9. Princípio do menor privilégio para ferramentas e MCPs

Toda ferramenta, MCP Server ou integração acionável deve receber apenas o nível mínimo de permissão necessário para cumprir sua função.

Isso vale para:

- leitura de arquivos
- acesso a repositórios
- acesso a documentação
- acesso a navegadores
- acesso a sistemas externos
- credenciais
- escrita em recursos persistentes

A AI Platform nunca deve assumir acesso irrestrito como padrão.

Quanto maior a capacidade de ação da IA, maior deve ser o rigor de controle.

### 10. Memória deve ser útil, limitada e governada

Memória não deve ser confundida com acúmulo irrestrito de histórico.

O GrowthBot DE deve diferenciar claramente:

- contexto transitório da conversa atual
- estado persistido necessário para continuidade operacional
- sinais históricos relevantes para personalização futura

Memória só deve ser mantida quando gerar valor claro para:

- continuidade da jornada
- melhoria de recomendação
- automação posterior
- operação e análise

Persistir tudo indiscriminadamente aumenta custo, ruído, risco e dificuldade de governança.

### 11. Agentes devem ser introduzidos com disciplina arquitetural

Nem todo fluxo de IA precisa ser modelado como agente.

O projeto deve preferir fluxos determinísticos e explícitos sempre que eles resolverem bem o problema.

Agentes só devem ser introduzidos quando houver necessidade real de:

- decomposição de tarefa
- coordenação entre capacidades distintas
- uso iterativo de ferramentas
- raciocínio operacional multi-etapas
- execução controlada de subtarefas

Antes de criar um agente, deve estar claro:

- qual papel ele exerce
- quais entradas recebe
- quais ferramentas pode usar
- quais saídas pode produzir
- quais limites operacionais possui
- como seu comportamento será observado

Agentes sem fronteira clara se tornam fontes de opacidade e instabilidade.

### 12. O sistema deve preferir determinismo onde ele for viável

A camada de IA não deve introduzir não determinismo em partes do sistema que podem ser resolvidas com regras claras, dados conhecidos ou lógica de negócio explícita.

Modelos devem ser usados para problemas que realmente se beneficiam de inferência probabilística, como interpretação, sumarização, classificação contextual ou geração controlada.

Não usar LLM como substituto de:

- lookup simples
- regras de negócio estáveis
- mapeamentos explícitos
- validações estruturais
- decisões binárias totalmente conhecidas

IA deve aumentar inteligência, não substituir disciplina de engenharia.

### 13. Fallbacks são obrigatórios em fluxos críticos

Falhas de IA devem ser tratadas como cenário esperado, e não como exceção improvável.

A AI Platform deve prever estratégias de fallback para situações como:

- timeout
- resposta inválida
- modelo indisponível
- tool indisponível
- MCP indisponível
- contexto insuficiente
- custo ou latência acima do aceitável

Fallback não significa esconder erro silenciosamente.

Significa preservar comportamento seguro, continuidade razoável e rastreabilidade do que ocorreu.

### 14. Custo, latência e qualidade são trade-offs explícitos

Toda decisão sobre uso de modelos deve considerar ao mesmo tempo:

- qualidade da resposta
- latência
- custo por inferência
- previsibilidade operacional
- impacto no funil comercial

O melhor modelo técnico nem sempre será a melhor escolha operacional.

A AI Platform deve permitir decisões diferentes para contextos diferentes, como:

- classificação rápida
- recomendação estruturada
- geração mais sofisticada
- tarefas offline
- automações assíncronas

Esses trade-offs devem ser conscientes e revisáveis.

### 15. Respostas de IA devem ser rastreáveis

Sempre que uma resposta de IA influenciar o comportamento do sistema, deve ser possível reconstruir minimamente:

- qual fluxo a gerou
- qual contexto principal foi usado
- qual modelo foi acionado
- qual ferramenta ou MCP participou
- qual saída foi validada
- qual decisão operacional resultou disso

Rastreabilidade não exige registrar conteúdo sensível sem critério.

Exige registrar informação suficiente para auditoria, depuração, melhoria contínua e análise de qualidade.

### 16. A AI Platform deve ser observável

Observabilidade da camada de IA não é opcional.

No mínimo, a plataforma deve evoluir para medir:

- volume de inferências
- taxa de erro
- taxa de respostas inválidas
- uso de ferramentas
- uso de MCP Servers
- latência por fluxo
- custo estimado por fluxo
- impacto em eventos comerciais relevantes

Sem isso, a IA vira uma caixa-preta cara e difícil de otimizar.

### 17. Catálogo, contexto e recomendação não devem colapsar em uma única decisão opaca

O GrowthBot DE deve preservar separação entre:

- interpretação de intenção
- seleção de candidatos
- composição de contexto
- recomendação final

Mesmo quando a IA participar de mais de uma dessas etapas, o sistema deve evitar colapsar tudo em uma única chamada opaca sem visibilidade intermediária.

Separar etapas melhora:

- auditabilidade
- testabilidade
- controle de qualidade
- capacidade de evolução

### 18. A IA deve respeitar a filosofia comercial do produto

O GrowthBot DE não existe para empurrar qualquer produto.

A AI Platform deve ser orientada para recomendar a solução mais adequada dentro dos limites do catálogo, do contexto disponível e da confiança possível da inferência.

O sistema nunca deve ser projetado para maximizar comissão de forma cega às custas de:

- necessidade real do usuário
- qualidade da recomendação
- consistência da conversa
- confiança construída
- integridade do produto

Receita é consequência de confiança operacionalizada corretamente.

### 19. Evolução da plataforma deve ser incremental

A AI Platform deve ser capaz de evoluir por estágios, sem saltos desnecessários de complexidade.

Uma trajetória saudável pode incluir:

- chamadas simples a modelo
- prompts estruturados
- validação de saída
- uso controlado de ferramentas
- integração com MCP Servers
- memória governada
- agentes especializados
- coordenação multiagente, se um dia for justificável

Não antecipar toda complexidade futura na primeira versão.

Também não bloquear o futuro por excesso de simplicidade estrutural.

### 20. Toda mudança na camada de IA deve responder três perguntas

Antes de expandir a AI Platform, deve estar claro:

1. qual valor real essa mudança gera para o produto?
2. qual risco estrutural ou operacional ela introduz?
3. como essa mudança será medida, validada e mantida?

Se essas respostas não estiverem claras, a mudança ainda não está madura para entrar.

## AI Decision Framework

Antes de utilizar IA em qualquer fluxo novo ou em qualquer expansão relevante da plataforma, a decisão deve passar por um framework explícito.

No mínimo, as seguintes perguntas devem ser respondidas:

1. este problema realmente exige IA?
2. existe uma solução determinística suficiente?
3. existe uma ferramenta mais apropriada?
4. existe um MCP adequado para enriquecer o fluxo?
5. qual modelo possui melhor relação entre custo, latência e qualidade?
6. existe risco relevante de alucinação?
7. existe risco operacional relevante?
8. como a resposta será validada?
9. como esse fluxo será monitorado?

Esse framework existe para impedir o uso impulsivo de IA.

A decisão correta, em muitos casos, será não usar IA.

## AI Anti-Patterns

A AI Platform deve evitar explicitamente padrões que degradam qualidade, previsibilidade e governança.

Nunca:

- usar LLM como banco de dados
- usar LLM para validações simples
- usar prompts enormes sem necessidade real
- misturar contexto permanente com contexto transitório sem controle
- criar agentes sem responsabilidade clara
- usar IA onde regras explícitas resolvem melhor
- usar IA apenas porque ela existe
- delegar decisões operacionais críticas a saídas não validadas
- esconder fragilidade arquitetural atrás de prompts ou tools

Esses anti-patterns devem ser tratados como sinais de alerta estrutural.

Quando surgirem, o problema geralmente não está no modelo em si, mas na forma como a camada de IA está sendo desenhada.

## Future Compatibility

A AI Platform deve permanecer preparada para evoluir sem bloqueios prematuros.

Isso inclui compatibilidade conceitual com cenários futuros como:

- OpenAI
- Claude
- Gemini
- Mistral
- Llama
- modelos locais
- RAG
- embeddings
- memory layers
- knowledge graphs
- MCP
- planning agents
- voice interfaces
- vision capabilities
- realtime interactions

Preparação para compatibilidade futura não significa implementar tudo agora.

Significa não tomar decisões estruturais que impeçam essas evoluções caso elas passem a fazer sentido para o produto.

## Definition of Done

Uma alteração na AI Platform só pode ser considerada concluída quando atender, de forma proporcional ao seu escopo, aos seguintes critérios:

- segue a missão do produto
- respeita a arquitetura definida
- possui validação adequada
- possui fallback compatível com o risco
- possui observabilidade mínima
- possui documentação suficiente
- possui testes compatíveis com o impacto
- possui rastreabilidade operacional
- mantém baixo acoplamento estrutural
- possui custo justificável

Sem esses critérios, a mudança pode até funcionar tecnicamente, mas ainda não está pronta para ser tratada como parte estável da plataforma.

## Checklist

- O uso de IA neste fluxo resolve um problema que realmente exige inferência?
- O modelo está isolado o suficiente para futura substituição?
- O contexto enviado está estruturado e minimamente controlado?
- O prompt possui objetivo claro e comportamento esperado explícito?
- A saída do modelo passa por validação antes de produzir efeito operacional?
- O uso de tool ou MCP possui propósito claro e privilégio mínimo?
- Existe fallback para falha, timeout ou resposta inválida?
- O fluxo é rastreável e observável?
- A decisão respeita a filosofia comercial e a missão do produto?
- A complexidade introduzida é proporcional ao valor gerado?
- O AI Decision Framework foi respondido com clareza antes da implementação?
- A mudança evita os anti-patterns já conhecidos da plataforma?
- A alteração preserva compatibilidade futura sem antecipar complexidade desnecessária?
- A mudança atende ao Definition of Done da AI Platform?

## Observações

Este documento deve permanecer válido mesmo com a evolução de modelos, provedores e ferramentas.

A tecnologia da camada de IA mudará ao longo do tempo. Os princípios de governança, modularidade, validação, rastreabilidade e responsabilidade operacional não devem mudar com a mesma facilidade.

Sempre que houver tensão entre mais capacidade de IA e menos controle estrutural, o GrowthBot DE deve preferir controle estrutural.
