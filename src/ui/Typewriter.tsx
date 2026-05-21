import { useEffect, useState } from 'react';
import { audio } from '../lib/audio';

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
  showCursor?: boolean;
  skippable?: boolean;
  playClicks?: boolean;
}

export function Typewriter(props: TypewriterProps) {
  return <TypewriterInner key={props.text} {...props} />;
}

function TypewriterInner({
  text,
  speed = 32,
  startDelay = 0,
  onDone,
  className,
  showCursor = true,
  skippable = true,
  playClicks = true,
}: TypewriterProps) {
  const [frame, setFrame] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const [started, setStarted] = useState(startDelay === 0);

  const done = !text || skipped || frame >= text.length;
  const shown = skipped ? text : text.slice(0, frame);

  useEffect(() => {
    if (started || startDelay <= 0) return;
    const t = window.setTimeout(() => setStarted(true), startDelay);
    return () => window.clearTimeout(t);
  }, [started, startDelay]);

  useEffect(() => {
    if (!started || skipped || !text || frame >= text.length) return;
    const nextChar = text[frame];
    const delay = computeDelay(text, frame, speed);
    const id = window.setTimeout(() => {
      if (playClicks && nextChar && !/\s/.test(nextChar)) audio.click();
      setFrame((f) => f + 1);
    }, delay);
    return () => window.clearTimeout(id);
  }, [started, skipped, text, frame, speed, playClicks]);

  useEffect(() => {
    if (done) onDone?.();
  }, [done, onDone]);

  function skip() {
    if (!skippable || done) return;
    setSkipped(true);
  }

  return (
    <pre
      onClick={skip}
      className={`whitespace-pre-wrap font-mono leading-snug ${
        skippable && !done ? 'cursor-pointer' : ''
      } ${className ?? ''}`}
    >
      {shown}
      {showCursor && !done && <span className="cursor" />}
    </pre>
  );
}

function computeDelay(text: string, idx: number, base: number): number {
  const prev = idx > 0 ? text[idx - 1] : '';
  const prev3 = idx >= 3 ? text.slice(idx - 3, idx) : '';
  const next = text[idx] ?? '';

  if (prev3 === '...') return base * 14;
  if (prev === '.' || prev === '!' || prev === '?') {
    if (next === '.' || next === '!' || next === '?') return base * 0.5;
    return base * 7;
  }
  if (prev === ',') return base * 3;
  if (prev === ':' || prev === ';') return base * 4;
  if (prev === '—' || prev === '–') return base * 4;
  if (prev === '\n') return base * 2.5;

  return base * (0.75 + Math.random() * 0.5);
}
