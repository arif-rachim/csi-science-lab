import { useEffect, useState } from 'react';

interface TypewriterProps {
  text: string;
  speed?: number;
  startDelay?: number;
  onDone?: () => void;
  className?: string;
  showCursor?: boolean;
  skippable?: boolean;
}

export function Typewriter(props: TypewriterProps) {
  return <TypewriterInner key={props.text} {...props} />;
}

function TypewriterInner({
  text,
  speed = 14,
  startDelay = 0,
  onDone,
  className,
  showCursor = true,
  skippable = true,
}: TypewriterProps) {
  const [frame, setFrame] = useState(0);
  const [skipped, setSkipped] = useState(false);

  const done = !text || skipped || frame >= text.length;
  const shown = skipped ? text : text.slice(0, frame);

  useEffect(() => {
    if (!text || skipped) return;
    let intervalId: number | undefined;
    const startTimer = window.setTimeout(() => {
      intervalId = window.setInterval(() => {
        setFrame((f) => f + 1);
      }, speed);
    }, startDelay);
    return () => {
      window.clearTimeout(startTimer);
      if (intervalId !== undefined) window.clearInterval(intervalId);
    };
  }, [text, speed, startDelay, skipped]);

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
