import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RACERS } from '../data/racers'
import { useRaceEngine, FINISH_LINE } from '../hooks/useRaceEngine'
import ResultModal from './ResultModal'

interface Props {
  selectedRacerId: number
  betAmount: number
  odds: number[]
  onFinish: (winnerId: number) => void
  onBack: () => void
}

// Map position (0–FINISH_LINE) to visual left% inside the track lane
function toVisualPct(pos: number): number {
  // Racers start at 2% and reach 88% at the finish line
  return (Math.min(pos, FINISH_LINE) / FINISH_LINE) * 84 + 2
}

export default function RaceTrack({ selectedRacerId, betAmount, odds, onFinish, onBack }: Props) {
  const { racerStates, phase, result, countdown, startRace, resetRace } = useRaceEngine()

  useEffect(() => {
    startRace()
    return () => resetRace()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const selectedOdds = odds[selectedRacerId - 1]
  const won = result?.winnerId === selectedRacerId
  const winAmount = Math.round(betAmount * (selectedOdds - 1))

  const orderedLanes = [...racerStates].sort((a, b) => a.id - b.id)

  return (
    <div className="min-h-screen bg-[#0a1628] flex flex-col select-none">

      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[#d4af37]/15 bg-[#080f1e]">
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-white transition-colors text-sm flex items-center gap-1"
        >
          ← 返回大廳
        </button>
        <h1 className="font-bebas text-2xl text-[#d4af37] tracking-widest">
          {phase === 'countdown' ? '準備出發' : phase === 'racing' ? '比賽進行中 🔥' : '比賽結束'}
        </h1>
        <div className="text-right">
          <div className="text-[10px] text-gray-500 tracking-wider">下注金額</div>
          <div className="text-[#d4af37] font-bold">{betAmount.toLocaleString()}</div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col p-4 gap-4 overflow-hidden">

        {/* ── Live rankings sidebar + track ── */}
        <div className="flex gap-4 flex-1 min-h-0">

          {/* Rankings */}
          <div className="w-28 flex-shrink-0 flex flex-col gap-1">
            <div className="text-[#d4af37] font-bebas text-base tracking-widest text-center mb-1">
              即時排名
            </div>
            {[...racerStates]
              .sort((a, b) => a.rank - b.rank)
              .map((state, i) => {
                const racer = RACERS.find(r => r.id === state.id)!
                const isMe = state.id === selectedRacerId
                return (
                  <motion.div
                    key={state.id}
                    layout
                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                    className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs ${
                      isMe
                        ? 'bg-[#d4af37]/15 border border-[#d4af37]/35 text-[#d4af37]'
                        : 'bg-white/[0.04] text-gray-400'
                    }`}
                  >
                    <span className="w-4 text-center font-bold text-gray-500">{i + 1}.</span>
                    <span className="text-base leading-none">{racer.emoji}</span>
                    <span
                      className="truncate font-medium"
                      style={{ color: racer.color }}
                    >
                      {racer.name.slice(0, 3)}
                    </span>
                  </motion.div>
                )
              })}
          </div>

          {/* Track */}
          <div className="flex-1 relative">
            {/* Outer container with grass texture */}
            <div
              className="h-full rounded-2xl overflow-hidden border border-[#1a4a1a] relative"
              style={{
                background: 'linear-gradient(180deg, #0d2a0d 0%, #1a3a1a 50%, #0d2a0d 100%)',
                boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 30px rgba(0,0,0,0.4)',
              }}
            >
              {/* Track stripe decoration */}
              <div className="absolute inset-0 opacity-5"
                style={{
                  backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 10px, rgba(255,255,255,0.3) 10px, rgba(255,255,255,0.3) 11px)',
                }}
              />

              {/* Starting gate marker */}
              <div
                className="absolute top-0 bottom-0 w-px bg-white/20 z-10"
                style={{ left: '2%' }}
              />

              {/* Finish line */}
              <div
                className="absolute top-0 bottom-0 w-1 z-10"
                style={{
                  left: '86%',
                  background: 'repeating-linear-gradient(0deg, #d4af37 0px, #d4af37 8px, #111 8px, #111 16px)',
                }}
              >
                <div
                  className="absolute -top-6 left-1/2 -translate-x-1/2 font-bebas text-xs text-[#d4af37] tracking-widest whitespace-nowrap"
                >
                  🏁 終點
                </div>
              </div>

              {/* Lanes */}
              {orderedLanes.map((state) => {
                const racer = RACERS.find(r => r.id === state.id)!
                const isMe = state.id === selectedRacerId
                const isRunning = phase === 'racing'
                const leftPct = toVisualPct(state.position)

                return (
                  <div
                    key={state.id}
                    className={`relative flex items-center border-b border-[#1a4a1a]/50 last:border-b-0 ${
                      isMe ? 'bg-[#d4af37]/[0.04]' : ''
                    }`}
                    style={{ height: `${100 / 6}%` }}
                  >
                    {/* Lane label */}
                    <div className="absolute left-0 top-0 bottom-0 w-2 flex items-center justify-center">
                      <div
                        className="w-1 h-full opacity-30 rounded-full"
                        style={{ background: racer.color }}
                      />
                    </div>

                    {/* Racer emoji */}
                    <div
                      className="absolute transition-none"
                      style={{
                        left: `${leftPct}%`,
                        top: '50%',
                        transform: 'translateY(-50%)',
                      }}
                    >
                      {/* Highlight ring for selected racer */}
                      {isMe && (
                        <div
                          className="absolute -inset-1 rounded-full border-2 border-[#d4af37]/70"
                          style={{ boxShadow: '0 0 10px rgba(212,175,55,0.4)' }}
                        />
                      )}
                      <div
                        className={isRunning ? 'racer-running' : 'racer-idle'}
                        style={{ fontSize: isMe ? '2rem' : '1.6rem', lineHeight: 1 }}
                      >
                        {racer.emoji}
                      </div>
                    </div>

                    {/* Racer name tag at current position */}
                    <div
                      className="absolute text-[9px] font-medium tracking-wide transition-none pointer-events-none"
                      style={{
                        left: `${leftPct + 2}%`,
                        bottom: '6px',
                        color: racer.color,
                        textShadow: '0 1px 4px rgba(0,0,0,0.8)',
                      }}
                    >
                      {racer.name.slice(0, 2)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* ── Bet info bar ── */}
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">你押的是</span>
            <span
              className="font-bold"
              style={{ color: RACERS.find(r => r.id === selectedRacerId)?.color }}
            >
              {RACERS.find(r => r.id === selectedRacerId)?.emoji}{' '}
              {RACERS.find(r => r.id === selectedRacerId)?.name}
            </span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">賠率</span>
            <span className="text-[#d4af37] font-bold">{selectedOdds.toFixed(1)}x</span>
          </div>
          <div className="w-px h-4 bg-white/10" />
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">可贏</span>
            <span className="text-green-400 font-bold">+{winAmount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Countdown overlay ── */}
      <AnimatePresence>
        {phase === 'countdown' && (
          <motion.div
            key="countdown"
            className="fixed inset-0 z-40 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              key={countdown}
              className="font-bebas text-[12rem] text-[#d4af37] leading-none"
              style={{ textShadow: '0 0 60px rgba(212,175,55,0.8)' }}
              initial={{ scale: 1.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              {countdown > 0 ? countdown : 'GO!'}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Result modal ── */}
      <AnimatePresence>
        {phase === 'finished' && result && (
          <ResultModal
            won={won}
            winAmount={winAmount}
            betAmount={betAmount}
            result={result}
            odds={odds}
            onClose={() => onFinish(result.winnerId)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
