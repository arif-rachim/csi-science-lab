import { useCallback, useEffect, useMemo, useState } from 'react';
import { HypothesisBoard, type HypothesisCard } from './ui/HypothesisBoard';
import { EvidenceTray } from './ui/EvidenceTray';
import { ScientistJournal } from './ui/ScientistJournal';
import { PhProbeLab } from './ui/PhProbeLab';
import { DataAnalysis } from './ui/DataAnalysis';
import { VerdictPanel } from './ui/VerdictPanel';
import { ReflectionDialog } from './ui/ReflectionDialog';
import { ScoreCard } from './ui/ScoreCard';
import { PhaseStepper } from './ui/PhaseStepper';
import { Confetti } from './ui/Confetti';
import { Typewriter } from './ui/Typewriter';
import { CrimeSceneText } from './ui/CrimeSceneText';
import { caseOne } from './cases/case-01-poisoned-principal';
import { useGameStore } from './store/gameStore';
import { buildProgress, scoreCase } from './lib/ibCriteria';
import { loadProgress, saveProgress } from './lib/progress';
import { audio } from './lib/audio';
import type { AiGrade, CasePhase, PhReading } from './cases/types';

function App() {
  const phase = useGameStore((s) => s.phase);
  const activeCaseId = useGameStore((s) => s.activeCaseId);
  const startCase = useGameStore((s) => s.startCase);
  const resetCase = useGameStore((s) => s.resetCase);
  const finalVerdict = useGameStore((s) => s.finalVerdict);

  usePhaseAudio(phase, finalVerdict);

  const handleStart = () => {
    audio.ensure();
    startCase(caseOne.id);
  };

  const handleExit = () => {
    audio.stopDrone();
    resetCase();
  };

  return (
    <>
      <ScreenOverlays />
      {phase === 'menu' || !activeCaseId ? (
        <MainMenu onStart={handleStart} />
      ) : (
        <main className="crt-flicker mx-auto max-w-5xl space-y-4 p-3 md:p-6">
          <CaseHeader onExit={handleExit} />
          <CasePhaseRouter />
        </main>
      )}
    </>
  );
}

function usePhaseAudio(phase: CasePhase, finalVerdict: string | null) {
  useEffect(() => {
    if (phase === 'intro') {
      audio.startDrone();
    } else if (phase === 'menu') {
      audio.stopDrone();
    }
  }, [phase]);

  useEffect(() => {
    if (phase === 'verdict') audio.sting('suspense');
  }, [phase]);

  useEffect(() => {
    if (phase === 'complete') {
      const correct = finalVerdict === caseOne.correctVerdict;
      audio.sting(correct ? 'win' : 'fail');
    }
  }, [phase, finalVerdict]);
}

function MuteToggle() {
  const [muted, setMuted] = useState(audio.isMuted());
  return (
    <button
      className="btn-ghost text-xs"
      onClick={() => {
        const next = !muted;
        audio.setMuted(next);
        setMuted(next);
      }}
      title={muted ? 'Sound off — click to enable' : 'Sound on — click to mute'}
    >
      {muted ? '[M] ♪ OFF' : '[M] ♪ ON'}
    </button>
  );
}

function ScreenOverlays() {
  return (
    <>
      <div className="scanlines" />
      <div className="vignette" />
    </>
  );
}

function CaseHeader({ onExit }: { onExit: () => void }) {
  const phase = useGameStore((s) => s.phase);
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-crt-rule pb-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-crt-dim">
            Student Forensics Club · Secure Terminal
          </p>
          <h1 className="text-2xl uppercase text-crt-bright text-glow-strong md:text-3xl">
            {caseOne.title}
          </h1>
          <p className="text-xs text-crt-dim">{caseOne.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <MuteToggle />
          <button className="btn-ghost text-xs" onClick={onExit}>
            [Q] Log out
          </button>
        </div>
      </div>
      {phase !== 'intro' && phase !== 'complete' && <PhaseStepper current={phase} />}
    </header>
  );
}

function CasePhaseRouter() {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'intro':
      return <IntroPhase />;
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

function PhaseFlavor({ phase }: { phase: keyof typeof caseOne.phaseFlavor }) {
  const text = caseOne.phaseFlavor[phase];
  if (!text) return null;
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-snug text-crt-dim animate-slide-in-up">
      {text}
    </pre>
  );
}

function JournalSidebar() {
  const collected = useGameStore((s) => s.evidenceCollected);
  const phReadings = useGameStore((s) => s.phReadings);

  const observations = useMemo(() => {
    const lines: string[] = [];
    collected.forEach((id) => {
      const e = caseOne.evidence.find((x) => x.id === id);
      if (e) lines.push(`> ${e.name}`);
    });
    Object.entries(phReadings).forEach(([id, r]) => {
      const e = caseOne.evidence.find((x) => x.id === id);
      if (e) lines.push(`* ${e.name}: pH ${r.ph.toFixed(1)} (${r.classification.replace('-', ' ')})`);
    });
    return lines;
  }, [collected, phReadings]);

  return <ScientistJournal activeCase={caseOne} observations={observations} />;
}

