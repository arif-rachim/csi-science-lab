import { useMemo, useState } from 'react';
import type { Case, PhReading } from '../cases/types';

interface DataAnalysisProps {
  activeCase: Case;
  readings: Record<string, PhReading>;
  onContinue: (confidence: number) => void;
}

interface Row {
  id: string;
  label: string;
  reading: PhReading;
}

export function DataAnalysis({ activeCase, readings, onContinue }: DataAnalysisProps) {
  const [confidence, setConfidence] = useState(70);

  const rows = useMemo<Row[]>(() => {
    return Object.entries(readings).map(([id, reading]) => {
      const evidence = activeCase.evidence.find((e) => e.id === id);
      return {
        id,
        label: evidence?.name ?? id,
        reading,
      };
    });
  }, [activeCase, readings]);

  const outlier = useMemo(() => {
    if (rows.length === 0) return null;
    return rows.reduce((min, row) => (row.reading.ph < min.reading.ph ? row : min), rows[0]);
  }, [rows]);

  return (
    <section className="panel">
      <h2 className="mb-2 text-xl font-semibold text-detective-paper">Data Analysis</h2>
      <p className="mb-4 text-sm text-detective-paper/70">
        Plot your readings. Identify the outlier — that's likely your suspect.
      </p>

      <div className="overflow-hidden rounded-md border border-detective-slate">
        <table className="w-full text-sm">
          <thead className="bg-detective-slate/60 text-left text-xs uppercase tracking-wider text-detective-amber">
            <tr>
              <th className="p-2">Sample</th>
              <th className="p-2">pH</th>
              <th className="p-2">Classification</th>
              <th className="p-2 w-1/2">pH Bar</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr
                key={row.id}
                className={`border-t border-detective-slate ${
                  outlier?.id === row.id ? 'bg-detective-clue/10' : ''
                }`}
              >
                <td className="p-2 text-detective-paper">{row.label}</td>
                <td className="readout p-2">{row.reading.ph.toFixed(1)}</td>
                <td className="p-2 text-detective-paper/80">
                  {row.reading.classification.replace('-', ' ')}
                </td>
                <td className="p-2">
                  <PhBar ph={row.reading.ph} color={row.reading.hexColor} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {outlier && (
        <div className="mt-4 rounded-md border border-detective-clue/40 bg-detective-clue/10 p-3 text-sm text-detective-paper">
          <p className="font-semibold text-detective-clue">Anomaly detected</p>
          <p className="mt-1">
            <span className="font-semibold">{outlier.label}</span> shows the most extreme pH (
            <span className="readout">{outlier.reading.ph.toFixed(1)}</span>) and is classified
            as <span className="font-semibold">{outlier.reading.classification.replace('-', ' ')}</span>.
            Compare this to the principal's symptoms before deciding.
          </p>
        </div>
      )}

      <div className="mt-5">
        <label className="mb-1 block text-sm text-detective-paper">
          How confident are you in your conclusion? <span className="readout">{confidence}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-detective-amber"
        />
        <p className="mt-1 text-xs text-detective-paper/60">
          Honest self-assessment scores higher than over-confidence with weak data.
        </p>
      </div>

      <footer className="mt-5 flex justify-end">
        <button className="btn-primary" onClick={() => onContinue(confidence)}>
          Continue to Verdict
        </button>
      </footer>
    </section>
  );
}

function PhBar({ ph, color }: { ph: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (ph / 14) * 100));
  return (
    <div className="relative h-3 w-full rounded bg-detective-slate">
      <div
        className="absolute left-0 top-0 h-3 rounded"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}
