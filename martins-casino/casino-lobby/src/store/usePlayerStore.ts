import { create } from 'zustand';

interface PlayerState {
  nickname: string;
  balance: number;
  loadFromStorage: () => void;
  saveBalance: (amount: number) => void;
}

const NICK_KEY = 'mc_nickname';
const balKey = (n: string) => `mc_chips_${n}`;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  nickname: '',
  balance: 0,

  loadFromStorage: () => {
    const nickname = localStorage.getItem(NICK_KEY) ?? '';
    const balance = nickname
      ? Math.max(+(localStorage.getItem(balKey(nickname)) ?? '0') || 1000, 0)
      : 0;
    set({ nickname, balance });
  },

  saveBalance: (amount: number) => {
    const { nickname } = get();
    if (!nickname) return;
    const rounded = Math.max(0, Math.round(amount));
    localStorage.setItem(balKey(nickname), String(rounded));
    set({ balance: rounded });
  },
}));
