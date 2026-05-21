import { useMemo, useState } from 'react';
import type { Case, MicroscopeReading } from '../cases/types';
import { Typewriter } from './Typewriter';

interface MicroscopeLabProps {
  activeCase: Case;
  collectedIds: string[];
  initialReadings?: Record<string, MicroscopeReading>;
  onComplete: (readings: Record<string, MicroscopeReading>, testIds: string[]) => void;
}

const CLASSIFICATION_LABEL = {
  safe: '[●] SAFE',
  caution: '[!] CAUTION',
  dangerous: '[✗] DANGEROUS',
} as const;

const CLASSIFICATION_COLOR = {
  safe: 'text-crt-ok',
  caution: 'text-crt-amber',
  dangerous: 'text-crt-danger',
} as const;

export function MicroscopeLab({
  activeCase,
  collectedIds,
  initialReadings = {},
  onComplete,
}: MicroscopeLabProps) {
  const slides = useMemo(
    () =>
      activeCase.evidence.filter(
        (e) =>
          collectedIds.includes(e.id) &&
          activeCase.microscopeReadings?.[e.id] !== undefined,
      ),
    [activeCase, collectedIds],
  );

  const [readings, setReadings] = useState<Record<string, MicroscopeReading>>(initialReadings);
  const [selected, setSelected] = useState<string | null>(null);
  const [examining, setExamining] = useState<Set<string>>(new Set());

  const allExamined = slides.every((s) => readings[s.id]);

  function examine(id: string) {
    if (readings[id] || examining.has(id)) return;
    const reading = activeCase.microscopeReadings?.[id];
    if (!reading) return;
    setSelected(id);
    setExamining((s) => new Set(s).add(id));
    window.setTimeout(() => {
      setReadings((r) => ({ ...r, [id]: reading }));
      setExamining((s) => {
        const next = new Set(s);
        next.delete(id);
        return next;
      });
    }, 1100);
  }

  function finish() {
    const testIds = Object.keys(readings).map((k) => `microscope:${k}`);
    onComplete(readings, testIds);
  }

  const currentReading = selected ? readings[selected] : undefined;
  const currentSlide = selected ? slides.find((s) => s.id === selected) : undefined;
  const isExaminingCurrent = selected ? examining.has(selected) : false;

  return (
    <section className="panel-titled space-y-3" data-title="Microscope · 400×">
      <p className="text-crt-fg/85">
        Pak Yusuf's prepared slides, racked by source location. Examine every
        slide — what is living in the water?
      </p>

      <div className="grid gap-3 md:grid-cols-2">
        <ul className="space-y-1">
          {slides.length === 0 && (
            <li className="border border-dashed border-crt-rule p-3 text-sm text-crt-dim">
              Collect samples in the crime scene first, then come back to the
              microscope.
            </li>
          )}
          {slides.map((s, i) => {
            const done = Boolean(readings[s.id]);
            const isSelected = selected === s.id;
            return (
              <li key={s.id}>
                <button
                  className={`flex w-full items-center gap-2 px-1 py-0.5 text-left ${
                    isSelected ? 'text-crt-bright text-glow-strong' : done ? 'text-crt-dim' : 'text-crt-fg hover:bg-crt-fg/10'
                  }`}
                  onClick={() => examine(s.id)}
                >
                  <span className="text-crt-dim">[{i + 1}]</span>
                  <span>{done ? '✓' : '○'}</span>
                  <span>{s.name}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="border border-crt-rule bg-crt-bg/60 p-3">
          {!selected && (
            <p className="text-sm text-crt-dim">
              &gt; Select a slide from the rack to examine.
            </p>
          )}
          {selected && isExaminingCurrent && (
            <p className="text-sm text-crt-amber">
              &gt; Focusing… adjusting magnification… <span className="cursor" />
            </p>
          )}
          {selected && !isExaminingCurrent && currentReading && currentSlide && (
            <div className="animate-slide-in-up">
              <p className="text-xs uppercase tracking-widest text-crt-dim">
                Slide · {currentSlide.name}
              </p>
              <p className={`mt-1 font-semibold ${CLASSIFICATION_COLOR[currentReading.classification]}`}>
                {CLASSIFICATION_LABEL[currentReading.classification]} · {currentReading.organism}
              </p>
              <pre
                key={currentReading.organism}
                className="my-2 whitespace-pre font-mono text-xs text-crt-fg"
              >
                {currentReading.asciiArt}
              </pre>
              <Typewriter
                key={currentSlide.id}
                text={currentReading.notes}
                speed={14}
                className="text-sm text-crt-fg/85"
                showCursor={false}
              />
            </div>
          )}
        </div>
      </div>

      <footer className="flex items-center justify-between border-t border-crt-rule pt-3">
        <p className="text-sm text-crt-dim">
          Examined: <span className="readout">{Object.keys(readings).length}</span> /{' '}
          {slides.length}
        </p>
        <button className="btn-primary" disabled={!allExamined} onClick={finish}>
          [Enter] Done with microscope →
        </button>
      </footer>
    </section>
  );
}
