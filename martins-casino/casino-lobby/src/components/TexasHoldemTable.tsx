import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useReducer, useState } from 'react';
import {
  chooseAiAction,
  createInitialGameState,
  evaluateBestHand,
  formatChips,
  getBlindIndexes,
  getCallAmount,
  getHumanPlayerIndex,
  getRaiseBounds,
  getStreetLabel,
  texasHoldemReducer,
  type Card,
  type GameState,
  type Player,
} from '../game/texasHoldem';

const SEAT_POSITIONS = [
  'left-1/2 bottom-4 w-[min(92%,24rem)] -translate-x-1/2',
  'left-3 top-[58%] w-40 -translate-y-1/2 sm:left-6 sm:w-48',
  'left-6 top-8 w-40 sm:left-12 sm:w-48',
  'right-6 top-8 w-40 sm:right-12 sm:w-48',
  'right-3 top-[58%] w-40 -translate-y-1/2 sm:right-6 sm:w-48',
] as const;

const HAND_RANKING_GUIDE = ['同花順', '鐵支', '葫蘆', '同花', '順子', '三條', '兩對', '一對', '高牌'];

function getSuitSymbol(suit: Card['suit']): string {
  if (suit === 'spades') {
    return '♠';
  }
  if (suit === 'hearts') {
    return '♥';
  }
  if (suit === 'diamonds') {
    return '♦';
  }
  return '♣';
}

function getRankLabel(rank: number): string {
  if (rank === 14) {
    return 'A';
  }
  if (rank === 13) {
    return 'K';
  }
  if (rank === 12) {
    return 'Q';
  }
  if (rank === 11) {
    return 'J';
  }
  return String(rank);
}

function getSuitTone(suit: Card['suit']): string {
  return suit === 'hearts' || suit === 'diamonds' ? 'text-rose-400' : 'text-slate-100';
}

function ChipPill({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-amber-300/30 bg-black/35 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.26em] text-amber-100/85">
      {label}
    </span>
  );
}

function PlayingCard({ card, hidden = false, compact = false }: { card?: Card; hidden?: boolean; compact?: boolean }) {
  const sizeClass = compact ? 'h-16 w-11 rounded-xl text-sm' : 'h-24 w-16 rounded-2xl text-lg';

  if (hidden || !card) {
    return (
      <div
        className={`${sizeClass} relative overflow-hidden border border-sky-300/20 bg-slate-950 shadow-[0_12px_30px_rgba(1,12,18,0.5)]`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(56,189,248,0.25),transparent_35%),linear-gradient(160deg,rgba(11,23,43,0.98),rgba(12,74,110,0.85))]" />
        <div className="absolute inset-[10%] rounded-[inherit] border border-white/10" />
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_9px,rgba(255,255,255,0.06)_9px,rgba(255,255,255,0.06)_10px)]" />
      </div>
    );
  }

  return (
    <div
      className={`${sizeClass} relative flex flex-col justify-between border border-white/12 bg-[linear-gradient(180deg,rgba(249,250,251,0.98),rgba(226,232,240,0.98))] p-2 shadow-[0_12px_24px_rgba(0,0,0,0.35)]`}
    >
      <div className={`leading-none ${getSuitTone(card.suit)}`}>
        <div className="font-black">{getRankLabel(card.rank)}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>
      <div className={`self-center text-2xl ${getSuitTone(card.suit)}`}>{getSuitSymbol(card.suit)}</div>
      <div className={`rotate-180 self-end leading-none ${getSuitTone(card.suit)}`}>
        <div className="font-black">{getRankLabel(card.rank)}</div>
        <div>{getSuitSymbol(card.suit)}</div>
      </div>
    </div>
  );
}

