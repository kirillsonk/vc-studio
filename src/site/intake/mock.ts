import { SERVICES } from "../brief";
import { MAX_QUESTIONS, type Answer, type NextRequest, type NextResponse, type Question, type Summary } from "./contract";

/**
 * Local stand-in for the model. Reads keywords, asks only about what is missing
 * and builds the same summary shape the real backend returns
 */

type Format = "site" | "ai" | "integration" | "service" | "special" | "automation";
type Client = "agency" | "business" | "startup" | "self";

const FORMAT_BY_SERVICE: Format[] = ["site", "ai", "integration", "service", "special", "automation"];
const FORMAT_WORDS: Array<[Format, RegExp]> = [
  ["ai", /ассистент|(^|[^а-я])бот|агент(?!ств)|gpt|llm|rag|нейро|\bai\b|(^|[^а-я])ии([^а-я]|$)/i],
  ["integration", /mcp|интеграц|crm|amo|битрикс|1с|\bapi\b|связать/i],
  ["special", /3d|спецпроект|игр|промо|конфигуратор|\bar\b|интерактив|анимац/i],
  ["service", /кабинет|сервис|платформ|mvp|приложени|дашборд|портал/i],
  ["automation", /автоматиз|рутин|отчет|таблиц|документооборот/i],
  ["site", /сайт|лендинг|магазин|каталог|страниц/i],
];
const FORMAT_LABEL: Record<Format, string> = {
  site: "Сайт",
  ai: "AI-ассистент",
  integration: "Интеграция",
  service: "Веб-сервис",
  special: "Спецпроект",
  automation: "Автоматизация",
};
const CLIENT_LABEL: Record<Client, string> = {
  agency: "Агентство, проект для клиента",
  business: "Компания",
  startup: "Стартап",
  self: "Частный проект",
};

function detectFormat(req: NextRequest, text: string): Format | null {
  const index = req.service ? SERVICES.indexOf(req.service as (typeof SERVICES)[number]) : -1;
  if (index >= 0) return FORMAT_BY_SERVICE[index];
  return FORMAT_WORDS.find(([, re]) => re.test(text))?.[0] ?? null;
}
function detectClient(text: string): Client | null {
  if (/агентств|для клиента|клиенту|бренд клиента/i.test(text)) return "agency";
  if (/стартап|mvp|инвест|питч/i.test(text)) return "startup";
  if (/для себя|личн|свой проект|портфолио/i.test(text)) return "self";
  if (/компани|бизнес|магазин|производств|наш[аеи]? (сайт|клиент)/i.test(text)) return "business";
  return null;
}

const Q = {
  client: {
    question: "Для кого делаем проект?",
    options: ["Для клиента нашего агентства", "Для своей компании", "Это стартап", "Для себя"],
  },
  format: {
    question: "Что ближе к задаче?",
    options: ["Сайт или магазин", "AI-ассистент", "Веб-сервис", "Спецпроект или 3D"],
  },
  site: {
    question: "Что уже есть к старту?",
    options: ["Готовый дизайн в Figma", "Фирстиль без макетов", "Начинаем с нуля", "Нужно переделать текущий сайт"],
  },
  ai: {
    question: "Где будет работать ассистент?",
    options: ["На сайте", "В Telegram", "Внутри компании", "Пока не знаю"],
  },
  integration: {
    question: "Что нужно связать?",
    options: ["Сайт и CRM", "1С или склад", "AI и внутренние данные", "Другое, опишу"],
  },
  service: {
    question: "Кто будет пользоваться сервисом?",
    options: ["Наши клиенты", "Сотрудники", "Партнеры и дилеры", "Все вместе"],
  },
  special: {
    question: "Где будет жить проект?",
    options: ["Отдельный промо-сайт", "Внутри сайта бренда", "Соцсети или AR", "Офлайн-стенд"],
  },
  automation: {
    question: "Что сейчас отнимает больше всего времени?",
    options: ["Заявки и переписка", "Отчеты и таблицы", "Документы", "Другое, опишу"],
  },
  deadline: {
    question: "Когда нужен запуск?",
    options: ["В течение месяца", "Через 1-3 месяца", "Есть точная дата", "Сроки гибкие"],
  },
  budget: {
    question: "Есть ориентир по бюджету?",
    options: ["До 200 тыс ₽", "200-500 тыс ₽", "Больше 500 тыс ₽", "Сначала хочу оценку"],
  },
  reference: {
    question: "Есть пример, на который хочется равняться?",
    options: ["Пришлю ссылку в ответе", "Примера нет"],
  },
} satisfies Record<string, Question>;

