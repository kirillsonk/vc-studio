export type BottleSelection = {color:string; size:'500'|'750'; cap:'classic'|'sport'};
export const DEFAULT_BOTTLE:BottleSelection = {color:'graphite',size:'750',cap:'classic'};
export const COLORS = [
  {id:'graphite',name:'Графит',value:'#2b2d31'}, {id:'chalk',name:'Мел',value:'#e8e5dd'},
  {id:'vermilion',name:'Вермильон',value:'#c94320'}, {id:'sage',name:'Шалфей',value:'#8d9a87'}, {id:'sand',name:'Песок',value:'#c8b393'},
];
export type Product = {id:string;title:string;detail:string;price:number;color:string;kind:'bottle'|'sleeve'|'strap'};
export type CartLine = Product & {quantity:number};
export const ACCESSORIES:Product[] = [
  {id:'sleeve',title:'Термочехол',detail:'Мягкая защита для бутылки',price:590,color:'#8d9a87',kind:'sleeve'},
  {id:'strap',title:'Ремешок',detail:'Свободные руки в городе',price:290,color:'#c94320',kind:'strap'},
];
export function bottleProduct(s:BottleSelection):Product {
  const c=COLORS.find(c=>c.id===s.color)!;
  return {id:`bottle-${s.color}-${s.size}-${s.cap}`,title:'Термобутылка',detail:`${c.name} · ${s.size} мл · ${s.cap==='sport'?'Спортивная':'Классическая'}`,price:(s.size==='500'?1990:2390)+(s.cap==='sport'?300:0),color:c.value,kind:'bottle'};
}
export const money=(value:number)=>new Intl.NumberFormat('ru-RU').format(value)+' ₽';
export type Delivery='pickup'|'courier';
export type Order={number:number;lines:CartLine[];delivery:Delivery;total:number;status:'reserved'|'preorder'|'cancelled';shortage:string[]};
export type ShopState={stock:Record<string,number>;orders:Order[];next:number};
export const initialShop=():ShopState=>({stock:{},orders:[],next:1});
export const available=(s:ShopState,id:string)=>s.stock[id]??3;
export const total=(lines:CartLine[],delivery:Delivery)=>lines.reduce((n,l)=>n+l.price*l.quantity,0)+(delivery==='courier'&&lines.length?390:0);
export function placeOrder(s:ShopState,lines:CartLine[],delivery:Delivery):ShopState {
  if(!lines.length || lines.some(l=>!Number.isInteger(l.quantity)||l.quantity<1||l.quantity>9)||new Set(lines.map(l=>l.id)).size!==lines.length)return s;
  const shortage=lines.filter(l=>available(s,l.id)<l.quantity).map(l=>l.title);
  const stock={...s.stock};
  if(!shortage.length) for(const l of lines)stock[l.id]=available(s,l.id)-l.quantity;
  const order:Order={number:s.next,lines:lines.map(l=>({...l})),delivery,total:total(lines,delivery),status:shortage.length?'preorder':'reserved',shortage};
  return {stock,orders:[order,...s.orders],next:s.next+1};
}
export function cancelOrder(s:ShopState,number:number):ShopState {
  const order=s.orders.find(o=>o.number===number);if(!order||order.status==='cancelled')return s;
  const stock={...s.stock};
  if(order.status==='reserved')for(const l of order.lines)stock[l.id]=available(s,l.id)+l.quantity;
  return {...s,stock,orders:s.orders.map(o=>o.number===number?{...o,status:'cancelled'}:o)};
}
