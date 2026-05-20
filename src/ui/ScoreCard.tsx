import type { CriterionScores } from '../lib/ibCriteria';

interface ScoreCardProps {
  scores: CriterionScores;
}

const LABELS: Record<keyof CriterionScores, string> = {
  A: 'Knowing & Understanding',
  B: 'Inquiring & Designing',
  C: 'Processing & Evaluating',
  D: 'Reflecting on Impacts',
};

export function ScoreCard({ scores }: ScoreCardProps) {
  return (
    <section className="panel">
      <h2 className="mb-3 text-lg font-semibold text-detective-paper">IB MYP Scorecard</h2>
      <ul className="space-y-2">
        {(Object.keys(LABELS) as Array<keyof CriterionScores>).map((k) => (
          <li key={k}>
            <div className="flex items-center justify-between text-sm">
              <span className="text-detective-paper">
                <span className="font-semibold text-detective-amber">Crit {k}</span> — {LABELS[k]}
              </span>
              <span className="readout">{scores[k]} / 8</span>
            </div>
            <div className="mt-1 h-2 w-full rounded bg-detective-slate">
              <div
                className="h-2 rounded bg-detective-amber"
                style={{ width: `${(scores[k] / 8) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
