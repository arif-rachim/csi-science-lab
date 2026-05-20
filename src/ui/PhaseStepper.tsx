import type { CasePhase } from '../store/gameStore';

interface PhaseStepperProps {
  current: CasePhase;
}

const STEPS: Array<{ id: CasePhase; label: string }> = [
  { id: 'crime-scene', label: '1. Scene' },
  { id: 'hypothesis', label: '2. Hypothesis' },
  { id: 'lab', label: '3. Lab' },
  { id: 'analysis', label: '4. Analysis' },
  { id: 'verdict', label: '5. Verdict' },
  { id: 'reflection', label: '6. Reflect' },
];

export function PhaseStepper({ current }: PhaseStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex flex-wrap gap-1 text-xs">
      {STEPS.map((step, i) => {
        const state =
          i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'upcoming';
        const styles = {
          done: 'border-detective-amber/40 bg-detective-amber/10 text-detective-amber',
          active: 'border-detective-amber bg-detective-amber text-detective-ink font-semibold',
          upcoming: 'border-detective-slate text-detective-paper/50',
        }[state];
        return (
          <li
            key={step.id}
            className={`rounded-full border px-3 py-1 ${styles}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
