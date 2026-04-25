export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Street = 'preflop' | 'flop' | 'turn' | 'river';
export type GameStatus = 'betting' | 'hand-over' | 'game-over';

export interface Card {
  suit: Suit;
  rank: number;
  code: string;
}

export interface EvaluatedHand {
  category: number;
  name: string;
  score: number[];
  cards: Card[];
}

export interface Player {
  id: string;
  name: string;
  isHuman: boolean;
  chips: number;
  holeCards: Card[];
  folded: boolean;
  allIn: boolean;
  busted: boolean;
  currentBet: number;
  totalContribution: number;
  actedThisRound: boolean;
  lastAction: string;
  revealCards: boolean;
  bestHand?: EvaluatedHand;
}

export interface GameState {
  players: Player[];
  dealerIndex: number;
  smallBlind: number;
  bigBlind: number;
  deck: Card[];
  communityCards: Card[];
  pot: number;
  currentBet: number;
  minRaise: number;
  currentPlayerIndex: number | null;
  street: Street;
  status: GameStatus;
  handNumber: number;
  log: string[];
  headline: string;
  winners: string[];
}

export interface BlindIndexes {
  smallBlindIndex: number;
  bigBlindIndex: number;
}

export type PlayerAction =
  | { type: 'fold' }
  | { type: 'call' }
  | { type: 'raise'; target: number };

export type GameAction =
  | { type: 'player-action'; playerIndex: number; action: PlayerAction }
  | { type: 'next-hand' }
  | { type: 'reset-match' };

const SMALL_BLIND = 25;
const BIG_BLIND = 50;
const STARTING_STACK = 3000;
const MAX_LOG_ENTRIES = 14;

const PLAYER_TEMPLATES = [
  { id: 'you', name: '你', isHuman: true },
  { id: 'ivy', name: 'Ivy', isHuman: false },
  { id: 'blaze', name: 'Blaze', isHuman: false },
  { id: 'nova', name: 'Nova', isHuman: false },
  { id: 'jade', name: 'Jade', isHuman: false },
] as const;

const STREET_LABEL: Record<Street, string> = {
  preflop: '翻牌前',
  flop: '翻牌圈',
  turn: '轉牌圈',
  river: '河牌圈',
};

const HAND_LABELS = [
  '高牌',
  '一對',
  '兩對',
  '三條',
  '順子',
  '同花',
  '葫蘆',
  '鐵支',
  '同花順',
] as const;

const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];

function createBasePlayers(): Player[] {
  return PLAYER_TEMPLATES.map(player => ({
    id: player.id,
    name: player.name,
    isHuman: player.isHuman,
    chips: STARTING_STACK,
    holeCards: [],
    folded: false,
    allIn: false,
    busted: false,
    currentBet: 0,
    totalContribution: 0,
    actedThisRound: false,
    lastAction: '等待中',
    revealCards: player.isHuman,
  }));
}

function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 2; rank <= 14; rank += 1) {
      deck.push({
        suit,
        rank,
        code: `${suit[0]}${rank}`,
      });
    }
  }
  return deck;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function addLog(state: GameState, message: string): GameState {
  return {
    ...state,
    log: [message, ...state.log].slice(0, MAX_LOG_ENTRIES),
  };
}

function cloneState(state: GameState): GameState {
  return {
    ...state,
    players: state.players.map(player => ({
      ...player,
      holeCards: [...player.holeCards],
      bestHand: player.bestHand
        ? {
            ...player.bestHand,
            score: [...player.bestHand.score],
            cards: [...player.bestHand.cards],
          }
        : undefined,
    })),
    deck: [...state.deck],
    communityCards: [...state.communityCards],
    log: [...state.log],
    winners: [...state.winners],
  };
}

function dealCard(deck: Card[]): Card {
  const card = deck.shift();
  if (!card) {
    throw new Error('牌堆已空');
  }
  return card;
}

function getNextEligibleIndex(players: Player[], startIndex: number): number | null {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const index = (startIndex + offset + players.length) % players.length;
    if (!players[index].busted && players[index].chips > 0) {
      return index;
    }
  }
  return null;
}

