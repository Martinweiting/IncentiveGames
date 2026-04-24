import { motion } from 'framer-motion'
import { RACERS } from '../data/racers'
import RacerCard from './RacerCard'

interface Props {
  balance: number
  selectedRacerId: number | null
  betAmount: number
  odds: number[]
  onSelectRacer: (id: number) => void
  onBetChange: (amount: number) => void
  onStartRace: () => void
}

const QUICK_BETS = [500, 1000, 2000, 5000]

export default function Lobby({
  balance,
  selectedRacerId,
  betAmount,
  odds,
  onSelectRacer,
  onBetChange,
  onStartRace,
}: Props) {
  const selected = RACERS.find(r => r.id === selectedRacerId)
  const selectedOdds = selectedRacerId != null ? odds[selectedRacerId - 1] : null
  const potentialWin = selected && selectedOdds ? Math.round(betAmount * (selectedOdds - 1)) : 0
  const canRace = selectedRacerId != null && betAmount >= 100 && betAmount <= balance

  function clampBet(raw: number) {
    return Math.max(100, Math.min(balance, Math.round(raw / 100) * 100 || 100))
  }

  return (
    <div className="min-h-screen bg-[#0a1628] px-4 py-8">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-bebas text-6xl md:text-7xl text-[#d4af37] tracking-[0.15em] neon-title">
            🏇 夜間賽馬場
          </h1>
          <p className="text-gray-500 tracking-[0.4em] text-xs mt-2 uppercase">
            Night Race Championship
          </p>
          <div className="mt-5 inline-flex items-center gap-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full px-6 py-2">
            <span className="text-lg">💰</span>
            <span className="text-[#d4af37] font-bold text-lg">
              {balance.toLocaleString()}
            </span>
            <span className="text-gray-500 text-sm">金幣</span>
          </div>
        </motion.div>

        {/* ── Racer grid ── */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {RACERS.map((racer, i) => (
            <RacerCard
              key={racer.id}
              racer={racer}
              selected={selectedRacerId === racer.id}
              odds={odds[i]}
              onClick={() => onSelectRacer(racer.id)}
            />
          ))}
        </motion.div>

        {/* ── Bet panel ── */}
        <motion.div
          className="bg-[#0f2040] border border-[#d4af37]/25 rounded-3xl p-6 max-w-lg mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="font-bebas text-2xl text-[#d4af37] tracking-widest text-center mb-5">
            下 注 設 定
          </h2>

          {/* Amount input */}
          <div className="mb-4">
            <label className="text-gray-500 text-xs tracking-wider block mb-2">下注金額</label>
            <input
              type="number"
              value={betAmount}
              onChange={e => onBetChange(clampBet(Number(e.target.value)))}
              className="w-full bg-black/40 border border-[#d4af37]/25 rounded-xl px-4 py-3 text-white text-center text-2xl font-bold focus:outline-none focus:border-[#d4af37]/60 transition-colors"
              min={100}
              max={balance}
              step={100}
            />
          </div>

          {/* Quick-bet buttons */}
          <div className="grid grid-cols-4 gap-2 mb-5">
            {QUICK_BETS.map(amount => (
              <button
                key={amount}
                onClick={() => onBetChange(clampBet(amount))}
                disabled={amount > balance}
                className="py-1.5 rounded-lg text-xs font-medium border transition-all disabled:opacity-30 disabled:cursor-not-allowed border-white/10 bg-white/5 text-gray-400 hover:border-[#d4af37]/40 hover:text-[#d4af37] hover:bg-[#d4af37]/5"
              >
                {amount >= 1000 ? `${amount / 1000}K` : amount}
              </button>
            ))}
          </div>

          {/* MAX button */}
          <button
            onClick={() => onBetChange(balance)}
            className="w-full mb-5 py-1.5 rounded-lg text-xs border border-red-500/25 bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-all"
          >
            全押 (MAX)
          </button>

          {/* Potential win */}
          <div className="bg-black/30 rounded-xl px-4 py-3 mb-5 flex justify-between items-center text-sm">
            <span className="text-gray-500">選擇角色</span>
            <span className={selected ? 'font-bold' : 'text-gray-600'} style={{ color: selected?.color }}>
              {selected ? `${selected.emoji} ${selected.name}` : '— 未選擇 —'}
            </span>
          </div>

          {selected && selectedOdds && (
            <div className="bg-black/30 rounded-xl px-4 py-3 mb-5 flex justify-between items-center text-sm">
              <span className="text-gray-500">預計獲勝</span>
              <span className="text-green-400 font-bold text-base">
                +{potentialWin.toLocaleString()} 金幣
              </span>
            </div>
          )}

          {/* Start button */}
          <motion.button
            onClick={onStartRace}
            disabled={!canRace}
            whileHover={canRace ? { scale: 1.02 } : {}}
            whileTap={canRace ? { scale: 0.97 } : {}}
            className="w-full py-4 rounded-2xl font-bebas text-3xl tracking-[0.2em] transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed bg-gradient-to-r from-yellow-700 via-[#d4af37] to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black shadow-xl shadow-[#d4af37]/20"
          >
            {!selectedRacerId ? '選擇角色後開始' : '🏁  開始比賽'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
