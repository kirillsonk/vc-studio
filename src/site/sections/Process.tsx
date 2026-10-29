import { Container } from "../Chrome";
const STEPS = [
  {
    title: "Задача",
    points: ["Ваша задача и сценарии клиентов", "Объем, стоимость и сроки"],
    icon: (
      <>
        <path d="M10 10h28v28H10z" />
        <path d="M17 19h14M17 26h9" />
        <path className="process-accent" d="m32 33 5 5 10-12" />
      </>
    ),
  },
  {
    title: "Дизайн",
    points: ["Структура и сценарии", "Согласование дизайна"],
    icon: (
      <>
        <path d="M8 12h36v26H8zM8 20h36M20 20v18" />
        <path className="process-accent" d="m29 26 8 3-4 2-2 5z" />
      </>
    ),
  },
  {
    title: "Разработка",
    points: ["Сборка с AI и интеграции", "Рабочая версия"],
    icon: (
      <>
        <path d="m18 16-10 10 10 10m16-20 10 10-10 10" />
        <path className="process-accent" d="m29 10-6 32" />
      </>
    ),
  },
  {
    title: "Запуск",
    points: ["Тесты и публикация", "Исходники и доступы"],
    icon: (
      <>
        <path d="M10 27v15h32V27" />
        <path className="process-accent" d="M26 32V8m-9 9 9-9 9 9" />
      </>
    ),
  },
];
export function Process() {
  return (
    <section id="process" className="editorial-section process-section">
      <Container>
        <div className="section-kicker">
          <span>Как мы работаем</span>
        </div>
        <div className="section-heading">
          <h2>
            Вы ставите задачу.
            <br />
            Мы доводим до запуска
          </h2>
          <p>Не нужно заранее составлять техническое задание и подбирать инструменты. Разберемся вместе, согласуем решение и будем показывать результат по мере готовности</p>
        </div>
        <ol className="process-list">
          {STEPS.map(({ title, points, icon }) => (
            <li key={title}>
              <svg
                className="process-icon"
                viewBox="0 0 52 52"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                {icon}
              </svg>
              <h3>{title}</h3>
              <ul className="process-points">
                {points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
