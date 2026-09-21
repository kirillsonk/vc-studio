import { Container } from "../Chrome";
const STEPS = [
  [
    "Разбираемся в задаче",
    "Вы рассказываете об идее, аудитории и сроке. Мы определяем формат, объем работ и критерии результата",
  ],
  [
    "Придаем идее форму",
    "Проектируем сценарии и дизайн. Согласуем направление до того, как писать основной код",
  ],
  [
    "Вайбкодим. Проверяем",
    "AI-агенты собирают код под управлением инженеров. Команда проверяет решения и показывает рабочие версии",
  ],
  [
    "Доводим до запуска",
    "Тестируем на разных экранах, проверяем интеграции и производительность. Передаем код, документацию и отчет",
  ],
];
export function Process() {
  return (
    <section id="process" className="editorial-section process-section">
      <Container>
        <div className="section-kicker">
          <span>04 / Наш подход</span>
        </div>
        <div className="section-heading">
          <h2>
            Мы вайбкодим.
            <br />И отвечаем за это
          </h2>
          <p>
            Инженер ставит задачу AI-агенту, задает контекст и проверяет
            решение. Скорость — от инструментов. Вкус, решения и ответственность
            — от людей
          </p>
        </div>
        <ol className="process-list">
          {STEPS.map(([title, detail], i) => (
            <li key={title}>
              <span className="process-number">0{i + 1}</span>
              <h3>{title}</h3>
              <p>{detail}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
