"use client";
import React from "react";
import { Container } from "../Chrome";
import { OrderDemo } from "../demos/OrderDemo";
export function Cases() {
  return <section id="cases" className="editorial-section"><Container>
    <div className="section-kicker"><span>Попробуйте сами</span></div>
    <div className="section-heading"><h2>От выбора товара<br />до заказа в CRM</h2><p>Выберите бутылку, измените ее комплектацию и оформите демозаказ. Вы увидите весь путь: от действий покупателя до заказа в CRM и изменения остатков</p></div>
    <OrderDemo />
  </Container></section>;
}
