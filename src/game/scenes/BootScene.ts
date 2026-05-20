import Phaser from 'phaser';
import { EventBus, GameEvents } from '../EventBus';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    const g = this.add.graphics();
    g.fillStyle(0xf5b945, 1);
    g.fillCircle(8, 8, 8);
    g.generateTexture('clue-dot', 16, 16);
    g.destroy();
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0a1226');

    this.add
      .text(width / 2, height / 2 - 40, 'CSI: Science Lab', {
        fontFamily: 'Inter, sans-serif',
        fontSize: '32px',
        color: '#f2ead3',
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 4, 'Boot scene ready — Case 1 standing by', {
        fontFamily: 'ui-monospace, monospace',
        fontSize: '14px',
        color: '#f5b945',
      })
      .setOrigin(0.5);

    this.add.image(width / 2, height / 2 + 60, 'clue-dot');

    EventBus.emit(GameEvents.SceneReady, { scene: 'BootScene' });
  }
}
