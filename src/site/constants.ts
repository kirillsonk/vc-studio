export const HOME_SECTIONS: Array<[id: string, label: string]> = [
  ["cases", "В деле"],
  ["what", "Что делаем"],
  ["economics", "Стоимость"],
  ["process", "Подход"],
];
export const ROUTES = {
  home: "/",
  case: "/case",
  report: "/report",
  kit: "/kit",
  intake: "/#intake",
} as const;
// Only publish verified contact details. Set these environment variables before deployment.
export const STUDIO_EMAIL = process.env.NEXT_PUBLIC_STUDIO_EMAIL || "";
export const STUDIO_TELEGRAM = process.env.NEXT_PUBLIC_STUDIO_TELEGRAM || "";
