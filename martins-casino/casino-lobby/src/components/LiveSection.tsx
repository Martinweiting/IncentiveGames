import { useRef } from 'react';
import { motion } from 'framer-motion';
import { LIVE_TABLES } from '../data/games';

function LiveCard({ table, index }: { table: typeof LIVE_TABLES[0]; index: number }) {
  return (
    <motion.article
      className="shrink-0 w-64 snap-start rounded-2xl overflow-hidden glass-card cursor-pointer group"
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={() => { window.location.href = table.url; }}
    >
      {/* Cover — dealer silhouette */}
      <div
        className="relative h-44 overflow-hidden"
        style={{ background: `linear-gradient(160deg, ${table.coverStart}, ${table.coverEnd})` }}
      >
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'repeating-linear-gradient(-45deg,transparent,transparent 6px,rgba(255,255,255,0.08) 6px,rgba(255,255,255,0.08) 7px)',
          }}
        />
        {/* Dealer silhouette (CSS art) */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
          {/* Head */}
          <div className="w-10 h-10 rounded-full bg-white/10 mb-1" />
          {/* Shoulders */}
          <div className="w-20 h-14 rounded-t-[50%] bg-white/8" />
        </div>
        {/* Live badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur-sm">
          <span className="live-dot" />
          <span className="text-[10px] text-white font-sans font-semibold tracking-widest">LIVE</span>
        </div>
        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-casino-surface to-transparent" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-serif font-bold text-gold text-base leading-tight">{table.name}</h3>
        <p className="text-[#7A6A5A] text-[10px] tracking-[0.18em] uppercase mt-0.5 font-sans">{table.nameEn}</p>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 text-[#7A6A5A]" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span className="text-[11px] text-[#D4C5A9]/60 font-sans font-tabular">{table.players} 人在場</span>
          </div>
          <span className="text-[11px] text-[#D4C5A9]/60 font-sans">
            最低 <span className="text-gold/70 font-number font-medium">${table.minBet}</span>
          </span>
        </div>

        <button className="mt-3 w-full py-2 rounded-xl btn-play text-xs font-sans font-medium tracking-widest uppercase">
          加入桌台
        </button>
      </div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.45)' }}
      />
    </motion.article>
  );
}

export default function LiveSection() {
  const stripRef = useRef<HTMLDivElement>(null);

  return (
    <section className="py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          className="flex items-end justify-between mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <p className="section-label mb-2">LIVE CASINO</p>
            <h2 className="font-serif font-bold text-4xl md:text-5xl text-gold-gradient leading-tight">
              真人荷官
            </h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[#7A6A5A] text-sm font-sans">
            <span className="text-[10px] tracking-widest uppercase">向右滑動</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </motion.div>
      </div>

      {/* Horizontal scroll strip — bleeds to edge */}
      <div className="relative">
        {/* Right fade gradient */}
        <div className="absolute right-0 top-0 bottom-4 w-32 z-10 pointer-events-none"
          style={{ background: 'linear-gradient(to left, #0D0D0D 0%, transparent 100%)' }} />

        <div
          ref={stripRef}
          className="scroll-strip flex gap-5 px-6 pb-4"
          style={{ maxWidth: '100vw' }}
        >
          <div className="shrink-0 w-px" /> {/* left breathing room */}
          {LIVE_TABLES.map((table, i) => (
            <LiveCard key={table.id} table={table} index={i} />
          ))}
          <div className="shrink-0 w-24" /> {/* trailing space before fade */}
        </div>
      </div>
    </section>
  );
}
