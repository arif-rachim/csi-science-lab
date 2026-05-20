import { create } from 'zustand';
import type { AiGrade, PhReading, PlayerProgress } from '../cases/types';

export type CasePhase =
  | 'menu'
  | 'crime-scene'
  | 'hypothesis'
  | 'lab'
  | 'analysis'
  | 'verdict'
  | 'reflection'
  | 'complete';

interface GameState {
  activeCaseId: string | null;
  phase: CasePhase;
  evidenceCollected: string[];
  hypothesesSubmitted: string[];
  hypothesisGrades: AiGrade[];
  testsPerformed: string[];
  phReadings: Record<string, PhReading>;
  confidence: number;
  finalVerdict: string | null;
  verdictReasoning: string;
  verdictGrade: AiGrade | null;
  reflections: Record<string, string>;
  reflectionGrades: Record<string, AiGrade>;
  progress: PlayerProgress | null;

  startCase: (caseId: string) => void;
  setPhase: (phase: CasePhase) => void;
  collectEvidence: (id: string) => void;
  submitHypothesis: (id: string) => void;
  submitHypotheses: (ids: string[]) => void;
  setHypothesisGrades: (grades: AiGrade[]) => void;
  recordTest: (id: string) => void;
  recordTests: (ids: string[]) => void;
  setPhReadings: (readings: Record<string, PhReading>) => void;
  setConfidence: (value: number) => void;
  setVerdict: (id: string, reasoning: string) => void;
  setVerdictGrade: (grade: AiGrade | null) => void;
  setReflection: (questionId: string, answer: string) => void;
  setReflections: (answers: Record<string, string>) => void;
  setReflectionGrade: (questionId: string, grade: AiGrade) => void;
  completeCase: (progress: PlayerProgress) => void;
  resetCase: () => void;
}

const initialState = {
  activeCaseId: null,
  phase: 'menu' as CasePhase,
  evidenceCollected: [] as string[],
  hypothesesSubmitted: [] as string[],
  hypothesisGrades: [] as AiGrade[],
  testsPerformed: [] as string[],
  phReadings: {} as Record<string, PhReading>,
  confidence: 70,
  finalVerdict: null as string | null,
  verdictReasoning: '',
  verdictGrade: null as AiGrade | null,
  reflections: {} as Record<string, string>,
  reflectionGrades: {} as Record<string, AiGrade>,
  progress: null as PlayerProgress | null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  startCase: (caseId) =>
    set({
      ...initialState,
      activeCaseId: caseId,
      phase: 'crime-scene',
    }),
  setPhase: (phase) => set({ phase }),
  collectEvidence: (id) =>
    set((s) => ({
      evidenceCollected: s.evidenceCollected.includes(id)
        ? s.evidenceCollected
        : [...s.evidenceCollected, id],
    })),
  submitHypothesis: (id) =>
    set((s) => ({
      hypothesesSubmitted: s.hypothesesSubmitted.includes(id)
        ? s.hypothesesSubmitted
        : [...s.hypothesesSubmitted, id],
    })),
  submitHypotheses: (ids) => set({ hypothesesSubmitted: ids }),
  setHypothesisGrades: (grades) => set({ hypothesisGrades: grades }),
  recordTest: (id) =>
    set((s) => ({
      testsPerformed: s.testsPerformed.includes(id) ? s.testsPerformed : [...s.testsPerformed, id],
    })),
  recordTests: (ids) =>
    set((s) => ({
      testsPerformed: Array.from(new Set([...s.testsPerformed, ...ids])),
    })),
  setPhReadings: (readings) => set({ phReadings: readings }),
  setConfidence: (value) => set({ confidence: value }),
  setVerdict: (id, reasoning) => set({ finalVerdict: id, verdictReasoning: reasoning }),
  setVerdictGrade: (grade) => set({ verdictGrade: grade }),
  setReflection: (questionId, answer) =>
    set((s) => ({ reflections: { ...s.reflections, [questionId]: answer } })),
  setReflections: (answers) => set({ reflections: answers }),
  setReflectionGrade: (questionId, grade) =>
    set((s) => ({ reflectionGrades: { ...s.reflectionGrades, [questionId]: grade } })),
  completeCase: (progress) => set({ progress, phase: 'complete' }),
  resetCase: () => set({ ...initialState }),
}));
