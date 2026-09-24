# Сборка

Read BRAND.md before writing product copy or changing the design.

Permanent TOV rules requested by the owner:
- Use Cyrillic е and Е instead of the letters with two dots (U+0451 / U+0401).
- Do not use long dashes (U+2014 / U+2013) in copy. Rewrite the sentence with commas, colons or periods. Use ASCII hyphens only where appropriate.
- No trailing periods in secondary website copy: descriptions, captions, lists, form hints and statuses. Keep punctuation between sentences. Prefer direct first-person verbs over impersonal team references.
- Prefer AI over its Russian abbreviation. English industry abbreviations are welcome when useful: UX/UI, CMS, CRM, API, MVP, QA.
- These rules apply to website copy, metadata, proposals, project documents and communication about this project.
- Do not add decorative numbered section labels or empty slogans.
- No minimum project budget. Cost comparisons are illustrative unless supported by agreed estimates.
- Keep the current demo until the owner chooses a replacement. AI intake uses OpenAI with a local fallback. Telegram and free-text contact collection are now authorized; read docs/intake-status.md for delivery setup and the deferred operator policy. Do not change its contract without updating docs/intake-api.md.

Run npm run check:copy, npm run typecheck and npm run build before pushing. Check responsive layout and changed interactions in the browser. Use ordinary git push; do not store credentials in source files or Git URLs.
