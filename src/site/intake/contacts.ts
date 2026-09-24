import type { Contacts } from "./contract";

export type ContactKind = keyof Contacts;
export const CONTACT_LABEL: Record<ContactKind, string> = {
  email: "Email",
  telegram: "Telegram",
  phone: "Телефон",
};

/** Recognizes what the client typed into the single contact field */
export function detectContact(raw: string): { kind: ContactKind; value: string } | null {
  const v = raw.trim();
  if (!v) return null;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return { kind: "email", value: v.toLowerCase() };
  const tg = v.match(/^(?:https?:\/\/)?(?:t\.me\/|telegram\.me\/)?@?([a-zA-Z][a-zA-Z0-9_]{4,31})$/);
  if (tg && !/^\d/.test(tg[1])) return { kind: "telegram", value: `@${tg[1]}` };
  const digits = v.replace(/[^\d]/g, "");
  if (/^[+\d\s()-]+$/.test(v) && digits.length >= 10 && digits.length <= 15) {
    const ru = digits.length === 11 && /^[78]/.test(digits) ? `+7${digits.slice(1)}` : digits.length === 10 ? `+7${digits}` : `+${digits}`;
    return { kind: "phone", value: ru };
  }
  return null;
}

export function collectContacts(values: string[]): Contacts {
  const out: Contacts = {};
  for (const v of values) {
    const c = detectContact(v);
    if (c && !out[c.kind]) out[c.kind] = c.value;
  }
  return out;
}

/** One line may hold several contacts: "@name, name@mail.ru" or "почта ... или телефон ..." */
export function splitContacts(raw: string): Array<{ kind: ContactKind; value: string }> {
  const out: Array<{ kind: ContactKind; value: string }> = [];
  const parts = raw.split(/[,;\n]|\s+(?:или|и|or)\s+/i);
  for (const part of parts) {
    const bare = part.trim().replace(/^[а-я\u0451\s:-]+(?=[@+\d(a-z])/i, "");
    const words = bare.split(/\s+/);
    // Labels like "телеграм @name" or "почта name@mail.ru": try the whole part, then each word
    const hit = detectContact(bare) ?? words.map(detectContact).find(Boolean) ?? null;
    if (hit && !out.some((c) => c.kind === hit.kind)) out.push(hit);
  }
  return out;
}
