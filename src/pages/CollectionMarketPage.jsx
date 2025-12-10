import { useState, useMemo, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import items from '@/data/items.json';
import { formatMoney } from '@/utils';
import { RARITY } from '@/constants';
import { ShoppingCart, Package, Box, Zap, Star, Crown, X, CheckCircle, AlertCircle, HelpCircle, RefreshCw, DollarSign } from 'lucide-react';

// Global timer state that persists across component mounts
let globalTimerStart = Date.now();
let globalMarketKey = 0;

const RarityIcon = ({ iconName, className }) => {
    switch (iconName) {
        case RARITY.STANDARD.icon: return <Box className={className} />;
        case RARITY.EMERGING.icon: return <Zap className={className} />;
        case RARITY.DISRUPTIVE.icon: return <Star className={className} />;
        case RARITY.UNICORN.icon: return <Crown className={className} />;
        default: return <Box className={className} />;
    }
};

const CollectionMarketCard = ({ item, price, rarity, onBuy, isOwned, isLocked, isPurchased, index, collection }) => {
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleBuy = () => {
        onBuy(item, price, rarity);
        setShowBuyModal(false);
    };

    const animationDelay = `${index * 100}ms`;
    const shouldShine = rarity.id === 'disruptive' || rarity.id === 'unicorn';

    return (
        <>
            <div 
                className={`relative rounded-xl border-2 ${rarity.border} bg-slate-900 transition-all duration-300 overflow-hidden group hover:scale-105 hover:shadow-2xl ${rarity.glow} animate-roll-in ${
                    isPurchased ? 'opacity-60' : isLocked ? 'opacity-50' : ''
                }`}
                style={{ animationDelay }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Effect */}
                {!isLocked && !isPurchased && (
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${rarity.glow} blur-xl -z-10`}></div>
                )}

                {/* Shine Effect - Only for Disruptive and Unicorn */}
                {shouldShine && !isLocked && !isPurchased && (
                    <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                )}

                {/* Rarity Badge */}
                <div className="absolute top-3 left-3 z-10">
                    <div className={`px-2 py-1 rounded-lg ${rarity.bg} ${rarity.border} border text-[10px] font-bold uppercase flex items-center gap-1`}>
                        <span className={rarity.color}>{rarity.id}</span>
                    </div>
                </div>

                {/* Owned Badge - Show count if owned */}
                {isOwned && !isLocked && (() => {
                    const ownedCount = collection.filter(c => c.itemName === item.name).length;
                    return (
                        <div className="absolute top-3 right-3 z-10">
                            <div className={`${rarity.bg} rounded-lg px-2 py-1 shadow-lg border ${rarity.border} flex items-center gap-1`}>
                                <CheckCircle className="w-4 h-4 text-white" />
                                <span className="text-white text-xs font-bold">x{ownedCount}</span>
                            </div>
                        </div>
                    );
                })()}

                <div className="p-5 flex flex-col h-full">

                    {/* Item Image */}
                    <div className="flex-1 flex items-center justify-center mb-4">
                        <div className={`w-32 h-32 flex items-center justify-center transition-transform duration-300 ${
                            isHovered && !isLocked ? 'scale-110 rotate-3' : ''
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
                                    className={`max-w-full max-h-full object-contain ${
                                        rarity.id === 'unicorn' ? 'filter drop-shadow-[0_0_15px_rgba(234,179,8,0.6)]' :
                                        rarity.id === 'disruptive' ? 'filter drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]' :
                                        rarity.id === 'emerging' ? 'filter drop-shadow-[0_0_15px_rgba(99,102,241,0.6)]' :
                                        'filter drop-shadow-[0_0_15px_rgba(59,130,246,0.6)]'
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

                    {/* Stats Grid */}
                    <div className="space-y-2 mb-4">
                        <div className={`bg-slate-900/80 rounded-lg p-2 border ${rarity.border}`}>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Price
                                </span>
                                <span className={`font-mono font-bold ${rarity.color} text-sm`}>{formatMoney(price)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Action Button */}
                    <button
                        onClick={() => !isLocked && !isPurchased && setShowBuyModal(true)}
                        disabled={isLocked || isPurchased}
                        className={`w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                            isPurchased
                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                : isLocked
                                ? 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
                                : isOwned
                                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105'
                        }`}
                    >
                        {isPurchased ? (
                            <>
                                <CheckCircle className="w-4 h-4" />
                                Purchased
                            </>
                        ) : isLocked ? (
                            <>
                                <HelpCircle className="w-4 h-4" />
                                Locked
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-4 h-4" />
                                {isOwned ? 'Buy Another' : 'Purchase'}
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Buy Confirmation Modal */}
            {showBuyModal && !isPurchased && (
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
    const [marketKey, setMarketKey] = useState(globalMarketKey);
    const [timeUntilRefresh, setTimeUntilRefresh] = useState(() => {
        const elapsed = Math.floor((Date.now() - globalTimerStart) / 1000);
        return Math.max(1, 300 - (elapsed % 300));
    });
    const [purchasedThisRefresh, setPurchasedThisRefresh] = useState([]);

    // Countdown timer that syncs with global state
    useEffect(() => {
        const updateTimer = () => {
            const elapsed = Math.floor((Date.now() - globalTimerStart) / 1000);
            const remaining = 300 - (elapsed % 300);
            
            // Check if we need to refresh the market
            if (remaining >= 300 || elapsed >= 300 * (globalMarketKey + 1)) {
                globalMarketKey += 1;
                globalTimerStart = Date.now();
                setMarketKey(globalMarketKey);
                setTimeUntilRefresh(300);
                setPurchasedThisRefresh([]);
            } else {
                setTimeUntilRefresh(Math.max(1, remaining));
            }
        };

        // Initial update
        updateTimer();
        
        // Update every second
        const timer = setInterval(updateTimer, 1000);
        return () => clearInterval(timer);
    }, []);

    // Generate market prices based on rarity - select 5 random items
    const marketPrices = useMemo(() => {
        // Shuffle items and take only 5
        const shuffledItems = [...items].sort(() => 0.5 - Math.random()).slice(0, 5);
        
        return shuffledItems.map(item => {
            // Determine rarity based on random roll (lower rates for rare items)
            const rRoll = Math.random();
            let rarity = RARITY.STANDARD;
            if (rRoll > 0.99) rarity = RARITY.UNICORN; // 1% chance (was 5%)
            else if (rRoll > 0.95) rarity = RARITY.DISRUPTIVE; // 4% chance (was 10%)
            else if (rRoll > 0.65) rarity = RARITY.EMERGING; // 30% chance (was 40%)

            // Base price range depending on rarity (premium collectibles)
            let minPrice, maxPrice;
            switch (rarity.id) {
                case 'unicorn':
                    minPrice = 30000000; // Ultra rare
                    maxPrice = 50000000;
                    break;
                case 'disruptive':
                    minPrice = 10000000; // Very rare
                    maxPrice = 25000000;
                    break;
                case 'emerging':
                    minPrice = 3500000; // Uncommon
                    maxPrice = 7500000;
                    break;
                default: // standard
                    minPrice = 10000000; // Common
                    maxPrice = 30000000;
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

    const handleBuy = (item, price, rarity) => {
        // Check if already purchased this refresh
        if (purchasedThisRefresh.includes(item.name)) {
            setErrorMessage('You already purchased this item. Wait for the market to refresh.');
            setShowErrorModal(true);
            return;
        }

        const result = buyCollectible(item.name, price, rarity.id);
        
        if (result.success) {
            setBoughtItem({ name: item.name, price });
            setPurchasedThisRefresh(prev => [...prev, item.name]); // Track purchase
            setShowSuccessModal(true);
        } else {
            setErrorMessage(result.message);
            setShowErrorModal(true);
        }
    };

    const collection = state.collection || [];
    const seenItems = state.seenItems || [];
    // Check if player owns at least one copy for visual indicator
    const ownedItemNames = [...new Set(collection.map(c => c.itemName))];

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
                            const isPurchased = purchasedThisRefresh.includes(item.name);
                            
                            return (
                                    <CollectionMarketCard
                                    key={`${marketKey}-${item.id}`}
                                    item={item}
                                    price={marketData.price}
                                    rarity={marketData.rarity}
                                    onBuy={(item, price) => handleBuy(item, price, marketData.rarity)}
                                    isOwned={isOwned}
                                    isLocked={isLocked}
                                    isPurchased={isPurchased}
                                    index={index}
                                    collection={collection}
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
