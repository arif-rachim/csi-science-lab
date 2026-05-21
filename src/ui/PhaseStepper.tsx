import type { CasePhase } from '../cases/types';

interface PhaseStepperProps {
  current: CasePhase;
}

const STEPS: Array<{ id: CasePhase; label: string }> = [
  { id: 'crime-scene', label: '1·SCENE' },
  { id: 'hypothesis', label: '2·HYPO' },
  { id: 'lab', label: '3·LAB' },
  { id: 'analysis', label: '4·DATA' },
  { id: 'verdict', label: '5·VERDICT' },
  { id: 'reflection', label: '6·REFLECT' },
];

export function PhaseStepper({ current }: PhaseStepperProps) {
  const currentIdx = STEPS.findIndex((s) => s.id === current);
  return (
    <ol className="flex flex-wrap gap-1 text-xs">
      {STEPS.map((step, i) => {
        const state =
          i < currentIdx ? 'done' : i === currentIdx ? 'active' : 'upcoming';
        const styles = {
          done: 'border-crt-dim text-crt-dim',
          active: 'border-crt-fg bg-crt-fg/15 text-crt-bright text-glow-strong',
          upcoming: 'border-crt-rule/50 text-crt-dim/60',
        }[state];
        return (
          <li
            key={step.id}
            className={`border px-2 py-0.5 uppercase tracking-widest ${styles}`}
            aria-current={state === 'active' ? 'step' : undefined}
          >
            {step.label}
          </li>
        );
      })}
    </ol>
  );
}
