"use client";
import React from "react";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { STUDIO_EMAIL, STUDIO_TELEGRAM } from "../constants";
import { SERVICES, serviceFromQuery } from "../brief";
import { LIMITS, MAX_QUESTIONS, type Answer, type Question, type Summary } from "../intake/contract";
import { INTAKE_MOCK, PRIVACY_URL, nextStep, submitBrief } from "../intake/client";
import { CONTACT_LABEL, collectContacts, detectContact } from "../intake/contacts";
import { ThinkingAtom } from "../intake/ThinkingAtom";

const STORAGE_KEY = "sborka-intake-v1";
const EXAMPLES = [
  "Лендинг для запуска нового продукта к концу месяца",
  "AI-ассистент, который отвечает клиентам по нашему каталогу",
  "3D-конфигуратор кроссовок для промо бренда",
  "Личный кабинет для дилеров с заказами и остатками",
  "Связать сайт с amoCRM и отправлять заявки в Telegram",
];
const THINKING = {
  question: ["Читаю задачу", "Прикидываю формат", "Думаю, что уточнить"],
  summary: ["Собираю бриф", "Проверяю, что ничего не упустил"],
};

type Entry = { role: "client" | "studio"; text: string; muted?: boolean; animate?: boolean };
type Phase = "compose" | "dialog" | "summary" | "sent";
interface State {
  phase: Phase;
  sessionId: string;
  service: string | null;
  task: string;
  answers: Answer[];
  entries: Entry[];
  question: Question | null;
  summary: Summary | null;
  sentId: string;
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
  sentId: "",
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
      <ThinkingAtom />
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
  el.style.height = `${Math.min(el.scrollHeight, 240)}px`;
}