function IntroPhase() {
  const setPhase = useGameStore((s) => s.setPhase);
  const [done, setDone] = useState(false);
  return (
    <section className="panel-titled space-y-5" data-title="Incoming Transmission">
      <Typewriter text={caseOne.intro} speed={14} onDone={() => setDone(true)} />
      {done && (
        <div className="flex justify-end animate-slide-in-up">
          <button className="btn-primary" onClick={() => setPhase('crime-scene')}>
            [Enter] Drive to the school ▶
          </button>
        </div>
      )}
    </section>
  );
}

function CrimeScenePhase() {
  const collected = useGameStore((s) => s.evidenceCollected);
  const collectEvidence = useGameStore((s) => s.collectEvidence);
  const setPhase = useGameStore((s) => s.setPhase);

  const minToProceed = Math.min(4, caseOne.evidence.length);
  const canProceed = collected.length >= minToProceed;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <CrimeSceneText
            activeCase={caseOne}
            collectedIds={collected}
            onCollect={collectEvidence}
          />
        </div>
        <JournalSidebar />
      </div>
      <EvidenceTray evidence={caseOne.evidence} collectedIds={collected} />
      <div className="flex items-center justify-between border-t border-crt-rule pt-3">
        <p className="text-sm text-crt-dim">
          Evidence logged: <span className="readout">{collected.length}</span> /{' '}
          {caseOne.evidence.length} · need {minToProceed}+
        </p>
        <button
          className="btn-primary"
          disabled={!canProceed}
          onClick={() => setPhase('hypothesis')}
        >
          [Enter] To Hypothesis Notebook ▶
        </button>
      </div>
    </div>
  );
}

function HypothesisPhase() {
  const setPhase = useGameStore((s) => s.setPhase);
  const submitHypotheses = useGameStore((s) => s.submitHypotheses);
  const setHypothesisGrades = useGameStore((s) => s.setHypothesisGrades);

  const handleSubmit = useCallback(
    (cards: HypothesisCard[]) => {
      submitHypotheses(cards.map((c) => c.id));
      const grades = cards.map((c) => c.grade).filter((g): g is AiGrade => g !== null);
      setHypothesisGrades(grades);
      setPhase('lab');
    },
    [submitHypotheses, setHypothesisGrades, setPhase],
  );

  return (
    <div className="space-y-4">
      <PhaseFlavor phase="hypothesis" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <HypothesisBoard activeCase={caseOne} onSubmit={handleSubmit} />
        </div>
        <JournalSidebar />
      </div>
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
    (readings: Record<string, PhReading>, testIds: string[]) => {
      setPhReadings(readings);
      recordTests(testIds);
      setPhase('analysis');
    },
    [setPhReadings, recordTests, setPhase],
  );

  return (
    <div className="space-y-4">
      <PhaseFlavor phase="lab" />
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
    </div>
  );
}

function AnalysisPhase() {
  const phReadings = useGameStore((s) => s.phReadings);
  const setPhase = useGameStore((s) => s.setPhase);
  const setConfidence = useGameStore((s) => s.setConfidence);

  return (
    <div className="space-y-4">
      <PhaseFlavor phase="analysis" />
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
    </div>
  );
}

function VerdictPhase() {
  const setVerdict = useGameStore((s) => s.setVerdict);
  const setVerdictGrade = useGameStore((s) => s.setVerdictGrade);
  const setPhase = useGameStore((s) => s.setPhase);
  const phReadings = useGameStore((s) => s.phReadings);

  return (
    <div className="space-y-4">
      <PhaseFlavor phase="verdict" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <VerdictPanel
            activeCase={caseOne}
            readings={phReadings}
            onSubmit={(suspectId, reasoning, grade) => {
              setVerdict(suspectId, reasoning);
              setVerdictGrade(grade);
              setPhase('reflection');
            }}
          />
        </div>
        <JournalSidebar />
      </div>
    </div>
  );
}

