import { useCallback, useState } from 'react';
import type { AiGrade, Case, ReflectionQuestion } from '../cases/types';
import { gradeAnswer } from '../lib/aiGrader';
import { AiFeedbackPanel } from './AiFeedbackPanel';

interface ReflectionDialogProps {
  activeCase: Case;
  onComplete: (answers: Record<string, string>, grades: Record<string, AiGrade>) => void;
}

export function ReflectionDialog({ activeCase, onComplete }: ReflectionDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [grades, setGrades] = useState<Record<string, AiGrade>>({});
  const [pending, setPending] = useState<Set<string>>(new Set());

  const allAnswered = activeCase.reflectionQuestions.every(
    (q) => (answers[q.id]?.trim().length ?? 0) > 0,
  );

  const grade = useCallback(
    async (q: ReflectionQuestion) => {
      const answer = answers[q.id]?.trim();
      if (!answer) return;
      setPending((s) => new Set(s).add(q.id));
      const result = await gradeAnswer({
        type: 'reflection',
        criterion: q.criterion,
        caseTitle: activeCase.title,
        caseStory: activeCase.story,
        question: q.question,
        answer,
      });
      setGrades((g) => ({ ...g, [q.id]: result }));
      setPending((s) => {
        const n = new Set(s);
        n.delete(q.id);
        return n;
      });
    },
    [activeCase, answers],
  );

  return (
    <section className="panel">
      <h2 className="mb-2 text-lg font-semibold text-detective-paper">Reflection</h2>
      <p className="mb-4 text-sm text-detective-paper/70">
        IB MYP Sciences — one question per Criterion (A–D). Ask for AI feedback to deepen your
        answer, then complete the case.
      </p>
      <ol className="space-y-5">
        {activeCase.reflectionQuestions.map((q, i) => (
          <li key={q.id}>
            <p className="text-sm font-semibold text-detective-paper">
              {i + 1}. <span className="text-detective-amber">[Crit {q.criterion}]</span>{' '}
              {q.question}
            </p>
            <textarea
              className="mt-2 w-full rounded-md bg-detective-ink p-2 text-sm"
              rows={3}
              value={answers[q.id] ?? ''}
              onChange={(e) => {
                setAnswers({ ...answers, [q.id]: e.target.value });
                setGrades((g) => {
                  const next = { ...g };
                  delete next[q.id];
                  return next;
                });
              }}
            />
            <div className="mt-2 flex justify-end">
              <button
                className="btn-ghost text-xs"
                disabled={
                  (answers[q.id]?.trim().length ?? 0) < 15 || pending.has(q.id)
                }
                onClick={() => grade(q)}
              >
                {grades[q.id] ? 'Re-grade' : 'Get AI feedback'}
              </button>
            </div>
            <AiFeedbackPanel grade={grades[q.id] ?? null} loading={pending.has(q.id)} compact />
          </li>
        ))}
      </ol>
      <div className="mt-5 flex justify-end">
        <button
          className="btn-primary"
          disabled={!allAnswered}
          onClick={() => onComplete(answers, grades)}
        >
          Finish reflection
        </button>
      </div>
    </section>
  );
}
