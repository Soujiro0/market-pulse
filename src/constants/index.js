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

export const TIERS = ["Intern", "Analyst", "Associate", "Trader", "Broker", 
    "Manager", "Director", "VP", "Executive", "Chairman"];

export { PROFILES };
