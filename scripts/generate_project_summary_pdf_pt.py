from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "output" / "pdf"
OUTPUT_FILE = OUTPUT_DIR / "growthbot-de-project-summary-pt.pdf"


def build_styles():
    styles = getSampleStyleSheet()
    styles.add(
        ParagraphStyle(
            name="DocTitle",
            parent=styles["Title"],
            fontName="Helvetica-Bold",
            fontSize=22,
            leading=26,
            textColor=colors.HexColor("#0F172A"),
            spaceAfter=10,
        )
    )
    styles.add(
        ParagraphStyle(
            name="DocSubtitle",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#475569"),
            spaceAfter=14,
        )
    )
    styles.add(
        ParagraphStyle(
            name="SectionTitle",
            parent=styles["Heading2"],
            fontName="Helvetica-Bold",
            fontSize=14,
            leading=18,
            textColor=colors.HexColor("#0B5FFF"),
            spaceBefore=10,
            spaceAfter=8,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Body",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=10.2,
            leading=14,
            textColor=colors.HexColor("#1E293B"),
            alignment=TA_LEFT,
            spaceAfter=6,
        )
    )
    styles.add(
        ParagraphStyle(
            name="Small",
            parent=styles["BodyText"],
            fontName="Helvetica",
            fontSize=9,
            leading=12,
            textColor=colors.HexColor("#475569"),
        )
    )
    return styles


def section_title(text, styles):
    return Paragraph(text, styles["SectionTitle"])


def para(text, styles):
    return Paragraph(text, styles["Body"])


def bullet_list(items, styles):
    return ListFlowable(
        [ListItem(Paragraph(item, styles["Body"]), leftIndent=0) for item in items],
        bulletType="bullet",
        start="-",
        leftIndent=16,
        bulletFontName="Helvetica",
        bulletFontSize=9,
    )


def info_table(rows):
    table = Table(rows, colWidths=[45 * mm, 125 * mm], hAlign="LEFT")
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F8FAFC")),
                ("BOX", (0, 0), (-1, -1), 0.6, colors.HexColor("#CBD5E1")),
                ("INNERGRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#E2E8F0")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("FONTSIZE", (0, 0), (-1, -1), 9.5),
                ("LEADING", (0, 0), (-1, -1), 12),
                ("TEXTCOLOR", (0, 0), (-1, -1), colors.HexColor("#1E293B")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 8),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 7),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 7),
            ]
        )
    )
    return table


def footer(canvas, doc):
    canvas.saveState()
    canvas.setStrokeColor(colors.HexColor("#CBD5E1"))
    canvas.line(doc.leftMargin, 12 * mm, A4[0] - doc.rightMargin, 12 * mm)
    canvas.setFont("Helvetica", 8)
    canvas.setFillColor(colors.HexColor("#64748B"))
    canvas.drawString(doc.leftMargin, 7 * mm, "GrowthBot DE - Resumo do Projeto")
    canvas.drawRightString(A4[0] - doc.rightMargin, 7 * mm, f"Página {doc.page}")
    canvas.restoreState()


