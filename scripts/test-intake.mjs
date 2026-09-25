import { build } from "esbuild";
import { mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { DatabaseSync } from "node:sqlite";
import test from "node:test";
import assert from "node:assert/strict";

const temp = await mkdtemp(join(tmpdir(), "sborka-test-"));
await build({ entryPoints: ["server/intake.ts", "server/worker.ts", "server/telegram.ts", "src/site/intake/contacts.ts", "src/site/intake/mock.ts", "src/site/demos/order-model.ts", "src/site/analytics/metrika.ts"], outdir: temp, entryNames:"[name]", bundle: true, format: "esm", platform: "node" });
const { nextRequestSchema, generateNext, cleanCopy } = await import(pathToFileURL(join(temp, "intake.js")));
const { handle, consumeLimit } = await import(pathToFileURL(join(temp, "worker.js")));
const req = { schemaVersion: 1, sessionId: "test-session-123456", service: null, task: "Нужен сайт", answers: [], forceSummary: false };
const question = { type: "question", message: "Уточню детали", question: "Для кого делаем проект?", options: ["Для компании", "Для агентства"], summary: { title: "", items: [] }, internal: { knownFacts:{scope:"Нужен сайт",users:"",materials:"",systems:"",deadline:"",budget:""},nextMissing:"Пользователи",clientType: "unknown", complexity: "unknown", notes: "private note" } };
const summary = { ...question, type: "summary", question: "", options: [], summary: { title: "Сайт", items: [{ label: "Задача", value: "Нужен сайт" }] } };
const upstream = value => async () => {
  const turn = value.type === "question" ? {type:value.type,message:value.message,question:value.question,options:value.options} : {type:value.type,message:value.message,summary:value.summary};
  return Response.json({ status: "completed", output: [{ type: "message", content: [{ type: "output_text", text: JSON.stringify({turn,internal:value.internal}) }] }] });
};
async function database() {
  const db = new DatabaseSync(":memory:");
  for (const f of (await readdir("drizzle")).filter(x=>x.endsWith('.sql')).sort()) db.exec(await readFile(`drizzle/${f}`,"utf8"));
  return { db, env: { CHATGPT_PLATFORM_API_KEY: "unit-test-only", DB: { prepare(sql) { return { bind(...args) { return { first: async () => db.prepare(sql).get(...args) ?? null, run: async () => db.prepare(sql).run(...args) }; } }; } } } };

}
const request = (body = req, overrides = {}) => new Request("https://site.example/api/intake/next", {
  method: "POST", headers: { Origin: "https://site.example", "Content-Type": "application/json", "CF-Connecting-IP": "192.0.2.1" }, body: JSON.stringify(body), ...overrides,
});

await test("input rejects oversized data, unknown fields, contacts and unsupported schema", () => {
  for (const body of [ { ...req, task: "x".repeat(8001) }, { ...req, contacts: { email: "a@example.com" } }, { ...req, schemaVersion: 2 }, { ...req, sessionId: "../bad" }, { ...req, answers: Array(6).fill({ question: "?", answer: "" }) }, { ...req, answers: [{ question: "?", answer: "x".repeat(4001) }] } ]) assert.equal(nextRequestSchema.safeParse(body).success, false);
  assert.equal(nextRequestSchema.safeParse({ ...req, task: "x".repeat(4000) }).success, true);
});
await test("model request excludes session and recognizable free-text contacts; no storage", async () => {
  let sent;
  const result = await generateNext({ ...req, task: "Пишите a@example.com, @somebody или +7 (999) 123-45-67, https://x.example/?email=a@example.com" }, "test-key", async (url, options) => {
    assert.equal(url, "https://api.openai.com/v1/responses");
    sent = JSON.parse(options.body);
    return upstream(question)();
  });
  const input = JSON.stringify(sent.input);
  for (const secret of ["a@example.com", "@somebody", "999", req.sessionId, "test-key"]) assert.equal(input.includes(secret), false);
  assert.equal(sent.store, false);
  assert.equal(sent.text.format.strict, true);
  assert.equal(JSON.stringify(sent.text.format.schema).includes('"oneOf"'), false);
  assert.equal(sent.text.format.schema.properties.turn.anyOf.length, 2);
  assert.equal("internal" in result, false);
});
await test("forced or five-answer flow cannot receive another question", async () => {
  for (const input of [{ ...req, forceSummary: true }, { ...req, answers: Array(5).fill({ question: "Вопрос?", answer: "" }) }]) {
    await assert.rejects(() => generateNext(input, "test", upstream(question)));
    assert.equal((await generateNext(input, "test", upstream(summary))).type, "summary");
  }
});
await test("invalid JSON, refusals, incomplete and excess options fail closed", async () => {
  const replies = [Response.json({status:"incomplete"}), Response.json({status:"completed",output:[{type:"message",content:[{type:"refusal"}]}]}), Response.json({status:"completed",output:[{type:"message",content:[{type:"output_text",text:"not-json"}]}]})];
  for (const reply of replies) await assert.rejects(() => generateNext(req, "test", async () => reply));
  await assert.rejects(() => generateNext(req, "test", upstream({ ...question, options: Array(5).fill("Option") })));
  await assert.rejects(() => generateNext({ ...req, answers: [{ question: question.question, answer: "" }] }, "test", upstream(question)));
});
await test("TOV normalization removes forbidden characters and trailing dots", () => {
  assert.equal(cleanCopy("Вс\u0451 \u2014 готово."), "Все, готово");
  assert.equal(cleanCopy("ИИ отвечает"), "AI отвечает");
});
await test("real SQL counter is atomic across parallel requests and expires", async () => {
  const { env, db } = await database();
  const calls = await Promise.all(Array.from({ length: 40 }, () => consumeLimit(env, "test", 30, 600, 1000)));
  assert.equal(calls.filter(r => r.allowed).length, 30);
  assert.equal((await consumeLimit(env, "test", 30, 600, 1600)).allowed, true);
  db.close();
});
await test("HTTP gateway validates origin and content, hides failures, disables submit", async () => {
  const { env, db } = await database();
  let calls = 0;
  const fetcher = async () => { calls++; return upstream(question)(); };
  assert.equal((await handle(request(req, { headers: { Origin: "https://evil.example", "Content-Type": "application/json" } }), env, fetcher)).status, 403);
  assert.equal((await handle(request(req, { headers: { Origin: "https://site.example", "Content-Type": "text/plain" } }), env, fetcher)).status, 415);
  assert.equal((await handle(request({ ...req, task: "x".repeat(25000) }), env, fetcher)).status, 400);
  assert.equal(calls, 0);
  assert.equal((await handle(request(), env, fetcher)).status, 200);
  assert.equal(calls, 1);
  const failure = await handle(request(), env, async () => Response.json({ secret: "should-not-leak" }, { status: 401 }));
  assert.equal(failure.status, 502);
  assert.equal((await failure.text()).includes("should-not-leak"), false);
  assert.equal((await handle(request(), { CHATGPT_PLATFORM_API_KEY: "test" }, fetcher)).status, 503);
  const submit = new Request("https://site.example/api/intake/submit", { method: "POST", headers: { Origin: "https://site.example", "Content-Type": "application/json" }, body: "{}" });
  assert.deepEqual(await (await handle(submit, env, fetcher)).json(), { ok: false, error: "delivery_not_configured" });
  db.close();
});
await test("HTTP limits requests before OpenAI and stores no raw IP or task", async () => {
  const { env, db } = await database();
  for (let i = 0; i < 30; i++) assert.equal((await handle(request(), env, upstream(question))).status, 200);
  const response = await handle(request(), env, () => { throw new Error("must not call"); });
  assert.equal(response.status, 429);
  assert.ok(Number(response.headers.get("Retry-After")) > 0);
  const rows = JSON.stringify(db.prepare("SELECT * FROM intake_limits").all());
  assert.equal(rows.includes("192.0.2.1"), false);
  assert.equal(rows.includes(req.task), false);
  db.close();
});
const {deliverLead,submitSchema,leadMessages}=await import(pathToFileURL(join(temp,"telegram.js")));
const {extractContacts}=await import(pathToFileURL(join(temp,"contacts.js")));
const lead={schemaVersion:1,sessionId:"lead-test-session-123",service:null,task:"Нужен сайт",answers:[],summary:{title:"Сайт",items:[{label:"Задача",value:"Нужен сайт"}]},contacts:{email:"test@example.com"},contactConfirmed:true,consent:true,page:"https://site.example/",utm:{}};
await test("free text extracts explicit contacts without treating ordinary English as Telegram",()=>{
  assert.deepEqual(extractContacts("Website for product launch"),[]);
  const cs=extractContacts("Нужен сайт, почта test@example.com, пишите @sample_user или +7 (999) 123-45-67");
  assert.deepEqual(cs.map(c=>c.kind).sort(),["email","phone","telegram"]);
  assert.equal(cs.find(c=>c.kind==='telegram').value,'@sample_user');
  assert.equal(submitSchema.safeParse({...lead,consent:false}).success,false);
});
await test("confirmed delivery is idempotent under concurrent and repeated submissions",async()=>{
  const {env,db}=await database();Object.assign(env,{TELEGRAM_BOT_TOKEN:'test-token',TELEGRAM_CHAT_ID:'-123'});
  let sent=0;
  const fetcher=async(url,opts)=>{sent++;const b=JSON.parse(opts.body);assert.equal(b.chat_id,'-123');assert.equal(b.parse_mode,'HTML');return Response.json({ok:true,result:{message_id:sent}});};
  await Promise.all([deliverLead(lead,env,fetcher),deliverLead(lead,env,fetcher)]);
  assert.equal((await deliverLead(lead,env,fetcher)).ok,true);assert.equal(sent,1);
  assert.equal((await deliverLead({...lead,task:'Другая задача'},env,fetcher)).error,'submission_conflict');
  db.close();
});
await test("failed delivery resumes confirmed chunks; ambiguous network failure is not resent",async()=>{
  const {env,db}=await database();Object.assign(env,{TELEGRAM_BOT_TOKEN:'test-token',TELEGRAM_CHAT_ID:'-123'});
  const long={...lead,task:'x'.repeat(4000)};assert.ok(leadMessages(long).every(s=>s.length<=4096));
  let sent=0;const fetcher=async()=>{sent++;return Response.json(sent===2?{ok:false}:{ok:true,result:{message_id:sent}},{status:sent===2?403:200});};
  assert.equal((await deliverLead(long,env,fetcher)).error,'delivery_failed');
  assert.equal((await deliverLead(long,env,fetcher)).ok,true);assert.equal(sent,3);
  const other={...lead,sessionId:'lead-uncertain-test'};
  assert.equal((await deliverLead(other,env,async()=>{throw Error('network');})).error,'delivery_uncertain');
  assert.equal((await deliverLead(other,env,()=>{throw Error('must not resend');})).error,'delivery_uncertain');
  db.close();
});
await test("Telegram discovery requires a separate server admin secret",async()=>{
  const r=await handle(new Request('https://site.example/api/admin/telegram',{method:'POST'}),{INTAKE_ADMIN_SECRET:'secret'},()=>{throw Error('no access');});assert.equal(r.status,404);
});
await test("long combined answers keep full history and final contact notes survive delivery", async () => {
  const long = {...req, task: "Задача ".repeat(1000), answers:[{question:"Что нужно в первой версии?",answer:"Оплата\nЛичный кабинет\n" + "Детали ".repeat(400)}]};
  assert.equal(nextRequestSchema.safeParse(long).success,true);
  let payload;
  await generateNext(long,"fake",async(url,opts)=>{payload=JSON.parse(opts.body);return upstream(question)();});
  const context=JSON.parse(payload.input[0].content);
  assert.equal(context.answers[0].answer,long.answers[0].answer);
  const withNote={...lead,contactNote:"Пишите test@example.com, после 15:00"};
  assert.equal(submitSchema.safeParse(withNote).success,true);
  assert.ok(leadMessages(withNote).join("\n").includes("после 15:00"));
});
await test("ordinary words in contact fields are not Telegram accounts",()=>{
  assert.equal(submitSchema.safeParse({...lead,contacts:{telegram:"hello"}}).success,false);
  assert.equal(submitSchema.safeParse({...lead,contacts:{telegram:"@sample_user"}}).success,true);
});
await test("fallback summary fits the delivery contract after long free-text answers",async()=>{
  const {mockSummary}=await import(pathToFileURL(join(temp,"mock.js")));
  const input={...req,task:"Нужен сайт ".repeat(700),answers:[{question:"Что уже есть к старту?",answer:"Материалы ".repeat(390)}]};
  assert.equal(submitSchema.safeParse({...lead,task:input.task,answers:input.answers,summary:mockSummary(input)}).success,true);
});
await test("contact review rejects unconfirmed contacts and phone without chosen channel",()=>{
  assert.equal(submitSchema.safeParse({...lead,contactConfirmed:undefined}).success,false);
  assert.equal(submitSchema.safeParse({...lead,contacts:{phone:'+79991234567'}}).success,false);
  for(const phoneChannel of ['call','whatsapp','telegram'])assert.equal(submitSchema.safeParse({...lead,contacts:{phone:'+79991234567'},phoneChannel}).success,true);
  for(const telegram of ['@sample_user.name','@sample_user-name','@'+'a'.repeat(33),'https://t.me/sample_user/post'])assert.deepEqual(extractContacts(telegram),[]);
  assert.equal(extractContacts('Пишите https://t.me/sample_user')[0].value,'@sample_user');
});
await test("HTML receipts escape hostile content, keep user text and use stable short numbers",async()=>{
  const unsafe={...lead,task:'<b>not markup</b> & _text_ '+ '😄&'.repeat(2200),contacts:{telegram:'@sample_user'},assessment:{complexity:'unknown',notes:'Уточнить материалы',nextMissing:'Срок'}};
  const messages=leadMessages(unsafe,{number:7,created:1758794400});
  const joined=messages.join('\n');
  assert.ok(joined.includes('Заявка №007'));assert.ok(joined.includes('МСК'));
  assert.ok(joined.includes('&lt;b&gt;not markup&lt;/b&gt; &amp; _text_'));
  assert.ok(joined.includes('@sample_user'));assert.ok(!joined.includes(lead.page));assert.ok(!joined.includes(lead.sessionId));
  for(const message of messages){assert.ok(message.length<=4096);assert.equal((message.match(/<b>/g)||[]).length,(message.match(/<\/b>/g)||[]).length);assert.ok(!/[\uD800-\uDBFF]$/.test(message));}
  const {env,db}=await database();Object.assign(env,{TELEGRAM_BOT_TOKEN:'test',TELEGRAM_CHAT_ID:'-1'});
  const fake=async()=>Response.json({ok:true,result:{message_id:1}});
  const a=await deliverLead(lead,env,fake);const b=await deliverLead(lead,env,fake);
  const c=await deliverLead({...lead,sessionId:'lead-other-session'},env,fake);
  assert.equal(a.number,1);assert.equal(b.number,1);assert.equal(c.number,2);db.close();
});
await test("order reserves exact variants, cancellation restores once, preorder reserves nothing",async()=>{
  const {initialShop,bottleProduct,DEFAULT_BOTTLE,placeOrder,cancelOrder,available,total}=await import(pathToFileURL(join(temp,'order-model.js')));
  const product=bottleProduct(DEFAULT_BOTTLE);const lines=[{...product,quantity:2}];
  const initial=initialShop();const ordered=placeOrder(initial,lines,'courier');
  assert.equal(total(lines,'courier'),5170);assert.equal(available(ordered,product.id),1);assert.equal(available(initial,product.id),3);
  lines[0].quantity=1;assert.equal(ordered.orders[0].lines[0].quantity,2);
  const preorder=placeOrder(ordered,[{...product,quantity:4}],'pickup');assert.equal(preorder.orders[0].status,'preorder');assert.equal(available(preorder,product.id),1);
  const cancelled=cancelOrder(preorder,1);assert.equal(available(cancelled,product.id),3);assert.deepEqual(cancelOrder(cancelled,1),cancelled);
  assert.equal(available(cancelOrder(cancelled,2),product.id),3);
  assert.equal(placeOrder(initial,[],'pickup'),initial);assert.equal(placeOrder(initial,[{...product,quantity:-1}],'pickup'),initial);
});
await test("submit HTTP endpoint requires review and returns a numbered receipt",async()=>{
  const {env,db}=await database();Object.assign(env,{TELEGRAM_BOT_TOKEN:'test',TELEGRAM_CHAT_ID:'-1'});
  let sends=0;const fake=async()=>{sends++;return Response.json({ok:true,result:{message_id:1}});};
  const submit=body=>new Request('https://site.example/api/intake/submit',{method:'POST',headers:{Origin:'https://site.example','Content-Type':'application/json','CF-Connecting-IP':'192.0.2.5'},body:JSON.stringify(body)});
  assert.equal((await handle(submit({...lead,contactConfirmed:false}),env,fake)).status,400);assert.equal(sends,0);
  const response=await handle(submit(lead),env,fake);assert.equal(response.status,200);assert.equal((await response.json()).number,1);assert.equal(sends,1);db.close();
});
await test("analytics is off without a counter and exposes no secrets in config",async()=>{
  const disabled=await import(pathToFileURL(join(temp,'metrika.js'))+'?disabled');
  disabled.startMetrika(null,'/');
  for(const value of [null,undefined,'',0,'123abc',-5])assert.equal(disabled.validCounter(value),null);
  const response=await handle(new Request('https://site.example/api/analytics/config'),{YANDEX_METRIKA_ID:'123456',CHATGPT_PLATFORM_API_KEY:'must-not-leak'});
  assert.deepEqual(await response.json(),{counterId:123456});
  assert.deepEqual(await (await handle(new Request('https://site.example/api/analytics/config'),{})).json(),{counterId:null});
});
await test("analytics sends only allowed goals and sanitized page metadata",async()=>{
  const calls=[];const scripts=[];
  globalThis.window={ym:(...args)=>calls.push(args)};
  globalThis.location={origin:'https://site.example'};
  globalThis.document={referrer:'https://ref.example/private?email=private@example.com',createElement:()=>({}),head:{appendChild:el=>scripts.push(el)}};
  try {
    const analytics=await import(pathToFileURL(join(temp,'metrika.js'))+'?enabled');
    analytics.trackGoal('intake_start');analytics.trackGoal('private@example.com');
    analytics.startMetrika(123456,'/');analytics.pageView('/case');analytics.pageView('/case');analytics.trackGoal('lead_sent');analytics.startMetrika(123456,'/');
    assert.equal(scripts.length,1);assert.equal(scripts[0].src,'https://mc.yandex.ru/metrika/tag.js');
    assert.equal(calls.filter(c=>c[1]==='hit').length,2);
    assert.deepEqual(calls.filter(c=>c[1]==='reachGoal').map(c=>c.slice(2)),[['intake_start'],['lead_sent']]);
    assert.equal(calls[0][2].webvisor,false);assert.equal(calls[0][2].trackLinks,false);
    assert.equal(JSON.stringify(calls).includes('private'),false);
    window.ym=()=>{throw Error('blocked');};assert.doesNotThrow(()=>analytics.trackGoal('lead_sent'));
  } finally {delete globalThis.window;delete globalThis.location;delete globalThis.document;}
});
await rm(temp, { recursive: true, force: true });
