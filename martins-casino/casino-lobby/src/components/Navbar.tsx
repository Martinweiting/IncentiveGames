import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePlayerStore } from '../store/usePlayerStore';

const NAV_LINKS = [
  { label: '大廳',   href: '#lobby' },
  { label: '遊戲',   href: '#games' },
  { label: '促銷',   href: '#promotions' },
  { label: '排行榜', href: '#leaderboard' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { nickname, balance } = usePlayerStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const initials = nickname ? nickname.slice(0, 2).toUpperCase() : '?';

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-black/80 backdrop-blur-2xl border-b border-gold/10 shadow-[0_4px_40px_rgba(0,0,0,0.6)]'
          : 'bg-transparent'
      }`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <a href="#lobby" className="shrink-0 flex items-center gap-3 group">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-gold/30 group-hover:border-gold/60 transition-colors" />
            <span className="text-gold text-xs font-serif font-black">✦</span>
          </div>
          <span className="font-serif font-black text-xl tracking-[0.18em] text-gold-gradient hidden sm:block">
            MARTIN'S CASINO
          </span>
          <span className="font-serif font-black text-xl tracking-[0.18em] text-gold-gradient sm:hidden">
            MC
          </span>
        </a>

        {/* Center Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          {NAV_LINKS.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs tracking-[0.22em] uppercase font-sans text-[#D4C5A9]/55 hover:text-gold transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* User Area */}
        <div className="flex items-center gap-3 shrink-0">
          {nickname ? (
            <>
              <div className="hidden sm:flex flex-col items-end leading-tight">
                <span className="text-[10px] tracking-widest uppercase text-[#D4C5A9]/40 font-sans">餘額</span>
                <span className="text-gold font-number font-semibold text-sm font-tabular tracking-wide">
                  ${balance.toLocaleString()}
                </span>
              </div>
              <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center hover:bg-gold/20 hover:border-gold/50 transition-all cursor-pointer">
                <span className="text-gold font-sans font-semibold text-sm">{initials}</span>
              </div>
            </>
          ) : (
            <a
              href="../"
              className="text-xs px-4 py-2 rounded-full btn-gold font-sans tracking-wider"
            >
              回首頁
            </a>
          )}
        </div>

      </div>
    </motion.header>
  );
}
