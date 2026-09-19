/** Section anchors on the home page, in the order they appear. */
export const HOME_SECTIONS: Array<[id: string, label: string]> = [
  ['cases', 'Кейсы'],
  ['process', 'Как работаем'],
  ['economics', 'Стоимость'],
  ['agencies', 'Для агентств'],
];

export const ROUTES = {
  home: '/',
  case: '/case',
  report: '/report',
  kit: '/kit',
  intake: '/#intake',
} as const;
