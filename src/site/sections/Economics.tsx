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
              Вайбкодим открыто.
              <br />
              Показываем расходы
            </h2>
            <p className="section-lead">
              Вместо часов написания кода оплачиваете токены AI. Дизайн и
              сопровождение проекта считаем отдельно
            </p>
            <div className="economics-principle">
              <span>Платите за ведение проекта</span>
              <p>
                Мы ставим задачи AI, принимаем технические решения, проверяем
                код и доводим продукт до запуска
              </p>
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
          </div>
        </div>
      </Container>
    </section>
  );
}
