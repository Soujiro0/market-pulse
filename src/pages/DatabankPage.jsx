import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import items from '@/data/items.json';
import ranks from '@/data/ranks.json';
import { CLIMATES, RARITY } from '@/constants';
import { Box, Zap, Star, Crown, TrendingUp, TrendingDown, Minus, Activity, Package, BarChart, Cloud, Gem, X } from 'lucide-react';

const RarityIcon = ({ iconName, className }) => {
    switch (iconName) {
        case RARITY.STANDARD.icon: return <Box className={className} />;
        case RARITY.EMERGING.icon: return <Zap className={className} />;
        case RARITY.DISRUPTIVE.icon: return <Star className={className} />;
        case RARITY.UNICORN.icon: return <Crown className={className} />;
        default: return <Box className={className} />;
    }
};

const ClimateIcon = ({ iconName, className }) => {
    switch (iconName) {
        case 'trending-up': return <TrendingUp className={className} />;
        case 'trending-down': return <TrendingDown className={className} />;
        case 'minus': return <Minus className={className} />;
        case 'activity': return <Activity className={className} />;
        default: return <Minus className={className} />;
    }
};

const SectionButton = ({ label, icon, isActive, onClick }) => {
    const Icon = icon;
    return (
        <button
            onClick={onClick}
            className={`flex-1 p-4 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 border ${isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-500'
                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border-slate-700'
                }`}
        >
            <Icon className="w-4 h-4" />
            {label}
        </button>
    );
};

const ItemDetailModal = ({ item, onClose }) => {
    if (!item) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-indigo-700 relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                <div className="flex flex-col items-center text-center">
                    <div className="w-48 h-48 bg-slate-800 rounded-2xl shadow-inner border border-slate-700 flex items-center justify-center mb-6 relative">
                        <img src={`assets/items/${item.image}`} alt={item.name} className="max-w-full max-h-full object-contain p-4" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{item.name}</h2>
                    <p className="text-sm text-slate-400 italic">"{item.flavorText}"</p>
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const ItemsSection = ({ onItemSelected }) => (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Registered Assets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map(item => (
                <div key={item.id} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center gap-4 cursor-pointer hover:bg-slate-700 transition-colors" onClick={() => onItemSelected(item)}>
                    <div className="w-16 h-16 flex-shrink-0 bg-slate-900 rounded-md flex items-center justify-center">
                        <img src={`assets/items/${item.image}`} alt={item.name} className="w-12 h-12 object-contain" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white">{item.name}</h3>
                        <p className="text-xs text-slate-400 italic">"{item.flavorText}"</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

const RanksSection = () => {
    const groupedRanks = ranks.reduce((acc, rank) => {
        if (!acc[rank.name]) {
            acc[rank.name] = [];
        }
        acc[rank.name].push(rank);
        return acc;
    }, {});

    return (
        <div className="glass-panel p-6 rounded-xl animate-fade-in">
            <h2 className="text-2xl font-bold text-indigo-400 mb-4">Corporate Tiers</h2>
            <div className="space-y-4">
                {Object.entries(groupedRanks).map(([tierName, tierRanks]) => (
                    <div key={tierName}>
                        <h3 className="font-bold text-white text-lg mb-2">{tierName}</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {tierRanks.map(rank => (
                                <div key={rank.image} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex flex-col items-center gap-2">
                                    <div className="w-16 h-16">
                                        <img src={`/assets/ranks/${rank.image}`} alt={rank.name} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="font-bold text-white text-sm">{rank.name} {rank.level}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ClimatesSection = () => (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Market Climates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(CLIMATES).map(([name, climate]) => (
                <div key={name} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${climate.color}`}>
                        <ClimateIcon iconName={climate.icon} className="w-6 h-6" />
                    </div>
                    <span className="font-bold text-white">{name}</span>
                </div>
            ))}
        </div>
    </div>
);

const RaritiesSection = () => (
    <div className="glass-panel p-6 rounded-xl animate-fade-in">
        <h2 className="text-2xl font-bold text-indigo-400 mb-4">Asset Rarities</h2>
        <div className="space-y-3">
            {Object.values(RARITY).map(rarity => (
                <div key={rarity.id} className={`p-4 rounded-lg border flex items-center gap-4 ${rarity.border} ${rarity.bg}`}>
                    <div className={`w-10 h-10 rounded-md flex items-center justify-center ${rarity.color}`}>
                        <RarityIcon iconName={rarity.icon} className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className={`font-bold ${rarity.color}`}>{rarity.label}</h3>
                        <p className="text-xs text-slate-300">Multiplier: <span className="font-mono font-bold">x{rarity.mult}</span></p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


const DatabankPage = () => {
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState('items');
    const [selectedItem, setSelectedItem] = useState(null);

    const sections = {
        items: { label: 'Assets', icon: Package, component: <ItemsSection onItemSelected={setSelectedItem} /> },
        ranks: { label: 'Tiers', icon: BarChart, component: <RanksSection /> },
        climates: { label: 'Climates', icon: Cloud, component: <ClimatesSection /> },
        rarities: { label: 'Rarities', icon: Gem, component: <RaritiesSection /> },
    };

    return (
        <>

            <div className="space-y-6 fade-in pb-20">
                <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
                </div>

                <h1 className="text-3xl font-bold text-white tracking-tight">Databank</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {Object.entries(sections).map(([key, { label, icon }]) => (
                        <SectionButton
                            key={key}
                            label={label}
                            icon={icon}
                            isActive={activeSection === key}
                            onClick={() => setActiveSection(key)}
                        />
                    ))}
                </div>

                <div>
                    {sections[activeSection].component}
                </div>
            </div>
            <ItemDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
        </>
    );
};

export default DatabankPage;

