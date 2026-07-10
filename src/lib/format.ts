import type { AppLocale } from "./site-copy";

export function formatDateTime(unixSeconds: number, locale: AppLocale = "de"): string {
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "de-DE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(unixSeconds * 1000));
}
