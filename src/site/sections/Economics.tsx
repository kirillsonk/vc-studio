import { CostChart } from "../CostChart";
import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

export function Economics() {
  return (
    <section id="economics" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>Из чего складывается цена</span>
        </div>
        <div className="section-heading">
          <h2>
            Вы видите,
            <br />
            за что платите
          </h2>
          <p>В расчете отдельно показываем расходы на AI и нашу работу: дизайн, технические решения, проверку и запуск. Так вы понимаете, где возникает экономия и что входит в стоимость проекта</p>
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
