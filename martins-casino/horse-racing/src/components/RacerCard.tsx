import { motion } from 'framer-motion'
import type { Racer } from '../data/racers'

interface Props {
  racer: Racer
  selected: boolean
  odds: number
  onClick: () => void
}

export default function RacerCard({ racer, selected, odds, onClick }: Props) {
  return (
    <motion.div
      onClick={onClick}
      whileHover={{ scale: 1.04, y: -4 }}
      whileTap={{ scale: 0.97 }}
      className={`
        relative cursor-pointer rounded-2xl p-5 border-2 transition-colors duration-200 select-none
        ${selected
          ? 'border-[#d4af37] bg-[#d4af37]/10 shadow-lg shadow-[#d4af37]/20'
          : 'border-white/10 bg-white/[0.04] hover:border-white/25 hover:bg-white/[0.07]'
        }
      `}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          layoutId="selected-glow"
          className="absolute inset-0 rounded-2xl border-2 border-[#d4af37]/60 pointer-events-none"
          style={{ boxShadow: '0 0 20px rgba(212,175,55,0.25)' }}
        />
      )}

      {/* Corner badge */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-3 right-3 bg-[#d4af37] text-black text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider"
        >
          SELECTED
        </motion.div>
      )}

      <div className="text-center">
        {/* Emoji avatar */}
        <div className="text-5xl mb-3 leading-none">{racer.emoji}</div>

        {/* Name */}
        <h3
          className="font-bebas text-xl tracking-wide leading-tight"
          style={{ color: racer.color }}
        >
          {racer.name}
        </h3>
        <p className="text-[10px] tracking-widest text-gray-500 mb-2">{racer.nameEn}</p>

        {/* Description */}
        <p className="text-xs text-gray-400 leading-relaxed mb-4 min-h-[3rem]">
          {racer.description}
        </p>

        {/* Odds chip */}
        <div
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 border"
          style={{
            background: `${racer.color}18`,
            borderColor: `${racer.color}40`,
          }}
        >
          <span className="text-sm font-bold" style={{ color: racer.color }}>
            {odds.toFixed(1)}x
          </span>
          <span className="text-[11px] text-gray-500">賠率</span>
        </div>
      </div>
    </motion.div>
  )
}