function ReflectionPhase() {
  const setReflections = useGameStore((s) => s.setReflections);
  const setPhase = useGameStore((s) => s.setPhase);
  const completeCase = useGameStore((s) => s.completeCase);
  const setReflectionGradeStore = useGameStore((s) => s.setReflectionGrade);

  const evidenceCollected = useGameStore((s) => s.evidenceCollected);
  const hypothesesSubmitted = useGameStore((s) => s.hypothesesSubmitted);
  const hypothesisGrades = useGameStore((s) => s.hypothesisGrades);
  const testsPerformed = useGameStore((s) => s.testsPerformed);
  const finalVerdict = useGameStore((s) => s.finalVerdict);
  const verdictGrade = useGameStore((s) => s.verdictGrade);
  const confidence = useGameStore((s) => s.confidence);

  const handleComplete = useCallback(
    (answers: Record<string, string>, grades: Record<string, AiGrade>) => {
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
    <div className="space-y-4">
      <PhaseFlavor phase="reflection" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReflectionDialog activeCase={caseOne} onComplete={handleComplete} />
        </div>
        <JournalSidebar />
      </div>
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
    <div className="space-y-4">
      {verdictCorrect && <Confetti />}
      <PhaseFlavor phase="complete" />

      <section
        className={`panel ${
          verdictCorrect
            ? 'animate-reveal-pop border-crt-fg'
            : 'animate-shake animate-flash-red border-crt-danger'
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-crt-dim">{caseOne.subtitle}</p>
        <h2 className="mt-1 text-3xl uppercase text-crt-bright text-glow-strong">
          {verdictCorrect ? 'CASE CLOSED · CORRECT' : 'CASE CLOSED · WRONG CALL'}
        </h2>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-snug text-crt-fg">
          {verdictCorrect
            ? `You flagged ${suspect?.name}.

The hospital matched the antidote in fifteen minutes.
Pak Hartono is awake. Pak Budi was picked up at 06:50
while trying to enter the school. The HCl bottle in
his car still has his fingerprints on it.

The doctor sent a note: "Tell the kid thanks."

You go home, change out of your gloves, and sleep
for the first time tonight.`
            : `You named ${suspect?.name ?? '(no one)'}.

The doctor picked the wrong antidote. Pak Hartono is
in worse condition. He will recover — eventually —
but you lost three hours.

The actual cause was Bottle D, an unlabeled strong
acid (pH ≈ 1) that matched the residue in his coffee
mug.

Bu Sari does not look at you when you leave.`}
        </pre>
      </section>

      <div className="animate-slide-in-up">
        <ScoreCard scores={progress.scores} />
      </div>

      <div className="flex justify-end">
        <button className="btn-primary" onClick={resetCase}>
          [Enter] Log out and go home
        </button>
      </div>
    </div>
  );
}

function MainMenu({ onStart }: { onStart: () => void }) {
  const lastProgress = useMemo(() => loadProgress(caseOne.id), []);
  return (
    <main className="crt-flicker mx-auto flex min-h-full max-w-3xl flex-col items-center justify-center p-6 text-center">
      <pre className="text-crt-dim text-xs leading-tight">{`
   ░█▀▀░█▀▀░▀█▀░░░░█▀▀░█▀▀░▀█▀░█▀▀░█▀█░█▀▀░█▀▀░░░█░░░█▀█░█▀▄
   ░█░░░▀▀█░░█░░▀▀░▀▀█░█░░░░█░░█▀▀░█░█░█░░░█▀▀░░░█░░░█▀█░█▀▄
   ░▀▀▀░▀▀▀░▀▀▀░░░░▀▀▀░▀▀▀░▀▀▀░▀▀▀░▀░▀░▀▀▀░▀▀▀░░░▀▀▀░▀░▀░▀▀░
`}</pre>
      <p className="mb-2 text-xs uppercase tracking-[0.4em] text-crt-dim">
        IB MYP Year 4 · Sciences · Forensics Lab
      </p>
      <h1 className="mb-3 text-3xl uppercase text-crt-bright text-glow-strong md:text-4xl">
        Solve the case using the scientific method
      </h1>
      <p className="mb-8 max-w-xl text-crt-fg/85">
        You are a junior member of the Student Forensics Club. The school's
        principal — your mentor — has been poisoned. You have twenty minutes
        in his office before the police arrive.
      </p>

      <p className="mb-3 text-sm text-crt-dim">&gt; Available cases:</p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button className="btn-primary" onClick={onStart}>
          [1] {caseOne.title}
        </button>
        <button className="btn-ghost" disabled>
          [2] Mystery in the Pond — LOCKED
        </button>
      </div>

      <div className="mt-6 flex items-center gap-3 text-xs text-crt-dim">
        <span>&gt; Headphones recommended.</span>
        <MuteToggle />
      </div>

      {lastProgress?.completedAt && (
        <p className="mt-8 border-t border-crt-rule pt-3 text-xs text-crt-dim">
          &gt; Last attempt — A:{lastProgress.scores.A} B:{lastProgress.scores.B} C:
          {lastProgress.scores.C} D:{lastProgress.scores.D} ·{' '}
          {new Date(lastProgress.completedAt).toLocaleDateString()}
        </p>
      )}
    </main>
  );
}

export default App;
