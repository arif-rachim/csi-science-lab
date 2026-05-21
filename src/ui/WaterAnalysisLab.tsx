import { useMemo, useState } from 'react';
import type { Case, WaterReading } from '../cases/types';

interface WaterAnalysisLabProps {
  activeCase: Case;
  collectedIds: string[];
  initialReadings?: Record<string, WaterReading>;
  onComplete: (readings: Record<string, WaterReading>, testIds: string[]) => void;
}

const TEST_DURATION_MS = 1100;

const STATUS_STYLE: Record<WaterReading['status'], string> = {
  healthy: 'border-crt-ok text-crt-ok',
  caution: 'border-crt-amber text-crt-amber',
  critical: 'border-crt-danger text-crt-danger',
};

const STATUS_LABEL: Record<WaterReading['status'], string> = {
  healthy: '[●] HEALTHY',
  caution: '[!] CAUTION',
  critical: '[✗] CRITICAL',
};

export function WaterAnalysisLab({
  activeCase,
  collectedIds,
  initialReadings = {},
  onComplete,
}: WaterAnalysisLabProps) {
  const testable = useMemo(
    () =>
      activeCase.evidence.filter(
        (e) =>
          collectedIds.includes(e.id) &&
          activeCase.waterReadings?.[e.id] !== undefined,
      ),
    [activeCase, collectedIds],
  );

  const [readings, setReadings] = useState<Record<string, WaterReading>>(initialReadings);
  const [testing, setTesting] = useState<Set<string>>(new Set());

  const allTested = testable.every((e) => readings[e.id]);

  function test(id: string) {
    if (readings[id] || testing.has(id)) return;
    const reading = activeCase.waterReadings?.[id];
    if (!reading) return;
    setTesting((s) => new Set(s).add(id));
    window.setTimeout(() => {
      setReadings((r) => ({ ...r, [id]: reading }));
      setTesting((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }, TEST_DURATION_MS);
  }

  function finish() {
    const testIds = Object.keys(readings).map((k) => `water:${k}`);
    onComplete(readings, testIds);
  }

  return (
    <section className="panel-titled space-y-3" data-title="Water Analysis Panel">
      <p className="text-crt-fg/85">
        Each test gives you four readings on one sample: pH, dissolved O₂,
        nitrate, microbe density. Healthy reference: pH 6.5–8.5 · DO ≥ 5 · NO₃ &lt; 10.
      </p>

      <ul className="space-y-2">
        {testable.length === 0 && (
          <li className="border border-dashed border-crt-rule p-3 text-sm text-crt-dim">
            Collect water samples first.
          </li>
        )}
        {testable.map((e) => (
          <SampleRow
            key={e.id}
            name={e.name}
            description={e.description}
            reading={readings[e.id]}
            testing={testing.has(e.id)}
            onTest={() => test(e.id)}
          />
        ))}
      </ul>

      <footer className="flex items-center justify-between border-t border-crt-rule pt-3">
        <p className="text-sm text-crt-dim">
          Tested: <span className="readout">{Object.keys(readings).length}</span> /{' '}
          {testable.length}
        </p>
        <button className="btn-primary" disabled={!allTested} onClick={finish}>
          [Enter] Send to Data Analysis →
        </button>
      </footer>
    </section>
  );
}

function SampleRow({
  name,
  description,
  reading,
  testing,
  onTest,
}: {
  name: string;
  description: string;
  reading?: WaterReading;
  testing: boolean;
  onTest: () => void;
}) {
  return (
    <li className="relative overflow-hidden border border-crt-rule bg-crt-bg/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-crt-bright">{name}</p>
          <p className="text-xs text-crt-dim">{description}</p>
        </div>
        {!reading && !testing && (
          <button className="btn-primary text-xs" onClick={onTest}>
            Run panel
          </button>
        )}
        {testing && (
          <span className="text-xs text-crt-amber">
            Running… <span className="cursor" />
          </span>
        )}
      </div>
      {reading && !testing && (
        <div className="mt-3 animate-reveal-pop">
          <div className={`inline-block border px-2 py-0.5 text-xs ${STATUS_STYLE[reading.status]}`}>
            {STATUS_LABEL[reading.status]}
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            <Stat label="pH" value={reading.ph.toFixed(1)} healthy={reading.ph >= 6.5 && reading.ph <= 8.5} />
            <Stat
              label="DO (mg/L)"
              value={reading.dissolvedO2.toFixed(1)}
              healthy={reading.dissolvedO2 >= 5}
            />
            <Stat
              label="NO₃ (mg/L)"
              value={reading.nitrate.toFixed(0)}
              healthy={reading.nitrate < 10}
            />
            <Stat
              label="Microbes/mL"
              value={formatScientific(reading.microbeDensity)}
              healthy={reading.microbeDensity < 1e5}
            />
          </div>
          <p className="mt-2 text-xs text-crt-fg/85 animate-slide-in-up">{reading.notes}</p>
        </div>
      )}
    </li>
  );
}

function Stat({ label, value, healthy }: { label: string; value: string; healthy: boolean }) {
  return (
    <div className="border border-crt-rule p-2">
      <p className="text-xs uppercase tracking-wider text-crt-dim">{label}</p>
      <p className={`${healthy ? 'text-crt-ok' : 'text-crt-danger'}`}>{value}</p>
    </div>
  );
}

function formatScientific(n: number): string {
  if (n < 1000) return n.toFixed(0);
  const exp = Math.floor(Math.log10(n));
  const mantissa = (n / Math.pow(10, exp)).toFixed(1);
  return `${mantissa}e${exp}`;
}
