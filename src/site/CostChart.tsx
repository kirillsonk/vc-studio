"use client";
import React from "react";

const money = (value: number) => new Intl.NumberFormat("ru-RU").format(Math.round(value)) + " ₽";

type Kind = "design" | "team" | "code";

/** Same order in both bars: design, project work, code. Code goes last so the smallest studio segment sits at the end */
const TOPICS: Array<{ id: Kind; label: string; regular: number; studio: number; regularName: string; studioName: string; note: string }> = [
  {
    id: "design",
    label: "Дизайн",
    regular: 100000,
    studio: 30000,
    regularName: "Дизайн, 20 часов",
    studioName: "Дизайн",
    note: "Варианты интерфейса собираем с AI, дизайнер выбирает лучшее и доводит до чистового",
  },
  {
    id: "team",
    label: "Ведение проекта",
    regular: 50000,
    studio: 60000,
    regularName: "Ведение и QA",
    studioName: "Сопровождение",
    note: "Здесь наша основная работа: задачи для AI, архитектура, проверка кода и запуск",
  },
  {
    id: "code",
    label: "Код",
    regular: 350000,
    studio: 10000,
    regularName: "Разработка, 70 часов",
    studioName: "Токены AI",
    note: "Код пишет AI. Платите за фактический расход токенов, а не за часы разработчика",
  },
];
const ORDER: Kind[] = ["design", "team", "code"];
const REGULAR = TOPICS.reduce((s, t) => s + t.regular, 0);
const STUDIO = TOPICS.reduce((s, t) => s + t.studio, 0);

/** Counts up once when shown; jumps straight to the value with reduced motion */
function useCountUp(target: number, run: boolean, ms = 1100) {
  const [value, setValue] = React.useState(target);
  React.useEffect(() => {
    if (!run) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
    let frame = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / ms);
      setValue(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) frame = requestAnimationFrame(tick);
    };
    setValue(0);
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, run, ms]);
  return value;
}

export function CostChart() {
  const root = React.useRef<HTMLDivElement>(null);
  const [shown, setShown] = React.useState(false);
  const [active, setActive] = React.useState<Kind>("code");

  React.useEffect(() => {
    const el = root.current;
    if (!el || !("IntersectionObserver" in window)) return setShown(true);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const regular = useCountUp(REGULAR, shown);
  const studio = useCountUp(STUDIO, shown);
  const saved = useCountUp(REGULAR - STUDIO, shown, 1400);
  const topic = TOPICS.find((t) => t.id === active)!;

  const bar = (which: "regular" | "studio") => (
    <div className={`econ-bar${which === "studio" ? " econ-bar-studio" : ""}`} role="group" aria-label={which === "studio" ? "Расходы Сборки" : "Расходы обычной разработки"}>
      {ORDER.map((id) => {
        const t = TOPICS.find((x) => x.id === id)!;
        return (
          <button
            type="button"
            key={id}
            className={`econ-seg econ-${id}`}
            data-active={active === id}
            aria-label={`${which === "studio" ? t.studioName : t.regularName}: ${money(t[which])}`}
            aria-pressed={active === id}
            onPointerEnter={e => { if (e.pointerType === "mouse") setActive(id); }}
            onFocus={() => setActive(id)}
            onClick={() => setActive(id)}
            style={{ width: shown ? `${(t[which] / REGULAR) * 100}%` : "0%" }}
          />
        );
      })}
      {which === "studio" && <span className="econ-unused" aria-hidden="true" />}
    </div>
  );

  return (
    <div className="econ-board" ref={root} data-shown={shown}>
      <div className="econ-tabs" role="group" aria-label="Статья расходов">
        {TOPICS.map((t) => (
          <button
            key={t.id}
            type="button"
            aria-pressed={active === t.id}
            aria-controls="econ-note"
            className={`econ-tab econ-${t.id}`}
            onClick={() => setActive(t.id)}
            onPointerEnter={e => { if (e.pointerType === "mouse") setActive(t.id); }}
            onFocus={() => setActive(t.id)}
          >
            <span className="econ-dot" aria-hidden="true" />
            {t.label}
          </button>
        ))}
      </div>

      <div className="econ-rows">
        <div className="econ-row">
          <div className="econ-name">
            <span>Обычная разработка</span>
            <small>100 часов по 5 000 ₽</small>
          </div>
          {bar("regular")}
          <strong className="econ-total" data-num>{money(regular)}</strong>
        </div>
        <div className="econ-row">
          <div className="econ-name">
            <span>Сборка</span>
            <small>Дизайн, сопровождение и токены AI</small>
          </div>
          {bar("studio")}
          <strong className="econ-total econ-total-brand" data-num>{money(studio)}</strong>
        </div>
      </div>

      <div id="econ-note" className="econ-note">
        <div className="econ-compare" data-num>
          <span>{money(topic.regular)}</span>
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M4 12h15m-5-5 5 5-5 5" /></svg>
          <strong>{money(topic.studio)}</strong>
        </div>
        <p key={topic.id}>{topic.note}</p>
      </div>

      <div className="econ-result">
        <strong data-num>×{Math.round(REGULAR / STUDIO)}</strong>
        <div>
          <span data-num>{money(saved)} остаются на другие задачи</span>
          <small>Условный пример, не тариф и не средние цены рынка</small>
        </div>
      </div>
    </div>
  );
}
