import { CostChart } from "../CostChart";
import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
export function Economics() {
  return (
    <section id="economics" className="editorial-section">
      <Container>
        <div className="economics-layout">
          <div className="economics-copy">
            <div className="section-kicker">
              <span>Экономика проекта</span>
            </div>
            <h2>
              Разработка дешевле.
              <br />
              За счет AI.
            </h2>
            <p className="section-lead">
              Сокращаем ручную разработку с помощью AI. Вы платите за решение
              задачи с меньшими затратами на написание кода. Дизайн,
              функциональность и проверка остаются в проекте.
            </p>
            <Link href="/#intake" className="text-link">
              Обсудить стоимость <Arrow diagonal />
            </Link>
          </div>
          <div className="price-ledger cost-comparison">
            <div className="ledger-heading">
              <span>Одна задача. Другой бюджет.</span>
              <span aria-hidden="true">↘</span>
            </div>
            <CostChart />
            <div className="cost-included">
              <h3>В проект входят</h3>
              <ul>
                <li>Дизайн под вашу задачу</li>
                <li>Согласованный функционал</li>
                <li>Тестирование и запуск</li>
                <li>Исходный код</li>
              </ul>
            </div>
            <div className="ledger-footer">
              <span className="trace-mark" />
              <p>
                Стоимость работ согласуем до старта.
                <br />
                Расходы на AI показываем отдельно.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
