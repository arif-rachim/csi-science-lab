import type { Case } from './types';
import { caseOne } from './case-01-poisoned-principal';
import { caseTwo } from './case-02-pond-that-breathes';

export const cases: Case[] = [caseOne, caseTwo];

export function getCase(id: string): Case | undefined {
  return cases.find((c) => c.id === id);
}

export { caseOne, caseTwo };
