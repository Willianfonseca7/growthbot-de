export function formatDateTime(unixSeconds: number): string {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "short",
    timeStyle: "short"
  }).format(new Date(unixSeconds * 1000));
}
