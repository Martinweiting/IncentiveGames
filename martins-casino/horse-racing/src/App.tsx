import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Lobby from './components/Lobby'
import RaceTrack from './components/RaceTrack'
import { RACERS, generateOdds } from './data/racers'

type Screen = 'lobby' | 'race'

export default function App() {
  const [screen, setScreen] = useState<Screen>('lobby')
  const [balance, setBalance] = useState(10000)
  const [selectedRacerId, setSelectedRacerId] = useState<number | null>(null)
  const [betAmount, setBetAmount] = useState(1000)
  const [odds, setOdds] = useState<number[]>(() => generateOdds())

  function handleStartRace() {
    setScreen('race')
  }

  function handleRaceFinish(winnerId: number) {
    if (selectedRacerId == null) return

    const myOdds = odds[selectedRacerId - 1]
    const won = winnerId === selectedRacerId

    setBalance(prev =>
      won
        ? prev + Math.round(betAmount * (myOdds - 1))
        : Math.max(0, prev - betAmount)
    )

    // Regenerate odds for next race
    setOdds(generateOdds())
    setScreen('lobby')
  }

  // Reset selection when balance hits zero
  function handleBalanceCheck() {
    if (balance <= 0) {
      setBalance(10000)
      alert('你的金幣用完了！已重置 10,000 金幣。')
    }
  }

  return (
    <div className="min-h-screen bg-[#0a1628]">
      <AnimatePresence mode="wait">
        {screen === 'lobby' ? (
          <motion.div
            key="lobby"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.25 }}
          >
            <Lobby
              balance={balance}
              selectedRacerId={selectedRacerId}
              betAmount={Math.min(betAmount, balance)}
              odds={odds}
              onSelectRacer={id => setSelectedRacerId(id)}
              onBetChange={amount => {
                setBetAmount(amount)
                handleBalanceCheck()
              }}
              onStartRace={handleStartRace}
            />
          </motion.div>
        ) : (
          <motion.div
            key="race"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
            className="min-h-screen"
          >
            <RaceTrack
              selectedRacerId={selectedRacerId ?? RACERS[0].id}
              betAmount={betAmount}
              odds={odds}
              onFinish={handleRaceFinish}
              onBack={() => setScreen('lobby')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
