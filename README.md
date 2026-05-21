# CSI: Science Lab

An educational browser-based game for Grade 9 IB MYP students. Players act as junior forensic scientists and solve mystery cases using the scientific method. Cases are aligned with MYP Year 4 Chemistry, Biology, and Physics topics and the IB MYP Sciences Assessment Criteria A–D.

> **MVP target:** Case 1 — *The Poisoned Principal* (Chemistry: pH, acids/bases, neutralization).

## Tech stack

- **Vite** + **React 19** + **TypeScript** — UI layer and dev tooling
- **Tailwind CSS v3** — styling
- **Zustand** — game state
- **Google Gemini 2.0 Flash** (BYOK — browser calls the REST API directly with a per-player key stored in localStorage) — formative AI feedback on every text input
- **VT323** font (Google Fonts) — for the retro CRT terminal look

No Phaser, no canvas, no game engine. The game is built as a retro-CRT *text adventure* with typewriter narration, scanlines, blinking cursor, and ASCII frames. Gameplay is driven by narrative choice and scientific reasoning, not graphics or animation.

## Project layout

```
src/
├── App.tsx                     # main menu + case shell + phase router
├── main.tsx                    # React entry
├── ui/                         # React components
│   ├── Typewriter.tsx          # char-by-char text reveal with skippable cursor
│   ├── CrimeSceneText.tsx      # text-driven scene exploration with [n] examine commands
│   ├── HypothesisBoard.tsx     # free-text "If… then… because…" + AI grading per card
│   ├── PhProbeLab.tsx          # text/bubble-animated lab readouts
│   ├── DataAnalysis.tsx        # tabular pH readings, outlier highlight, confidence slider
│   ├── VerdictPanel.tsx        # AI-gated reasoning + suspect select
│   ├── ReflectionDialog.tsx    # 4 reflection questions, AI feedback per question
│   ├── ScoreCard.tsx           # IB MYP criterion scores A–D
│   ├── AiFeedbackPanel.tsx     # shared AI score/strengths/next-step display
│   ├── EvidenceTray.tsx
│   ├── ScientistJournal.tsx
│   ├── PhaseStepper.tsx
│   ├── AiSettings.tsx          # settings panel for per-player Gemini key
│   └── Confetti.tsx
├── cases/                      # data-driven case definitions
│   ├── types.ts
│   └── case-01-poisoned-principal.ts
├── lib/
│   ├── ibCriteria.ts           # scoring logic per IB criterion
│   ├── aiGrader.ts             # browser-direct Gemini REST call + stub fallback
│   ├── aiKey.ts                # localStorage wrapper for the player's Gemini key
│   ├── audio.ts                # Web Audio API soundtrack (drone + clicks + stings)
│   └── progress.ts             # localStorage save/load
├── store/
│   └── gameStore.ts            # Zustand store
└── styles/
    └── globals.css             # Tailwind directives + utility classes
```

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production bundle
npm run lint     # ESLint
npm run preview  # serve the production build locally
```

No environment variables, no functions, no backend. The site is a pure static SPA — deploy with `npm run build` and ship `dist/` anywhere.

## AI grading (Bring Your Own Key)

Every text input the student writes (hypothesis statements, verdict reasoning, reflection answers) can be sent to Google Gemini for a 0–2 score plus warm formative feedback aligned to the relevant IB criterion. The verdict reasoning is **gated** — a score of 0 blocks submission until the student revises.

There is no server. The browser calls Gemini's REST API directly using a Gemini API key the player pastes into the **AI key** settings panel on the main menu. The key lives only in that player's `localStorage` and never leaves their device (except as the `key=` query parameter on the call to Google).

How a player turns AI grading on:

1. Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a free key (free tier includes 1,500 requests/day).
2. Open **CSI: Science Lab** → main menu → **[K] AI key** → paste the key → **Save**.
3. The status pill flips to `[●] Gemini ON`. Play normally — grading buttons in the Hypothesis Board, Verdict Panel, and Reflection now call Gemini.

Without a key, the game still works — `src/lib/aiGrader.ts` falls back to a deterministic stub that produces sensible feedback based on length and keyword heuristics so the UI flow stays testable.

Implementation:

- `src/lib/aiKey.ts` — thin localStorage wrapper (`getApiKey` / `setApiKey` / `hasApiKey`).
- `src/lib/aiGrader.ts` — builds the rubric prompt for each input type, calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=…` with a `response_schema` enforcing structured JSON.
- `src/ui/AiSettings.tsx` — settings panel with key paste box, show/hide toggle, and clear-key action.
- `src/lib/ibCriteria.ts` — combines AI scores with programmatic checks (verdict correctness, samples tested, confidence calibration) into the 0–8 per-criterion scorecard.