function SeatCard({
  player,
  playerIndex,
  state,
}: {
  player: Player;
  playerIndex: number;
  state: GameState;
}) {
  const blindIndexes = getBlindIndexes(state.players, state.dealerIndex);
  const isCurrent = state.currentPlayerIndex === playerIndex && state.status === 'betting';
  const isDealer = state.dealerIndex === playerIndex;
  const isSmallBlind = blindIndexes?.smallBlindIndex === playerIndex;
  const isBigBlind = blindIndexes?.bigBlindIndex === playerIndex;
  const showCards = player.revealCards || player.isHuman;

  return (
    <motion.div
      className={`absolute ${SEAT_POSITIONS[playerIndex]}`}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0, scale: isCurrent ? 1.03 : 1 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`rounded-[26px] border px-4 py-3 shadow-[0_18px_48px_rgba(0,0,0,0.35)] backdrop-blur-xl ${
          player.isHuman
            ? 'border-amber-300/40 bg-black/45'
            : 'border-white/10 bg-black/35'
        } ${isCurrent ? 'ring-2 ring-emerald-300/50' : ''}`}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold tracking-wide text-stone-50">{player.name}</h3>
              {player.busted && <ChipPill label="OUT" />}
              {player.allIn && !player.busted && <ChipPill label="ALL-IN" />}
            </div>
            <p className="mt-1 text-xs text-stone-300/70">籌碼 {formatChips(player.chips)}</p>
          </div>
          <div className="flex flex-wrap justify-end gap-1">
            {isDealer && <ChipPill label="D" />}
            {isSmallBlind && !player.busted && <ChipPill label="SB" />}
            {isBigBlind && !player.busted && <ChipPill label="BB" />}
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          {player.holeCards.map(card => (
            <PlayingCard key={card.code} card={card} hidden={!showCards} compact />
          ))}
          {player.holeCards.length === 0 && (
            <>
              <PlayingCard hidden compact />
              <PlayingCard hidden compact />
            </>
          )}
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span
            className={`truncate text-xs ${
              player.folded ? 'text-stone-500' : 'text-stone-200/80'
            }`}
          >
            {player.folded ? '本手已棄牌' : player.lastAction}
          </span>
          {player.currentBet > 0 && (
            <span className="rounded-full border border-amber-300/25 bg-amber-300/10 px-2 py-1 text-[11px] text-amber-100">
              本輪 {formatChips(player.currentBet)}
            </span>
          )}
        </div>

        {player.bestHand && (
          <p className="mt-2 text-xs font-medium tracking-wide text-emerald-200">
            攤牌牌型: {player.bestHand.name}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function TexasHoldemTable() {
  const [state, dispatch] = useReducer(texasHoldemReducer, undefined, createInitialGameState);
  const [betTarget, setBetTarget] = useState(100);

  const humanIndex = getHumanPlayerIndex(state);
  const human = state.players[humanIndex];
  const isHumanTurn = state.status === 'betting' && state.currentPlayerIndex === humanIndex;
  const callAmount = getCallAmount(state, humanIndex);
  const raiseBounds = getRaiseBounds(state, humanIndex);
  const humanMadeHand =
    human.holeCards.length + state.communityCards.length >= 5
      ? evaluateBestHand([...human.holeCards, ...state.communityCards])
      : null;

  useEffect(() => {
    if (!raiseBounds) {
      return;
    }

    setBetTarget(current => {
      if (current >= raiseBounds.min && current <= raiseBounds.max) {
        return current;
      }
      return raiseBounds.suggested;
    });
  }, [raiseBounds?.min, raiseBounds?.max, raiseBounds?.suggested]);

  useEffect(() => {
    if (state.status !== 'betting' || state.currentPlayerIndex === null) {
      return;
    }

    const actor = state.players[state.currentPlayerIndex];
    if (actor.isHuman) {
      return;
    }

    const timer = window.setTimeout(() => {
      dispatch({
        type: 'player-action',
        playerIndex: state.currentPlayerIndex!,
        action: chooseAiAction(state, state.currentPlayerIndex!),
      });
    }, 900 + Math.random() * 700);

    return () => window.clearTimeout(timer);
  }, [state]);

  const presetTargets =
    raiseBounds === null
      ? []
      : [
          { label: '最小', value: raiseBounds.min },
          {
            label: '半池',
            value: Math.max(raiseBounds.min, Math.min(raiseBounds.max, state.currentBet + Math.round(state.pot / 2))),
          },
          {
            label: '滿池',
            value: Math.max(raiseBounds.min, Math.min(raiseBounds.max, state.currentBet + state.pot)),
          },
          { label: '全下', value: raiseBounds.max },
        ].filter((item, index, items) => items.findIndex(candidate => candidate.value === item.value) === index);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04110c] text-stone-100">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,191,36,0.14),transparent_30%),radial-gradient(circle_at_15%_20%,rgba(45,212,191,0.14),transparent_25%),radial-gradient(circle_at_85%_10%,rgba(59,130,246,0.12),transparent_30%),linear-gradient(180deg,#06150f_0%,#030806_100%)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="rounded-[32px] border border-amber-300/15 bg-black/30 px-6 py-6 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.44em] text-amber-200/65">Martin&apos;s Casino</p>
              <h1 className="mt-3 font-serif text-4xl font-black tracking-[0.08em] text-transparent sm:text-5xl">
                <span className="bg-[linear-gradient(135deg,#fef3c7_5%,#f59e0b_40%,#fcd34d_60%,#fef3c7_100%)] bg-clip-text text-transparent">
                  Texas Hold&apos;em
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-300/72 sm:text-base">
                六人桌節奏太慢，我改成五人桌快節奏對局。你要在四位 AI 之間保住籌碼，掌握盲注節奏，找到最佳的跟注、加注與全下時機。
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">手數</p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">{state.handNumber}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">盲注</p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">
                  {state.smallBlind}/{state.bigBlind}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <p className="text-[11px] uppercase tracking-[0.3em] text-stone-400">你的籌碼</p>
                <p className="mt-2 text-2xl font-semibold text-stone-50">{formatChips(human.chips)}</p>
              </div>
            </div>
          </div>
        </header>

        <main className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
          <section className="rounded-[36px] border border-emerald-400/12 bg-black/20 p-3 backdrop-blur-xl sm:p-5">
            <div className="relative min-h-[860px] overflow-hidden rounded-[34px] border border-amber-300/10 bg-[radial-gradient(circle_at_center,rgba(6,95,70,0.96)_0%,rgba(5,46,37,0.98)_48%,rgba(2,12,10,1)_100%)]">
              <div className="absolute inset-[7%] rounded-[999px] border border-amber-300/18 bg-[radial-gradient(circle_at_50%_42%,rgba(16,185,129,0.10),transparent_35%),radial-gradient(circle_at_50%_50%,rgba(5,150,105,0.14),transparent_52%)] shadow-[inset_0_0_50px_rgba(0,0,0,0.45),0_0_60px_rgba(16,185,129,0.08)]" />

              <div className="absolute left-1/2 top-[18%] z-20 w-[min(90%,30rem)] -translate-x-1/2 text-center">
                <div className="inline-flex items-center gap-3 rounded-full border border-amber-300/18 bg-black/35 px-4 py-2 text-xs uppercase tracking-[0.34em] text-amber-100/75">
                  <span>{getStreetLabel(state.street)}</span>
                  <span className="h-1 w-1 rounded-full bg-amber-100/50" />
                  <span>底池 {formatChips(state.pot)}</span>
                </div>

                <AnimatePresence mode="popLayout">
                  <motion.div
                    key={`${state.handNumber}-${state.headline}`}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="mx-auto mt-4 max-w-xl rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-stone-100/85 shadow-[0_16px_48px_rgba(0,0,0,0.35)]"
                  >
                    {state.headline}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="absolute left-1/2 top-[34%] z-20 flex -translate-x-1/2 gap-2 sm:gap-3">
                {state.communityCards.map(card => (
                  <motion.div
                    key={card.code}
                    initial={{ opacity: 0, y: -16, rotate: -3 }}
                    animate={{ opacity: 1, y: 0, rotate: 0 }}
                    transition={{ duration: 0.35 }}
                  >
                    <PlayingCard card={card} />
                  </motion.div>
                ))}
                {Array.from({ length: Math.max(0, 5 - state.communityCards.length) }).map((_, index) => (
                  <PlayingCard key={`placeholder-${index}`} hidden />
                ))}
              </div>

              {state.players.map((player, index) => (
                <SeatCard key={player.id} player={player} playerIndex={index} state={state} />
              ))}

              <div className="absolute bottom-36 left-1/2 z-20 w-[min(92%,44rem)] -translate-x-1/2 rounded-[28px] border border-white/10 bg-black/40 p-4 shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur-xl sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">行動面板</p>
                      <h2 className="mt-2 text-xl font-semibold text-stone-50">
                        {state.status === 'betting'
                          ? isHumanTurn
                            ? '輪到你行動'
                            : `等待 ${state.currentPlayerIndex === null ? '牌局結算' : state.players[state.currentPlayerIndex].name} 決策`
                          : state.status === 'game-over'
                            ? '牌局結束'
                            : '本手已結束'}
                      </h2>
                    </div>
                    <div className="rounded-full border border-amber-300/18 bg-amber-300/10 px-4 py-2 text-xs tracking-[0.24em] text-amber-100/82">
                      目前需跟注 {formatChips(callAmount)}
                    </div>
                  </div>

                  {state.status === 'betting' && (
                    <>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <button
                          type="button"
                          disabled={!isHumanTurn}
                          onClick={() => dispatch({ type: 'player-action', playerIndex: humanIndex, action: { type: 'fold' } })}
                          className="rounded-2xl border border-rose-400/35 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          棄牌
                        </button>
                        <button
                          type="button"
                          disabled={!isHumanTurn}
                          onClick={() => dispatch({ type: 'player-action', playerIndex: humanIndex, action: { type: 'call' } })}
                          className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {callAmount === 0 ? '過牌' : `跟注 ${formatChips(callAmount)}`}
                        </button>
                        <button
                          type="button"
                          disabled={!isHumanTurn || raiseBounds === null}
                          onClick={() =>
                            dispatch({
                              type: 'player-action',
                              playerIndex: humanIndex,
                              action: { type: 'raise', target: betTarget },
                            })
                          }
                          className="rounded-2xl border border-amber-300/35 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-100 transition hover:bg-amber-400/20 disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {state.currentBet === 0 ? `下注 ${formatChips(betTarget)}` : `加注到 ${formatChips(betTarget)}`}
                        </button>
                      </div>

                      {raiseBounds && (
                        <div className="rounded-[24px] border border-white/10 bg-white/5 p-4">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-sm text-stone-200/82">
                              調整下注目標: <span className="font-semibold text-stone-50">{formatChips(betTarget)}</span>
                            </p>
                            <p className="text-xs text-stone-400">
                              範圍 {formatChips(raiseBounds.min)} - {formatChips(raiseBounds.max)}
                            </p>
                          </div>
                          <input
                            type="range"
                            min={raiseBounds.min}
                            max={raiseBounds.max}
                            value={betTarget}
                            step={5}
                            onChange={event => setBetTarget(Number(event.target.value))}
                            className="mt-4 h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-300"
                          />
                          <div className="mt-4 flex flex-wrap gap-2">
                            {presetTargets.map(preset => (
                              <button
                                key={`${preset.label}-${preset.value}`}
                                type="button"
                                disabled={!isHumanTurn}
                                onClick={() => setBetTarget(preset.value)}
                                className="rounded-full border border-white/10 bg-black/25 px-3 py-1.5 text-xs text-stone-100/82 transition hover:border-amber-300/30 hover:text-amber-100 disabled:cursor-not-allowed disabled:opacity-45"
                              >
                                {preset.label} {formatChips(preset.value)}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {state.status !== 'betting' && (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => dispatch({ type: state.status === 'game-over' ? 'reset-match' : 'next-hand' })}
                        className="rounded-2xl border border-emerald-300/28 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 transition hover:bg-emerald-400/18"
                      >
                        {state.status === 'game-over' ? '重新開桌' : '發下一手'}
                      </button>
                      <button
                        type="button"
                        onClick={() => dispatch({ type: 'reset-match' })}
                        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold text-stone-100 transition hover:bg-white/10"
                      >
                        重置整桌
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">你的資訊</p>
              <div className="mt-4 flex gap-3">
                {human.holeCards.map(card => (
                  <PlayingCard key={card.code} card={card} />
                ))}
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-stone-400">目前最佳成牌</p>
                  <p className="mt-2 text-lg font-semibold text-stone-50">{humanMadeHand?.name ?? '尚未成牌'}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs text-stone-400">建議思路</p>
                  <p className="mt-2 text-sm leading-6 text-stone-200/78">
                    {callAmount === 0
                      ? '沒人逼迫你投入籌碼時，可以用較小下注先試探，或直接過牌控池。'
                      : `目前要補 ${formatChips(callAmount)} 才能留在牌局，先看自己的牌力和底池大小是否匹配。`}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">攤牌結果</p>
                  <h2 className="mt-2 text-xl font-semibold text-stone-50">本手摘要</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-300">
                  {state.winners.length} 筆結果
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {state.winners.length > 0 ? (
                  state.winners.map(message => (
                    <div key={message} className="rounded-2xl border border-emerald-300/16 bg-emerald-400/8 px-4 py-3 text-sm text-emerald-100/88">
                      {message}
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-300/72">
                    這手還在進行中，等到攤牌或所有人棄牌後，這裡會顯示贏家與分彩資訊。
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">牌型表</p>
              <div className="mt-4 grid gap-2">
                {HAND_RANKING_GUIDE.map(label => (
                  <div
                    key={label}
                    className="flex items-center justify-between rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-stone-200/82"
                  >
                    <span>{label}</span>
                    <span className="text-xs uppercase tracking-[0.24em] text-stone-500">Rank</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/10 bg-black/25 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.32em] text-stone-400">戰報</p>
                  <h2 className="mt-2 text-xl font-semibold text-stone-50">最近動作</h2>
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-stone-300">
                  {state.log.length} 筆
                </span>
              </div>
              <div className="mt-4 space-y-3">
                {state.log.map(entry => (
                  <div key={entry} className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3 text-sm text-stone-200/82">
                    {entry}
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </main>
      </div>
    </div>
  );
}

