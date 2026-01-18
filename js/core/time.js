// core/time.js
// Display helper for America/New_York (EST/EDT handled by Intl)

export const TZ = "America/New_York";

export function formatEST(isoString) {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("en-US", {
      timeZone: TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  } catch {
    return isoString;
  }
}
