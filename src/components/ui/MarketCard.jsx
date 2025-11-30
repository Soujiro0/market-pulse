import { Box, Zap, Star, Crown } from 'lucide-react';
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

const MarketCard = ({ product, onClick }) => {
    const r = product.rarity;
    const hypeColor = product.hype > 50 ? 'bg-emerald-500' : 'bg-orange-500';
    
    // Determine glow and sparkle effects based on rarity
    const glowClass = r.label === 'Blue Chip' ? 'animate-glow-standard' :
                      r.label === 'Growth' ? 'animate-glow-emerging' :
                      r.label === 'High-Risk' ? 'animate-glow-disruptive' :
                      r.label === 'Moonshot' ? 'animate-glow-unicorn' : '';
    
    const sparkleClass = (r.label === 'High-Risk' || r.label === 'Moonshot') ? 'animate-sparkle' : '';

    return (
        <div
            className={`relative rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border overflow-hidden flex flex-col group cursor-pointer ${r.glow} ${r.bg} ${glowClass}`}
            onClick={() => onClick(product)}
        >
            <div className="p-5 flex-1 relative z-10">
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded bg-slate-900/80 backdrop-blur border border-slate-700 text-white flex items-center gap-1">
                        <RarityIcon iconName={r.icon} className="w-3 h-3" /> {r.label}
                    </span>
                </div>
                <div className="flex flex-col items-center text-center my-4">
                    <div className={`text-6xl mb-3 filter drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300 ${sparkleClass}`}>{product.icon}</div>
                    <h3 className="text-lg font-bold text-white leading-tight mb-1 shadow-black drop-shadow-md">{product.name}</h3>
                    <p className="text-[10px] text-slate-300 italic h-8 overflow-hidden leading-tight opacity-80 px-2 line-clamp-2">{product.desc}</p>
                </div>
                <div className="mt-2">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-300 mb-1">
                        <span>DEMAND</span>
                        <span>{product.hype}%</span>
                    </div>
                    <div className="w-full h-1 bg-slate-900/50 rounded-full overflow-hidden">
                        <div className={`${hypeColor} h-full rounded-full shadow-[0_0_10px_currentColor]`} style={{ width: `${product.hype}%` }}></div>
                    </div>
                </div>
            </div>
            <div className="px-5 py-3 border-t border-white/10 bg-slate-900/60 backdrop-blur-sm flex justify-between items-center group-hover:bg-slate-900/80 transition-colors z-10">
                <p className="font-mono font-bold text-white text-lg">{formatMoney(product.currentPrice)}</p>
                <span className="text-xs font-bold text-indigo-300 group-hover:translate-x-1 transition-transform">TRADE &rarr;</span>
            </div>
        </div>
    );
};

export default MarketCard;
