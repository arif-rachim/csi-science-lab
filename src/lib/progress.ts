import type { PlayerProgress } from '../cases/types';

const STORAGE_KEY = 'csi-science-lab:progress';

type ProgressMap = Record<string, PlayerProgress>;

function readAll(): ProgressMap {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ProgressMap;
  } catch {
    return {};
  }
}

export function saveProgress(progress: PlayerProgress): void {
  const all = readAll();
  all[progress.caseId] = progress;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function loadProgress(caseId: string): PlayerProgress | null {
  return readAll()[caseId] ?? null;
}

export function loadAllProgress(): ProgressMap {
  return readAll();
}
