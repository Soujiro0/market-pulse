import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ranks from '@/data/ranks.json';

const RanksModal = ({ isOpen, onClose, currentRankId }) => {
    const [currentTierIndex, setCurrentTierIndex] = useState(0);

    const groupedRanks = useMemo(() => {
        const groups = ranks.reduce((acc, rank) => {
            if (!acc[rank.name]) {
                acc[rank.name] = [];
            }
            acc[rank.name].push(rank);
            return acc;
        }, {});
        return Object.entries(groups).map(([name, ranks]) => ({ name, ranks }));
    }, []);

    useState(() => {
        if (isOpen) {
            const currentRank = ranks[currentRankId];
            const tierIndex = groupedRanks.findIndex(tier => tier.name === currentRank.name);
            if (tierIndex !== -1) {
                setCurrentTierIndex(tierIndex);
            }
        }
    }, [isOpen, currentRankId, groupedRanks]);


    if (!isOpen) return null;

    const handleNext = () => {
        setCurrentTierIndex((prev) => (prev + 1) % groupedRanks.length);
    };

    const handlePrev = () => {
        setCurrentTierIndex((prev) => (prev - 1 + groupedRanks.length) % groupedRanks.length);
    };

    const currentTier = groupedRanks[currentTierIndex];
    const currentRank = ranks[currentRankId];

    return (
        <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={onClose}>
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-indigo-700 relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                <h2 className="text-2xl font-bold text-white mb-4 text-center">Corporate Ranks</h2>
                <div className="flex items-center justify-between mb-4">
                    <button onClick={handlePrev} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <h3 className="text-xl font-bold text-indigo-400">{currentTier.name}</h3>
                    <button onClick={handleNext} className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </div>
                <div className="grid grid-cols-5 gap-4">
                    {currentTier.ranks.map(rank => (
                        <div key={rank.image} className={`p-4 rounded-lg border-2 flex flex-col items-center gap-2 transition-all ${currentRank.name === rank.name && currentRank.level === rank.level ? 'border-indigo-500 shadow-lg shadow-indigo-500/50' : 'border-slate-700'}`}>
                            <div className="w-20 h-20">
                                <img src={`assets/ranks/${rank.image}`} alt={rank.name} className="w-full h-full object-contain" />
                            </div>
                            <span className="font-bold text-white text-center text-sm">{rank.name} {rank.level}</span>
                        </div>
                    ))}
                </div>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default RanksModal;
