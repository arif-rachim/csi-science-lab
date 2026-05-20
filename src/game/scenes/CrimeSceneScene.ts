import Phaser from 'phaser';
import { EventBus, GameEvents } from '../EventBus';
import { caseOne } from '../../cases/case-01-poisoned-principal';
import type { Evidence } from '../../cases/types';

const SPRITE_BY_ID: Record<string, string> = {
  'evidence-bottle-a': 'bottle-a',
  'evidence-bottle-b': 'bottle-b',
  'evidence-bottle-c': 'bottle-c',
  'evidence-bottle-d': 'bottle-d',
  'evidence-coffee-mug': 'coffee-mug',
  'evidence-symptoms': 'doctor-note',
};

export class CrimeSceneScene extends Phaser.Scene {
  private collected = new Set<string>();

  constructor() {
    super('CrimeSceneScene');
  }

  preload() {
    this.load.svg('office-bg', '/assets/sprites/office-bg.svg', { width: 800, height: 480 });
    this.load.svg('bottle-a', '/assets/sprites/bottle-a.svg', { width: 40, height: 72 });
    this.load.svg('bottle-b', '/assets/sprites/bottle-b.svg', { width: 40, height: 72 });
    this.load.svg('bottle-c', '/assets/sprites/bottle-c.svg', { width: 40, height: 72 });
    this.load.svg('bottle-d', '/assets/sprites/bottle-d.svg', { width: 40, height: 72 });
    this.load.svg('coffee-mug', '/assets/sprites/coffee-mug.svg', { width: 60, height: 64 });
    this.load.svg('doctor-note', '/assets/sprites/doctor-note.svg', { width: 96, height: 64 });
    this.load.svg('evidence-glow', '/assets/sprites/evidence-glow.svg', { width: 80, height: 80 });
  }

  create() {
    this.collected.clear();
    this.add.image(400, 240, 'office-bg');

    this.spawnDust();
    caseOne.evidence.forEach((e) => this.spawnEvidence(e));

    const hint = this.add
      .text(400, 460, '✦  Click an item to collect it as evidence  ✦', {
        fontFamily: 'ui-monospace, monospace',
        fontSize: '12px',
        color: '#f5b945',
      })
      .setOrigin(0.5)
      .setAlpha(0.85);

    this.tweens.add({
      targets: hint,
      alpha: 0.55,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'sine.inOut',
    });

    EventBus.emit(GameEvents.SceneReady, { scene: 'CrimeSceneScene' });
  }

  private spawnEvidence(e: Evidence) {
    const key = SPRITE_BY_ID[e.id];
    if (!key) return;
    const { x, y } = e.location;

    const glow = this.add.image(x, y, 'evidence-glow').setAlpha(0).setScale(0.85);

    const item = this.add
      .image(x, y, key)
      .setInteractive({ useHandCursor: true });

    if (e.id !== 'evidence-symptoms') {
      this.tweens.add({
        targets: item,
        y: y - 2,
        duration: 1700 + Math.random() * 600,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      });
    }

    this.tweens.add({
      targets: glow,
      rotation: Math.PI * 2,
      duration: 8000,
      repeat: -1,
    });

    item.on('pointerover', () => {
      if (this.collected.has(e.id)) return;
      this.tweens.add({
        targets: item,
        scale: 1.18,
        duration: 160,
        ease: 'back.out(2)',
      });
      this.tweens.add({
        targets: glow,
        alpha: 0.95,
        scale: 1,
        duration: 200,
      });
    });

    item.on('pointerout', () => {
      if (this.collected.has(e.id)) return;
      this.tweens.add({ targets: item, scale: 1, duration: 160 });
      this.tweens.add({ targets: glow, alpha: 0, scale: 0.85, duration: 200 });
    });

    item.on('pointerdown', () => {
      if (this.collected.has(e.id)) return;
      this.collected.add(e.id);
      item.disableInteractive();
      EventBus.emit(GameEvents.EvidenceCollected, { id: e.id, name: e.name });
      this.collectAnim(item, glow);
    });
  }

  private collectAnim(item: Phaser.GameObjects.Image, glow: Phaser.GameObjects.Image) {
    this.tweens.killTweensOf(item);
    this.tweens.killTweensOf(glow);

    this.tweens.add({
      targets: glow,
      scale: 2.4,
      alpha: 0,
      duration: 450,
      ease: 'cubic.out',
      onComplete: () => glow.destroy(),
    });

    const ping = this.add.circle(item.x, item.y, 8, 0xf5b945, 0.9);
    this.tweens.add({
      targets: ping,
      radius: 55,
      alpha: 0,
      duration: 500,
      onComplete: () => ping.destroy(),
    });

    const flash = this.add
      .image(item.x, item.y, item.texture.key)
      .setTint(0xfff5d6)
      .setAlpha(0.85);
    this.tweens.add({
      targets: flash,
      alpha: 0,
      scale: 1.4,
      duration: 350,
      onComplete: () => flash.destroy(),
    });

    this.tweens.add({
      targets: item,
      x: 790,
      y: 475,
      scale: 0.25,
      alpha: 0,
      angle: 40,
      duration: 620,
      ease: 'cubic.in',
      onComplete: () => item.destroy(),
    });
  }

  private spawnDust() {
    const g = this.add.graphics();
    g.fillStyle(0xf5b945, 0.9);
    g.fillCircle(2, 2, 2);
    g.generateTexture('dust-dot', 4, 4);
    g.destroy();

    this.add
      .particles(0, 0, 'dust-dot', {
        x: { min: 0, max: 800 },
        y: 490,
        lifespan: 7000,
        speedY: { min: -12, max: -28 },
        speedX: { min: -8, max: 8 },
        scale: { start: 1, end: 0.3 },
        alpha: { start: 0.35, end: 0 },
        frequency: 600,
        quantity: 1,
      })
      .setDepth(-1);
  }
}
