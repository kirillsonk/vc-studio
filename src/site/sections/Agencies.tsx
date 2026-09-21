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
            <span className="eyebrow">Отдельная задача или продукт целиком</span>
            <h2>
              Разработка
              <br />
              для вашего бизнеса
            </h2>
            <p>
              Запустим новый сервис, доработаем сайт или свяжем системы бизнеса.
              Подключимся к вашей команде или возьмем разработку на себя
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
