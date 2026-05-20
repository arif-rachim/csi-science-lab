import { useCallback, useState } from 'react';
import type { AiGrade, Case, PhReading } from '../cases/types';
import { gradeAnswer } from '../lib/aiGrader';
import { AiFeedbackPanel } from './AiFeedbackPanel';

interface VerdictPanelProps {
  activeCase: Case;
  readings: Record<string, PhReading>;
  onSubmit: (suspectId: string, reasoning: string, grade: AiGrade) => void;
}

export function VerdictPanel({ activeCase, readings, onSubmit }: VerdictPanelProps) {
  const [suspectId, setSuspectId] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');
  const [grade, setGrade] = useState<AiGrade | null>(null);
  const [loading, setLoading] = useState(false);

  const canGrade = Boolean(suspectId) && reasoning.trim().length >= 30;

  const grader = useCallback(async () => {
    if (!suspectId) return;
    setLoading(true);
    const chosen = activeCase.suspects.find((s) => s.id === suspectId);
    const correct = activeCase.suspects.find((s) => s.id === activeCase.correctVerdict);
    const readingsSummary = Object.entries(readings)
      .map(([id, r]) => {
        const e = activeCase.evidence.find((x) => x.id === id);
        return `${e?.name ?? id}: pH ${r.ph.toFixed(1)} (${r.classification})`;
      })
      .join('; ');

    const result = await gradeAnswer({
      type: 'verdict',
      criterion: 'A',
      caseTitle: activeCase.title,
      caseStory: activeCase.story,
      answer: reasoning,
      chosenSuspectName: chosen?.name,
      correctSuspectName: correct?.name,
      isVerdictCorrect: suspectId === activeCase.correctVerdict,
      readingsSummary,
    });
    setGrade(result);
    setLoading(false);
  }, [activeCase, readings, reasoning, suspectId]);

  const canSubmit = grade !== null && grade.score >= 1;
  const needsRevision = grade !== null && grade.score === 0;

  return (
    <section className="panel">
      <h2 className="mb-2 text-lg font-semibold text-detective-paper">Final Verdict</h2>
      <p className="mb-3 text-sm text-detective-paper/70">
        Choose the cause and justify it scientifically. Your reasoning will be reviewed by AI —
        weak reasoning must be revised before submitting.
      </p>
      <ul className="space-y-2">
        {activeCase.suspects.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => {
                setSuspectId(s.id);
                setGrade(null);
              }}
              aria-pressed={suspectId === s.id}
              className={`w-full rounded-md border p-3 text-left transition ${
                suspectId === s.id
                  ? 'border-detective-amber bg-detective-amber/10'
                  : 'border-detective-slate hover:border-detective-amber/60'
              }`}
            >
              <p className="font-semibold text-detective-paper">{s.name}</p>
              {s.motive && <p className="text-xs text-detective-paper/70">{s.motive}</p>}
            </button>
          </li>
        ))}
      </ul>
      <textarea
        className="mt-4 w-full rounded-md bg-detective-ink p-3 text-sm"
        rows={5}
        placeholder="Explain your reasoning. Reference specific pH readings, the doctor's symptoms, and how the control sample compares."
        value={reasoning}
        onChange={(e) => {
          setReasoning(e.target.value);
          setGrade(null);
        }}
      />

      <AiFeedbackPanel grade={grade} loading={loading} />

      {needsRevision && (
        <p className="mt-2 rounded-md border border-detective-clue/40 bg-detective-clue/10 p-2 text-xs text-detective-paper animate-flash-red">
          Your reasoning needs more substance before you can submit. Use the AI feedback above and
          try again.
        </p>
      )}

      <div className="mt-3 flex items-center justify-end gap-2">
        <button className="btn-ghost text-xs" disabled={!canGrade || loading} onClick={grader}>
          {grade ? 'Re-grade reasoning' : 'Get AI feedback'}
        </button>
        <button
          className="btn-primary"
          disabled={!canSubmit || !suspectId}
          onClick={() => {
            if (!suspectId || !grade) return;
            onSubmit(suspectId, reasoning, grade);
          }}
        >
          Submit verdict
        </button>
      </div>
    </section>
  );
}
