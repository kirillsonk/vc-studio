"use client";
import React from "react";
import { Container } from "../Chrome";
import { OrderDemo } from "../demos/OrderDemo";
export function Cases() {
  return <section id="cases" className="editorial-section"><Container>
    <div className="section-kicker"><span>Интерактивное демо</span></div>
    <div className="section-heading"><h2>От выбора товара<br />до заказа в CRM</h2><p>Соберите свою бутылку и пройдите путь покупателя. Посмотрите, как магазин, склад и CRM работают вместе</p></div>
    <OrderDemo />
    <p className="demo-note">Демонстрационный магазин: без оплаты, реальных заказов и отправки сообщений. Данные сбрасываются при обновлении страницы</p>
  </Container></section>;
}
