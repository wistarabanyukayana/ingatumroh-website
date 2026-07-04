const dayMs = 24 * 60 * 60 * 1000;
const jakartaDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Asia/Jakarta",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function isoDate(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function isoToDisplayDate(iso: string) {
  const [year, month, day] = iso.split("-");
  return year && month && day ? `${day}/${month}/${year}` : "";
}

export function jakartaTodayIso(now = new Date()) {
  const parts = Object.fromEntries(
    jakartaDate
      .formatToParts(now)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function jakartaTodayDate(now = new Date()) {
  return dateFromIso(jakartaTodayIso(now)) ?? now;
}

function dateFromIso(iso: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  );

  return isoDate(date) === iso ? date : null;
}

export function displayDateToIso(value: string) {
  const trimmed = value.trim();
  const iso = dateFromIso(trimmed);
  if (iso) return trimmed;

  const match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(trimmed);
  if (!match) return null;

  const [, day = "", month = "", year = ""] = match;
  const normalized = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return dateFromIso(normalized) ? normalized : null;
}

export function parseAdminDate(value: string) {
  const iso = displayDateToIso(value);
  return iso ? dateFromIso(iso) : null;
}

export function inclusiveCalendarDays(start: Date, end: Date) {
  return Math.floor((dateKey(end) - dateKey(start)) / dayMs) + 1;
}

function dateKey(date: Date) {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
