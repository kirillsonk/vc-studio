import { z } from 'zod';
import { nextRequestSchema } from './intake';
import type { Env } from './worker';
import { detectContact } from '../src/site/intake/contacts';

const contact = (kind: string) => z.string().max(200).refine(v => detectContact(v)?.kind === kind);
export const submitSchema = nextRequestSchema.omit({forceSummary:true}).extend({
  summary: z.object({title:z.string().trim().min(1).max(160),items:z.array(z.object({label:z.string().min(1).max(100),value:z.string().max(800)}).strict()).min(1).max(8)}).strict(),
  contacts:z.object({email:contact('email').optional(),telegram:contact('telegram').optional(),phone:contact('phone').optional()}).strict().refine(v=>Object.values(v).some(Boolean)),
  consent:z.literal(true),page:z.string().url().max(1500),utm:z.record(z.string().max(50),z.string().max(300)).refine(v=>Object.keys(v).length<=10),
}).strict();
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
  const updates=await call(env.TELEGRAM_BOT_TOKEN,'getUpdates',{limit:100,timeout:0},fetcher) as Array<{message?:{text?:string;chat:{id:number;type:string;title?:string}}}>;
  const chats=new Map<number,unknown>();
  for(const u of updates){const m=u.message;if(m && ['group','supergroup'].includes(m.chat.type) && /^\/start(?:@sborka_applications_bot)?(?:\s|$)/i.test(m.text||'')) chats.set(m.chat.id,m.chat);}
  return {bot:bot.username,chats:[...chats.values()]};
}
export function leadMessages(lead:Lead) {
  const text=[`Новая заявка · ${lead.sessionId}`,lead.summary.title,'',...Object.entries(lead.contacts).map(([k,v])=>`${k}: ${v}`),'',...lead.summary.items.map(i=>`${i.label}: ${i.value}`),'','Исходная задача',lead.task,'',...lead.answers.flatMap(a=>[a.question,a.answer||'Вопрос пропущен','']),`Страница: ${lead.page}`,...Object.entries(lead.utm).map(([k,v])=>`${k}: ${v}`)].join('\n');
  const chunks:string[]=[];
  // Stay below Telegram's UTF-16 limit without splitting a surrogate pair
  let chunk='';for(const char of text){if(chunk.length+char.length>3900){chunks.push(chunk);chunk='';}chunk+=char;}if(chunk)chunks.push(chunk);
  return chunks.map((s,i)=>chunks.length>1?`Заявка ${lead.sessionId} · ${i+1}/${chunks.length}\n${s}`:s);
}
export async function deliverLead(lead:Lead,env:Env,fetcher:typeof fetch) {
  if(!env.DB || !env.TELEGRAM_BOT_TOKEN || !env.TELEGRAM_CHAT_ID) return {ok:false as const,error:'delivery_not_configured'};
  const now=Math.floor(Date.now()/1000);
  const payload=JSON.stringify(lead);
  const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(payload));
  const hash=Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('');
  await env.DB.prepare('DELETE FROM intake_leads WHERE expires < ?').bind(now).run();
  await env.DB.prepare("INSERT INTO intake_leads (id, hash, payload, status, cursor, updated, expires) VALUES (?, ?, ?, 'pending', 0, ?, ?) ON CONFLICT(id) DO NOTHING").bind(lead.sessionId,hash,payload,now,now+30*86400).run();
  const row=await env.DB.prepare('SELECT hash, status, cursor, updated FROM intake_leads WHERE id = ?').bind(lead.sessionId).first<{hash:string;status:string;cursor:number;updated:number}>();
  if(!row || row.hash!==hash)return {ok:false as const,error:'submission_conflict'};
  if(row.status==='sent')return {ok:true as const,id:lead.sessionId};
  // An interrupted send may have reached Telegram. Do not blindly resend it
  if(row.status==='uncertain' || (row.status==='sending' && row.updated<now-60)) return {ok:false as const,error:'delivery_uncertain'};
  const locked=await env.DB.prepare("UPDATE intake_leads SET status = 'sending', updated = ? WHERE id = ? AND status IN ('pending', 'failed') RETURNING cursor").bind(now,lead.sessionId).first<{cursor:number}>();
  if(!locked)return {ok:false as const,error:'delivery_in_progress'};
  try{
    const chunks=leadMessages(lead);
    for(let i=locked.cursor;i<chunks.length;i++){
      await call(env.TELEGRAM_BOT_TOKEN,'sendMessage',{chat_id:env.TELEGRAM_CHAT_ID,text:chunks[i],link_preview_options:{is_disabled:true}},fetcher);
      await env.DB.prepare('UPDATE intake_leads SET cursor = ?, updated = ? WHERE id = ?').bind(i+1,Math.floor(Date.now()/1000),lead.sessionId).run();
    }
    await env.DB.prepare("UPDATE intake_leads SET status = 'sent', updated = ? WHERE id = ?").bind(Math.floor(Date.now()/1000),lead.sessionId).run();
    return {ok:true as const,id:lead.sessionId};
  }catch(e){
    const uncertain=!(e instanceof TelegramError)||e.uncertain;
    await env.DB.prepare('UPDATE intake_leads SET status = ?, updated = ? WHERE id = ?').bind(uncertain?'uncertain':'failed',Math.floor(Date.now()/1000),lead.sessionId).run();
    return {ok:false as const,error:uncertain?'delivery_uncertain':'delivery_failed'};
  }
}