export function getBlindIndexes(players: Player[], dealerIndex: number): BlindIndexes | null {
  const smallBlindIndex = getNextEligibleIndex(players, dealerIndex);
  if (smallBlindIndex === null) {
    return null;
  }

  const bigBlindIndex = getNextEligibleIndex(players, smallBlindIndex);
  if (bigBlindIndex === null) {
    return null;
  }

  return { smallBlindIndex, bigBlindIndex };
}

function getNextActiveIndex(players: Player[], startIndex: number): number | null {
  for (let offset = 1; offset <= players.length; offset += 1) {
    const index = (startIndex + offset + players.length) % players.length;
    const player = players[index];
    if (!player.folded && !player.allIn && !player.busted && player.chips > 0) {
      return index;
    }
  }
  return null;
}

function getActivePlayers(players: Player[]): Player[] {
  return players.filter(player => !player.folded && !player.busted);
}

function getPlayersStillInTournament(players: Player[]): Player[] {
  return players.filter(player => !player.busted && player.chips > 0);
}

function postForcedBet(state: GameState, playerIndex: number, amount: number, label: string): void {
  const player = state.players[playerIndex];
  const posted = Math.min(player.chips, amount);
  player.chips -= posted;
  player.currentBet += posted;
  player.totalContribution += posted;
  player.allIn = player.chips === 0;
  player.lastAction = `${label} ${posted}`;
  state.pot += posted;
}

function drawCommunityCards(state: GameState, count: number): void {
  for (let index = 0; index < count; index += 1) {
    state.communityCards.push(dealCard(state.deck));
  }
}

function getStraightHigh(ranks: number[]): number | null {
  const uniqueDescending = [...new Set(ranks)].sort((left, right) => right - left);
  if (uniqueDescending[0] === 14) {
    uniqueDescending.push(1);
  }

  let run = 1;
  for (let index = 0; index < uniqueDescending.length - 1; index += 1) {
    if (uniqueDescending[index] - 1 === uniqueDescending[index + 1]) {
      run += 1;
      if (run >= 5) {
        return uniqueDescending[index - 3];
      }
    } else {
      run = 1;
    }
  }

  return null;
}

function compareScores(left: number[], right: number[]): number {
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    const leftValue = left[index] ?? 0;
    const rightValue = right[index] ?? 0;
    if (leftValue !== rightValue) {
      return leftValue > rightValue ? 1 : -1;
    }
  }
  return 0;
}

function evaluateFiveCardHand(cards: Card[]): EvaluatedHand {
  const ranksDescending = cards.map(card => card.rank).sort((left, right) => right - left);
  const isFlush = cards.every(card => card.suit === cards[0].suit);
  const straightHigh = getStraightHigh(ranksDescending);

  const counts = new Map<number, number>();
  for (const rank of ranksDescending) {
    counts.set(rank, (counts.get(rank) ?? 0) + 1);
  }

  const groups = [...counts.entries()].sort((left, right) => {
    if (right[1] !== left[1]) {
      return right[1] - left[1];
    }
    return right[0] - left[0];
  });

  let score: number[];
  let category: number;

  if (isFlush && straightHigh !== null) {
    category = 8;
    score = [category, straightHigh];
  } else if (groups[0][1] === 4) {
    const fourRank = groups[0][0];
    const kicker = groups[1][0];
    category = 7;
    score = [category, fourRank, kicker];
  } else if (groups[0][1] === 3 && groups[1][1] === 2) {
    category = 6;
    score = [category, groups[0][0], groups[1][0]];
  } else if (isFlush) {
    category = 5;
    score = [category, ...ranksDescending];
  } else if (straightHigh !== null) {
    category = 4;
    score = [category, straightHigh];
  } else if (groups[0][1] === 3) {
    const kickers = groups.slice(1).map(([rank]) => rank).sort((left, right) => right - left);
    category = 3;
    score = [category, groups[0][0], ...kickers];
  } else if (groups[0][1] === 2 && groups[1][1] === 2) {
    const pairRanks = [groups[0][0], groups[1][0]].sort((left, right) => right - left);
    const kicker = groups[2][0];
    category = 2;
    score = [category, pairRanks[0], pairRanks[1], kicker];
  } else if (groups[0][1] === 2) {
    const kickers = groups.slice(1).map(([rank]) => rank).sort((left, right) => right - left);
    category = 1;
    score = [category, groups[0][0], ...kickers];
  } else {
    category = 0;
    score = [category, ...ranksDescending];
  }

  return {
    category,
    name: HAND_LABELS[category],
    score,
    cards,
  };
}