def build_story(styles):
    story = []

    story.append(Paragraph("GrowthBot DE", styles["DocTitle"]))
    story.append(
        Paragraph(
            "Resumo do projeto cobrindo intenção do produto, arquitetura atual, restrições de engenharia e roadmap futuro.",
            styles["DocSubtitle"],
        )
    )

    story.append(section_title("1. Projeto", styles))
    story.append(
        info_table(
            [
                ["Nome", "GrowthBot DE"],
                ["Tipo", "Plataforma de vendas assistidas por IA com entrada conversacional via Telegram e dashboard operacional em Next.js"],
                ["Mercado principal", "DACH, com interações do bot em alemão e recomendações de produtos nesse contexto"],
                ["Estado atual", "Protótipo funcional local com orquestração conversacional, automação de follow-up, rastreamento de cliques de afiliado e visibilidade operacional"],
            ]
        )
    )
    story.append(Spacer(1, 8))

    story.append(section_title("2. Contexto do Projeto", styles))
    story.append(
        para(
            "O GrowthBot DE foi concebido para ser mais do que um experimento de chatbot. O projeto busca validar como um assistente baseado em modelos de linguagem pode apoiar recomendação de produtos, reengajamento de usuários e monitoramento operacional dentro de um fluxo de vendas leve.",
            styles,
        )
    )
    story.append(
        para(
            "A implementação atual combina um bot no Telegram para interação com leads, uma camada de recomendação orientada por LLM, persistência local em SQLite e um dashboard em Next.js para acompanhar sessões, cliques e atividades de follow-up.",
            styles,
        )
    )

    story.append(section_title("3. Objetivo Claro", styles))
    story.append(
        para(
            "O objetivo central do produto é transformar intenção conversacional em um fluxo rastreável de recomendação: detectar interesse, mapear produtos relevantes, gerar uma resposta persuasiva, armazenar a interação, agendar reengajamento e expor o resultado operacional para um administrador.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Oferecer ao usuário uma experiência guiada no Telegram com atalhos por nicho e entrada em texto livre.",
                "Usar saída estruturada do LLM para recomendar exatamente um produto a partir de um catálogo curado.",
                "Persistir sessões e agendar follow-ups automaticamente.",
                "Rastrear cliques de afiliado e expor métricas centrais em uma superfície administrativa.",
            ],
            styles,
        )
    )
    story.append(Spacer(1, 8))

    story.append(section_title("4. Objetivos", styles))
    story.append(
        bullet_list(
            [
                "Construir um assistente de vendas com IA demonstrável, simples o suficiente para rodar localmente e claro o bastante para ser explicado a recrutadores, colaboradores ou stakeholders.",
                "Separar orquestração conversacional de dashboard e tracking para que a arquitetura possa evoluir além do estágio de protótipo.",
                "Criar uma base para futura migração de persistência local para um ambiente compartilhado live.",
                "Manter o sistema compreensível: sem abstrações desnecessárias, com limites modulares claros e fluxo de controle direto.",
            ],
            styles,
        )
    )

    story.append(section_title("5. Stacks", styles))
    story.append(
        info_table(
            [
                ["Frontend / Admin", "Next.js 15.5.2, React 19.1.1, React DOM 19.1.1"],
                ["Linguagem / Build", "TypeScript 5.9.3, tsx 4.20.5"],
                ["Canal do bot", "node-telegram-bot-api 0.67.0"],
                ["Camada LLM", "OpenAI SDK 6.35.0"],
                ["Validação", "zod 4.1.5"],
                ["Persistência", "SQLite via better-sqlite3 12.9.0"],
                ["Configuração", "dotenv 17.4.2"],
                ["Testes", "Vitest 3.2.4"],
            ]
        )
    )
    story.append(PageBreak())

    story.append(section_title("6. Estrutura", styles))
    story.append(
        bullet_list(
            [
                "src/integrations/telegram/: adaptador do Telegram responsável por mensagens, callbacks e comandos de reset de sessão.",
                "src/modules/conversation/: orquestrador principal que carrega histórico, classifica intenção, encontra produtos, monta prompt, chama OpenAI e persiste resultados.",
                "src/modules/intent/: classificação de intenção baseada em palavras-chave.",
                "src/modules/products/: lógica de matching e ranking de produtos com base em tags.",
                "src/llm/: construtor de prompt e geração estruturada de resposta via OpenAI.",
                "src/modules/followup/: envio agendado de follow-up com links rastreados.",
                "src/database/: cliente SQLite e repositórios para sessões, cliques e follow-ups.",
                "src/app/: rotas Next.js para dashboard, healthcheck e redirect de tracking.",
                "src/catalog/: catálogo estático de produtos e helpers de acesso.",
            ],
            styles,
        )
    )

    story.append(section_title("7. Visão Atual", styles))
    story.append(
        para(
            "Hoje o projeto se comporta como um protótipo local forte e como um bom case de arquitetura para portfólio. O sistema já demonstra um ciclo completo entre entrada conversacional, recomendação, persistência, agendamento de follow-up, tracking de redirect e visibilidade em dashboard.",
            styles,
        )
    )
    story.append(
        para(
            "Ao mesmo tempo, a implementação ainda não pode ser considerada uma plataforma live pronta para produção. O principal limitador é o banco SQLite local, que dificulta a separação entre runtime web e runtime do bot em ambientes distintos sem ajustes de infraestrutura.",
            styles,
        )
    )

    story.append(section_title("8. Pontos Fortes Atuais", styles))
    story.append(
        bullet_list(
            [
                "Limites modulares claros entre bot, orquestração, uso de LLM, persistência e dashboard.",
                "Superfície operacional demonstrável em vez de um protótipo apenas de backend.",
                "Geração estruturada de recomendação, e não saída livre e imprevisível do modelo.",
                "Fluxo de produto prático: interesse -> recomendação -> persistência -> follow-up -> tracking de clique.",
                "Narrativa forte para portfólio: transição de um bot simples para uma plataforma operacional com IA.",
            ],
            styles,
        )
    )

    story.append(section_title("9. Restrições Atuais", styles))
    story.append(
        bullet_list(
            [
                "SQLite é local e hoje é o principal bloqueio para um deploy multi-serviço realmente live.",
                "A classificação de intenção baseada em palavras-chave pode perder nuances ou intenções mistas.",
                "Ainda não existe autenticação, controle de acesso, trilha de auditoria ou separação madura de ambientes para uso operacional.",
                "A suíte de testes existe, mas a configuração e resolução de ambiente ainda precisam de limpeza para rodar de forma confiável em qualquer contexto.",
                "O runtime do bot com polling é prático para uso local, mas não é o modelo final ideal para uma exposição pública madura.",
            ],
            styles,
        )
    )

    story.append(section_title("10. Próximos Sprints", styles))
    story.append(
        bullet_list(
            [
                "Sprint 1 - base de readiness para produção: rotacionar segredos, limpar tratamento de ambiente, definir .env.example e documentar startup seguro local.",
                "Sprint 2 - migração para persistência compartilhada: substituir SQLite por Postgres ou Turso para permitir runtimes separados de bot e web com a mesma base.",
                "Sprint 3 - demo deployável: publicar o dashboard em Next.js e estabilizar um runtime do bot com persistência compartilhada.",
                "Sprint 4 - qualidade de recomendação: melhorar detecção de intenção, matching de catálogo, comportamento de fallback e validação estruturada da saída do LLM.",
                "Sprint 5 - polimento recruiter-facing: README melhor, resumo de arquitetura, screenshots e um caminho público de demo que funcione sem intervenção manual.",
            ],
            styles,
        )
    )
    story.append(PageBreak())

    story.append(section_title("11. Visão Futura", styles))
    story.append(
        para(
            "A visão de longo prazo é uma plataforma de vendas com IA realmente deployável, em que entrada conversacional, recomendação, persistência, automação de follow-up, medição de cliques e insights operacionais funcionem como um sistema único e compartilhado.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Banco remoto compartilhado sustentando todos os runtimes.",
                "Deploy estável de componentes web e bot.",
                "Melhor detecção de intenção e lógica de confiança nas recomendações.",
                "Analytics mais limpos sobre cliques, sucesso de follow-up e sinais de conversão.",
                "Possível suporte a outros canais além do Telegram, desde que a arquitetura central permaneça estável.",
            ],
            styles,
        )
    )

    story.append(section_title("12. Práticas de Engenharia a Evitar", styles))
    story.append(
        para(
            "Este projeto ganha mais com disciplina do que com complexidade extra. As práticas abaixo devem ser evitadas explicitamente ao codar, criar componentes ou alterar a estrutura.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Não introduzir abstrações antes que exista pressão real por elas. Indireção prematura tornaria um sistema hoje compreensível muito mais difícil de manter.",
                "Não misturar UI, tratamento do bot e lógica de orquestração no mesmo módulo. Os limites atuais são um dos ativos mais fortes do projeto.",
                "Não adicionar componentes ou rotas sem necessidade real do operador ou do usuário. Toda nova superfície deve servir a um fluxo de produto rastreável.",
                "Não acoplar novos fluxos a uma visão local-only de armazenamento. Toda mudança de dados deve considerar a futura migração para persistência compartilhada.",
                "Não depender de variáveis de ambiente não documentadas, setups ocultos ou conhecimento operacional apenas verbal.",
                "Não permitir que respostas do LLM passem sem checagem estruturada quando a aplicação espera exatamente uma recomendação válida.",
                "Não criar complexidade visual no dashboard sem melhorar a compreensão operacional.",
                "Não expor segredos em arquivos do repositório, screenshots, logs ou ambientes públicos.",
            ],
            styles,
        )
    )

    story.append(section_title("13. Regras Práticas para Mudanças Futuras", styles))
    story.append(
        bullet_list(
            [
                "Ler o fluxo existente antes de editar: adaptador Telegram -> orquestrador -> repositórios -> dashboard/rotas de redirect.",
                "Preservar fluxo de dados simples. Nova lógica deve entrar onde a responsabilidade já existe, não em um arquivo aleatório por conveniência.",
                "Ao adicionar um componente, perguntar se ele melhora a leitura operacional ou apenas adiciona ruído visual.",
                "Ao mexer em armazenamento, projetar pensando em segurança de migração e fronteiras claras de repositório.",
                "Ao alterar comportamento do LLM, manter prompt, seleção do produto e validação de saída consistentes entre si.",
                "Ao adicionar testes, priorizar comportamento crítico de negócio: mapeamento de intenção, seleção de produto, efeitos de persistência e tracking de redirect.",
            ],
            styles,
        )
    )

    story.append(section_title("14. Ações Imediatas Recomendadas", styles))
    story.append(
        bullet_list(
            [
                "Rotacionar imediatamente as credenciais expostas do Telegram e da OpenAI.",
                "Adicionar um README público explicando arquitetura, startup local e limitações atuais da demo.",
                "Preparar um caminho mínimo de demo live antes de apresentar o projeto como acessível publicamente.",
                "Priorizar persistência compartilhada antes de afirmar que bot e dashboard estão totalmente live juntos.",
            ],
            styles,
        )
    )

    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "Nota final: o GrowthBot DE já é forte como case de arquitetura e engenharia de produto. O próximo passo não é aumentar superfície, e sim elevar realismo de deploy e confiabilidade operacional.",
            styles["Small"],
        )
    )

    return story


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    styles = build_styles()
    doc = SimpleDocTemplate(
        str(OUTPUT_FILE),
        pagesize=A4,
        leftMargin=18 * mm,
        rightMargin=18 * mm,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        title="GrowthBot DE - Resumo do Projeto",
        author="OpenAI Codex",
    )
    story = build_story(styles)
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
