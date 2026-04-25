import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  avatarOptions,
  avatarSourceUrl,
  gameCategories,
  games,
  heroStats,
  navItems,
  spotlights,
  treasureHint,
  treasurePassword,
  treasureReward,
  welcomeCopy,
  welcomeSubcopy,
  type AppRoute,
  type AvatarOption,
  type CoverTone,
  type GameItem,
  type HeroStat,
  type SpotlightItem,
} from '../../data/lobbyData';
import { useCountUp } from '../../hooks/useCountUp';
import { useInView } from '../../hooks/useInView';
import { useLobbyStore } from '../../store/useLobbyStore';
import styles from './LobbyPage.module.css';

interface LobbyPageProps {
  route: AppRoute;
  navigate: (route: AppRoute) => void;
}

interface TreasureMessage {
  tone: 'idle' | 'success' | 'error';
  text: string;
}

const COPY = {
  logoHint: '\u9023\u6309\u4e09\u4e0b\u53ef\u958b\u555f\u85cf\u5bf6\u7bb1',
  navLabel: '\u4e3b\u8981\u5c0e\u89bd',
  goDirect: '\u76f4\u63a5\u524d\u5f80',
  treasureTitle: "hearts2hearts \u7684\u85cf\u5bf6\u7bb1",
  treasureSubtitle: '\u8f38\u5165\u5bc6\u8a9e\u5373\u53ef\u9818\u53d6\u96b1\u85cf\u5f69\u86cb\u734e\u52f5',
  treasurePlaceholder: '\u8f38\u5165\u5bc6\u8a9e',
  treasureButton: '\u958b\u555f\u5bf6\u7bb1',
  treasureError: '\u5bc6\u8a9e\u932f\u8aa4\uff0c\u8acb\u518d\u8a66\u4e00\u6b21\u3002',
  treasureSuccessPrefix: '\u606d\u559c\u89e3\u9396\u6210\u529f\uff0c\u5df2\u7372\u5f97 ',
  heroPrimaryAction: '\u67e5\u770b\u4e09\u5927\u904a\u6232\u5206\u5340',
  heroSecondaryAction: '\u6311\u9078\u982d\u50cf\u5716\u793a',
  heroLink: "\u76f4\u63a5\u524d\u5f80 Martin's World \u5206\u7ad9",
  gameEyebrow: 'Game Lobby',
  gameTitle: '\u6cbf\u7528\u820a\u7248\u547d\u540d\u7684\u4e09\u5927\u5206\u5340',
  gameCopy:
    '\u65b0\u7248\u9996\u9801\u6539\u7528 React \u91cd\u88fd\u4ecb\u9762\u5448\u73fe\uff0c\u4f46\u5206\u985e\u540d\u7a31\u4ecd\u4fdd\u7559\u820a\u7248\u7684 CASINO\u3001\u9ab0\u5b50\u4e16\u754c\u3001\u724c\u5c40\u5929\u5730\uff0c\u4e26\u628a\u6d1e\u7a74\u63a2\u96aa\u6b63\u78ba\u4f75\u5165 CASINO\u3002',
  summaryEyebrow: 'Zone Summary',
  summaryTitle: '\u5206\u985e\u6574\u7406\u5b8c\u6210\u5f8c\u7684\u91cd\u9ede',
  summaryCopy:
    '\u9019\u4e00\u5340\u5feb\u901f\u8aaa\u660e\u6bcf\u500b\u5165\u53e3\u76ee\u524d\u7684\u5b9a\u4f4d\uff0c\u8b93\u73a9\u5bb6\u9032\u5165\u524d\u5c31\u77e5\u9053\u5404\u5206\u5340\u6536\u9304\u4e86\u54ea\u4e9b\u5167\u5bb9\u3002',
  avatarEyebrow: 'Avatar Icons',
  avatarTitle: '\u5927\u91cf\u7db2\u8def\u5716\u793a\u4efb\u4f60\u9078',
  avatarCopy:
    '\u982d\u50cf\u5716\u793a\u6539\u70ba\u53ef\u81ea\u7531\u6311\u9078\uff0c\u9078\u5b9a\u5f8c\u6703\u5373\u6642\u53cd\u6620\u5728\u53f3\u4e0a\u89d2\u5e33\u6236\u5361\u7247\u3002\u5716\u793a\u4f86\u6e90\u63a1\u7528\u7dda\u4e0a Twemoji SVG\u3002',
  avatarCurrent: '\u76ee\u524d\u982d\u50cf',
  avatarSource: '\u67e5\u770b\u5716\u793a\u4f86\u6e90',
  footerCopy:
    '\u65b0\u7248 React \u5927\u5ef3\u5df2\u53d6\u4ee3\u820a\u7248\u9996\u9801\uff0c\u4e26\u4fdd\u7559\u539f\u672c\u7684\u4e09\u5927\u5206\u5340\u547d\u540d\u3002',
  footerHint: "\u5de6\u4e0a\u89d2 Martin's Casino \u9023\u9ede\u4e09\u4e0b\u53ef\u958b\u555f\u85cf\u5bf6\u7bb1\u5f69\u86cb\u3002",
} as const;