function getFiveCardCombos(cards: Card[]): Card[][] {
  const combos: Card[][] = [];
  for (let a = 0; a < cards.length - 4; a += 1) {
    for (let b = a + 1; b < cards.length - 3; b += 1) {
      for (let c = b + 1; c < cards.length - 2; c += 1) {
        for (let d = c + 1; d < cards.length - 1; d += 1) {
          for (let e = d + 1; e < cards.length; e += 1) {
            combos.push([cards[a], cards[b], cards[c], cards[d], cards[e]]);
          }
        }
      }
    }
  }
  return combos;
}

export function evaluateBestHand(cards: Card[]): EvaluatedHand {
  const combos = getFiveCardCombos(cards);
  let best = evaluateFiveCardHand(combos[0]);
  for (let index = 1; index < combos.length; index += 1) {
    const current = evaluateFiveCardHand(combos[index]);
    if (compareScores(current.score, best.score) > 0) {
      best = current;
    }
  }
  return best;
}

function getHandStrengthScore(player: Player, communityCards: Card[]): number {
  if (communityCards.length === 0) {
    const [first, second] = [...player.holeCards].sort((left, right) => right.rank - left.rank);
    const pairBonus = first.rank === second.rank ? 40 + first.rank * 3.5 : 0;
    const suitedBonus = first.suit === second.suit ? 8 : 0;
    const connectorBonus = Math.max(0, 6 - Math.abs(first.rank - second.rank)) * 2;
    const highCardBonus = first.rank * 1.8 + second.rank * 1.2;
    return pairBonus + suitedBonus + connectorBonus + highCardBonus;
  }

  const evaluated = evaluateBestHand([...player.holeCards, ...communityCards]);
  const kickerValue = evaluated.score.slice(1).reduce((sum, value, index) => sum + value / (index + 1), 0);
  return evaluated.category * 50 + kickerValue;
}

function getShowdownWinners(players: Player[]): Player[] {
  const contenders = players.filter(player => !player.folded && player.bestHand);
  if (contenders.length === 0) {
    return [];
  }

  let winners = [contenders[0]];
  for (let index = 1; index < contenders.length; index += 1) {
    const player = contenders[index];
    const comparison = compareScores(player.bestHand!.score, winners[0].bestHand!.score);
    if (comparison > 0) {
      winners = [player];
    } else if (comparison === 0) {
      winners.push(player);
    }
  }
  return winners;
}

function splitPot(players: Player[], dealerIndex: number): string[] {
  const messages: string[] = [];
  const contributionLevels = [...new Set(players.map(player => player.totalContribution).filter(amount => amount > 0))].sort(
    (left, right) => left - right,
  );

  let previousLevel = 0;

  for (const level of contributionLevels) {
    const contributingPlayers = players.filter(player => player.totalContribution >= level);
    const eligibleWinners = contributingPlayers.filter(player => !player.folded && player.bestHand);
    const slice = (level - previousLevel) * contributingPlayers.length;
    previousLevel = level;

    if (slice <= 0 || eligibleWinners.length === 0) {
      continue;
    }

    const winners = getShowdownWinners(eligibleWinners);
    const share = Math.floor(slice / winners.length);
    let remainder = slice % winners.length;

    const orderedWinners = [...winners].sort((left, right) => {
      const leftIndex = players.findIndex(player => player.id === left.id);
      const rightIndex = players.findIndex(player => player.id === right.id);
      const leftDistance = (leftIndex - dealerIndex + players.length) % players.length;
      const rightDistance = (rightIndex - dealerIndex + players.length) % players.length;
      return leftDistance - rightDistance;
    });

    for (const winner of orderedWinners) {
      const bonusChip = remainder > 0 ? 1 : 0;
      winner.chips += share + bonusChip;
      remainder -= bonusChip;
    }

    const label = winners[0].bestHand?.name ?? '牌型';
    messages.push(
      winners.length === 1
        ? `${winners[0].name} 以 ${label} 贏得 ${slice} 籌碼`
        : `${winners.map(player => player.name).join('、')} 以 ${label} 平分 ${slice} 籌碼`,
    );
  }

  return messages;
}

