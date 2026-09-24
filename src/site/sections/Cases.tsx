"use client";
import React from "react";
import { Container } from "../Chrome";
import { Configurator } from "../demos/Configurator";
import { Assistant } from "../demos/Assistant";

const DEMOS = [
  { id: "configurator", tab: "3D-конфигуратор", note: "Такие конфигураторы делаем для запусков и промо: товар в 3D, опции и цена в реальном времени" },
  { id: "assistant", tab: "AI-ассистент", note: "Такого ассистента подключаем к вашим данным: он отвечает клиентам и передает заявки в CRM" },
] as const;

export function Cases() {
  const [active, setActive] = React.useState(0);
  const demo = DEMOS[active];
  return (
    <section id="cases" className="editorial-section">
      <Container>
        <div className="section-kicker">
          <span>Интерактивное демо</span>
        </div>
        <div className="section-heading">
          <h2>
            Не рассказываем.
            <br />
            Показываем
          </h2>
          <p>Два рабочих примера того, что мы делаем для клиентов. Попробуйте прямо здесь</p>
        </div>
        <div className="econ-tabs demo-tabs" role="tablist" aria-label="Демо">
          {DEMOS.map((d, i) => (
            <button
              key={d.id}
              type="button"
              role="tab"
              className="econ-tab"
              aria-selected={i === active}
              aria-controls="demo-stage"
              onClick={() => setActive(i)}
            >
              {d.tab}
            </button>
          ))}
        </div>
        <div className="demo-stage" id="demo-stage" role="tabpanel" key={demo.id}>
          {demo.id === "configurator" ? <Configurator /> : <Assistant />}
        </div>
        <p className="demo-note">{demo.note}</p>
      </Container>
    </section>
  );
}
