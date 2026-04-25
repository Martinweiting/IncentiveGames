import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import Countdown from '../Countdown';
import {
  gameCategories,
  games,
  heroStats,
  leaderboard,
  liveTables,
  navItems,
  promotions,
  type CoverTone,
  type GameItem,
  type GameRibbon,
  type HeroStat,
  type LiveTable,
} from '../../data/lobbyData';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';
import { useLobbyStore } from '../../store/useLobbyStore';
import styles from './LobbyPage.module.css';

export type AppRoute = '/' | '/games' | '/promotions' | '/leaderboard';

interface LobbyPageProps {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
}

const sectionStagger = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.2 + index * 0.12,
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const toneClassMap: Record<CoverTone, string> = {
  gold: styles.toneGold,
  crimson: styles.toneCrimson,
  emerald: styles.toneEmerald,
  violet: styles.toneViolet,
  azure: styles.toneAzure,
  copper: styles.toneCopper,
};

const ribbonClassMap: Record<GameRibbon, string> = {
  hot: styles.ribbonHot,
  new: styles.ribbonNew,
  live: styles.ribbonLive,
};

function formatCurrency(value: number) {
  return `$${value.toLocaleString('en-US')}`;
}

function formatHeroStat(value: number, prefix = '', suffix = '') {
  return `${prefix}${value.toLocaleString('en-US')}${suffix}`;
}