function resetForNewStreet(players: Player[]): void {
  for (const player of players) {
    player.currentBet = 0;
    player.actedThisRound = player.folded || player.allIn || player.busted;
    player.lastAction = player.folded ? '已棄牌' : player.lastAction;
  }
}

function finishHandWithFoldWin(state: GameState): GameState {
  const winner = state.players.find(player => !player.folded && !player.busted);
  if (!winner) {
    return state;
  }

  const winnings = state.pot;
  winner.chips += winnings;
  winner.revealCards = true;
  winner.lastAction = '收下底池';

  let nextState: GameState = {
    ...state,
    status: 'hand-over' as const,
    currentPlayerIndex: null,
    headline: `${winner.name} 無須攤牌，直接拿下這手`,
    winners: [`${winner.name} 贏得 ${winnings} 籌碼`],
    pot: 0,
  };

  nextState = addLog(nextState, `${winner.name} 因其他玩家棄牌，贏得 ${winnings}`);
  return finalizeMatchState(nextState);
}

function finalizeShowdown(state: GameState): GameState {
  for (const player of state.players) {
    if (!player.folded) {
      player.revealCards = true;
      player.bestHand = evaluateBestHand([...player.holeCards, ...state.communityCards]);
    }
  }

  const messages = splitPot(state.players, state.dealerIndex);

  let nextState: GameState = {
    ...state,
    status: 'hand-over',
    currentPlayerIndex: null,
    headline: messages[0] ?? '這手牌結束',
    winners: messages,
    pot: 0,
  };

  for (const message of messages.slice().reverse()) {
    nextState = addLog(nextState, message);
  }

  return finalizeMatchState(nextState);
}

function finalizeMatchState(state: GameState): GameState {
  for (const player of state.players) {
    player.busted = player.chips <= 0;
  }

  const human = state.players.find(player => player.isHuman);
  const survivors = getPlayersStillInTournament(state.players);

  if (!human || human.chips <= 0) {
    return {
      ...state,
      status: 'game-over',
      headline: '你已經出局，重新開一桌再戰一手吧。',
    };
  }

  if (survivors.length === 1) {
    return {
      ...state,
      status: 'game-over',
      headline: `${survivors[0].name} 成為最後贏家`,
    };
  }

  return state;
}

function isBettingRoundComplete(state: GameState): boolean {
  const playersWhoCanAct = state.players.filter(player => !player.folded && !player.allIn && !player.busted);
  if (playersWhoCanAct.length === 0) {
    return true;
  }
  return playersWhoCanAct.every(player => player.actedThisRound && player.currentBet === state.currentBet);
}

function allActivePlayersAllIn(state: GameState): boolean {
  return state.players
    .filter(player => !player.folded && !player.busted)
    .every(player => player.allIn || player.chips === 0);
}

