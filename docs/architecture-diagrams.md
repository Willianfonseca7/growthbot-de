# GrowthBot DE Architecture Diagrams

## 1. Operational Flow

```mermaid
flowchart TD
    A[Usuario envia mensagem no Telegram] --> B[Telegram Bot API]
    B --> C[src/integrations/telegram/bot.ts]
    C --> D{Tipo de entrada}

    D -->|/start| E[clearSession user]
    E --> F[Envia mensagem de boas-vindas com nichos]

    D -->|/restart| G[clearSession user]
    G --> H[Confirma reinicio]

    D -->|callback de nicho| I[Mapeia callback para mensagem base]
    I --> J[chat userId userMessage]

    D -->|mensagem livre| J

    J --> K[getSessionHistory]
    K --> L[classifyIntent]
    L --> M[matchProducts]
    M --> N[getAllProducts catalogo]
    N --> O[buildRecommendationPrompt]
    O --> P[generateStructuredRecommendation]
    P --> Q[OpenAI Chat Completions]
    Q --> R[Seleciona produto final]
    R --> S[saveSessionHistory]
    S --> T[upsertFollowUp 24h]
    T --> U[sendMessage resposta]

    V[src/bot.ts scheduler] --> W[runFollowUpJob]
    W --> X[getPendingFollowUps]
    X --> Y[Constroi tracked link]
    Y --> Z[Envia follow-up no Telegram]
    Z --> AA[markFollowUpSent]

    AB[Usuario clica no link] --> AC[/api/redirect]
    AC --> AD[registerClick]
    AD --> AE[SQLite]
    AC --> AF[302 redirect para afiliado]
```

## 2. Layered Architecture

```mermaid
flowchart TB
    subgraph Channel["Channel Layer"]
        TG[Telegram Bot API]
        WEB[Next.js App Router]
    end

    subgraph Entry["Entry Points"]
        BOT[src/integrations/telegram/bot.ts]
        BOOT[src/bot.ts]
        REDIR[src/app/api/redirect/route.ts]
        HEALTH[src/app/api/health/route.ts]
        HOME[src/app/page.tsx]
    end

    subgraph Core["Application Core"]
        ORCH[src/modules/conversation/orchestrator.ts]
        FOLLOW[src/modules/followup/followup-service.ts]
        INTENT[src/modules/intent/intent-classifier.ts]
        MATCH[src/modules/products/product-matcher.ts]
        DASH[src/lib/dashboard-data.ts]
    end

    subgraph AI["LLM Layer"]
        PROMPT[src/llm/prompts/recommendation-prompt.ts]
        OPENAI[src/llm/providers/openai-provider.ts]
    end

    subgraph Data["Data Layer"]
        CATALOG[src/catalog/catalog-service.ts]
        REPO[src/database/repositories.ts]
        DB[src/database/client.ts]
        SQLITE[(growthbot.db)]
        JSON[src/catalog/catalog-data.json]
    end

    subgraph Config["Configuration"]
        ENV[src/config/env.ts]
    end

    TG --> BOT
    BOOT --> BOT
    BOOT --> FOLLOW
    WEB --> REDIR
    WEB --> HEALTH
    WEB --> HOME

    BOT --> ORCH
    FOLLOW --> REPO
    REDIR --> REPO
    HOME --> DASH

    ORCH --> INTENT
    ORCH --> MATCH
    ORCH --> PROMPT
    ORCH --> REPO
    MATCH --> CATALOG
    CATALOG --> JSON
    PROMPT --> OPENAI
    DASH --> REPO
    REPO --> DB
    DB --> SQLITE

    ENV --> BOT
    ENV --> FOLLOW
    ENV --> OPENAI
```

## 3. BPMN-Style Business Flow

```mermaid
flowchart LR
    subgraph User["Usuario"]
        U1[Inicia conversa]
        U2[Recebe recomendacao]
        U3[Clica no link]
        U4[Recebe follow-up]
    end

    subgraph Bot["GrowthBot Runtime"]
        B1[Receber evento Telegram]
        B2[Identificar tipo de entrada]
        B3[Classificar intencao]
        B4[Selecionar candidatos]
        B5[Gerar recomendacao com LLM]
        B6[Persistir sessao]
        B7[Agendar follow-up]
        B8[Enviar resposta]
        B9[Executar job horario]
        B10[Enviar reengajamento]
    end

    subgraph Platform["Next.js Platform"]
        P1[Receber redirect]
        P2[Registrar click]
        P3[Redirecionar afiliado]
        P4[Exibir dashboard]
    end

    subgraph Storage["Persistencia"]
        S1[(Sessions)]
        S2[(Followups)]
        S3[(Clicks)]
    end

    U1 --> B1
    B1 --> B2
    B2 --> B3
    B3 --> B4
    B4 --> B5
    B5 --> B6
    B6 --> S1
    B6 --> B7
    B7 --> S2
    B7 --> B8
    B8 --> U2

    B9 --> S2
    B9 --> B10
    B10 --> U4

    U3 --> P1
    P1 --> P2
    P2 --> S3
    P2 --> P3

    P4 --> S1
    P4 --> S2
    P4 --> S3
```

## Notes

- O fluxo conversacional principal entra sempre pelo adapter do Telegram.
- O orchestrator concentra a regra de aplicação e delega intenção, catálogo, prompt, LLM e persistência.
- O dashboard não participa da conversa; ele é apenas uma superfície operacional sobre o SQLite.
- O tracking de afiliado acontece só no redirect HTTP, não dentro da resposta do bot diretamente.
