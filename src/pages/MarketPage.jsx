// src/pages/MarketPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../contexts/GameContext';
import MarketCard from '../components/ui/MarketCard';
import MarketListItem from '../components/ui/MarketListItem';
import { Globe, Landmark, LayoutGrid, List, DollarSign, RefreshCw, TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';
import { formatMoney } from '../utils';
import { CLIMATES } from '../constants';

const MarketPage = () => {
    const { state, toggleMarketView, setCurrentProduct, toggleLoanModal, payLoan, rerollMarket } = useGame();
    const navigate = useNavigate();

    const handleProductClick = (product) => {
        setCurrentProduct(product);
        navigate('/trading');
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

    return (
        <div className="space-y-6 fade-in relative pb-20">
                            <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group mb-4" onClick={() => navigate('/')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> <span className="font-semibold text-sm font-mono uppercase">Back to Home</span>
                </div>
            {/* Game Status Bar */}
            <div className="glass-panel p-4 rounded-xl flex justify-between items-center">
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

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Market Info */}
                <div className="lg:col-span-8 glass-panel p-6 rounded-xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
                                <Globe className="w-6 h-6 text-indigo-500" /> Global Ventures
                            </h2>
                            <p className="text-slate-400 text-sm mt-1">
                                Sourcing <span className="font-bold text-indigo-400">10</span> potential assets. Signal strength: STRONG.
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={rerollMarket}
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
                            <div className="h-8 w-px bg-slate-700"></div>
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
                            <div id="bank-no-loan">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 rounded bg-slate-900 flex items-center justify-center border border-slate-700 text-slate-600">
                                        <DollarSign className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs text-slate-400 leading-tight">Access credit lines to leverage capital. Default risk applies.</p>
                                </div>
                                <button onClick={() => toggleLoanModal(true)} className="w-full py-2.5 bg-slate-700 hover:bg-indigo-600 hover:text-white text-slate-300 text-xs font-bold uppercase tracking-wider rounded transition-all shadow-md">
                                    Request Liquidity
                                </button>
                            </div>
                        ) : (
                            <div id="bank-active-loan" className="space-y-3 bg-slate-900/50 p-3 rounded border border-red-900/30">
                                <div className="flex justify-between items-baseline border-b border-slate-700 pb-2">
                                    <span className="text-xs text-red-400 uppercase font-bold">Liability</span>
                                    <span id="loan-amount-display" className="font-mono text-lg font-bold text-red-500">{formatMoney(state.loan.amount)}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-slate-500 block">Rate</span>
                                        <span id="loan-rate-display" className="font-mono font-bold text-slate-300">{(state.loan.interestRate * 100).toFixed(0)}%</span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-slate-500 block">Maturity</span>
                                        <span id="loan-due-display" className="font-mono font-bold text-slate-300">Y-{state.loan.dueTurn - state.turn}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={payLoan}
                                    disabled={state.turn < state.loan.dueTurn}
                                    className="w-full py-2 bg-emerald-700/80 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-xs font-bold rounded transition-colors mt-2 uppercase tracking-wide"
                                >
                                    Settle Debt
                                </button>
                                {state.turn < state.loan.dueTurn && (
                                    <p id="loan-lock-msg" className="text-[9px] text-center text-slate-500 font-mono">LOCKED UNTIL YEAR {state.loan.dueTurn}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Enhanced Product Grid/List Container */}
            <div id="product-grid" className={state.marketViewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "flex flex-col gap-3"}>
                {state.activeProducts.map(product => (
                    state.marketViewMode === 'grid' ? (
                        <MarketCard key={product.id} product={product} onClick={handleProductClick} />
                    ) : (
                        <MarketListItem key={product.id} product={product} onClick={handleProductClick} />
                    )
                ))}
            </div>
        </div>
    );
};

export default MarketPage;
