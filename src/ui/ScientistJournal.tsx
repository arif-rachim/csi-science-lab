import type { Case } from '../cases/types';

interface ScientistJournalProps {
  activeCase: Case;
  observations: string[];
}

export function ScientistJournal({ activeCase, observations }: ScientistJournalProps) {
  return (
    <section className="panel">
      <h2 className="mb-2 text-lg font-semibold text-detective-paper">Scientist's Journal</h2>
      <p className="mb-3 text-xs text-detective-paper/60">{activeCase.title}</p>
      {observations.length === 0 ? (
        <p className="text-sm text-detective-paper/60">
          Observations will appear here as you collect evidence.
        </p>
      ) : (
        <ul className="space-y-2 text-sm text-detective-paper/90">
          {observations.map((line, i) => (
            <li key={i} className="rounded bg-detective-slate/50 p-2">
              {line}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
