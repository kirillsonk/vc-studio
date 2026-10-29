"use client";
import { useState } from "react";
import { Container } from "../Chrome";
const STORY = [
  { label: "Что изменилось", title: "Меньше ручной работы", text: "ИИ берет на себя написание кода. Мы направляем его работу и проверяем результат, поэтому на разработку нужно меньше часов", result: "Меньше ручного труда в вашей смете" },
  { label: "Что осталось", title: "Полный цикл производства", text: "Мы разбираемся в задаче, проектируем интерфейс и тестируем сценарии. Команда стала компактнее, но необходимые этапы остались", result: "Дизайн и качество остаются нашей ответственностью" },
  { label: "Что получаете вы", title: "От идеи до работающего проекта", text: "Настроим сервер, подключим домен и интеграции, подготовим проект к запуску. Вам не придется разбираться в инфраструктуре", result: "Больше бюджета остается на развитие бизнеса" },
];
export function Approach() {
  const [step, setStep] = useState(0);
  const story = STORY[step];
  return <section id="approach" className="editorial-section approach-section"><Container>
    <div className="section-heading"><h2>Новый подход<br />к разработке</h2><p>Как ИИ сокращает путь от идеи до запуска</p></div>
    <div className="approach-story">
      <div className="story-steps" role="group" aria-label="История подхода">
        {STORY.map((item, index) => <button type="button" key={item.label} aria-pressed={step === index} onClick={() => setStep(index)}><span aria-hidden="true">0{index + 1}</span>{item.label}</button>)}
      </div>
      <div className="story-slide" key={step} aria-live="polite">
        <div className={`story-art story-art-${step}`} aria-hidden="true">
          <svg viewBox="0 0 360 200" fill="none"><path className="story-track" d="M20 44H105Q140 44 160 100T220 156H340M20 100H340M20 156H105Q140 156 160 100T220 44H340"/><path className="story-flow" d="M20 156H105Q140 156 160 100T220 44H340"/><circle cx="180" cy="100" r="28"/><path d="m168 100 8 8 16-18"/></svg>
        </div>
        <div className="story-copy"><h3>{story.title}</h3><p>{story.text}</p><strong>{story.result}</strong></div>
      </div>
      <div className="story-controls"><span>{step + 1} / {STORY.length}</span><div><button type="button" aria-label="Предыдущий шаг" disabled={step === 0} onClick={() => setStep(step - 1)}>←</button><button type="button" aria-label="Следующий шаг" disabled={step === STORY.length - 1} onClick={() => setStep(step + 1)}>→</button></div></div>
    </div>
  </Container></section>;
}
