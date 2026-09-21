import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
const ITEMS = [
  [
    "Промо-сайты",
    "Для запусков, в которых важен первый контакт с брендом",
    "Дизайн · Анимация · Интеграции",
  ],
  [
    "Игры и спецпроекты",
    "Когда аудиторию нужно вовлечь, а не просто рассказать",
    "Механики · Геймификация · Аналитика",
  ],
  [
    "3D и интерактив",
    "Когда продукт лучше один раз покрутить, чем долго описывать",
    "WebGL · Конфигураторы · Визуализации",
  ],
  [
    "Production для агентств",
    "Когда сильной идее нужна команда, которая ее реализует",
    "Frontend · Backend · QA и запуск",
  ],
];
export function WhatWeDo() {
  return (
    <section id="what" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>02 / Возможности</span>
        </div>
        <div className="section-heading">
          <h2>
            От первого впечатления
            <br />
            до последнего клика
          </h2>
          <p>
            Подбираем формат под задачу бизнеса. Продумываем сценарий, собираем
            дизайн и доводим до работающего продукта
          </p>
        </div>
        <div className="services-list">
          {ITEMS.map(([title, desc, meta], i) => (
            <Link
              href={`/?service=${i}#intake`}
              className="service-row"
              key={title}
            >
              <span className="service-index">0{i + 1}</span>
              <h3>{title}</h3>
              <div>
                <p>{desc}</p>
                <span>{meta}</span>
              </div>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
