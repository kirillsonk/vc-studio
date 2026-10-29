import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

import { VCMotion } from "../VCMotion";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Сильный digital.
              <br />
              <span>На скорости AI</span>
            </h1>
            <p className="hero-lead">
              Создаем сайты и сервисы с ИИ, чтобы вы меньше платили за разработку
            </p>
            <div className="hero-actions">
              <Link className="action action-primary" href="/#intake">
                Начать проект <Arrow diagonal />
              </Link>
              <Link className="text-link" href="/#cases">
                К примерам <Arrow />
              </Link>
            </div>
          </div>
          <VCMotion />
        </div>
        <div className="hero-baseline">
          <span>От вашей идеи до работающего проекта</span>
          <a href="#economics">
            Почему вы платите меньше <Arrow diagonal />
          </a>
        </div>
      </Container>
    </section>
  );
}
