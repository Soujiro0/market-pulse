import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import MarketCard from '@/components/ui/MarketCard';
import MarketListItem from '@/components/ui/MarketListItem';
import { Globe, Landmark, LayoutGrid, List, DollarSign, RefreshCw, TrendingUp, TrendingDown, Minus, Activity, CheckCircle, BadgePercent, CalendarClock, ArrowUp, ArrowDown, CaseSensitive, Zap as HypeIcon, Gem, X } from 'lucide-react';
import { formatMoney } from '@/utils';
import { CLIMATES } from '@/constants';
import { useState, useEffect, useMemo } from 'react';

const nearingMessages = [
    "The deadline is approaching. Best to get your finances in order.",
    "Your due date is just around the corner. Don't be late.",
    "Time is ticking. Your payment is due soon.",
    "The bank is expecting your payment shortly. Don't disappoint.",
    "A friendly reminder: your loan payment is due soon."
];

const dueTodayMessages = [
    "Today's the day. The bank wants its money back.",
    "Time to pay up. The collectors are waiting.",
    "The deadline is now. Settle your debt immediately.",
    "Your account is due for settlement. No more delays.",
    "Last call! Your payment is due today."
];

const overdueMessages = [
    "You're late. The interest is piling up.",
    "Every turn you delay costs you more. Pay up.",
    "The bank is not a charity. Settle your overdue account.",
    "Your credit score is taking a hit. Pay your debt now.",
    "You've been given a grace period. Don't waste it."
];

const payableMessages = [
    "The time has come. You can now settle your debt.",
    "Ready to clear your name? The 'Settle Debt' button is active.",
    "Your loan has matured. Time to pay it off.",
    "The bank is ready to receive your payment.",
    "End your debt today. The settlement option is now available."
];

