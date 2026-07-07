import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string | number;
  hint?: ReactNode;
};

export function MetricCard({ label, value, hint }: MetricCardProps) {
  return (
    <article className="metric-card">
      <span className="metric-card__label">{label}</span>
      <strong className="metric-card__value">{value}</strong>
      {hint ? <p className="metric-card__hint">{hint}</p> : null}
    </article>
  );
}
