import { motion } from 'framer-motion';
import { PROMOTIONS } from '../data/games';
import Countdown from './Countdown';

function PromoCard({ promo, index }: { promo: typeof PROMOTIONS[0]; index: number }) {
  return (
    <motion.div
      className="relative rounded-2xl overflow-hidden glass-card p-6 flex flex-col gap-4 cursor-default group"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Top accent line (colored per promo) */}
      <div
        className="absolute top-0 left-6 right-6 h-px opacity-60"
        style={{ background: `linear-gradient(90deg, transparent, ${promo.badgeColor}, transparent)` }}
      />

      {/* Badge */}
      <div className="flex items-center justify-between">
        <span
          className="text-[10px] px-3 py-1 rounded-full font-sans font-semibold tracking-widest uppercase border"
          style={{
            color: promo.badgeColor,
            borderColor: `${promo.badgeColor}44`,
            background: `${promo.badgeColor}18`,
          }}
        >
          {promo.badge}
        </span>
        <span className="section-label text-[9px]">{promo.subtitle}</span>
      </div>

      {/* Content */}
      <div>
        <h3 className="font-serif font-bold text-gold text-2xl leading-tight">{promo.title}</h3>
        <p className="text-[#D4C5A9]/55 text-sm font-sans leading-relaxed mt-2">{promo.description}</p>
      </div>

      {/* Countdown */}
      <div className="mt-auto">
        <p className="section-label text-[9px] mb-2">活動倒數</p>
        <Countdown targetDate={promo.targetDate} />
      </div>

      {/* CTA */}
      <button className="mt-2 w-full py-2.5 rounded-xl btn-play text-sm font-sans font-medium tracking-widest uppercase">
        立即參與
      </button>

      {/* Corner decorative lines */}
      <div
        className="absolute bottom-4 right-4 w-8 h-8 border-r border-b opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ borderColor: promo.badgeColor }}
      />
      <div
        className="absolute top-4 left-4 w-6 h-6 border-l border-t opacity-20 group-hover:opacity-40 transition-opacity"
        style={{ borderColor: promo.badgeColor }}
      />
    </motion.div>
  );
}

export default function PromotionSection() {
  return (
    <section id="promotions" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <p className="section-label mb-2">PROMOTIONS</p>
        <h2 className="font-serif font-bold text-4xl md:text-5xl text-gold-gradient leading-tight">
          最新優惠
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {PROMOTIONS.map((promo, i) => (
          <PromoCard key={promo.id} promo={promo} index={i} />
        ))}
      </div>
    </section>
  );
}