const LABEL: Record<string, string> = {
  [Q.site.question]: "Материалы",
  [Q.ai.question]: "Где работает",
  [Q.integration.question]: "Связки",
  [Q.service.question]: "Пользователи",
  [Q.special.question]: "Площадка",
  [Q.automation.question]: "Узкое место",
  [Q.reference.question]: "Референс",
};

const ACK: Record<string, (a: string) => string> = {
  [Q.client.question]: (a) =>
    /агентств/i.test(a) ? "Понял, работаем как подрядчик вашего агентства" : "Понял, спасибо",
  [Q.deadline.question]: (a) => (/гибк/i.test(a) ? "Хорошо, сроки подберем под объем" : "Учту сроки"),
  [Q.budget.question]: (a) => (/оценк/i.test(a) ? "Хорошо, посчитаем по задаче" : "Спасибо, это поможет с оценкой"),
};

function answered(answers: Answer[], q: Question) {
  return answers.find((a) => a.question === q.question);
}

function plan(req: NextRequest): Question[] {
  const all = [req.task, ...req.answers.map((a) => a.answer)].join(" ");
  const format = detectFormat(req, all);
  const client = detectClient(all);
  const list: Question[] = [];
  if (!client) list.push(Q.client);
  list.push(format ? Q[format] : Q.format);
  if (!/срок|недел|месяц|дедлайн|к \d|до \d|осен|весн|лет[оа]|зим|январ|феврал|март|апрел|ма[йя]|июн|июл|август|сентябр|октябр|ноябр|декабр/i.test(all))
    list.push(Q.deadline);
  if (!/бюджет|₽|руб|тыс|млн|\d+\s?k\b/i.test(all)) list.push(Q.budget);
  if (list.length < 3) list.push(Q.reference);
  return list;
}

export function mockSummary(req: NextRequest): Summary {
  const all = [req.task, ...req.answers.map((a) => a.answer)].join(" ");
  const format = detectFormat(req, all);
  const client = detectClient(all);
  const pick = (q: Question) => answered(req.answers, q)?.answer || "";
  const items = [
    { label: "Задача", value: req.task.trim() },
    { label: "Клиент", value: client ? CLIENT_LABEL[client] : pick(Q.client) },
    { label: "Формат", value: req.service || (format ? FORMAT_LABEL[format] : pick(Q.format)) },
    ...req.answers
      .filter((a) => a.answer && ![Q.client, Q.format, Q.deadline, Q.budget].some((q) => q.question === a.question))
      .map((a) => ({ label: LABEL[a.question] || a.question.replace(/\?$/, ""), value: a.answer })),
    { label: "Срок", value: pick(Q.deadline) },
    { label: "Бюджет", value: pick(Q.budget) },
  ].filter((i) => i.value);
  const what = format ? FORMAT_LABEL[format] : "Проект";
  const whom = client === "agency" ? " для клиента агентства" : client === "startup" ? " для стартапа" : "";
  return { title: what + whom, items };
}

export function mockNext(req: NextRequest): NextResponse {
  const pending = plan(req).filter((q) => !answered(req.answers, q));
  if (req.forceSummary || req.answers.length >= MAX_QUESTIONS || pending.length === 0) {
    return { type: "summary", message: "Собрал бриф. Проверьте, все ли верно", summary: mockSummary(req) };
  }
  const last = req.answers[req.answers.length - 1];
  const message = !last
    ? "Понял задачу. Уточню пару моментов, чтобы оценить точнее"
    : last.answer
      ? ACK[last.question]?.(last.answer)
      : undefined;
  return { type: "question", message, ...pending[0] };
}
