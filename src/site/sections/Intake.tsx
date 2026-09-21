"use client";
import React from "react";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { STUDIO_EMAIL, STUDIO_TELEGRAM } from "../constants";
import {
  BRIEF_STORAGE_KEY,
  EMPTY_BRIEF,
  readBrief,
  serviceFromQuery,
  type BriefDraft,
} from "../brief";

export function Intake() {
  const [draft, setDraft] = React.useState<BriefDraft>(EMPTY_BRIEF);
  const [review, setReview] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [status, setStatus] = React.useState("");
  const heading = React.useRef<HTMLHeadingElement>(null);
  const textarea = React.useRef<HTMLTextAreaElement>(null);
  React.useEffect(() => {
    try {
      const saved = readBrief(
        JSON.parse(sessionStorage.getItem(BRIEF_STORAGE_KEY) || "null"),
      );
      if (saved) setDraft(saved);
    } catch {
      /* Draft storage is optional. */
    }
    const selectService = (search: string) => {
      const service = serviceFromQuery(search);
      if (service) {
        setDraft((d) => ({ ...d, service }));
        setReview(false);
      }
    };
    selectService(window.location.search);
    const navigate = () => selectService(window.location.search);
    const clicked = (e: MouseEvent) => {
      const link =
        e.target instanceof Element
          ? e.target.closest<HTMLAnchorElement>('a[href*="service="]')
          : null;
      if (link && link.origin === location.origin) selectService(link.search);
    };
    window.addEventListener("popstate", navigate);
    window.addEventListener("hashchange", navigate);
    document.addEventListener("click", clicked);
    setReady(true);
    return () => {
      window.removeEventListener("popstate", navigate);
      window.removeEventListener("hashchange", navigate);
      document.removeEventListener("click", clicked);
    };
  }, []);
  React.useEffect(() => {
    if (ready)
      try {
        sessionStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(draft));
      } catch {}
  }, [draft, ready]);
  const change = (
    key: keyof Omit<BriefDraft, "schemaVersion">,
    value: string,
  ) => {
    setDraft((d) => ({ ...d, [key]: value }));
    setStatus("");
  };
  const save = () => {
    try {
      sessionStorage.setItem(BRIEF_STORAGE_KEY, JSON.stringify(draft));
      setStatus("Черновик сохранен в этой вкладке. Заявка пока не отправлена.");
    } catch {
      setStatus(
        "Браузер не разрешил сохранить черновик. Оставьте страницу открытой, чтобы не потерять текст.",
      );
    }
  };
  return (
    <section id="intake" className="editorial-section intake-section">
      <Container>
        <div className="section-kicker">
          <span>Обсудим ваш проект</span>
        </div>
        <div className="intake-shell">
          <div className="intake-aside">
            <h2>
              Расскажите,
              <br />
              что хотите сделать
            </h2>
            <p>
              Опишите идею своими словами. Можно добавить ссылку на пример.
              Готовое ТЗ не обязательно.
            </p>
            <div className="intake-contact">
              {STUDIO_TELEGRAM && (
                <a
                  className="text-link"
                  href={`https://t.me/${STUDIO_TELEGRAM.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
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
          <form
            className="brief-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.details.trim()) {
                textarea.current?.setCustomValidity(
                  "Опишите задачу хотя бы в нескольких словах.",
                );
                textarea.current?.reportValidity();
                return;
              }
              setReview(true);
              requestAnimationFrame(() => heading.current?.focus());
            }}
          >
            {review ? (
              <div className="brief-review">
                <h3 ref={heading} tabIndex={-1}>
                  Ваш проект
                </h3>
                <dl className="brief-summary">
                  {[
                    ["Задача", draft.details],
                    ["Направление", draft.service],
                    ["Срок", draft.deadline],
                    ["Бюджет", draft.budget],
                    ["Контакт", draft.contact],
                  ]
                    .filter(([, v]) => v && v !== "Пока не определен")
                    .map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                </dl>
              </div>
            ) : (
              <div className="brief-fields">
                <label className="brief-field full">
                  Что должно получиться?
                  <textarea
                    ref={textarea}
                    name="details"
                    required
                    maxLength={4000}
                    value={draft.details}
                    onChange={(e) => {
                      e.target.setCustomValidity("");
                      change("details", e.target.value);
                    }}
                    placeholder="Например: нужен сайт нового бренда с каталогом. Дизайн пока обсуждаем, запуск планируем к осени."
                  />
                </label>
                {draft.service !== "Пока не определен" && (
                  <div className="brief-selection full">
                    <span>{draft.service}</span>
                    <button
                      type="button"
                      className="brief-back"
                      onClick={() => change("service", "Пока не определен")}
                      aria-label="Убрать выбранное направление"
                    >
                      Убрать
                    </button>
                  </div>
                )}
                <details className="brief-extra full">
                  <summary>
                    Добавить сроки, бюджет и контакт{" "}
                    <span aria-hidden="true">+</span>
                  </summary>
                  <div className="brief-fields">
                    <label className="brief-field">
                      Желаемый срок
                      <input
                        name="deadline"
                        maxLength={200}
                        value={draft.deadline}
                        onChange={(e) => change("deadline", e.target.value)}
                        placeholder="Если уже известен"
                      />
                    </label>
                    <label className="brief-field">
                      Бюджет, если определен
                      <input
                        name="budget"
                        maxLength={200}
                        value={draft.budget}
                        onChange={(e) => change("budget", e.target.value)}
                        placeholder="Любой ориентир"
                      />
                    </label>
                    <label className="brief-field full">
                      Telegram или email
                      <input
                        name="contact"
                        autoComplete="off"
                        maxLength={200}
                        value={draft.contact}
                        onChange={(e) => change("contact", e.target.value)}
                        placeholder="Как с вами связаться"
                      />
                    </label>
                  </div>
                </details>
              </div>
            )}
            <div className="brief-footer">
              {review ? (
                <>
                  <button
                    type="button"
                    className="brief-back"
                    onClick={() => {
                      setReview(false);
                      setStatus("");
                      requestAnimationFrame(() => textarea.current?.focus());
                    }}
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    className="action action-primary"
                    onClick={save}
                  >
                    Сохранить черновик <Arrow />
                  </button>
                </>
              ) : (
                <button type="submit" className="action action-primary">
                  Подготовить бриф <Arrow />
                </button>
              )}
            </div>
            <p className="brief-note">
              Отправка заявок пока недоступна. Можно подготовить черновик, он
              останется в этой вкладке.
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
