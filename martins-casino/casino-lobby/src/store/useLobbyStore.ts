import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GameCategory } from '../data/lobbyData';

interface LobbyProfile {
  name: string;
  initials: string;
  balance: number;
  tier: string;
}

interface LobbyState {
  profile: LobbyProfile;
  activeCategory: GameCategory;
  syncProfile: () => void;
  setActiveCategory: (category: GameCategory) => void;
}

const NICK_KEY = 'mc_nickname';

function readStoredProfile(): LobbyProfile {
  const nickname = window.localStorage.getItem(NICK_KEY)?.trim() || 'Martin Vale';
  const initials = nickname
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2) || 'MV';
  const balanceKey = `mc_chips_${nickname}`;
  const rawBalance = Number(window.localStorage.getItem(balanceKey) ?? '128450');
  const balance = Number.isFinite(rawBalance) && rawBalance > 0 ? Math.round(rawBalance) : 128450;

  return {
    name: nickname,
    initials,
    balance,
    tier: balance >= 100000 ? 'Black Card' : 'Gold Member',
  };
}

export const useLobbyStore = create<LobbyState>()(
  persist(
    (set) => ({
      profile: {
        name: 'Martin Vale',
        initials: 'MV',
        balance: 128450,
        tier: 'Black Card',
      },
      activeCategory: 'all',
      syncProfile: () => set({ profile: readStoredProfile() }),
      setActiveCategory: (category) => set({ activeCategory: category }),
    }),
    {
      name: 'casino-lobby-ui',
      partialize: (state) => ({ activeCategory: state.activeCategory }),
    }
  )
);
