# VC Studio — дизайн-система

Design system for **VC Studio**, an AI-native digital production studio: promo sites, digital special projects, interactive landings, web games, browser 3D/WebGL, product promos and custom interactive mechanics for ad campaigns. Production is built around AI coding agents — most code is written by AI tools; the team owns decomposition, architecture, prompting and context, integrations, engineering, code review, QA, performance, security, deployment, deadlines and the final result.

Brand formula: **скорость AI + ответственность студии + прозрачная экономика.** Core message: *AI ускоряет код. Мы отвечаем за продукт.* Territory: AI-native digital production — not a cheap web studio, not an "AI agency", not a SaaS.

Audience: marketing teams, digital/creative/ad agencies that need a technology production partner, and companies that need strong digital without a classic studio budget. Budgets from 100 000 ₽ with no upper bound — the same production handles projects a classic studio would price at several million. Site language: Russian.

## Sources

- Two briefs supplied in chat: business + Tone of Voice (copy strategy) and the visual direction ("Editorial Production System / Studio OS").
- GitHub: https://github.com/kirillsonk/vc-studio — attached as the design-system repo; it contained only an 11-byte README, nothing was imported. See `github.md`.
- No Figma, logo or imagery were provided. **No logo exists**: the wordmark is the name set in the core font, weight 500, −0.04em. No AI symbol was invented.

## Content fundamentals

- **Voice**: confident, calm, technically literate, slightly bold, short. No corporate boilerplate, no teenage tone, no startup pathos, no shouting. "AI пишет код. Мы отвечаем за то, что выйдет в прод."
- **Positioning of vibe-coding**: never «делаем сайты вайб-кодингом». Say «строим проекты с AI coding agents», «AI пишет код, инженеры отвечают за прод». Explain the model once in plain Russian (process section).
- **Never attack competitors**: compare production models («AI-native production» vs «классическая production-модель»), never «все студии обманывают». No unverifiable market claims; demo figures are labelled as demo.
- **Premium, not cheap**: «эффективнее», «меньше ручной разработки», «другая экономика разработки» — never «дёшево», «в 5 раз дешевле», «честная цена». Show the difference as numbers in the UI.
- **Tokens**: separate *количество токенов* (production metric) from *фактический AI-расход* (money). «AI-инфраструктура — по фактическому расходу», never «1 токен = N ₽» or «платите только за токены».
- **Address**: «вы» lower-case, «мы» for the studio. Sentence case. No ALL CAPS eyebrows, no «→» in buttons, no emoji.
- **Buttons say what happens**: Запустить проект · Рассчитать проект · Смотреть кейсы · Открыть кейс · Запустить демо · Открыть отчёт · Получить точную оценку · Скачать отчёт · Повторить. Never «Подробнее», never «Обсудить проект» as the main CTA.
- **AI intake tone**: a good technical producer — «Что нужно сделать?», «Когда проект должен быть в проде?». No «Отлично!», «Понял тебя!», no praise after each answer. Loading: «Собираем scope». Error: «Не получилось собрать оценку» + «Повторить».
- **Form errors**: «Проверьте адрес почты» · «Нужен username в формате @username» · «Не удалось отправить заявку. Диалог сохранён. Попробуйте ещё раз.»
- **Banned words**: инновационный, уникальный, революционный, магия, вау-эффект, нейронка, под ключ, индивидуальный подход, команда профессионалов, будущее уже здесь, честная цена. Banned constructions: «Мы не просто X — мы Y», «от идеи до воплощения», three abstract nouns in a row.
- **Rhythm**: short sentences, one idea per paragraph, headings 2–8 words, leads ≤ 3 sentences. Progressive disclosure: hero → demo → cases → economics → process → FAQ → intake.

## Visual foundations

