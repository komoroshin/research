/* ============================================================================
   view/audio.js — процедурные звуки на Web Audio API (без файлов).
   ========================================================================== */
(function (root) {
  'use strict';
  const H3 = root.H3 || (root.H3 = {});
  let ctx = null, master = null, enabled = true;
  try { enabled = localStorage.getItem('homm3.sound') !== '0'; } catch (e) { /* ignore */ }

  function ensure() {
    if (ctx) return ctx;
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
    ctx = new AC(); master = ctx.createGain(); master.gain.value = 0.3; master.connect(ctx.destination);
    return ctx;
  }
  function tone(freq, dur, type, vol, t0, slide) {
    const c = ensure(); if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type || 'square'; o.frequency.setValueAtTime(freq, t0);
    if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(20, slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(vol || 0.3, t0 + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    o.connect(g); g.connect(master); o.start(t0); o.stop(t0 + dur + 0.02);
  }
  function noise(dur, vol, t0, lp) {
    const c = ensure(); if (!c) return;
    const n = Math.floor(c.sampleRate * dur), buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const g = c.createGain(); g.gain.value = vol || 0.3;
    const f = c.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp || 1200;
    src.connect(f); f.connect(g); g.connect(master); src.start(t0);
  }
  const SFX = {
    click: t => tone(900, 0.04, 'square', 0.1, t),
    step: t => noise(0.05, 0.1, t, 600),
    hit: t => { noise(0.12, 0.35, t, 900); tone(140, 0.12, 'sawtooth', 0.22, t, 60); },
    shoot: t => { tone(1200, 0.08, 'triangle', 0.18, t, 300); noise(0.05, 0.1, t, 3000); },
    spell: t => { for (let i = 0; i < 5; i++) tone(500 + i * 180, 0.18, 'sine', 0.14, t + i * 0.05); },
    death: t => { tone(220, 0.35, 'sawtooth', 0.22, t, 40); noise(0.3, 0.18, t, 500); },
    coin: t => { tone(1400, 0.07, 'square', 0.13, t); tone(1900, 0.1, 'square', 0.13, t + 0.06); },
    build: t => { noise(0.15, 0.28, t, 400); tone(90, 0.2, 'square', 0.18, t + 0.05); tone(120, 0.15, 'square', 0.14, t + 0.2); },
    levelup: t => [523, 659, 784, 1047].forEach((f, i) => tone(f, 0.18, 'triangle', 0.18, t + i * 0.09)),
    win: t => [392, 523, 659, 784, 1047].forEach((f, i) => tone(f, 0.3, 'triangle', 0.2, t + i * 0.12)),
    lose: t => [440, 370, 311, 233].forEach((f, i) => tone(f, 0.35, 'sawtooth', 0.16, t + i * 0.18)),
    turn: t => { tone(660, 0.08, 'triangle', 0.14, t); tone(880, 0.1, 'triangle', 0.14, t + 0.08); },
    week: t => [523, 659, 784].forEach((f, i) => tone(f, 0.2, 'triangle', 0.16, t + i * 0.1)),
    error: t => tone(180, 0.15, 'square', 0.14, t, 120),
    siege: t => { noise(0.3, 0.45, t, 300); tone(60, 0.3, 'sawtooth', 0.28, t, 30); },
    morale: t => [784, 988, 1175].forEach((f, i) => tone(f, 0.12, 'sine', 0.16, t + i * 0.06)),
    luck: t => [1047, 1319, 1568, 2093].forEach((f, i) => tone(f, 0.1, 'sine', 0.14, t + i * 0.05)),
    flag: t => { tone(700, 0.1, 'triangle', 0.15, t); tone(1050, 0.15, 'triangle', 0.15, t + 0.1); },
  };
  function play(name) {
    if (!enabled) return;
    const c = ensure(); if (!c) return;
    if (c.state === 'suspended') c.resume();
    const fn = SFX[name]; if (fn) try { fn(c.currentTime); } catch (e) { /* ignore */ }
  }
  function unlock() { const c = ensure(); if (c && c.state === 'suspended') c.resume(); }
  function setEnabled(v) { enabled = !!v; try { localStorage.setItem('homm3.sound', v ? '1' : '0'); } catch (e) { /* ignore */ } }
  H3.Audio = { play, unlock, setEnabled, isEnabled: () => enabled };
})(typeof window !== 'undefined' ? window : globalThis);
