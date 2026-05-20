import type { Evidence } from '../cases/types';

interface EvidenceTrayProps {
  evidence: Evidence[];
  collectedIds: string[];
}

export function EvidenceTray({ evidence, collectedIds }: EvidenceTrayProps) {
  return (
    <section className="panel">
      <h2 className="mb-3 text-lg font-semibold text-detective-paper">Evidence Tray</h2>
      <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
        {evidence.map((e) => {
          const collected = collectedIds.includes(e.id);
          return (
            <li
              key={e.id}
              className={`rounded border p-2 text-xs ${
                collected
                  ? 'border-detective-amber bg-detective-amber/10 text-detective-paper'
                  : 'border-dashed border-detective-slate text-detective-paper/50'
              }`}
            >
              <p className="font-semibold">{collected ? e.name : '???'}</p>
              {collected && <p className="mt-1 text-detective-paper/70">{e.description}</p>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
