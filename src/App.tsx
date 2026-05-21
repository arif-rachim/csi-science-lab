import { useCallback, useEffect, useMemo, useState } from 'react';
import { HypothesisBoard, type HypothesisCard } from './ui/HypothesisBoard';
import { EvidenceTray } from './ui/EvidenceTray';
import { ScientistJournal } from './ui/ScientistJournal';
import { PhProbeLab } from './ui/PhProbeLab';
import { MicroscopeLab } from './ui/MicroscopeLab';
import { WaterAnalysisLab } from './ui/WaterAnalysisLab';
import { DataAnalysis } from './ui/DataAnalysis';
import { VerdictPanel } from './ui/VerdictPanel';
import { ReflectionDialog } from './ui/ReflectionDialog';
import { ScoreCard } from './ui/ScoreCard';
import { PhaseStepper } from './ui/PhaseStepper';
import { Confetti } from './ui/Confetti';
import { Typewriter } from './ui/Typewriter';
import { CrimeSceneText } from './ui/CrimeSceneText';
import { AiSettings } from './ui/AiSettings';
import { cases, getCase } from './cases';
import { useGameStore } from './store/gameStore';
import { buildProgress, scoreCase } from './lib/ibCriteria';
import { loadProgress, saveProgress } from './lib/progress';
import { audio } from './lib/audio';
import { hasApiKey } from './lib/aiKey';
import type {
  AiGrade,
  Case,
  CasePhase,
  MicroscopeReading,
  PhReading,
  WaterReading,
} from './cases/types';

function useActiveCase(): Case | null {
  const id = useGameStore((s) => s.activeCaseId);
  return id ? (getCase(id) ?? null) : null;
}

function App() {
  const phase = useGameStore((s) => s.phase);
  const activeCase = useActiveCase();
  const startCase = useGameStore((s) => s.startCase);
  const resetCase = useGameStore((s) => s.resetCase);
  const finalVerdict = useGameStore((s) => s.finalVerdict);

  usePhaseAudio(phase, finalVerdict, activeCase);

  const handleStart = (caseId: string) => {
    audio.ensure();
    startCase(caseId);
  };

  const handleExit = () => {
    audio.stopDrone();
    resetCase();
  };

  return (
    <>
      <ScreenOverlays />
      {phase === 'menu' || !activeCase ? (
        <MainMenu onStart={handleStart} />
      ) : (
        <main className="mx-auto max-w-5xl space-y-4 p-3 md:p-6">
          <CaseHeader activeCase={activeCase} onExit={handleExit} />
          <CasePhaseRouter activeCase={activeCase} />
        </main>
      )}
    </>
  );
}

function usePhaseAudio(
  phase: CasePhase,
  finalVerdict: string | null,
  activeCase: Case | null,
) {
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
    if (phase === 'complete' && activeCase) {
      const correct = finalVerdict === activeCase.correctVerdict;
      audio.sting(correct ? 'win' : 'fail');
    }
  }, [phase, finalVerdict, activeCase]);
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

