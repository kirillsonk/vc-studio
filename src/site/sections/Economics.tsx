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
              Платите за задачу,
              <br />а не за часы
            </h2>
            <p className="section-lead">
              AI сокращает время на код. Мы учитываем эту экономию в цене, а не
              умножаем часы разработки на ставку специалиста
            </p>
            <div className="economics-principle">
              <span>AI доступен всем</span>
              <p>Разница в том, как его скорость отражается в вашем бюджете</p>
            </div>
            <Link href="/#intake" className="text-link">
              Обсудить стоимость <Arrow diagonal />
            </Link>
          </div>
          <div className="price-ledger cost-comparison">
            <div className="ledger-heading">
              <span>Одна задача, две модели оплаты</span>
              <span aria-hidden="true">↘</span>
            </div>
            <CostChart />
            <div className="cost-included">
              <h3>В обеих сметах одна задача</h3>
              <ul>
                <li>Дизайн и функциональность</li>
                <li>Проверка и запуск</li>
                <li>Исходный код</li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
