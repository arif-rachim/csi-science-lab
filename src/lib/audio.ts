type StingType = 'suspense' | 'reveal' | 'win' | 'fail' | 'click';

const MUTE_KEY = 'csi-audio-muted';

class GameAudio {
  private ctx?: AudioContext;
  private master?: GainNode;
  private droneNodes?: { sources: OscillatorNode[]; gain: GainNode };
  private lastClickAt = 0;
  private muted = readInitialMuted();

  ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      try {
        this.ctx = new Ctx();
      } catch {
        return null;
      }
      this.master = this.ctx.createGain();
      this.master.gain.value = this.muted ? 0 : 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  isMuted(): boolean {
    return this.muted;
  }

  setMuted(value: boolean): void {
    this.muted = value;
    try {
      window.localStorage.setItem(MUTE_KEY, value ? '1' : '0');
    } catch {
      /* ignore */
    }
    if (this.master && this.ctx) {
      const now = this.ctx.currentTime;
      this.master.gain.cancelScheduledValues(now);
      this.master.gain.setTargetAtTime(value ? 0 : 0.6, now, 0.08);
    }
  }

  click(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.muted) return;
    const now = ctx.currentTime;
    if (now - this.lastClickAt < 0.018) return;
    this.lastClickAt = now;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.value = 1400 + Math.random() * 600;
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
    osc.connect(gain).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.03);
  }

  startDrone(): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.droneNodes) return;

    const gain = ctx.createGain();
    gain.gain.value = 0;
    gain.gain.setTargetAtTime(0.18, ctx.currentTime, 1.5);

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 280;
    filter.Q.value = 5;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 220;
    lfo.connect(lfoGain).connect(filter.frequency);

    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.value = 55;
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.value = 55.3;
    const osc3 = ctx.createOscillator();
    osc3.type = 'sine';
    osc3.frequency.value = 110.4;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.6;
    osc1.connect(oscGain);
    osc2.connect(oscGain);
    const upperGain = ctx.createGain();
    upperGain.gain.value = 0.18;
    osc3.connect(upperGain);
    oscGain.connect(filter);
    upperGain.connect(filter);
    filter.connect(gain).connect(this.master);

    osc1.start();
    osc2.start();
    osc3.start();
    lfo.start();

    this.droneNodes = { sources: [osc1, osc2, osc3, lfo], gain };
  }

  stopDrone(): void {
    if (!this.ctx || !this.droneNodes) return;
    const now = this.ctx.currentTime;
    const { sources, gain } = this.droneNodes;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setTargetAtTime(0, now, 0.5);
    sources.forEach((s) => {
      try {
        s.stop(now + 2.5);
      } catch {
        /* ignore */
      }
    });
    this.droneNodes = undefined;
  }

  sting(type: StingType): void {
    const ctx = this.ensure();
    if (!ctx || !this.master || this.muted) return;
    const now = ctx.currentTime;
    switch (type) {
      case 'click':
        this.tone(now, 880, 0.06, 0.08, 'square');
        break;
      case 'suspense':
        this.tone(now, 110, 0.7, 0.18, 'sawtooth');
        this.tone(now + 0.02, 116.5, 0.7, 0.14, 'sawtooth');
        break;
      case 'reveal':
        this.tone(now, 220, 0.16, 0.12, 'triangle');
        this.tone(now + 0.13, 277.2, 0.16, 0.12, 'triangle');
        this.tone(now + 0.26, 329.6, 0.36, 0.14, 'triangle');
        break;
      case 'win':
        this.tone(now, 523.25, 0.12, 0.18, 'triangle');
        this.tone(now + 0.1, 659.25, 0.12, 0.18, 'triangle');
        this.tone(now + 0.2, 783.99, 0.12, 0.18, 'triangle');
        this.tone(now + 0.3, 1046.5, 0.4, 0.22, 'triangle');
        this.tone(now + 0.3, 523.25, 0.4, 0.12, 'sine');
        break;
      case 'fail':
        this.tone(now, 196, 0.18, 0.2, 'sawtooth');
        this.tone(now + 0.18, 185, 0.18, 0.2, 'sawtooth');
        this.tone(now + 0.36, 138.59, 0.7, 0.22, 'sawtooth');
        this.tone(now + 0.36, 196, 0.7, 0.12, 'sawtooth');
        break;
    }
  }

  private tone(
    when: number,
    freq: number,
    duration: number,
    peak: number,
    type: OscillatorType,
  ): void {
    if (!this.ctx || !this.master) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, when);
    gain.gain.setValueAtTime(0, when);
    gain.gain.linearRampToValueAtTime(peak, when + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + duration);
    osc.connect(gain).connect(this.master);
    osc.start(when);
    osc.stop(when + duration + 0.05);
  }
}

function readInitialMuted(): boolean {
  try {
    return window.localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export const audio = new GameAudio();
