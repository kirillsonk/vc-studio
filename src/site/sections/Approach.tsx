import { Container } from "../Chrome";
const REASONS = [
  [
    "Меньше ручной сборки",
    "Код пишет AI, поэтому разработка стоит меньше",
  ],
  [
    "Рабочая версия раньше",
    "Интерфейс в действии видно уже в первые дни",
  ],
  [
    "Проверка силами команды",
    "Каждую строку кода проверяем и тестируем сами",
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
            Ручной работы стало меньше. Экономия остается в вашем бюджете
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
            Разработка, где код пишет AI, а мы ставим задачи, проверяем и
            доводим результат
          </p>
        </div>
      </Container>
    </section>
  );
}
