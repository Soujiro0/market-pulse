import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import items from '@/data/items.json';
import { formatMoney } from '@/utils';
import { Package, TrendingUp, DollarSign, Calendar, X, AlertCircle, CheckCircle, ShoppingCart } from 'lucide-react';

const CollectionCard = ({ item, collectionData, onSell }) => {
    const [showSellModal, setShowSellModal] = useState(false);
    
    const sellPrice = Math.floor(collectionData.purchasePrice * 0.65); // 65% of purchase price

    const handleSell = () => {
        onSell(collectionData);
        setShowSellModal(false);
    };

    return (
        <>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 hover:border-indigo-500 transition-all">
                <div className="flex items-center gap-4 mb-3">
                    <div className="w-20 h-20 bg-slate-900 rounded-md flex items-center justify-center shrink-0">
                        <img src={`assets/items/${item.image}`} alt={item.name} className="w-16 h-16 object-contain" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-white text-lg">{item.name}</h3>
                        <p className="text-xs text-slate-400 italic">"{item.flavorText}"</p>
                    </div>
                </div>
                
                <div className="space-y-2 mb-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1">
                            <DollarSign className="w-3 h-3" /> Purchase Price
                        </span>
                        <span className="font-mono font-bold text-emerald-400">{formatMoney(collectionData.purchasePrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1">
                            <TrendingUp className="w-3 h-3" /> Sell Value
                        </span>
                        <span className="font-mono font-bold text-orange-400">{formatMoney(sellPrice)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Acquired
                        </span>
                        <span className="font-mono text-slate-300">Turn {collectionData.acquiredTurn}</span>
                    </div>
                </div>

                <button
                    onClick={() => setShowSellModal(true)}
                    className="w-full py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                    <ShoppingCart className="w-4 h-4" />
                    Sell for {formatMoney(sellPrice)}
                </button>
            </div>

            {/* Sell Confirmation Modal */}
            {showSellModal && (
                <div className="fixed inset-0 bg-slate-950/90 z-200 flex items-center justify-center p-4 backdrop-blur-sm fade-in" onClick={() => setShowSellModal(false)}>
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-orange-700 relative animate-bounce-in" onClick={e => e.stopPropagation()}>
                        <div className="text-center">
                            <AlertCircle className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Sell Collectible?</h3>
                            <p className="text-slate-300 mb-2 leading-relaxed text-sm">
                                Are you sure you want to sell <span className="font-bold text-indigo-400">{item.name}</span>?
                            </p>
                            <div className="bg-slate-800 rounded-lg p-3 mb-4">
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-slate-400">Purchase Price:</span>
                                    <span className="font-mono text-slate-300">{formatMoney(collectionData.purchasePrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Sell Price (65%):</span>
                                    <span className="font-mono text-orange-400 font-bold">{formatMoney(sellPrice)}</span>
                                </div>
                                <div className="flex justify-between text-sm mt-2 pt-2 border-t border-slate-700">
                                    <span className="text-slate-400">Loss:</span>
                                    <span className="font-mono text-red-400 font-bold">-{formatMoney(collectionData.purchasePrice - sellPrice)}</span>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowSellModal(false)}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all bg-slate-700 hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSell}
                                    className="flex-1 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-orange-600 hover:bg-orange-500"
                                >
                                    Sell
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

                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <Package className="w-8 h-8 text-indigo-500" />
                        My Collection
                    </h1>
                    <button
                        onClick={() => navigate('/collection-market')}
                        className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg flex items-center gap-2"
                    >
                        <ShoppingCart className="w-5 h-5" />
                        Collection Market
                    </button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="glass-panel p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Total Items</p>
                        <p className="text-3xl font-bold text-white">{collection.length}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Purchase Value</p>
                        <p className="text-3xl font-bold text-emerald-400">{formatMoney(totalValue)}</p>
                    </div>
                    <div className="glass-panel p-4 rounded-xl">
                        <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1">Current Value (65%)</p>
                        <p className="text-3xl font-bold text-orange-400">{formatMoney(totalSellValue)}</p>
                    </div>
                </div>

                {/* Collection Grid */}
                {collection.length === 0 ? (
                    <div className="glass-panel p-12 rounded-xl text-center">
                        <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-slate-400 mb-2">No Collectibles Yet</h2>
                        <p className="text-slate-500 mb-6">Visit the Collection Market to start building your collection!</p>
                        <button
                            onClick={() => navigate('/collection-market')}
                            className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all shadow-lg inline-flex items-center gap-2"
                        >
                            <ShoppingCart className="w-5 h-5" />
                            Go to Collection Market
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {collection.map((collectionData) => {
                            const item = items.find(i => i.name === collectionData.itemName);
                            if (!item) return null;
                            return (
                                <CollectionCard
                                    key={collectionData.id}
                                    item={item}
                                    collectionData={collectionData}
                                    onSell={handleSell}
                                />
                            );
                        })}
                    </div>
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
