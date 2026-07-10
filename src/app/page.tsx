export default function HomePage() {
  return (
    <main className="public-main">
      <section className="public-hero">
        <div className="public-hero__copy">
          <span className="hero__eyebrow">GrowthBot DE Live</span>
          <h1>From Telegram chatbot to AI sales platform.</h1>
          <p>
            GrowthBot DE is a recruiter-safe live surface for a platform that combines intent
            detection, product matching, structured LLM orchestration, affiliate tracking,
            follow-up automation, and operational visibility.
          </p>
          <div className="hero__badges">
            <span className="badge">Telegram Runtime</span>
            <span className="badge">Next.js Surface</span>
            <span className="badge">Structured AI Flow</span>
            <span className="badge">Protected Ops Dashboard</span>
          </div>
          <div className="public-actions">
            <a className="cta cta--primary" href="/api/health">Live Health Endpoint</a>
            <a className="cta cta--secondary" href="/ops">Protected Ops Surface</a>
          </div>
          <p className="public-note">
            The public landing is intentionally separated from the operational dashboard. Sensitive
            runtime data stays behind protected access.
          </p>
        </div>
        <div className="public-hero__panel">
          <div className="signal-card">
            <span className="signal-card__label">Public Mode</span>
            <strong>Recruiter-safe live view</strong>
            <p>Architecture, capabilities, health status, and platform positioning without exposing internal operational data.</p>
          </div>
          <div className="signal-card">
            <span className="signal-card__label">Private Mode</span>
            <strong>Ops dashboard behind auth</strong>
            <p>Sessions, clicks, follow-ups, and runtime visibility are separated into a protected surface.</p>
          </div>
        </div>
      </section>

      <section className="public-grid">
        <article className="showcase-card">
          <span className="showcase-card__eyebrow">System Shape</span>
          <h2>What is live in this project</h2>
          <ul className="feature-list">
            <li>Telegram bot runtime for conversational entry</li>
            <li>Intent classification and product matching</li>
            <li>Prompt builder plus OpenAI recommendation flow</li>
            <li>Affiliate redirect tracking route</li>
            <li>Follow-up scheduling model</li>
            <li>Protected operational dashboard surface</li>
          </ul>
        </article>

        <article className="showcase-card">
          <span className="showcase-card__eyebrow">Architecture</span>
          <h2>Core platform split</h2>
          <div className="stack-list">
            <div><strong>Conversation:</strong> <span>Telegram adapter and conversation orchestrator</span></div>
            <div><strong>Decision Flow:</strong> <span>Intent → candidates → prompt → structured recommendation</span></div>
            <div><strong>Operations:</strong> <span>Tracking, follow-up queue, health endpoint, ops visibility</span></div>
            <div><strong>Persistence:</strong> <span>SQLite sessions, clicks and follow-up state</span></div>
          </div>
        </article>

        <article className="showcase-card showcase-card--wide">
          <span className="showcase-card__eyebrow">Recruiter Access Model</span>
          <h2>Public first, operational second</h2>
          <div className="flow-steps">
            <div className="flow-step">
              <strong>1. Public landing</strong>
              <p>Live product positioning, architecture view, and health endpoint remain public.</p>
            </div>
            <div className="flow-step">
              <strong>2. Protected ops</strong>
              <p>Internal sessions, clicks and follow-ups stay behind server-side basic auth.</p>
            </div>
            <div className="flow-step">
              <strong>3. Controlled demo</strong>
              <p>Recruiters can see that the project is real without exposing raw operational data by default.</p>
            </div>
          </div>
        </article>
      </section>
    </main>
  );
}
