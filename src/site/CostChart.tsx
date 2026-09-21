export function CostChart() {
  return (
    <figure
      className="cost-chart"
      aria-label="Условный расчет стоимости одной задачи"
    >
      <div className="cost-row">
        <div className="cost-label">
          <span>Почасовая модель агентства</span>
          <strong>300 000 ₽</strong>
        </div>
        <div className="cost-equation">
          <span>100 часов</span>
          <span aria-hidden="true">×</span>
          <span>3 000 ₽ / час</span>
        </div>
        <div className="cost-track" aria-hidden="true">
          <div className="cost-bar cost-bar-agency" />
        </div>
      </div>
      <div className="cost-row">
        <div className="cost-label">
          <span>VC Studio</span>
          <strong>60 000 ₽</strong>
        </div>
        <div className="cost-equation">
          <span>Фиксированная цена за задачу</span>
        </div>
        <div className="cost-track" aria-hidden="true">
          <div className="cost-bar cost-bar-studio" />
        </div>
      </div>
      <div className="cost-saving">
        <strong>×5</strong>
        <div>
          <span>меньше на разработку</span>
          <p>240 000 ₽ остаются в вашем бюджете</p>
        </div>
      </div>
      <figcaption>
        Условный пример одной задачи, не тариф и не средние цены рынка.
        Стоимость вашего проекта согласуем после обсуждения
      </figcaption>
    </figure>
  );
}
