import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { RANKS } from '@/constants';

const RanksModal = ({ isOpen, onClose, currentRank }) => {
    if (!isOpen) return null;

    const ranksByTier = RANKS.reduce((acc, rank) => {
        if (!acc[rank.name]) {
            acc[rank.name] = [];
        }
        acc[rank.name].push(rank);
        return acc;
    }, {});

    return (
        <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-4xl w-full p-8 border border-indigo-700 relative animate-bounce-in">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <X className="w-6 h-6" />
                </button>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Ranks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {Object.entries(ranksByTier).map(([tier, ranks]) => (
                        <div key={tier} className="flex flex-col items-center">
                            <h4 className="text-lg font-bold text-white mb-2">{tier}</h4>
                            {ranks.map(rank => (
                                <div key={rank.image} className={`p-2 rounded-lg ${currentRank.name === rank.name && currentRank.level === rank.level ? 'bg-indigo-500' : ''}`}>
                                    <img src={`/market-pulse/assets/ranks/${rank.image}`} alt={`${rank.name} ${rank.level}`} className="w-16 h-16" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RanksModal;