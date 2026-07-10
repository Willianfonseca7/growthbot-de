import type { Metadata } from "next";
import { ActivityTable } from "../../components/dashboard/ActivityTable";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SectionCard } from "../../components/dashboard/SectionCard";
import { getDashboardData } from "../../lib/dashboard-data";
import { formatDateTime } from "../../lib/format";

export const metadata: Metadata = {
  title: "GrowthBot DE Ops Dashboard",
  description: "Protected operational dashboard for GrowthBot DE",
  robots: {
    index: false,
    follow: false
  }
};

export default function OpsPage() {
  const { metrics, sessions, followUps, clicks } = getDashboardData();

  return (
    <main className="ops-main">
      <section className="ops-hero">
        <div>
          <span className="hero__eyebrow">Protected Ops Surface</span>
          <h1>GrowthBot DE operational dashboard</h1>
          <p>
            This private surface exposes the live operational state of sessions, follow-ups,
            redirect tracking, and the current platform architecture split.
          </p>
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard label="Active Sessions" value={metrics.totalSessions} hint="Persisted conversation threads in SQLite." />
        <MetricCard label="Tracked Clicks" value={metrics.totalClicks} hint="Affiliate redirect events captured through route handlers." />
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