const sectionStagger = {
  hidden: { opacity: 0, y: 30 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.18 + index * 0.12,
      duration: 0.72,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const toneClassMap: Record<CoverTone, string> = {
  gold: styles.toneGold,
  violet: styles.toneViolet,
  azure: styles.toneAzure,
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
  onLogoClick,
  onProfileClick,
  avatar,
}: Pick<LobbyPageProps, 'route' | 'navigate'> & {
  onLogoClick: () => void;
  onProfileClick: () => void;
  avatar: AvatarOption;
}) {
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
      <button className={styles.logo} type="button" onClick={onLogoClick} title={COPY.logoHint}>
        Martin&apos;s Casino
      </button>

      <nav className={styles.navLinks} aria-label={COPY.navLabel}>
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

      <button className={styles.accountCard} type="button" onClick={onProfileClick}>
        <span className={styles.avatarWrap}>
          <img className={styles.avatarImage} src={avatar.src} alt={avatar.label} loading="lazy" />
        </span>
        <span className={styles.accountMeta}>
          <span className={styles.accountName}>{profile.name}</span>
          <span className={styles.accountTier}>{profile.tier}</span>
        </span>
        <span className={styles.accountBalance}>{formatCurrency(profile.balance)}</span>
      </button>
    </motion.header>
  );
}

function StatCard({ stat, index, trigger }: { stat: HeroStat; index: number; trigger: boolean }) {
  const value = useCountUp({ end: stat.value, delay: index * 160, trigger });

  return (
    <article className={styles.statCard}>
      <span className={styles.statValue}>{formatHeroStat(value, stat.prefix, stat.suffix)}</span>
      <span className={styles.statLabel}>{stat.label}</span>
    </article>
  );
}

function GameCard({ game }: { game: GameItem }) {
  const { ref, isInView } = useInView<HTMLElement>({
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
      <div className={`${styles.coverArt} ${toneClassMap[game.tone]}`}>
        <div className={styles.coverGlow} />
        <div className={styles.coverFrame} />
        <div className={styles.coverLabel}>{game.name}</div>
        <div className={styles.coverBadge}>{game.badge}</div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.cardHeading}>
          <h3 className={styles.gameName}>{game.name}</h3>
          <span className={styles.statusBadge}>{game.status}</span>
        </div>

        <p className={styles.cardDescription}>{game.description}</p>

        <div className={styles.detailChips}>
          {game.details.map((detail) => (
            <span key={detail} className={styles.detailChip}>
              {detail}
            </span>
          ))}
        </div>

        <button
          className={styles.playButton}
          type="button"
          onClick={() => {
            window.location.href = game.href;
          }}
        >
          {game.buttonLabel}
        </button>
      </div>
    </motion.article>
  );
}

function SpotlightCard({ item }: { item: SpotlightItem }) {
  return (
    <article className={styles.spotlightCard}>
      <div className={`${styles.spotlightTone} ${toneClassMap[item.tone]}`}>
        <span className={styles.spotlightName}>{item.name}</span>
      </div>
      <div className={styles.spotlightBody}>
        <span className={styles.spotlightStat}>{item.stat}</span>
        <h3 className={styles.spotlightHeadline}>{item.headline}</h3>
        <p className={styles.spotlightSummary}>{item.summary}</p>
        <a className={styles.spotlightLink} href={item.href}>
          {COPY.goDirect}
        </a>
      </div>
    </article>
  );
}

