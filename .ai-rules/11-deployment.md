# Deployment

Este documento define a política oficial de Deployment Engineering do GrowthBot DE.
Ele estabelece como mudanças devem ser promovidas entre branches, ambientes e versões com segurança, previsibilidade, rastreabilidade e controle operacional.

## Objetivo

Definir as regras obrigatórias de deploy, promoção, rollout, rollback e gestão de ambientes do GrowthBot DE.

O objetivo deste documento é impedir que publicação de software seja tratada como ato informal, manual e pouco rastreável.

Deployment Engineering, neste projeto, deve garantir que a plataforma evolua com:

- segurança operacional
- separação clara entre ambientes
- rollout intencional
- rollback possível
- proteção de segredos
- controle de migrations
- compatibilidade com crescimento futuro

## Escopo

Este documento cobre:

- fluxo entre `develop` e `main`
- relação entre branches e ambientes
- critérios de promoção
- gestão de ambientes
- configuração e segredos
- migrations
- rollout e rollback
- validação pós-deploy
- observabilidade de release
- compatibilidade futura com CI/CD e múltiplos ambientes

Este documento não substitui Security, Testing ou Observability. Ele traduz essas disciplinas para o momento de publicação e operação da plataforma.

## Regras

### 1. O fluxo oficial continua sendo `develop -> main`

Toda mudança deve entrar primeiro em `develop`.

`main` deve receber apenas alterações promovidas de forma intencional, após validação suficiente.

Esse fluxo é obrigatório porque reduz risco, preserva estabilidade narrativa do projeto e evita que produção se torne ambiente de experimentação.

### 2. Branch não é ambiente, mas influencia ambiente

Mesmo que a topologia de ambientes evolua no futuro, a relação conceitual deve permanecer clara:

- `develop` concentra integração e validação contínua
- `main` representa o estado mais estável e promovível do sistema

Não assumir que uma branch substitui por si só a disciplina de ambiente.

### 3. Ambientes devem ter propósito explícito

Cada ambiente futuro da plataforma deve existir com função clara, como:

- desenvolvimento
- validação
- staging
- produção

Ambientes sem propósito explícito geram confusão operacional.

### 4. Segredos e configuração devem ser isolados por ambiente

Cada ambiente deve possuir:

- segredos próprios
- tokens próprios
- configuração própria
- acesso proporcional ao risco

Reutilizar segredos de produção em ambientes inferiores é falha grave.

### 5. Deploy deve ser rastreável

Toda promoção relevante deve permitir reconstruir:

- o que foi promovido
- quando foi promovido
- por quem foi promovido
- de qual branch ou estado veio
- com qual objetivo
- com qual resultado

Sem rastreabilidade, rollback e investigação ficam frágeis.

### 6. Nenhum deploy deve depender de estado implícito

Publicação não deve depender de conhecimento informal, memória individual ou sequência escondida de passos.

O processo de deploy deve ser compreensível, repetível e suficientemente documentado.

### 7. Rollout deve ser intencional

Toda publicação precisa considerar:

- escopo da mudança
- risco da mudança
- impacto operacional
- dependências externas
- necessidade de monitoramento reforçado

Deploy não é apenas “subir código”. É promover comportamento novo no sistema.

### 8. Rollback deve ser possível e pensado antes

Antes de promover mudança relevante, deve estar claro:

- como voltar atrás
- o que é reversível
- o que não é reversível facilmente
- se há mudança de dados envolvida
- qual plano existe em caso de degradação

Rollback não pode ser improviso.

### 9. Migrations devem ser tratadas como mudança crítica

Mudanças de esquema, dados ou persistência exigem cuidado adicional.

Toda migration deve considerar:

- compatibilidade com a versão publicada
- impacto em leitura e escrita
- risco de lock ou indisponibilidade
- possibilidade de rollback
- integridade de dados

Migration nunca deve ser tratada como detalhe secundário do deploy.

### 10. Deploy deve respeitar Security, Testing e Observability

Nenhuma promoção relevante deve ignorar:

- cobertura ou validação compatível com risco
- proteção de segredos
- logs, métricas e sinais necessários para monitoramento pós-deploy

