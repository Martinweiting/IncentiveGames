import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES, CATEGORIES, type GameCategory } from '../data/games';
import GameCard from './GameCard';

export default function GameSection() {
  const [active, setActive] = useState<GameCategory>('featured');

  const filtered = GAMES.filter(g => g.categories.includes(active));

  return (
    <section id="games" className="max-w-7xl mx-auto px-6 py-24">
      {/* Heading */}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="section-label mb-2">GAME SELECTION</p>
        <h2 className="font-serif font-bold text-4xl md:text-5xl text-gold-gradient leading-tight">
          探索遊戲
        </h2>
      </motion.div>

      {/* Tabs */}
      <motion.div
        className="relative flex items-center gap-0 border-b border-gold/10 mb-10 overflow-x-auto scroll-strip"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {CATEGORIES.map(cat => {
          const isActive = cat.id === active;
          return (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative shrink-0 px-5 py-3.5 text-sm font-sans tracking-wider transition-colors duration-200 ${
                isActive ? 'text-gold' : 'text-[#7A6A5A] hover:text-[#D4C5A9]'
              }`}
            >
              {cat.label}
              {isActive && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                  transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                />
              )}
            </button>
          );
        })}
      </motion.div>

      {/* Game Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          {filtered.map((game, i) => (
            <GameCard key={game.id} game={game} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <p className="text-center text-[#7A6A5A] font-sans py-16 tracking-widest">即將推出…</p>
      )}
    </section>
  );
}
