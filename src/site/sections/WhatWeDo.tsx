import Link from "next/link";
import { Container } from "../Chrome";
import { Carousel } from "../Carousel";
import { SERVICES } from "../brief";

/** One line and three tags per service. Icons are 1.5 px line drawings, accent stroke in brand color */
const CARDS: Array<{ text: string; tags: string; icon: React.ReactNode }> = [
  {
    text: "Лендинги, корпоративные сайты и e-commerce, которые быстро грузятся и находятся в поиске",
    tags: "Next.js · CMS · SEO",
    icon: (
      <>
        <path d="M6 10h36v28H6zM6 17h36" />
        <path className="icon-accent" d="M13 25h14M13 31h8" />
      </>
    ),
  },
  {
    text: "Чат-боты и агенты на LLM: отвечают клиентам, принимают заявки, работают с вашими данными",
    tags: "LLM · RAG · Telegram",
    icon: (
      <>
        <path d="M8 10h32v22H20l-8 7v-7H8z" />
        <path className="icon-accent" d="M16 21h2M23 21h2M30 21h2" />
      </>
    ),
  },
  {
    text: "Подключаем AI к CRM, базам и внутренним сервисам, чтобы модель работала с реальными данными",
    tags: "MCP · API · CRM",
    icon: (
      <>
        <path d="M10 14h10v10H10zM28 24h10v10H28z" />
        <path className="icon-accent" d="M20 19h4a4 4 0 0 1 4 4v1M28 29h-4a4 4 0 0 1-4-4v-1" />
      </>
    ),
  },
  {
    text: "MVP, личные кабинеты, запись и оплата онлайн. Запускаем продукт, который можно развивать",
    tags: "MVP · SaaS · Платежи",
    icon: (
      <>
        <path d="M8 8h32v32H8zM8 16h32M16 16v24" />
        <path className="icon-accent" d="M22 24h12M22 30h8" />
      </>
    ),
  },
  {
    text: "Промо-механики, игры, 3D и WebGL для кампаний и запусков, которые хочется досмотреть",
    tags: "WebGL · 3D · Игры",
    icon: (
      <>
        <path d="m24 6 16 9v18l-16 9-16-9V15z" />
        <path className="icon-accent" d="M24 24v18M24 24l16-9M24 24 8 15" />
      </>
    ),
  },
  {
    text: "Убираем ручную работу: синхронизация систем, боты, отчеты и уведомления",
    tags: "n8n · Webhooks · Боты",
    icon: (
      <>
        <path d="M24 10a14 14 0 1 1-13 9" />
        <path className="icon-accent" d="m6 12 5 7 7-4" />
      </>
    ),
  },
];

export function WhatWeDo() {
  return (
    <section id="what" className="editorial-section carousel-section">
      <Container>
        <div className="section-kicker">
          <span>Что мы делаем</span>
        </div>
        <div className="section-heading">
          <h2>
            От сайта
            <br />
            до AI-агента
          </h2>
          <p>Приходите с идеей, макетом или задачей. Подберем формат и доведем до запуска</p>
        </div>
        <Carousel label="Услуги">
          {SERVICES.map((title, i) => (
            <Link href={`/?service=${i}#intake`} className="service-card" key={title}>
              <svg className="service-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {CARDS[i].icon}
              </svg>
              <h3>{title}</h3>
              <p>{CARDS[i].text}</p>
              <span className="service-tags">{CARDS[i].tags}</span>
            </Link>
          ))}
        </Carousel>
      </Container>
    </section>
  );
}
