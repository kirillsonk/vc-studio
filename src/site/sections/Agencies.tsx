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
            <span className="eyebrow">Для агентств</span>
            <h2>
              Ваши макеты.
              <br />
              Наша разработка
            </h2>
            <p>
              Собираем сайты и спецпроекты по вашим макетам и ТЗ, запускаем к старту
              кампании. Берем меньше обычного подрядчика, поэтому больше остается
              вам. Для бизнеса делаем то же самое напрямую
            </p>
            <Link href="/#intake" className="text-link">
              Прислать задачу на оценку <Arrow diagonal />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
