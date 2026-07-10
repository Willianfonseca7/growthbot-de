import type { Metadata } from "next";
import { ActivityTable } from "../../components/dashboard/ActivityTable";
import { MetricCard } from "../../components/dashboard/MetricCard";
import { SectionCard } from "../../components/dashboard/SectionCard";
import { getDashboardData } from "../../lib/dashboard-data";
import { formatDateTime } from "../../lib/format";
import {
  getOpsCopy,
  resolveLocale,
  type AppLocale
} from "../../lib/site-copy";

export const metadata: Metadata = {
  title: "GrowthBot DE Ops Dashboard | Betriebsdashboard",
  description: "Protected operational dashboard for GrowthBot DE | Geschütztes Betriebsdashboard",
  robots: {
    index: false,
    follow: false
  }
};

type OpsPageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

function LocaleSwitcher({ locale, label }: { locale: AppLocale; label: string }) {
  return (
    <div className="locale-switcher" aria-label={label}>
      <a
        className={locale === "de" ? "locale-switcher__link locale-switcher__link--active" : "locale-switcher__link"}
        href="/ops"
      >
        DE
      </a>
      <a
        className={locale === "en" ? "locale-switcher__link locale-switcher__link--active" : "locale-switcher__link"}
        href="/ops?lang=en"
      >
        EN
      </a>
    </div>
  );
}

export default async function OpsPage({ searchParams }: OpsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const locale = resolveLocale(params?.lang);
  const copy = getOpsCopy(locale);
  const { metrics, sessions, followUps, clicks } = getDashboardData();

  return (
    <main className="ops-main">
      <section className="ops-hero">
        <div>
          <div className="hero__topbar">
            <span className="hero__eyebrow">{copy.eyebrow}</span>
            <LocaleSwitcher locale={locale} label={copy.localeLabel} />
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
        </div>
      </section>

      <div className="metric-grid">
        <MetricCard
          label={copy.metrics.activeSessions.label}
          value={metrics.totalSessions}
          hint={copy.metrics.activeSessions.hint}
        />
        <MetricCard
          label={copy.metrics.trackedClicks.label}
          value={metrics.totalClicks}
          hint={copy.metrics.trackedClicks.hint}
        />
        <MetricCard
          label={copy.metrics.pendingFollowUps.label}
          value={metrics.pendingFollowUps}
          hint={copy.metrics.pendingFollowUps.hint}
        />
        <MetricCard
          label={copy.metrics.sentFollowUps.label}
          value={metrics.sentFollowUps}
          hint={copy.metrics.sentFollowUps.hint}
        />
      </div>

      <div className="section-grid">
        <SectionCard
          title={copy.architecture.title}
          description={copy.architecture.description}
        >
          <div className="stack-list">
            {copy.architecture.rows.map((row) => (
              <div key={row.label}><strong>{row.label}:</strong> <span>{row.value}</span></div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title={copy.sessions.title}
          description={copy.sessions.description}
        >
          <ActivityTable
            items={sessions}
            emptyText={copy.sessions.empty}
            columns={[
              { key: "user", title: copy.sessions.columns.user, render: (item) => item.userId },
              { key: "message", title: copy.sessions.columns.message, render: (item) => item.lastMessage },
              { key: "updated", title: copy.sessions.columns.updated, render: (item) => formatDateTime(item.updatedAt, locale) }
            ]}
          />
        </SectionCard>

        <SectionCard
          title={copy.followUps.title}
          description={copy.followUps.description}
        >
          <ActivityTable
            items={followUps}
            emptyText={copy.followUps.empty}
            columns={[
              { key: "user", title: copy.followUps.columns.user, render: (item) => item.user_id },
              { key: "product", title: copy.followUps.columns.product, render: (item) => item.produto_nome },
              {
                key: "status",
                title: copy.followUps.columns.status,
                render: (item) => (item.sent ? copy.followUps.status.sent : copy.followUps.status.pending)
              },
              {
                key: "scheduled",
                title: copy.followUps.columns.scheduled,
                render: (item) => formatDateTime(item.scheduled_at, locale)
              }
            ]}
          />
        </SectionCard>

        <SectionCard
          title={copy.clicks.title}
          description={copy.clicks.description}
        >
          <ActivityTable
            items={clicks}
            emptyText={copy.clicks.empty}
            columns={[
              { key: "user", title: copy.clicks.columns.user, render: (item) => item.userId },
              { key: "product", title: copy.clicks.columns.productId, render: (item) => item.productId },
              { key: "clicked", title: copy.clicks.columns.clicked, render: (item) => formatDateTime(item.clickedAt, locale) }
            ]}
          />
        </SectionCard>
      </div>
    </main>
  );
}
