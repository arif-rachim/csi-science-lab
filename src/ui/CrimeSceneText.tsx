import { useEffect, useState } from 'react';
import type { Case, Evidence } from '../cases/types';
import { Typewriter } from './Typewriter';

interface CrimeSceneTextProps {
  activeCase: Case;
  collectedIds: string[];
  onCollect: (id: string) => void;
}

export function CrimeSceneText({ activeCase, collectedIds, onCollect }: CrimeSceneTextProps) {
  const [briefingDone, setBriefingDone] = useState(false);
  const [selected, setSelected] = useState<Evidence | null>(null);

  useEffect(() => {
    if (selected && !collectedIds.includes(selected.id)) {
      onCollect(selected.id);
    }
  }, [selected, collectedIds, onCollect]);

  return (
    <section className="panel-titled space-y-4" data-title="The Office · 03:47 JKT">
      <Typewriter text={activeCase.briefing} speed={8} onDone={() => setBriefingDone(true)} />

      {briefingDone && (
        <div className="animate-slide-in-up space-y-3">
          <p className="ascii-rule">
            ────────────────────────────────────────────────────
          </p>
          <p className="text-crt-bright">Items on the desk:</p>
          <ul className="space-y-1">
            {activeCase.evidence.map((e, i) => {
              const isCollected = collectedIds.includes(e.id);
              const isSelected = selected?.id === e.id;
              return (
                <li key={e.id}>
                  <button
                    onClick={() => setSelected(e)}
                    className={`flex w-full items-center gap-2 px-1 py-0.5 text-left transition ${
                      isSelected
                        ? 'text-crt-bright text-glow-strong'
                        : isCollected
                          ? 'text-crt-dim line-through decoration-crt-dim/60'
                          : 'text-crt-fg hover:bg-crt-fg/10'
                    }`}
                  >
                    <span className="text-crt-dim">[{i + 1}]</span>
                    <span>{isCollected ? '✓' : '○'}</span>
                    <span>{e.name}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {selected && (
            <div key={selected.id} className="border-l-2 border-crt-fg pl-3 animate-slide-in-up">
              <p className="mb-1 text-crt-dim uppercase tracking-widest text-xs">
                &gt; Examining
              </p>
              <p className="mb-1 text-crt-bright">{selected.name}</p>
              <Typewriter text={selected.description} speed={6} />
              {collectedIds.includes(selected.id) && (
                <p className="mt-2 text-crt-ok">{'>'} Logged to evidence tray.</p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
