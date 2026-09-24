"use client";
import React from "react";
import Link from "next/link";
import { Container } from "../Chrome";
import { Arrow } from "../Arrow";

/** Who we work with and how. One tab per audience; the line art redraws on switch */
const AUDIENCES = [
  {
    id: "agencies",
    tab: "Агентствам",
    title: "Разработка под ваших клиентов",
    points: ["Собираем по вашим макетам и ТЗ", "Успеваем к старту кампании", "Стоим меньше обычного подрядчика"],
    cta: "Прислать задачу на оценку",
    art: (
      <>
        <path d="M30 40h110v80H30z" />
        <path d="M50 60h110v80H50z" />
        <path className="icon-accent" d="M70 80h110v80H70z" />
      </>
    ),
  },
  {
    id: "business",
    tab: "Бизнесу",
    title: "Сайты, сервисы и автоматизация",
    points: ["Начинаем с задачи, а не с ТЗ", "Показываем рабочую версию на каждом этапе", "Передаем код и поддерживаем после запуска"],
    cta: "Обсудить задачу",
    art: (
      <>
        <path d="M30 170h170" />
        <path d="M50 170v-50h26v50M92 170V90h26v80M134 170v-60h26v60" />
        <path className="icon-accent" d="M40 110 84 70l34 24 62-54m0 0h-24m24 0v24" />
      </>
    ),
  },
  {
    id: "startups",
    tab: "Стартапам",
    title: "MVP за недели, а не месяцы",
    points: ["Проверяем идею рабочим продуктом", "Тратим на код в разы меньше", "Развиваем продукт после запуска"],
    cta: "Рассказать об идее",
    art: (
      <>
        <circle cx="115" cy="105" r="70" />
        <circle cx="115" cy="105" r="42" />
        <circle className="icon-accent" cx="115" cy="105" r="14" />
        <path className="icon-accent" d="M115 35v28M115 147v28M45 105h28M157 105h28" />
      </>
    ),
  },
] as const;

export function Clients() {
  const [active, setActive] = React.useState(0);
  const a = AUDIENCES[active];
  return (
    <section id="clients" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>С кем работаем</span>
        </div>
        <div className="section-heading">
          <h2>
            Подстраиваемся
            <br />
            под ваш формат
          </h2>
          <p>Агентствам, компаниям и стартапам нужно разное. Работаем так, как удобно вам</p>
        </div>
        <div className="clients-tabs" role="tablist" aria-label="Кому">
          {AUDIENCES.map((x, i) => (
            <button
              key={x.id}
              type="button"
              role="tab"
              id={`clients-tab-${x.id}`}
              aria-selected={i === active}
              aria-controls="clients-panel"
              onClick={() => setActive(i)}
            >
              {x.tab}
            </button>
          ))}
        </div>
        <div className="clients-panel" id="clients-panel" role="tabpanel" aria-labelledby={`clients-tab-${a.id}`} key={a.id}>
          <div className="clients-copy">
            <h3>{a.title}</h3>
            <ul>
              {a.points.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <Link href="/#intake" className="action action-primary">
              {a.cta} <Arrow diagonal />
            </Link>
          </div>
          <svg className="clients-art" viewBox="0 0 230 210" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            {a.art}
          </svg>
        </div>
      </Container>
    </section>
  );
}
