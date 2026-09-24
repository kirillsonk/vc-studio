/** Studio name. Change it here; metadata, wordmark labels and the footer read from it */
export const BRAND_NAME = "Сборка";

export const HOME_SECTIONS: Array<[id: string, label: string]> = [
  ["what", "Что делаем"],
  ["approach", "Подход"],
  ["economics", "Стоимость"],
  ["agencies", "Агентствам"],
  ["cases", "Демо"],
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
