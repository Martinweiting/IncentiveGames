import { useState, useRef, useCallback, useEffect } from 'react'
import { RACERS } from '../data/racers'

export interface RacerState {
  id: number
  position: number  // 0 → FINISH_LINE
  speed: number
  rank: number
  finished: boolean
}

export type RacePhase = 'idle' | 'countdown' | 'racing' | 'finished'

export interface RaceResult {
  winnerId: number
  rankings: number[]  // racer ids ordered 1st→6th
}

export const FINISH_LINE = 100

function buildInitial(): RacerState[] {
  return RACERS.map(r => ({
    id: r.id,
    position: 0,
    speed: r.baseSpeed,
    rank: 0,
    finished: false,
  }))
}

export function useRaceEngine() {
  const [racerStates, setRacerStates] = useState<RacerState[]>(buildInitial)
  const [phase, setPhase] = useState<RacePhase>('idle')
  const [result, setResult] = useState<RaceResult | null>(null)
  const [countdown, setCountdown] = useState(3)

  const rafRef = useRef<number | null>(null)
  const statesRef = useRef<RacerState[]>(buildInitial())
  const finishOrderRef = useRef<number[]>([])
  const doneRef = useRef(false)

  const stopLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }, [])

  const runRaceLoop = useCallback(() => {
    let lastTime = performance.now()

    const tick = (now: number) => {
      if (doneRef.current) return

      const rawDelta = now - lastTime
      lastTime = now
      // Cap delta so a tab-focus lag doesn't teleport racers
      const delta = Math.min(rawDelta / 16.67, 3)

      const next = statesRef.current.map(state => {
        if (state.finished) return state

        const racer = RACERS.find(r => r.id === state.id)!
        // ±30% jitter on baseSpeed, updated each frame
        const jitter = racer.baseSpeed * (Math.random() - 0.5) * 0.6
        const newSpeed = Math.max(0.4, racer.baseSpeed + jitter)
        // Scale factor: makes a typical race last ~8–14 s at 60fps
        const newPos = state.position + newSpeed * delta * 0.14

        const crossed = newPos >= FINISH_LINE
        if (crossed && !finishOrderRef.current.includes(state.id)) {
          finishOrderRef.current = [...finishOrderRef.current, state.id]
        }

        return {
          ...state,
          position: Math.min(newPos, FINISH_LINE),
          speed: newSpeed,
          finished: crossed,
        }
      })

      // Live rank by position descending
      const sorted = [...next].sort((a, b) => b.position - a.position)
      const ranked = next.map(s => ({
        ...s,
        rank: sorted.findIndex(ss => ss.id === s.id) + 1,
      }))

      statesRef.current = ranked
      setRacerStates([...ranked])

      // Race ends when the first racer crosses the finish line
      if (finishOrderRef.current.length >= 1 && !doneRef.current) {
        doneRef.current = true
        stopLoop()

        // Fill remaining order by current position
        const remaining = ranked
          .filter(s => !finishOrderRef.current.includes(s.id))
          .sort((a, b) => b.position - a.position)
          .map(s => s.id)

        const fullRankings = [...finishOrderRef.current, ...remaining]

        // Brief pause so the winner visibly crosses the line
        setTimeout(() => {
          setPhase('finished')
          setResult({ winnerId: fullRankings[0], rankings: fullRankings })
        }, 400)
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
  }, [stopLoop])

  const startRace = useCallback(() => {
    stopLoop()
    finishOrderRef.current = []
    doneRef.current = false
    const initial = buildInitial()
    statesRef.current = initial
    setRacerStates(initial)
    setResult(null)
    setCountdown(3)
    setPhase('countdown')

    let count = 3
    const interval = setInterval(() => {
      count -= 1
      setCountdown(count)
      if (count <= 0) {
        clearInterval(interval)
        setPhase('racing')
        runRaceLoop()
      }
    }, 1000)
  }, [stopLoop, runRaceLoop])

  const resetRace = useCallback(() => {
    stopLoop()
    doneRef.current = true
    finishOrderRef.current = []
    setPhase('idle')
    setResult(null)
    setCountdown(3)
    const initial = buildInitial()
    statesRef.current = initial
    setRacerStates(initial)
  }, [stopLoop])

  useEffect(() => () => stopLoop(), [stopLoop])

  return { racerStates, phase, result, countdown, startRace, resetRace }
}
