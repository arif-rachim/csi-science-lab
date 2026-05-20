import Phaser from 'phaser';
import { EventBus, GameEvents } from '../EventBus';
import { caseOne } from '../../cases/case-01-poisoned-principal';
import type { Evidence } from '../../cases/types';

const BOTTLE_COLORS: Record<string, number> = {
  'evidence-bottle-a': 0xe8e8e8,
  'evidence-bottle-b': 0xf5f5f0,
  'evidence-bottle-c': 0xeed95a,
  'evidence-bottle-d': 0x6b6470,
};

export class CrimeSceneScene extends Phaser.Scene {
  private collected = new Set<string>();
  private resetListener?: () => void;

  constructor() {
    super('CrimeSceneScene');
  }

  create() {
    const { width, height } = this.scale;
    this.cameras.main.setBackgroundColor('#162038');

    this.add
      .rectangle(width / 2, 220, 640, 140, 0x5a4530)
      .setStrokeStyle(2, 0x6b5538);

    this.add.text(8, 8, "Principal's Office", {
      fontFamily: 'Inter, sans-serif',
      fontSize: '16px',
      color: '#f2ead3',
    });

    this.add
      .text(width / 2, height - 18, 'Click an item to collect it as evidence', {
        fontFamily: 'ui-monospace, monospace',
        fontSize: '12px',
        color: '#f5b945',
      })
      .setOrigin(0.5);

    caseOne.evidence.forEach((e) => this.spawnEvidence(e));

    this.resetListener = () => {
      this.collected.clear();
      this.scene.restart();
    };
    EventBus.on(GameEvents.CasePhaseChanged, this.resetListener);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      if (this.resetListener) EventBus.off(GameEvents.CasePhaseChanged, this.resetListener);
    });

    EventBus.emit(GameEvents.SceneReady, { scene: 'CrimeSceneScene' });
  }

  private spawnEvidence(e: Evidence) {
    const { x, y } = e.location;
    const isBottle = e.id.startsWith('evidence-bottle-');
    const isMug = e.id === 'evidence-coffee-mug';
    const isNote = e.id === 'evidence-symptoms';

    let target: Phaser.GameObjects.Shape;
    if (isBottle) {
      target = this.add.rectangle(x, y, 24, 50, BOTTLE_COLORS[e.id] ?? 0xffffff);
      target.setStrokeStyle(2, 0xf2ead3);
      const letter = e.id.slice(-1).toUpperCase();
      this.add
        .text(x, y, letter, {
          fontFamily: 'ui-monospace, monospace',
          fontSize: '14px',
          color: '#0a1226',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    } else if (isMug) {
      target = this.add.circle(x, y, 18, 0x6b3d20);
      target.setStrokeStyle(2, 0xf2ead3);
      this.add
        .text(x, y, '☕', {
          fontSize: '18px',
        })
        .setOrigin(0.5);
    } else if (isNote) {
      target = this.add.rectangle(x, y, 72, 44, 0xf2ead3);
      target.setStrokeStyle(2, 0x9a8857);
      this.add
        .text(x, y, '📋', {
          fontSize: '20px',
        })
        .setOrigin(0.5);
    } else {
      target = this.add.rectangle(x, y, 30, 30, 0xf5b945);
    }

    target.setInteractive({ useHandCursor: true });
    target.on('pointerover', () => {
      if (!this.collected.has(e.id)) target.setScale(1.15);
    });
    target.on('pointerout', () => {
      target.setScale(1);
    });
    target.on('pointerdown', () => {
      if (this.collected.has(e.id)) return;
      this.collected.add(e.id);
      target.setAlpha(0.55);
      this.flashCollected(x, y);
      EventBus.emit(GameEvents.EvidenceCollected, { id: e.id, name: e.name });
    });
  }

  private flashCollected(x: number, y: number) {
    const ping = this.add.circle(x, y, 4, 0xf5b945, 0.8);
    this.tweens.add({
      targets: ping,
      radius: 40,
      alpha: 0,
      duration: 500,
      onComplete: () => ping.destroy(),
    });
  }
}