function Navbar({
  route,
  navigate,
}: Pick<LobbyPageProps, 'route' | 'navigate'>) {
  const { profile } = useLobbyStore();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}
      initial={{ opacity: 0, y: -24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
    >
      <button className={styles.logo} type="button" onClick={() => navigate('/')}>
        Martin&apos;s Casino
      </button>

      <nav className={styles.navLinks} aria-label="主要導覽">
        {navItems.map((item) => {
          const isActive = route === item.route;
          return (
            <button
              key={item.route}
              type="button"
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              onClick={() => navigate(item.route)}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className={styles.accountCard}>
        <div className={styles.avatar}>{profile.initials}</div>
        <div className={styles.accountMeta}>
          <span className={styles.accountName}>{profile.name}</span>
          <span className={styles.accountTier}>{profile.tier}</span>
        </div>
        <div className={styles.accountBalance}>{formatCurrency(profile.balance)}</div>
      </div>
    </motion.header>
  );
}

function StatCard({ stat, index, trigger }: { stat: HeroStat; index: number; trigger: boolean }) {
  const value = useCountUp({ end: stat.value, delay: index * 160, trigger });

  return (
    <div className={styles.statCard}>
      <span className={styles.statValue}>{formatHeroStat(value, stat.prefix, stat.suffix)}</span>
      <span className={styles.statLabel}>{stat.label}</span>
    </div>
  );
}

function GameCard({ game }: { game: GameItem }) {
  const { ref, isInView } = useInView<HTMLArticleElement>({
    threshold: 0.18,
    rootMargin: '0px 0px -8% 0px',
  });

  return (
    <motion.article
      ref={ref}
      className={styles.gameCard}
      initial={{ opacity: 0, y: 36 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.02 }}
    >
      {game.ribbon ? (
        <span className={`${styles.cardRibbon} ${ribbonClassMap[game.ribbon]}`}>
          {game.ribbon.toUpperCase()}
        </span>
      ) : null}

      <div className={`${styles.coverArt} ${toneClassMap[game.tone]}`}>
        <div className={styles.coverGlow} />
        <div className={styles.coverFrame} />
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <h3 className={styles.gameName}>{game.name}</h3>
          <span className={styles.typeBadge}>{game.badge}</span>
        </div>

        {game.rtp ? <p className={styles.rtp}>RTP {game.rtp}</p> : <p className={styles.rtpPlaceholder}>高端私人桌體驗</p>}

        <button
          className={styles.playButton}
          type="button"
          onClick={() => {
            window.location.href = game.href;
          }}
        >
          立即遊玩
        </button>
      </div>
    </motion.article>
  );
}

function LiveCard({ table }: { table: LiveTable }) {
  return (
    <article className={styles.liveCard}>
      <span className={styles.liveBadge}>
        <span className={styles.liveDot} />
        Live
      </span>

      <div className={`${styles.liveDealer} ${toneClassMap[table.tone]}`}>
        <div className={styles.dealerAura} />
        <div className={styles.dealerHead} />
        <div className={styles.dealerBody} />
      </div>

      <div className={styles.liveMeta}>
        <h3 className={styles.liveName}>{table.name}</h3>
        <div className={styles.liveDetails}>
          <span>玩家 {table.players}</span>
          <span>最低下注 {formatCurrency(table.minBet)}</span>
        </div>
      </div>
    </article>
  );
}

export default function LobbyPage({ route, navigate }: LobbyPageProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const gamesRef = useRef<HTMLElement | null>(null);
  const promotionsRef = useRef<HTMLElement | null>(null);
  const leaderboardRef = useRef<HTMLElement | null>(null);
  const { activeCategory, setActiveCategory, syncProfile } = useLobbyStore();
  const { ref: statsRef, isInView: statsVisible } = useInView<HTMLDivElement>({
    threshold: 0.35,
  });

  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') return games;
    return games.filter((game) => game.category === activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  useEffect(() => {
    const routeTargets: Record<AppRoute, HTMLElement | null> = {
      '/': heroRef.current,
      '/games': gamesRef.current,
      '/promotions': promotionsRef.current,
      '/leaderboard': leaderboardRef.current,
    };

    routeTargets[route]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [route]);

  return (
    <div className={styles.pageShell}>
      <div className={styles.backgroundVeil} />
      <div className={styles.backgroundPattern} />

      <Navbar route={route} navigate={navigate} />

      <main className={styles.main}>
        <motion.section
          ref={heroRef}
          className={styles.heroSection}
          initial="hidden"
          animate="visible"
          variants={sectionStagger}
          custom={0}
        >
          <div className={styles.heroContent}>
            <span className={styles.kicker}>Macau Luxury Private Hall</span>
            <h1 className={styles.heroTitle}>黑金大廳，為高額玩家而設。</h1>
            <p className={styles.heroSubtitle}>
              以深色大理石、金線細節與霧面玻璃質感重塑大廳首頁，讓每一次進場都像步入私人賭廳。
            </p>
            <button className={styles.ctaButton} type="button" onClick={() => navigate('/games')}>
              立即探索桌台
            </button>
            <a className={styles.secondaryLink} href="../">
              返回 Martin&apos;s World
            </a>
          </div>

          <div ref={statsRef} className={styles.statsPanel}>
            {heroStats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} trigger={statsVisible} />
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={gamesRef}
          className={styles.sectionBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionStagger}
          custom={1}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Game Collection</span>
              <h2 className={styles.sectionTitle}>精選遊戲櫥窗</h2>
            </div>
            <p className={styles.sectionCopy}>從高返還老虎機到 VIP 私人桌，所有卡片皆支援切換與動態進場。</p>
          </div>

          <div className={styles.tabs}>
            {gameCategories.map((category) => {
              const active = activeCategory === category.id;
              return (
                <button
                  key={category.id}
                  type="button"
                  className={`${styles.tabButton} ${active ? styles.tabButtonActive : ''}`}
                  onClick={() => setActiveCategory(category.id)}
                >
                  <span>{category.label}</span>
                  {active ? <motion.span className={styles.tabIndicator} layoutId="tab-indicator" /> : null}
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className={styles.gamesGrid}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
            >
              {filteredGames.map((game) => (
                <GameCard key={game.id} game={game} />
              ))}
            </motion.div>
          </AnimatePresence>
        </motion.section>

        <motion.section
          className={styles.sectionBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionStagger}
          custom={2}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Live Salon</span>
              <h2 className={styles.sectionTitle}>真人娛樂專區</h2>
            </div>
            <p className={styles.sectionCopy}>橫向滾動展示 3.5 張卡片，讓玩家一眼感受到尚有更多桌台可探索。</p>
          </div>

          <div className={styles.liveRail}>
            {liveTables.map((table) => (
              <LiveCard key={table.id} table={table} />
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={promotionsRef}
          className={styles.sectionBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionStagger}
          custom={3}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Privileges</span>
              <h2 className={styles.sectionTitle}>限時促銷與禮遇</h2>
            </div>
            <p className={styles.sectionCopy}>倒數計時每秒更新，搭配雙欄促銷版位與金色邊框裝飾線。</p>
          </div>

          <div className={styles.promoGrid}>
            {promotions.map((promotion) => (
              <article key={promotion.id} className={styles.promoCard}>
                <span className={styles.promoHighlight}>{promotion.highlight}</span>
                <h3 className={styles.promoTitle}>{promotion.title}</h3>
                <p className={styles.promoCopy}>{promotion.description}</p>
                <Countdown targetTime={promotion.endsAt} />
              </article>
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={leaderboardRef}
          className={styles.sectionBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionStagger}
          custom={4}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>Leaderboard</span>
              <h2 className={styles.sectionTitle}>本週贏家 Top 5</h2>
            </div>
            <p className={styles.sectionCopy}>第一名帶有特殊金色光暈強調，其餘列維持整齊的數字與金額對齊。</p>
          </div>

          <div className={styles.leaderboardList}>
            {leaderboard.map((entry) => (
              <article
                key={entry.rank}
                className={`${styles.leaderboardItem} ${entry.rank === 1 ? styles.leaderboardChampion : ''}`}
              >
                <span className={styles.leaderboardRank}>{entry.rank}</span>
                <span className={styles.leaderboardName}>{entry.name}</span>
                <span className={styles.leaderboardPrize}>{formatCurrency(entry.prize)}</span>
              </article>
            ))}
          </div>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <div>
          <div className={styles.footerLogo}>Martin&apos;s Casino</div>
          <p className={styles.footerCopy}>© 2026 Martin&apos;s Casino. All rights reserved.</p>
        </div>
        <p className={styles.footerResponsible}>請理性娛樂，未滿十八歲請勿使用本平台。</p>
        <div className={styles.footerLinks}>
          <a href="../">World</a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            Instagram
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            X
          </a>
          <a href="/" onClick={(event) => event.preventDefault()}>
            Discord
          </a>
        </div>
      </footer>
    </div>
  );
}
