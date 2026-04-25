import { motion } from 'framer-motion';
import type { Game, GameBadge } from '../data/games';

const BADGE_CONFIG: Record<GameBadge, { label: string; bg: string; text: string }> = {
  hot:  { label: 'HOT',  bg: 'rgba(201,168,76,0.18)',  text: '#C9A84C' },
  new:  { label: 'NEW',  bg: 'rgba(59,130,246,0.18)',  text: '#60a5fa' },
  live: { label: 'LIVE', bg: 'rgba(239,68,68,0.18)',   text: '#f87171' },
};

function Badge({ type }: { type: GameBadge }) {
  const cfg = BADGE_CONFIG[type];
  return (
    <div
      className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold tracking-widest"
      style={{ background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.text}33` }}
    >
      {type === 'live' && <span className="live-dot !w-1.5 !h-1.5" />}
      {cfg.label}
    </div>
  );
}

interface Props {
  game: Game;
  index: number;
}

export default function GameCard({ game, index }: Props) {
  return (
    <motion.article
      className="relative rounded-2xl overflow-hidden glass-card cursor-pointer group"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, scale: 1.02 }}
      onClick={() => { window.location.href = game.url; }}
    >
      {/* Cover */}
      <div
        className="relative h-40 overflow-hidden"
        style={{ background: `linear-gradient(145deg, ${game.coverStart}, ${game.coverEnd})` }}
      >
        {/* Subtle grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'repeating-linear-gradient(45deg,transparent,transparent 10px,rgba(255,255,255,0.06) 10px,rgba(255,255,255,0.06) 11px)',
          }}
        />
        {/* Game icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-25 select-none">{game.icon}</span>
        </div>
        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent" />
        {/* Badge */}
        {game.badge && <Badge type={game.badge} />}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col">
        <h3 className="font-serif font-bold text-gold text-lg leading-tight">{game.name}</h3>
        <p className="text-[#7A6A5A] text-[10px] tracking-[0.18em] uppercase mt-0.5 font-sans">{game.type}</p>

        <div className="flex items-center gap-3 mt-2">
          {game.rtp !== undefined && (
            <span className="text-[11px] text-[#D4C5A9]/50 font-sans">
              RTP <span className="text-gold/70 font-number font-medium">{game.rtp}%</span>
            </span>
          )}
          <span className="text-[11px] text-[#D4C5A9]/50 font-sans">
            最低 <span className="text-gold/70 font-number font-medium">${game.minBet}</span>
          </span>
        </div>

        <button className="mt-4 w-full py-2.5 rounded-xl btn-play text-sm font-sans font-medium tracking-widest uppercase">
          立即遊玩
        </button>
      </div>

      {/* Hover gold glow border */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ boxShadow: 'inset 0 0 0 1px rgba(201,168,76,0.5), 0 8px 40px rgba(201,168,76,0.12)' }}
      />
    </motion.article>
  );
}
