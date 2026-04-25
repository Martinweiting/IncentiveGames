export type GameCategory = 'featured' | 'slots' | 'table' | 'live' | 'horse-racing';
export type GameBadge = 'hot' | 'new' | 'live';

export interface Game {
  id: string;
  name: string;
  nameEn: string;
  categories: GameCategory[];
  badge?: GameBadge;
  rtp?: number;
  minBet: number;
  coverStart: string;
  coverEnd: string;
  icon: string;
  url: string;
  type: string;
}

export interface LiveTable {
  id: string;
  name: string;
  nameEn: string;
  players: number;
  minBet: number;
  coverStart: string;
  coverEnd: string;
  url: string;
}

export interface Promotion {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  targetDate: Date;
  badge: string;
  badgeColor: string;
}

export const CATEGORIES: { id: GameCategory; label: string }[] = [
  { id: 'featured', label: '精選推薦' },
  { id: 'slots',    label: '老虎機' },
  { id: 'table',    label: '桌台遊戲' },
  { id: 'live',     label: '真人荷官' },
  { id: 'horse-racing', label: '賽馬競技' },
];

export const GAMES: Game[] = [
  {
    id: 'baccarat',
    name: '百家樂',
    nameEn: 'Baccarat',
    categories: ['featured', 'table'],
    badge: 'hot',
    minBet: 100,
    coverStart: '#022c22',
    coverEnd: '#065f46',
    icon: '🃏',
    url: '../baccarat/',
    type: '桌台遊戲',
  },
  {
    id: 'blackjack',
    name: '二十一點',
    nameEn: 'Blackjack',
    categories: ['featured', 'table'],
    badge: 'hot',
    minBet: 50,
    coverStart: '#0c1445',
    coverEnd: '#1e3a8a',
    icon: '♠️',
    url: '../blackjack/',
    type: '桌台遊戲',
  },
  {
    id: 'roulette',
    name: '輪盤',
    nameEn: 'Roulette',
    categories: ['featured', 'table'],
    badge: 'hot',
    minBet: 10,
    coverStart: '#3b0000',
    coverEnd: '#7f1d1d',
    icon: '⚫',
    url: '../roulette/',
    type: '桌台遊戲',
  },
  {
    id: 'slots',
    name: '黃金老虎機',
    nameEn: 'Gold Slots',
    categories: ['featured', 'slots'],
    badge: 'new',
    rtp: 96.5,
    minBet: 1,
    coverStart: '#1c0f04',
    coverEnd: '#78350f',
    icon: '🎰',
    url: '../slots/',
    type: '老虎機',
  },
  {
    id: 'dragon-gate',
    name: '龍門',
    nameEn: 'Dragon Gate',
    categories: ['featured', 'table'],
    badge: 'hot',
    minBet: 50,
    coverStart: '#1e0431',
    coverEnd: '#4c1d95',
    icon: '🐉',
    url: '../dragon-gate/',
    type: '桌台遊戲',
  },
  {
    id: 'coin-pusher',
    name: '推幣機',
    nameEn: 'Coin Pusher',
    categories: ['slots'],
    badge: 'new',
    rtp: 94.0,
    minBet: 1,
    coverStart: '#0c1a30',
    coverEnd: '#1e40af',
    icon: '🪙',
    url: '../coin-pusher/',
    type: '機台遊戲',
  },
  {
    id: 'horse-racing',
    name: 'Martin 大賽馬',
    nameEn: "Martin's Derby",
    categories: ['featured', 'horse-racing'],
    badge: 'new',
    minBet: 10,
    coverStart: '#0d1a0d',
    coverEnd: '#14532d',
    icon: '🐎',
    url: '../horse-racing/',
    type: '競技賽馬',
  },
  {
    id: 'live-baccarat',
    name: '真人百家樂',
    nameEn: 'Live Baccarat',
    categories: ['live'],
    badge: 'live',
    minBet: 100,
    coverStart: '#022c22',
    coverEnd: '#064e3b',
    icon: '🎭',
    url: '../baccarat/',
    type: '真人荷官',
  },
  {
    id: 'live-roulette',
    name: '真人輪盤',
    nameEn: 'Live Roulette',
    categories: ['live'],
    badge: 'live',
    minBet: 10,
    coverStart: '#3b0000',
    coverEnd: '#7f1d1d',
    icon: '🎯',
    url: '../roulette/',
    type: '真人荷官',
  },
  {
    id: 'live-blackjack',
    name: '真人二十一點',
    nameEn: 'Live Blackjack',
    categories: ['live'],
    badge: 'live',
    minBet: 50,
    coverStart: '#0c1445',
    coverEnd: '#1e3a8a',
    icon: '♠️',
    url: '../blackjack/',
    type: '真人荷官',
  },
];

