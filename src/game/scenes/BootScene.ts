import Phaser from 'phaser';

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
    this.scene.start('CrimeSceneScene');
  }
}
