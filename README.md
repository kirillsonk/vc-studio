# VC Studio

Сайт и дизайн-система AI-native production-студии: промо-сайты, digital-спецпроекты, интерактивные лендинги, веб-игры, браузерные 3D/WebGL-проекты.

**Стек:** Next.js 15 (App Router) · React 18 · TypeScript · CSS custom properties. Без CSS-in-JS и UI-библиотек — стилизация идёт через токены дизайн-системы.

## Быстрый старт

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production-сборка
npm run typecheck
```

## Маршруты

| Путь | Экран |
| --- | --- |
| `/` | Главная: hero с живым production canvas, демо, кейсы, что делаем, экономика, сравнение моделей, процесс, агентства, FAQ, AI-заявка |
| `/case` | Кейс проекта: факты, демо, задача/решение/срок, timeline, сравнение |
| `/report` | Production-отчёт: итоговый бюджет, ledger, разбивка по этапам и по моделям |
| `/kit` | Витрина дизайн-системы: 19 компонентов в шести группах со всеми состояниями |

## Структура

```
BRAND.md                  ← дизайн-код и Tone of Voice, source of truth
src/
  app/                    маршруты App Router + layout (шрифт, Nav, Footer)
  components/             19 компонентов дизайн-системы в шести группах
    actions/              Button
    forms/                TextInput · Textarea · Select · Field · Checkbox · OptionBlock · Chip
    numbers/              Counter · Stat · Ledger · Compare
    content/              CaseCard · Tag · Trace
    demo/                 DemoBlock
    intake/               BriefMessage · BriefComposer · EstimatePanel
    index.ts              публичный барель библиотеки
  site/
    Chrome.tsx            Container · Section · Head
    Nav.tsx · Footer.tsx
    constants.ts          навигация и маршруты
    data.ts               demo-данные кейсов и отчёта
    sections/             секции главной
    pages/                CasePage · ReportPage · KitPage
  styles/
    styles.css            единая точка входа (@import-ы)
    tokens/               colors · typography · spacing · effects · fonts · base
    animations.css        keyframes компонентов
    site.css              сетка, адаптив, утилиты
project/                  исходный экспорт из Claude Design (прототипы, референс)
chats/                    транскрипты проектирования
```

## Дизайн-система

Токены — CSS custom properties в `src/styles/tokens/`, подключаются одним файлом `src/styles/styles.css`.

Ключевое: canvas `#F5F5F2`, ink `#111214`, бренд — вермильон `#D9451A`, сигнальный зелёный `#0FAF7A` только для семантики (live, ready, включено, разница). Синий `#3157FF` — вторичный акцент для данных, не для кнопок. Одна гарнитура **Onest Variable** (self-hosted через `next/font/google`), все числа табличные. Радиусы 4 / 8 / 12, тени только у floating UI.

Полные правила — в [`BRAND.md`](./BRAND.md). Любой новый текст и любое визуальное решение сверяются с ним.

## Данные

Все числа в интерфейсе — демонстрационные (`src/site/data.ts`). Список того, что нужно заменить реальными значениями перед публикацией, — в разделе 32 `BRAND.md`.

## Источники

- Дизайн-система собрана в [Claude Design](https://claude.ai/design); экспорт лежит в `project/`, транскрипты — в `chats/`.
- Репозиторий: https://github.com/kirillsonk/vc-studio
