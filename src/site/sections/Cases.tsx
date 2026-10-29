"use client";
import React from "react";
import { Container } from "../Chrome";
import { OrderDemo } from "../demos/OrderDemo";
export function Cases() {
  return <section id="cases" className="editorial-section"><Container>
    <div className="section-heading"><h2>От выбора товара<br />до заказа в CRM</h2><p>Выберите бутылку, измените ее комплектацию и оформите демозаказ. Вы увидите, как действия покупателя превращаются в заказ в CRM и меняют остатки</p></div>
    <OrderDemo />
  </Container></section>;
}
