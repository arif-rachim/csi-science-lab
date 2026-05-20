import { useCallback, useState } from 'react';
import type { AiGrade, Case } from '../cases/types';
import { gradeAnswer } from '../lib/aiGrader';
import { AiFeedbackPanel } from './AiFeedbackPanel';

interface HypothesisBoardProps {
  activeCase: Case;
  minRequired?: number;
  onSubmit: (cards: HypothesisCard[]) => void;
}

export interface HypothesisCard {
  id: string;
  text: string;
  iv: string;
  dv: string;
  control: string;
  grade: AiGrade | null;
}

const EMPTY = (id: string): HypothesisCard => ({
  id,
  text: '',
  iv: '',
  dv: '',
  control: '',
  grade: null,
});

export function HypothesisBoard({
  activeCase,
  minRequired = 2,
  onSubmit,
}: HypothesisBoardProps) {
  const [cards, setCards] = useState<HypothesisCard[]>(() => [EMPTY('h1'), EMPTY('h2')]);
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [showHelp, setShowHelp] = useState(false);

  function update(id: string, patch: Partial<HypothesisCard>) {
    setCards((current) =>
      current.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    );
  }

  const handleGrade = useCallback(
    async (card: HypothesisCard) => {
      setPending((s) => new Set(s).add(card.id));
      const grade = await gradeAnswer({
        type: 'hypothesis',
        criterion: 'B',
        caseTitle: activeCase.title,
        caseStory: activeCase.story,
        answer: card.text,
        iv: card.iv,
        dv: card.dv,
        control: card.control,
      });
      update(card.id, { grade });
      setPending((s) => {
        const n = new Set(s);
        n.delete(card.id);
        return n;
      });
    },
    [activeCase],
  );

  const cardsComplete = cards.filter(
    (c) => c.text.trim() && c.iv.trim() && c.dv.trim() && c.control.trim(),
  );
  const canSubmit = cardsComplete.length >= minRequired;

  return (
    <section className="panel">
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-detective-paper">Hypothesis Board</h2>
          <p className="text-sm text-detective-paper/70">
            Write {minRequired} testable hypotheses for what caused the principal's symptoms.
            Get AI feedback before submitting if you want.
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
              <span className="font-semibold">Independent variable (IV):</span> what you change or
              test (e.g., the identity of the liquid).
            </li>
            <li>
              <span className="font-semibold">Dependent variable (DV):</span> what you measure
              (e.g., the pH reading).
            </li>
            <li>
              <span className="font-semibold">Control:</span> a known reference (e.g., distilled
              water, pH 7).
            </li>
          </ul>
        </div>
      )}

      <ol className="space-y-4">
        {cards.map((card, i) => (
          <li key={card.id}>
            <CardEditor
              index={i}
              card={card}
              loading={pending.has(card.id)}
              onChange={(patch) => update(card.id, patch)}
              onGrade={() => handleGrade(card)}
            />
          </li>
        ))}
      </ol>

      <footer className="mt-5 flex items-center justify-between">
        <p className="text-sm text-detective-paper/70">
          Filled: <span className="readout">{cardsComplete.length}</span> / {minRequired}
        </p>
        <button
          className="btn-primary"
          disabled={!canSubmit}
          onClick={() => onSubmit(cards)}
        >
          Submit hypotheses
        </button>
      </footer>
    </section>
  );
}

interface CardEditorProps {
  index: number;
  card: HypothesisCard;
  loading: boolean;
  onChange: (patch: Partial<HypothesisCard>) => void;
  onGrade: () => void;
}

function CardEditor({ index, card, loading, onChange, onGrade }: CardEditorProps) {
  const canGrade =
    card.text.trim().length >= 10 &&
    card.iv.trim() &&
    card.dv.trim() &&
    card.control.trim();

  return (
    <div className="rounded-md border border-detective-slate bg-detective-ink/40 p-3">
      <p className="mb-2 text-sm font-semibold text-detective-amber">Hypothesis {index + 1}</p>
      <textarea
        rows={3}
        className="w-full rounded-md bg-detective-ink p-2 text-sm"
        placeholder="If [variable changes], then [you observe], because [scientific reason]…"
        value={card.text}
        onChange={(e) => onChange({ text: e.target.value, grade: null })}
      />
      <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-3">
        <LabeledInput
          label="IV"
          placeholder="What you change"
          value={card.iv}
          onChange={(v) => onChange({ iv: v, grade: null })}
        />
        <LabeledInput
          label="DV"
          placeholder="What you measure"
          value={card.dv}
          onChange={(v) => onChange({ dv: v, grade: null })}
        />
        <LabeledInput
          label="Control"
          placeholder="Known reference"
          value={card.control}
          onChange={(v) => onChange({ control: v, grade: null })}
        />
      </div>
      <div className="mt-3 flex items-center justify-end gap-2">
        <button
          className="btn-ghost text-xs"
          disabled={!canGrade || loading}
          onClick={onGrade}
        >
          {card.grade ? 'Re-grade' : 'Get AI feedback'}
        </button>
      </div>
      <AiFeedbackPanel grade={card.grade} loading={loading} />
    </div>
  );
}

function LabeledInput({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-xs">
      <span className="mb-1 block font-semibold uppercase tracking-wider text-detective-amber">
        {label}
      </span>
      <input
        type="text"
        className="w-full rounded-md bg-detective-ink p-2 text-sm"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