export const LIVE_TABLES: LiveTable[] = [
  {
    id: 'lt-baccarat-1',
    name: '頂級百家樂 1',
    nameEn: 'Premium Baccarat 1',
    players: 47,
    minBet: 500,
    coverStart: '#022c22',
    coverEnd: '#065f46',
    url: '../baccarat/',
  },
  {
    id: 'lt-baccarat-2',
    name: '頂級百家樂 2',
    nameEn: 'Premium Baccarat 2',
    players: 31,
    minBet: 200,
    coverStart: '#022c22',
    coverEnd: '#0d503c',
    url: '../baccarat/',
  },
  {
    id: 'lt-roulette-1',
    name: '極速輪盤',
    nameEn: 'Speed Roulette',
    players: 128,
    minBet: 10,
    coverStart: '#3b0000',
    coverEnd: '#7f1d1d',
    url: '../roulette/',
  },
  {
    id: 'lt-blackjack-1',
    name: 'VIP 二十一點',
    nameEn: 'VIP Blackjack',
    players: 6,
    minBet: 1000,
    coverStart: '#0c1445',
    coverEnd: '#1e3a8a',
    url: '../blackjack/',
  },
  {
    id: 'lt-dragon',
    name: '龍虎鬥',
    nameEn: 'Dragon Tiger',
    players: 89,
    minBet: 50,
    coverStart: '#1e0431',
    coverEnd: '#4c1d95',
    url: '../dragon-gate/',
  },
];

const now = new Date();
export const PROMOTIONS: Promotion[] = [
  {
    id: 'promo-welcome',
    title: '新人首存禮',
    subtitle: 'WELCOME BONUS',
    description: '首次存款即享 100% 加碼，最高獎勵 $50,000！立即開始你的頂級娛樂城之旅。',
    targetDate: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000 + 14 * 60 * 60 * 1000),
    badge: '限時優惠',
    badgeColor: '#C9A84C',
  },
  {
    id: 'promo-weekend',
    title: '週末存款加碼',
    subtitle: 'WEEKEND RELOAD',
    description: '每週六日存款享 30% 加碼，無上限！越存越多，盡情暢玩所有遊戲。',
    targetDate: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000),
    badge: '每週活動',
    badgeColor: '#7A1C2E',
  },
  {
    id: 'promo-vip',
    title: 'VIP 獨家禮遇',
    subtitle: 'VIP EXCLUSIVE',
    description: '達成 VIP 等級享專屬返水、生日禮金與 24H 專屬客服，頂級體驗從此開始。',
    targetDate: new Date(now.getTime() + 12 * 24 * 60 * 60 * 1000),
    badge: 'VIP 專屬',
    badgeColor: '#4c1d95',
  },
  {
    id: 'promo-referral',
    title: '推薦好友獎勵',
    subtitle: 'REFER A FRIEND',
    description: '成功推薦好友即享 $5,000 獎勵，好友每次存款你都能持續獲得分成！',
    targetDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
    badge: '長期活動',
    badgeColor: '#065f46',
  },
];

export const LEADERBOARD = [
  { rank: 1, name: 'M***n',  amount: 12_500_000 },
  { rank: 2, name: 'A***n',  amount: 8_200_000  },
  { rank: 3, name: 'J***s',  amount: 5_650_000  },
  { rank: 4, name: 'K***y',  amount: 3_100_000  },
  { rank: 5, name: 'R***d',  amount: 1_800_000  },
];
