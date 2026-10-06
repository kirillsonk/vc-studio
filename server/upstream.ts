/** Server-only routing. A partially configured relay must never fall back to direct keys */
export interface UpstreamEnv {
  RELAY_URL?: string;
  RELAY_SECRET?: string;
  RELAY_CLIENT?: string;
  OPENAI_API_KEY?: string;
  CHATGPT_PLATFORM_API_KEY?: string;
  OPENAI_MODEL?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_CHAT_ID?: string;
}
function relay(env: UpstreamEnv) {
  if (!env.RELAY_URL && !env.RELAY_SECRET) return null;
  const url = new URL(env.RELAY_URL || '');
  if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || url.pathname !== '/') throw new Error('invalid_relay_url');
  if ((env.RELAY_SECRET?.length || 0) < 32) throw new Error('invalid_relay_secret');
  const client = env.RELAY_CLIENT || 'sborka';
  if (!/^[a-z][a-z0-9_]{0,31}$/.test(client)) throw new Error('invalid_relay_client');
  return {origin:url.origin, headers:{'X-Relay-Secret':env.RELAY_SECRET!, 'X-Relay-Client':client}};
}
export function hasAi(env: UpstreamEnv) {
  try { return !!(relay(env) || env.OPENAI_API_KEY || env.CHATGPT_PLATFORM_API_KEY); } catch { return false; }
}
export function hasTelegram(env: UpstreamEnv) {
  try { return !!(relay(env) || (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID)); } catch { return false; }
}
export function rateSecret(env: UpstreamEnv) {
  return env.RELAY_SECRET || env.OPENAI_API_KEY || env.CHATGPT_PLATFORM_API_KEY || env.TELEGRAM_BOT_TOKEN || '';
}
export function aiTarget(env: UpstreamEnv) {
  const via=relay(env);
  return via ? {url:via.origin+'/openai/v1/responses',headers:via.headers} : {
    url:'https://api.openai.com/v1/responses',headers:{Authorization:`Bearer ${env.OPENAI_API_KEY || env.CHATGPT_PLATFORM_API_KEY || ''}`},
  };
}
export function telegramTarget(env: UpstreamEnv, text:string) {
  const via=relay(env);
  return {
    url:via ? via.origin+'/telegram/sendMessage' : `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`,
    headers:via?.headers || {},
    body:{text,parse_mode:'HTML',link_preview_options:{is_disabled:true},...(!via ? {chat_id:env.TELEGRAM_CHAT_ID} : {})},
  };
}
/** One retry for fast transient failures, within a single 19-second budget including body reads */
export async function requestAi(env:UpstreamEnv,body:unknown,fetcher:typeof fetch=fetch,signal?:AbortSignal) {
  const target=aiTarget(env);
  const payload=JSON.stringify(body);
  // Keep the entire dialog. Oversized relay requests use the local brief rather
  // than silently dropping earlier answers or making a guaranteed failing call.
  if(relay(env) && new TextEncoder().encode(payload).byteLength>64*1024) throw new Error('model_context_budget');
  const budget=AbortSignal.timeout(19_000);
  const combined=signal ? AbortSignal.any([budget,signal]) : budget;
  const started=Date.now();
  for(let attempt=0;attempt<2;attempt++) {
    try {
      combined.throwIfAborted();
      const response=await fetcher(target.url,{method:'POST',redirect:'error',headers:{'Content-Type':'application/json',...target.headers},body:payload,signal:combined});
      if(!response.ok) {
        if(!attempt && Date.now()-started<2000 && (response.status===429 || response.status>=500)) {await response.body?.cancel();continue;}
        return {ok:false as const,status:response.status};
      }
      return {ok:true as const,data:await response.json()};
    } catch(error) {
      if(combined.aborted || (error instanceof Error && ['AbortError','TimeoutError','SyntaxError'].includes(error.name)) || attempt || Date.now()-started>=2000)throw error;
    }
  }
  throw new Error('model_unavailable');
}
