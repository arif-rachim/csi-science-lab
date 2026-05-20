import { useCallback, useEffect, useMemo } from 'react';
import { PhaserGame } from './game/PhaserGame';
import { EventBus, GameEvents } from './game/EventBus';
import { HypothesisBoard } from './ui/HypothesisBoard';
import { EvidenceTray } from './ui/EvidenceTray';
import { ScientistJournal } from './ui/ScientistJournal';
import { PhProbeLab } from './ui/PhProbeLab';
import { DataAnalysis } from './ui/DataAnalysis';
import { VerdictPanel } from './ui/VerdictPanel';
import { ReflectionDialog } from './ui/ReflectionDialog';
import { ScoreCard } from './ui/ScoreCard';
import { PhaseStepper } from './ui/PhaseStepper';
import { Confetti } from './ui/Confetti';
import { caseOne } from './cases/case-01-poisoned-principal';
import { useGameStore } from './store/gameStore';
import { buildProgress, scoreCase } from './lib/ibCriteria';
import { loadProgress, saveProgress } from './lib/progress';

function App() {
  const phase = useGameStore((s) => s.phase);
  const activeCaseId = useGameStore((s) => s.activeCaseId);
  const startCase = useGameStore((s) => s.startCase);
  const resetCase = useGameStore((s) => s.resetCase);

  useEvidenceBusBridge();

  if (phase === 'menu' || !activeCaseId) {
    return <MainMenu onStart={() => startCase(caseOne.id)} />;
  }

  return (
    <main className="mx-auto max-w-6xl space-y-5 p-4 md:p-8">
      <CaseHeader onExit={resetCase} />
      <CasePhaseRouter />
    </main>
  );
}

function useEvidenceBusBridge() {
  const collectEvidence = useGameStore((s) => s.collectEvidence);
  useEffect(() => {
    const handler = (payload: { id: string }) => collectEvidence(payload.id);
    EventBus.on(GameEvents.EvidenceCollected, handler);
    return () => {
      EventBus.off(GameEvents.EvidenceCollected, handler);
    };
  }, [collectEvidence]);
}

function CaseHeader({ onExit }: { onExit: () => void }) {
  const phase = useGameStore((s) => s.phase);
  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <p className="text-xs uppercase tracking-widest text-detective-amber">Case 01 · Chemistry</p>
        <h1 className="text-2xl font-bold text-detective-paper">{caseOne.title}</h1>
      </div>
      <div className="flex items-center gap-3">
        <PhaseStepper current={phase} />
        <button className="btn-ghost text-xs" onClick={onExit}>
          Exit case
        </button>
      </div>
    </header>
  );
}

function CasePhaseRouter() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'crime-scene':
      return <CrimeScenePhase />;
    case 'hypothesis':
      return <HypothesisPhase />;
    case 'lab':
      return <LabPhase />;
    case 'analysis':
      return <AnalysisPhase />;
    case 'verdict':
      return <VerdictPhase />;
    case 'reflection':
      return <ReflectionPhase />;
    case 'complete':
      return <CompletePhase />;
    default:
      return null;
  }
}

function StoryBanner() {
  return (
    <p className="rounded-md border border-detective-slate bg-detective-navy/60 p-4 text-sm leading-relaxed text-detective-paper/90">
      {caseOne.story}
    </p>
  );
}

function JournalSidebar() {
  const collected = useGameStore((s) => s.evidenceCollected);
  const phReadings = useGameStore((s) => s.phReadings);

  const observations = useMemo(() => {
    const lines: string[] = [];
    collected.forEach((id) => {
      const e = caseOne.evidence.find((x) => x.id === id);
      if (e) lines.push(`📍 ${e.name} — ${e.description}`);
    });
    Object.entries(phReadings).forEach(([id, r]) => {
      const e = caseOne.evidence.find((x) => x.id === id);
      if (e) lines.push(`🧪 ${e.name}: pH ≈ ${r.ph.toFixed(1)} (${r.classification.replace('-', ' ')})`);
    });
    return lines;
  }, [collected, phReadings]);

  return <ScientistJournal activeCase={caseOne} observations={observations} />;
}

