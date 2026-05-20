import { useState } from 'react';
import type { ReflectionQuestion } from '../cases/types';

interface ReflectionDialogProps {
  questions: ReflectionQuestion[];
  onComplete: (answers: Record<string, string>) => void;
}

export function ReflectionDialog({ questions, onComplete }: ReflectionDialogProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const allAnswered = questions.every((q) => (answers[q.id]?.trim().length ?? 0) > 0);

  return (
    <section className="panel">
      <h2 className="mb-2 text-lg font-semibold text-detective-paper">Reflection</h2>
      <p className="mb-4 text-sm text-detective-paper/70">
        IB MYP Criterion D — Reflecting on the impacts of science.
      </p>
      <ol className="space-y-4">
        {questions.map((q, i) => (
          <li key={q.id}>
            <p className="text-sm font-semibold text-detective-paper">
              {i + 1}. <span className="text-detective-amber">[Crit {q.criterion}]</span>{' '}
              {q.question}
            </p>
            <textarea
              className="mt-2 w-full rounded-md bg-detective-ink p-2 text-sm"
              rows={3}
              value={answers[q.id] ?? ''}
              onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
            />
          </li>
        ))}
      </ol>
      <div className="mt-4 flex justify-end">
        <button
          className="btn-primary"
          disabled={!allAnswered}
          onClick={() => onComplete(answers)}
        >
          Finish reflection
        </button>
      </div>
    </section>
  );
}
