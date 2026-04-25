export type GameCategory = 'all' | 'slots' | 'tables' | 'live' | 'jackpots';
export type GameRibbon = 'hot' | 'new' | 'live';
export type CoverTone = 'gold' | 'crimson' | 'emerald' | 'violet' | 'azure' | 'copper';

export interface HeroStat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
}

export interface GameCategoryOption {
  id: GameCategory;
  label: string;
}

export interface GameItem {
  id: string;
  name: string;
  category: Exclude<GameCategory, 'all'>;
  badge: string;
  ribbon?: GameRibbon;
  rtp?: string;
  tone: CoverTone;
  href: string;
}

export interface LiveTable {
  id: string;
  name: string;
  players: number;
  minBet: number;
  tone: CoverTone;
}

export interface PromotionItem {
  id: string;
  title: string;
  description: string;
  highlight: string;
  endsAt: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  prize: number;
}

export const navItems: Array<{ label: string; route: '/' | '/games' | '/promotions' | '/leaderboard' }> = [
  { label: '首頁', route: '/' },
  { label: '遊戲', route: '/games' },
  { label: '優惠', route: '/promotions' },
  { label: '排行榜', route: '/leaderboard' },
];

export const heroStats: HeroStat[] = [
  { label: '在線桌數', value: 1842, suffix: '+' },
  { label: '今夜獎池', value: 680000, prefix: '$' },
  { label: 'VIP 包廂', value: 24 },
];

export const gameCategories: GameCategoryOption[] = [
  { id: 'all', label: '全部' },
  { id: 'slots', label: '機台' },
  { id: 'tables', label: '桌上遊戲' },
  { id: 'live', label: '真人廳' },
  { id: 'jackpots', label: '高風險' },
];

export const games: GameItem[] = [
  { id: 'royal-77', name: 'Royal 77 Reels', category: 'slots', badge: 'Slots', ribbon: 'hot', rtp: '97.1%', tone: 'gold', href: '../slots/' },
  { id: 'velvet-fortune', name: 'Velvet Fortune', category: 'slots', badge: 'Arcade', ribbon: 'new', rtp: '96.8%', tone: 'crimson', href: '../coin-pusher/' },
  { id: 'imperial-baccarat', name: 'Imperial Baccarat', category: 'tables', badge: 'Baccarat', ribbon: 'live', tone: 'emerald', href: '../baccarat/' },
  { id: 'monte-roulette', name: 'Monte Roulette', category: 'tables', badge: 'Roulette', tone: 'violet', href: '../roulette/' },
  { id: 'crown-blackjack', name: 'Crown Blackjack', category: 'tables', badge: 'Blackjack', tone: 'azure', href: '../blackjack/' },
  { id: 'private-salon', name: 'Private Salon Live', category: 'live', badge: 'Live Room', ribbon: 'live', tone: 'copper', href: '../dragon-gate/' },
  { id: 'obsidian-jackpot', name: 'Obsidian Jackpot', category: 'jackpots', badge: 'Jackpot', ribbon: 'hot', rtp: '98.2%', tone: 'gold', href: '../slots/' },
  { id: 'ruby-vault', name: 'Ruby Vault Spins', category: 'jackpots', badge: 'Crash', ribbon: 'new', rtp: '96.5%', tone: 'crimson', href: '../crash/' },
  { id: 'cave-expedition', name: 'Cave Expedition', category: 'jackpots', badge: 'Cave Run', ribbon: 'new', rtp: 'High Risk', tone: 'azure', href: '../cave-expedition/' },
];

export const liveTables: LiveTable[] = [
  { id: 'live-baccarat', name: 'Salon Baccarat A', players: 38, minBet: 100, tone: 'crimson' },
  { id: 'live-roulette', name: 'Roulette Privee', players: 16, minBet: 250, tone: 'gold' },
  { id: 'live-blackjack', name: 'Noir Blackjack', players: 22, minBet: 150, tone: 'emerald' },
  { id: 'live-dragontiger', name: 'Dragon Tiger Club', players: 31, minBet: 80, tone: 'azure' },
  { id: 'live-sicbo', name: 'Crimson Sic Bo', players: 27, minBet: 60, tone: 'violet' },
];

const now = Date.now();

export const promotions: PromotionItem[] = [
  {
    id: 'welcome-salon',
    title: '迎新夜場加碼',
    description: '今晚首筆入金享專屬返利與高風險房入場券，適合想連開幾局的人。',
    highlight: '加碼 28% 籌碼回饋',
    endsAt: now + 19 * 60 * 60 * 1000 + 12 * 60 * 1000 + 44 * 1000,
  },
  {
    id: 'weekend-rush',
    title: '週末真人桌熱區',
    description: '指定真人桌連續遊玩即可累積速度獎勵，越晚進場波動越刺激。',
    highlight: '今晚 22:00 熱桌開放',
    endsAt: now + 8 * 60 * 60 * 1000 + 7 * 60 * 1000 + 6 * 1000,
  },
];

export const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: 'A***n', prize: 24850 },
  { rank: 2, name: 'L***a', prize: 18120 },
  { rank: 3, name: 'K***e', prize: 15440 },
  { rank: 4, name: 'M***o', prize: 12880 },
  { rank: 5, name: 'R***s', prize: 11130 },
];