const MarketPage = () => {
    const { state, toggleMarketView, setCurrentProduct, toggleLoanModal, payLoan, rerollMarket, toggleLoadingOverlay } = useGame();
    const navigate = useNavigate();
    const [marketKey, setMarketKey] = useState(1);
    const [showPaymentConfirmation, setShowPaymentConfirmation] = useState(false);
    const [loanQuote, setLoanQuote] = useState('');
    const [quoteKey, setQuoteKey] = useState(0); // New state for animation key
    const [sortConfig, setSortConfig] = useState(null);

    const sortedProducts = useMemo(() => {
        let sortableItems = [...state.activeProducts];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                if (sortConfig.key === 'rarity') {
                    aValue = a.rarity.mult;
                    bValue = b.rarity.mult;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [state.activeProducts, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const toggleSortDirection = () => {
        if (sortConfig) {
            setSortConfig(prevConfig => ({
                ...prevConfig,
                direction: prevConfig.direction === 'ascending' ? 'descending' : 'ascending'
            }));
        }
    };

    useEffect(() => {
        let intervalId;
        const updateQuote = () => {
            if (state.loan.active) {
                const turnsRemaining = state.loan.dueTurn - state.turn;
                let messages = [];
                if (turnsRemaining < 0) {
                    messages = overdueMessages;
                } else if (turnsRemaining === 0) {
                    messages = dueTodayMessages;
                } else if (turnsRemaining <= 3) {
                    messages = nearingMessages;
                } else if (state.turn >= state.loan.dueTurn) {
                    messages = payableMessages;
                }

                if (messages.length > 0) {
                    setLoanQuote(messages[Math.floor(Math.random() * messages.length)]);
                    setQuoteKey(prevKey => prevKey + 1); // Increment key to trigger animation
                } else {
                    setLoanQuote('');
                    setQuoteKey(prevKey => prevKey + 1); // Increment key even if empty
                }
            } else {
                setLoanQuote(''); // Clear quote if loan is not active
                setQuoteKey(prevKey => prevKey + 1); // Increment key even if empty
            }
        };

        updateQuote(); // Set initial quote
        intervalId = setInterval(updateQuote, 10000); // Update every 10 seconds

        return () => clearInterval(intervalId); // Cleanup on unmount
    }, [state.loan.active, state.loan.dueTurn, state.turn]);

    const handleRerollMarket = () => {
        rerollMarket();
        setMarketKey(prevKey => prevKey + 1);
    };

    const handleProductClick = (product) => {
        setCurrentProduct(product);
        navigate('/trading');
    };

    const handlePayLoan = () => {
        toggleLoadingOverlay(true);
        setTimeout(() => {
            payLoan();
            toggleLoadingOverlay(false);
            setShowPaymentConfirmation(true);
        }, 1500); // Simulate processing time
    };

    // Calculate reroll cost
    const basePrice = state.rerollCount === 0 ? Math.floor(state.balance * 0.05) : state.rerollBasePrice;
    const incrementCost = Math.floor(state.balance * 0.01) * state.rerollCount;
    const rerollCost = basePrice + incrementCost;
    const canReroll = state.balance > 0 && state.balance >= rerollCost;

    const climateData = CLIMATES[state.marketClimate] || CLIMATES['Stable'];

    const ClimateIcon = () => {
        switch (climateData.icon) {
            case 'trending-up': return <TrendingUp className="w-4 h-4" />;
            case 'trending-down': return <TrendingDown className="w-4 h-4" />;
            case 'minus': return <Minus className="w-4 h-4" />;
            case 'activity': return <Activity className="w-4 h-4" />;
            default: return <Minus className="w-4 h-4" />;
        }
    };

    const sortOptions = [
        { key: 'name', label: 'Name', icon: CaseSensitive },
        { key: 'currentPrice', label: 'Price', icon: DollarSign },
        { key: 'hype', label: 'Hype', icon: HypeIcon },
        { key: 'rarity', label: 'Rarity', icon: Gem }
    ];

    return (
        <div className="space-y-6 fade-in relative pb-20">
            <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-8 glass-panel p-6 rounded-xl">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                            <Globe className="w-6 h-6 text-indigo-500" /> Global Ventures
                        </h2>
                        <div className="flex items-center gap-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700">
                            <button
                                onClick={handleRerollMarket}
                                disabled={!canReroll}
                                className={`px-4 py-2 rounded font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
                                    canReroll
                                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                        : 'bg-slate-800 text-slate-600 cursor-not-allowed'
                                }`}
                                title={!canReroll ? 'Insufficient capital' : `Base: 5% + ${state.rerollCount}% increment`}
                            >
                                <RefreshCw className="w-3 h-3" />
                                Reroll {formatMoney(rerollCost)}
                            </button>
                        </div>
                    </div>
                    <div className="glass-panel p-4 rounded-xl flex justify-between items-center border border-slate-700">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Year</p>
                                <p className="font-mono text-2xl font-bold text-slate-200">{state.turn}</p>
                            </div>
                            <div className="h-8 w-px bg-slate-700"></div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Liquidity</p>
                                <p className={`font-mono text-2xl font-bold transition-all ${state.balance < 0 ? 'text-red-500' : 'text-emerald-400'}`}>
                                    {formatMoney(state.balance)}
                                </p>
                            </div>
                            <div className="h-8 w-px bg-slate-700"></div>
                            <div>
                                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Market Climate</p>
                                <div className="flex items-center gap-2">
                                    <span className={climateData.color}>
                                        <ClimateIcon />
                                    </span>
                                    <span className="font-mono text-lg font-bold text-slate-200">{state.marketClimate}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Loan Bank Card */}
                <div className="lg:col-span-4 bg-slate-800 p-6 rounded-xl border border-slate-700 relative overflow-hidden group hover:border-slate-600 transition-colors shadow-lg">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="relative z-10 h-full flex flex-col justify-between">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-slate-200 flex items-center gap-2">
                                <Landmark className="w-5 h-5 text-indigo-400" /> Loan Bank
                            </h3>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide ${state.loan.active ? 'bg-red-900/30 text-red-500 border border-red-900 animate-pulse' : 'bg-slate-900 border border-slate-700 text-slate-500'}`}>
                                {state.loan.active ? 'ACTIVE' : 'STANDBY'}
                            </span>
                        </div>

                        {!state.loan.active ? (
                            <div id="bank-no-loan" className="text-center">
                                <div className="p-6 bg-slate-900/50 rounded-lg border border-slate-700 mb-4">
                                    <p className="text-base text-slate-400 leading-tight">Access credit lines to leverage capital. Default risk applies.</p>
                                </div>
                                <button onClick={() => toggleLoanModal(true)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                                    <DollarSign className="w-4 h-4" />
                                    Request Liquidity
                                </button>
                            </div>
                        ) : (
                            <div id="bank-active-loan" className="space-y-4">
                                {loanQuote && (
                                    <div key={quoteKey} className="relative bg-slate-900/50 p-3 rounded-lg border border-slate-700 fade-in">
                                        <p className="text-base text-slate-300 italic text-center font-semibold">"{loanQuote}"</p>
                                        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-900/50 border-b border-r border-slate-700 transform rotate-45"></div>
                                    </div>
                                )}
                                <div className="p-4 bg-red-900/20 rounded-lg border border-red-800/50 text-center">
                                    <p className="text-xs text-red-400 uppercase font-bold">Liability</p>
                                    <p id="loan-amount-display" className="font-mono text-2xl font-bold text-red-400">{formatMoney(state.loan.amount)}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-center gap-1"><BadgePercent className="w-3 h-3" /> Rate</p>
                                        <p id="loan-rate-display" className="font-mono font-bold text-slate-300 mt-1">{(state.loan.interestRate * 100).toFixed(0)}%</p>
                                    </div>
                                    <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700 text-center">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center justify-center gap-1"><CalendarClock className="w-3 h-3" /> Due Date</p>
                                        <p id="loan-due-display" className="font-mono font-bold text-slate-300 mt-1">Year {state.loan.dueTurn}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handlePayLoan}
                                    disabled={state.turn < state.loan.dueTurn}
                                    className="w-full py-3 bg-emerald-700/80 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors mt-2 uppercase tracking-wide flex items-center justify-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" />
                                    Settle Debt
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter and View Controls */}
            <div className="glass-panel p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {sortOptions.map(({ key, label, icon: Icon }) => (
                        <button
                            key={key}
                            onClick={() => requestSort(key)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 border ${
                                sortConfig && sortConfig.key === key
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30 border-indigo-500'
                                    : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white border-slate-700'
                            }`}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </button>
                    ))}
                    <button onClick={toggleSortDirection} className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-white" disabled={!sortConfig}>
                        {sortConfig && sortConfig.direction === 'ascending' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setSortConfig(null)} className="p-2 bg-slate-800 rounded-lg border border-slate-700 text-white">
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => toggleMarketView('grid')}
                        className={`p-2 rounded ${state.marketViewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white'} transition-colors`}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => toggleMarketView('list')}
                        className={`p-2 rounded ${state.marketViewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-800 text-slate-500 hover:bg-indigo-600 hover:text-white'} transition-colors`}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Enhanced Product Grid/List Container */}
            <div key={marketKey} id="product-grid" className={state.marketViewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                {sortedProducts.map((product, index) => (
                    state.marketViewMode === 'grid' ? (
                        <MarketCard key={product.id} product={product} onClick={handleProductClick} index={index} />
                    ) : (
                        <MarketListItem key={product.id} product={product} onClick={handleProductClick} index={index} />
                    )
                ))}
            </div>

            {/* Payment Confirmation Modal */}
            {showPaymentConfirmation && (
                <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-emerald-700 relative animate-bounce-in">
                        <div className="text-center">
                            <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Loan Settled!</h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm">
                                Your outstanding debt has been successfully paid off. You are now free from financial obligations.
                            </p>
                            <button
                                onClick={() => setShowPaymentConfirmation(false)}
                                className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                            >
                                Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MarketPage;
