interface ConfettiProps {
  count?: number;
  durationMs?: number;
  seed?: number;
}

interface Piece {
  id: number;
  left: number;
  delay: number;
  duration: number;
  color: string;
  rotate: number;
  width: number;
  height: number;
}

const COLORS = ['#f5b945', '#e84545', '#5ec56e', '#4a90c8', '#f2ead3', '#c89bff'];

function rand(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function Confetti({ count = 60, durationMs = 4000, seed = 1 }: ConfettiProps) {
  const pieces: Piece[] = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: rand(seed + i * 7 + 1) * 100,
    delay: rand(seed + i * 7 + 2) * 1.5,
    duration: (durationMs / 1000) * (0.7 + rand(seed + i * 7 + 3) * 0.6),
    color: COLORS[i % COLORS.length],
    rotate: rand(seed + i * 7 + 4) * 360,
    width: 6 + rand(seed + i * 7 + 5) * 8,
    height: 10 + rand(seed + i * 7 + 6) * 12,
  }));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.left}%`,
            backgroundColor: p.color,
            width: `${p.width}px`,
            height: `${p.height}px`,
            transform: `rotate(${p.rotate}deg)`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
