/** Demo content for the reference screens. Every figure here is placeholder data */

/**
 * The site shows a single demonstration project instead of client cases: there are none yet,
 * and the brand does not invent social proof. The project is built for this site and labelled as such
 */
export interface DemoCase {
  index: string;
  kind: string;
  title: string;
  lead: string;
  days: number;
  budget: number;
  aiCost: number;
  tokens: number;
  /** flat colour plate + wordmark standing in for the real build */
  media: { c: string; t: string; fg?: string };
}

export const DEMO_CASE: DemoCase = {
  index: 'Демо-проект 01',
  kind: 'Браузерная мини-игра',
  title: 'Deploy Run — механика, собранная для этого сайта',
  lead: 'Демонстрационный пример, а рабочий пример: тридцать секунд, canvas, лидерборд и промокод после прохождения. В нее можно сыграть выше. Показываем срок, бюджет и фактический AI-расход как в настоящем отчете',
  days: 9,
  budget: 184320,
  aiCost: 18320,
  tokens: 8421388,
  media: { c: 'var(--vermilion)', t: 'Deploy Run' },
};

/** Market reference used by every Compare on the site */
export const MARKET_REFERENCE: [number, number] = [450000, 650000];
export const COMPARE_NOTE = 'Ориентир для сопоставимого объема работ. Финальная стоимость зависит от задачи и состава команды';

/** Per-stage breakdown behind the project report */
export const REPORT_STAGES: Array<[stage: string, ai: number, team: number]> = [
  ['Прототип механики', 3210, 24000],
  ['Графика и анимация', 5480, 52000],
  ['Лидерборд и промокоды', 4690, 48000],
  ['QA, правки, запуск', 4940, 42000],
];

export const REPORT_MODELS: Array<[model: string, input: number, output: number, cached: number, cost: number]> = [
  ['Claude Sonnet', 5120400, 812300, 1904200, 11840],
  ['GPT', 402100, 96400, 0, 3980],
  ['Gemini', 78900, 6088, 0, 2500],
];
