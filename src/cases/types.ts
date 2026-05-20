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

export interface Case {
  id: string;
  title: string;
  subject: Subject;
  mypTopics: string[];
  story: string;
  suspects: Suspect[];
  evidence: Evidence[];
  labTools: LabTool[];
  hypothesisTemplates: HypothesisTemplate[];
  correctVerdict: string;
  reflectionQuestions: ReflectionQuestion[];
  estimatedMinutes: number;
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
