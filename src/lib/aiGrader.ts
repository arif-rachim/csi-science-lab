import { getApiKey } from './aiKey';
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

const GEMINI_MODEL = 'gemini-flash-latest';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const CRITERION_DESCRIPTIONS: Record<Criterion, string> = {
  A: 'Knowing & Understanding — uses accurate scientific concepts and terminology.',
  B: 'Inquiring & Designing — forms a testable hypothesis with clear IV, DV, and control.',
  C: 'Processing & Evaluating — interprets data, identifies anomalies, calibrates confidence.',
  D: 'Reflecting on Impacts — connects science to ethical, real-world, or environmental impact.',
};

const SYSTEM_INSTRUCTION = `You are an IB MYP Year 4 Sciences teacher giving formative feedback to a 14-15 year old student playing a forensic-science learning game called "CSI: Science Lab". The student investigates a different mystery each case using the scientific method. The case context (title, story, suspects, lab tools) is provided with every request.

Your responses must be:
- Warm and encouraging — never harsh or sarcastic
- Specific — reference what the student actually wrote
- Actionable — give one concrete next step
- Brief — feedback ≤ 2 sentences

Scoring (0 to 2):
- 0 = missing the key elements, or factually wrong
- 1 = partial — some required structure or accuracy is present
- 2 = complete — all expected elements are present and scientifically sound

Always respond in valid JSON that matches the requested schema. No prose outside the JSON object.`;

const responseSchema = {
  type: 'OBJECT',
  properties: {
    score: { type: 'INTEGER' },
    feedback: { type: 'STRING' },
    strengths: { type: 'ARRAY', items: { type: 'STRING' } },
    improvements: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['score', 'feedback', 'strengths', 'improvements'],
};

function buildUserPrompt(req: GradeRequest): string {
  const header = `Case: ${req.caseTitle}\nStory: ${req.caseStory}\nCriterion ${req.criterion}: ${CRITERION_DESCRIPTIONS[req.criterion]}\n`;

  if (req.type === 'hypothesis') {
    return `${header}
The student is writing a hypothesis. The expected structure is:
"If [independent variable], then [dependent variable observation], because [scientific reasoning]."

Student's hypothesis statement: "${req.answer}"
Independent variable they named: "${req.iv ?? ''}"
Dependent variable they named: "${req.dv ?? ''}"
Control they named: "${req.control ?? ''}"

Evaluate: is the if-then-because structure present? Are IV, DV, and control correctly identified and appropriate for the case investigation described above? Score 0–2.`;
  }

  if (req.type === 'verdict') {
    return `${header}
The student must conclude what caused the harm in this case and justify it scientifically.

Suspect they named: "${req.chosenSuspectName}"
Correct answer: "${req.correctSuspectName}" (verdict ${req.isVerdictCorrect ? 'correct' : 'incorrect'})
Available lab readings: ${req.readingsSummary ?? 'none'}

Student's reasoning: "${req.answer}"

Evaluate the reasoning — not just whether the suspect was right. Does the reasoning:
- cite specific lab readings or evidence by name,
- explain the underlying scientific mechanism (chemistry / biology / physics as appropriate for this case),
- compare against a control or baseline where one exists?
Score 0–2.`;
  }

  return `${header}
Reflection question: "${req.question}"
Student answer: "${req.answer}"

Evaluate against Criterion ${req.criterion}. Is the answer specific, scientifically literate, and on-criterion? Score 0–2.`;
}

export async function gradeAnswer(req: GradeRequest): Promise<GradeResponse> {
  const apiKey = getApiKey();
  if (!apiKey) return stubGrade(req);

  try {
    const res = await fetch(`${GEMINI_URL}?key=${encodeURIComponent(apiKey)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: buildUserPrompt(req) }] }],
        systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema,
          temperature: 0.4,
        },
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`Gemini API ${res.status}: ${detail.slice(0, 200)}`);
    }
    const data = (await res.json()) as {
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Empty response from Gemini');
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(2, parsed.score ?? 0)) as 0 | 1 | 2;
    return {
      score,
      feedback: parsed.feedback ?? 'No feedback returned.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      provider: 'gemini',
    };
  } catch (err) {
    console.error('Gemini grading failed, falling back to stub:', err);
    return stubGrade(req);
  }
}

function stubGrade(req: GradeRequest): GradeResponse {
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
