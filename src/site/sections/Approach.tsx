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
        <div className={`story-art story-art-${step}`}>
          {step === 0 && <div className="approach-diagram responsibility-diagram">
            <div className="diagram-role diagram-role-ai"><span className="diagram-symbol" aria-hidden="true">{ "</>" }</span><strong>ИИ</strong><span>Написание кода</span></div>
            <div className="diagram-plus" aria-hidden="true">+</div>
            <div className="diagram-role diagram-role-team"><span className="diagram-symbol" aria-hidden="true">✓</span><strong>Команда</strong><span>Решения и проверка</span></div>
            <div className="diagram-conclusion">Меньше ручной работы<br/><strong>Больше внимания задаче</strong></div>
          </div>}
          {step === 1 && <div className="approach-diagram stages-diagram">
            {["Задача", "Дизайн", "Разработка", "Тестирование"].map((label, index) => <div className="diagram-stage" key={label} style={{animationDelay: `${index * .14}s`}}><span className="stage-mark" aria-hidden="true">✓</span><span>{label}</span><span className="stage-line" aria-hidden="true"/></div>)}
            <div className="diagram-conclusion">Компактная команда<br/><strong>Все этапы на месте</strong></div>
          </div>}
          {step === 2 && <div className="approach-diagram launch-diagram">
            <div className="launch-items">{["Домен", "Сервер", "Интеграции"].map((label, index) => <div key={label} style={{animationDelay: `${index * .14}s`}}><span>{label}</span><span aria-hidden="true">✓</span></div>)}</div>
            <div className="launch-connection" aria-hidden="true"/>
            <div className="launch-result"><span className="launch-dot" aria-hidden="true"/><strong>Проект работает</strong><span>Можно принимать клиентов</span></div>
          </div>}
        </div>
        <div className="story-copy"><h3>{story.title}</h3><p>{story.text}</p><strong>{story.result}</strong></div>
      </div>
      <div className="story-controls"><span>{step + 1} / {STORY.length}</span><div><button type="button" aria-label="Предыдущий шаг" disabled={step === 0} onClick={() => setStep(step - 1)}>←</button><button type="button" aria-label="Следующий шаг" disabled={step === STORY.length - 1} onClick={() => setStep(step + 1)}>→</button></div></div>
    </div>
  </Container></section>;
}