> **Privacy note:** Gemini's free tier may use submitted prompts for model training. For real classroom deployment with student data, upgrade to a paid Gemini tier or use a provider with a "no training on inputs" guarantee.

## Adding a new case

Cases are plain TypeScript data — no engine changes needed for a typical case.

1. Create `src/cases/case-NN-<slug>.ts`, exporting a `Case` object that matches the interface in `src/cases/types.ts`.
2. Register it where cases are listed (currently `App.tsx` hardcodes Case 1 for the MVP; a registry is on the roadmap).
3. Ensure each `ReflectionQuestion` is tagged with the IB criterion (`A`–`D`) it targets so the scorecard is meaningful.

## IB MYP criterion mapping

| Criterion | Where it's earned |
|-----------|-------------------|
| **A — Knowing & Understanding** | Lab tool usage (terminology, correct procedure) |
| **B — Inquiring & Designing** | Hypothesis Board (variables, ≥2 hypotheses) |
| **C — Processing & Evaluating** | Evidence collection + data analysis |
| **D — Reflecting on Impacts** | Reflection answers + correct verdict |

Scoring logic lives in `src/lib/ibCriteria.ts` and is centralized — engine code never computes scores directly.

## MVP scope

Case 1 is playable end-to-end. Cases 2–4 from the brief are not yet built.

- [x] Vite + React + TS + Tailwind set up (Phaser removed in favor of text-driven gameplay)
- [x] Main menu (start Case 1)
- [x] Case 1 data file with suspects, evidence, hypotheses, reflection
- [x] Text-driven crime scene with typewriter briefing and `[n] Examine` commands
- [x] Hypothesis Board functional with IV/DV/control tagging
- [x] pH probe lab mini-game with universal indicator
- [x] Data analysis screen with table + pH bars + outlier highlight + confidence slider
- [x] Verdict + reflection flow wired end-to-end
- [x] Scorecard rendered on case completion (IB Criteria A–D)
- [x] Progress saved to `localStorage`
- [ ] Mixing reaction visualization (skipped — pH analysis alone is enough to solve)
- [ ] Cases 2, 3, 4

## Deploying to Netlify

A `netlify.toml` at the repo root pre-configures the build (Node 20, `npm run build`, publish `dist/`, SPA redirect). Easiest deploy path:

1. Push this branch (or merge to `main`) on GitHub.
2. In the Netlify dashboard → **Add new site → Import an existing project → GitHub**.
3. Pick this repo and the branch you want to deploy. Netlify will read `netlify.toml` and fill in the build settings automatically — just click **Deploy**.
4. After the first deploy, every push to that branch redeploys automatically.

If you'd rather use the Netlify CLI from your own machine:

```bash
npm install -g netlify-cli
netlify login          # opens a browser
netlify init           # link this repo to a Netlify site
netlify deploy --prod  # production deploy
```

## Claude Code on the web

A `SessionStart` hook in `.claude/hooks/session-start.sh` runs `npm install` automatically when a remote session boots so `npm run dev` / `npm run build` / `npm run lint` are ready immediately.
