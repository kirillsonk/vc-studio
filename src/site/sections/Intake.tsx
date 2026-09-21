"use client";
import React from "react";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { STUDIO_EMAIL, STUDIO_TELEGRAM } from "../constants";
const SERVICES = [
  "Промо-сайт",
  "Игра или спецпроект",
  "3D и интерактив",
  "Production для агентства",
  "Пока выбираем",
];
const STORAGE_KEY = "vc-studio-brief-v2";
interface Draft {
  service: string;
  details: string;
  deadline: string;
  budget: string;
}
const EMPTY: Draft = {
  service: SERVICES[0],
  details: "",
  deadline: "Срок гибкий",
  budget: "Нужна оценка",
};
function isDraft(value: unknown): value is Draft {
  if (!value || typeof value !== "object") return false;
  const v = value as Draft;
  return (
    SERVICES.includes(v.service) &&
    ["details", "deadline", "budget"].every(
      (k) => typeof v[k as keyof Draft] === "string",
    )
  );
}
export function Intake() {
  const [step, setStep] = React.useState(0);
  const [draft, setDraft] = React.useState<Draft>(EMPTY);
  const [ready, setReady] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const heading = React.useRef<HTMLLegendElement>(null);
  React.useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (isDraft(saved)) setDraft(saved);
    } catch {
      /* Storage is optional */
    }
    const pickService = () => {
      const index = new URLSearchParams(window.location.search).get("service");
      if (index !== null && /^[0-3]$/.test(index)) {
        setDraft((d) => ({ ...d, service: SERVICES[Number(index)] }));
        setStep(0);
      }
    };
    pickService();
    window.addEventListener("popstate", pickService);
    window.addEventListener("hashchange", pickService);
    // Next navigation updates the query before the intake anchor receives focus.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element).closest?.('a[href*="service="]');
      if (link) {
        const index = new URL(
          link.getAttribute("href")!,
          window.location.origin,
        ).searchParams.get("service");
        if (index !== null && /^[0-3]$/.test(index)) {
          setDraft((d) => ({ ...d, service: SERVICES[Number(index)] }));
          setStep(0);
        }
      }
    };
    document.addEventListener("click", onClick);
    setReady(true);
    return () => {
      window.removeEventListener("popstate", pickService);
      window.removeEventListener("hashchange", pickService);
      document.removeEventListener("click", onClick);
    };
  }, []);
  React.useEffect(() => {
    if (ready)
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch {}
  }, [draft, ready]);
  const change = (key: keyof Draft, value: string) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setStatus("");
  };
  const move = (n: number) => {
    setStep(n);
    setStatus("");
    requestAnimationFrame(() => heading.current?.focus());
  };
  const summary = `Бриф для VC Studio\n\nФормат: ${draft.service}\nЗадача: ${draft.details || "Обсудим вместе"}\nЖелаемый срок: ${draft.deadline}\nОриентир по бюджету: ${draft.budget}\n\nСтоимость и срок подтверждаются после оценки задачи командой.`;
  const download = () => {
    const url = URL.createObjectURL(
      new Blob([summary], { type: "text/plain;charset=utf-8" }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "vc-studio-brief.txt";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setStatus("Бриф подготовлен для скачивания. Это не отправка заявки");
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Бриф скопирован — его можно отправить студии");
    } catch {
      setStatus("Не удалось скопировать. Скачайте бриф файлом");
    }
  };
  return (
    <section id="intake" className="editorial-section intake-section">
      <Container>
        <div className="section-kicker">
          <span>06 / Начнем с вашей идеи</span>
        </div>
        <div className="intake-shell">
          <div className="intake-aside">
            <h2>
              Что создадим
              <br />
              вместе?
            </h2>
            <p>
              Можно без ТЗ. Несколько деталей помогут нам понять задачу и
              оценить объем работы
            </p>
            <ol className="brief-steps">
              {["Формат", "Детали", "Бриф"].map((s, i) => (
                <li key={s} aria-current={step === i ? "step" : undefined}>
                  0{i + 1} {s}
                </li>
              ))}
            </ol>
            <div className="intake-contact">
              {STUDIO_TELEGRAM && (
                <a
                  className="text-link"
                  href={`https://t.me/${STUDIO_TELEGRAM.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Сразу в Telegram <Arrow diagonal />
                </a>
              )}
              {STUDIO_EMAIL && (
                <a className="text-link" href={`mailto:${STUDIO_EMAIL}`}>
                  {STUDIO_EMAIL} <Arrow diagonal />
                </a>
              )}
            </div>
          </div>
          <form
            className="brief-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (step < 2) move(step + 1);
            }}
          >
            <fieldset>
              <legend ref={heading} tabIndex={-1}>
                {
                  [
                    "Что хотите запустить?",
                    "Расскажите о задаче",
                    "Ваш проект — в одном брифе",
                  ][step]
                }
              </legend>
              {step === 0 && (
                <div className="brief-options">
                  {SERVICES.map((s) => (
                    <label className="brief-choice" key={s}>
                      <input
                        type="radio"
                        name="service"
                        value={s}
                        checked={draft.service === s}
                        onChange={() => change("service", s)}
                      />
                      <span>{s}</span>
                    </label>
                  ))}
                </div>
              )}
              {step === 1 && (
                <div className="brief-fields">
                  <label className="brief-field full">
                    Что должно получиться?
                    <textarea
                      value={draft.details}
                      onChange={(e) => change("details", e.target.value)}
                      maxLength={3000}
                      placeholder="Для кого проект, какую задачу решает, что уже готово"
                    />
                  </label>
                  <label className="brief-field">
                    Желаемый срок
                    <select
                      value={draft.deadline}
                      onChange={(e) => change("deadline", e.target.value)}
                    >
                      <option>Срок гибкий</option>
                      <option>До 2 недель</option>
                      <option>В течение месяца</option>
                      <option>Есть конкретная дата</option>
                    </select>
                  </label>
                  <label className="brief-field">
                    Ориентир по бюджету
                    <select
                      value={draft.budget}
                      onChange={(e) => change("budget", e.target.value)}
                    >
                      <option>Нужна оценка</option>
                      <option>100–200 тыс. ₽</option>
                      <option>200–500 тыс. ₽</option>
                      <option>От 500 тыс. ₽</option>
                    </select>
                  </label>
                </div>
              )}
              {step === 2 && (
                <dl className="brief-summary">
                  {[
                    ["Формат", draft.service],
                    ["Задача", draft.details || "Обсудим вместе"],
                    ["Срок", draft.deadline],
                    ["Бюджет", draft.budget],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </fieldset>
            <div className="brief-footer">
              {step > 0 && (
                <button
                  className="brief-back"
                  type="button"
                  onClick={() => move(step - 1)}
                >
                  Назад
                </button>
              )}
              {step < 2 ? (
                <button type="submit" className="action action-primary">
                  {step === 0 ? "Дальше" : "Собрать бриф"}
                  <Arrow />
                </button>
              ) : (
                <>
                  {STUDIO_EMAIL && (
                    <a
                      className="action action-primary"
                      href={`mailto:${STUDIO_EMAIL}?subject=${encodeURIComponent("Проект для VC Studio")}&body=${encodeURIComponent(summary)}`}
                    >
                      Открыть письмо
                      <Arrow diagonal />
                    </a>
                  )}
                  {STUDIO_TELEGRAM && (
                    <a
                      className="action action-primary"
                      href={`https://t.me/${STUDIO_TELEGRAM.replace("@", "")}?text=${encodeURIComponent(summary)}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Передать бриф в Telegram
                      <Arrow diagonal />
                    </a>
                  )}
                  <button
                    type="button"
                    className={
                      STUDIO_EMAIL || STUDIO_TELEGRAM
                        ? "brief-back"
                        : "action action-primary"
                    }
                    onClick={download}
                  >
                    Скачать бриф
                  </button>
                  <button type="button" className="brief-back" onClick={copy}>
                    Скопировать
                  </button>
                </>
              )}
            </div>
            <p className="brief-note">
              {step === 2
                ? "Стоимость и срок подтвердим после разбора задачи. Бриф не отправляется автоматически"
                : "Ответы сохраняются в этой вкладке. Можно вернуться и изменить их"}
            </p>
            <p className="brief-status" role="status">
              {status}
            </p>
          </form>
        </div>
      </Container>
    </section>
  );
}