function advanceStreet(state: GameState): GameState {
  const nextState = cloneState(state);

  if (nextState.street === 'preflop') {
    nextState.street = 'flop';
    drawCommunityCards(nextState, 3);
  } else if (nextState.street === 'flop') {
    nextState.street = 'turn';
    drawCommunityCards(nextState, 1);
  } else if (nextState.street === 'turn') {
    nextState.street = 'river';
    drawCommunityCards(nextState, 1);
  } else {
    return finalizeShowdown(nextState);
  }

  nextState.currentBet = 0;
  nextState.minRaise = nextState.bigBlind;
  nextState.headline = `${STREET_LABEL[nextState.street]}開始`;
  resetForNewStreet(nextState.players);
  nextState.currentPlayerIndex = getNextActiveIndex(nextState.players, nextState.dealerIndex);
  const withLog = addLog(nextState, `${STREET_LABEL[nextState.street]}開始`);

  if (withLog.currentPlayerIndex === null || allActivePlayersAllIn(withLog)) {
    return runBoardToShowdown(withLog);
  }

  return withLog;
}

function runBoardToShowdown(state: GameState): GameState {
  let nextState = cloneState(state);

  if (nextState.street !== 'river') {
    nextState = addLog(nextState, '所有仍在牌局中的玩家已全下，直接補齊公牌');
  }

  while (nextState.communityCards.length < 5) {
    if (nextState.street === 'preflop') {
      nextState.street = 'flop';
      drawCommunityCards(nextState, 3);
    } else if (nextState.street === 'flop') {
      nextState.street = 'turn';
      drawCommunityCards(nextState, 1);
    } else {
      nextState.street = 'river';
      drawCommunityCards(nextState, 1);
    }
  }

  return finalizeShowdown(nextState);
}

function settleStateAfterAction(state: GameState, actingPlayerIndex: number): GameState {
  const playersStillInHand = getActivePlayers(state.players);
  if (playersStillInHand.length === 1) {
    return finishHandWithFoldWin(state);
  }

  if (!isBettingRoundComplete(state)) {
    const nextPlayerIndex = getNextActiveIndex(state.players, actingPlayerIndex);
    return {
      ...state,
      currentPlayerIndex: nextPlayerIndex,
    };
  }

  if (state.street === 'river') {
    return finalizeShowdown(state);
  }

  return advanceStreet(state);
}

function createRaiseTarget(state: GameState, player: Player, desiredTarget: number): number | null {
  const maximumTarget = player.currentBet + player.chips;
  const minimumTarget = state.currentBet === 0 ? Math.min(maximumTarget, state.bigBlind) : state.currentBet + state.minRaise;

  if (maximumTarget <= state.currentBet) {
    return null;
  }

  if (maximumTarget < minimumTarget) {
    return null;
  }

  return Math.max(minimumTarget, Math.min(desiredTarget, maximumTarget));
}

function applyPlayerAction(state: GameState, playerIndex: number, action: PlayerAction): GameState {
  if (state.status !== 'betting' || state.currentPlayerIndex !== playerIndex) {
    return state;
  }

  const nextState = cloneState(state);
  const player = nextState.players[playerIndex];
  const toCall = Math.max(0, nextState.currentBet - player.currentBet);

  if (action.type === 'fold') {
    player.folded = true;
    player.actedThisRound = true;
    player.lastAction = '棄牌';
    const withLog = addLog(nextState, `${player.name} 棄牌`);
    return settleStateAfterAction(withLog, playerIndex);
  }

  if (action.type === 'call') {
    const paid = Math.min(player.chips, toCall);
    player.chips -= paid;
    player.currentBet += paid;
    player.totalContribution += paid;
    player.allIn = player.chips === 0;
    player.actedThisRound = true;
    player.lastAction =
      toCall === 0 ? '過牌' : player.allIn && paid < toCall ? `全下 ${paid}` : `跟注 ${paid}`;
    nextState.pot += paid;

    const withLog = addLog(
      nextState,
      toCall === 0 ? `${player.name} 過牌` : `${player.name}${player.allIn && paid < toCall ? ' 全下' : ''}跟注 ${paid}`,
    );
    return settleStateAfterAction(withLog, playerIndex);
  }

  const raiseTarget = createRaiseTarget(nextState, player, action.target);
  if (raiseTarget === null) {
    return applyPlayerAction(nextState, playerIndex, { type: 'call' });
  }

  const previousBet = nextState.currentBet;
  const raiseSize = raiseTarget - previousBet;
  const paid = raiseTarget - player.currentBet;

  player.chips -= paid;
  player.currentBet = raiseTarget;
  player.totalContribution += paid;
  player.allIn = player.chips === 0;
  player.actedThisRound = true;
  player.lastAction = previousBet === 0 ? `下注 ${raiseTarget}` : `加注至 ${raiseTarget}`;
  nextState.pot += paid;
  nextState.currentBet = raiseTarget;
  nextState.minRaise = Math.max(nextState.bigBlind, raiseSize);

  for (let index = 0; index < nextState.players.length; index += 1) {
    if (index === playerIndex) {
      continue;
    }

    const otherPlayer = nextState.players[index];
    if (!otherPlayer.folded && !otherPlayer.allIn && !otherPlayer.busted) {
      otherPlayer.actedThisRound = false;
    }
  }

  const actionLabel = previousBet === 0 ? '下注' : '加注至';
  const withLog = addLog(
    nextState,
    `${player.name}${player.allIn ? ' 全下' : ''}${actionLabel} ${raiseTarget}`,
  );
  return settleStateAfterAction(withLog, playerIndex);
}

