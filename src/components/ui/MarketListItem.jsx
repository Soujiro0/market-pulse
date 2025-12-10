import { Box, Zap, Star, Crown, Sparkles } from 'lucide-react';
import { formatMoney } from '@/utils';
import { RARITY } from '@/constants';

const RarityIcon = ({ iconName, className }) => {
    switch (iconName) {
        case RARITY.STANDARD.icon: return <Box className={className} />;
        case RARITY.EMERGING.icon: return <Zap className={className} />;
        case RARITY.DISRUPTIVE.icon: return <Star className={className} />;
        case RARITY.UNICORN.icon: return <Crown className={className} />;
        default: return <Box className={className} />;
    }
};

const MarketListItem = ({ product, onClick, index, isNew = false }) => {
    const r = product.rarity;

    const shiningClass = (r.id === 'unicorn' || r.id === 'disruptive') ? 'shine-effect' : '';
    const glowPulseClass = r.id === 'unicorn' ? 'animate-glow-pulse' : '';

    const animationDelay = `${index * 50}ms`;

    return (
        <div
            className={`relative bg-slate-800 rounded-lg shadow-sm hover:bg-slate-700 transition-all duration-200 border border-slate-700 flex items-center justify-between p-4 cursor-pointer group ${r.glow} animate-roll-in ${shiningClass} ${glowPulseClass}`}
            style={{ 
                borderLeftWidth: "4px", 
                borderLeftColor: r.id === 'unicorn' ? '#eab308' : (r.id === 'disruptive' ? '#a855f7' : (r.id === 'emerging' ? '#3b82f6' : '#334155')),
                animationDelay 
            }}
            onClick={() => onClick(product)}
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center">
                    <img src={product.image} alt={product.name} className="max-w-full max-h-full object-contain" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-indigo-400">{product.name}</h3>
                    <p className="text-[10px] text-slate-500 italic hidden sm:block">{product.desc}</p>
                </div>
            </div>
            <div className="flex items-center gap-6">
                {isNew && (
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-gradient-to-r from-yellow-500 to-orange-500 text-white flex items-center gap-1 animate-pulse shadow-lg shadow-yellow-500/50">
                        <Sparkles className="w-3 h-3" /> NEW
                    </span>
                )}
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-900 ${r.color} border border-slate-600 hidden md:flex items-center gap-1`}>
                    <RarityIcon iconName={r.icon} className="w-3 h-3" /> {r.label}
                </span>
                <div className="text-right">
                    <p className="font-mono font-bold text-white text-lg">{formatMoney(product.currentPrice)}</p>
                </div>
            </div>
        </div>
    );
};

export default MarketListItem;
