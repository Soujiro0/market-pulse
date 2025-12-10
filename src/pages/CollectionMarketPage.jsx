import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import items from '@/data/items.json';
import { formatMoney } from '@/utils';
import { RARITY } from '@/constants';
import { ShoppingCart, Package, Box, Zap, Star, Crown, X, CheckCircle, AlertCircle, HelpCircle, RefreshCw, DollarSign } from 'lucide-react';

const RarityIcon = ({ iconName, className }) => {
    switch (iconName) {
        case RARITY.STANDARD.icon: return <Box className={className} />;
        case RARITY.EMERGING.icon: return <Zap className={className} />;
        case RARITY.DISRUPTIVE.icon: return <Star className={className} />;
        case RARITY.UNICORN.icon: return <Crown className={className} />;
        default: return <Box className={className} />;
    }
};

const CollectionMarketCard = ({ item, price, rarity, onBuy, isOwned, isLocked, index }) => {
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleBuy = () => {
        onBuy(item, price);
        setShowBuyModal(false);
    };

    const glowClass = rarity.label === 'Blue Chip' ? 'hover:shadow-blue-500/30' :
                      rarity.label === 'Growth' ? 'hover:shadow-indigo-500/30' :
                      rarity.label === 'High-Risk' ? 'hover:shadow-purple-500/30' :
                      rarity.label === 'Moonshot' ? 'hover:shadow-yellow-500/30' : '';

    const animationDelay = `${index * 100}ms`;

    return (
        <>
            <div 
                className={`relative rounded-xl border-2 transition-all duration-300 overflow-hidden group cursor-pointer animate-roll-in ${
                    isOwned 
                        ? 'border-emerald-500/50 bg-emerald-900/10' 
                        : isLocked
                        ? 'border-slate-700 bg-slate-900/50'
                        : `${rarity.border} bg-slate-900 hover:scale-105 hover:shadow-2xl ${glowClass}`
                }`}
                style={{ animationDelay }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Rarity Glow Effect */}
                {!isOwned && !isLocked && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${rarity.glow} blur-xl -z-10`}></div>
                )}

                {/* Shine Effect for High Rarities */}
                {!isOwned && !isLocked && (rarity.id === 'unicorn' || rarity.id === 'disruptive') && (
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}

                {/* Owned Badge */}
                {isOwned && !isLocked && (
                    <div className="absolute top-2 right-2 z-10">
                        <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg animate-pulse">
                            <CheckCircle className="w-5 h-5 text-white" />
                        </div>
                    </div>
                )}

                <div className="p-5 flex flex-col h-full">
                    {/* Rarity Badge */}
                    <div className="flex justify-between items-start mb-3">
                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded ${rarity.bg} ${rarity.color} border ${rarity.border} flex items-center gap-1 shadow-md`}>
                            <RarityIcon iconName={rarity.icon} className="w-3 h-3" /> {rarity.label}
                        </span>
                    </div>

                    {/* Item Image */}
                    <div className="flex-1 flex items-center justify-center mb-4 relative">
                        <div className={`w-32 h-32 flex items-center justify-center transition-transform duration-300 ${
                            isHovered && !isOwned && !isLocked ? 'scale-110 rotate-6' : ''
                        }`}>
                            {isLocked ? (
                                <div className="relative">
                                    <HelpCircle className="w-24 h-24 text-slate-600 animate-pulse" />
                                    <div className="absolute inset-0 bg-slate-900/50"></div>
                                </div>
                            ) : (
                                <img 
                                    src={`assets/items/${item.image}`} 
                                    alt={item.name} 
                                    className={`max-w-full max-h-full object-contain drop-shadow-2xl ${
                                        rarity.id === 'unicorn' ? 'filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]' :
                                        rarity.id === 'disruptive' ? 'filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' : ''
                                    }`}
                                />
                            )}
                        </div>
                    </div>

                    {/* Item Info */}
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-white text-lg mb-1 leading-tight shadow-black drop-shadow-md">
                            {isLocked ? '???' : item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-tight">
                            {isLocked ? 'Discover in Global Venture' : `"${item.flavorText}"`}
                        </p>
                    </div>

                    {/* Price Tag */}
                    <div className="mb-3">
                        <div className="bg-slate-900/80 rounded-lg p-3 border border-slate-700 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-slate-400 uppercase font-bold">Price</span>
                                <span className="font-mono font-bold text-white text-xl">{formatMoney(price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => !isOwned && !isLocked && setShowBuyModal(true)}
                        disabled={isOwned || isLocked}
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider ${
                            isOwned
                                ? 'bg-emerald-600/50 text-emerald-300 cursor-not-allowed'
                                : isLocked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                : 'bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transform hover:-translate-y-0.5 active:translate-y-0'
                        }`}
                    >
                        {isOwned ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                Owned
                            </>
                        ) : isLocked ? (
                            <>
                                <HelpCircle className="w-5 h-5" />
                                Locked
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                Purchase
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Buy Confirmation Modal */}
            {showBuyModal && !isOwned && !isLocked && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={() => setShowBuyModal(false)}>
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-indigo-700 relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <ShoppingCart className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Purchase Collectible?</h3>
                            <div className="bg-slate-800 rounded-lg p-4 mb-4">
                                <div className="w-24 h-24 mx-auto bg-slate-900 rounded-lg flex items-center justify-center mb-3">
                                    <img src={`assets/items/${item.image}`} alt={item.name} className="w-20 h-20 object-contain" />
                                </div>
                                <p className="font-bold text-white text-lg mb-1">{item.name}</p>
                                <p className="text-xs text-slate-400 italic mb-3">"{item.flavorText}"</p>
                                <div className="flex justify-between items-center pt-3 border-t border-slate-700">
                                    <span className="text-slate-400">Price:</span>
                                    <span className="font-mono font-bold text-indigo-400 text-xl">{formatMoney(price)}</span>
                                </div>
                            </div>
                            <p className="text-slate-400 text-sm mb-4">
                                This collectible will be added to your collection. You can sell it later for 65% of the purchase price.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowBuyModal(false)}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all bg-slate-700 hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleBuy}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500"
                                >
                                    Buy
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setShowBuyModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const CollectionMarketPage = () => {
    const navigate = useNavigate();
    const { state, buyCollectible } = useGame();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [boughtItem, setBoughtItem] = useState(null);
    const [marketKey, setMarketKey] = useState(0);
    const [timeUntilRefresh, setTimeUntilRefresh] = useState(300); // 5 minutes in seconds

    // Auto-refresh market every 5 minutes
    useEffect(() => {
        const interval = setInterval(() => {
            setMarketKey(prev => prev + 1);
            setTimeUntilRefresh(300); // Reset timer
        }, 300000); // 300000ms = 5 minutes

        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeUntilRefresh(prev => {
                if (prev <= 1) return 300;
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Generate market prices based on rarity - select 5 random items
    const marketPrices = useMemo(() => {
        // Shuffle items and take only 5
        const shuffledItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        return shuffledItems.map(item => {
            // Determine rarity based on random roll
            const rRoll = Math.random();
            let rarity = RARITY.STANDARD;
            if (rRoll > 0.95) rarity = RARITY.UNICORN;
            else if (rRoll > 0.85) rarity = RARITY.DISRUPTIVE;
            else if (rRoll > 0.60) rarity = RARITY.EMERGING;

            // Base price range depending on rarity
            let minPrice, maxPrice;
            switch (rarity.id) {
                case 'unicorn':
                    minPrice = 8000;
                    maxPrice = 15000;
                    break;
                case 'disruptive':
                    minPrice = 3000;
                    maxPrice = 7000;
                    break;
                case 'emerging':
                    minPrice = 1000;
                    maxPrice = 2500;
                    break;
                default: // standard
                    minPrice = 300;
                    maxPrice = 900;
                    break;
            }

            const price = Math.floor(Math.random() * (maxPrice - minPrice + 1)) + minPrice;

            return {
                itemId: item.id,
                itemName: item.name,
                price,
                rarity
            };
        });
    }, [marketKey]); // Regenerate when marketKey changes

    const handleBuy = (item, price) => {
        const result = buyCollectible(item.name, price);
        
        if (result.success) {
            setBoughtItem({ name: item.name, price });
            setShowSuccessModal(true);
        } else {
            setErrorMessage(result.message);
            setShowErrorModal(true);
        }
    };

    const collection = state.collection || [];
    const seenItems = state.seenItems || [];
    const ownedItemNames = collection.map(c => c.itemName);

    return (
        <>
            <div className="space-y-6 fade-in pb-20">
                <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                    <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
                </div>

                {/* Header with animated title */}
                <div className="glass-panel p-6 rounded-2xl border border-indigo-500/30 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-indigo-400 tracking-tight flex items-center gap-3 mb-2 animate-pulse">
                                <ShoppingCart className="w-10 h-10 text-indigo-400" />
                                Collection Market
                            </h1>
                            <p className="text-slate-400 text-sm">
                                🎲 <span className="font-bold text-indigo-400">Limited Stock:</span> 5 exclusive items available now!
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/collection')}
                            className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 flex items-center gap-2"
                        >
                            <Package className="w-5 h-5" />
                            My Collection ({collection.length})
                        </button>
                    </div>
                </div>

                {/* Stats & Timer Banner */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Balance Card */}
                    <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Your Balance</p>
                                <p className="text-2xl font-bold text-emerald-400 font-mono">{formatMoney(state.balance)}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-emerald-400" />
                            </div>
                        </div>
                    </div>

                    {/* Refresh Timer Card */}
                    <div className="glass-panel p-5 rounded-xl border border-indigo-500/30 bg-indigo-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Next Refresh</p>
                                <p className="text-2xl font-bold text-indigo-400 font-mono">
                                    {Math.floor(timeUntilRefresh / 60)}:{String(timeUntilRefresh % 60).padStart(2, '0')}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-indigo-600/20 rounded-lg flex items-center justify-center">
                                <RefreshCw className={`w-7 h-7 text-indigo-400 ${timeUntilRefresh <= 10 ? 'animate-spin' : ''}`} />
                            </div>
                        </div>
                    </div>

                    {/* Shop Info Card */}
                    <div className="glass-panel p-5 rounded-xl border border-purple-500/30 bg-purple-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Available Items</p>
                                <p className="text-2xl font-bold text-purple-400 font-mono">5 / {items.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                                <Package className="w-7 h-7 text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="glass-panel p-4 rounded-xl border border-yellow-500/30 bg-yellow-900/10 mb-6">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5 shrink-0 animate-pulse" />
                        <div>
                            <p className="text-sm text-slate-200 font-bold mb-1">
                                💎 Premium Collectibles Shop
                            </p>
                            <p className="text-xs text-slate-400">
                                ⚡ Items rotate every 5 minutes • 💰 Prices vary by rarity • 🔒 Unlock items in Global Venture first • 📈 Resell for 65% value
                            </p>
                        </div>
                    </div>
                </div>

                {/* Market Grid */}
                <div className="mb-4">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="h-1 flex-1 bg-indigo-500/50 rounded-full"></div>
                        <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Featured Items</h2>
                        <div className="h-1 flex-1 bg-indigo-500/50 rounded-full"></div>
                    </div>
                    <div key={marketKey} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {marketPrices.map((marketData, index) => {
                            const item = items.find(i => i.id === marketData.itemId);
                            if (!item) return null;
                            
                            const isOwned = ownedItemNames.includes(item.name);
                            const isLocked = !seenItems.includes(item.name);
                            
                            return (
                                <CollectionMarketCard
                                    key={`${marketKey}-${item.id}`}
                                    item={item}
                                    price={marketData.price}
                                    rarity={marketData.rarity}
                                    onBuy={handleBuy}
                                    isOwned={isOwned}
                                    isLocked={isLocked}
                                    index={index}
                                />
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Success Modal */}
            {showSuccessModal && boughtItem && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-700 relative animate-bounce-in">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Purchase Successful!</h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                You purchased <span className="font-bold text-indigo-400">{boughtItem.name}</span> for <span className="font-bold text-emerald-400">{formatMoney(boughtItem.price)}</span>.
                            </p>
                            <p className="text-slate-400 text-xs mb-4">
                                This item has been added to your collection!
                            </p>
                            <button
                                onClick={() => setShowSuccessModal(false)}
                                className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Error Modal */}
            {showErrorModal && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-red-700 relative animate-bounce-in">
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Purchase Failed</h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                {errorMessage}
                            </p>
                            <button
                                onClick={() => setShowErrorModal(false)}
                                className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-red-600 hover:bg-red-500"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CollectionMarketPage;
