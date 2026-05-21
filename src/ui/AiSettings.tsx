import { useState } from 'react';
import { getApiKey, setApiKey, hasApiKey } from '../lib/aiKey';

interface AiSettingsProps {
  onClose?: () => void;
}

export function AiSettings({ onClose }: AiSettingsProps) {
  const [key, setKey] = useState(() => getApiKey());
  const [saved, setSaved] = useState(false);
  const [revealed, setRevealed] = useState(false);

  function save() {
    setApiKey(key.trim());
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function clear() {
    setApiKey('');
    setKey('');
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  const installed = hasApiKey();

  return (
    <section className="panel-titled space-y-4" data-title="AI Grading Settings">
      <p className="text-crt-fg/90">
        The game can grade your hypotheses, verdict reasoning, and reflections with
        Google Gemini. Paste your own Gemini API key below to turn it on.
      </p>

      <ul className="ml-6 list-disc space-y-1 text-sm text-crt-dim">
        <li>
          Get a free key at{' '}
          <a
            href="https://aistudio.google.com/apikey"
            target="_blank"
            rel="noreferrer noopener"
            className="text-crt-fg underline hover:text-crt-bright"
          >
            aistudio.google.com/apikey
          </a>{' '}
          — free tier includes 1,500 requests per day.
        </li>
        <li>
          The key is stored only on this device (browser localStorage). It is{' '}
          <span className="text-crt-fg">never sent to any server we run</span> — the
          browser calls Gemini directly.
        </li>
        <li>
          Your written answers <span className="text-crt-fg">are</span> sent to Google's
          Gemini API for grading. Free tier may use those inputs to improve their models.
        </li>
        <li>
          Without a key the game still works — it falls back to a local stub that gives
          basic feedback based on length and keywords.
        </li>
      </ul>

      <div>
        <label className="mb-1 block text-sm uppercase tracking-wider text-crt-amber">
          Gemini API key
        </label>
        <div className="flex gap-2">
          <input
            type={revealed ? 'text' : 'password'}
            className="flex-1 border border-crt-rule p-2"
            placeholder="Paste your AIza… key here"
            value={key}
            autoComplete="off"
            spellCheck={false}
            onChange={(e) => setKey(e.target.value)}
          />
          <button
            type="button"
            className="btn-ghost text-xs"
            onClick={() => setRevealed((v) => !v)}
          >
            {revealed ? '[H] Hide' : '[V] View'}
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-crt-rule pt-3">
        <p className="text-sm">
          Status:{' '}
          {installed ? (
            <span className="text-crt-ok">[●] Gemini ON</span>
          ) : (
            <span className="text-crt-dim">[○] Stub fallback</span>
          )}
          {saved && <span className="ml-2 text-crt-amber">· saved</span>}
        </p>
        <div className="flex gap-2">
          <button className="btn-ghost text-xs" onClick={clear}>
            [X] Clear key
          </button>
          <button className="btn-primary text-xs" onClick={save}>
            [S] Save key
          </button>
          {onClose && (
            <button className="btn-ghost text-xs" onClick={onClose}>
              [Esc] Close
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
