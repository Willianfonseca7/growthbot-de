import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const projectRoot = process.cwd();
const rulesDir = path.join(projectRoot, ".ai-rules");
const outputDir = path.join(projectRoot, "output", "pdf");
const tempDir = path.join(projectRoot, "output", "handbook");
const outputPdf = path.join(outputDir, "growthbot-de-engineering-handbook-v1.pdf");
const outputHtml = path.join(tempDir, "growthbot-de-engineering-handbook-v1.html");

const documentOrder = [
  "README.md",
  "00-project-mission.md",
  "01-architecture.md",
  "08-product-engineering.md",
  "04-ai-platform.md",
  "03-backend-api.md",
  "05-security.md",
  "07-performance.md",
  "06-testing.md",
  "02-frontend.md",
  "10-observability.md",
  "11-deployment.md",
  "09-code-review.md",
  "99-engineering-glossary.md",
  "12-agent-chain.md"
];

const titleMap = {
  "README.md": "Engineering Handbook",
  "00-project-mission.md": "Project Mission",
  "01-architecture.md": "Architecture",
  "08-product-engineering.md": "Product Engineering",
  "04-ai-platform.md": "AI Platform",
  "03-backend-api.md": "Backend API",
  "05-security.md": "Security",
  "07-performance.md": "Performance",
  "06-testing.md": "Testing",
  "02-frontend.md": "Frontend",
  "10-observability.md": "Observability",
  "11-deployment.md": "Deployment",
  "09-code-review.md": "Code Review",
  "99-engineering-glossary.md": "Engineering Glossary",
  "12-agent-chain.md": "Agent Chain"
};

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function formatInline(text) {
  return escapeHtml(text).replace(/`([^`]+)`/g, "<code>$1</code>");
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderMarkdown(markdown, sectionSlug) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let paragraph = [];
  let listItems = [];
  let listTag = null;

  const flushParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${formatInline(paragraph.join(" "))}</p>`);
    paragraph = [];
  };

  const flushList = () => {
    if (!listItems.length || !listTag) return;
    html.push(`<${listTag}>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join("")}</${listTag}>`);
    listItems = [];
    listTag = null;
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,3})\s+(.*)$/);
    if (headingMatch) {
      flushParagraph();
      flushList();
      const level = headingMatch[1].length;
      const title = headingMatch[2].trim();
      const id = `${sectionSlug}-${slugify(title)}`;
      const normalizedLevel = Math.min(level + 1, 4);
      html.push(`<h${normalizedLevel} id="${id}">${formatInline(title)}</h${normalizedLevel}>`);
      continue;
    }

    const bulletMatch = trimmed.match(/^-\s+(.*)$/);
    if (bulletMatch) {
      flushParagraph();
      if (listTag && listTag !== "ul") {
        flushList();
      }
      listTag = "ul";
      listItems.push(bulletMatch[1].trim());
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      flushParagraph();
      if (listTag && listTag !== "ol") {
        flushList();
      }
      listTag = "ol";
      listItems.push(orderedMatch[1].trim());
      continue;
    }

    flushList();
    paragraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return html.join("\n");
}

