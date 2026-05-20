import type { Criterion } from '../cases/types';

export type GradeType = 'hypothesis' | 'verdict' | 'reflection';

export interface GradeRequest {
  type: GradeType;
  criterion: Criterion;
  caseTitle: string;
  caseStory: string;
  answer: string;
  question?: string;
  iv?: string;
  dv?: string;
  control?: string;
  chosenSuspectName?: string;
  correctSuspectName?: string;
  isVerdictCorrect?: boolean;
  readingsSummary?: string;
}

export interface GradeResponse {
  score: 0 | 1 | 2;
  feedback: string;
  strengths: string[];
  improvements: string[];
  provider: 'gemini' | 'stub';
}

const ENDPOINT = '/api/grade';

export async function gradeAnswer(req: GradeRequest): Promise<GradeResponse> {
  try {
    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req),
    });
    if (!res.ok) throw new Error(`Grading endpoint returned ${res.status}`);
    return (await res.json()) as GradeResponse;
  } catch {
    return localStubGrade(req);
  }
}

function localStubGrade(req: GradeRequest): GradeResponse {
  const text = (req.answer ?? '').trim();
  const len = text.length;
  const lower = text.toLowerCase();

  let score: 0 | 1 | 2 = 0;
  if (len > 30) score = 1;
  if (len > 120) score = 2;

  const hasIfThen = lower.includes('if') && lower.includes('then');
  const hasBecause = lower.includes('because');
  const hasPh = lower.includes('ph') || lower.includes('acid') || lower.includes('base');
  const hasControl = lower.includes('control') || lower.includes('distilled');

  if (req.type === 'hypothesis' && !(hasIfThen && hasBecause) && score === 2) score = 1;
  if (req.type === 'verdict' && !hasPh && score === 2) score = 1;
  if (req.type === 'verdict' && !hasControl && score === 2) score = 1;

  const feedback =
    score === 2
      ? 'Strong response — well-structured and scientifically grounded.'
      : score === 1
        ? 'Good start. Add more specifics from your evidence to strengthen it.'
        : 'Try writing a more complete answer that uses the scientific evidence you collected.';

  const strengths: string[] = [];
  if (len > 60) strengths.push('Clear and developed writing.');
  if (hasPh) strengths.push('References the chemistry concept.');
  if (hasControl) strengths.push('Mentions the control sample.');

  const improvements: string[] = [];
  if (req.type === 'hypothesis' && !hasIfThen) improvements.push('Use the "If… then…" structure.');
  if (req.type === 'hypothesis' && !hasBecause) improvements.push('Add a "because…" with your reasoning.');
  if (req.type === 'verdict' && !hasPh) improvements.push('Quote the pH reading you measured.');
  if (req.type === 'verdict' && !hasControl) improvements.push('Compare to the distilled-water control.');
  if (improvements.length === 0 && score < 2) improvements.push('Add one specific detail from the lab readings.');

  return { score, feedback, strengths, improvements, provider: 'stub' };
}
