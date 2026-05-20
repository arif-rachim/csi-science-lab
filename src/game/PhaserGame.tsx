import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { phaserConfig } from './config';

export function PhaserGame() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;
    gameRef.current = new Phaser.Game({
      ...phaserConfig,
      parent: containerRef.current,
    });
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="aspect-[5/3] w-full overflow-hidden rounded-lg border border-detective-slate bg-detective-ink"
    />
  );
}
