# UI kit — Сайт студии

Three click-through screens built from the design-system components. Reference design for the brief (no source product existed).

- **Главная** (`Hero.jsx`, `Home.jsx`, `Intake.jsx`): Hero + production canvas (build interface with live token counter) → Demos (dark 21:9 + 7/5 pair) → Cases with open economics → What we do → Economics (three parts + Ledger estimate) → Compare (bars) → Process (vertical Trace) + "Не продаём человеко-часы кода" → Agencies → FAQ → AI project intake (brief left, live estimate right).
- **Кейс** (`Pages.jsx` → `CasePage`): tags, h1 + subtitle, three Stats, dark demo, Задача/Решение/Срок, Trace timeline, Compare, CTAs.
- **Отчёт** (`Pages.jsx` → `ReportPage`): production ledger — big total, tokens/builds/days, Ledger, per-stage table, second-level per-model detail, support row.

`Chrome.jsx`: Container (1400 / 56px pads), Section, Head (7/5 editorial head with index), Nav (sticky, border on scroll, 4 items + primary CTA), Footer. Case and report open from content, not from nav.

All numbers are demo data — replace with real project values.
