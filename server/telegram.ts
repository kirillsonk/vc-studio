import { z } from 'zod';
import { hasTelegram, telegramTarget } from './upstream';
import { nextRequestSchema } from './intake';
import type { Env } from './worker';
import { intakeState, type Receipt } from './intake-state';
import { detectContact } from '../src/site/intake/contacts';

const contact = (kind: string) => z.string().max(200).refine(v => detectContact(v)?.kind === kind);
export const submitSchema = nextRequestSchema.omit({forceSummary:true}).extend({
  summary: z.object({title:z.string().trim().min(1).max(160),items:z.array(z.object({label:z.string().min(1).max(100),value:z.string().max(800)}).strict()).min(1).max(8)}).strict(),
  contacts:z.object({email:contact('email').optional(),telegram:contact('telegram').optional(),phone:contact('phone').optional()}).strict().refine(v=>Object.values(v).some(Boolean)),
  contactNote:z.string().max(1000).optional(),
  contactConfirmed:z.literal(true),
  phoneChannel:z.enum(['call','whatsapp','telegram']).optional(),
  assessment:z.object({complexity:z.enum(['low','medium','high','unknown']),notes:z.string().max(600),nextMissing:z.string().max(200)}).strict().optional(),
  consent:z.literal(true),page:z.string().url().max(1500),utm:z.record(z.string().max(50),z.string().max(300)).refine(v=>Object.keys(v).length<=10),
}).strict().refine(v=>!v.contacts.phone || !!v.phoneChannel, {message:"phone_channel_required"});
type Lead = z.infer<typeof submitSchema>;
class TelegramError extends Error { constructor(public uncertain: boolean) { super('telegram_unavailable'); } }
async function call(token:string, method:string, data:unknown, fetcher:typeof fetch) {
  let r:Response;
  try { r=await fetcher(`https://api.telegram.org/bot${token}/${method}`, {method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(6000)}); }
  catch { throw new TelegramError(true); }
  let body;
  try { body=await r.json() as {ok:boolean;result:unknown}; } catch {throw new TelegramError(true);}
  if(!body.ok) throw new TelegramError(r.status>=500);
  return body.result;
}
export async function discoverTelegram(env:Env,fetcher:typeof fetch) {
  if(!env.TELEGRAM_BOT_TOKEN) throw new Error('not_configured');
  const bot=await call(env.TELEGRAM_BOT_TOKEN,'getMe',{},fetcher) as {username:string};
  if(bot.username!=='sborka_applications_bot') throw new Error('unexpected_bot');
  const updates=await call(env.TELEGRAM_BOT_TOKEN,'getUpdates',{limit:100,timeout:0,allowed_updates:['message','my_chat_member']},fetcher) as Array<{message?:{text?:string;chat:{id:number;type:string;title?:string}};my_chat_member?:{chat:{id:number;type:string;title?:string}}}>;
  const chats=new Map<number,unknown>();
  for(const u of updates){const chat=u.message?.chat || u.my_chat_member?.chat;if(chat && ['group','supergroup'].includes(chat.type)) chats.set(chat.id,{id:chat.id,type:chat.type,title:chat.title});}
  return {bot:bot.username,chats:[...chats.values()],updates:updates.length};
}
const escapeHtml = (s:string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const CHANNEL = {call:'Звонок',whatsapp:'WhatsApp',telegram:'Telegram'};
export function leadMessages(lead:Lead, receipt:Receipt={number:1,created:Math.floor(Date.now()/1000)}) {
  const date=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',dateStyle:'short',timeStyle:'short'}).format(new Date(receipt.created*1000));
  const sections: Array<[string,string]> = [
    ['Контакты, подтверждены клиентом', Object.entries(lead.contacts).map(([k,v])=>`${{email:'Email',telegram:'Telegram',phone:'Телефон'}[k]}: ${v}`).join('\n') + (lead.phoneChannel ? `\nПо телефону: ${CHANNEL[lead.phoneChannel]}` : '')],
    ['Бриф, проверен клиентом',lead.summary.title+'\n'+lead.summary.items.map(i=>`${i.label}: ${i.value}`).join('\n')],
    ['AI: предварительный разбор',lead.assessment ? [
      `Сложность: ${{low:'низкая',medium:'средняя',high:'высокая',unknown:'недостаточно данных'}[lead.assessment.complexity]}`,
      lead.assessment.notes && `Для обсуждения: ${lead.assessment.notes}`,
      lead.assessment.nextMissing && `Уточнить: ${lead.assessment.nextMissing}`,
      'Оценка предварительная, требует проверки разработчиком',
    ].filter(Boolean).join('\n') : 'AI-разбор недоступен. Бриф собран резервным сценарием, нужна оценка разработчика'],
    ['Клиент: исходный запрос',lead.task],
  ];
  lead.answers.forEach((a,i)=>sections.push([`Ассистент: вопрос ${i+1}`,a.question],[`Клиент: ответ ${i+1}`,a.answer||'Вопрос пропущен']));
  if(lead.contactNote)sections.push(['Клиент: при отправке',lead.contactNote]);
  // Split raw content before HTML wrapping. Every message contains balanced tags;
  // escaped entities and surrogate pairs stay intact, including hostile user markup.
  const blocks:string[]=[];
  for(const [label,value] of sections){
    let part='';let continuation=false;
    for(const char of value){
      const escaped=escapeHtml(char);
      if(part.length+escaped.length>3000){blocks.push(`<b>${escapeHtml(label)}${continuation?' (продолжение)':''}</b>\n${part}`);part='';continuation=true;}
      part+=escaped;
    }
    blocks.push(`<b>${escapeHtml(label)}${continuation?' (продолжение)':''}</b>\n${part}`);
  }
  const chunks:string[]=[];let chunk='';
  for(const block of blocks){if(chunk && chunk.length+block.length+2>3650){chunks.push(chunk);chunk='';}chunk+=(chunk?'\n\n':'')+block;}
  if(chunk)chunks.push(chunk);
  return chunks.map((part,i)=>`<b>Заявка №${String(receipt.number).padStart(3,'0')}</b>${chunks.length>1?` · ${i+1}/${chunks.length}`:''}\n${date} МСК\n\n${part}`);
}
export async function deliverLead(lead:Lead,env:Env,fetcher:typeof fetch,signal?:AbortSignal) {
  const state = intakeState(env);
  if(!state || !hasTelegram(env)) return {ok:false as const,error:'delivery_not_configured'};
  const now=Math.floor(Date.now()/1000);
  const digest = async (value:string) => Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value))),b=>b.toString(16).padStart(2,'0')).join('');
  const hash=await digest(JSON.stringify(lead));
  // Stable across process restarts, with a compact reference for Telegram only.
  const code=(await digest(lead.sessionId)).slice(0,10).toUpperCase();
  const locked=await state.claim(lead.sessionId,hash,`${code.slice(0,5)}-${code.slice(5)}`,now);
  if(locked.status==='conflict')return {ok:false as const,error:'submission_conflict'};
  if(locked.status==='sent')return {ok:true as const,id:lead.sessionId,number:locked.receipt.number};
  if(locked.status==='uncertain')return {ok:false as const,error:'delivery_uncertain'};
  if(locked.status==='in_progress')return {ok:false as const,error:'delivery_in_progress'};
  const receipt=locked.receipt;
  try{
    const chunks=leadMessages(lead,receipt);
    const budget=AbortSignal.timeout(40_000);
    const deliverySignal=signal ? AbortSignal.any([budget,signal]) : budget;
    for(let i=locked.cursor;i<chunks.length;i++){
      // No current request was sent, so a retry can safely resume at the cursor.
      if(deliverySignal.aborted)throw new TelegramError(false);
      const target = telegramTarget(env,chunks[i]);
      let response;
      try {
        const r=await fetcher(target.url,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...target.headers},body:JSON.stringify(target.body),signal:AbortSignal.any([deliverySignal,AbortSignal.timeout(30_000)])});
        response=await r.json() as {ok:boolean};
        if(!response.ok)throw new TelegramError(r.status>=500);
      } catch(error) {throw error instanceof TelegramError ? error : new TelegramError(true);}
      await state.progress(lead.sessionId,i+1,Math.floor(Date.now()/1000));
    }
    await state.finish(lead.sessionId,'sent',Math.floor(Date.now()/1000));
    return {ok:true as const,id:lead.sessionId,number:receipt.number};
  }catch(e){
    const uncertain=!(e instanceof TelegramError)||e.uncertain;
    await state.finish(lead.sessionId,uncertain?'uncertain':'failed',Math.floor(Date.now()/1000));
    return {ok:false as const,error:uncertain?'delivery_uncertain':'delivery_failed'};
  }
}
