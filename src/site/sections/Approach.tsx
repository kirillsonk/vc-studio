import { Container } from "../Chrome";
const REASONS = [
  [
    "Меньше ручной сборки",
    "AI помогает писать и дорабатывать код. Мы используем это, чтобы сокращать затраты на разработку",
  ],
  [
    "Рабочая версия раньше",
    "Вы оцениваете интерфейс в действии. Обсуждаем конкретные решения и корректируем их по ходу проекта",
  ],
  [
    "Проверка силами команды",
    "Сценарии, дизайн, интеграции и подготовка к запуску остаются частью нашей работы",
  ],
];
export function Approach() {
  return (
    <section id="approach" className="editorial-section approach-section">
      <Container>
        <div className="section-kicker">
          <span>Почему вайбкодинг</span>
        </div>
        <div className="section-heading">
          <h2>
            AI меняет разработку.
            <br />
            Мы меняем ее стоимость
          </h2>
          <p>
            Для создания продукта теперь нужно меньше ручной работы. Мы строим
            процесс вокруг этих возможностей, чтобы экономия отражалась в
            бюджете клиента
          </p>
        </div>
        <div className="approach-points">
          {REASONS.map(([title, detail]) => (
            <article key={title}>
              <h3>{title}</h3>
              <p>{detail}</p>
            </article>
          ))}
        </div>
        <div className="vibe-definition">
          <span>Что такое вайбкодинг</span>
          <p>
            Разработка через постановку задач AI. Мы описываем логику продукта,
            направляем сборку, проверяем код и дорабатываем результат
          </p>
        </div>
      </Container>
    </section>
  );
}
