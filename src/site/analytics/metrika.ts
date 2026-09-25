export const GOALS = ['intake_open','intake_start','brief_ready','contact_review','lead_sent','demo_order'] as const;
export type Goal = typeof GOALS[number];
type YM = ((...args: unknown[]) => void) & {a?:unknown[][];l?:number};
declare global { interface Window { ym?: YM } }
let counter:number|null=null;
let initialized=false;
let pending:Goal[]=[];
let lastPath='';
function send(...args:unknown[]) { try {window.ym?.(...args);} catch { /* Analytics must never interrupt checkout or intake */ } }
export function validCounter(value:unknown):number|null {
  if(!/^[1-9]\d{0,11}$/.test(String(value)))return null;
  return Number(value);
}
// Only fixed event names. Never accept contacts, messages, IDs or arbitrary parameters.
export function trackGoal(goal:Goal) {
  if(typeof window==='undefined'||!GOALS.includes(goal))return;
  if(!initialized){if(pending.length<20)pending.push(goal);return;}
  if(counter)send(counter,'reachGoal',goal);
}
export function pageView(path:string) {
  if(!counter||path===lastPath)return;
  // Site routes are fixed; do not forward query strings, hashes or arbitrary paths.
  const safePath=['/','/case','/kit','/report'].includes(path)?path:'/';
  lastPath=path;
  let referer='';
  try {referer=document.referrer?new URL(document.referrer).origin:'';}catch{}
  send(counter,'hit',location.origin+safePath,{referer,title:'Сборка'});
}
export function startMetrika(value:unknown,path:string) {
  if(initialized)return;
  initialized=true;
  counter=validCounter(value);
  if(!counter){pending=[];return;}
  window.ym=window.ym||Object.assign((...args:unknown[])=>{(window.ym!.a ||= []).push(args);},{l:Date.now()});
  send(counter,'init',{defer:true,webvisor:false,clickmap:false,trackLinks:false,trackHash:false,sendTitle:false,disableYtm:true,ecommerce:false,accurateTrackBounce:true});
  pageView(path);
  const script=document.createElement('script');
  script.src='https://mc.yandex.ru/metrika/tag.js';script.async=true;
  document.head.appendChild(script);
  for(const goal of pending)trackGoal(goal);
  pending=[];
}
