import { useMemo, useState } from 'react';
import type { Case, PhReading, WaterReading } from '../cases/types';

interface DataAnalysisProps {
  activeCase: Case;
  readings: Record<string, PhReading>;
  waterReadings: Record<string, WaterReading>;
  onContinue: (confidence: number) => void;
}

interface PhRow {
  id: string;
  label: string;
  reading: PhReading;
}

interface WaterRow {
  id: string;
  label: string;
  reading: WaterReading;
}

export function DataAnalysis({
  activeCase,
  readings,
  waterReadings,
  onContinue,
}: DataAnalysisProps) {
  const [confidence, setConfidence] = useState(70);

  const phRows = useMemo<PhRow[]>(() => {
    return Object.entries(readings).map(([id, reading]) => ({
      id,
      label: activeCase.evidence.find((e) => e.id === id)?.name ?? id,
      reading,
    }));
  }, [activeCase, readings]);

  const waterRows = useMemo<WaterRow[]>(() => {
    return Object.entries(waterReadings).map(([id, reading]) => ({
      id,
      label: activeCase.evidence.find((e) => e.id === id)?.name ?? id,
      reading,
    }));
  }, [activeCase, waterReadings]);

  const phOutlier = useMemo(() => {
    if (phRows.length === 0) return null;
    return phRows.reduce((min, row) => (row.reading.ph < min.reading.ph ? row : min), phRows[0]);
  }, [phRows]);

  const waterOutlier = useMemo(() => {
    if (waterRows.length === 0) return null;
    return waterRows.reduce(
      (max, row) => (row.reading.microbeDensity > max.reading.microbeDensity ? row : max),
      waterRows[0],
    );
  }, [waterRows]);

  return (
    <section className="panel-titled space-y-4" data-title="Data Analysis">
      <p className="text-sm text-crt-fg/85">
        Plot your readings. Identify the outlier — that's likely your suspect.
      </p>

      {phRows.length > 0 && (
        <div className="overflow-hidden border border-crt-rule">
          <table className="w-full text-sm">
            <thead className="bg-crt-rule/30 text-left text-xs uppercase tracking-wider text-crt-amber">
              <tr>
                <th className="p-2">Sample</th>
                <th className="p-2">pH</th>
                <th className="p-2">Classification</th>
                <th className="p-2 w-1/2">pH Bar</th>
              </tr>
            </thead>
            <tbody>
              {phRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-crt-rule ${
                    phOutlier?.id === row.id ? 'bg-crt-danger/10' : ''
                  }`}
                >
                  <td className="p-2 text-crt-fg">{row.label}</td>
                  <td className="readout p-2">{row.reading.ph.toFixed(1)}</td>
                  <td className="p-2 text-crt-fg/80">
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
      )}

      {waterRows.length > 0 && (
        <div className="overflow-hidden border border-crt-rule">
          <table className="w-full text-sm">
            <thead className="bg-crt-rule/30 text-left text-xs uppercase tracking-wider text-crt-amber">
              <tr>
                <th className="p-2">Sample</th>
                <th className="p-2">pH</th>
                <th className="p-2">DO mg/L</th>
                <th className="p-2">NO₃ mg/L</th>
                <th className="p-2">Microbes/mL</th>
                <th className="p-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {waterRows.map((row) => (
                <tr
                  key={row.id}
                  className={`border-t border-crt-rule ${
                    waterOutlier?.id === row.id ? 'bg-crt-danger/10' : ''
                  }`}
                >
                  <td className="p-2 text-crt-fg">{row.label}</td>
                  <td className="readout p-2">{row.reading.ph.toFixed(1)}</td>
                  <td className={`p-2 ${row.reading.dissolvedO2 < 2 ? 'text-crt-danger' : ''}`}>
                    {row.reading.dissolvedO2.toFixed(1)}
                  </td>
                  <td className={`p-2 ${row.reading.nitrate > 40 ? 'text-crt-danger' : ''}`}>
                    {row.reading.nitrate.toFixed(0)}
                  </td>
                  <td className="p-2 readout">{formatScientific(row.reading.microbeDensity)}</td>
                  <td className="p-2 text-crt-fg/85 uppercase">{row.reading.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {phOutlier && phRows.length > 0 && (
        <div className="border border-crt-danger/40 bg-crt-danger/10 p-3 text-sm text-crt-fg">
          <p className="font-semibold text-crt-danger">Anomaly detected</p>
          <p className="mt-1">
            <span className="font-semibold">{phOutlier.label}</span> shows the most extreme pH (
            <span className="readout">{phOutlier.reading.ph.toFixed(1)}</span>) and is classified
            as <span className="font-semibold">{phOutlier.reading.classification.replace('-', ' ')}</span>.
          </p>
        </div>
      )}

      {waterOutlier && waterRows.length > 0 && (
        <div className="border border-crt-danger/40 bg-crt-danger/10 p-3 text-sm text-crt-fg">
          <p className="font-semibold text-crt-danger">Anomaly detected</p>
          <p className="mt-1">
            <span className="font-semibold">{waterOutlier.label}</span> shows the highest microbe
            density (<span className="readout">{formatScientific(waterOutlier.reading.microbeDensity)}</span>{' '}
            cells/mL) — orders of magnitude above the rest. That sample is the source, not a victim.
          </p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm text-crt-fg">
          How confident are you in your conclusion? <span className="readout">{confidence}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-crt-fg"
        />
        <p className="mt-1 text-xs text-crt-dim">
          Honest self-assessment scores higher than over-confidence with weak data.
        </p>
      </div>

      <footer className="flex justify-end border-t border-crt-rule pt-3">
        <button className="btn-primary" onClick={() => onContinue(confidence)}>
          [Enter] Continue to Verdict ▶
        </button>
      </footer>
    </section>
  );
}

function PhBar({ ph, color }: { ph: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (ph / 14) * 100));
  return (
    <div className="relative h-3 w-full border border-crt-rule bg-crt-bg">
      <div
        className="absolute left-0 top-0 h-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  );
}

function formatScientific(n: number): string {
  if (n < 1000) return n.toFixed(0);
  const exp = Math.floor(Math.log10(n));
  const mantissa = (n / Math.pow(10, exp)).toFixed(1);
  return `${mantissa}e${exp}`;
}
