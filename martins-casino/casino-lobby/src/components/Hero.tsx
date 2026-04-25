import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useCountUp } from '../hooks/useCountUp';

interface Stat {
  label: string;
  end: number;
  prefix?: string;
  suffix: string;
  isDecimal?: boolean;
}

const STATS: Stat[] = [
  { label: '遊戲項目',   end: 10,   suffix: '+' },
  { label: '本週玩家',   end: 2847, suffix: '' },
  { label: '累計出獎',   end: 128,  prefix: '$', suffix: 'M+' },
  { label: '平均 RTP',   end: 965,  suffix: '%', isDecimal: true },
];

function StatItem({ stat, index, inView }: { stat: Stat; index: number; inView: boolean }) {
  const raw = useCountUp({ end: stat.end, duration: 2400, delay: index * 180, trigger: inView });
  const display = stat.isDecimal
    ? (inView ? (stat.end / 10).toFixed(1) : '0.0')
    : (inView ? raw : 0).toLocaleString();

  return (
    <motion.div
      className="flex flex-col items-center gap-1.5"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay: 0.9 + index * 0.15, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="font-number font-bold text-3xl md:text-4xl font-tabular text-gold">
        {stat.prefix ?? ''}{display}{stat.suffix}
      </span>
      <span className="section-label">{stat.label}</span>
    </motion.div>
  );
}

/* ── Decorative geometric lines ── */
function GeoLines() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Top-left corner frame */}
      <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-gold/15" />
      <div className="absolute top-24 left-8 w-4 h-4 border-l border-t border-gold/30" />
      {/* Top-right corner frame */}
      <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-gold/15" />
      <div className="absolute top-24 right-8 w-4 h-4 border-r border-t border-gold/30" />
      {/* Center horizontal faint lines */}
      <div className="absolute left-0 right-0 top-1/3 h-px bg-gradient-to-r from-transparent via-gold/6 to-transparent" />
      <div className="absolute left-0 right-0 top-2/3 h-px bg-gradient-to-r from-transparent via-gold/4 to-transparent" />
      {/* Diagonal accent */}
      <div
        className="absolute -left-20 top-40 w-96 h-px origin-left opacity-10"
        style={{ background: 'linear-gradient(90deg, transparent, #C9A84C)', transform: 'rotate(25deg)' }}
      />
      <div
        className="absolute -right-20 top-40 w-96 h-px origin-right opacity-10"
        style={{ background: 'linear-gradient(270deg, transparent, #C9A84C)', transform: 'rotate(-25deg)' }}
      />
    </div>
  );
}

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null);
  const statsInView = useInView(statsRef, { once: true, margin: '-80px' });

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section id="lobby" className="relative min-h-screen flex flex-col items-center justify-center pt-16 pb-0 overflow-hidden">
      {/* Spotlight overlay */}
      <div className="hero-spotlight absolute inset-0 pointer-events-none" aria-hidden />
      <GeoLines />

      {/* Main content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Pre-label */}
        <motion.p className="section-label mb-6" variants={itemVariants}>
          頂級私人娛樂城 · MACAU LUXURY EXPERIENCE
        </motion.p>

        {/* Main title */}
        <motion.h1
          className="font-serif font-black leading-none tracking-[0.06em]"
          variants={itemVariants}
          style={{ fontSize: 'clamp(3rem, 10vw, 8rem)' }}
        >
          <span className="text-gold-shimmer block">MARTIN'S</span>
          <span className="text-gold-gradient block">CASINO</span>
        </motion.h1>

        {/* Decorative divider */}
        <motion.div
          className="flex items-center gap-4 my-8 w-full max-w-xs"
          variants={itemVariants}
        >
          <div className="flex-1 gold-line" />
          <span className="text-gold/50 text-sm font-serif">✦</span>
          <div className="flex-1 gold-line" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-sans text-[#D4C5A9]/60 tracking-[0.12em] uppercase text-sm md:text-base max-w-md leading-relaxed"
          variants={itemVariants}
        >
          極致奢華 · 公平競技 · 全天候陪伴<br />
          <span className="text-xs">WHERE FORTUNE MEETS ELEGANCE</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div className="flex flex-wrap items-center justify-center gap-4 mt-10" variants={itemVariants}>
          <a
            href="#games"
            className="px-8 py-3.5 rounded-full btn-gold font-sans font-medium text-sm tracking-widest uppercase"
          >
            立即開始遊戲
          </a>
          <a
            href="#promotions"
            className="px-8 py-3.5 rounded-full border border-white/10 text-[#D4C5A9]/60 hover:text-gold hover:border-gold/30 transition-all font-sans text-sm tracking-widest uppercase"
          >
            查看優惠
          </a>
        </motion.div>
      </motion.div>

      {/* Stats row */}
      <div
        ref={statsRef}
        className="relative z-10 w-full max-w-4xl mx-auto mt-20 px-6 pb-16"
      >
        {/* Separator */}
        <div className="gold-line mb-12" />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {STATS.map((stat, i) => (
            <StatItem key={stat.label} stat={stat} index={i} inView={statsInView} />
          ))}
        </div>

        {/* Bottom separator */}
        <div className="gold-line mt-12" />
      </div>

      {/* Scroll cue */}
      <motion.div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <span className="section-label text-[9px]">SCROLL</span>
        <motion.div
          className="w-px h-8 bg-gradient-to-b from-gold/40 to-transparent"
          animate={{ scaleY: [0, 1, 0], originY: 0 }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>
    </section>
  );
}
