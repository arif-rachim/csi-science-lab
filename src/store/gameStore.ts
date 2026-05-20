import { create } from 'zustand';
import type { PhReading, PlayerProgress } from '../cases/types';

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
  testsPerformed: string[];
  phReadings: Record<string, PhReading>;
  confidence: number;
  finalVerdict: string | null;
  reflections: Record<string, string>;
  progress: PlayerProgress | null;

  startCase: (caseId: string) => void;
  setPhase: (phase: CasePhase) => void;
  collectEvidence: (id: string) => void;
  submitHypothesis: (id: string) => void;
  submitHypotheses: (ids: string[]) => void;
  recordTest: (id: string) => void;
  recordTests: (ids: string[]) => void;
  setPhReadings: (readings: Record<string, PhReading>) => void;
  setConfidence: (value: number) => void;
  setVerdict: (id: string) => void;
  setReflection: (questionId: string, answer: string) => void;
  setReflections: (answers: Record<string, string>) => void;
  completeCase: (progress: PlayerProgress) => void;
  resetCase: () => void;
}

const initialState = {
  activeCaseId: null,
  phase: 'menu' as CasePhase,
  evidenceCollected: [] as string[],
  hypothesesSubmitted: [] as string[],
  testsPerformed: [] as string[],
  phReadings: {} as Record<string, PhReading>,
  confidence: 70,
  finalVerdict: null as string | null,
  reflections: {} as Record<string, string>,
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
  setVerdict: (id) => set({ finalVerdict: id }),
  setReflection: (questionId, answer) =>
    set((s) => ({ reflections: { ...s.reflections, [questionId]: answer } })),
  setReflections: (answers) => set({ reflections: answers }),
  completeCase: (progress) => set({ progress, phase: 'complete' }),
  resetCase: () => set({ ...initialState }),
}));
