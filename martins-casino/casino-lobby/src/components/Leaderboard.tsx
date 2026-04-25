import { motion } from 'framer-motion';
import { LEADERBOARD } from '../data/games';

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

function LeaderRow({ entry, index }: { entry: typeof LEADERBOARD[0]; index: number }) {
  const isFirst = entry.rank === 1;

  return (
    <motion.div
      className={`relative flex items-center gap-5 px-6 py-4 rounded-xl transition-colors ${
        isFirst
          ? 'bg-gradient-to-r from-gold/10 via-gold/5 to-transparent border border-gold/25'
          : 'glass-card hover:bg-white/[0.035]'
      }`}
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-30px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Rank */}
      <div className="w-12 shrink-0 flex items-center justify-center">
        {index < 3 ? (
          <span className="text-2xl">{RANK_MEDALS[index]}</span>
        ) : (
          <span
            className={`font-number font-bold text-2xl font-tabular ${
              isFirst ? 'text-gold' : 'text-[#7A6A5A]'
            }`}
          >
            {entry.rank}
          </span>
        )}
      </div>

      {/* Avatar */}
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border ${
          isFirst
            ? 'bg-gold/15 border-gold/40'
            : 'bg-white/5 border-white/10'
        }`}
      >
        <span className={`font-sans font-semibold text-sm ${isFirst ? 'text-gold' : 'text-[#D4C5A9]/60'}`}>
          {entry.name.charAt(0).toUpperCase()}
        </span>
      </div>

      {/* Name */}
      <span className={`flex-1 font-sans text-sm tracking-wider ${isFirst ? 'text-gold' : 'text-[#D4C5A9]/70'}`}>
        {entry.name}
      </span>

      {/* Amount */}
      <div className="text-right shrink-0">
        <span
          className={`font-number font-bold text-lg font-tabular ${
            isFirst ? 'text-gold' : 'text-[#D4C5A9]/80'
          }`}
        >
          ${entry.amount.toLocaleString()}
        </span>
      </div>

      {/* Gold glow for #1 */}
      {isFirst && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{ boxShadow: '0 0 30px rgba(201,168,76,0.08), inset 0 1px 0 rgba(201,168,76,0.15)' }}
        />
      )}
    </motion.div>
  );
}

export default function Leaderboard() {
  return (
    <section id="leaderboard" className="max-w-7xl mx-auto px-6 py-24">
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="section-label mb-2">THIS WEEK</p>
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-gold-gradient leading-tight">
            本週贏家
          </h2>
          <div className="gold-line mt-8 max-w-xs mx-auto" />
        </motion.div>

        <div className="flex flex-col gap-3">
          {LEADERBOARD.map((entry, i) => (
            <LeaderRow key={entry.rank} entry={entry} index={i} />
          ))}
        </div>

        <motion.p
          className="text-center text-[#7A6A5A] text-xs font-sans tracking-widest mt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          每週一 00:00 重置 · 排行依本週獲利計算
        </motion.p>
      </div>
    </section>
  );
}
