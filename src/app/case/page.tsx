import type { Metadata } from "next";
import { CasePage } from "@/site/pages/CasePage";
export const metadata: Metadata = {
  title: "Deploy Run | Сборка",
  description:
    "Браузерная игра студии Сборка. Механика, интерфейс и устройство интерактивного демо",
};
export default function Page() {
  return <CasePage />;
}
