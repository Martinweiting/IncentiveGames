import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { RACERS } from '../data/racers'
import type { RaceResult } from '../hooks/useRaceEngine'

interface Props {
  won: boolean
  winAmount: number
  betAmount: number
  result: RaceResult
  odds: number[]
  onClose: () => void
}

const MEDALS = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣']

interface Particle {
  id: number
  x: number
  color: string
  delay: number
  duration: number
  size: number
}

function useConfetti(active: boolean) {
  const particles = useRef<Particle[]>([])
  if (active && particles.current.length === 0) {
    const colors = ['#d4af37', '#ff6b35', '#4ade80', '#b86bff', '#38bdf8', '#fb923c']
    particles.current = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: colors[i % colors.length],
      delay: Math.random() * 1.5,
      duration: 2 + Math.random() * 2,
      size: 6 + Math.random() * 8,
    }))
  }
  return particles.current
}

export default function ResultModal({ won, winAmount, betAmount, result, odds, onClose }: Props) {
  const particles = useConfetti(won)
  const closedRef = useRef(false)

  // Auto-close after 12 s so the game never gets stuck
  useEffect(() => {
    const t = setTimeout(() => {
      if (!closedRef.current) onClose()
    }, 12000)
    return () => clearTimeout(t)
  }, [onClose])

  function handleClose() {
    closedRef.current = true
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(6px)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Confetti */}
      {won && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <motion.div
              key={p.id}
              className="absolute rounded-sm"
              style={{
                left: `${p.x}%`,
                top: -20,
                width: p.size,
                height: p.size,
                background: p.color,
              }}
              animate={{ y: '110vh', rotate: 720, opacity: [1, 1, 0] }}
              transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}

      {/* Modal card */}
      <motion.div
        className="relative bg-[#0f2040] border-2 rounded-3xl p-8 max-w-md w-full shadow-2xl"
        style={{
          borderColor: won ? 'rgba(212,175,55,0.6)' : 'rgba(239,68,68,0.4)',
          boxShadow: won
            ? '0 0 60px rgba(212,175,55,0.15), 0 24px 60px rgba(0,0,0,0.6)'
            : '0 0 40px rgba(239,68,68,0.1), 0 24px 60px rgba(0,0,0,0.6)',
        }}
        initial={{ scale: 0.75, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.75, y: 30 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        {/* Result header */}
        <div className="text-center mb-6">
          <motion.div
            className="text-7xl mb-3 inline-block"
            animate={
              won
                ? { scale: [1, 1.4, 1, 1.2, 1], rotate: [0, -15, 15, -8, 0] }
                : { scale: [1, 0.85, 1], rotate: [0, -5, 5, 0] }
            }
            transition={{ duration: 0.7 }}
          >
            {won ? '🎉' : '😢'}
          </motion.div>

          <h2
            className="font-bebas text-5xl tracking-wider mb-1"
            style={{ color: won ? '#d4af37' : '#f87171' }}
          >
            {won ? '恭喜獲勝！' : '很遺憾…'}
          </h2>

          <AnimatePresence>
            <motion.p
              className="text-2xl font-bold mt-1"
              style={{ color: won ? '#4ade80' : '#f87171' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              {won
                ? `+${winAmount.toLocaleString()} 金幣`
                : `-${betAmount.toLocaleString()} 金幣`}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Final rankings */}
        <div className="bg-black/30 rounded-2xl p-4 mb-6">
          <h3 className="text-[#d4af37] font-bebas text-lg tracking-widest text-center mb-3">
            最 終 排 名
          </h3>
          <div className="space-y-2">
            {result.rankings.map((racerId, i) => {
              const racer = RACERS.find(r => r.id === racerId)!
              return (
                <motion.div
                  key={racerId}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.07 }}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2 ${
                    i === 0
                      ? 'bg-[#d4af37]/10 border border-[#d4af37]/30'
                      : 'bg-white/[0.04]'
                  }`}
                >
                  <span className="text-xl w-6 text-center">{MEDALS[i]}</span>
                  <span className="text-2xl">{racer.emoji}</span>
                  <span className="font-medium flex-1" style={{ color: racer.color }}>
                    {racer.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {odds[racerId - 1].toFixed(1)}x
                  </span>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* CTA */}
        <motion.button
          onClick={handleClose}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bebas text-3xl tracking-[0.2em] bg-gradient-to-r from-yellow-700 via-[#d4af37] to-yellow-500 hover:from-yellow-600 hover:to-yellow-400 text-black shadow-xl shadow-[#d4af37]/20 transition-all"
        >
          再賭一次 🎲
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
