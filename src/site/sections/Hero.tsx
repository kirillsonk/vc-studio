import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

/** A lightweight studio motion study. No simulated telemetry or WebGL dependency. */
export function ProductionCanvas() {
  return (
    <div className="production-art" aria-hidden="true">
      <svg viewBox="0 0 540 560" fill="none" className="ribbon-art">
        <defs>
          <linearGradient
            id="ribbon-metal"
            x1="90"
            y1="50"
            x2="440"
            y2="490"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#292a27" />
            <stop offset=".23" stopColor="#7a7b75" />
            <stop offset=".39" stopColor="#f7f7ef" />
            <stop offset=".51" stopColor="#97988e" />
            <stop offset=".72" stopColor="#33362f" />
            <stop offset="1" stopColor="#b9b9ad" />
          </linearGradient>
          <linearGradient
            id="ribbon-edge"
            x1="130"
            y1="40"
            x2="390"
            y2="480"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#f59b69" />
            <stop offset=".45" stopColor="#d9451a" />
            <stop offset="1" stopColor="#982706" />
          </linearGradient>
          <linearGradient id="ribbon-light">
            <stop stopColor="white" stopOpacity="0" />
            <stop offset=".5" stopColor="white" stopOpacity=".8" />
            <stop offset="1" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="ribbon-body">
          {Array.from({ length: 29 }, (_, i) => (
            <path
              key={i}
              d={`M ${123 + i * 3.8} ${88 + i * 2.3} C ${395 + i * 1.1} ${20 + i * 2.4}, ${445 + i * 0.5} ${216 + i * 3}, ${247 + i * 3} ${252 + i * 2.5} C ${48 + i * 3.4} ${289 + i * 3}, ${107 + i * 3.7} ${464 + i * 2}, ${357 + i * 3.3} ${437 + i * 2.3}`}
              stroke={i > 25 ? "url(#ribbon-edge)" : "url(#ribbon-metal)"}
              strokeWidth="2.6"
            />
          ))}
          <path
            className="ribbon-glint"
            d="M140 105C440 40 447 243 274 278C83 317 159 496 393 462"
            stroke="url(#ribbon-light)"
            strokeWidth="2"
          />
        </g>
      </svg>
    </div>
  );
}

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
              <span>На скорости AI.</span>
            </h1>
            <p className="hero-lead">
              Проектируем дизайн и разрабатываем с AI. Вайбкодинг сокращает
              затраты на написание кода. За сценарии, технические решения и
              проверку отвечает наша команда.
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
          <ProductionCanvas />
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
