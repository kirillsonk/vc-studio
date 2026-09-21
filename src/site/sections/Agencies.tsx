import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
export function Agencies() {
  return (
    <section id="agencies" className="editorial-section">
      <Container>
        <div className="agency-panel">
          <div className="agency-mark" aria-hidden="true">
            ↗
          </div>
          <div className="agency-copy">
            <span className="eyebrow">Агентствам и креативным командам</span>
            <h2>
              Разработка
              <br />
              для вашего агентства
            </h2>
            <p>
              Реализуем готовый дизайн, подключим интеграции и подготовим проект
              к запуску. Можно передать всю разработку или отдельную часть
              задачи.
            </p>
            <Link href="/#intake" className="text-link">
              Обсудить разработку <Arrow diagonal />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
