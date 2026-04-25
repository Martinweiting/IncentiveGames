export type AppRoute = '/' | '/games' | '/avatars';
export type GameCategory = 'all' | 'casino' | 'dice' | 'cards';
export type CoverTone = 'gold' | 'violet' | 'azure';

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
  badge: string;
  status: string;
  category: Exclude<GameCategory, 'all'>;
  description: string;
  details: string[];
  href: string;
  tone: CoverTone;
  buttonLabel: string;
}

export interface SpotlightItem {
  id: string;
  name: string;
  headline: string;
  summary: string;
  stat: string;
  href: string;
  tone: CoverTone;
}

export interface AvatarOption {
  id: string;
  label: string;
  emoji: string;
  codepoint: string;
  src: string;
}

const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg';

const avatarSeed = [
  ['crown', '\u7687\u51a0\u73a9\u5bb6', '\ud83d\udc51', '1f451'],
  ['top-hat', '\u9ad8\u5e3d\u7d33\u58eb', '\ud83c\udfa9', '1f3a9'],
  ['sunglasses', '\u58a8\u93e1\u738b\u724c', '\ud83d\ude0e', '1f60e'],
  ['cowboy', '\u725b\u4ed4\u5192\u96aa\u5bb6', '\ud83e\udd20', '1f920'],
  ['alien', '\u661f\u969b\u65c5\u4eba', '\ud83d\udc7d', '1f47d'],
  ['robot', '\u6a5f\u68b0\u8ced\u795e', '\ud83e\udd16', '1f916'],
  ['ghost', '\u591c\u884c\u5e7d\u9748', '\ud83d\udc7b', '1f47b'],
  ['fire', '\u70c8\u7130\u5e78\u904b\u661f', '\ud83d\udd25', '1f525'],
  ['star', '\u9583\u8000\u65b0\u661f', '\ud83c\udf1f', '1f31f'],
  ['rocket', '\u706b\u7bad\u885d\u523a', '\ud83d\ude80', '1f680'],
  ['unicorn', '\u7368\u89d2\u7378', '\ud83e\udd84', '1f984'],
  ['dragon', '\u5c0f\u9f8d\u5b88\u885b', '\ud83d\udc32', '1f432'],
  ['lion', '\u7345\u738b\u767b\u5834', '\ud83e\udd81', '1f981'],
  ['tiger', '\u731b\u864e\u4e0a\u684c', '\ud83d\udc2f', '1f42f'],
  ['fox', '\u72e1\u9ee0\u72d0\u72f8', '\ud83e\udd8a', '1f98a'],
  ['panda', '\u798f\u6c23\u718a\u8c93', '\ud83d\udc3c', '1f43c'],
  ['wolf', '\u6708\u591c\u72fc\u5f71', '\ud83d\udc3a', '1f43a'],
  ['owl', '\u591c\u9d1e\u8ecd\u5e2b', '\ud83e\udd89', '1f989'],
  ['penguin', '\u4f01\u9d5d\u51b0\u92d2', '\ud83d\udc27', '1f427'],
  ['frog', '\u9752\u86d9\u597d\u624b', '\ud83d\udc38', '1f438'],
  ['monkey', '\u9748\u5de7\u7334\u738b', '\ud83d\udc35', '1f435'],
  ['joker', '\u5c0f\u4e11\u738b\u724c', '\ud83c\udccf', '1f0cf'],
  ['dice', '\u9ab0\u5b50\u9ad8\u624b', '\ud83c\udfb2', '1f3b2'],
  ['slot', '\u8001\u864e\u6a5f\u72c2\u71b1', '\ud83c\udfb0', '1f3b0'],
] as const;

export const avatarOptions: AvatarOption[] = avatarSeed.map(([id, label, emoji, codepoint]) => ({
  id,
  label,
  emoji,
  codepoint,
  src: `${TWEMOJI_BASE}/${codepoint}.svg`,
}));

export const navItems: Array<{ label: string; route: AppRoute }> = [
  { label: '\u9996\u9801', route: '/' },
  { label: '\u904a\u6232\u5206\u5340', route: '/games' },
  { label: '\u982d\u50cf\u5716\u793a', route: '/avatars' },
];

export const heroStats: HeroStat[] = [
  { label: '\u6536\u9304\u73a9\u6cd5', value: 8 },
  { label: '\u4e3b\u984c\u5206\u5340', value: 3 },
  { label: '\u53ef\u9078\u982d\u50cf', value: avatarOptions.length },
];

export const gameCategories: GameCategoryOption[] = [
  { id: 'all', label: '\u5168\u90e8\u5206\u5340' },
  { id: 'casino', label: 'CASINO' },
  { id: 'dice', label: '\u9ab0\u5b50\u4e16\u754c' },
  { id: 'cards', label: '\u724c\u5c40\u5929\u5730' },
];

