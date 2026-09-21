"use client";
import { useState } from "react";
export function CostChart() {
  const [factor, setFactor] = useState(2);
  const share = 100 / factor;
  return (
    <figure className="cost-chart">
      <div className="cost-scenarios">
        <span>Разница в бюджете</span>
        <div role="group" aria-label="Иллюстрация экономии">
          {[2, 3, 5].map((value) => (
            <button
              key={value}
              type="button"
              aria-pressed={factor === value}
              onClick={() => setFactor(value)}
            >
              x{value}
            </button>
          ))}
        </div>
      </div>
      <div className="cost-row">
        <div className="cost-label">
          <span>Агентство</span>
          <strong>100%</strong>
        </div>
        <div className="cost-track" aria-hidden="true">
          <div className="cost-bar cost-bar-agency" />
        </div>
      </div>
      <div className="cost-row">
        <div className="cost-label">
          <span>VC Studio</span>
          <strong>{Math.round(share)}%</strong>
        </div>
        <div className="cost-track" aria-hidden="true">
          <div
            className="cost-bar cost-bar-studio"
            style={{ width: `${share}%` }}
          />
        </div>
      </div>
      <p className="cost-result" aria-live="polite">
        В {factor} {factor === 5 ? "раз" : "раза"} меньше на разработку
      </p>
      <figcaption>
        Иллюстрация разницы в стоимости, а не фиксированный тариф. Бюджет вашего
        проекта рассчитаем после обсуждения задачи.
      </figcaption>
    </figure>
  );
}