function startHand(state: GameState): GameState {
  const players = state.players.map(player => ({
    ...player,
    holeCards: [],
    folded: false,
    allIn: false,
    busted: player.chips <= 0,
    currentBet: 0,
    totalContribution: 0,
    actedThisRound: false,
    lastAction: player.chips <= 0 ? '已淘汰' : '等待中',
    revealCards: player.isHuman,
    bestHand: undefined,
  }));

  const survivors = getPlayersStillInTournament(players);
  if (survivors.length <= 1) {
    return {
      ...state,
      players,
      status: 'game-over',
      headline: survivors[0] ? `${survivors[0].name} 成為最後贏家` : '牌桌已經清空',
    };
  }

  const dealerIndex = getNextEligibleIndex(players, state.dealerIndex) ?? 0;
  const blindIndexes = getBlindIndexes(players, dealerIndex);
  if (!blindIndexes) {
    return {
      ...state,
      players,
      dealerIndex,
      status: 'game-over',
      headline: '牌桌人數不足，無法繼續進行',
    };
  }

  const { smallBlindIndex, bigBlindIndex } = blindIndexes;

  const nextState: GameState = {
    ...state,
    players,
    dealerIndex,
    deck: shuffle(createDeck()),
    communityCards: [],
    pot: 0,
    currentBet: BIG_BLIND,
    minRaise: BIG_BLIND,
    currentPlayerIndex: null,
    street: 'preflop',
    status: 'betting',
    handNumber: state.handNumber + 1,
    headline: '新的一手開始',
    winners: [],
  };

  for (let round = 0; round < 2; round += 1) {
    for (const player of nextState.players) {
      if (!player.busted) {
        player.holeCards.push(dealCard(nextState.deck));
      }
    }
  }

  postForcedBet(nextState, smallBlindIndex, nextState.smallBlind, '小盲');
  postForcedBet(nextState, bigBlindIndex, nextState.bigBlind, '大盲');

  nextState.players[smallBlindIndex].actedThisRound = false;
  nextState.players[bigBlindIndex].actedThisRound = false;
  nextState.currentPlayerIndex = getNextActiveIndex(nextState.players, bigBlindIndex);

  let withLog = addLog(nextState, `第 ${nextState.handNumber} 手開始，莊家在 ${nextState.players[dealerIndex].name}`);
  withLog = addLog(
    withLog,
    `${withLog.players[smallBlindIndex].name} 下小盲 ${withLog.players[smallBlindIndex].currentBet}，${withLog.players[bigBlindIndex].name} 下大盲 ${withLog.players[bigBlindIndex].currentBet}`,
  );

  if (withLog.currentPlayerIndex === null || allActivePlayersAllIn(withLog)) {
    return runBoardToShowdown(withLog);
  }

  return withLog;
}

