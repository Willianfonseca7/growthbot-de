import {
  getHomeCopy,
  localeHref,
  resolveLocale,
  type AppLocale
} from "../lib/site-copy";

type HomePageProps = {
  searchParams?: Promise<{
    lang?: string | string[];
  }>;
};

function LocaleSwitcher({ locale, label }: { locale: AppLocale; label: string }) {
  return (
    <div className="locale-switcher" aria-label={label}>
      <a
        className={locale === "de" ? "locale-switcher__link locale-switcher__link--active" : "locale-switcher__link"}
        href="/"
      >
        DE
      </a>
      <a
        className={locale === "en" ? "locale-switcher__link locale-switcher__link--active" : "locale-switcher__link"}
        href="/?lang=en"
      >
        EN
      </a>
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = searchParams ? await searchParams : undefined;
  const locale = resolveLocale(params?.lang);
  const copy = getHomeCopy(locale);

  return (
    <main className="public-main">
      <section className="public-hero">
        <div className="public-hero__copy">
          <div className="hero__topbar">
            <span className="hero__eyebrow">{copy.eyebrow}</span>
            <LocaleSwitcher locale={locale} label={copy.localeLabel} />
          </div>
          <h1>{copy.title}</h1>
          <p>{copy.description}</p>
          <div className="hero__badges">
            {copy.badges.map((badge) => (
              <span key={badge} className="badge">{badge}</span>
            ))}
          </div>
          <div className="public-actions">
            <a className="cta cta--primary" href="/api/health">{copy.primaryCta}</a>
            <a className="cta cta--secondary" href={localeHref("/ops", locale)}>{copy.secondaryCta}</a>
          </div>
          <p className="public-note">{copy.note}</p>
        </div>
        <div className="public-hero__panel">
          {copy.panels.map((panel) => (
            <div key={panel.title} className="signal-card">
              <span className="signal-card__label">{panel.label}</span>
              <strong>{panel.title}</strong>
              <p>{panel.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-grid">
        <article className="showcase-card">
          <span className="showcase-card__eyebrow">{copy.systemShape.eyebrow}</span>
          <h2>{copy.systemShape.title}</h2>
          <ul className="feature-list">
            {copy.systemShape.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </article>

        <article className="showcase-card">
          <span className="showcase-card__eyebrow">{copy.architecture.eyebrow}</span>
          <h2>{copy.architecture.title}</h2>
          <div className="stack-list">
            {copy.architecture.rows.map((row) => (
              <div key={row.label}><strong>{row.label}:</strong> <span>{row.value}</span></div>
            ))}
          </div>
        </article>

        <article className="showcase-card showcase-card--wide">
          <span className="showcase-card__eyebrow">{copy.accessModel.eyebrow}</span>
          <h2>{copy.accessModel.title}</h2>
          <div className="flow-steps">
            {copy.accessModel.steps.map((step) => (
              <div key={step.title} className="flow-step">
                <strong>{step.title}</strong>
                <p>{step.body}</p>
              </div>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
