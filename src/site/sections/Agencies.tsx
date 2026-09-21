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
              Ваша идея.
              <br />
              Наш production
            </h2>
            <p>
              Подключаемся на этапе концепции или готового дизайна. Берем
              разработку, интерактив, интеграции и запуск на себя — вы
              сохраняете фокус на клиенте и креативе
            </p>
            <Link href="/?service=3#intake" className="text-link">
              Передать проект в production <Arrow diagonal />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
