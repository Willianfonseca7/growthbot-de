import { ActivityTable } from "../components/dashboard/ActivityTable";
import { MetricCard } from "../components/dashboard/MetricCard";
import { SectionCard } from "../components/dashboard/SectionCard";
import { getDashboardData } from "../lib/dashboard-data";
import { formatDateTime } from "../lib/format";

export default function HomePage() {
  const { metrics, sessions, followUps, clicks } = getDashboardData();

  return (
    <main>
      <section className="hero">
        <span className="hero__eyebrow">GrowthBot DE Platform</span>
        <h1>LLM sales orchestration with a real operator dashboard.</h1>
        <p>
          This platform now separates intent detection, product matching, prompt construction,
          response generation, follow-up scheduling, and click tracking while exposing the
          operational state through a Next.js admin surface.
        </p>
        <div className="hero__badges">
          <span className="badge">Telegram Bot Runtime</span>
          <span className="badge">Next.js Admin</span>
          <span className="badge">Structured LLM Flow</span>
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard label="Active Sessions" value={metrics.totalSessions} hint="Persisted conversation threads in SQLite." />
        <MetricCard label="Tracked Clicks" value={metrics.totalClicks} hint="Affiliate redirect events captured through Next route handlers." />
        <MetricCard label="Pending Follow-ups" value={metrics.pendingFollowUps} hint="Leads queued for re-engagement by the bot worker." />
        <MetricCard label="Sent Follow-ups" value={metrics.sentFollowUps} hint="Completed follow-up deliveries registered in storage." />
      </div>

      <div className="section-grid">
        <SectionCard
          title="Platform Architecture"
          description="Current runtime split between conversational orchestration and operator visibility."
        >
          <div className="stack-list">
            <div><strong>Channel:</strong> <span>Telegram adapter for messages and callbacks</span></div>
            <div><strong>Core:</strong> <span>Intent classifier, product matcher, conversation orchestrator</span></div>
            <div><strong>LLM:</strong> <span>Prompt builder plus structured OpenAI provider layer</span></div>
            <div><strong>Admin:</strong> <span>Next.js app router, metrics dashboard and tracking routes</span></div>
            <div><strong>Storage:</strong> <span>SQLite sessions, clicks and follow-up state</span></div>
          </div>
        </SectionCard>

        <SectionCard
          title="Recent Sessions"
          description="Latest conversations stored by the orchestrator."
        >
          <ActivityTable
            items={sessions}
            emptyText="No sessions stored yet."
            columns={[
              { key: "user", title: "User", render: (item) => item.userId },
              { key: "message", title: "Last Message", render: (item) => item.lastMessage },
              { key: "updated", title: "Updated", render: (item) => formatDateTime(item.updatedAt) }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Follow-up Queue"
          description="Products and users currently tracked for re-engagement."
        >
          <ActivityTable
            items={followUps}
            emptyText="No follow-ups scheduled."
            columns={[
              { key: "user", title: "User", render: (item) => item.user_id },
              { key: "product", title: "Product", render: (item) => item.produto_nome },
              { key: "status", title: "Status", render: (item) => (item.sent ? "Sent" : "Pending") },
              { key: "scheduled", title: "Scheduled", render: (item) => formatDateTime(item.scheduled_at) }
            ]}
          />
        </SectionCard>

        <SectionCard
          title="Recent Clicks"
          description="Latest affiliate redirect events recorded by the platform."
        >
          <ActivityTable
            items={clicks}
            emptyText="No click tracking data yet."
            columns={[
              { key: "user", title: "User", render: (item) => item.userId },
              { key: "product", title: "Product ID", render: (item) => item.productId },
              { key: "clicked", title: "Clicked", render: (item) => formatDateTime(item.clickedAt) }
            ]}
          />
        </SectionCard>
      </div>
    </main>
  );
}
