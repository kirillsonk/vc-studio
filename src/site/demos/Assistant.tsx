"use client";
import React from "react";

/**
 * Scripted AI assistant demo. Answers are prepared in advance and matched by keywords;
 * the interface says so. When the owner approves the format, `answer` is replaced by a call
 * to a real model behind a server route.
 */
const SCRIPT: Array<{ q: string; keys: string[]; a: string }> = [
  {
    q: "Сколько стоит проект?",
    keys: ["стоит", "цена", "стоимость", "бюджет", "сколько"],
    a: "Считаем по задаче. Дизайн и ведение проекта фиксируем до старта, а код оплачивается по фактическому расходу токенов AI. Опишите проект в форме ниже, и мы пришлем оценку",
  },
  {
    q: "Как быстро сделаете?",
    keys: ["быстро", "срок", "сроки", "когда", "долго"],
    a: "Первую рабочую версию показываем в первые дни. Точный срок всего проекта называем после разбора задачи, когда понятен объем",
  },
  {
    q: "Что такое вайбкодинг?",
    keys: ["вайб", "vibe", "как работаете", "ai пишет"],
    a: "Это разработка, где код пишет AI, а мы ставим задачи, проверяем решения и доводим продукт до запуска. Ручной работы меньше, поэтому быстрее и дешевле",
  },
  {
    q: "Сделаете такого ассистента нам?",
    keys: ["ассистент", "бот", "нам", "такого", "агент"],
    a: "Да. Подключим ассистента к вашим данным через MCP и API: он будет отвечать по вашим документам, принимать заявки и передавать их в CRM",
  },
  {
    q: "Работаете с агентствами?",
    keys: ["агентств", "макет", "подряд"],
    a: "Да. Собираем проекты по макетам и ТЗ агентства и успеваем к старту кампании",
  },
];
const FALLBACK =
  "Это демо с заготовленными ответами, поэтому на такой вопрос ответа нет. Выберите вопрос ниже или оставьте заявку, ответим лично";
const GREETING = "Здравствуйте. Я ассистент студии Сборка. Спросите про стоимость, сроки или то, как мы работаем";

function answer(text: string) {
  const t = text.toLowerCase();
  return SCRIPT.find((s) => s.keys.some((k) => t.includes(k)))?.a ?? FALLBACK;
}

type Message = { role: "user" | "bot"; text: string; done: boolean };

export function Assistant() {
  const [messages, setMessages] = React.useState<Message[]>([{ role: "bot", text: GREETING, done: true }]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const list = React.useRef<HTMLDivElement>(null);
  const timers = React.useRef<number[]>([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);
  React.useEffect(() => {
    list.current?.scrollTo({ top: list.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const ask = (question: string) => {
    const q = question.trim();
    if (!q || busy) return;
    setBusy(true);
    setInput("");
    const reply = answer(q);
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    setMessages((m) => [...m, { role: "user", text: q, done: true }, { role: "bot", text: "", done: false }]);
    // A short pause, then the reply appears word by word, like a streamed model answer
    const words = reply.split(" ");
    const startAt = reduce ? 0 : 650;
    words.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          const last = i === words.length - 1;
          setMessages((m) => {
            const next = m.slice();
            next[next.length - 1] = { role: "bot", text: words.slice(0, i + 1).join(" "), done: last };
            return next;
          });
          if (last) setBusy(false);
        }, reduce ? 0 : startAt + i * 45),
      );
    });
  };

  const asked = new Set(messages.filter((m) => m.role === "user").map((m) => m.text));
  return (
    <div className="assistant">
      <div className="assistant-head">
        <span className="assistant-avatar" aria-hidden="true" />
        <div>
          <strong>Ассистент студии</strong>
          <span>Демо: ответы заготовлены заранее</span>
        </div>
      </div>
      <div className="assistant-log" ref={list} aria-live="polite">
        {messages.map((m, i) => (
          <div key={i} className={`assistant-msg assistant-${m.role}`}>
            {m.text || <span className="assistant-typing" aria-label="Печатает"><i /><i /><i /></span>}
          </div>
        ))}
      </div>
      <div className="assistant-suggest">
        {SCRIPT.filter((s) => !asked.has(s.q)).slice(0, 3).map((s) => (
          <button key={s.q} type="button" onClick={() => ask(s.q)} disabled={busy}>
            {s.q}
          </button>
        ))}
      </div>
      <form
        className="assistant-input"
        onSubmit={(e) => {
          e.preventDefault();
          ask(input);
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Задайте вопрос"
          aria-label="Вопрос ассистенту"
          maxLength={200}
        />
        <button type="submit" disabled={busy || !input.trim()} aria-label="Отправить">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 19V5m-6 6 6-6 6 6" /></svg>
        </button>
      </form>
    </div>
  );
}