function AvatarCard({
  option,
  selected,
  onSelect,
}: {
  option: AvatarOption;
  selected: boolean;
  onSelect: (avatarId: string) => void;
}) {
  return (
    <button
      type="button"
      className={`${styles.avatarCard} ${selected ? styles.avatarCardSelected : ''}`}
      onClick={() => onSelect(option.id)}
      title={option.label}
    >
      <img className={styles.avatarCardImage} src={option.src} alt={option.label} loading="lazy" />
      <span className={styles.avatarCardLabel}>{option.label}</span>
    </button>
  );
}

function TreasureModal({
  open,
  code,
  message,
  onCodeChange,
  onClose,
  onSubmit,
}: {
  open: boolean;
  code: string;
  message: TreasureMessage;
  onCodeChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  return (
    <div
      className={`${styles.treasureOverlay} ${open ? styles.treasureOverlayOpen : ''}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className={styles.treasureBox}>
        <button className={styles.treasureClose} type="button" onClick={onClose}>
          ✕
        </button>
        <span className={styles.treasureIcon}>💝</span>
        <h2 className={styles.treasureTitle}>{COPY.treasureTitle}</h2>
        <p className={styles.treasureSubtitle}>{COPY.treasureSubtitle}</p>
        <p className={styles.treasureHint}>{treasureHint}</p>

        <input
          ref={inputRef}
          className={styles.treasureInput}
          type="text"
          value={code}
          placeholder={COPY.treasurePlaceholder}
          maxLength={20}
          autoComplete="off"
          onChange={(event) => onCodeChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSubmit();
          }}
        />

        <button className={styles.treasureButton} type="button" onClick={onSubmit}>
          {COPY.treasureButton}
        </button>

        <p
          className={`${styles.treasureMessage} ${
            message.tone === 'success'
              ? styles.treasureMessageSuccess
              : message.tone === 'error'
                ? styles.treasureMessageError
                : ''
          }`}
        >
          {message.text}
        </p>
      </div>
    </div>
  );
}

export default function LobbyPage({ route, navigate }: LobbyPageProps) {
  const heroRef = useRef<HTMLElement | null>(null);
  const gamesRef = useRef<HTMLElement | null>(null);
  const avatarsRef = useRef<HTMLElement | null>(null);
  const logoClickCountRef = useRef(0);
  const logoClickTimerRef = useRef<number | null>(null);
  const { activeCategory, profile, applyTreasureReward, setActiveCategory, setAvatar, syncProfile } = useLobbyStore();
  const { ref: statsRef, isInView: statsVisible } = useInView<HTMLDivElement>({
    threshold: 0.32,
  });
  const [treasureOpen, setTreasureOpen] = useState(false);
  const [treasureCode, setTreasureCode] = useState('');
  const [treasureMessage, setTreasureMessage] = useState<TreasureMessage>({ tone: 'idle', text: '' });

  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') return games;
    return games.filter((game) => game.category === activeCategory);
  }, [activeCategory]);

  const currentAvatar = useMemo(
    () => avatarOptions.find((option) => option.id === profile.avatarId) ?? avatarOptions[0]!,
    [profile.avatarId]
  );

  useEffect(() => {
    syncProfile();
  }, [syncProfile]);

  useEffect(() => {
    const routeTargets: Record<AppRoute, HTMLElement | null> = {
      '/': heroRef.current,
      '/games': gamesRef.current,
      '/avatars': avatarsRef.current,
    };

    routeTargets[route]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [route]);

  useEffect(() => {
    return () => {
      if (logoClickTimerRef.current) {
        window.clearTimeout(logoClickTimerRef.current);
      }
    };
  }, []);

  const openTreasure = () => {
    setTreasureCode('');
    setTreasureMessage({ tone: 'idle', text: '' });
    setTreasureOpen(true);
  };

  const handleLogoClick = () => {
    logoClickCountRef.current += 1;

    if (logoClickTimerRef.current) {
      window.clearTimeout(logoClickTimerRef.current);
    }

    if (logoClickCountRef.current >= 3) {
      logoClickCountRef.current = 0;
      openTreasure();
      return;
    }

    logoClickTimerRef.current = window.setTimeout(() => {
      logoClickCountRef.current = 0;
      navigate('/');
    }, 260);
  };

  const handleTreasureSubmit = () => {
    if (treasureCode.trim() !== treasurePassword) {
      setTreasureMessage({ tone: 'error', text: COPY.treasureError });
      setTreasureCode('');
      return;
    }

    const result = applyTreasureReward(treasureReward);
    setTreasureMessage({
      tone: result.ok ? 'success' : 'error',
      text: result.ok ? `${COPY.treasureSuccessPrefix}${formatCurrency(treasureReward)} \u7c4c\u78bc\u3002` : result.message,
    });

    if (result.ok) {
      syncProfile();
    }
  };

  return (
    <div className={styles.pageShell}>
      <div className={styles.backgroundVeil} />
      <div className={styles.backgroundPattern} />

      <Navbar
        route={route}
        navigate={navigate}
        onLogoClick={handleLogoClick}
        onProfileClick={() => navigate('/avatars')}
        avatar={currentAvatar}
      />

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
            <span className={styles.kicker}>React Lobby Remake</span>
            <h1 className={styles.heroTitle}>{welcomeCopy}</h1>
            <p className={styles.heroSubtitle}>{welcomeSubcopy}</p>

            <div className={styles.heroActions}>
              <button className={styles.ctaButton} type="button" onClick={() => navigate('/games')}>
                {COPY.heroPrimaryAction}
              </button>
              <button className={styles.secondaryButton} type="button" onClick={() => navigate('/avatars')}>
                {COPY.heroSecondaryAction}
              </button>
            </div>

            <a className={styles.secondaryLink} href="./martins-casino/">
              {COPY.heroLink}
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
              <span className={styles.sectionEyebrow}>{COPY.gameEyebrow}</span>
              <h2 className={styles.sectionTitle}>{COPY.gameTitle}</h2>
            </div>
            <p className={styles.sectionCopy}>{COPY.gameCopy}</p>
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
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
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
              <span className={styles.sectionEyebrow}>{COPY.summaryEyebrow}</span>
              <h2 className={styles.sectionTitle}>{COPY.summaryTitle}</h2>
            </div>
            <p className={styles.sectionCopy}>{COPY.summaryCopy}</p>
          </div>

          <div className={styles.spotlightGrid}>
            {spotlights.map((item) => (
              <SpotlightCard key={item.id} item={item} />
            ))}
          </div>
        </motion.section>

        <motion.section
          ref={avatarsRef}
          className={styles.sectionBlock}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={sectionStagger}
          custom={3}
        >
          <div className={styles.sectionHeader}>
            <div>
              <span className={styles.sectionEyebrow}>{COPY.avatarEyebrow}</span>
              <h2 className={styles.sectionTitle}>{COPY.avatarTitle}</h2>
            </div>
            <p className={styles.sectionCopy}>{COPY.avatarCopy}</p>
          </div>

          <div className={styles.avatarShowcase}>
            <aside className={styles.avatarPreview}>
              <span className={styles.avatarPreviewLabel}>{COPY.avatarCurrent}</span>
              <img className={styles.avatarPreviewImage} src={currentAvatar.src} alt={currentAvatar.label} loading="lazy" />
              <strong className={styles.avatarPreviewName}>{currentAvatar.label}</strong>
              <span className={styles.avatarPreviewMeta}>
                {profile.name} · {profile.tier}
              </span>
              <a className={styles.avatarSource} href={avatarSourceUrl} target="_blank" rel="noreferrer">
                {COPY.avatarSource}
              </a>
            </aside>

            <div className={styles.avatarGrid}>
              {avatarOptions.map((option) => (
                <AvatarCard
                  key={option.id}
                  option={option}
                  selected={option.id === currentAvatar.id}
                  onSelect={setAvatar}
                />
              ))}
            </div>
          </div>
        </motion.section>
      </main>

      <footer className={styles.footer}>
        <div>
          <div className={styles.footerLogo}>Martin&apos;s Casino</div>
          <p className={styles.footerCopy}>{COPY.footerCopy}</p>
        </div>
        <p className={styles.footerResponsible}>{COPY.footerHint}</p>
      </footer>

      <TreasureModal
        open={treasureOpen}
        code={treasureCode}
        message={treasureMessage}
        onCodeChange={setTreasureCode}
        onClose={() => setTreasureOpen(false)}
        onSubmit={handleTreasureSubmit}
      />
    </div>
  );
}