export function Intake() {
  const [s, setS] = React.useState<State>(initial);
  const [draft, setDraft] = React.useState("");
  const [thinking, setThinking] = React.useState<null | keyof typeof THINKING>(null);
  const [revealing, setRevealing] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [editing, setEditing] = React.useState(false);
  const [contacts, setContacts] = React.useState<string[]>([""]);
  const [consent, setConsent] = React.useState(false);
  const [sending, setSending] = React.useState(false);
  const [error, setError] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const input = React.useRef<HTMLTextAreaElement>(null);
  const end = React.useRef<HTMLDivElement>(null);
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
    const focusSoon = () =>
      window.setTimeout(() => input.current?.focus({ preventScroll: true }), 650);
    const clicked = (e: MouseEvent) => {
      const link = e.target instanceof Element ? e.target.closest<HTMLAnchorElement>('a[href*="#intake"]') : null;
      if (!link || link.origin !== location.origin) return;
      pick(link.search);
      focusSoon();
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
      const { entries, ...rest } = s;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...rest, entries: entries.map(({ animate, ...e }) => e) }));
    } catch {}
  }, [s, ready]);

  const scrolled = React.useRef(false);
  React.useEffect(() => {
    if (!scrolled.current) {
      scrolled.current = true;
      return;
    }
    end.current?.scrollIntoView({ block: "nearest", behavior: reduceMotion() ? "auto" : "smooth" });
  }, [s.entries.length, thinking, s.phase, revealing]);

  const ask = async (base: State, force: boolean) => {
    setThinking(force || base.answers.length >= MAX_QUESTIONS ? "summary" : "question");
    const res = await nextStep({
      schemaVersion: 1,
      sessionId: base.sessionId,
      service: base.service,
      task: base.task,
      answers: base.answers,
      forceSummary: force || base.answers.length >= MAX_QUESTIONS,
    });
    const added: Entry[] = [];
    if (res.message) added.push({ role: "studio", text: res.message, animate: true });
    if (res.type === "question") added.push({ role: "studio", text: res.question, animate: true });
    setThinking(null);
    setRevealing(added.length > 0 && !reduceMotion());
    setS((st) => {
      const entries = [...st.entries.map(({ animate, ...e }) => e), ...added];
      return res.type === "question"
        ? { ...st, entries, question: { question: res.question, options: res.options } }
        : { ...st, entries, question: null, summary: res.summary, phase: "summary" };
    });
  };

  const start = (e?: React.FormEvent) => {
    e?.preventDefault();
    const task = draft.trim().slice(0, LIMITS.task);
    if (!task || thinking) return;
    const next: State = {
      ...s,
      phase: "dialog",
      task,
      entries: [{ role: "client", text: task }],
    };
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

  const restart = () => {
    setS(initial());
    setDraft("");
    setEditing(false);
    setContacts([""]);
    setConsent(false);
    setError("");
    requestAnimationFrame(() => input.current?.focus());
  };

  const parsed = contacts.map(detectContact);
  const validContacts = parsed.filter(Boolean).length;

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!s.summary || sending) return;
    if (!validContacts) return setError("Оставьте email, Telegram или телефон, чтобы мы могли ответить");
    if (!consent) return setError("Нужно согласие на обработку контактов");
    setError("");
    setSending(true);
    const res = await submitBrief({
      schemaVersion: 1,
      sessionId: s.sessionId,
      service: s.service,
      task: s.task,
      answers: s.answers,
      summary: s.summary,
      contacts: collectContacts(contacts),
      consent: true,
      page: location.href,
      utm: Object.fromEntries([...new URLSearchParams(location.search)].filter(([k]) => k.startsWith("utm_"))),
    });
    setSending(false);
    if (res.ok) setS((st) => ({ ...st, phase: "sent", sentId: res.id }));
    else setError("Не получилось отправить. Попробуйте еще раз через минуту, текст заявки сохранен");
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

  const composing = s.phase === "compose";
  const answering = s.phase === "dialog" && !!s.question && !thinking;
  const lastAnimated = s.entries.map((e) => !!e.animate).lastIndexOf(true);
  // Entries of one reply reveal one after another
  const delays: number[] = [];
  s.entries.reduce((acc, e, i) => {
    if (!e.animate) return 0;
    delays[i] = acc;
    return acc + e.text.split(" ").length * 38 + 350;
  }, 0);
  const optionsVisible = answering && !revealing;

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

          <div className={`chat-intake is-${s.phase}`}>
            {!composing && (
              <div className="ci-head">
                <span>
                  {s.phase === "sent"
                    ? "Бриф готов"
                    : s.phase === "summary"
                      ? "Проверьте бриф"
                      : `Уточнение ${Math.min(s.answers.length + 1, MAX_QUESTIONS)}`}
                </span>
                <button type="button" className="ci-link" onClick={restart}>
                  Начать заново
                </button>
              </div>
            )}

            {!composing && (
              <ol className="ci-log" aria-live="polite">
                {s.entries.map((e, i) => (
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
                ))}
                {thinking && <Thinking kind={thinking} />}
              </ol>
            )}

            {optionsVisible && s.question && (
              <div className="ci-options" role="group" aria-label="Варианты ответа">
                {s.question.options.map((o, i) => (
                  <button key={o} type="button" style={{ animationDelay: `${i * 60}ms` }} onClick={() => answer(o)}>
                    {o}
                  </button>
                ))}
              </div>
            )}

            {(composing || s.phase === "dialog") && (
              <form
                className={`ci-bar${thinking || revealing ? " is-busy" : ""}`}
                onSubmit={(e) => {
                  e.preventDefault();
                  if (composing) start();
                  else answer(draft);
                }}
              >
                <textarea
                  ref={input}
                  rows={1}
                  value={draft}
                  maxLength={composing ? LIMITS.task : LIMITS.answer}
                  aria-label={composing ? "Опишите задачу" : "Свой ответ"}
                  placeholder={composing ? placeholder : "Или напишите свой ответ"}
                  disabled={!composing && !answering}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    autosize(e.target);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      e.currentTarget.form?.requestSubmit();
                    }
                  }}
                />
                <button type="submit" disabled={!draft.trim() || !!thinking || (!composing && !answering)} aria-label="Отправить">
                  <SendIcon />
                </button>
              </form>
            )}

            {composing && (
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

            {s.phase === "dialog" && (
              <div className="ci-actions">
                <button type="button" className="ci-link" disabled={!answering || revealing} onClick={() => answer("")}>
                  Пропустить вопрос
                </button>
                {s.answers.length > 0 && (
                  <button type="button" className="ci-link" disabled={!answering || revealing} onClick={() => answer("", true)}>
                    Сразу к итогу
                  </button>
                )}
              </div>
            )}

            {s.phase === "summary" && s.summary && !revealing && (
              <div className="ci-brief">
                <div className="ci-card">
                  <div className="ci-card-head">
                    <h3>{s.summary.title}</h3>
                    <button type="button" className="ci-link" onClick={() => setEditing((v) => !v)}>
                      {editing ? "Готово" : "Изменить"}
                    </button>
                  </div>
                  <dl>
                    {s.summary.items.map((it, i) => (
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
                                editItem(i, e.target.value);
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
                </div>

                <form className="ci-contact" onSubmit={send} noValidate>
                  <h3>Куда прислать оценку?</h3>
                  {contacts.map((c, i) => {
                    const kind = parsed[i]?.kind;
                    return (
                      <label key={i} className="ci-field">
                        <span className="sr-only">Контакт {i + 1}</span>
                        <input
                          value={c}
                          maxLength={LIMITS.contact}
                          autoComplete={i === 0 ? "email" : "off"}
                          placeholder="Email, @telegram или телефон"
                          onChange={(e) => {
                            const next = contacts.slice();
                            next[i] = e.target.value;
                            setContacts(next);
                            setError("");
                          }}
                        />
                        <span className={`ci-kind${kind ? " is-on" : ""}`}>{kind ? CONTACT_LABEL[kind] : " "}</span>
                      </label>
                    );
                  })}
                  {contacts.length < 3 && parsed[contacts.length - 1] && (
                    <button type="button" className="ci-link" onClick={() => setContacts([...contacts, ""])}>
                      + Еще способ связи
                    </button>
                  )}
                  <label className="ci-consent">
                    <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                    <span>
                      Согласен на обработку контактов для ответа по заявке
                      {PRIVACY_URL && (
                        <>
                          {" "}
                          <a href={PRIVACY_URL} target="_blank" rel="noreferrer">
                            Политика
                          </a>
                        </>
                      )}
                    </span>
                  </label>
                  <div className="ci-submit">
                    <button type="submit" className="action action-primary" disabled={sending}>
                      {sending ? "Отправляем" : "Отправить заявку"} <Arrow />
                    </button>
                    {sending && <ThinkingAtom size={26} />}
                  </div>
                  <p className="ci-error" role="alert">
                    {error}
                  </p>
                </form>
              </div>
            )}

            {s.phase === "sent" && s.summary && (
              <div className="ci-done" role="status">
                <span className="ci-done-mark" aria-hidden="true">
                  <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="m5 12.5 4.5 4.5L19 7.5" />
                  </svg>
                </span>
                <div>
                  <h3>{INTAKE_MOCK ? "Бриф собран" : "Заявка у нас"}</h3>
                  <p>
                    {INTAKE_MOCK
                      ? "Тестовый режим: заявка сохранена в этом браузере и никуда не отправлена"
                      : "Изучим задачу и напишем вам с оценкой и вопросами"}
                  </p>
                </div>
              </div>
            )}
            <div ref={end} className="ci-end" />
          </div>
        </div>
      </Container>
    </section>
  );
}
