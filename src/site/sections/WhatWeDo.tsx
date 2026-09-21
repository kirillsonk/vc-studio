import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";
import { SERVICES } from "../brief";
const DETAILS = [
  [
    "Представить компанию, запустить продукт или продавать онлайн.",
    "Лендинги · Корпоративные сайты · E-commerce",
  ],
  [
    "Дать клиентам удобный способ заказывать, записываться и управлять услугами.",
    "MVP · Личные кабинеты · Онлайн-сервисы",
  ],
  [
    "Показать продукт в действии и вовлечь аудиторию в кампанию.",
    "Конфигураторы · 3D · Браузерные игры",
  ],
  [
    "Связать инструменты бизнеса и сократить работу вручную.",
    "CRM · Telegram-боты · API-интеграции",
  ],
];
export function WhatWeDo() {
  return (
    <section id="what" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>Что мы делаем</span>
        </div>
        <div className="section-heading">
          <h2>
            От страницы
            <br />
            до полноценного сервиса
          </h2>
          <p>
            Можно прийти с идеей, готовым дизайном или отдельной задачей.
            Подберем формат, спроектируем интерфейс и доведем до запуска.
          </p>
        </div>
        <div className="services-list">
          {SERVICES.map((title, i) => (
            <Link
              href={`/?service=${i}#intake`}
              className="service-row"
              key={title}
            >
              <h3>{title}</h3>
              <div>
                <p>{DETAILS[i][0]}</p>
                <span>{DETAILS[i][1]}</span>
              </div>
              <Arrow diagonal />
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
