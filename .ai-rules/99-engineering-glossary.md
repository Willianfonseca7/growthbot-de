# Engineering Glossary

Este documento define o glossário oficial de termos de engenharia do GrowthBot DE.
Ele existe para reduzir ambiguidade conceitual entre produto, arquitetura, IA, backend, segurança, testes, operação e governança do handbook.

## Objetivo

Definir linguagem comum para o Engineering Handbook do GrowthBot DE.

O objetivo deste documento não é criar um dicionário inflado.
Seu papel é estabilizar o significado dos termos que orientam decisões estruturais do projeto.

Quando um conceito importante aparece em múltiplos documentos, ele não deve depender de interpretação informal do leitor.

O glossário existe para:

- reduzir ambiguidade
- alinhar raciocínio entre documentos
- evitar nomes diferentes para o mesmo conceito
- impedir que um termo mude de significado conforme o contexto
- preservar consistência conceitual ao longo da evolução do handbook

## Escopo

Este documento cobre:

- termos recorrentes do handbook
- significados oficiais do projeto
- preferências de nomenclatura
- critérios para introdução de novos termos
- alinhamento conceitual entre disciplinas
- estabilidade da linguagem de engenharia

Este documento não substitui os documentos específicos de arquitetura, produto, IA, segurança, testes, observabilidade ou deploy.
Ele atua como base semântica que ajuda esses documentos a permanecerem coerentes entre si.

## Regras

### 1. Termos críticos devem ter significado estável

Quando um termo relevante aparecer no handbook, ele deve ser entendido com o mesmo significado ao longo dos documentos.

Se o mesmo termo passar a significar coisas diferentes em contextos diferentes, o handbook perde poder de alinhamento.

### 2. O glossário reduz ambiguidade estrutural

Sempre que houver risco de múltiplas interpretações relevantes, este documento deve servir como referência oficial.

O glossário existe para eliminar dúvidas sobre linguagem central do projeto, não para descrever qualquer jargão secundário.

### 3. Termos oficiais devem ser preferidos a variações soltas

Quando o projeto já possuir uma nomenclatura oficial, ela deve ser preferida em novos documentos, revisões e discussões estruturais.

Variações ocasionais podem existir em conversa informal.

Na documentação oficial, a linguagem deve ser consistente.

### 4. Novos termos só devem entrar com necessidade real

Um termo novo só deve ser incorporado ao glossário quando houver:

- uso recorrente
- risco real de ambiguidade
- valor prático de alinhamento
- diferença conceitual relevante em relação aos termos já existentes

Adicionar termos sem necessidade real transforma o glossário em lista decorativa.

### 5. O glossário não deve duplicar documentos inteiros

Cada definição deve ser curta, clara e orientadora.

O glossário não existe para reescrever políticas completas.

Ele deve apontar significado oficial do termo, não substituir o documento especializado onde esse termo é aprofundado.

### 6. Termos do handbook devem refletir a identidade real do projeto

O glossário deve preservar a forma como o GrowthBot DE se define conceitualmente.

Isso significa reforçar que o projeto não é descrito oficialmente como:

- chatbot simples
- assistente genérico
- recomendador isolado

O termo preferencial do projeto precisa refletir sua identidade arquitetural e de produto.

### 7. O glossário deve apoiar decisões, não apenas leitura

As definições presentes aqui devem ajudar a responder perguntas como:

- este documento está usando o termo certo?
- essa solução pertence mesmo a essa camada?
- estamos chamando a mesma coisa por nomes diferentes?
- essa mudança está alinhada ao vocabulário oficial do projeto?

Se o glossário não ajuda a decidir, ele ainda está fraco.

### 8. Termos com impacto operacional precisam de especial cuidado

Conceitos como:

- fallback
- idempotência
- correlation id
- use case
- repository
- handler
- agent chain

não devem ser tratados como palavras genéricas.

Eles possuem significado arquitetural e operacional específico no GrowthBot DE.

### 9. Termos de produto e termos de engenharia precisam coexistir sem conflito

O handbook combina vocabulário de:

- produto
- arquitetura
- IA
- segurança
- observabilidade
- operações

O glossário deve manter coerência entre essas camadas, evitando que um mesmo termo seja esticado de forma vaga para cobrir contextos incompatíveis.

### 10. O glossário deve evoluir com disciplina

À medida que o handbook amadurece, o glossário também deve amadurecer.

Mas sua evolução deve ser controlada.

Mudança frequente e sem critério na linguagem oficial enfraquece o próprio handbook.

### 11. O significado oficial do termo prevalece sobre uso informal

Quando houver conflito entre:

- uso informal em conversa
- uso histórico inconsistente
- preferência local temporária
- definição oficial do handbook

deve prevalecer a definição oficial deste glossário e dos documentos-base.

### 12. O glossário deve permanecer pequeno o suficiente para ser útil

Utilidade do glossário depende de foco.

Ele não deve tentar catalogar toda palavra possível.

Deve priorizar conceitos que:

- orientam decisões
- aparecem em vários documentos
- carregam risco de confusão
- possuem peso estrutural no projeto

## Regras de Terminologia Oficial

Os termos abaixo representam a linguagem preferencial oficial do GrowthBot DE dentro do Engineering Handbook.