export function createInitialGameState(): GameState {
  return startHand({
    players: createBasePlayers(),
    dealerIndex: -1,
    smallBlind: SMALL_BLIND,
    bigBlind: BIG_BLIND,
    deck: [],
    communityCards: [],
    pot: 0,
    currentBet: 0,
    minRaise: BIG_BLIND,
    currentPlayerIndex: null,
    street: 'preflop',
    status: 'betting',
    handNumber: 0,
    log: [],
    headline: '準備開局',
    winners: [],
  });
}

export function texasHoldemReducer(state: GameState, action: GameAction): GameState {
  if (action.type === 'reset-match') {
    return createInitialGameState();
  }

  if (action.type === 'next-hand') {
    if (state.status === 'betting') {
      return state;
    }
    return startHand({
      ...state,
      deck: [],
      communityCards: [],
      pot: 0,
      currentBet: 0,
      currentPlayerIndex: null,
      street: 'preflop',
      winners: [],
    });
  }

  return applyPlayerAction(state, action.playerIndex, action.action);
}

export function getHumanPlayerIndex(state: GameState): number {
  return state.players.findIndex(player => player.isHuman);
}

export function getCallAmount(state: GameState, playerIndex: number): number {
  const player = state.players[playerIndex];
  return Math.max(0, state.currentBet - player.currentBet);
}

export function getRaiseBounds(
  state: GameState,
  playerIndex: number,
): { min: number; max: number; suggested: number } | null {
  const player = state.players[playerIndex];
  const maximumTarget = player.currentBet + player.chips;
  const minimumTarget = state.currentBet === 0 ? Math.min(maximumTarget, state.bigBlind) : state.currentBet + state.minRaise;

  if (maximumTarget < minimumTarget || maximumTarget <= state.currentBet) {
    return null;
  }

  const potSizedTarget = Math.min(maximumTarget, Math.max(minimumTarget, state.pot + state.currentBet));
  return {
    min: minimumTarget,
    max: maximumTarget,
    suggested: potSizedTarget,
  };
}

export function chooseAiAction(state: GameState, playerIndex: number): PlayerAction {
  const player = state.players[playerIndex];
  const toCall = getCallAmount(state, playerIndex);
  const raiseBounds = getRaiseBounds(state, playerIndex);
  const handStrength = getHandStrengthScore(player, state.communityCards);
  const normalizedStrength =
    state.communityCards.length === 0
      ? Math.min(1, handStrength / 110)
      : Math.min(1, handStrength / 410);
  const potPressure = toCall / Math.max(state.pot + 1, state.bigBlind);
  const randomFactor = Math.random();

  if (toCall === 0) {
    if (raiseBounds && normalizedStrength > 0.62 && randomFactor > 0.32) {
      const aggression = normalizedStrength > 0.82 ? 1 : normalizedStrength > 0.72 ? 0.75 : 0.45;
      const span = raiseBounds.max - raiseBounds.min;
      return {
        type: 'raise',
        target: Math.round(raiseBounds.min + span * aggression),
      };
    }
    return { type: 'call' };
  }

  if (normalizedStrength < 0.28 && potPressure > 0.18 && randomFactor < 0.82) {
    return { type: 'fold' };
  }

  if (normalizedStrength > 0.8 && raiseBounds && randomFactor > 0.3) {
    const span = raiseBounds.max - raiseBounds.min;
    return {
      type: 'raise',
      target: Math.round(raiseBounds.min + span * Math.max(0.38, normalizedStrength - 0.2)),
    };
  }

  if (normalizedStrength + randomFactor * 0.18 >= Math.min(0.95, potPressure + 0.32)) {
    return { type: 'call' };
  }

  if (raiseBounds && player.chips <= state.bigBlind * 8 && normalizedStrength > 0.52) {
    return { type: 'raise', target: raiseBounds.max };
  }

  return { type: 'fold' };
}

export function getStreetLabel(street: Street): string {
  return STREET_LABEL[street];
}

export function formatChips(value: number): string {
  return value.toLocaleString('zh-TW');
}
