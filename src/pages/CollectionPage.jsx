import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import items from '@/data/items.json';
import { formatMoney } from '@/utils';
import { Package, TrendingUp, DollarSign, Calendar, X, AlertCircle, CheckCircle, ShoppingCart, Sparkles, TrendingDown } from 'lucide-react';

const CollectionCard = ({ item, collectionData, onSell, index }) => {
    const [showSellModal, setShowSellModal] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const sellPrice = Math.floor(collectionData.purchasePrice * 0.65); // 65% of purchase price
    const loss = collectionData.purchasePrice - sellPrice;

    const handleSell = () => {
        onSell(collectionData);
        setShowSellModal(false);
    };

    const animationDelay = `${index * 80}ms`;

    return (
        <>
            <div 
                className="relative rounded-xl border-2 border-emerald-500/30 bg-slate-900 transition-all duration-300 overflow-hidden group hover:border-emerald-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/30 animate-roll-in"
                style={{ animationDelay }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-emerald-500/10 blur-xl -z-10"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {/* Owned Badge */}
                <div className="absolute top-3 right-3 z-10">
                    <div className="bg-emerald-500 rounded-full p-1.5 shadow-lg animate-pulse">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                </div>

                <div className="p-5 flex flex-col h-full">
                    {/* Item Image */}
                    <div className="flex-1 flex items-center justify-center mb-4">
                        <div className={`w-32 h-32 flex items-center justify-center transition-transform duration-300 ${
                            isHovered ? 'scale-110 rotate-3' : ''
                        }`}>
                            <img 
                                src={`assets/items/${item.image}`} 
                                alt={item.name} 
                                className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_15px_rgba(16,185,129,0.6)]"
                            />
                        </div>
                    </div>

                    {/* Item Info */}
                    <div className="text-center mb-4">
                        <h3 className="font-bold text-white text-lg mb-1 leading-tight shadow-black drop-shadow-md">
                            {item.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 italic line-clamp-2 leading-tight">
                            "{item.flavorText}"
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="space-y-2 mb-4">
                        <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <DollarSign className="w-3 h-3" /> Paid
                                </span>
                                <span className="font-mono font-bold text-emerald-400 text-sm">{formatMoney(collectionData.purchasePrice)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/80 rounded-lg p-2 border border-orange-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> Sell (65%)
                                </span>
                                <span className="font-mono font-bold text-orange-400 text-sm">{formatMoney(sellPrice)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/80 rounded-lg p-2 border border-red-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <TrendingDown className="w-3 h-3" /> Loss
                                </span>
                                <span className="font-mono font-bold text-red-400 text-sm">-{formatMoney(loss)}</span>
                            </div>
                        </div>
                        <div className="bg-slate-900/80 rounded-lg p-2 border border-slate-700">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-400 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> Year
                                </span>
                                <span className="font-mono font-bold text-slate-300 text-sm">#{collectionData.acquiredTurn}</span>
                            </div>
                        </div>
                    </div>

                    {/* Sell Button */}
                    <button
                        onClick={() => setShowSellModal(true)}
                        className="w-full py-3 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 uppercase tracking-wider bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Sell for {formatMoney(sellPrice)}
                    </button>
                </div>
            </div>

            {/* Sell Confirmation Modal */}
            {showSellModal && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={() => setShowSellModal(false)}>
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border-2 border-orange-500 relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <div className="relative inline-block mb-4">
                                <AlertCircle className="w-20 h-20 text-orange-400 animate-pulse" />
                                <div className="absolute inset-0 bg-orange-400/20 blur-2xl rounded-full"></div>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-3">Sell Collectible?</h3>
                            
                            <div className="bg-slate-800/50 rounded-xl p-4 mb-4 border border-slate-700">
                                <div className="w-24 h-24 mx-auto bg-slate-900 rounded-lg flex items-center justify-center mb-3 border-2 border-emerald-500/30">
                                    <img src={`assets/items/${item.image}`} alt={item.name} className="w-20 h-20 object-contain" />
                                </div>
                                <p className="font-bold text-white text-lg mb-1">{item.name}</p>
                                <p className="text-xs text-slate-400 italic mb-3">"{item.flavorText}"</p>
                            </div>

                            <div className="bg-slate-800 rounded-lg p-4 mb-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Purchase Price:</span>
                                    <span className="font-mono text-emerald-400 font-bold">{formatMoney(collectionData.purchasePrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Sell Price (65%):</span>
                                    <span className="font-mono text-orange-400 font-bold">{formatMoney(sellPrice)}</span>
                                </div>
                                <div className="h-px bg-slate-700"></div>
                                <div className="flex justify-between text-sm pt-1">
                                    <span className="text-slate-400 font-bold">You'll Lose:</span>
                                    <span className="font-mono text-red-400 font-bold text-lg">-{formatMoney(loss)}</span>
                                </div>
                            </div>

                            <p className="text-slate-400 text-xs mb-4">
                                ⚠️ This action cannot be undone. You'll receive 65% of what you paid.
                            </p>
                            
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSellModal(false)}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all bg-slate-700 hover:bg-slate-600 hover:scale-105"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSell}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500 hover:scale-105"
                                >
                                    Confirm Sale
                                </button>
                            </div>
                        </div>
                        <button onClick={() => setShowSellModal(false)} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

const CollectionPage = () => {
    const navigate = useNavigate();
    const { state, sellCollectible } = useGame();
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [soldItem, setSoldItem] = useState(null);

    const collection = state.collection || [];

    const handleSell = (collectionData) => {
        const item = items.find(i => i.name === collectionData.itemName);
        const sellPrice = Math.floor(collectionData.purchasePrice * 0.65);
        
        sellCollectible(collectionData.id);
        setSoldItem({ name: item?.name, price: sellPrice });
        setShowSuccessModal(true);
    };

    const totalValue = collection.reduce((sum, c) => sum + c.purchasePrice, 0);
    const totalSellValue = collection.reduce((sum, c) => sum + Math.floor(c.purchasePrice * 0.65), 0);

    return (
        <>
            <div className="space-y-6 fade-in pb-20">
                <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span>
                    <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
                </div>

                {/* Header with animated title */}
                <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-4xl font-bold text-emerald-400 tracking-tight flex items-center gap-3 mb-2 animate-pulse">
                                <Package className="w-10 h-10 text-emerald-400" />
                                My Collection
                            </h1>
                            <p className="text-slate-400 text-sm">
                                💎 <span className="font-bold text-emerald-400">Your Premium Assets:</span> {collection.length} collectible{collection.length !== 1 ? 's' : ''} owned
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/collection-market')}
                            className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Collection Market
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="glass-panel p-5 rounded-xl border border-cyan-500/30 bg-cyan-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Total Items</p>
                                <p className="text-3xl font-bold text-cyan-400 font-mono">{collection.length}</p>
                            </div>
                            <div className="w-12 h-12 bg-cyan-600/20 rounded-lg flex items-center justify-center">
                                <Package className="w-7 h-7 text-cyan-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border border-emerald-500/30 bg-emerald-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Purchase Value</p>
                                <p className="text-3xl font-bold text-emerald-400 font-mono">{formatMoney(totalValue)}</p>
                            </div>
                            <div className="w-12 h-12 bg-emerald-600/20 rounded-lg flex items-center justify-center">
                                <DollarSign className="w-7 h-7 text-emerald-400" />
                            </div>
                        </div>
                    </div>
                    <div className="glass-panel p-5 rounded-xl border border-orange-500/30 bg-orange-900/10 hover:scale-105 transition-transform">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-slate-400 uppercase font-bold mb-1">Current Value (65%)</p>
                                <p className="text-3xl font-bold text-orange-400 font-mono">{formatMoney(totalSellValue)}</p>
                            </div>
                            <div className="w-12 h-12 bg-orange-600/20 rounded-lg flex items-center justify-center">
                                <TrendingDown className="w-7 h-7 text-orange-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Collection Grid */}
                {collection.length === 0 ? (
                    <div className="glass-panel p-12 rounded-xl text-center border border-slate-700 bg-slate-900/50">
                        <div className="relative inline-block mb-6">
                            <Package className="w-24 h-24 text-slate-600 mx-auto animate-pulse" />
                            <div className="absolute inset-0 bg-slate-600/20 blur-3xl rounded-full"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-400 mb-3">Your Collection is Empty</h2>
                        <p className="text-slate-500 mb-8 max-w-md mx-auto">
                            Start your journey as a collector! Visit the Collection Market to discover and purchase exclusive items.
                        </p>
                        <button
                            onClick={() => navigate('/collection-market')}
                            className="px-8 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 inline-flex items-center gap-3"
                        >
                            <Sparkles className="w-6 h-6" />
                            Explore Collection Market
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="h-1 flex-1 bg-emerald-500/50 rounded-full"></div>
                            <h2 className="text-lg font-bold text-slate-400 uppercase tracking-wider">Your Assets</h2>
                            <div className="h-1 flex-1 bg-emerald-500/50 rounded-full"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {collection.map((collectionData, index) => {
                                const item = items.find(i => i.name === collectionData.itemName);
                                if (!item) return null;
                                return (
                                    <CollectionCard
                                        key={collectionData.id}
                                        item={item}
                                        collectionData={collectionData}
                                        onSell={handleSell}
                                        index={index}
                                    />
                                );
                            })}
                        </div>
                    </>
                )}
            </div>

            {/* Success Modal */}
            {showSuccessModal && soldItem && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-700 relative animate-bounce-in">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Collectible Sold!</h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                You sold <span className="font-bold text-indigo-400">{soldItem.name}</span> for <span className="font-bold text-emerald-400">{formatMoney(soldItem.price)}</span>.
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
        </>
    );
};

export default CollectionPage;