Deploy maduro depende dessas três disciplinas.

### 11. Mudanças de alto risco exigem mais validação

Alterações em:

- autenticação
- autorização
- persistência
- AI Platform
- tracking
- follow-up
- integrações externas
- infraestrutura operacional

devem ser promovidas com nível adicional de cuidado.

### 12. Deploy não deve ser canal de correção estrutural

Problemas de arquitetura, testes, segurança ou observabilidade não devem ser “aceitos por enquanto” e empurrados para produção.

Deploy existe para publicar mudanças maduras, não para validar esperança.

### 13. Estado pós-deploy deve ser verificável

Toda promoção relevante deve permitir checagem pós-deploy, incluindo quando aplicável:

- health do sistema
- comportamento das rotas críticas
- funcionamento do dashboard
- integridade da persistência
- sinais da AI Platform
- tracking e follow-up

Deploy sem verificação pós-publicação é incompleto.

### 14. Feature release e code release não são sempre a mesma coisa

Mesmo quando a plataforma ainda for simples, a engenharia deve reconhecer conceitualmente que:

- código pode ser publicado
- comportamento pode ser habilitado depois
- rollout pode ser progressivo

Isso ajuda a preparar o sistema para maior sofisticação futura.

### 15. A plataforma deve evoluir para suportar CI/CD sem depender dele hoje

Mesmo antes de pipeline robusto completo, as decisões atuais devem facilitar futura automação de:

- validação
- build
- test
- release
- rollback

Não bloquear o futuro por processos manuais frágeis.

## Deployment Decision Framework

Antes de promover mudança relevante, deve ser possível responder:

1. o que exatamente está sendo publicado?
2. esse estado já foi validado em `develop`?
3. qual risco operacional essa mudança traz?
4. existem migrations ou efeitos irreversíveis?
5. quais segredos ou configurações de ambiente são afetados?
6. como o deploy será observado após a promoção?
7. qual plano de rollback existe?
8. existe alternativa de rollout mais segura?
9. essa promoção mantém coerência entre branches e ambientes?
10. vale a pena promover isso agora?

## Deployment Anti-Patterns

Nunca:

- publicar direto em `main` como fluxo normal
- compartilhar segredos entre ambientes
- fazer deploy sem plano de rollback
- tratar migration como detalhe
- promover mudança sem observabilidade pós-release
- depender de passos manuais obscuros
- usar produção como ambiente inicial de validação
- publicar mudanças críticas sem testes compatíveis
- reconciliar branches de forma negligente
- aceitar estado não rastreável de release

## Future Compatibility

A política de deploy deve permanecer preparada para:

- staging formal
- produção formal
- CI/CD
- múltiplos ambientes
- múltiplos runtimes
- workers
- filas
- banco remoto
- deploy blue/green ou progressivo
- feature flags

Preparação futura não significa implementar tudo agora.

Significa não criar um processo de release que colapse assim que a plataforma crescer.

## Definition of Done

Uma mudança só pode ser considerada pronta para deploy quando, de forma proporcional ao seu escopo:

- foi integrada corretamente em `develop`
- está madura para promoção a `main`
- possui validação compatível com o risco
- respeita segurança, testes e observabilidade
- possui plano de rollback razoável
- trata migration com cuidado quando necessário
- possui rastreabilidade suficiente
- evita anti-patterns de release
- preserva compatibilidade futura do processo operacional

## Checklist

- A mudança entrou primeiro em `develop`?
- Está clara a intenção da promoção?
- O risco operacional foi avaliado?
- Há segredos ou configuração de ambiente impactados?
- Há migration ou efeito irreversível?
- O pós-deploy será observável?
- Existe rollback viável?
- A promoção evita anti-patterns conhecidos?
- A coerência entre branches foi preservada?
- A entrega atende ao Definition of Done?

## Observações

Deployment Engineering no GrowthBot DE deve ser lido como disciplina de segurança operacional.

Publicar software não é apenas mover código entre branches.

É promover comportamento novo em uma plataforma que precisa continuar confiável, auditável e evolutiva.
