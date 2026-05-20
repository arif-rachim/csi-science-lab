# CSI: Science Lab

An educational browser-based game for Grade 9 IB MYP students. Players act as junior forensic scientists and solve mystery cases using the scientific method. Cases are aligned with MYP Year 4 Chemistry, Biology, and Physics topics and the IB MYP Sciences Assessment Criteria A–D.

> **MVP target:** Case 1 — *The Poisoned Principal* (Chemistry: pH, acids/bases, neutralization).

## Tech stack

- **Vite** + **React 19** + **TypeScript** — UI layer and dev tooling
- **Phaser 4** — game engine for crime-scene exploration and lab mini-games
- **Tailwind CSS v3** — styling
- **Zustand** — shared state between React and Phaser

React renders the UI overlay (Hypothesis Board, Journal, panels) while Phaser owns the gameplay canvas. They communicate through an `EventBus` singleton so neither layer reaches into the other directly.

## Project layout

```
src/
├── App.tsx                     # main menu + case shell
├── main.tsx                    # React entry, loads Tailwind globals
├── game/                       # Phaser layer
│   ├── PhaserGame.tsx          # React wrapper that mounts/destroys Phaser
│   ├── config.ts               # Phaser.Game config
│   ├── EventBus.ts             # Phaser ↔ React event bridge
│   ├── useEventBus.ts          # React hook for EventBus subscriptions
│   └── scenes/
│       └── BootScene.ts        # placeholder boot scene
├── ui/                         # React components
│   ├── HypothesisBoard.tsx     # "If… then… because…" form + variable tagging
│   ├── ScientistJournal.tsx
│   ├── EvidenceTray.tsx
│   ├── VerdictPanel.tsx
│   ├── ReflectionDialog.tsx
│   └── ScoreCard.tsx           # IB MYP criterion scores A–D
├── cases/                      # data-driven case definitions
│   ├── types.ts
│   └── case-01-poisoned-principal.ts
├── lib/
│   ├── ibCriteria.ts           # scoring logic per IB criterion
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

- [x] Vite + React + TS + Phaser + Tailwind set up
- [x] Main menu (start Case 1)
- [x] Case 1 data file with suspects, evidence, hypotheses, reflection
- [x] Crime scene Phaser scene with clickable evidence
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