function createPillarsDiagram() {
  return `
  <section class="diagram-card">
    <h3>Engineering Handbook Pillars</h3>
    <svg viewBox="0 0 920 280" role="img" aria-label="Engineering Handbook pillars diagram">
      <defs>
        <linearGradient id="pillarBg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="100%" stop-color="#1e293b" />
        </linearGradient>
      </defs>
      <rect x="20" y="30" width="880" height="220" rx="24" fill="#f8fafc" stroke="#cbd5e1" />
      <rect x="50" y="70" width="190" height="140" rx="18" fill="url(#pillarBg)" />
      <rect x="260" y="70" width="190" height="140" rx="18" fill="#0f766e" />
      <rect x="470" y="70" width="190" height="140" rx="18" fill="#1d4ed8" />
      <rect x="680" y="70" width="190" height="140" rx="18" fill="#7c3aed" />
      <text x="145" y="110" text-anchor="middle" class="svg-title-light">Foundation</text>
      <text x="145" y="145" text-anchor="middle" class="svg-text-light">Mission</text>
      <text x="145" y="170" text-anchor="middle" class="svg-text-light">Architecture</text>
      <text x="145" y="195" text-anchor="middle" class="svg-text-light">Glossary</text>
      <text x="355" y="110" text-anchor="middle" class="svg-title-light">Engineering</text>
      <text x="355" y="145" text-anchor="middle" class="svg-text-light">Backend</text>
      <text x="355" y="170" text-anchor="middle" class="svg-text-light">AI Platform</text>
      <text x="355" y="195" text-anchor="middle" class="svg-text-light">Security / Testing / Performance</text>
      <text x="565" y="110" text-anchor="middle" class="svg-title-light">Product</text>
      <text x="565" y="145" text-anchor="middle" class="svg-text-light">Frontend</text>
      <text x="565" y="170" text-anchor="middle" class="svg-text-light">Product Engineering</text>
      <text x="565" y="195" text-anchor="middle" class="svg-text-light">Observability / Deployment</text>
      <text x="775" y="110" text-anchor="middle" class="svg-title-light">Governance</text>
      <text x="775" y="145" text-anchor="middle" class="svg-text-light">Code Review</text>
      <text x="775" y="170" text-anchor="middle" class="svg-text-light">Agent Chain</text>
      <text x="775" y="195" text-anchor="middle" class="svg-text-light">Branch Policy</text>
    </svg>
  </section>`;
}

function createConceptualFlowDiagram() {
  return `
  <section class="diagram-card">
    <h3>Conceptual Reading Order</h3>
    <svg viewBox="0 0 920 340" role="img" aria-label="Conceptual reading order diagram">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L10,3 L0,6 Z" fill="#334155"></path>
        </marker>
      </defs>
      <rect x="60" y="40" width="160" height="56" rx="14" class="svg-box navy" />
      <rect x="290" y="40" width="160" height="56" rx="14" class="svg-box navy" />
      <rect x="520" y="40" width="160" height="56" rx="14" class="svg-box teal" />
      <rect x="750" y="40" width="110" height="56" rx="14" class="svg-box teal" />
      <rect x="110" y="160" width="180" height="56" rx="14" class="svg-box blue" />
      <rect x="370" y="160" width="180" height="56" rx="14" class="svg-box blue" />
      <rect x="630" y="160" width="180" height="56" rx="14" class="svg-box blue" />
      <rect x="180" y="265" width="240" height="46" rx="12" class="svg-box slate" />
      <rect x="500" y="265" width="240" height="46" rx="12" class="svg-box slate" />
      <path d="M220 68 H290" class="svg-line" marker-end="url(#arrow)" />
      <path d="M450 68 H520" class="svg-line" marker-end="url(#arrow)" />
      <path d="M680 68 H750" class="svg-line" marker-end="url(#arrow)" />
      <path d="M160 96 V160" class="svg-line" marker-end="url(#arrow)" />
      <path d="M600 96 V160" class="svg-line" marker-end="url(#arrow)" />
      <path d="M290 188 H370" class="svg-line" marker-end="url(#arrow)" />
      <path d="M550 188 H630" class="svg-line" marker-end="url(#arrow)" />
      <path d="M290 216 L300 265" class="svg-line" marker-end="url(#arrow)" />
      <path d="M720 216 L620 265" class="svg-line" marker-end="url(#arrow)" />
      <text x="140" y="73" text-anchor="middle" class="svg-title-light">Mission</text>
      <text x="370" y="73" text-anchor="middle" class="svg-title-light">Architecture</text>
      <text x="600" y="73" text-anchor="middle" class="svg-title-light">Product</text>
      <text x="805" y="73" text-anchor="middle" class="svg-title-light">AI</text>
      <text x="200" y="193" text-anchor="middle" class="svg-title-light">Backend</text>
      <text x="460" y="193" text-anchor="middle" class="svg-title-light">Security</text>
      <text x="720" y="193" text-anchor="middle" class="svg-title-light">Observability</text>
      <text x="300" y="294" text-anchor="middle" class="svg-title-light">Testing & Performance</text>
      <text x="620" y="294" text-anchor="middle" class="svg-title-light">Deployment & Review</text>
    </svg>
  </section>`;
}

