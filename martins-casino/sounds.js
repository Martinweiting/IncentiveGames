// Martin's Casino — Shared Sound Effects
// Loads polished CDN audio with Web Audio API synthesis fallback
const Snd = (() => {
  // ── CDN sound URLs ─────────────────────────────────────────────────────────
  const URLS = {
    deal:      'https://quicksounds.com/uploads/tracks/689305421_1962269402_2098853411.mp3',
    flip:      'https://quicksounds.com/uploads/tracks/918151184_174749704_164721627.mp3',
    chip:      'https://quicksounds.com/uploads/tracks/767645354_19962261_1673622602.mp3',
    win:       'https://quicksounds.com/uploads/tracks/544068319_552251017_357010058.mp3',
    lose:      'https://quicksounds.com/uploads/tracks/268704246_1877883817_505991471.mp3',
    blackjack: 'https://quicksounds.com/uploads/tracks/1962705925_309925314_1269434881.mp3',
    bust:      'https://quicksounds.com/uploads/tracks/1781050786_739563152_682564624.mp3',
    pong:      'https://quicksounds.com/uploads/tracks/1030198651_522781346_1376264581.mp3',
    push:      'https://quicksounds.com/uploads/tracks/312404828_1693341528_943152068.mp3',
  };
  const VOL = { deal:.65, flip:.45, chip:.6, win:.75, lose:.65, blackjack:.85, bust:.65, pong:.5, push:.45 };

  // ── Audio cache & preload ──────────────────────────────────────────────────
  const ready = {};
  const preload = (key) => {
    if (ready[key] !== undefined) return;
    ready[key] = false;
    const a = new Audio();
    a.preload = 'auto';
    a.src = URLS[key];
    a.addEventListener('canplaythrough', () => { ready[key] = true; }, { once: true });
    a.onerror = () => { ready[key] = null; }; // null = failed, use fallback
    a.load();
  };
  const playUrl = (key, vol) => {
    const a = new Audio(URLS[key]);
    a.volume = vol ?? (VOL[key] || 0.7);
    a.play().catch(() => {});
  };

  let triggered = false;
  const ensureLoaded = () => {
    if (triggered) return;
    triggered = true;
    Object.keys(URLS).forEach(preload);
  };
  if (typeof document !== 'undefined') {
    document.addEventListener('click',      ensureLoaded, { once: true });
    document.addEventListener('touchstart', ensureLoaded, { once: true });
  }

  // ── Web Audio fallback synthesis ───────────────────────────────────────────
  let C;
  const ctx = () => {
    if (!C) C = new (window.AudioContext || window.webkitAudioContext)();
    if (C.state === 'suspended') C.resume();
    return C;
  };
  const tone = (f, t, d, v = 0.32, at = 0) => {
    const c = ctx(), o = c.createOscillator(), g = c.createGain();
    o.type = t; o.frequency.value = f;
    const s = c.currentTime + at;
    g.gain.setValueAtTime(v, s);
    g.gain.exponentialRampToValueAtTime(0.001, s + d);
    o.connect(g); g.connect(c.destination);
    o.start(s); o.stop(s + d + 0.02);
  };
  const whoosh = (d, cut = 3000, v = 0.22) => {
    const c = ctx(), b = c.createBuffer(1, ~~(c.sampleRate * d), c.sampleRate), dd = b.getChannelData(0);
    for (let i = 0; i < dd.length; i++) dd[i] = Math.random() * 2 - 1;
    const src = c.createBufferSource(); src.buffer = b;
    const f = c.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = cut;
    const g = c.createGain();
    g.gain.setValueAtTime(v, c.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start();
  };

  // ── Play helper: CDN first, synthesis fallback ─────────────────────────────
  const play = (key, fallback) => {
    ensureLoaded();
    if (ready[key] === true) { playUrl(key); return; }
    if (ready[key] === false) {
      // Still loading — attempt direct play anyway (may work from cache)
      try { playUrl(key); } catch (_) { fallback?.(); }
      return;
    }
    // null (failed) or undefined — use synthesis
    fallback?.();
  };

  // ── Public API ─────────────────────────────────────────────────────────────
  return {
    deal:      () => play('deal',      () => whoosh(0.07, 3500, 0.26)),
    flip:      () => play('flip',      () => whoosh(0.04, 6000, 0.13)),
    chip:      () => play('chip',      () => { tone(900,'sine',0.07,0.18); tone(1400,'sine',0.04,0.08); }),
    win:       () => play('win',       () => [523,659,784,1047].forEach((f,i) => tone(f,'sine',0.35,0.22,i*.09))),
    lose:      () => play('lose',      () => { tone(220,'sawtooth',.45,.18); tone(185,'sawtooth',.45,.13,.1); }),
    blackjack: () => play('blackjack', () => [523,659,784,1047,1319].forEach((f,i) => tone(f,'sine',.45,.28,i*.08))),
    bust:      () => play('bust',      () => { tone(200,'sawtooth',.25,.25); tone(150,'sawtooth',.5,.25,.18); }),
    pong:      () => play('pong',      () => { tone(160,'sawtooth',.2,.28); tone(140,'sawtooth',.45,.22,.12); }),
    push:      () => play('push',      () => tone(440,'sine',.3,.18)),
  };
})();
