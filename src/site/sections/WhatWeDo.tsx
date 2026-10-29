import Link from "next/link";
import { Container } from "../Chrome";
import { Carousel } from "../Carousel";
import { SERVICES } from "../brief";

/** One line and three tags per service. Icons are 1.5 px line drawings, accent stroke in brand color */
const CARDS: Array<{ text: string; tags: string; icon: React.ReactNode }> = [
  {
    text: "Чтобы рассказать о продукте, принимать заявки или продавать онлайн. Продумываем структуру, дизайн и путь покупателя",
    tags: "Next.js · CMS · SEO",
    icon: (
      <>
        <path d="M6 10h36v28H6zM6 17h36" />
        <path className="icon-accent" d="M13 25h14M13 31h8" />
      </>
    ),
  },
  {
    text: "Чтобы отвечать на вопросы, помогать с выбором и собирать заявки. Настраиваем работу с вашими материалами и нужными ограничениями",
    tags: "LLM · RAG · Telegram",
    icon: (
      <>
        <path d="M8 10h32v22H20l-8 7v-7H8z" />
        <path className="icon-accent" d="M16 21h2M23 21h2M30 21h2" />
      </>
    ),
  },
  {
    text: "Чтобы AI мог работать с вашими системами: получать данные, находить информацию и выполнять согласованные действия",
    tags: "MCP · API · CRM",
    icon: (
      <>
        <path d="M10 14h10v10H10zM28 24h10v10H28z" />
        <path className="icon-accent" d="M20 19h4a4 4 0 0 1 4 4v1M28 29h-4a4 4 0 0 1-4-4v-1" />
      </>
    ),
  },
  {
    text: "Чтобы клиент мог записаться, оплатить услугу или оформить заказ, а команда управляла процессом в одном месте",
    tags: "MVP · SaaS · Платежи",
    icon: (
      <>
        <path d="M8 8h32v32H8zM8 16h32M16 16v24" />
        <path className="icon-accent" d="M22 24h12M22 30h8" />
      </>
    ),
  },
  {
    text: "Чтобы человек мог попробовать продукт, собрать свою конфигурацию или включиться в игру прямо на сайте",
    tags: "WebGL · 3D · Игры",
    icon: (
      <>
        <path d="m24 6 16 9v18l-16 9-16-9V15z" />
        <path className="icon-accent" d="M24 24v18M24 24l16-9M24 24 8 15" />
      </>
    ),
  },
  {
    text: "Чтобы заявки, статусы и отчеты попадали туда, где с ними работают, без постоянного переноса данных вручную",
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
          <p>Приходите с задачей, даже если пока не знаете, как ее реализовать. Поможем выбрать решение и определим, что нужно вашему бизнесу</p>
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
