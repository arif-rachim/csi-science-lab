import type { Case, Criterion, PlayerProgress } from '../cases/types';

export interface ScoreInput {
  case: Case;
  evidenceCollected: string[];
  hypothesesSubmitted: string[];
  testsPerformed: string[];
  finalVerdict: string | null;
  reflections: Record<string, string>;
}

export type CriterionScores = Record<Criterion, number>;

const MAX_PER_CRITERION = 8;

export function scoreCase(input: ScoreInput): CriterionScores {
  return {
    A: scoreA(input),
    B: scoreB(input),
    C: scoreC(input),
    D: scoreD(input),
  };
}

function scoreA({ case: c, testsPerformed }: ScoreInput): number {
  const toolsUsed = new Set(testsPerformed.map((id) => id.split(':')[0]));
  const ratio = toolsUsed.size / Math.max(1, c.labTools.filter((t) => t.unlocked).length);
  return clamp(Math.round(ratio * MAX_PER_CRITERION));
}

function scoreB({ case: c, hypothesesSubmitted }: ScoreInput): number {
  if (hypothesesSubmitted.length === 0) return 0;
  const correct = hypothesesSubmitted.filter((id) =>
    c.hypothesisTemplates.find((h) => h.id === id && h.correct),
  ).length;
  const enough = hypothesesSubmitted.length >= 2 ? 4 : 2;
  return clamp(enough + correct * 2);
}

function scoreC({ case: c, evidenceCollected, testsPerformed }: ScoreInput): number {
  const evidenceRatio = evidenceCollected.length / Math.max(1, c.evidence.length);
  const testsBonus = Math.min(4, testsPerformed.length);
  return clamp(Math.round(evidenceRatio * 4) + testsBonus);
}

function scoreD({ case: c, finalVerdict, reflections }: ScoreInput): number {
  const verdictPoints = finalVerdict === c.correctVerdict ? 4 : 0;
  const reflectionPoints = c.reflectionQuestions.reduce((sum, q) => {
    const answer = reflections[q.id]?.trim() ?? '';
    if (!answer) return sum;
    return sum + (answer.length >= 30 ? 1 : 0);
  }, 0);
  return clamp(verdictPoints + reflectionPoints);
}

function clamp(n: number): number {
  return Math.max(0, Math.min(MAX_PER_CRITERION, n));
}

export function buildProgress(
  caseId: string,
  input: ScoreInput,
  scores: CriterionScores,
): PlayerProgress {
  return {
    caseId,
    hypothesesSubmitted: input.hypothesesSubmitted,
    evidenceCollected: input.evidenceCollected,
    testsPerformed: input.testsPerformed,
    finalVerdict: input.finalVerdict ?? '',
    scores,
    completedAt: new Date().toISOString(),
  };
}
