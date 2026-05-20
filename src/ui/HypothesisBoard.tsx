import { useMemo, useState } from 'react';
import type { Case, HypothesisTemplate } from '../cases/types';

interface HypothesisBoardProps {
  activeCase: Case;
  initialSelected?: string[];
  minRequired?: number;
  onSubmit: (selectedIds: string[]) => void;
}

interface DraftHypothesis {
  ifPart: string;
  thenPart: string;
  becausePart: string;
  independentVariable: string;
  dependentVariable: string;
  control: string;
}

const EMPTY_DRAFT: DraftHypothesis = {
  ifPart: '',
  thenPart: '',
  becausePart: '',
  independentVariable: '',
  dependentVariable: '',
  control: '',
};

export function HypothesisBoard({
  activeCase,
  initialSelected = [],
  minRequired = 2,
  onSubmit,
}: HypothesisBoardProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelected);
  const [draft, setDraft] = useState<DraftHypothesis>(EMPTY_DRAFT);
  const [showHelp, setShowHelp] = useState(false);

  const templates = activeCase.hypothesisTemplates;

  const canSubmit = selectedIds.length >= minRequired;

  const draftIsComplete = useMemo(
    () =>
      Boolean(
        draft.ifPart.trim() &&
          draft.thenPart.trim() &&
          draft.becausePart.trim() &&
          draft.independentVariable.trim() &&
          draft.dependentVariable.trim() &&
          draft.control.trim(),
      ),
    [draft],
  );

  function toggle(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((x) => x !== id) : [...current, id],
    );
  }

  function handleSubmit() {
    if (!canSubmit) return;
    onSubmit(selectedIds);
  }

  return (
    <section className="panel">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-detective-paper">Hypothesis Board</h2>
          <p className="text-sm text-detective-paper/70">
            Pick at least {minRequired} testable hypotheses. Identify your variables before heading
            to the lab.
          </p>
        </div>
        <button className="btn-ghost text-xs" onClick={() => setShowHelp((v) => !v)}>
          {showHelp ? 'Hide tip' : 'How to write one'}
        </button>
      </header>

      {showHelp && (
        <div className="mb-4 rounded-md bg-detective-slate/60 p-3 text-sm text-detective-paper/90">
          <p className="font-semibold text-detective-amber">If… then… because…</p>
          <ul className="ml-4 list-disc space-y-1">
            <li>
              <span className="font-semibold">Independent variable:</span> what you change.
            </li>
            <li>
              <span className="font-semibold">Dependent variable:</span> what you measure.
            </li>
            <li>
              <span className="font-semibold">Control:</span> what you keep constant or compare
              against.
            </li>
          </ul>
        </div>
      )}

      <ul className="space-y-2">
        {templates.map((t) => (
          <HypothesisRow
            key={t.id}
            template={t}
            selected={selectedIds.includes(t.id)}
            onToggle={() => toggle(t.id)}
          />
        ))}
      </ul>

      <details className="mt-4 rounded-md border border-detective-slate p-3">
        <summary className="cursor-pointer text-sm font-semibold text-detective-amber">
          Write your own
        </summary>
        <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <input
            className="rounded-md bg-detective-ink p-2 text-sm"
            placeholder="If… (independent variable)"
            value={draft.ifPart}
            onChange={(e) => setDraft({ ...draft, ifPart: e.target.value })}
          />
          <input
            className="rounded-md bg-detective-ink p-2 text-sm"
            placeholder="then… (dependent variable)"
            value={draft.thenPart}
            onChange={(e) => setDraft({ ...draft, thenPart: e.target.value })}
          />
          <input
            className="col-span-full rounded-md bg-detective-ink p-2 text-sm"
            placeholder="because… (reasoning)"
            value={draft.becausePart}
            onChange={(e) => setDraft({ ...draft, becausePart: e.target.value })}
          />
          <input
            className="rounded-md bg-detective-ink p-2 text-sm"
            placeholder="Independent variable"
            value={draft.independentVariable}
            onChange={(e) => setDraft({ ...draft, independentVariable: e.target.value })}
          />
          <input
            className="rounded-md bg-detective-ink p-2 text-sm"
            placeholder="Dependent variable"
            value={draft.dependentVariable}
            onChange={(e) => setDraft({ ...draft, dependentVariable: e.target.value })}
          />
          <input
            className="col-span-full rounded-md bg-detective-ink p-2 text-sm"
            placeholder="Control"
            value={draft.control}
            onChange={(e) => setDraft({ ...draft, control: e.target.value })}
          />
          <p className="col-span-full text-xs text-detective-paper/60">
            {draftIsComplete
              ? 'Draft looks well-formed. (Custom hypotheses are not yet scored — pick the closest template above.)'
              : 'Fill all six fields to practice writing a complete hypothesis.'}
          </p>
        </div>
      </details>

      <footer className="mt-4 flex items-center justify-between">
        <p className="text-sm text-detective-paper/70">
          Selected: <span className="readout">{selectedIds.length}</span> / minimum {minRequired}
        </p>
        <button className="btn-primary" disabled={!canSubmit} onClick={handleSubmit}>
          Submit hypotheses
        </button>
      </footer>
    </section>
  );
}

function HypothesisRow({
  template,
  selected,
  onToggle,
}: {
  template: HypothesisTemplate;
  selected: boolean;
  onToggle: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={selected}
        className={`w-full rounded-md border p-3 text-left transition ${
          selected
            ? 'border-detective-amber bg-detective-amber/10'
            : 'border-detective-slate hover:border-detective-amber/60'
        }`}
      >
        <p className="text-sm text-detective-paper">{template.text}</p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-detective-paper/70">
          <Tag label="IV" value={template.independentVariable} />
          <Tag label="DV" value={template.dependentVariable} />
          <Tag label="Control" value={template.control} />
        </div>
      </button>
    </li>
  );
}

function Tag({ label, value }: { label: string; value: string }) {
  return (
    <span className="rounded bg-detective-slate/70 px-2 py-1">
      <span className="font-semibold text-detective-amber">{label}:</span> {value}
    </span>
  );
}
