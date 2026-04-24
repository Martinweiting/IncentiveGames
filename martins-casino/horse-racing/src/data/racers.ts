export interface Racer {
  id: number
  name: string
  nameEn: string
  emoji: string
  description: string
  baseSpeed: number  // 1.0 ~ 2.5 — higher = faster on average
  color: string      // accent colour for UI
}

export const RACERS: Racer[] = [
  {
    id: 1,
    name: '烈焰赤兔',
    nameEn: 'Blaze',
    emoji: '🐎',
    description: '傳說中最快的赤色火焰馬，爆發力驚人，但難以控制方向',
    baseSpeed: 2.4,
    color: '#ff6b35',
  },
  {
    id: 2,
    name: '夜影幽靈',
    nameEn: 'Phantom',
    emoji: '🦄',
    description: '神秘的暗黑獨角獸，擅長後半段突然加速衝刺超越',
    baseSpeed: 2.1,
    color: '#b86bff',
  },
  {
    id: 3,
    name: '翠綠飛龍',
    nameEn: 'Jade',
    emoji: '🐲',
    description: '古老翡翠龍裔後代，速度穩定均勻，耐力極佳',
    baseSpeed: 1.9,
    color: '#4ade80',
  },
  {
    id: 4,
    name: '金翼天馬',
    nameEn: 'Aurelius',
    emoji: '🦅',
    description: '黃金翅膀的天界使者，起跑爆發強但後勁略顯不足',
    baseSpeed: 2.5,
    color: '#fbbf24',
  },
  {
    id: 5,
    name: '蒼藍雷霆',
    nameEn: 'Thunder',
    emoji: '⚡',
    description: '來自北方冰原的閃電獸，移動時伴隨雷鳴，是真正的黑馬',
    baseSpeed: 1.6,
    color: '#38bdf8',
  },
  {
    id: 6,
    name: '鐵甲戰獅',
    nameEn: 'Ironmane',
    emoji: '🦁',
    description: '全副鎧甲的戰鬥獅王，以蠻力取勝，起步慢但後期稱雄',
    baseSpeed: 1.2,
    color: '#fb923c',
  },
]

export function generateOdds(): number[] {
  // Faster racers (higher baseSpeed) get lower odds
  return RACERS.map(r => {
    // Inverse relationship: faster horse → lower odds
    const base = 5.5 - r.baseSpeed  // range: 3.0 (speed 2.5) → 4.3 (speed 1.2)
    const jitter = (Math.random() - 0.5) * 0.8
    return Math.max(1.5, parseFloat((base + jitter).toFixed(1)))
  })
}
