# AGENT.md

## Project Memory

- Project: TripVote, a React + Vite + TypeScript + Tailwind CSS local-first travel decision app.
- Current data source: localStorage through `src/hooks/useTripStore.ts`.
- Future backend target: Supabase, Firebase, or a custom backend can replace the store layer while keeping `TripPlan` as the UI-facing model.
- AI assistant rule: do not call a real AI API in the current version. Keep AI advice as local rules in `src/utils/aiAdvisor.ts`. Future API support should be added as a provider replacement, not inside UI components.
- Default group brand: `五人帮 CLUB·5`.
- Default group subtitle: empty string. Do not auto-fill the previously rejected joke subtitle.
- User-provided image source: `.codex-remote-attachments/.../1-Photo-1.jpg`. It is used as the group cover/icon source, but the attachment directory itself must not be committed.
- Project brand assets live under `public/brand/`, including `club5-cover.jpg` and `club5-icon.png`.
- Travel memories are a first-class feature. They should support manual creation, JSON import/export, and archiving the current final trip plan into a history record.
- Keep the app local-demo friendly: mock data should run without backend setup, API keys, or network-only functionality.

## Verification Checklist

- Run `npm run build`.
- Run `npm run lint`.
- Browser-check desktop and mobile layouts.
- Confirm no real AI API call was added: search for browser network calls, HTTP clients, API keys, and model SDK usage.
- Confirm the rejected joke subtitle does not appear in the app by default.
- Commit and push to `origin/main` after implementation when requested.
