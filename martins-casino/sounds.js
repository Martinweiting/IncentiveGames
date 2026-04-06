// Martin's Casino — Shared Sound Effects (Web Audio API)
const Snd = (() => {
  let C;
  const ctx = () => {
    if (!C) C = new (window.AudioContext||window.webkitAudioContext)();
    if (C.state==='suspended') C.resume();
    return C;
  };
  const tone = (f,t,d,v=0.32,at=0) => {
    const c=ctx(),o=c.createOscillator(),g=c.createGain();
    o.type=t; o.frequency.value=f;
    const s=c.currentTime+at;
    g.gain.setValueAtTime(v,s);
    g.gain.exponentialRampToValueAtTime(0.001,s+d);
    o.connect(g); g.connect(c.destination);
    o.start(s); o.stop(s+d+0.02);
  };
  const whoosh = (d,cut=3000,v=0.22) => {
    const c=ctx(),b=c.createBuffer(1,~~(c.sampleRate*d),c.sampleRate),dd=b.getChannelData(0);
    for(let i=0;i<dd.length;i++) dd[i]=Math.random()*2-1;
    const src=c.createBufferSource(); src.buffer=b;
    const f=c.createBiquadFilter(); f.type='highpass'; f.frequency.value=cut;
    const g=c.createGain(); g.gain.setValueAtTime(v,c.currentTime); g.gain.exponentialRampToValueAtTime(0.001,c.currentTime+d);
    src.connect(f); f.connect(g); g.connect(c.destination); src.start();
  };
  return {
    deal:      ()=>whoosh(0.07,3500,0.26),
    flip:      ()=>whoosh(0.04,6000,0.13),
    chip:      ()=>{ tone(900,'sine',0.07,0.18); tone(1400,'sine',0.04,0.08); },
    win:       ()=>[523,659,784,1047].forEach((f,i)=>tone(f,'sine',0.35,0.22,i*.09)),
    lose:      ()=>{ tone(220,'sawtooth',.45,.18); tone(185,'sawtooth',.45,.13,.1); },
    blackjack: ()=>[523,659,784,1047,1319].forEach((f,i)=>tone(f,'sine',.45,.28,i*.08)),
    bust:      ()=>{ tone(200,'sawtooth',.25,.25); tone(150,'sawtooth',.5,.25,.18); },
    pong:      ()=>{ tone(160,'sawtooth',.2,.28); tone(140,'sawtooth',.45,.22,.12); },
    push:      ()=>tone(440,'sine',.3,.18),
  };
})();
