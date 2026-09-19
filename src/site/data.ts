/** Demo content for the reference screens. Every figure here is placeholder data — replace with real project values. */

export interface CaseEntry {
  slug: string;
  kind: string;
  year: string;
  client: string;
  title: string;
  days: number;
  budget: number;
  /** flat colour plate + wordmark standing in for a real still */
  media: { c: string; t: string; fg?: string };
  ratio?: string;
  size?: 'md' | 'lg';
}

export const CASES: CaseEntry[] = [
  { slug: 'coffee-run', kind: 'Веб-игра', year: '2026', client: 'Сеть кофеен', title: 'Промо-игра с лидербордом и промокодами', days: 9, budget: 184000, media: { c: 'var(--vermilion)', t: 'Coffee Run' }, ratio: '16/10', size: 'lg' },
  { slug: 'quarter', kind: '3D / WebGL', year: '2026', client: 'Застройщик', title: 'Квартал в браузере', days: 14, budget: 412000, media: { c: 'var(--ink)', t: 'Quarter' } },
  { slug: 'launch', kind: 'Промо-сайт', year: '2026', client: 'Банк', title: 'Запуск карты со scroll-механикой', days: 6, budget: 126500, media: { c: 'var(--surface-2)', t: 'Launch', fg: 'var(--text-3)' } },
  { slug: 'season', kind: 'Спецпроект', year: '2026', client: 'FMCG', title: 'Интерактивный storytelling к сезонной кампании', days: 12, budget: 238000, media: { c: 'var(--brand-soft)', t: 'Season', fg: 'var(--brand)' }, ratio: '16/10', size: 'lg' },
];

/** Market reference used by every Compare on the site. */
export const MARKET_REFERENCE: [number, number] = [450000, 650000];
export const COMPARE_NOTE = 'Ориентир для сопоставимого объёма работ. Финальная стоимость зависит от задачи и состава команды.';

/** Per-stage breakdown behind the project report. */
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
