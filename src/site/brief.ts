/** Local draft contract. Future AI and delivery adapters consume this shape. */
export const SERVICES = [
  "Сайты и интернет-магазины",
  "Веб-сервисы и личные кабинеты",
  "Интерактив и спецпроекты",
  "Автоматизация и интеграции",
] as const;
export const BRIEF_STORAGE_KEY = "vc-studio-brief-v3";
export interface BriefDraft {
  schemaVersion: 1;
  service: string;
  details: string;
  deadline: string;
  budget: string;
  contact: string;
}
export const EMPTY_BRIEF: BriefDraft = {
  schemaVersion: 1,
  service: "Пока не определен",
  details: "",
  deadline: "",
  budget: "",
  contact: "",
};
export function readBrief(value: unknown): BriefDraft | null {
  if (!value || typeof value !== "object") return null;
  const v = value as Record<string, unknown>;
  if (v.schemaVersion !== 1) return null;
  for (const key of [
    "service",
    "details",
    "deadline",
    "budget",
    "contact",
  ] as const)
    if (typeof v[key] !== "string") return null;
  if (String(v.details).length > 4000 || String(v.contact).length > 200)
    return null;
  return {
    schemaVersion: 1,
    service: String(v.service).slice(0, 120),
    details: String(v.details),
    deadline: String(v.deadline).slice(0, 200),
    budget: String(v.budget).slice(0, 200),
    contact: String(v.contact),
  };
}
export function serviceFromQuery(search: string): string | null {
  const id = new URLSearchParams(search).get("service");
  return id !== null && /^[0-3]$/.test(id) ? SERVICES[Number(id)] : null;
}