export const games: GameItem[] = [
  {
    id: 'casino-zone',
    name: 'CASINO',
    badge: "Martin's Casino",
    status: '\u5df2\u6574\u5408',
    category: 'casino',
    description:
      '\u65b0\u7248\u5927\u5ef3\u5c07\u539f\u672c\u7368\u7acb\u7684\u6d1e\u7a74\u63a2\u96aa\u6536\u56de CASINO \u5340\uff0c\u73fe\u5728\u8207\u8001\u864e\u6a5f\u3001\u63a8\u5e63\u6a5f\u4e00\u8d77\u7d71\u6574\u5728\u540c\u4e00\u500b\u5165\u53e3\u3002',
    details: ['\u8001\u864e\u6a5f', '\u63a8\u5e63\u6a5f', '\u6d1e\u7a74\u63a2\u96aa'],
    href: './martins-casino/',
    tone: 'gold',
    buttonLabel: "\u9032\u5165 Martin's Casino",
  },
  {
    id: 'dice-zone',
    name: '\u9ab0\u5b50\u4e16\u754c',
    badge: 'Dice World',
    status: '\u4fdd\u7559\u7368\u7acb\u5206\u5340',
    category: 'dice',
    description:
      '\u9ab0\u5b50\u73a9\u6cd5\u7dad\u6301\u7368\u7acb\u5165\u53e3\uff0c\u65b9\u4fbf\u96c6\u4e2d\u7ba1\u7406\u73fe\u6709\u7684\u661f\u969b\u5439\u725b\u8207\u5f8c\u7e8c\u64f4\u5145\u7684\u9ab0\u5b50\u984c\u6750\u904a\u6232\u3002',
    details: ['\u661f\u969b\u5439\u725b', '\u9ab0\u5bf6\uff08\u898f\u5283\u4e2d\uff09', '\u5927\u5c0f\uff08\u898f\u5283\u4e2d\uff09'],
    href: './dice-world/',
    tone: 'violet',
    buttonLabel: '\u9032\u5165\u9ab0\u5b50\u4e16\u754c',
  },
  {
    id: 'card-zone',
    name: '\u724c\u5c40\u5929\u5730',
    badge: 'Card World',
    status: '\u7d93\u5178\u684c\u904a',
    category: 'cards',
    description:
      '\u724c\u684c\u985e\u73a9\u6cd5\u96c6\u4e2d\u5728\u540c\u4e00\u500b\u5206\u5340\uff0c\u4fdd\u7559\u820a\u7248\u7684\u724c\u5c40\u5929\u5730\u547d\u540d\uff0c\u4e26\u6e05\u695a\u5217\u51fa\u76ee\u524d\u53ef\u73a9\u7684\u56db\u6b3e\u724c\u684c\u904a\u6232\u3002',
    details: ['\u5c04\u9f8d\u9580', '21 \u9ede', '\u767e\u5bb6\u6a02', '\u8f2a\u76e4'],
    href: './card-world/',
    tone: 'azure',
    buttonLabel: '\u9032\u5165\u724c\u5c40\u5929\u5730',
  },
];

export const spotlights: SpotlightItem[] = [
  {
    id: 'casino-spotlight',
    name: 'CASINO',
    headline: "\u6d1e\u7a74\u63a2\u96aa\u5df2\u4f75\u5165 Martin's Casino",
    summary:
      '\u540c\u4e00\u5165\u53e3\u5373\u53ef\u524d\u5f80\u8001\u864e\u6a5f\u3001\u63a8\u5e63\u6a5f\u8207\u6d1e\u7a74\u63a2\u96aa\uff0c\u4e0d\u518d\u62c6\u6210\u7b2c\u56db\u5f35\u7368\u7acb\u5361\u7247\u3002',
    stat: '3 \u500b\u4e3b\u73a9\u6cd5',
    href: './martins-casino/',
    tone: 'gold',
  },
  {
    id: 'dice-spotlight',
    name: '\u9ab0\u5b50\u4e16\u754c',
    headline: '\u9ab0\u5b50\u73a9\u6cd5\u7dad\u6301\u7368\u7acb\u5165\u53e3',
    summary:
      '\u73fe\u968e\u6bb5\u4e3b\u6253\u661f\u969b\u5439\u725b\uff0c\u672a\u4f86\u65b0\u589e\u9ab0\u5bf6\u8207\u5927\u5c0f\u6642\u4e5f\u80fd\u76f4\u63a5\u5ef6\u7e8c\u5728\u540c\u4e00\u500b\u4e16\u754c\u89c0\u3002',
    stat: '1 \u500b\u73fe\u884c\u73a9\u6cd5',
    href: './dice-world/',
    tone: 'violet',
  },
  {
    id: 'cards-spotlight',
    name: '\u724c\u5c40\u5929\u5730',
    headline: '\u56db\u6b3e\u724c\u684c\u904a\u6232\u96c6\u4e2d\u6536\u7d0d',
    summary:
      '\u5f9e\u5c04\u9f8d\u9580\u300121 \u9ede\u5230\u767e\u5bb6\u6a02\u8207\u8f2a\u76e4\uff0c\u6240\u6709\u684c\u9762\u578b\u73a9\u6cd5\u90fd\u7d71\u4e00\u6574\u7406\u5728\u9019\u88e1\u3002',
    stat: '4 \u6b3e\u7d93\u5178\u904a\u6232',
    href: './card-world/',
    tone: 'azure',
  },
];

export const welcomeCopy =
  "\u6b61\u8fce\u4f86\u5230 Martin's Casino\uff0c\u4e09\u5927\u904a\u6232\u5206\u5340\u5df2\u6574\u7406\u5b8c\u6210\u3002";
export const welcomeSubcopy =
  "\u65b0\u7248 React \u5927\u5ef3\u6cbf\u7528\u820a\u7248\u7684 CASINO\u3001\u9ab0\u5b50\u4e16\u754c\u3001\u724c\u5c40\u5929\u5730\u547d\u540d\uff0c\u4e26\u628a\u6d1e\u7a74\u63a2\u96aa\u6b63\u5f0f\u6536\u7de8\u56de Martin's Casino\u3002";

export const treasureHint = '4800-1';
export const treasurePassword = '4799';
export const treasureReward = 100_000_000_000;
export const avatarSourceUrl = 'https://github.com/jdecked/twemoji';
