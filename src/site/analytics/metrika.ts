// Public counter for sborkadigital.ru; the server environment may override or disable it
export const METRIKA_COUNTER_ID = 113480948;
export const GOALS = ['intake_open','intake_start','brief_ready','contact_review','lead_sent','demo_order'] as const;
export type Goal = typeof GOALS[number];
type YM = ((...args: unknown[]) => void) & {a?:unknown[][];l?:number};
declare global { interface Window { ym?: YM } }
let counter:number|null=null;
let initialized=false;
let pending:Goal[]=[];
let lastPath='';
// Only our fixed campaign labels may enter analytics. Never forward arbitrary
// query values, search terms, contact fields or the intake fragment.
export function campaignQuery(search:string):string {
  const source=new URLSearchParams(search);
  const safe=new URLSearchParams();
  const labels:Record<string,readonly string[]>={
    utm_source:['yandex'],utm_medium:['cpc'],
    utm_campaign:['sborka_smoke_v1'],
    utm_content:['ai_price','clear_estimate','control','qa'],
  };
  for(const [key,values] of Object.entries(labels)) {
    const value=source.get(key);
    if(source.getAll(key).length===1 && value && values.includes(value))safe.set(key,value);
  }
  // Direct's opaque click identifier is needed for ad attribution.
  const click=source.get('yclid');
  if(source.getAll('yclid').length===1 && click && /^\d{1,30}$/.test(click))safe.set('yclid',click);
  return safe.size?`?${safe.toString()}`:'';
}
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
  // Site routes are fixed; only explicitly allowed campaign markers survive.
  const safePath=['/','/case','/kit','/report'].includes(path)?path:'/';
  lastPath=path;
  let referer='';
  try {referer=document.referrer?new URL(document.referrer).origin:'';}catch{}
  send(counter,'hit',location.origin+safePath+campaignQuery(location.search||''),{referer,title:'Сборка'});
}
export function startMetrika(value:unknown,path:string) {
  if(initialized)return;
  initialized=true;
  counter=validCounter(value);
  if(!counter){pending=[];return;}
  window.ym=window.ym||Object.assign((...args:unknown[])=>{(window.ym!.a ||= []).push(args);},{l:Date.now()});
  send(counter,'init',{ssr:true,defer:true,webvisor:true,clickmap:true,trackLinks:true,trackHash:false,sendTitle:false,disableYtm:true,ecommerce:'dataLayer',accurateTrackBounce:true});
  pageView(path);
  const script=document.createElement('script');
  script.src=`https://mc.yandex.ru/metrika/tag.js?id=${counter}`;script.async=true;
  document.head.appendChild(script);
  for(const goal of pending)trackGoal(goal);
  pending=[];
}
