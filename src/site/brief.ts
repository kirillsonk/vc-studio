/** Project formats: service cards, intake chips and ?service= links share this list */
export const SERVICES = [
  "Сайты и интернет-магазины",
  "AI-ассистенты и агенты",
  "MCP и AI-интеграции",
  "Веб-сервисы и личные кабинеты",
  "Интерактив, 3D и спецпроекты",
  "Автоматизация процессов",
] as const;
export function serviceFromQuery(search: string): string | null {
  const id = new URLSearchParams(search).get("service");
  return id !== null && /^\d$/.test(id) && Number(id) < SERVICES.length
    ? SERVICES[Number(id)]
    : null;
}