- `AI Sales Platform`
  Identidade oficial do GrowthBot DE como produto e sistema. Refere-se a uma plataforma orientada a entender intenção, recomendar soluções, apoiar decisões comerciais e gerar valor operacional com IA.

- `Product Engineering`
  Disciplina que conecta visão de produto, valor, experiência, operação e implementação técnica.

- `AI Platform`
  Camada responsável por modelos, prompts, contexto, tools, MCPs, inferência, fallback e governança de IA.

- `Architecture`
  Estrutura conceitual das fronteiras, responsabilidades e relações entre partes do sistema.

- `Backend API`
  Fronteira de controle entre interfaces, domínio, integrações, persistência e IA.

- `Observability`
  Capacidade de compreender o comportamento do sistema por sinais externos confiáveis, como logs, métricas, traces e eventos.

- `Security Engineering`
  Disciplina que protege dados, acessos, integrações, agentes, operações e infraestrutura ao longo do ciclo de vida do produto.

- `Testing Engineering`
  Disciplina que protege comportamento relevante, reduz regressões e sustenta evolução segura do sistema.

- `Deployment Engineering`
  Disciplina que governa promoção entre branches, publicação, rollout, rollback, segredos e ambientes.

- `Performance Engineering`
  Disciplina que governa latência, custo computacional, throughput, eficiência operacional e crescimento sustentável.

- `Agent Chain`
  Coordenação multi-etapas entre agentes com papéis explícitos, handoffs controlados, observabilidade e limites claros.

- `Use Case`
  Intenção de negócio executável pelo sistema. Deve concentrar coordenação principal de comportamento relevante de domínio.

- `Handler`
  Ponto de orquestração entre entrada, validação contextual, autorização e chamada de caso de uso. Não deve concentrar domínio inteiro.

- `Repository`
  Fronteira de acesso à persistência. Existe para abstrair leitura e escrita de dados, não para governar regra de negócio.

- `Fallback`
  Comportamento alternativo controlado quando o fluxo principal falha, degrada ou se torna inseguro.

- `Idempotência`
  Capacidade de repetir uma operação sem produzir efeito indevido adicional.

- `Correlation ID`
  Identificador que permite correlacionar eventos, logs e etapas pertencentes ao mesmo fluxo.

- `Operational Visibility`
  Capacidade de tornar o estado e os eventos relevantes da plataforma compreensíveis para operação e diagnóstico.

- `Recruiter-safe live surface`
  Superfície pública que demonstra valor, arquitetura e existência real do projeto sem expor dados operacionais sensíveis.

## Engineering Glossary Decision Framework

Antes de adicionar ou alterar um termo relevante no glossário, deve ser possível responder:

1. o termo é recorrente no handbook?
2. existe ambiguidade real sem ele?
3. o significado proposto melhora alinhamento entre documentos?
4. esse termo precisa ser oficial ou apenas contextual?
5. ele já não está coberto por outro conceito equivalente?
6. sua definição ajuda decisão e não apenas leitura?

Sem essas respostas, o termo ainda não está maduro para entrar como linguagem oficial.

## Engineering Glossary Anti-Patterns

O GrowthBot DE deve evitar explicitamente padrões que enfraquecem a linguagem oficial do handbook.

Nunca:

- adicionar termo desnecessário
- manter termo ambíguo sem definição
- usar nomes diferentes para o mesmo conceito oficial
- transformar o glossário em lista inflada sem utilidade real
- redefinir informalmente termos já estabilizados
- misturar identidade de produto com rótulos imprecisos
- usar palavras estruturalmente importantes como sinônimos vagos

Esses anti-patterns reduzem clareza e corroem alinhamento entre documentos.

## Future Compatibility

O glossário deve permanecer preparado para acompanhar a evolução do handbook sem perder:

- clareza
- estabilidade conceitual
- consistência estrutural
- utilidade prática

Isso inclui futura incorporação de conceitos relacionados a:

- multi-tenant
- multi-language
- multi-channel
- novos provedores de IA
- workers
- filas
- agent chains mais sofisticadas
- novas camadas operacionais
- APIs públicas

Preparação futura não significa inflar o glossário antes da hora.

Significa permitir evolução sem perder disciplina terminológica.

## Definition of Done

Um termo só pode ser considerado maduro para entrar ou permanecer no glossário quando:

- é recorrente ou estruturalmente relevante
- reduz ambiguidade real
- possui significado claro
- não duplica conceito já existente
- ajuda alinhamento entre documentos
- preserva coerência com a identidade oficial do projeto

Sem isso, o termo ainda não merece status de linguagem oficial do handbook.

## Checklist

- O termo já existe com significado oficial?
- Há ambiguidade real que este documento precisa resolver?
- O novo termo é recorrente o suficiente para entrar no glossário?
- O significado proposto é claro e estável?
- Ele duplica outro conceito já existente?
- O uso do termo está consistente com o restante do handbook?
- A definição ajuda decisão e alinhamento?
- A terminologia preserva a identidade oficial do projeto?
- A entrega atende ao Definition of Done do glossário?

## Observações

O glossário não substitui os documentos específicos.

Ele existe para alinhar linguagem, preservar consistência e reduzir ruído conceitual ao longo do Engineering Handbook.

Quando houver conflito entre uso informal de um termo e seu significado oficial na documentação, o significado oficial deve prevalecer.