function createBranchFlowDiagram() {
  return `
  <section class="diagram-card">
    <h3>Official Promotion Flow</h3>
    <svg viewBox="0 0 920 180" role="img" aria-label="Develop to main promotion flow diagram">
      <defs>
        <marker id="arrow2" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <path d="M0,0 L10,3 L0,6 Z" fill="#0f766e"></path>
        </marker>
      </defs>
      <rect x="80" y="55" width="220" height="72" rx="18" class="svg-box blue" />
      <rect x="355" y="55" width="220" height="72" rx="18" class="svg-box teal" />
      <rect x="630" y="55" width="220" height="72" rx="18" class="svg-box navy" />
      <path d="M300 91 H355" class="svg-line teal-line" marker-end="url(#arrow2)" />
      <path d="M575 91 H630" class="svg-line teal-line" marker-end="url(#arrow2)" />
      <text x="190" y="86" text-anchor="middle" class="svg-title-light">develop</text>
      <text x="190" y="110" text-anchor="middle" class="svg-text-light">Integration, validation</text>
      <text x="465" y="86" text-anchor="middle" class="svg-title-light">Review & Stabilization</text>
      <text x="465" y="110" text-anchor="middle" class="svg-text-light">Tests, observability, rollback plan</text>
      <text x="740" y="86" text-anchor="middle" class="svg-title-light">main</text>
      <text x="740" y="110" text-anchor="middle" class="svg-text-light">Intentional promotion only</text>
    </svg>
  </section>`;
}

const sections = documentOrder.map((fileName, index) => {
  const absolutePath = path.join(rulesDir, fileName);
  const slug = `${String(index + 1).padStart(2, "0")}-${slugify(fileName.replace(/\.md$/, ""))}`;
  const source = fs.readFileSync(absolutePath, "utf8");
  const title = titleMap[fileName] ?? fileName.replace(/\.md$/, "");
  return {
    fileName,
    slug,
    title,
    html: renderMarkdown(source, slug)
  };
});

const toc = sections
  .map((section) => `<li><a href="#${section.slug}">${escapeHtml(section.title)}</a></li>`)
  .join("");

const sectionHtml = sections
  .map((section, index) => `
    <section class="section ${index === 0 ? "" : "page-break"}" id="${section.slug}">
      <div class="section-kicker">${escapeHtml(section.fileName)}</div>
      <h2 class="section-title">${escapeHtml(section.title)}</h2>
      <div class="section-body">${section.html}</div>
    </section>
  `)
  .join("\n");

