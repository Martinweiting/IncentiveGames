import { motion } from 'framer-motion';

const SOCIAL_LINKS = [
  { label: 'Discord', icon: '💬' },
  { label: 'LINE',    icon: '💚' },
  { label: 'IG',      icon: '📸' },
];

const FOOTER_LINKS = [
  { label: '關於我們', href: '#' },
  { label: '遊戲規則', href: '#' },
  { label: '責任博彩', href: '#' },
  { label: '隱私政策', href: '#' },
  { label: '聯繫我們', href: '#' },
];

export default function Footer() {
  return (
    <footer className="border-t border-gold/8 mt-8">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Top row */}
        <motion.div
          className="flex flex-col md:flex-row items-center md:items-start justify-between gap-10 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full border border-gold/30 flex items-center justify-center">
                <span className="text-gold text-xs font-serif">✦</span>
              </div>
              <span className="font-serif font-black text-xl tracking-[0.18em] text-gold-gradient">
                MARTIN'S CASINO
              </span>
            </div>
            <p className="text-[#7A6A5A] text-xs tracking-[0.18em] uppercase font-sans">
              Macau Luxury · Monte Carlo Experience
            </p>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-3">
            {FOOTER_LINKS.map(link => (
              <a
                key={link.label}
                href={link.href}
                className="text-xs text-[#7A6A5A] hover:text-gold transition-colors duration-200 tracking-widest uppercase font-sans"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            {SOCIAL_LINKS.map(s => (
              <button
                key={s.label}
                className="w-9 h-9 rounded-full glass-card flex items-center justify-center hover:border-gold/30 transition-colors text-sm"
                aria-label={s.label}
              >
                {s.icon}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Separator */}
        <div className="gold-line mb-8" />

        {/* Responsible gambling notice */}
        <motion.div
          className="text-center max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <p className="text-[#7A6A5A] text-xs font-sans leading-relaxed tracking-wide">
            🛡️ 本站提倡<strong className="text-[#D4C5A9]/60">負責任博彩</strong>。賭博可能會導致成癮，
            請量力而為並設定個人限額。未滿 18 歲嚴禁參與任何賭博活動。
          </p>
          <p className="text-[#5A4A3A] text-[10px] font-sans tracking-widest mt-4">
            © {new Date().getFullYear()} MARTIN'S CASINO · All Rights Reserved · 版權所有
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
