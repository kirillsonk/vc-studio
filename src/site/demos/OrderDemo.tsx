"use client";
import React from 'react';
import { trackGoal } from "../analytics/metrika";
import { Configurator } from './Configurator';
import { ACCESSORIES, DEFAULT_BOTTLE, available, bottleProduct, cancelOrder, initialShop, money, placeOrder, total, type CartLine, type Delivery, type Product } from './order-model';

function ProductArt({product}:{product:Product}) {
  return <svg className="order-product-art" viewBox="0 0 100 120" fill="none" aria-hidden="true" style={{'--product':product.color} as React.CSSProperties}>
    {product.kind==='bottle'? <><ellipse cx="50" cy="109" rx="29" ry="5" fill="#111214" opacity=".08"/><path d="M36 19h28v15c0 6 9 9 9 20v42c0 10-46 10-46 0V54c0-11 9-14 9-20Z" fill="var(--product)"/><rect x="35" y="12" width="30" height="17" rx="5" fill="#35383b"/><path d="M34 64c12 8 20-8 32 0m-32 5c12 8 20-8 32 0" stroke="#dc9766" strokeWidth="2"/><path d="M38 37v56" stroke="white" opacity=".18" strokeWidth="5" strokeLinecap="round"/></>:
    product.kind==='sleeve'? <><path d="M26 33Q50 19 74 33l-4 67q-20 14-40 0Z" fill="var(--product)"/><ellipse cx="50" cy="33" rx="24" ry="8" fill="#576151"/><path d="M33 46v47m8-46v50m9-50v53m9-53v50m9-51v47" stroke="#fff" opacity=".18"/><path d="M41 66h18" stroke="#eee8dc" strokeWidth="4"/></>:
    <><path d="M34 87C8 25 70 13 73 42c3 26-10 41-19 51" stroke="var(--product)" strokeWidth="12"/><rect x="31" y="79" width="27" height="23" rx="7" stroke="#676d6a" strokeWidth="5"/></>}
  </svg>;
}
export function OrderDemo() {
  const [selection,setSelection]=React.useState(DEFAULT_BOTTLE);
  const [tab,setTab]=React.useState<'product'|'order'>('product');
  const [cart,setCart]=React.useState<CartLine[]>([]);
  const [delivery,setDelivery]=React.useState<Delivery>('pickup');
  const [shop,setShop]=React.useState(initialShop);
  const [step,setStep]=React.useState(3);
  const [notice,setNotice]=React.useState('');
  const stage=React.useRef<HTMLDivElement>(null);
  const placing=React.useRef(false);
  const system=React.useRef<HTMLDivElement>(null);
  const latest=shop.orders[0];
  const count=cart.reduce((n,l)=>n+l.quantity,0);
  const busy=step<3;
  React.useEffect(()=>{
    if(step>=3)return;
    const timer=setTimeout(()=>setStep(v=>v+1),matchMedia('(prefers-reduced-motion: reduce)').matches?0:550);
    return ()=>clearTimeout(timer);
  },[step]);
  React.useEffect(()=>{if(!busy)placing.current=false;},[busy]);
  function add(product:Product) {
    setCart(lines=>lines.some(l=>l.id===product.id)?lines.map(l=>l.id===product.id?{...l,quantity:Math.min(l.quantity+1,9)}:l):[...lines,{...product,quantity:1}]);
    setNotice(`${product.title} в корзине`);
  }
  function quantity(id:string,delta:number){setCart(lines=>lines.map(l=>l.id===id?{...l,quantity:Math.min(9,l.quantity+delta)}:l).filter(l=>l.quantity>0));}
  function order(){
    if(!cart.length||busy||placing.current)return;
    placing.current=true;
    trackGoal("demo_order");
    setShop(s=>placeOrder(s,cart,delivery));setCart([]);setStep(0);setNotice('Демозаказ создан');
    requestAnimationFrame(()=>system.current?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}));
  }
  function go(next:'product'|'order') {setTab(next);requestAnimationFrame(()=>stage.current?.scrollIntoView({block:"start",behavior:"auto"}));}
  const tabKey=(event:React.KeyboardEvent<HTMLButtonElement>)=>{
    if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
    event.preventDefault();const next=event.key==='Home'?'product':event.key==='End'?'order':tab==='product'?'order':'product';setTab(next);
    document.getElementById(`demo-${next}-tab`)?.focus();
  };
  return <div className="order-demo" ref={stage}>
    <div className="order-nav"><div className="econ-tabs demo-tabs" role="tablist" aria-label="Путь заказа">
      {([['product','3D-конфигуратор'],['order','Магазин и CRM']] as const).map(([id,label])=><button type="button" role="tab" key={id} id={`demo-${id}-tab`} aria-controls={`demo-${id}-panel`} aria-selected={tab===id} tabIndex={tab===id?0:-1} className="econ-tab" onClick={()=>go(id)} onKeyDown={tabKey}>{label}{id==='order'&&count>0&&<span className="order-count">{count}</span>}</button>)}
    </div><span className="order-demo-label">Живое демо</span></div>
    <div id="demo-product-panel" role="tabpanel" aria-labelledby="demo-product-tab" hidden={tab!=='product'}>
      {tab==='product'&&<Configurator selection={selection} onChange={setSelection} onAdd={()=>{add(bottleProduct(selection));go('order');}}/>}
    </div>
    <div id="demo-order-panel" role="tabpanel" aria-labelledby="demo-order-tab" hidden={tab!=='order'}>
      {tab==='order'&&<div className="order-workspace">
        <div className="order-shop">
          <div className="order-panel-head"><div><span className="order-eyebrow">Со стороны покупателя</span><h3>Сборка store<span>.</span></h3></div><span className="order-bag" aria-label={`В корзине ${count}`}>{count}</span></div>
          <div className="order-catalog">
            {[bottleProduct(selection),...ACCESSORIES].map(product=><article className="order-product" key={product.id}>
              <ProductArt product={product}/><h4>{product.title}</h4><p>{product.kind==='bottle'?`${selection.size} мл · Свой дизайн`:product.detail}</p><strong>{money(product.price)}</strong>
              <button type="button" onClick={()=>add(product)} aria-label={`Добавить: ${product.title}`}>Добавить <span aria-hidden="true">+</span></button>
            </article>)}
          </div>
          <button type="button" className="ci-link" onClick={()=>go('product')}>Изменить бутылку ↗</button>
          <div className="order-cart"><div className="order-cart-title"><h4>Ваш заказ</h4><span>{count} шт</span></div>
            {cart.length? <ul>{cart.map(line=><li key={line.id}><div><strong>{line.title}</strong><p>{line.detail}</p><small>На складе: {available(shop,line.id)} шт</small></div><div className="order-line-end"><strong>{money(line.price*line.quantity)}</strong><div className="order-quantity"><button type="button" onClick={()=>quantity(line.id,-1)} aria-label={`Убрать одну: ${line.title}`}>−</button><output aria-label={`Количество: ${line.title}`}>{line.quantity}</output><button type="button" disabled={line.quantity>=9} onClick={()=>quantity(line.id,1)} aria-label={`Добавить одну: ${line.title}`}>+</button></div></div></li>)}</ul>:
            <p className="order-empty">{latest?'Добавьте товары для следующего заказа':'Выберите бутылку или аксессуар выше'}</p>}
            {cart.length>0&&<><fieldset><legend>Доставка</legend><div className="segmented"><button type="button" aria-pressed={delivery==='pickup'} onClick={()=>setDelivery('pickup')}>Самовывоз · 0 ₽</button><button type="button" aria-pressed={delivery==='courier'} onClick={()=>setDelivery('courier')}>Курьер · 390 ₽</button></div></fieldset>
            {cart.some(l=>l.quantity>available(shop,l.id))&&<p className="order-warning">Не все товары есть в наличии. Заказ попадет в CRM как предзаказ, без резерва</p>}
            <div className="order-checkout-total"><span>Итого</span><strong>{money(total(cart,delivery))}</strong></div><button className="order-primary" type="button" disabled={busy} onClick={order}>Оформить демозаказ <span aria-hidden="true">↗</span></button></>}
          </div>
          <p className="order-mini-note">Без оплаты и личных данных</p>
        </div>
        <div className="order-system" ref={system}>
          <div className="order-panel-head"><div><span className="order-eyebrow">Со стороны бизнеса</span><h3>За кулисами</h3></div><span className={`order-live ${busy?'is-busy':''}`}>{busy?'Обработка':'Система готова'}</span></div>
          <p className="order-system-intro">Один заказ связывает магазин, склад и CRM. Все изменения видны здесь</p>
          <div className="order-pipeline" aria-label="Обработка заказа" aria-live="polite">
            {['Заказ','Склад','CRM','Уведомление'].map((label,i)=><div key={label} data-active={!!latest&&step>=i}><span>{latest&&step>=i?'✓':i+1}</span><small>{label}</small></div>)}
          </div>
          {!latest?<div className="order-system-empty"><svg viewBox="0 0 80 80" aria-hidden="true"><path d="M20 26h40v40H20zM27 16h26v20H27zM28 48h24M28 56h15" fill="none" stroke="currentColor" strokeWidth="1.5"/></svg><h4>Здесь появится ваш заказ</h4><p>Оформите его слева и проследите каждый шаг</p><p className="order-tip">Для проверки предзаказа добавьте 4 одинаковых товара. В наличии только 3</p></div>:
          <div className="order-events" aria-live="polite">
            <div className="order-event" data-visible={step>=1} aria-hidden={step<1}><span className="order-eyebrow">Склад</span><strong>{latest.status==='cancelled'?'Резерв снят':latest.status==='preorder'?'Недостаточно товара':'Товары зарезервированы'}</strong><p>{latest.status==='preorder'?`${latest.shortage.join(', ')}: ожидаем поставку`:latest.status==='cancelled'?'Остатки снова доступны для заказа':'Остатки обновлены автоматически'}</p><div className="order-stock">{latest.lines.map(l=><span key={l.id}>{l.title} <b>{available(shop,l.id)} шт</b></span>)}</div></div>
            <div className="order-event order-crm" data-visible={step>=2} aria-hidden={step<2}><span className="order-eyebrow">Карточка CRM</span><div className="order-crm-title"><h4>Заказ №{String(latest.number).padStart(3,'0')}</h4><span className={`order-badge ${latest.status}`}>{latest.status==='reserved'?'Новый':latest.status==='preorder'?'Предзаказ':'Отменен'}</span></div><p>{latest.lines.map(l=>`${l.title} × ${l.quantity}`).join(', ')}</p><div className="order-crm-total"><span>{latest.delivery==='courier'?'Курьер':'Самовывоз'}</span><strong>{money(latest.total)}</strong></div></div>
            <div className="order-event order-notification" data-visible={step>=3} aria-hidden={step<3}><span className="order-eyebrow">Демоуведомление менеджеру</span><strong>{latest.status==='cancelled'?'Заказ отменен':latest.status==='preorder'?'Нужно согласовать срок поставки':'Новый заказ готов к сборке'}</strong><p>№{String(latest.number).padStart(3,'0')} · {money(latest.total)}</p></div>
          </div>}
          {shop.orders.length>0&&<div className="order-history"><h4>Заказы в CRM</h4>{shop.orders.map(o=><div key={o.number}><span>№{String(o.number).padStart(3,'0')} · {money(o.total)}</span>{o.status==='cancelled'?<small>Отменен</small>:<button className="ci-link" type="button" disabled={busy} onClick={()=>{setShop(s=>cancelOrder(s,o.number));setNotice(`Заказ №${o.number} отменен, резерв снят`);}}>Отменить<span className="sr-only"> заказ {o.number}</span></button>}</div>)}</div>}
          <button type="button" className="ci-link order-reset" disabled={busy} onClick={()=>{setShop(initialShop());setCart([]);setNotice('Демо сброшено, на складе снова по 3 товара');}}>Сбросить демо</button>
        </div>
      </div>}
    </div>
    <span className="sr-only" role="status">{notice}</span>
  </div>;
}
