import { CostChart } from "../CostChart";
import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

export function Economics() {
  return (
    <section id="economics" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>Экономика проекта</span>
        </div>
        <div className="section-heading">
          <h2>
            Вайбкодим открыто.
            <br />
            Показываем расходы
          </h2>
          <p>Вместо часов разработчика платите за токены AI. Дизайн и ведение проекта считаем отдельно</p>
        </div>
        <CostChart />
        <div className="econ-cta">
          <Link href="/#intake" className="text-link">
            Рассчитать мой проект <Arrow diagonal />
          </Link>
        </div>
      </Container>
    </section>
  );
}
