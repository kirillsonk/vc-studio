import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

import { VCMotion } from "../VCMotion";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <svg className="mobile-ribbons" viewBox="0 0 400 520" fill="none" aria-hidden="true"><g strokeLinecap="round"><path d="M440 0C160 70 460 270 270 365S-40 380-60 530" stroke="#C94320"/><path d="M450 8C170 78 470 278 280 373S-30 388-50 538" stroke="#B7BDB4"/><path d="M460 16C180 86 480 286 290 381S-20 396-40 546" stroke="#B7BDB4"/></g></svg>
      <Container>
        <div className="hero-grid">
          <div className="hero-copy">
            <h1 id="hero-title">
              Сильный digital.
              <br />
              <span>На скорости AI</span>
            </h1>
            <p className="hero-lead">
              Создаем сайты и сервисы с AI, чтобы вы меньше платили за разработку
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
