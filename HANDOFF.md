# HANDOFF
updated: 2026-10-07 15:30 МСК | agent: Claude Code | branch: chore/ai-sync-handoff

## Сейчас
- Сайт студии «Сборка»: Next.js 15, TypeScript, three.js. Бренд и TOV: BRAND.md, правила: AGENTS.md
- Рабочая ветка `main` (84325e5). `dev` совпадает с `main`, `sborka` и `redesign-v2` устарели и уже влиты
- AI-заявка: чат, бриф, проверка контакта, доставка в Telegram-группу. Модель `gpt-6-luna`, при сбое локальный сценарий. Контракт: docs/intake-api.md, статус: docs/intake-status.md
- Идет перенос с ChatGPT Sites на Timeweb: Node в Москве и ретранслятор `ai-relay` в Нидерландах, без БД

## Последняя сессия
- Подключение к AI-Sync: HANDOFF.md и CLAUDE.md, правило вести HANDOFF.md в AGENTS.md и CLAUDE.md, check:copy проверяет оба файла. Код сайта не менялся

## Дальше
1. Запуск на Timeweb, шаги 3-7 из docs/timeweb-deployment.md: ретранслятор, сайт, тестовая заявка `ТЕСТ`, домен `sborkadigital.ru`, SSL
2. После домена проверить путь заявки в браузере на 390 и 1440 px
3. Политика данных и оператор: владелец отложил, без его данных не делать
4. Обновить README: там еще GPT-5.4 mini и Sites как основное размещение
5. С владельцем решить судьбу `/case`, `/report` и устаревших веток

## Известные проблемы
- Timeweb: защита от дублей и лимиты в памяти, после рестарта повтор может дать дубль в Telegram. Одна реплика
- `TRUST_PROXY` пустой до проверки ingress, лимит общий, а не по IP
- Нет формальной политики конфиденциальности и данных оператора
- Модель иногда переспрашивает, оценка gpt-6-luna всего из 4 запросов
- README частично устарел

## Деплой
- Текущий прод: https://sborka.awwk.chatgpt.site (ChatGPT Sites, `.openai/hosting.json`)
- Новый прод: Timeweb, сайт из `main` с автодеплоем, ретранслятор из `ai-relay/main`. На 2026-10-06 не создан. Порядок и откат: docs/timeweb-deployment.md
- Секреты только в панели хостинга или секретах Sites. Имена переменных: README и docs/timeweb-deployment.md
- Перед push: `check:copy`, `typecheck`, `test:intake`, `build`, для Timeweb еще `test:node`, `test:prefetch`, `build:node`

## Журнал
- 2026-10-07 | Claude Code | chore/ai-sync-handoff | Подключение AI-Sync: HANDOFF.md, CLAUDE.md
- 2026-10-06 | Codex | main | Health-пробы Timeweb, режим без БД, восстановление неоднозначной доставки
- 2026-10-06 | Codex | main | Модель gpt-6-luna, инструкция запуска на Timeweb, ретранслятор
- 2026-10-06 | Codex | main | Обновления сайта через Sites
- 2026-09-25 | Codex | main | Доработки сайта и чата, доставка в Telegram подтверждена
- 2026-09-24 | Codex | main | Живая оценка модели, адаптивы, поиск Telegram-группы
- 2026-09-24 | Codex | main | Подключение OpenAI к чату заявки, публикация на Sites
- 2026-09-24 | Claude Code | main | Контекст для Astra: docs/handoff-2026-09-24.md
- 2026-09-24 | Claude Code | main | Чат в окне со скроллом, контакт в строке, лого на бутылке
- 2026-09-24 | Claude Code | main | AI-чат заявки на моке, CTA «Начать проект»
- 2026-09-24 | Claude Code | main | Ядро атома, демо конфигуратора и AI-ассистента вместо игры
- 2026-09-24 | Claude Code | main | Буквы вокруг атома, листалка услуг, доска стоимости
- 2026-09-24 | Claude Code | main | Ребрендинг в «Сборку», фокус на агентствах
- 2026-09-21 | Codex | main | Новый лендинг, сравнение стоимости, статический хостинг
- 2026-09-19 | Claude Code | main | Next.js и дизайн-система по Claude Design, Deploy Run
