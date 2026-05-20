import Phaser from 'phaser';

export const GameEvents = {
  SceneReady: 'scene-ready',
  EvidenceCollected: 'evidence-collected',
  TestPerformed: 'test-performed',
  HypothesisSubmitted: 'hypothesis-submitted',
  VerdictSubmitted: 'verdict-submitted',
  CasePhaseChanged: 'case-phase-changed',
} as const;

export type GameEvent = (typeof GameEvents)[keyof typeof GameEvents];

export const EventBus = new Phaser.Events.EventEmitter();
