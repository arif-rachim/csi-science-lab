import { useState } from 'react';
import type { Case } from '../cases/types';

interface VerdictPanelProps {
  activeCase: Case;
  onSubmit: (suspectId: string, reasoning: string) => void;
}

export function VerdictPanel({ activeCase, onSubmit }: VerdictPanelProps) {
  const [suspectId, setSuspectId] = useState<string | null>(null);
  const [reasoning, setReasoning] = useState('');

  const canSubmit = Boolean(suspectId) && reasoning.trim().length >= 20;

  return (
    <section className="panel">
      <h2 className="mb-2 text-lg font-semibold text-detective-paper">Final Verdict</h2>
      <p className="mb-3 text-sm text-detective-paper/70">
        Choose the cause and justify it scientifically.
      </p>
      <ul className="space-y-2">
        {activeCase.suspects.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              onClick={() => setSuspectId(s.id)}
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
        rows={4}
        placeholder="Explain your reasoning using the evidence and your hypotheses."
        value={reasoning}
        onChange={(e) => setReasoning(e.target.value)}
      />
      <div className="mt-3 flex items-center justify-end">
        <button
          className="btn-primary"
          disabled={!canSubmit}
          onClick={() => suspectId && onSubmit(suspectId, reasoning)}
        >
          Submit verdict
        </button>
      </div>
    </section>
  );
}
