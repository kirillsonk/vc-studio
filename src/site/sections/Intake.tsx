"use client";
import React from "react";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { STUDIO_EMAIL, STUDIO_TELEGRAM } from "../constants";
import { SERVICES, serviceFromQuery } from "../brief";
import { LIMITS, MAX_QUESTIONS, type Answer, type Question, type Summary } from "../intake/contract";
import { INTAKE_MOCK, PRIVACY_URL, nextStep, submitBrief } from "../intake/client";
import { CONTACT_LABEL, collectContacts, splitContacts } from "../intake/contacts";
import { ThinkingAtom } from "../intake/ThinkingAtom";

const STORAGE_KEY = "sborka-intake-v2";
const EXAMPLES = [
  "Лендинг для запуска нового продукта к концу месяца",
  "AI-ассистент, который отвечает клиентам по нашему каталогу",
  "3D-конфигуратор кроссовок для промо бренда",
  "Личный кабинет для дилеров с заказами и остатками",
  "Связать сайт с amoCRM и отправлять заявки в Telegram",
];
const GREETING = "Расскажите, что хотите сделать. Можно в двух словах, детали уточню сам";
const CONTACT_QUESTION = "Куда прислать оценку? Оставьте email, Telegram или телефон, как вам удобнее";
const THINKING = {
  question: ["Читаю задачу", "Прикидываю формат", "Думаю, что уточнить"],
  summary: ["Собираю бриф", "Проверяю, что ничего не упустил"],
  send: ["Отправляю бриф"],
};

type Entry = { role: "client" | "studio"; text: string; kind?: "summary"; muted?: boolean; animate?: boolean };
type Phase = "compose" | "dialog" | "contact" | "sent";
interface State {
  phase: Phase;
  sessionId: string;
  service: string | null;
  task: string;
  answers: Answer[];
  entries: Entry[];
  question: Question | null;
  summary: Summary | null;
}
const initial = (): State => ({
  phase: "compose",
  sessionId:
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2) + Date.now().toString(36),
  service: null,
  task: "",
  answers: [],
  entries: [],
  question: null,
  summary: null,
});

const reduceMotion = () =>
  typeof window !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;

/** Types and erases example tasks while the field is empty and not focused */
function useTypingPlaceholder(active: boolean) {
  const [text, setText] = React.useState(EXAMPLES[0]);
  React.useEffect(() => {
    if (!active || reduceMotion()) return;
    let example = 0;
    let chars = EXAMPLES[0].length;
    let erasing = true;
    let timer = 0;
    const tick = () => {
      const full = EXAMPLES[example];
      if (erasing) {
        chars -= 2;
        if (chars <= 0) {
          erasing = false;
          example = (example + 1) % EXAMPLES.length;
          chars = 0;
        }
      } else if (chars < EXAMPLES[example].length) chars += 1;
      setText((erasing ? full : EXAMPLES[example]).slice(0, Math.max(0, chars)));
      const done = !erasing && chars >= EXAMPLES[example].length;
      if (done) erasing = true;
      timer = window.setTimeout(tick, done ? 2200 : erasing ? 18 : 42);
    };
    timer = window.setTimeout(tick, 2200);
    return () => clearTimeout(timer);
  }, [active]);
  return text;
}

/** Studio replies appear word by word, like a streamed model answer */
function Reveal({ text, animate, delay = 0, onDone }: { text: string; animate?: boolean; delay?: number; onDone?: () => void }) {
  const words = React.useMemo(() => text.split(" "), [text]);
  const [shown, setShown] = React.useState(animate && !reduceMotion() ? 0 : words.length);
  React.useEffect(() => {
    if (shown >= words.length) {
      onDone?.();
      return;
    }
    const t = window.setTimeout(() => setShown((n) => n + 1), shown === 0 ? delay : 38);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shown, words.length]);
  return <>{words.slice(0, shown).join(" ")}</>;
}

function Thinking({ kind }: { kind: keyof typeof THINKING }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    const t = window.setInterval(() => setI((n) => Math.min(n + 1, THINKING[kind].length - 1)), 1300);
    return () => clearInterval(t);
  }, [kind]);
  return (
    <li className="ci-thinking" role="status">
      <ThinkingAtom size={26} />
      <span className="ci-shimmer" key={i}>{THINKING[kind][i]}</span>
    </li>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M12 19V5m-6 6 6-6 6 6" />
    </svg>
  );
}

function autosize(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
}