function CrimeScenePhase() {
  const collected = useGameStore((s) => s.evidenceCollected);
  const setPhase = useGameStore((s) => s.setPhase);

  const minToProceed = Math.min(4, caseOne.evidence.length);
  const canProceed = collected.length >= minToProceed;

  return (
    <>
      <StoryBanner />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <PhaserGame />
        </div>
        <JournalSidebar />
      </div>
      <EvidenceTray evidence={caseOne.evidence} collectedIds={collected} />
      <div className="flex items-center justify-between">
        <p className="text-sm text-detective-paper/70">
          Evidence collected: <span className="readout">{collected.length}</span> /{' '}
          {caseOne.evidence.length} (need at least {minToProceed} to proceed)
        </p>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={() => setPhase('hypothesis')}
        >
          Go to Hypothesis Board →
        </button>
      </div>
    </>
  );
}

function HypothesisPhase() {
  const setPhase = useGameStore((s) => s.setPhase);
  const submitHypotheses = useGameStore((s) => s.submitHypotheses);
  const setHypothesisGrades = useGameStore((s) => s.setHypothesisGrades);

  const handleSubmit = useCallback(
    (cards: import('./ui/HypothesisBoard').HypothesisCard[]) => {
      submitHypotheses(cards.map((c) => c.id));
      const grades = cards.map((c) => c.grade).filter((g): g is import('./cases/types').AiGrade => g !== null);
      setHypothesisGrades(grades);
      EventBus.emit(GameEvents.HypothesisSubmitted, { count: cards.length });
      setPhase('lab');
    },
    [submitHypotheses, setHypothesisGrades, setPhase],
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <HypothesisBoard activeCase={caseOne} onSubmit={handleSubmit} />
      </div>
      <JournalSidebar />
    </div>
  );
}

function LabPhase() {
  const collected = useGameStore((s) => s.evidenceCollected);
  const phReadings = useGameStore((s) => s.phReadings);
  const setPhReadings = useGameStore((s) => s.setPhReadings);
  const recordTests = useGameStore((s) => s.recordTests);
  const setPhase = useGameStore((s) => s.setPhase);

  const handleComplete = useCallback(
    (readings: Record<string, import('./cases/types').PhReading>, testIds: string[]) => {
      setPhReadings(readings);
      recordTests(testIds);
      EventBus.emit(GameEvents.TestPerformed, { tool: 'ph_probe', count: testIds.length });
      setPhase('analysis');
    },
    [setPhReadings, recordTests, setPhase],
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <PhProbeLab
          activeCase={caseOne}
          collectedIds={collected}
          initialReadings={phReadings}
          onComplete={handleComplete}
        />
      </div>
      <JournalSidebar />
    </div>
  );
}

function AnalysisPhase() {
  const phReadings = useGameStore((s) => s.phReadings);
  const setPhase = useGameStore((s) => s.setPhase);
  const setConfidence = useGameStore((s) => s.setConfidence);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <DataAnalysis
          activeCase={caseOne}
          readings={phReadings}
          onContinue={(confidence) => {
            setConfidence(confidence);
            setPhase('verdict');
          }}
        />
      </div>
      <JournalSidebar />
    </div>
  );
}

function VerdictPhase() {
  const setVerdict = useGameStore((s) => s.setVerdict);
  const setVerdictGrade = useGameStore((s) => s.setVerdictGrade);
  const setPhase = useGameStore((s) => s.setPhase);
  const phReadings = useGameStore((s) => s.phReadings);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <VerdictPanel
          activeCase={caseOne}
          readings={phReadings}
          onSubmit={(suspectId, reasoning, grade) => {
            setVerdict(suspectId, reasoning);
            setVerdictGrade(grade);
            EventBus.emit(GameEvents.VerdictSubmitted, { suspectId });
            setPhase('reflection');
          }}
        />
      </div>
      <JournalSidebar />
    </div>
  );
}