function CaseHeader({ activeCase, onExit }: { activeCase: Case; onExit: () => void }) {
  const phase = useGameStore((s) => s.phase);
  return (
    <header className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-crt-rule pb-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-crt-dim">
            Student Forensics Club · Secure Terminal
          </p>
          <h1 className="text-2xl uppercase text-crt-bright text-glow-strong md:text-3xl">
            {activeCase.title}
          </h1>
          <p className="text-xs text-crt-dim">{activeCase.subtitle}</p>
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

function CasePhaseRouter({ activeCase }: { activeCase: Case }) {
  const phase = useGameStore((s) => s.phase);

  switch (phase) {
    case 'intro':
      return <IntroPhase activeCase={activeCase} />;
    case 'crime-scene':
      return <CrimeScenePhase activeCase={activeCase} />;
    case 'hypothesis':
      return <HypothesisPhase activeCase={activeCase} />;
    case 'lab':
      return <LabPhase activeCase={activeCase} />;
    case 'analysis':
      return <AnalysisPhase activeCase={activeCase} />;
    case 'verdict':
      return <VerdictPhase activeCase={activeCase} />;
    case 'reflection':
      return <ReflectionPhase activeCase={activeCase} />;
    case 'complete':
      return <CompletePhase activeCase={activeCase} />;
    default:
      return null;
  }
}

function PhaseFlavor({ activeCase, phase }: { activeCase: Case; phase: keyof typeof activeCase.phaseFlavor }) {
  const text = activeCase.phaseFlavor[phase];
  if (!text) return null;
  return (
    <pre className="whitespace-pre-wrap font-mono text-sm leading-snug text-crt-dim animate-slide-in-up">
      {text}
    </pre>
  );
}

function JournalSidebar({ activeCase }: { activeCase: Case }) {
  const collected = useGameStore((s) => s.evidenceCollected);
  const phReadings = useGameStore((s) => s.phReadings);
  const waterReadings = useGameStore((s) => s.waterReadings);
  const microscopeReadings = useGameStore((s) => s.microscopeReadings);

  const observations = useMemo(() => {
    const lines: string[] = [];
    collected.forEach((id) => {
      const e = activeCase.evidence.find((x) => x.id === id);
      if (e) lines.push(`> ${e.name}`);
    });
    Object.entries(phReadings).forEach(([id, r]) => {
      const e = activeCase.evidence.find((x) => x.id === id);
      if (e) lines.push(`* ${e.name}: pH ${r.ph.toFixed(1)} (${r.classification.replace('-', ' ')})`);
    });
    Object.entries(microscopeReadings).forEach(([id, r]) => {
      const e = activeCase.evidence.find((x) => x.id === id);
      if (e) lines.push(`◎ ${e.name}: ${r.organism} (${r.classification})`);
    });
    Object.entries(waterReadings).forEach(([id, r]) => {
      const e = activeCase.evidence.find((x) => x.id === id);
      if (e)
        lines.push(
          `≈ ${e.name}: pH ${r.ph.toFixed(1)} · DO ${r.dissolvedO2.toFixed(1)} · NO₃ ${r.nitrate.toFixed(0)} (${r.status})`,
        );
    });
    return lines;
  }, [collected, phReadings, waterReadings, microscopeReadings, activeCase]);

  return <ScientistJournal activeCase={activeCase} observations={observations} />;
}

function IntroPhase({ activeCase }: { activeCase: Case }) {
  const setPhase = useGameStore((s) => s.setPhase);
  const [done, setDone] = useState(false);
  return (
    <section className="panel-titled space-y-5" data-title="Incoming Transmission">
      <Typewriter text={activeCase.intro} speed={14} onDone={() => setDone(true)} />
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

function CrimeScenePhase({ activeCase }: { activeCase: Case }) {
  const collected = useGameStore((s) => s.evidenceCollected);
  const collectEvidence = useGameStore((s) => s.collectEvidence);
  const setPhase = useGameStore((s) => s.setPhase);

  const minToProceed = Math.min(4, activeCase.evidence.length);
  const canProceed = collected.length >= minToProceed;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <CrimeSceneText
            activeCase={activeCase}
            collectedIds={collected}
            onCollect={collectEvidence}
          />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
      <EvidenceTray evidence={activeCase.evidence} collectedIds={collected} />
      <div className="flex items-center justify-between border-t border-crt-rule pt-3">
        <p className="text-sm text-crt-dim">
          Evidence logged: <span className="readout">{collected.length}</span> /{' '}
          {activeCase.evidence.length} · need {minToProceed}+
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

function HypothesisPhase({ activeCase }: { activeCase: Case }) {
  const setPhase = useGameStore((s) => s.setPhase);
  const submitHypotheses = useGameStore((s) => s.submitHypotheses);
  const setHypothesisGrades = useGameStore((s) => s.setHypothesisGrades);

  const handleSubmit = useCallback(
    (cardsSubmitted: HypothesisCard[]) => {
      submitHypotheses(cardsSubmitted.map((c) => c.id));
      const grades = cardsSubmitted
        .map((c) => c.grade)
        .filter((g): g is AiGrade => g !== null);
      setHypothesisGrades(grades);
      setPhase('lab');
    },
    [submitHypotheses, setHypothesisGrades, setPhase],
  );

  return (
    <div className="space-y-4">
      <PhaseFlavor activeCase={activeCase} phase="hypothesis" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <HypothesisBoard activeCase={activeCase} onSubmit={handleSubmit} />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function LabPhase({ activeCase }: { activeCase: Case }) {
  if (activeCase.labMode === 'water_panel') {
    return <WaterPanelLabPhase activeCase={activeCase} />;
  }
  return <PhProbeLabPhase activeCase={activeCase} />;
}

function PhProbeLabPhase({ activeCase }: { activeCase: Case }) {
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
      <PhaseFlavor activeCase={activeCase} phase="lab" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <PhProbeLab
            activeCase={activeCase}
            collectedIds={collected}
            initialReadings={phReadings}
            onComplete={handleComplete}
          />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function WaterPanelLabPhase({ activeCase }: { activeCase: Case }) {
  const collected = useGameStore((s) => s.evidenceCollected);
  const microscopeReadings = useGameStore((s) => s.microscopeReadings);
  const waterReadings = useGameStore((s) => s.waterReadings);
  const setMicroscopeReadings = useGameStore((s) => s.setMicroscopeReadings);
  const setWaterReadings = useGameStore((s) => s.setWaterReadings);
  const recordTests = useGameStore((s) => s.recordTests);
  const setPhase = useGameStore((s) => s.setPhase);

  const microscopeDone =
    Object.keys(microscopeReadings).length > 0 &&
    activeCase.evidence
      .filter((e) => activeCase.microscopeReadings?.[e.id] !== undefined && collected.includes(e.id))
      .every((e) => microscopeReadings[e.id]);

  const handleMicroscopeComplete = useCallback(
    (readings: Record<string, MicroscopeReading>, testIds: string[]) => {
      setMicroscopeReadings(readings);
      recordTests(testIds);
    },
    [setMicroscopeReadings, recordTests],
  );

  const handleWaterComplete = useCallback(
    (readings: Record<string, WaterReading>, testIds: string[]) => {
      setWaterReadings(readings);
      recordTests(testIds);
      setPhase('analysis');
    },
    [setWaterReadings, recordTests, setPhase],
  );

  return (
    <div className="space-y-4">
      <PhaseFlavor activeCase={activeCase} phase="lab" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {!microscopeDone && (
            <MicroscopeLab
              activeCase={activeCase}
              collectedIds={collected}
              initialReadings={microscopeReadings}
              onComplete={handleMicroscopeComplete}
            />
          )}
          {microscopeDone && (
            <WaterAnalysisLab
              activeCase={activeCase}
              collectedIds={collected}
              initialReadings={waterReadings}
              onComplete={handleWaterComplete}
            />
          )}
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function AnalysisPhase({ activeCase }: { activeCase: Case }) {
  const phReadings = useGameStore((s) => s.phReadings);
  const waterReadings = useGameStore((s) => s.waterReadings);
  const setPhase = useGameStore((s) => s.setPhase);
  const setConfidence = useGameStore((s) => s.setConfidence);

  return (
    <div className="space-y-4">
      <PhaseFlavor activeCase={activeCase} phase="analysis" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <DataAnalysis
            activeCase={activeCase}
            readings={phReadings}
            waterReadings={waterReadings}
            onContinue={(confidence) => {
              setConfidence(confidence);
              setPhase('verdict');
            }}
          />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function VerdictPhase({ activeCase }: { activeCase: Case }) {
  const setVerdict = useGameStore((s) => s.setVerdict);
  const setVerdictGrade = useGameStore((s) => s.setVerdictGrade);
  const setPhase = useGameStore((s) => s.setPhase);
  const phReadings = useGameStore((s) => s.phReadings);
  const waterReadings = useGameStore((s) => s.waterReadings);

  return (
    <div className="space-y-4">
      <PhaseFlavor activeCase={activeCase} phase="verdict" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <VerdictPanel
            activeCase={activeCase}
            readings={phReadings}
            waterReadings={waterReadings}
            onSubmit={(suspectId, reasoning, grade) => {
              setVerdict(suspectId, reasoning);
              setVerdictGrade(grade);
              setPhase('reflection');
            }}
          />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function ReflectionPhase({ activeCase }: { activeCase: Case }) {
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
        case: activeCase,
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
      const progress = buildProgress(activeCase.id, input, scores);
      saveProgress(progress);
      completeCase(progress);
      setPhase('complete');
    },
    [
      setReflections,
      setReflectionGradeStore,
      completeCase,
      setPhase,
      activeCase,
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
      <PhaseFlavor activeCase={activeCase} phase="reflection" />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <ReflectionDialog activeCase={activeCase} onComplete={handleComplete} />
        </div>
        <JournalSidebar activeCase={activeCase} />
      </div>
    </div>
  );
}

function CompletePhase({ activeCase }: { activeCase: Case }) {
  const progress = useGameStore((s) => s.progress);
  const resetCase = useGameStore((s) => s.resetCase);
  const finalVerdict = useGameStore((s) => s.finalVerdict);

  if (!progress) return null;

  const verdictCorrect = finalVerdict === activeCase.correctVerdict;
  const suspect = activeCase.suspects.find((s) => s.id === finalVerdict);

  return (
    <div className="space-y-4">
      {verdictCorrect && <Confetti />}
      <PhaseFlavor activeCase={activeCase} phase="complete" />

      <section
        className={`panel ${
          verdictCorrect
            ? 'animate-reveal-pop border-crt-fg'
            : 'animate-shake animate-flash-red border-crt-danger'
        }`}
      >
        <p className="text-xs uppercase tracking-widest text-crt-dim">{activeCase.subtitle}</p>
        <h2 className="mt-1 text-3xl uppercase text-crt-bright text-glow-strong">
          {verdictCorrect ? 'CASE CLOSED · CORRECT' : 'CASE CLOSED · WRONG CALL'}
        </h2>
        <pre className="mt-3 whitespace-pre-wrap font-mono text-sm leading-snug text-crt-fg">
          {verdictCorrect
            ? `You named ${suspect?.name}.\n\n${activeCase.id === 'case-02-pond-that-breathes' ? "The doctor matched the antidote in twenty minutes. Pak Yusuf is groggy but talking. Wira's parents brought her to the principal's office at 06:30 — she confessed everything. The pond will be drained and reseeded. The bio lab stayed open." : 'The hospital matched the antidote in fifteen minutes. Pak Hartono is awake. Pak Budi was picked up at 06:50 while trying to enter the school. The HCl bottle in his car still has his fingerprints on it.\n\nThe doctor sent a note: "Tell the kid thanks."'}\n\nYou go home and sleep for the first time tonight.`
            : `You named ${suspect?.name ?? '(no one)'}.\n\nThe doctor picked the wrong antidote. Recovery is slower than it had to be. The school took the hit on credibility.\n\nBu Sari does not look at you when you leave.`}
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

function MainMenu({ onStart }: { onStart: (caseId: string) => void }) {
  const [showSettings, setShowSettings] = useState(false);
  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <div className="flex flex-col items-center text-center">
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
          You are a junior member of the Student Forensics Club. Bad things keep
          happening at your school. The science is your only edge.
        </p>

        <p className="mb-3 text-sm text-crt-dim">&gt; Available cases:</p>
        <div className="flex w-full flex-col gap-3">
          {cases.map((c, i) => (
            <CaseCard key={c.id} index={i + 1} activeCase={c} onStart={() => onStart(c.id)} />
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-crt-dim">
          <span>&gt; Headphones recommended.</span>
          <MuteToggle />
          <button
            className="btn-ghost text-xs"
            onClick={() => setShowSettings((v) => !v)}
          >
            {showSettings ? '[K] Hide AI key' : '[K] AI key'}{' '}
            {hasApiKey() ? '· ●' : '· ○'}
          </button>
        </div>

        <LastAttemptsRow />
      </div>

      {showSettings && (
        <div className="animate-slide-in-up text-left">
          <AiSettings onClose={() => setShowSettings(false)} />
        </div>
      )}
    </main>
  );
}

function CaseCard({
  index,
  activeCase,
  onStart,
}: {
  index: number;
  activeCase: Case;
  onStart: () => void;
}) {
  const lastProgress = useMemo(() => loadProgress(activeCase.id), [activeCase.id]);
  return (
    <div className="border border-crt-rule bg-crt-bg/60 p-3 text-left">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-crt-dim">
            Case {String(index).padStart(2, '0')} · {activeCase.subject}
          </p>
          <p className="text-lg uppercase text-crt-bright">{activeCase.title}</p>
          <p className="mt-1 text-sm text-crt-fg/80">{activeCase.story}</p>
        </div>
        <button className="btn-primary text-xs" onClick={onStart}>
          [{index}] Start ▶
        </button>
      </div>
      {lastProgress?.completedAt && (
        <p className="mt-2 text-xs text-crt-dim">
          &gt; Last attempt — A:{lastProgress.scores.A} B:{lastProgress.scores.B} C:
          {lastProgress.scores.C} D:{lastProgress.scores.D} ·{' '}
          {new Date(lastProgress.completedAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function LastAttemptsRow() {
  return null;
}

export default App;
