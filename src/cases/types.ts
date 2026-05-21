export type Subject = 'chemistry' | 'biology' | 'physics' | 'mixed';

export type LabToolId =
  | 'ph_probe'
  | 'microscope'
  | 'chromatography'
  | 'density'
  | 'spectroscopy';

export type Criterion = 'A' | 'B' | 'C' | 'D';

export interface Evidence {
  id: string;
  name: string;
  description: string;
  location: { x: number; y: number };
  relevantTools: LabToolId[];
}

export interface Suspect {
  id: string;
  name: string;
  motive?: string;
  alibi?: string;
}

export interface LabTool {
  id: LabToolId;
  name: string;
  unlocked: boolean;
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  type: 'open' | 'multiple-choice';
  options?: string[];
  criterion: Criterion;
}

export interface HypothesisTemplate {
  id: string;
  text: string;
  independentVariable: string;
  dependentVariable: string;
  control: string;
  correct: boolean;
}

export type PhClassification =
  | 'strong-acid'
  | 'weak-acid'
  | 'neutral'
  | 'weak-base'
  | 'strong-base';

export interface PhReading {
  ph: number;
  hexColor: string;
  classification: PhClassification;
  notes: string;
}

export type WaterStatus = 'healthy' | 'caution' | 'critical';

export interface WaterReading {
  ph: number;
  dissolvedO2: number;
  nitrate: number;
  microbeDensity: number;
  status: WaterStatus;
  notes: string;
}

export type MicrobeClassification = 'safe' | 'caution' | 'dangerous';

export interface MicroscopeReading {
  organism: string;
  asciiArt: string;
  classification: MicrobeClassification;
  notes: string;
}

export type LabMode = 'ph_probe' | 'water_panel';

export type CasePhase =
  | 'menu'
  | 'intro'
  | 'crime-scene'
  | 'hypothesis'
  | 'lab'
  | 'analysis'
  | 'verdict'
  | 'reflection'
  | 'complete';

export interface Case {
  id: string;
  title: string;
  subtitle: string;
  subject: Subject;
  mypTopics: string[];
  story: string;
  intro: string;
  briefing: string;
  phaseFlavor: Partial<Record<CasePhase, string>>;
  suspects: Suspect[];
  evidence: Evidence[];
  labTools: LabTool[];
  hypothesisTemplates: HypothesisTemplate[];
  labMode: LabMode;
  phReadings?: Record<string, PhReading>;
  waterReadings?: Record<string, WaterReading>;
  microscopeReadings?: Record<string, MicroscopeReading>;
  correctVerdict: string;
  reflectionQuestions: ReflectionQuestion[];
  estimatedMinutes: number;
  locked?: boolean;
}

export interface AiGrade {
  score: 0 | 1 | 2;
  feedback: string;
  strengths: string[];
  improvements: string[];
  provider: 'gemini' | 'stub';
}

export interface PlayerProgress {
  caseId: string;
  hypothesesSubmitted: string[];
  evidenceCollected: string[];
  testsPerformed: string[];
  finalVerdict: string;
  scores: {
    A: number;
    B: number;
    C: number;
    D: number;
  };
  completedAt: string | null;
}