function ReflectionPhase() {
  const setReflections = useGameStore((s) => s.setReflections);
  const setPhase = useGameStore((s) => s.setPhase);
  const completeCase = useGameStore((s) => s.completeCase);

  const evidenceCollected = useGameStore((s) => s.evidenceCollected);
  const hypothesesSubmitted = useGameStore((s) => s.hypothesesSubmitted);
  const hypothesisGrades = useGameStore((s) => s.hypothesisGrades);
  const testsPerformed = useGameStore((s) => s.testsPerformed);
  const finalVerdict = useGameStore((s) => s.finalVerdict);
  const verdictGrade = useGameStore((s) => s.verdictGrade);
  const confidence = useGameStore((s) => s.confidence);
  const setReflectionGradeStore = useGameStore((s) => s.setReflectionGrade);

  const handleComplete = useCallback(
    (answers: Record<string, string>, grades: Record<string, import('./cases/types').AiGrade>) => {
      setReflections(answers);
      Object.entries(grades).forEach(([qid, grade]) => setReflectionGradeStore(qid, grade));

      const input = {
        case: caseOne,
        evidenceCollected,
        hypothesesSubmitted,
        hypothesisGrades,
        testsPerformed,
        finalVerdict,
        verdictGrade,
        reflections: answers,
        reflectionGrades: grades,
        confidence,
      };
      const scores = scoreCase(input);
      const progress = buildProgress(caseOne.id, input, scores);
      saveProgress(progress);
      completeCase(progress);
      setPhase('complete');
    },
    [
      setReflections,
      setReflectionGradeStore,
      completeCase,
      setPhase,
      evidenceCollected,
      hypothesesSubmitted,
      hypothesisGrades,
      testsPerformed,
      finalVerdict,
      verdictGrade,
      confidence,
    ],
  );

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="md:col-span-2">
        <ReflectionDialog activeCase={caseOne} onComplete={handleComplete} />
      </div>
      <JournalSidebar />
    </div>
  );
}

function CompletePhase() {
  const progress = useGameStore((s) => s.progress);
  const resetCase = useGameStore((s) => s.resetCase);
  const finalVerdict = useGameStore((s) => s.finalVerdict);

  if (!progress) return null;

  const verdictCorrect = finalVerdict === caseOne.correctVerdict;
  const suspect = caseOne.suspects.find((s) => s.id === finalVerdict);

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {verdictCorrect && <Confetti />}
      <div className="space-y-4 md:col-span-2">
        <section
          className={`panel ${
            verdictCorrect
              ? 'border-detective-amber/60 animate-reveal-pop'
              : 'border-detective-clue/60 animate-shake animate-flash-red'
          }`}
        >
          <h2 className="text-2xl font-bold text-detective-paper">
            {verdictCorrect ? '🎉  Case solved!' : '✗  Case closed — verdict was wrong.'}
          </h2>
          <p className="mt-2 text-sm text-detective-paper/80">
            You named <span className="font-semibold">{suspect?.name ?? '—'}</span> as the cause.
            {verdictCorrect
              ? ' That matches the chemistry: a strong acid (pH ≈ 1) was added to the principal\'s coffee.'
              : ` The correct cause was the unknown strong acid (Bottle D), pH ≈ 1, matching the residue in the mug.`}
          </p>
        </section>

        <div className="animate-slide-in-up">
          <ScoreCard scores={progress.scores} />
        </div>
      </div>
      <div className="space-y-4">
        <JournalSidebar />
        <div className="flex flex-col gap-2">
          <button className="btn-primary" onClick={resetCase}>
            Back to menu
          </button>
        </div>
      </div>
    </div>
  );
}

function MainMenu({ onStart }: { onStart: () => void }) {
  const lastProgress = useMemo(() => loadProgress(caseOne.id), []);
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
      {lastProgress?.completedAt && (
        <p className="mt-6 text-xs text-detective-paper/60">
          Last attempt: A:{lastProgress.scores.A} B:{lastProgress.scores.B} C:
          {lastProgress.scores.C} D:{lastProgress.scores.D} ·{' '}
          {new Date(lastProgress.completedAt).toLocaleDateString()}
        </p>
      )}
    </main>
  );
}

export default App;
