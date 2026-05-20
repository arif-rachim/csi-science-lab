import { GoogleGenAI, Type } from '@google/genai';

type Criterion = 'A' | 'B' | 'C' | 'D';
type GradeType = 'hypothesis' | 'verdict' | 'reflection';

interface GradeRequest {
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

interface GradeResponse {
  score: 0 | 1 | 2;
  feedback: string;
  strengths: string[];
  improvements: string[];
  provider: 'gemini' | 'stub';
}

const CRITERION_DESCRIPTIONS: Record<Criterion, string> = {
  A: 'Knowing & Understanding — uses accurate scientific concepts and terminology.',
  B: 'Inquiring & Designing — forms a testable hypothesis with clear IV, DV, and control.',
  C: 'Processing & Evaluating — interprets data, identifies anomalies, calibrates confidence.',
  D: 'Reflecting on Impacts — connects science to ethical, real-world, or environmental impact.',
};

const SYSTEM_INSTRUCTION = `You are an IB MYP Year 4 Sciences teacher giving formative feedback to a 14-15 year old student playing a forensic-science learning game called "CSI: Science Lab". The student is working on Case 1: a school principal who collapsed after drinking coffee that was tampered with a strong acid.

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
  type: Type.OBJECT,
  properties: {
    score: { type: Type.INTEGER, minimum: 0, maximum: 2 },
    feedback: { type: Type.STRING },
    strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
    improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
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

Evaluate: is the if-then-because structure present? Are IV, DV, and control correctly identified and appropriate for testing whether a liquid is dangerous? Score 0–2.`;
  }

  if (req.type === 'verdict') {
    return `${header}
The student must conclude which liquid caused the harm and justify it scientifically.

Suspect they named: "${req.chosenSuspectName}"
Correct answer: "${req.correctSuspectName}" (verdict ${req.isVerdictCorrect ? 'correct' : 'incorrect'})
Available lab readings: ${req.readingsSummary ?? 'none'}

Student's reasoning: "${req.answer}"

Evaluate the reasoning — not just whether the suspect was right. Does the reasoning:
- cite specific pH readings or evidence,
- explain the acid–base chemistry mechanism (e.g., strong acid causes burns),
- compare against the distilled-water control?
Score 0–2.`;
  }

  return `${header}
Reflection question: "${req.question}"
Student answer: "${req.answer}"

Evaluate against Criterion ${req.criterion}. Is the answer specific, scientifically literate, and on-criterion? Score 0–2.`;
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

export default async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  let body: GradeRequest;
  try {
    body = (await req.json()) as GradeRequest;
  } catch {
    return new Response('Invalid JSON', { status: 400 });
  }

  if (!body?.type || !body?.criterion || typeof body.answer !== 'string') {
    return new Response('Missing required fields', { status: 400 });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(stubGrade(body));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: buildUserPrompt(body),
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error('Empty response from Gemini');
    const parsed = JSON.parse(text);
    const score = Math.max(0, Math.min(2, parsed.score ?? 0)) as 0 | 1 | 2;

    const result: GradeResponse = {
      score,
      feedback: parsed.feedback ?? 'No feedback returned.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      provider: 'gemini',
    };
    return Response.json(result);
  } catch (err) {
    console.error('Gemini grading failed, falling back to stub:', err);
    return Response.json(stubGrade(body));
  }
};

export const config = {
  path: '/api/grade',
};
