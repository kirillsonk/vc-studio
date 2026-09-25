/**
 * Contract between the chat intake on the site and the backend.
 * The site calls two endpoints: POST {NEXT_PUBLIC_INTAKE_API_URL}/next and /submit.
 * Without the variable the site runs on the local mock (`mock.ts`) with the same shapes.
 * Full description for the backend: docs/intake-api.md
 */

export const MAX_QUESTIONS = 5;
export const LIMITS = { task: 8000, answer: 4000, contact: 1000, summaryValue: 800 } as const;

export interface Answer {
  /** Question text exactly as the client saw it */
  question: string;
  /** Chosen option or own text. Empty string means the client skipped the question */
  answer: string;
}

/** POST /next: the model reads the task and the answers so far and decides what to do */
export interface NextRequest {
  schemaVersion: 1;
  sessionId: string;
  /** Format chip picked above the input, or null */
  service: string | null;
  task: string;
  answers: Answer[];
  /** True when the client pressed «Сразу к итогу» or the question limit is reached */
  forceSummary: boolean;
}

export interface Question {
  /** Short reaction to the previous message, shown before the question. Optional */
  message?: string;
  question: string;
  /** 2-4 quick replies. The client can always type their own answer */
  options: string[];
}

export interface SummaryItem {
  label: string;
  value: string;
}

export interface Summary {
  /** One line: what we are building, for whom */
  title: string;
  items: SummaryItem[];
}

export type NextResponse =
  | ({ type: "question" } & Question)
  | { type: "summary"; message?: string; summary: Summary };

export interface Contacts {
  email?: string;
  telegram?: string;
  phone?: string;
}

/** POST /submit: final brief. Contacts go only here, never to the model */
export interface SubmitRequest {
  schemaVersion: 1;
  sessionId: string;
  service: string | null;
  task: string;
  answers: Answer[];
  /** Summary after the client's edits */
  summary: Summary;
  contacts: Contacts;
  /** Original final message, including any extra notes alongside the contact */
  contactNote?: string;
  consent: true;
  page: string;
  utm: Record<string, string>;
}

export type SubmitResponse = { ok: true; id: string } | { ok: false; error: string };