const html = `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>GrowthBot DE Engineering Handbook v1.0</title>
  <style>
    @page {
      size: A4;
      margin: 18mm 16mm 18mm 16mm;
    }
    :root {
      --text: #0f172a;
      --muted: #475569;
      --line: #cbd5e1;
      --paper: #ffffff;
      --soft: #f8fafc;
      --navy: #0f172a;
      --blue: #1d4ed8;
      --teal: #0f766e;
      --violet: #7c3aed;
      --slate: #334155;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background: var(--paper);
      line-height: 1.45;
      font-size: 11px;
    }
    .cover {
      min-height: 250mm;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 8mm 2mm 6mm;
    }
    .cover-top {
      border: 1px solid var(--line);
      border-radius: 22px;
      padding: 16mm;
      background:
        radial-gradient(circle at top right, rgba(29, 78, 216, 0.10), transparent 30%),
        radial-gradient(circle at bottom left, rgba(15, 118, 110, 0.10), transparent 32%),
        var(--soft);
    }
    .eyebrow {
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      margin-bottom: 10px;
    }
    .cover h1 {
      font-size: 34px;
      line-height: 1.05;
      margin: 0 0 14px;
    }
    .cover p {
      font-size: 13px;
      color: var(--muted);
      max-width: 720px;
      margin: 0;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      margin-top: 22px;
    }
    .meta-card {
      border-radius: 16px;
      background: #fff;
      border: 1px solid var(--line);
      padding: 12px;
    }
    .meta-card strong {
      display: block;
      margin-bottom: 4px;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--muted);
    }
    .page-break { page-break-before: always; }
    .section {
      padding-top: 4mm;
    }
    .section-kicker {
      color: var(--blue);
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 6px;
    }
    .section-title {
      font-size: 24px;
      margin: 0 0 10px;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--line);
    }
    .section-body h2 {
      margin-top: 18px;
      margin-bottom: 8px;
      font-size: 18px;
    }
    .section-body h3 {
      margin-top: 16px;
      margin-bottom: 8px;
      font-size: 14px;
    }
    .section-body h4 {
      margin-top: 14px;
      margin-bottom: 6px;
      font-size: 12px;
    }
    .section-body p {
      margin: 0 0 9px;
      color: var(--text);
    }
    .section-body ul,
    .section-body ol {
      margin: 0 0 11px 18px;
      padding: 0;
    }
    .section-body li {
      margin: 0 0 4px;
    }
    code {
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: 0.94em;
      background: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 6px;
      padding: 1px 5px;
    }
    .toc-list {
      columns: 2;
      column-gap: 28px;
      margin: 0;
      padding-left: 20px;
    }
    .toc-list li {
      margin-bottom: 6px;
    }
    .toc-list a {
      color: var(--text);
      text-decoration: none;
    }
    .diagram-grid {
      display: grid;
      gap: 14px;
      margin-top: 18px;
    }
    .diagram-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 12px;
      background: #fff;
    }
    .diagram-card h3 {
      margin: 0 0 8px;
      font-size: 14px;
    }
    svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .svg-box.navy { fill: #0f172a; }
    .svg-box.teal { fill: #0f766e; }
    .svg-box.blue { fill: #1d4ed8; }
    .svg-box.slate { fill: #334155; }
    .svg-title-light {
      fill: #ffffff;
      font-size: 18px;
      font-weight: 700;
    }
    .svg-text-light {
      fill: #e2e8f0;
      font-size: 12px;
    }
    .svg-line {
      stroke: #334155;
      stroke-width: 3;
      fill: none;
    }
    .svg-line.teal-line {
      stroke: #0f766e;
    }
    .footer-note {
      color: var(--muted);
      font-size: 10px;
      margin-top: 12px;
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="cover-top">
      <div class="eyebrow">GrowthBot DE</div>
      <h1>Engineering Handbook v1.0</h1>
      <p>
        Consolidated internal handbook for mission, architecture, product engineering, AI platform,
        security, testing, observability, backend, performance, deployment, governance, and future
        platform evolution.
      </p>
      <div class="meta-grid">
        <div class="meta-card">
          <strong>Version</strong>
          <span>1.0</span>
        </div>
        <div class="meta-card">
          <strong>Status</strong>
          <span>Structural baseline frozen</span>
        </div>
        <div class="meta-card">
          <strong>Branch Policy</strong>
          <span><code>develop -&gt; main</code></span>
        </div>
      </div>
    </div>
    <div>
      <div class="footer-note">Generated from <code>.ai-rules/</code> in conceptual reading order.</div>
    </div>
  </section>

  <section class="page-break section" id="table-of-contents">
    <div class="section-kicker">Overview</div>
    <h2 class="section-title">Table of Contents</h2>
    <ol class="toc-list">${toc}</ol>
    <div class="diagram-grid">
      ${createPillarsDiagram()}
      ${createConceptualFlowDiagram()}
      ${createBranchFlowDiagram()}
    </div>
  </section>

  ${sectionHtml}
</body>
</html>`;

fs.mkdirSync(outputDir, { recursive: true });
fs.mkdirSync(tempDir, { recursive: true });
fs.writeFileSync(outputHtml, html, "utf8");

const browser = await chromium.launch();
const page = await browser.newPage();
await page.goto(`file://${outputHtml}`, { waitUntil: "load" });
await page.pdf({
  path: outputPdf,
  format: "A4",
  printBackground: true,
  margin: {
    top: "14mm",
    right: "12mm",
    bottom: "14mm",
    left: "12mm"
  }
});
await browser.close();

console.log(`HTML: ${outputHtml}`);
console.log(`PDF: ${outputPdf}`);
