import type { ExperienceItem } from "@/types";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"] as const;

function parseDate(value: string) {
  const match = value.trim().match(/^(\d{1,2}|[A-Za-z]+)[/\s]+(\d{4})$/);
  if (!match) return undefined;
  const month = /^\d+$/.test(match[1]) ? Number(match[1]) - 1 : MONTHS.findIndex((name) => name.toLowerCase() === match[1].slice(0, 3).toLowerCase());
  return MONTHS[month] ? { month: MONTHS[month], year: Number(match[2]) } : undefined;
}

// Keep legacy cached periods readable; unrecognized text remains available for display.
export function normalizeExperience(item: ExperienceItem): ExperienceItem {
  if (MONTHS.includes(item.startMonth as typeof MONTHS[number]) && Number.isInteger(item.startYear)) return item;
  const [startText = "", endText = ""] = (item.period ?? "").split(/\s*[–—-]\s*/);
  const start = parseDate(startText);
  const end = parseDate(endText);
  return { ...item, startMonth: start?.month ?? "", startYear: start?.year ?? 0,
    endMonth: end?.month, endYear: end?.year, isCurrent: /^(present|current|now)$/i.test(endText.trim()) };
}

export function compareExperiences(a: ExperienceItem, b: ExperienceItem) {
  return Number(b.isCurrent) - Number(a.isCurrent) || b.startYear - a.startYear
    || MONTHS.indexOf(b.startMonth as typeof MONTHS[number]) - MONTHS.indexOf(a.startMonth as typeof MONTHS[number]);
}

export function formatExperiencePeriod(item: ExperienceItem) {
  if (!item.startMonth || !item.startYear) return item.period || "Dates not set";
  const end = item.isCurrent ? "Present" : item.endMonth && item.endYear ? `${item.endMonth} ${item.endYear}` : "End date not set";
  return `${item.startMonth} ${item.startYear} – ${end}`;
}
