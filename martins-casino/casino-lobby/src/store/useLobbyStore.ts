import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { avatarOptions, type GameCategory } from '../data/lobbyData';

interface LobbyProfile {
  name: string;
  initials: string;
  balance: number;
  tier: string;
  avatarId: string;
  hasNickname: boolean;
}

interface TreasureResult {
  ok: boolean;
  message: string;
}

interface LobbyState {
  profile: LobbyProfile;
  activeCategory: GameCategory;
  syncProfile: () => void;
  setActiveCategory: (category: GameCategory) => void;
  setAvatar: (avatarId: string) => void;
  applyTreasureReward: (amount: number) => TreasureResult;
}

const NICK_KEY = 'mc_nickname';
const AVATAR_KEY = 'mc_avatar_icon';
const DEFAULT_BALANCE = 1000;
const DEFAULT_AVATAR_ID = avatarOptions[0]?.id ?? 'crown';

function balanceKey(nickname: string) {
  return `mc_chips_${nickname}`;
}

function resolveTier(balance: number, hasNickname: boolean) {
  if (!hasNickname) return '\u5f85\u547d\u73a9\u5bb6';
  if (balance >= 100_000) return '\u9ed1\u91d1\u6703\u54e1';
  return '\u91d1\u8272\u6703\u54e1';
}

function resolveInitials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2) || 'MC'
  );
}

function readStoredProfile(): LobbyProfile {
  const rawNickname = window.localStorage.getItem(NICK_KEY)?.trim() ?? '';
  const hasNickname = rawNickname.length > 0;
  const displayName = hasNickname ? rawNickname : '\u8a2a\u5ba2\u73a9\u5bb6';
  const avatarId = window.localStorage.getItem(AVATAR_KEY) || DEFAULT_AVATAR_ID;
  const rawBalance = hasNickname
    ? Number(window.localStorage.getItem(balanceKey(rawNickname)) ?? String(DEFAULT_BALANCE))
    : DEFAULT_BALANCE;
  const balance = Number.isFinite(rawBalance) && rawBalance >= 0 ? Math.round(rawBalance) : DEFAULT_BALANCE;

  return {
    name: displayName,
    initials: resolveInitials(displayName),
    balance,
    tier: resolveTier(balance, hasNickname),
    avatarId,
    hasNickname,
  };
}

export const useLobbyStore = create<LobbyState>()(
  persist(
    (set) => ({
      profile: readStoredProfile(),
      activeCategory: 'all',
      syncProfile: () => set({ profile: readStoredProfile() }),
      setActiveCategory: (category) => set({ activeCategory: category }),
      setAvatar: (avatarId) => {
        window.localStorage.setItem(AVATAR_KEY, avatarId);
        set((state) => ({
          profile: {
            ...state.profile,
            avatarId,
          },
        }));
      },
      applyTreasureReward: (amount) => {
        const nickname = window.localStorage.getItem(NICK_KEY)?.trim() ?? '';

        if (!nickname) {
          return {
            ok: false,
            message:
              '\u8acb\u5148\u5230\u4efb\u4e00\u904a\u6232\u9801\u8a2d\u5b9a\u66b1\u7a31\uff0c\u518d\u56de\u4f86\u9818\u53d6\u85cf\u5bf6\u7bb1\u734e\u52f5\u3002',
          };
        }

        const currentBalance = Number(window.localStorage.getItem(balanceKey(nickname)) ?? String(DEFAULT_BALANCE));
        const nextBalance = Math.max(0, Math.round((Number.isFinite(currentBalance) ? currentBalance : DEFAULT_BALANCE) + amount));

        window.localStorage.setItem(balanceKey(nickname), String(nextBalance));

        set({
          profile: {
            name: nickname,
            initials: resolveInitials(nickname),
            balance: nextBalance,
            tier: resolveTier(nextBalance, true),
            avatarId: window.localStorage.getItem(AVATAR_KEY) || DEFAULT_AVATAR_ID,
            hasNickname: true,
          },
        });

        return {
          ok: true,
          message: `\u5bf6\u7bb1\u5df2\u958b\u555f\uff0c\u5df2\u8ffd\u52a0 ${amount.toLocaleString('en-US')} \u7c4c\u78bc\u3002`,
        };
      },
    }),
    {
      name: 'casino-lobby-ui',
      partialize: (state) => ({ activeCategory: state.activeCategory }),
    }
  )
);
