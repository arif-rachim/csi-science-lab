import { useState } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { HypothesisBoard } from './ui/HypothesisBoard';
import { EvidenceTray } from './ui/EvidenceTray';
import { ScientistJournal } from './ui/ScientistJournal';
import { caseOne } from './cases/case-01-poisoned-principal';

type Screen = 'menu' | 'case';

function App() {
  const [screen, setScreen] = useState<Screen>('menu');
  const [submittedHypotheses, setSubmittedHypotheses] = useState<string[]>([]);

  if (screen === 'menu') {
    return <MainMenu onStart={() => setScreen('case')} />;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-detective-amber">Case 01</p>
          <h1 className="text-2xl font-bold text-detective-paper">{caseOne.title}</h1>
        </div>
        <button className="btn-ghost" onClick={() => setScreen('menu')}>
          ← Main menu
        </button>
      </header>

      <p className="rounded-md border border-detective-slate bg-detective-navy/60 p-4 text-sm text-detective-paper/90">
        {caseOne.story}
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <PhaserGame />
        <ScientistJournal activeCase={caseOne} observations={[]} />
      </div>

      <EvidenceTray evidence={caseOne.evidence} collectedIds={[]} />

      <HypothesisBoard
        activeCase={caseOne}
        initialSelected={submittedHypotheses}
        onSubmit={setSubmittedHypotheses}
      />

      {submittedHypotheses.length > 0 && (
        <p className="readout">
          {submittedHypotheses.length} hypothesis(es) submitted — lab phase coming next.
        </p>
      )}
    </main>
  );
}

function MainMenu({ onStart }: { onStart: () => void }) {
  return (
    <main className="flex min-h-full flex-col items-center justify-center p-6 text-center">
      <p className="mb-2 text-xs uppercase tracking-[0.3em] text-detective-amber">
        IB MYP Year 4 · Sciences
      </p>
      <h1 className="mb-3 text-5xl font-extrabold text-detective-paper">CSI: Science Lab</h1>
      <p className="mb-8 max-w-xl text-detective-paper/80">
        Solve school mysteries using the scientific method. Form hypotheses, run lab tests,
        analyze data, and reach a verdict you can defend.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary text-lg" onClick={onStart}>
          Start Case 1 — The Poisoned Principal
        </button>
        <button className="btn-ghost" disabled>
          About (coming soon)
        </button>
        <button className="btn-ghost" disabled>
          Settings (coming soon)
        </button>
      </div>
    </main>
  );
}

export default App;
