"use client";
import { useState } from "react";

const money = (value: number) =>
  new Intl.NumberFormat("ru-RU").format(value) + " ₽";
const MODELS = [
  {
    id: "agency",
    name: "Обычная разработка",
    formula: "100 часов × 5 000 ₽ / час",
    parts: [
      {
        id: "agency-design",
        name: "Дизайн",
        value: 100000,
        color: "design",
        detail: "20 часов на структуру и дизайн интерфейса по ставке 5 000 ₽",
      },
      {
        id: "agency-code",
        name: "Разработка",
        value: 350000,
        color: "code",
        detail:
          "70 часов разработки по ставке 5 000 ₽. В этой модели оплачиваются часы специалиста",
      },
      {
        id: "agency-support",
        name: "Ведение и QA",
        value: 50000,
        color: "support",
        detail: "10 часов на координацию, проверку и подготовку к запуску",
      },
    ],
  },
  {
    id: "studio",
    name: "Сборка",
    formula: "Дизайн + сопровождение + токены AI",
    parts: [
      {
        id: "studio-design",
        name: "Дизайн",
        value: 30000,
        color: "design",
        detail:
          "Структура и интерфейс под вашу задачу. Дизайн остается отдельной частью проекта",
      },
      {
        id: "studio-support",
        name: "Сопровождение",
        value: 60000,
        color: "support",
        detail:
          "Основная часть нашей работы: постановка задач AI, технические решения, проверка кода и сценариев, правки и запуск",
      },
      {
        id: "studio-code",
        name: "Токены AI",
        value: 10000,
        color: "code",
        detail:
          "Расход AI на генерацию и доработку кода. За эту часть платите по расходу токенов, без почасовой ставки разработчика",
      },
    ],
  },
];
const max = MODELS[0].parts.reduce((sum, part) => sum + part.value, 0);
const totalStudio = MODELS[1].parts.reduce((sum, part) => sum + part.value, 0);
const parts = MODELS.flatMap((model) =>
  model.parts.map((part) => ({ ...part, model: model.name })),
);

export function CostChart() {
  const [selected, setSelected] = useState("studio-code");
  const [preview, setPreview] = useState<string | null>(null);
  const current = parts.find((part) => part.id === (preview ?? selected))!;
  const events = (id: string) => ({
    onMouseEnter: () => setPreview(id),
    onMouseLeave: () => setPreview(null),
    onFocus: () => setPreview(id),
    onBlur: () => setPreview(null),
    onClick: () => {
      setSelected(id);
      setPreview(null);
    },
  });
  return (
    <figure
      className="cost-chart"
      aria-label="Условное сравнение расходов на один проект"
    >
      <p className="cost-chart-hint">
        Выберите сегмент, чтобы увидеть состав расходов
      </p>
      {MODELS.map((model) => (
        <div className="cost-row" key={model.id}>
          <div className="cost-label">
            <span>{model.name}</span>
            <strong>
              {money(model.parts.reduce((sum, part) => sum + part.value, 0))}
            </strong>
          </div>
          <p className="cost-equation">{model.formula}</p>
          <div
            className="cost-stacked-track"
            role="group"
            aria-label={`Расходы: ${model.name}`}
          >
            {model.parts.map((part) => (
              <button
                key={part.id}
                type="button"
                tabIndex={-1}
                className={`cost-segment cost-${part.color}`}
                style={{ width: `${(part.value / max) * 100}%` }}
                data-active={current.id === part.id}
                data-muted={current.color !== part.color}
                aria-label={`${model.name}: ${part.name}, ${money(part.value)}`}
                aria-pressed={selected === part.id}
                aria-controls="cost-detail"
                {...events(part.id)}
              />
            ))}
          </div>
          <div
            className="cost-legend"
            aria-label={`Статьи расходов: ${model.name}`}
          >
            {model.parts.map((part) => (
              <button
                key={part.id}
                type="button"
                className={`cost-legend-item cost-${part.color}`}
                data-active={current.id === part.id}
                data-muted={current.color !== part.color}
                aria-pressed={selected === part.id}
                aria-controls="cost-detail"
                {...events(part.id)}
              >
                <span className="cost-dot" aria-hidden="true" />
                <span>
                  {part.name}
                  <strong>{money(part.value)}</strong>
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
      <div
        id="cost-detail"
        className={`cost-detail cost-${current.color}`}
        aria-live="polite"
        aria-atomic="true"
      >
        <div>
          <span>
            {current.model} / {current.name}
          </span>
          <strong>{money(current.value)}</strong>
        </div>
        <p>{current.detail}</p>
      </div>
      <div className="cost-saving">
        <strong>×{max / totalStudio}</strong>
        <div>
          <span>меньше бюджет в этом примере</span>
          <p>{money(max - totalStudio)} на другие задачи бизнеса</p>
        </div>
      </div>
      <figcaption>
        Условный расчет, не тариф и не средние цены рынка. Расход токенов и
        стоимость сопровождения зависят от задачи
      </figcaption>
    </figure>
  );
}
