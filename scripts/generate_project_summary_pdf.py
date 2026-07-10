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
OUTPUT_FILE = OUTPUT_DIR / "growthbot-de-project-summary.pdf"


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
        [
            ListItem(Paragraph(item, styles["Body"]), leftIndent=0)
            for item in items
        ],
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
    canvas.drawString(doc.leftMargin, 7 * mm, "GrowthBot DE - Project Summary")
    canvas.drawRightString(A4[0] - doc.rightMargin, 7 * mm, f"Page {doc.page}")
    canvas.restoreState()


def build_story(styles):
    story = []

    story.append(Paragraph("GrowthBot DE", styles["DocTitle"]))
    story.append(
        Paragraph(
            "Project summary covering product intent, current architecture, engineering constraints, and forward roadmap.",
            styles["DocSubtitle"],
        )
    )

    story.append(section_title("1. Project", styles))
    story.append(
        info_table(
            [
                ["Name", "GrowthBot DE"],
                ["Type", "AI-assisted sales platform with Telegram conversational entrypoint and Next.js operational dashboard"],
                ["Primary market", "DACH, with German-first bot interactions and product recommendations"],
                ["Current shape", "Working local prototype with conversational orchestration, follow-up automation, affiliate click tracking, and operator visibility"],
            ]
        )
    )
    story.append(Spacer(1, 8))

    story.append(section_title("2. Project Context", styles))
    story.append(
        para(
            "GrowthBot DE was conceived as more than a chatbot experiment. The project is intended to validate how a language-model-driven assistant can support product recommendation, user re-engagement, and operational monitoring inside a lightweight sales workflow.",
            styles,
        )
    )
    story.append(
        para(
            "The current implementation combines a Telegram bot for lead interaction, an LLM-backed recommendation pipeline, SQLite persistence for local state, and a Next.js dashboard for tracking sessions, clicks, and follow-up activity.",
            styles,
        )
    )

    story.append(section_title("3. Clear Objective", styles))
    story.append(
        para(
            "The clear product objective is to convert conversational user intent into a traceable recommendation flow: detect interest, map relevant products, generate a persuasive response, store the interaction, schedule re-engagement, and expose the operational outcome to an administrator.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Give the user a guided Telegram experience with category shortcuts and free-text input.",
                "Use structured LLM output to recommend exactly one product from a curated catalog.",
                "Persist sessions and schedule follow-ups automatically.",
                "Track affiliate clicks and expose core metrics through an admin surface.",
            ],
            styles,
        )
    )
    story.append(Spacer(1, 8))

    story.append(section_title("4. Objectives", styles))
    story.append(
        bullet_list(
            [
                "Build a demonstrable AI sales assistant that is simple enough to run locally and clear enough to explain to recruiters, collaborators, or stakeholders.",
                "Separate conversational orchestration from dashboard and tracking concerns so the architecture can evolve beyond a prototype.",
                "Create a foundation for future migration from local-only persistence to a shared live environment.",
                "Keep the system understandable: no unnecessary abstractions, clear module boundaries, and straightforward control flow.",
            ],
            styles,
        )
    )

    story.append(section_title("5. Stacks", styles))
    story.append(
        info_table(
            [
                ["Frontend / Admin", "Next.js 15.5.2, React 19.1.1, React DOM 19.1.1"],
                ["Language / Build", "TypeScript 5.9.3, tsx 4.20.5"],
                ["Bot channel", "node-telegram-bot-api 0.67.0"],
                ["LLM layer", "OpenAI SDK 6.35.0"],
                ["Validation", "zod 4.1.5"],
                ["Persistence", "SQLite via better-sqlite3 12.9.0"],
                ["Config", "dotenv 17.4.2"],
                ["Tests", "Vitest 3.2.4"],
            ]
        )
    )
    story.append(PageBreak())

    story.append(section_title("6. Structure", styles))
    story.append(
        bullet_list(
            [
                "src/integrations/telegram/: Telegram adapter handling messages, callbacks, and user session reset commands.",
                "src/modules/conversation/: Core orchestrator that loads history, classifies intent, matches products, builds prompts, calls OpenAI, and persists outcomes.",
                "src/modules/intent/: Keyword-based intent classification.",
                "src/modules/products/: Product matching logic based on tags and rank scoring.",
                "src/llm/: Prompt builder plus structured response generation through OpenAI.",
                "src/modules/followup/: Scheduled follow-up sender that builds tracked redirect links.",
                "src/database/: SQLite client and repository functions for sessions, clicks, and follow-ups.",
                "src/app/: Next.js routes for dashboard, health endpoint, and click redirect tracking.",
                "src/catalog/: Static product catalog data and access helpers.",
            ],
            styles,
        )
    )

    story.append(section_title("7. Current Vision", styles))
    story.append(
        para(
            "The project currently behaves like a strong local prototype and portfolio-grade architecture case. The system already demonstrates a full loop from chat entry to recommendation, persistence, follow-up scheduling, redirect tracking, and dashboard visibility.",
            styles,
        )
    )
    story.append(
        para(
            "At the same time, the current implementation is not yet a production-grade live platform. The main limiting factor is the local SQLite database, which does not support an easy split between separately deployed web and bot runtimes without additional infrastructure changes.",
            styles,
        )
    )

    story.append(section_title("8. Current Strengths", styles))
    story.append(
        bullet_list(
            [
                "Clear module boundaries around bot handling, orchestration, LLM use, persistence, and dashboard concerns.",
                "A demonstrable operator surface instead of a hidden backend-only prototype.",
                "Structured recommendation generation rather than raw free-form chat completion output.",
                "Practical product flow: interest -> recommendation -> persistence -> follow-up -> click tracking.",
                "Good portfolio narrative: transition from simple bot logic to operational AI platform architecture.",
            ],
            styles,
        )
    )

    story.append(section_title("9. Current Constraints", styles))
    story.append(
        bullet_list(
            [
                "SQLite is local-only and becomes the core blocker for a true multi-service live deployment.",
                "Intent classification is keyword-driven and can miss nuance or mixed intent messages.",
                "No production-ready auth, access control, audit trail, or environment segregation for operator usage.",
                "The testing setup exists, but environment and config resolution still need cleanup for reliable execution in all contexts.",
                "Polling-based bot runtime is practical for local use but not the ideal final runtime model for a public deployment.",
            ],
            styles,
        )
    )

    story.append(section_title("10. Next Sprints", styles))
    story.append(
        bullet_list(
            [
                "Sprint 1 - Production-readiness baseline: rotate secrets, clean environment handling, define .env.example, and document safe local startup.",
                "Sprint 2 - Shared persistence migration: replace SQLite with a shared database such as Postgres or Turso so the bot and web app can run separately.",
                "Sprint 3 - Deployable demo: publish the Next.js dashboard and set up a stable bot runtime with shared persistence.",
                "Sprint 4 - Recommendation quality: improve intent detection, catalog matching, fallback behavior, and structured validation around LLM output.",
                "Sprint 5 - Recruiter-facing polish: better README, short architecture summary, screenshots, and a public demo path that works without manual intervention.",
            ],
            styles,
        )
    )
    story.append(PageBreak())

    story.append(section_title("11. Future Vision", styles))
    story.append(
        para(
            "The longer-term vision is a deployable AI sales platform in which conversational entry, recommendation logic, persistence, follow-up automation, click measurement, and operator insights work as one shared system.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Shared remote database backing all runtimes.",
                "Stable production deployment with web and bot components.",
                "Better intent detection and recommendation confidence logic.",
                "Cleaner analytics around clicks, follow-up success, and conversion signals.",
                "Potential support for broader channels beyond Telegram if the core architecture remains stable.",
            ],
            styles,
        )
    )

    story.append(section_title("12. Engineering Practices To Avoid", styles))
    story.append(
        para(
            "The project benefits from discipline more than from added complexity. The following practices should be explicitly avoided when coding, creating components, or changing structure.",
            styles,
        )
    )
    story.append(
        bullet_list(
            [
                "Do not introduce abstractions before there is repeated pressure for them. Premature indirection would make a currently understandable system harder to reason about.",
                "Do not mix UI concerns, bot handling, and orchestration logic inside the same module. Boundaries are one of the strongest current assets of the project.",
                "Do not add components or routes without a real operator or user need. Every new surface should support a traceable product workflow.",
                "Do not couple storage assumptions to local-only runtime forever. Any new data flow should keep shared-persistence migration in mind.",
                "Do not rely on undocumented environment variables, hidden setup steps, or manual operational knowledge.",
                "Do not let LLM responses bypass structured checks when the application expects a single valid product recommendation.",
                "Do not create visual complexity in the dashboard without improving operational comprehension.",
                "Do not expose secrets in repository files, screenshots, or deploy logs.",
            ],
            styles,
        )
    )

    story.append(section_title("13. Practical Rules For Future Changes", styles))
    story.append(
        bullet_list(
            [
                "Read the existing flow before editing: Telegram adapter -> orchestrator -> repositories -> dashboard/redirect routes.",
                "Preserve simple data flow. New logic should be added where responsibility already exists, not in a convenient random file.",
                "When adding a component, ask whether it clarifies the operator view or just adds presentation noise.",
                "When changing storage, design for migration safety and explicit repository boundaries.",
                "When changing LLM behavior, keep prompts, selection logic, and output validation aligned.",
                "When adding tests, prefer business-critical behavior first: intent mapping, product selection, persistence effects, and redirect tracking.",
            ],
            styles,
        )
    )

    story.append(section_title("14. Recommended Immediate Actions", styles))
    story.append(
        bullet_list(
            [
                "Rotate exposed Telegram and OpenAI credentials immediately.",
                "Add a public-facing README that explains architecture, local startup, and demo limitations clearly.",
                "Prepare a minimal live demo path before presenting the project as publicly accessible.",
                "Prioritize shared persistence before claiming the bot and dashboard are fully live together.",
            ],
            styles,
        )
    )

    story.append(Spacer(1, 12))
    story.append(
        Paragraph(
            "Summary note: GrowthBot DE is already strong as an architecture and product-engineering case. Its next step is not more surface area, but stronger deployment realism and operational reliability.",
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
        title="GrowthBot DE Project Summary",
        author="OpenAI Codex",
    )
    story = build_story(styles)
    doc.build(story, onFirstPage=footer, onLaterPages=footer)
    print(OUTPUT_FILE)


if __name__ == "__main__":
    main()
