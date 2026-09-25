# CSI: Science Lab

CSI: Science Lab is an educational text-adventure game that runs in the browser, written for Grade 9 (MYP Year 4) students in the IB Middle Years Programme. Players act as junior forensic scientists in a school forensics club and solve mystery cases by working through the scientific method: they examine a crime scene, write "If… then… because…" hypotheses, run virtual lab tests, analyse the data, name a culprit with written reasoning and answer reflection questions. Each case is tied to MYP science topics, and the final scorecard grades the player against IB MYP Sciences Assessment Criteria A–D. Written answers can be graded by Google Gemini, using an API key each player pastes into the game and keeps in their own browser, with a built-in heuristic grader when no key is set. It is a static single-page app built with Vite, React 19, TypeScript, Tailwind CSS and Zustand, styled as a retro CRT terminal with typewriter narration and a Web Audio soundtrack. Two cases are playable.

> Status: early development (May 2026). Case 01 *The Poisoned Principal* (chemistry) and Case 02 *The Pond That Breathes* (biology) are playable; the other cases from the brief are not built yet.

## Cases

| Case | Subject | MYP topics | Lab |
|------|---------|------------|-----|
| 01 · The Poisoned Principal | Chemistry | pH scale, acids, bases and neutralization, universal indicator | pH probe with universal indicator |
| 02 · The Pond That Breathes | Biology | microorganisms (cyanobacteria), ecosystems, dissolved oxygen, eutrophication, bioindicators | microscope slides, then water analysis (pH, dissolved O₂, nitrate, microbe density) |

Every case follows the same phases: intro, crime scene, hypothesis, lab, analysis, verdict, reflection and completion.

## Tech stack

- **Vite** + **React 19** + **TypeScript** — UI layer and dev tooling
- **Tailwind CSS v3** — styling
- **Zustand** — game state
- **Google Gemini** (`gemini-flash-latest`, BYOK — browser calls the REST API directly with a per-player key stored in localStorage) — formative AI feedback on every text input
- **VT323** font (Google Fonts) — for the retro CRT terminal look

No Phaser, no canvas, no game engine. The game is built as a retro-CRT *text adventure* with typewriter narration, a blinking cursor, ASCII frames and a Web Audio synth soundtrack. Gameplay is driven by narrative choice and scientific reasoning, not graphics or animation.

## Project layout

```
src/
├── App.tsx                     # main menu + case shell + phase router
├── main.tsx                    # React entry
├── ui/                         # React components
│   ├── Typewriter.tsx          # char-by-char text reveal with skippable cursor
│   ├── CrimeSceneText.tsx      # text-driven scene exploration with [n] examine commands
│   ├── HypothesisBoard.tsx     # free-text "If… then… because…" + AI grading per card
│   ├── PhProbeLab.tsx          # Case 01 lab: pH probe readouts
│   ├── MicroscopeLab.tsx       # Case 02 lab: examine prepared slides
│   ├── WaterAnalysisLab.tsx    # Case 02 lab: pH, dissolved O₂, nitrate, microbe density
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
│   ├── index.ts                # case registry (cases[], getCase)
│   ├── types.ts
│   ├── case-01-poisoned-principal.ts
│   └── case-02-pond-that-breathes.ts
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

1. Visit [https://aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create a free key.
2. Open **CSI: Science Lab** → main menu → **[K] AI key** → paste the key → **Save**.
3. The status pill flips to `[●] Gemini ON`. Play normally — grading buttons in the Hypothesis Board, Verdict Panel, and Reflection now call Gemini.

Without a key, the game still works — `src/lib/aiGrader.ts` falls back to a deterministic stub that produces sensible feedback based on length and keyword heuristics so the UI flow stays testable.

Implementation:

- `src/lib/aiKey.ts` — thin localStorage wrapper (`getApiKey` / `setApiKey` / `hasApiKey`).
- `src/lib/aiGrader.ts` — builds the rubric prompt for each input type, calls `https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=…` with a `response_schema` enforcing structured JSON. Using the `-latest` alias means new Flash releases pick up automatically without a redeploy when Google retires the previous version.
- `src/ui/AiSettings.tsx` — settings panel with key paste box, show/hide toggle, and clear-key action.
- `src/lib/ibCriteria.ts` — combines AI scores with programmatic checks (verdict correctness, samples tested, confidence calibration) into the 0–8 per-criterion scorecard.

> **Privacy note:** Gemini's free tier may use submitted prompts for model training. For real classroom deployment with student data, upgrade to a paid Gemini tier or use a provider with a "no training on inputs" guarantee.

## Adding a new case

Cases are plain TypeScript data — no engine changes needed for a typical case.

1. Create `src/cases/case-NN-<slug>.ts`, exporting a `Case` object that matches the interface in `src/cases/types.ts`. A case with a new kind of lab also needs a lab component in `src/ui/` and a branch in the lab phase in `App.tsx`, and the closing text for each case is currently selected by case ID in `App.tsx`.
2. Register it in the `cases` array in `src/cases/index.ts`; the main menu lists every registered case.
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

Cases 1 and 2 are playable end-to-end. Cases 3 and 4 from the brief are not yet built.

- [x] Vite + React + TS + Tailwind set up (Phaser removed in favor of text-driven gameplay)
- [x] Main menu
- [x] Case 1 data file with suspects, evidence, hypotheses, reflection
- [x] Text-driven crime scene with typewriter briefing and `[n] Examine` commands
- [x] Hypothesis Board functional with IV/DV/control tagging
- [x] pH probe lab mini-game with universal indicator
- [x] Data analysis screen with table + pH bars + outlier highlight + confidence slider
- [x] Verdict + reflection flow wired end-to-end
- [x] Scorecard rendered on case completion (IB Criteria A–D)
- [x] Progress saved to `localStorage`
- [ ] Mixing reaction visualization (skipped — pH analysis alone is enough to solve)
- [x] Case 2 (biology) with microscope and water analysis labs
- [x] Case registry and case selection on the main menu
- [ ] Cases 3, 4

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
