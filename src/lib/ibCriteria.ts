import type { AiGrade, Case, Criterion, PlayerProgress } from '../cases/types';

export interface ScoreInput {
  case: Case;
  evidenceCollected: string[];
  hypothesesSubmitted: string[];
  hypothesisGrades?: AiGrade[];
  testsPerformed: string[];
  finalVerdict: string | null;
  verdictGrade?: AiGrade | null;
  reflections: Record<string, string>;
  reflectionGrades?: Record<string, AiGrade>;
  confidence?: number;
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

function reflectionGradeFor(
  input: ScoreInput,
  criterion: Criterion,
): AiGrade | undefined {
  if (!input.reflectionGrades) return undefined;
  const q = input.case.reflectionQuestions.find((r) => r.criterion === criterion);
  return q ? input.reflectionGrades[q.id] : undefined;
}

function scoreA(input: ScoreInput): number {
  const verdictCorrect = input.finalVerdict === input.case.correctVerdict ? 2 : 0;
  const verdictAi = (input.verdictGrade?.score ?? 0) * 2;
  const reflA = reflectionGradeFor(input, 'A')?.score ?? 0;
  return clamp(verdictCorrect + verdictAi + reflA);
}

function scoreB(input: ScoreInput): number {
  const submitted = input.hypothesesSubmitted.length;
  const minOne = submitted >= 1 ? 1 : 0;
  const minTwo = submitted >= 2 ? 1 : 0;
  const grades = input.hypothesisGrades ?? [];
  const avgGrade =
    grades.length > 0 ? grades.reduce((s, g) => s + g.score, 0) / grades.length : 0;
  const hypAi = Math.round(avgGrade * 2);
  const reflB = reflectionGradeFor(input, 'B')?.score ?? 0;
  return clamp(minOne + minTwo + hypAi + reflB);
}

function scoreC(input: ScoreInput): number {
  const testableEvidence = input.case.evidence.filter((e) => e.relevantTools.length > 0);
  const testIdsByEvidence = new Set(
    input.testsPerformed
      .map((id) => id.split(':')[1])
      .filter(Boolean),
  );
  const allSamplesTested = testableEvidence.every((e) => testIdsByEvidence.has(e.id));
  const controlTested = testIdsByEvidence.has('control-distilled-water');
  const samplesAndControl = (allSamplesTested ? 1 : 0) + (controlTested ? 1 : 0);

  const confidence = input.confidence ?? 70;
  const verdictCorrect = input.finalVerdict === input.case.correctVerdict;
  const calibrated =
    (verdictCorrect && confidence >= 60 && confidence <= 95) ||
    (!verdictCorrect && confidence <= 60)
      ? 2
      : 1;

  const reflC = (reflectionGradeFor(input, 'C')?.score ?? 0) * 2;
  return clamp(samplesAndControl + calibrated + reflC);
}

function scoreD(input: ScoreInput): number {
  const answered = input.case.reflectionQuestions.filter((q) => {
    return (input.reflections[q.id]?.trim().length ?? 0) > 0;
  }).length;
  const baseFromAnswers = Math.min(2, answered);
  const reflD = (reflectionGradeFor(input, 'D')?.score ?? 0) * 3;
  return clamp(baseFromAnswers + reflD);
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
