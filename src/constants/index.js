
export const MARKET_EVENTS = {
    GOLDEN_AGE: {
        name: "Golden Age of Expansion",
        description: "A rare period of rapid growth! All profits are doubled.",
        duration: 2,
        climate: 'Expansion',
        profitMultiplier: 2,
        lossMultiplier: 1,
        icon: '🚀',
        rarity: 'rare'
    },
    MARKET_BOOM: {
        name: "Market Boom",
        description: "The market is experiencing a sustained period of growth.",
        duration: 5,
        climate: 'Expansion',
        profitMultiplier: 1,
        lossMultiplier: 1,
        icon: '📈',
        rarity: 'common'
    },
    CALM_WATERS: {
        name: "Calm Waters",
        description: "A period of predictable and stable market conditions.",
        duration: 5,
        climate: 'Stable',
        profitMultiplier: 1,
        lossMultiplier: 1,
        icon: '🌊',
        rarity: 'common'
    },
    ECONOMIC_DOWNTURN: {
        name: "Economic Downturn",
        description: "The market is facing a challenging period of contraction.",
        duration: 5,
        climate: 'Recession',
        profitMultiplier: 1,
        lossMultiplier: 1,
        icon: '📉',
        rarity: 'common'
    },
    WILD_RIDE: {
        name: "Wild Ride",
        description: "Extreme volatility and unpredictable market swings.",
        duration: 5,
        climate: 'Turbulent',
        profitMultiplier: 1,
        lossMultiplier: 1,
        icon: '🌪️',
        rarity: 'common'
    },
    GREAT_DEPRESSION: {
        name: "Great Depression",
        description: "A severe recession where losses are magnified.",
        duration: 10,
        climate: 'Recession',
        profitMultiplier: 1,
        lossMultiplier: 2,
        icon: '💀',
        rarity: 'uncommon'
    }
};

export const CLIMATES = {
    'Expansion': { icon: 'trending-up', color: 'text-emerald-400' },
    'Recession': { icon: 'trending-down', color: 'text-red-400' },
    'Stable': { icon: 'minus', color: 'text-slate-400' },
    'Turbulent': { icon: 'activity', color: 'text-orange-400' }
};

export const RARITY = {
    STANDARD: { id: 'standard', label: 'Standard', mult: 1, color: 'text-slate-400', bg: 'bg-standard', border: 'card-base', icon: 'box', glow: 'card-base' },
    EMERGING: { id: 'emerging', label: 'Rare', mult: 1.5, color: 'text-blue-400', bg: 'bg-emerging', border: 'border-blue-500/50', icon: 'zap', glow: 'card-glow-emerging' },
    DISRUPTIVE: { id: 'disruptive', label: 'Epic', mult: 3, color: 'text-purple-400', bg: 'bg-disruptive', border: 'border-purple-500/50', icon: 'star', glow: 'card-glow-disruptive' },
    UNICORN: { id: 'unicorn', label: 'Legendary', mult: 10, color: 'text-yellow-400', bg: 'bg-unicorn', border: 'border-yellow-500/50', icon: 'crown', glow: 'card-glow-unicorn' }
};

import PROFILES from '@/data/profiles.json';

export { PROFILES };
