// CDOW — High-fidelity Web Audio sound engine with spatial echo, reverb & casino synthesis. MADE BY VOLVIX.

const SND = (() => {
  let ctx = null, master = null, reverbNode = null, delayNode = null, delayGain = null;
  let muted = localStorage.getItem('cdow_mute') === '1';
  let vol = parseFloat(localStorage.getItem('cdow_vol') || '0.55');

  function createReverbBuffer(audioCtx, duration = 1.6, decay = 2.2) {
    const sampleRate = audioCtx.sampleRate;
    const length = Math.floor(sampleRate * duration);
    const impulse = audioCtx.createBuffer(2, length, sampleRate);
    const left = impulse.getChannelData(0);
    const right = impulse.getChannelData(1);

    for (let i = 0; i < length; i++) {
      const t = i / sampleRate;
      const env = Math.exp(-t * decay);
      left[i] = (Math.random() * 2 - 1) * env;
      right[i] = (Math.random() * 2 - 1) * env;
    }
    return impulse;
  }

  function ensure() {
    if (ctx) return true;
    try {
      ctx = new (window.AudioContext || window.webkitAudioContext)();
      master = ctx.createGain();
      master.gain.value = vol;
      master.connect(ctx.destination);

      // Reverb / Echo bus
      reverbNode = ctx.createConvolver();
      reverbNode.buffer = createReverbBuffer(ctx, 1.4, 2.8);
      const reverbGain = ctx.createGain();
      reverbGain.gain.value = 0.28;
      reverbNode.connect(reverbGain);
      reverbGain.connect(master);

      // Stereo feedback delay
      delayNode = ctx.createDelay(1.0);
      delayNode.delayTime.value = 0.16;
      delayGain = ctx.createGain();
      delayGain.gain.value = 0.32;
      delayNode.connect(delayGain);
      delayGain.connect(delayNode);
      delayGain.connect(master);

      return true;
    } catch {
      return false;
    }
  }

  const unlock = () => {
    if (ensure() && ctx.state === 'suspended') ctx.resume();
  };
  document.addEventListener('pointerdown', unlock, { once: false });
  document.addEventListener('keydown', unlock, { once: false });

  function tone({ f = 440, f2, type = 'sine', t = 0.08, g = 0.25, delay = 0, curve = 0.001, echo = false }) {
    if (muted || !ensure()) return;
    const now = ctx.currentTime + delay;
    const o = ctx.createOscillator(), gn = ctx.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, now);
    if (f2) o.frequency.exponentialRampToValueAtTime(Math.max(1, f2), now + t);
    gn.gain.setValueAtTime(g, now);
    gn.gain.exponentialRampToValueAtTime(curve, now + t);

    o.connect(gn);
    gn.connect(master);
    if (echo && reverbNode) {
      gn.connect(reverbNode);
      gn.connect(delayNode);
    }
    o.start(now);
    o.stop(now + t + 0.04);
  }

  function noise({ t = 0.15, g = 0.2, delay = 0, hp = 400, echo = false }) {
    if (muted || !ensure()) return;
    const now = ctx.currentTime + delay;
    const len = Math.floor(ctx.sampleRate * t);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'highpass';
    filt.frequency.value = hp;
    const gn = ctx.createGain();
    gn.gain.value = g;
    src.connect(filt);
    filt.connect(gn);
    gn.connect(master);
    if (echo && reverbNode) gn.connect(reverbNode);
    src.start(now);
  }

  return {
    unlock,
    get muted() { return muted; },
    setMuted(m) { muted = m; localStorage.setItem('cdow_mute', m ? '1' : '0'); },
    get vol() { return vol; },
    setVol(v) { vol = v; localStorage.setItem('cdow_vol', v); if (master) master.gain.value = v; },

    click: () => tone({ f: 960, f2: 640, type: 'triangle', t: 0.04, g: 0.12 }),
    tick: (rare) => {
      tone({ f: rare ? 1600 : 780, f2: rare ? 1100 : 540, type: rare ? 'triangle' : 'square', t: 0.042, g: rare ? 0.22 : 0.13, echo: !!rare });
      if (rare) tone({ f: 2200, type: 'sine', t: 0.08, g: 0.09, echo: true });
    },
    tickUp: (n) => tone({ f: 520 + n * 45, type: 'triangle', t: 0.045, g: 0.12, echo: true }),
    coin: () => {
      tone({ f: 1400, f2: 2100, type: 'sine', t: 0.14, g: 0.22, echo: true });
      tone({ f: 2800, type: 'sine', t: 0.10, g: 0.12, delay: 0.06, echo: true });
    },
    win: () => {
      [523, 659, 784, 1046, 1318].forEach((f, i) =>
        tone({ f, type: 'triangle', t: 0.28, g: 0.20, delay: i * 0.08, echo: true })
      );
    },
    bigWin: () => {
      // Sub bass hit + crystal cascade chord
      tone({ f: 95, f2: 45, type: 'sine', t: 0.6, g: 0.35 });
      [523, 659, 784, 1046, 1318, 1568, 2093].forEach((f, i) =>
        tone({ f, type: 'triangle', t: 0.45, g: 0.18, delay: i * 0.07, echo: true })
      );
    },
    lose: () => {
      tone({ f: 320, f2: 90, type: 'sawtooth', t: 0.4, g: 0.18, echo: true });
      tone({ f: 160, f2: 60, type: 'sine', t: 0.5, g: 0.2 });
    },
    cash: () => {
      tone({ f: 880, f2: 1760, type: 'sine', t: 0.2, g: 0.22, echo: true });
      tone({ f: 1320, f2: 2640, type: 'sine', t: 0.24, g: 0.18, delay: 0.07, echo: true });
    },
    bust: () => {
      tone({ f: 140, f2: 35, type: 'sawtooth', t: 0.55, g: 0.35, echo: true });
      noise({ t: 0.45, g: 0.28, hp: 80, echo: true });
    },
    whoosh: () => noise({ t: 0.35, g: 0.14, hp: 600, echo: true }),
    pop: () => tone({ f: 450, f2: 900, type: 'sine', t: 0.08, g: 0.2, echo: true }),
  };
})();

window.SND = SND;
