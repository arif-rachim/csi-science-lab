import { create } from 'zustand';
import type { PlayerProgress } from '../cases/types';

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
  finalVerdict: string | null;
  reflections: Record<string, string>;
  progress: PlayerProgress | null;

  startCase: (caseId: string) => void;
  setPhase: (phase: CasePhase) => void;
  collectEvidence: (id: string) => void;
  submitHypothesis: (id: string) => void;
  recordTest: (id: string) => void;
  setVerdict: (id: string) => void;
  setReflection: (questionId: string, answer: string) => void;
  completeCase: (progress: PlayerProgress) => void;
  resetCase: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  activeCaseId: null,
  phase: 'menu',
  evidenceCollected: [],
  hypothesesSubmitted: [],
  testsPerformed: [],
  finalVerdict: null,
  reflections: {},
  progress: null,

  startCase: (caseId) =>
    set({
      activeCaseId: caseId,
      phase: 'crime-scene',
      evidenceCollected: [],
      hypothesesSubmitted: [],
      testsPerformed: [],
      finalVerdict: null,
      reflections: {},
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
  recordTest: (id) =>
    set((s) => ({
      testsPerformed: s.testsPerformed.includes(id) ? s.testsPerformed : [...s.testsPerformed, id],
    })),
  setVerdict: (id) => set({ finalVerdict: id }),
  setReflection: (questionId, answer) =>
    set((s) => ({ reflections: { ...s.reflections, [questionId]: answer } })),
  completeCase: (progress) => set({ progress, phase: 'complete' }),
  resetCase: () =>
    set({
      activeCaseId: null,
      phase: 'menu',
      evidenceCollected: [],
      hypothesesSubmitted: [],
      testsPerformed: [],
      finalVerdict: null,
      reflections: {},
    }),
}));
