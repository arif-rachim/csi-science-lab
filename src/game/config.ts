import Phaser from 'phaser';
import { BootScene } from './scenes/BootScene';

export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 480;

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#0a1226',
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene],
};
