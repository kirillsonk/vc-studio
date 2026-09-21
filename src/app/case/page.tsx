import type { Metadata } from "next";
import { CasePage } from "@/site/pages/CasePage";
export const metadata: Metadata = {
  title: "Deploy Run | VC Studio",
  description:
    "Браузерная игра студии VC Studio. Механика, интерфейс и устройство интерактивного демо.",
};
export default function Page() {
  return <CasePage />;
}
