import assert from "node:assert/strict";
import test from "node:test";
import { build } from "esbuild";

async function loadClient(api) {
  const { outputFiles } = await build({
    entryPoints: ["src/site/intake/client.ts"],
    bundle: true,
    platform: "node",
    format: "esm",
    write: false,
    define: {
      "process.env.NEXT_PUBLIC_INTAKE_API_URL": JSON.stringify(api),
      "process.env.NEXT_PUBLIC_PRIVACY_URL": '""',
      "process.env.NEXT_PUBLIC_INTAKE_DELIVERY_ENABLED": '"false"',
    },
  });
  return import(`data:text/javascript;base64,${Buffer.from(outputFiles[0].text).toString("base64")}`);
}

const { createNextPrefetch, nextRequestKey, nextStep: mockStep } = await loadClient("");
const { nextStep: apiStep } = await loadClient("/api/intake");
const base = {
  schemaVersion: 1,
  sessionId: "prefetch-test-session",
  service: null,
  task: "Нужен сайт для нового бренда",
  answers: [],
  forceSummary: false,
};
const question = { type: "question", question: "Какие материалы уже есть?", options: ["Макеты", "Фирстиль"] };
const summary = { type: "summary", summary: { title: "Сайт", items: [{ label: "Задача", value: base.task }] } };

function controlled() {
  const calls = [];
  const queue = createNextPrefetch((request, signal) => new Promise((resolve, reject) => {
    calls.push({ request, signal, resolve, reject });
  }));
  return { queue, calls };
}

await test("cached replies require the complete context, including answer order and summary mode", () => {
  const context = { ...base, answers: [{ question: "Кто клиент?", answer: "Бренд" }, { question: "Срок?", answer: "Месяц" }] };
  const key = nextRequestKey(context);
  assert.equal(key, nextRequestKey({ ...context, answers: context.answers.map(answer => ({ answer: answer.answer, question: answer.question })) }));
  for (const update of [
    { schemaVersion: 2 },
    { sessionId: "another-session" },
    { service: "AI-ассистенты" },
    { task: `${base.task} и каталог` },
    { answers: [...context.answers].reverse() },
    { answers: [{ question: "Кто клиент?", answer: "Агентство" }, context.answers[1]] },
    { answers: [{ question: "Для кого?", answer: "Бренд" }, context.answers[1]] },
    { forceSummary: true },
  ]) assert.notEqual(nextRequestKey({ ...context, ...update }), key);
});

await test("explicit submission reuses the same in-flight request without a second model call", async () => {
  const { queue, calls } = controlled();
  queue.start(base, "compose");
  queue.start({ ...base }, "compose");
  assert.equal(calls.length, 1);
  assert.equal(queue.take({ ...base, forceSummary: true }), undefined);
  const pending = queue.take(base);
  queue.cancelStale();
  assert.equal(calls[0].signal.aborted, false, "transition to the submitted state must not cancel its reply");
  calls[0].resolve(question);
  assert.deepEqual(await pending.promise, question);
  assert.deepEqual(queue.take(base).result, question);
  assert.equal(calls.length, 1);
});

await test("new text aborts the old draft and a late response cannot replace the current candidate", async () => {
  const { queue, calls } = controlled();
  queue.start(base, "compose");
  const next = { ...base, task: `${base.task} и интернет-магазин` };
  queue.cancelStale(nextRequestKey(next));
  assert.equal(calls[0].signal.aborted, true);
  assert.equal(queue.take(base), undefined);
  queue.start(next, "compose");
  const current = queue.take(next);
  calls[0].resolve(summary);
  calls[1].resolve(question);
  assert.deepEqual(await current.promise, question);
  assert.deepEqual(current.result, question);
  assert.equal(queue.take(base), undefined);
});

await test("freezing a brief cancels even a promoted request and discards late model content", async () => {
  const { queue, calls } = controlled();
  const request = { ...base, forceSummary: true };
  queue.start(request, "summary");
  const pending = queue.take(request);
  queue.cancel();
  assert.equal(calls[0].signal.aborted, true);
  calls[0].resolve(summary);
  assert.equal(await pending.promise, undefined);
  assert.equal(pending.result, undefined);
  assert.equal(queue.take(request), undefined);
});

await test("speculation has per-stage and per-session budgets, including cancelled attempts", () => {
  const { queue, calls } = controlled();
  for (let i = 0; i < 8; i += 1) queue.start({ ...base, task: `${base.task} ${i}` }, "compose");
  assert.equal(calls.length, 3);
  for (let i = 0; i < 20; i += 1) queue.start({ ...base, task: `Новая задача ${i}` }, `answer-${i}`);
  assert.equal(calls.length, 12);
  queue.reset();
  assert.equal(calls.at(-1).signal.aborted, true);
  queue.start(base, "compose");
  assert.equal(calls.length, 13, "an explicit new project starts a fresh budget");
});

await test("failed or abandoned contexts are not speculated repeatedly", async () => {
  const { queue, calls } = controlled();
  queue.start(base, "compose");
  const pending = queue.take(base);
  calls[0].reject(new Error("temporary transport failure"));
  assert.equal(await pending.promise, undefined);
  queue.cancel();
  queue.start(base, "compose");
  assert.equal(calls.length, 1);
  queue.reset();
  queue.start(base, "compose");
  assert.equal(calls.length, 2);
});

await test("aborted local fallback stops promptly instead of producing a stale answer", async () => {
  const controller = new AbortController();
  const response = mockStep(base, controller.signal);
  controller.abort();
  await assert.rejects(response, error => error.name === "AbortError");
  await assert.rejects(() => mockStep(base, controller.signal), error => error.name === "AbortError");
});

await test("browser cancellation reaches fetch and does not launch another request", async () => {
  const originalFetch = globalThis.fetch;
  let calls = 0;
  let requestSignal;
  globalThis.fetch = async (url, options) => {
    calls += 1;
    assert.equal(url, "/api/intake/next");
    assert.deepEqual(JSON.parse(options.body), base);
    requestSignal = options.signal;
    return new Promise((resolve, reject) => options.signal.addEventListener("abort", () => reject(options.signal.reason), { once: true }));
  };
  try {
    const controller = new AbortController();
    const response = apiStep(base, controller.signal);
    controller.abort();
    await assert.rejects(response, error => error.name === "AbortError");
    assert.equal(requestSignal.aborted, true);
    assert.equal(calls, 1);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
