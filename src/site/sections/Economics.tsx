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
              <span>03 / Открытая экономика</span>
            </div>
            <h2>
              Бюджет —<br />в результат
            </h2>
            <p className="section-lead">
              AI сокращает ручную работу. Вы платите за решение задачи,
              инженерную работу и реальный расход инструментов
            </p>
            <div className="starting-price">
              <span>Старт проектов</span>
              <strong>от 100 000 ₽</strong>
            </div>
            <Link href="/#intake" className="text-link">
              Получить оценку задачи <Arrow diagonal />
            </Link>
          </div>
          <div className="price-ledger">
            <div className="ledger-heading">
              <span>Как складывается стоимость</span>
              <span aria-hidden="true">↘</span>
            </div>
            <div className="price-line">
              <span className="price-index">01</span>
              <h3>Работа команды</h3>
              <strong>Фиксируем до старта</strong>
              <p>
                Дизайн, архитектура, разработка, интеграции, тестирование и
                запуск. Состав работ согласуем заранее
              </p>
            </div>
            <div className="price-line">
              <span className="price-index">02</span>
              <h3>AI-инфраструктура</h3>
              <strong>По фактическому расходу</strong>
              <p>
                Показываем затраты на модели и инструменты отдельно. Без наценки
                и условной цены за токен
              </p>
            </div>
            <div className="ledger-footer">
              <span className="trace-mark" />
              <p>
                Сначала согласованный объем работ.
                <br />
                После запуска — понятный отчет.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