- **Concept**: Editorial Production System — editorial clarity + engineering precision + controlled experimentation. Light-first; technology reads through grid, type, data, motion and real demos, never through effects.
- **Colour**: canvas #F5F5F2 (paper-neutral, not cream), surface #FFFFFF, ink #111214 / #62666D / #92969D, lines #D9DAD6 / #BFC1BC. Brand: vermilion #D9451A (hover #BF3A13, press #A3300E, soft #FBEAE3) for primary CTA, active/selected states, links, trace lines — never large fills. Blue #3157FF survives only as `--accent-2` for data viz and rare highlights — never buttons, never fills (blue is the colour of big platforms). Warning #B98A00, error #B3213C (crimson, distinct from the orange brand). **Green #0FAF7A is semantic only**: Live, ready, production completed, positive delta, savings, success. One dark contrast surface #111214 allowed (≤10–15 % of a page) for a single hero demo — no purple, no glow.
- **No gradients** as decoration; only inside a WebGL scene or client demo.
- **Type**: one family. Preferred TT Hoves Pro (commercial); shipped fallback **Onest Variable** from Google Fonts — the whole system is built on it. Levels by size/weight/tracking: display-xl 112 / display 88 / h1 76 / h2 60 / h3 30 / h4 22 at weight 500, tracking −0.04…−0.01em, line-height 0.94–1.25; body-lg 20 / body 17 / body-sm 15 / caption 13 at 400. Technical index labels «01 02 03» replace eyebrows. **All numbers tabular** (`data-num` / `.num`), no monospace anywhere.
- **Grid**: 12 columns, gutter 24, max 1400, pads 56 / 32 / 20. Asymmetric editorial splits 7/5, 8/4, 5/7, 4/8. Sections 120–180 px desktop, 72–96 mobile. Whitespace is part of the design.
- **Radii**: 4 (tags, checkbox), 8 (buttons, inputs, options, case visual), 12 (large interactive canvas, panels). No pills, no 24+.
- **Borders**: 1 px #D9DAD6 structure everything — heads sit on a 1 px ink rule, rows on light rules. Sections are usually grid + type + divider, not cards. Cards only where they have an interface function (estimate panel, agencies block, demo frame).
- **Shadows**: none on content. `--shadow-float` only for dropdown / popover / modal.
- **Brand motif — Production Trace**: a 1.5 px vermilion line through nodes (Brief → Scope → Build → QA → Production). Hero: assembles the build canvas; process: vertical trace between stages; case: timeline; intake: progress. Production node turns green when reached.
- **Motion**: functional only. Micro 180 ms, UI 320 ms, editorial reveal 640 ms, hero choreography ≤ 1.6 s (grid → headline clip-reveal → trace draws → rows appear → counter starts). Easing (.32,.72,0,1), no bounce. One motion idea per section: numbers interpolate, lines draw, headlines mask-reveal, visuals clip/scale on hover, estimate rows append. Ordinary text does not animate. `prefers-reduced-motion` respected in `base.css`.
- **Hover**: primary → darker blue; secondary → ink border + white fill; tertiary → baseline draws left-to-right; case visual scales 1.02 and title turns vermilion; links → brand-hover. **Press**: 1 px down. **Focus**: 2 px blue outline, 2 px offset; inputs get brand border + soft ring.
- **Imagery**: real projects, mockups, WebGL, video, UI, production data. No stock, no abstract AI renders, no orbs. Demo slots are labelled placeholders until real demos land.
- **Header**: 80 px, wordmark left, four links + primary CTA right, sticky, bottom border appears on scroll. No floating pill.

## Iconography

Minimum icons — if text is clear, no icon. Components embed the few glyphs they need (chevron, check, play, plus, send) as inline 24-grid 1.5 px stroke SVGs matching **Lucide**; use Lucide from CDN (`https://unpkg.com/lucide@latest`) at 16–20 px for anything else. No icon fonts, no PNG icons, no coloured icon circles, no emoji, no sparkle / brain / robot / rocket / lightning for AI.

## Components

Namespace: `window.VCStudioDesignSystem_40ecfd`.

- `components/actions/` — **Button** (primary / secondary / tertiary; sm md lg; loading, disabled)
- `components/forms/` — **TextInput**, **Textarea**, **Select**, **Field**, **Checkbox**, **OptionBlock** (rectangular choice), **Chip** (secondary multi-select)
- `components/numbers/` — **Counter** (animated tabular), **Stat**, **Ledger** (estimate / invoice rows), **Compare** (production-model bars)
- `components/content/` — **CaseCard** (editorial preview), **Tag**, **Trace** (brand motif)
- `components/demo/` — **DemoBlock** (poster → loading → live; optional dark)
- `components/intake/` — **BriefMessage**, **BriefComposer**, **EstimatePanel** (interactive project brief + live estimate)

Where the brand vermilion is used: primary buttons, selected OptionBlock/Chip, links, Trace line and nodes, Compare "ours" bar, FAQ open question, live "building" status. Where green is allowed: Live dots, ready status, «включено», savings/deltas, production node reached. Quiet by design: body text, tables, Ledger rows, section heads.

## Index

- `styles.css` → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `effects.css`, `base.css`.
- `guidelines/` — 18 specimen cards (Colors, Type, Spacing, Brand incl. Production Trace and voice).
- `components/<group>/` — `.jsx` + `.d.ts` + `.prompt.md` per component, one `*.card.html` per group.
- `ui_kits/site/` — studio website: Home (11 sections), Case, Report.
- `thumbnail.html`, `github.md`, `SKILL.md`. No `assets/` — no logo, icons or imagery were supplied.
