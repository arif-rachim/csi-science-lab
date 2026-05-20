import type { AiGrade } from '../cases/types';

interface AiFeedbackPanelProps {
  grade: AiGrade | null;
  loading?: boolean;
  compact?: boolean;
}

export function AiFeedbackPanel({ grade, loading, compact }: AiFeedbackPanelProps) {
  if (loading) {
    return (
      <div className="mt-3 flex items-center gap-2 rounded-md border border-detective-amber/30 bg-detective-amber/5 p-3 text-sm">
        <Spinner />
        <span className="text-detective-paper/80">AI is reading your answer…</span>
      </div>
    );
  }

  if (!grade) return null;

  const tone =
    grade.score >= 2
      ? 'border-emerald-500/40 bg-emerald-500/5'
      : grade.score >= 1
        ? 'border-detective-amber/40 bg-detective-amber/5'
        : 'border-detective-clue/40 bg-detective-clue/5';

  return (
    <div className={`mt-3 rounded-md border p-3 text-sm animate-slide-in-up ${tone}`}>
      <header className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <ScoreBadge score={grade.score} />
          <span className="text-xs uppercase tracking-wider text-detective-amber">
            AI feedback {grade.provider === 'stub' && '· local'}
          </span>
        </div>
      </header>
      <p className="text-detective-paper">{grade.feedback}</p>
      {!compact && (grade.strengths.length > 0 || grade.improvements.length > 0) && (
        <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {grade.strengths.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-emerald-400/90">Strengths</p>
              <ul className="ml-4 list-disc text-xs text-detective-paper/80">
                {grade.strengths.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
          {grade.improvements.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase text-detective-amber/90">Next step</p>
              <ul className="ml-4 list-disc text-xs text-detective-paper/80">
                {grade.improvements.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 2
      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
      : score >= 1
        ? 'bg-detective-amber/20 text-detective-amber border-detective-amber/40'
        : 'bg-detective-clue/20 text-detective-clue border-detective-clue/40';
  return (
    <span className={`rounded border px-2 py-0.5 text-xs font-bold ${color}`}>{score} / 2</span>
  );
}

function Spinner() {
  return (
    <span
      aria-hidden
      className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-detective-amber border-t-transparent"
    />
  );
}
