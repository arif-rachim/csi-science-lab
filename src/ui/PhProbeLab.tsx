import { useMemo, useState } from 'react';
import type { Case, PhClassification, PhReading } from '../cases/types';

interface PhProbeLabProps {
  activeCase: Case;
  collectedIds: string[];
  initialReadings?: Record<string, PhReading>;
  onComplete: (readings: Record<string, PhReading>, testIds: string[]) => void;
}

const CONTROL_KEY = 'control-distilled-water';

const CONTROL_READING: PhReading = {
  ph: 7.0,
  hexColor: '#5ec56e',
  classification: 'neutral',
  notes: 'Distilled water — your neutral reference. Universal indicator stays green.',
};

const CLASSIFICATION_LABEL: Record<PhClassification, string> = {
  'strong-acid': 'Strong acid',
  'weak-acid': 'Weak acid',
  neutral: 'Neutral',
  'weak-base': 'Weak base',
  'strong-base': 'Strong base',
};

export function PhProbeLab({
  activeCase,
  collectedIds,
  initialReadings = {},
  onComplete,
}: PhProbeLabProps) {
  const testable = useMemo(
    () =>
      activeCase.evidence.filter(
        (e) => collectedIds.includes(e.id) && activeCase.phReadings[e.id],
      ),
    [activeCase, collectedIds],
  );

  const [readings, setReadings] = useState<Record<string, PhReading>>({
    [CONTROL_KEY]: CONTROL_READING,
    ...initialReadings,
  });

  const allTested = testable.every((e) => readings[e.id]);

  function test(id: string) {
    if (readings[id]) return;
    const reading = activeCase.phReadings[id];
    if (!reading) return;
    setReadings((r) => ({ ...r, [id]: reading }));
  }

  function finish() {
    const testIds = Object.keys(readings).map((k) => `ph_probe:${k}`);
    const { [CONTROL_KEY]: _control, ...evidenceOnly } = readings;
    void _control;
    onComplete(evidenceOnly, testIds);
  }

  return (
    <section className="panel">
      <header className="mb-3 flex items-start justify-between gap-2">
        <div>
          <h2 className="text-xl font-semibold text-detective-paper">pH Probe Lab</h2>
          <p className="text-sm text-detective-paper/70">
            Test each collected sample with universal indicator. Distilled water is your control.
          </p>
        </div>
        <PhChart />
      </header>

      <ul className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SampleRow
          name="Distilled water (control)"
          description="Provided by the lab. Reference for a neutral reading."
          reading={readings[CONTROL_KEY]}
          onTest={() => {}}
          locked
        />
        {testable.length === 0 && (
          <li className="rounded border border-dashed border-detective-slate p-3 text-sm text-detective-paper/60">
            Collect evidence in the crime scene first, then come back to the lab.
          </li>
        )}
        {testable.map((e) => (
          <SampleRow
            key={e.id}
            name={e.name}
            description={e.description}
            reading={readings[e.id]}
            onTest={() => test(e.id)}
          />
        ))}
      </ul>

      <footer className="mt-4 flex items-center justify-between">
        <p className="text-sm text-detective-paper/70">
          {Object.keys(readings).length - 1} of {testable.length} samples tested
        </p>
        <button className="btn-primary" disabled={!allTested} onClick={finish}>
          Send to Data Analysis
        </button>
      </footer>
    </section>
  );
}

function SampleRow({
  name,
  description,
  reading,
  onTest,
  locked,
}: {
  name: string;
  description: string;
  reading?: PhReading;
  onTest: () => void;
  locked?: boolean;
}) {
  return (
    <li className="rounded-md border border-detective-slate bg-detective-ink/40 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-semibold text-detective-paper">{name}</p>
          <p className="text-xs text-detective-paper/60">{description}</p>
        </div>
        {!reading && !locked && (
          <button className="btn-primary text-xs" onClick={onTest}>
            Test
          </button>
        )}
      </div>
      {reading && (
        <div className="mt-3 flex items-center gap-3">
          <div
            className="h-10 w-14 rounded border border-detective-paper/40"
            style={{ backgroundColor: reading.hexColor }}
            aria-label={`indicator color ${reading.hexColor}`}
          />
          <div className="text-sm">
            <p className="readout">pH ≈ {reading.ph.toFixed(1)}</p>
            <p className="text-detective-paper/70">
              {CLASSIFICATION_LABEL[reading.classification]}
            </p>
          </div>
        </div>
      )}
      {reading && <p className="mt-2 text-xs text-detective-paper/60">{reading.notes}</p>}
    </li>
  );
}

const PH_CHART_STOPS = [
  { ph: 1, color: '#c41e1e' },
  { ph: 3, color: '#e85a3a' },
  { ph: 5, color: '#f0b040' },
  { ph: 7, color: '#5ec56e' },
  { ph: 9, color: '#4a90c8' },
  { ph: 11, color: '#3d5dc4' },
  { ph: 13, color: '#7a3dc4' },
];

function PhChart() {
  return (
    <div className="hidden flex-col items-end gap-1 md:flex">
      <p className="text-xs uppercase tracking-wider text-detective-amber">pH chart</p>
      <div className="flex overflow-hidden rounded border border-detective-slate">
        {PH_CHART_STOPS.map((s) => (
          <div
            key={s.ph}
            className="flex h-6 w-6 items-center justify-center text-[10px] font-mono text-detective-ink"
            style={{ backgroundColor: s.color }}
          >
            {s.ph}
          </div>
        ))}
      </div>
    </div>
  );
}