function SummaryCard({
  summary,
  editable,
  onEdit,
  delay,
}: {
  summary: Summary;
  editable: boolean;
  onEdit: (i: number, value: string) => void;
  delay?: number;
}) {
  const [editing, setEditing] = React.useState(false);
  React.useEffect(() => {
    if (!editable) setEditing(false);
  }, [editable]);
  return (
    <li className="ci-card" style={{ animationDelay: `${delay ?? 0}ms` }}>
      <div className="ci-card-head">
        <h3>{summary.title}</h3>
        {editable && (
          <button type="button" className="ci-link" onClick={() => setEditing((v) => !v)}>
            {editing ? "Готово" : "Изменить"}
          </button>
        )}
      </div>
      <dl>
        {summary.items.map((it, i) => (
          <div key={it.label}>
            <dt>{it.label}</dt>
            <dd>
              {editing ? (
                <textarea
                  rows={1}
                  value={it.value}
                  aria-label={it.label}
                  ref={autosize}
                  onChange={(e) => {
                    onEdit(i, e.target.value);
                    autosize(e.target);
                  }}
                />
              ) : (
                it.value
              )}
            </dd>
          </div>
        ))}
      </dl>
    </li>
  );
}

export function Intake() {
  const [s, setS] = React.useState<State>(initial);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState<null | keyof typeof THINKING>(null);
  const [revealing, setRevealing] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [hint, setHint] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const input = React.useRef<HTMLTextAreaElement>(null);
  const log = React.useRef<HTMLOListElement>(null);
  const placeholder = useTypingPlaceholder(s.phase === "compose" && !focused && !draft);

  // Restore the dialog of this tab and react to service links and CTA clicks
  React.useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (saved?.sessionId && saved.phase) setS({ ...initial(), ...saved });
    } catch {}
    const pick = (search: string) => {
      const service = serviceFromQuery(search);
      if (service) setS((st) => (st.phase === "compose" ? { ...st, service } : st));
    };
    pick(location.search);
    const clicked = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href*="#intake"]') : null;
      if (!link || link.origin !== location.origin) return;
      pick(link.search);
      window.setTimeout(() => input.current?.focus({ preventScroll: true }), 650);
    };
    const popped = () => pick(location.search);
    document.addEventListener("click", clicked);
    window.addEventListener("popstate", popped);
    setReady(true);
    return () => {
      document.removeEventListener("click", clicked);
      window.removeEventListener("popstate", popped);
    };
  }, []);

  React.useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, entries: s.entries.map(({ animate, ...e }) => e) }));
    } catch {}
  }, [s, ready]);

  // The chat scrolls inside its own window, the page stays put
  React.useEffect(() => {
    const el = log.current;
    if (!el) return;
    const follow = () => el.scrollTo({ top: el.scrollHeight, behavior: reduceMotion() ? "auto" : "smooth" });
    follow();
    if (!revealing) return;
    const t = window.setInterval(follow, 250);
    return () => clearInterval(t);
  }, [s.entries.length, thinking, revealing]);

  const push = (added: Entry[]) => {
    setRevealing(added.some((e) => e.animate) && !reduceMotion());
    return (entries: Entry[]) => [...entries.map(({ animate, ...e }) => e), ...added];
  };

  const ask = async (base: State, force: boolean) => {
    const final = force || base.answers.length >= MAX_QUESTIONS;
    setThinking(final ? "summary" : "question");
    const res = await nextStep({
      schemaVersion: 1,
      sessionId: base.sessionId,
      service: base.service,
      task: base.task,
      answers: base.answers,
      forceSummary: final,
    });
    setThinking(null);
    const added: Entry[] = [];
    if (res.message) added.push({ role: "studio", text: res.message, animate: true });
    if (res.type === "question") {
      added.push({ role: "studio", text: res.question, animate: true });
      const next = push(added);
      setS((st) => ({ ...st, entries: next(st.entries), question: { question: res.question, options: res.options } }));
    } else {
      added.push({ role: "studio", text: "", kind: "summary", animate: true });
      added.push({ role: "studio", text: CONTACT_QUESTION, animate: true });
      const next = push(added);
      setS((st) => ({ ...st, entries: next(st.entries), question: null, summary: res.summary, phase: "contact" }));
    }
  };

  const start = () => {
    const task = draft.trim().slice(0, LIMITS.task);
    if (!task || thinking) return;
    const next: State = { ...s, phase: "dialog", task, entries: [{ role: "client", text: task }] };
    setS(next);
    setDraft("");
    requestAnimationFrame(() => autosize(input.current));
    ask(next, false);
  };

  const answer = (text: string, force = false) => {
    if (!s.question || thinking || revealing) return;
    const value = text.trim().slice(0, LIMITS.answer);
    const next: State = {
      ...s,
      question: null,
      answers: [...s.answers, { question: s.question.question, answer: value }],
      entries: [...s.entries, { role: "client", text: value || "Пропускаю", muted: !value }],
    };
    setS(next);
    setDraft("");
    requestAnimationFrame(() => autosize(input.current));
    ask(next, force);
  };

  const sendContact = async () => {
    if (!s.summary || thinking || revealing) return;
    const found = splitContacts(draft);
    if (!found.length) {
      setHint("Не похоже на email, Telegram или телефон. Проверьте, пожалуйста");
      return;
    }
    const text = draft.trim().slice(0, LIMITS.contact);
    setHint("");
    setDraft("");
    setS((st) => ({ ...st, entries: [...st.entries.map(({ animate, ...e }) => e), { role: "client", text }] }));
    setThinking("send");
    const res = await submitBrief({
      schemaVersion: 1,
      sessionId: s.sessionId,
      service: s.service,
      task: s.task,
      answers: s.answers,
      summary: s.summary,
      contacts: collectContacts(found.map((c) => c.value)),
      consent: true,
      page: location.href,
      utm: Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("utm_"))),
    });
    setThinking(null);
    if (res.ok) {
      const where = found[0].kind === "telegram" ? "в Telegram" : found[0].kind === "email" ? "на почту" : "по телефону";
      const next = push([
        {
          role: "studio",
          text: INTAKE_MOCK
            ? "Готово, бриф собран. Сейчас сайт в тестовом режиме, поэтому заявка пока никуда не ушла"
            : `Готово, бриф у нас. Свяжемся ${where} с оценкой и вопросами`,
          animate: true,
        },
      ]);
      setS((st) => ({ ...st, entries: next(st.entries), phase: "sent" }));
    } else {
      const next = push([
        { role: "studio", text: "Не получилось отправить. Попробуйте еще раз через минуту, бриф сохранен", animate: true },
      ]);
      setS((st) => ({ ...st, entries: next(st.entries) }));
      setDraft(text);
    }
  };

  const restart = () => {
    setS(initial());
    setDraft("");
    setHint("");
    requestAnimationFrame(() => input.current?.focus());
  };

  const editItem = (i: number, value: string) =>
    setS((st) =>
      st.summary
        ? {
            ...st,
            summary: {
              ...st.summary,
              items: st.summary.items.map((it, j) => (j === i ? { ...it, value: value.slice(0, LIMITS.summaryValue) } : it)),
            },
          }
        : st,
    );

  const { phase } = s;
  const busy = !!thinking || revealing;
  const lastAnimated = s.entries.map((e) => !!e.animate).lastIndexOf(true);
  // Entries of one reply reveal one after another
  const delays: number[] = [];
  s.entries.reduce((acc, e, i) => {
    if (!e.animate) return 0;
    delays[i] = acc;
    return acc + (e.kind ? 500 : e.text.split(" ").length * 38 + 350);
  }, 0);
  const detected = phase === "contact" ? splitContacts(draft) : [];
  const status =
    thinking === "send"
      ? "Отправляет бриф"
      : thinking
        ? "Думает"
        : phase === "compose"
          ? "Разберет задачу и соберет бриф"
          : phase === "dialog"
            ? "Уточняет детали"
            : phase === "contact"
              ? "Бриф готов"
              : INTAKE_MOCK
                ? "Бриф собран"
                : "Бриф отправлен";

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phase === "compose") start();
    else if (phase === "dialog") answer(draft);
    else if (phase === "contact") sendContact();
  };

  return (
    <section id="intake" className="editorial-section intake-section">
      <Container>
        <div className="section-kicker">
          <span>Новый проект</span>
        </div>
        <div className="intake-shell">
          <div className="intake-aside">
            <h2>
              Расскажите,
              <br />
              что хотите сделать
            </h2>
            <p>Пара слов о задаче. AI задаст несколько уточнений и соберет бриф, а мы вернемся с оценкой</p>
            <div className="intake-contact">
              {STUDIO_TELEGRAM && (
                <a className="text-link" href={`https://t.me/${STUDIO_TELEGRAM.replace("@", "")}`} target="_blank" rel="noreferrer">
                  Написать в Telegram <Arrow diagonal />
                </a>
              )}
              {STUDIO_EMAIL && (
                <a className="text-link" href={`mailto:${STUDIO_EMAIL}`}>
                  {STUDIO_EMAIL} <Arrow diagonal />
                </a>
              )}
            </div>
          </div>

          <div className="ci-window">
            <div className="ci-head">
              <span className="assistant-avatar" aria-hidden="true">
                <ThinkingAtom size={30} still={!thinking} />
              </span>
              <div className="ci-head-title">
                <strong>Ассистент Сборки</strong>
                <span>{status}</span>
              </div>
              {phase !== "compose" && (
                <button type="button" className="ci-link" onClick={restart}>
                  Начать заново
                </button>
              )}
            </div>

            <ol className="ci-log" ref={log} aria-live="polite">
              <li className="ci-msg ci-studio">{GREETING}</li>
              {s.entries.map((e, i) =>
                e.kind === "summary" && s.summary ? (
                  <SummaryCard key={i} summary={s.summary} editable={phase === "contact" && !busy} onEdit={editItem} delay={e.animate ? delays[i] : 0} />
                ) : (
                  <li key={i} className={`ci-msg ci-${e.role}${e.muted ? " is-muted" : ""}`}>
                    {i === 0 && s.service && <span className="ci-tag">{s.service}</span>}
                    {e.role === "studio" ? (
                      <Reveal
                        text={e.text}
                        animate={e.animate}
                        delay={delays[i]}
                        onDone={i === lastAnimated ? () => setRevealing(false) : undefined}
                      />
                    ) : (
                      e.text
                    )}
                  </li>
                ),
              )}
              {thinking && <Thinking kind={thinking} />}
            </ol>

            <div className="ci-foot">
              {phase === "dialog" && s.question && !busy && (
                <div className="ci-options" role="group" aria-label="Варианты ответа">
                  {s.question.options.map((o, i) => (
                    <button key={o} type="button" style={{ animationDelay: `${i * 60}ms` }} onClick={() => answer(o)}>
                      {o}
                    </button>
                  ))}
                </div>
              )}
              {phase === "compose" && (
                <div className="ci-chips" role="group" aria-label="Формат проекта">
                  {SERVICES.map((name) => (
                    <button
                      key={name}
                      type="button"
                      aria-pressed={s.service === name}
                      onClick={() => setS((st) => ({ ...st, service: st.service === name ? null : name }))}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}

              {phase !== "sent" ? (
                <form className={`ci-bar${busy ? " is-busy" : ""}`} onSubmit={submit}>
                  <textarea
                    ref={input}
                    rows={1}
                    value={draft}
                    maxLength={phase === "compose" ? LIMITS.task : phase === "contact" ? LIMITS.contact : LIMITS.answer}
                    aria-label={phase === "compose" ? "Опишите задачу" : phase === "contact" ? "Email, Telegram или телефон" : "Свой ответ"}
                    placeholder={
                      phase === "compose" ? placeholder : phase === "contact" ? "Email, @telegram или телефон" : "Или напишите свой ответ"
                    }
                    autoComplete={phase === "contact" ? "email" : "off"}
                    disabled={phase !== "compose" && busy}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    onChange={(e) => {
                      setDraft(e.target.value);
                      setHint("");
                      autosize(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                        e.preventDefault();
                        e.currentTarget.form?.requestSubmit();
                      }
                    }}
                  />
                  {detected.length > 0 && (
                    <span className="ci-kind">{detected.map((c) => CONTACT_LABEL[c.kind]).join(" и ")}</span>
                  )}
                  <button type="submit" disabled={!draft.trim() || busy} aria-label="Отправить">
                    <SendIcon />
                  </button>
                </form>
              ) : (
                <div className="ci-done">
                  <span>Хотите обсудить еще одну задачу?</span>
                  <button type="button" className="ci-link" onClick={restart}>
                    Новый проект
                  </button>
                </div>
              )}

              {phase === "dialog" && (
                <div className="ci-actions">
                  <button type="button" className="ci-link" disabled={!s.question || busy} onClick={() => answer("")}>
                    Пропустить вопрос
                  </button>
                  {s.answers.length > 0 && (
                    <button type="button" className="ci-link" disabled={!s.question || busy} onClick={() => answer("", true)}>
                      Сразу к итогу
                    </button>
                  )}
                </div>
              )}
              {phase === "contact" && (
                <p className={`ci-note${hint ? " is-error" : ""}`} role={hint ? "alert" : undefined}>
                  {hint || (
                    <>
                      Отправляя контакт, вы соглашаетесь на его обработку для ответа по заявке
                      {PRIVACY_URL && (
                        <>
                          {". "}
                          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
                            Политика
                          </a>
                        </>
                      )}
                    </>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
