import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

import { VCMotion } from "../VCMotion";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <Container>
        <div className="hero-eyebrow">
          <span>Сайты, веб-сервисы и интерактивные проекты</span>
        </div>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Сильный digital.
              <br />
              <span>На скорости AI</span>
            </h1>
            <p className="hero-lead">
              Проектируем дизайн и разрабатываем с AI. Вайбкодинг сокращает
              затраты на написание кода. Сценарии, технические решения и
              проверку берем на себя
            </p>
            <div className="hero-actions">
              <Link className="action action-primary" href="/#intake">
                Обсудить проект <Arrow diagonal />
              </Link>
              <Link className="text-link" href="/#cases">
                Открыть демо <Arrow />
              </Link>
            </div>
          </div>
          <VCMotion />
        </div>
        <div className="hero-baseline">
          <span>От небольшой задачи до полноценного продукта</span>
          <a href="#economics">
            За счет чего экономим <Arrow diagonal />
          </a>
        </div>
      </Container>
    </section>
  );
}
