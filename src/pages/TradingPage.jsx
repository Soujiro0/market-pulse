import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '@/contexts/GameContext';
import { formatMoney } from '@/utils';
import { Box, Zap, Star, Crown, HelpCircle } from 'lucide-react';
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

const TradingPage = () => {
    const { state, setTradeParams, executeTrade, toggleLoadingOverlay } = useGame();
    const { currentProduct, balance } = state;
    const navigate = useNavigate();

    const [duration, setDuration] = useState(90);
    const [units, setUnits] = useState(10);
    const [costBasis, setCostBasis] = useState(0);
    const [projectedNet, setProjectedNet] = useState(0);
    const [error, setError] = useState('');
    const [showMomentumHelp, setShowMomentumHelp] = useState(false);

    useEffect(() => {
        if (!currentProduct) {
            navigate('/market');
            return;
        }
    }, [currentProduct, navigate]);

    const calculateValues = useCallback(() => {
        if (!currentProduct) return;

        const currentPrice = currentProduct.currentPrice;
        const calculatedCost = units * currentPrice;
        const calculatedProjectedNet = balance - calculatedCost;

        setCostBasis(calculatedCost);
        setProjectedNet(calculatedProjectedNet);

        if (calculatedCost > balance) {
            if (units > 1) {
                setError("DEBT LIMIT: MAX 1 UNIT");
            } else {
                setError("OVERDRAFT");
            }
        } else if (calculatedCost === 0) {
            setError("Enter units to trade");
        } else {
            setError('');
        }
        setTradeParams(units, duration, calculatedCost);
    }, [currentProduct, balance, units, duration, setTradeParams]);

    useEffect(() => {
        calculateValues();
    }, [units, duration, calculateValues]);

    useEffect(() => {
        if (currentProduct) {
            const purchasingPower = Math.max(0, balance);
            const affordableUnits = Math.floor(purchasingPower / currentProduct.currentPrice);
            setUnits(affordableUnits > 0 ? Math.min(10, affordableUnits) : 1);
            setDuration(90);
        }
    }, [currentProduct, balance]);

    const handleExecuteTrade = () => {
        if (error && error !== "OVERDRAFT") return; // Prevent trade if there's a real error

        toggleLoadingOverlay(true);
        setTimeout(() => {
            toggleLoadingOverlay(false);
            executeTrade();
            navigate('/simulation');
        }, 2000);
    };

    if (!currentProduct) {
        return null; // Or a loading spinner/redirect
    }

    const r = currentProduct.rarity;
    const momText = currentProduct.momentum > 1.02 ? "Upward" : (currentProduct.momentum < 0.98 ? "Downward" : "Neutral");
    const momColor = currentProduct.momentum > 1.02 ? "text-emerald-400" : (currentProduct.momentum < 0.98 ? "text-red-400" : "text-slate-400");
    const purchasingPower = Math.max(0, balance);
    const affordableUnits = Math.floor(purchasingPower / currentProduct.currentPrice);

    return (
        <>

            <div className="max-w-5xl mx-auto space-y-6 fade-in h-full flex flex-col">
                <div className="flex items-center gap-2 text-slate-500 hover:text-white cursor-pointer transition-colors w-fit group" onClick={() => navigate('/market')}>
                    <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> <span className="font-semibold text-sm font-mono uppercase">Abort Transaction</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-grow">
                    {/* Asset Card */}
                    <div className="md:col-span-1 flex flex-col gap-6">
                        <div className={`glass-panel p-8 rounded-2xl h-fit relative overflow-hidden flex flex-col items-center text-center ${r.glow} ${r.bg} ${['disruptive', 'unicorn'].includes(r.id) ? 'shine-effect' : ''}`}>
                            <div className="relative z-10 w-full flex flex-col items-center">
                                <div className="flex items-center gap-2 mb-6">
                                    <RarityIcon iconName={r.icon} className={r.color} />
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-slate-900 border ${r.color} ${r.border}`}>{r.label}</span>
                                </div>

                                <div className="w-64 h-64 bg-slate-800 rounded-2xl shadow-inner border border-slate-700 flex items-center justify-center mb-6 relative">
                                    <img src={currentProduct.image} alt={currentProduct.name} className="max-w-full max-h-full object-contain" />
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl"></div>
                                </div>

                                <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{currentProduct.name}</h2>
                                <p className="text-xs text-slate-400 mb-4 italic px-4">"{currentProduct.desc}"</p>
                                <p className="font-mono text-3xl font-bold text-indigo-400 mb-6">{formatMoney(currentProduct.currentPrice)}</p>
                            </div>
                        </div>
                        <div className="glass-panel p-4 rounded-2xl">
                            <div className="w-full space-y-4 text-left">
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Multiplier Rate</span>
                                        <span className="text-[10px] font-bold text-slate-300 font-mono">x{r.mult.toFixed(1)}</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.5)] transition-all duration-500" style={{ width: `${currentProduct.volatility * 100}%` }}></div>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <div className="flex items-center gap-1">
                                            <span className="text-[10px] font-bold text-slate-500 uppercase">Momentum</span>
                                            <HelpCircle
                                                className="w-3 h-3 text-slate-500 hover:text-indigo-400 cursor-pointer transition-colors"
                                                onClick={() => setShowMomentumHelp(true)}
                                            />
                                        </div>
                                        <span className={`text-[10px] font-bold ${momColor}`}>{momText}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Form */}
                    <div className="md:col-span-2 flex flex-col">
                        <div className="glass-panel p-8 rounded-2xl h-full flex flex-col justify-between">
                            <div className="space-y-8">
                                <div className="border-b border-slate-700 pb-4">
                                    <h3 className="text-xl font-bold text-white mb-1 font-mono uppercase">Order Configuration</h3>
                                    <p className="text-sm text-slate-500">Set investment parameters.</p>
                                </div>

                                {/* Duration */}
                                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Horizon</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={duration}
                                                onChange={(e) => setDuration(parseInt(e.target.value) || 30)}
                                                className="w-24 p-1 bg-slate-800 border border-slate-600 rounded-lg font-mono text-sm text-white text-center focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hide-number-arrows"
                                            />
                                            <span className="text-xs text-slate-500">Days</span>
                                        </div>
                                    </div>
                                    <input
                                        type="range"
                                        min="30"
                                        max="365"
                                        step="1"
                                        value={duration}
                                        onChange={(e) => setDuration(parseInt(e.target.value))}
                                        className="w-full custom-slider"
                                    />
                                    <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                                        <span>30 Days</span>
                                        <span>365 Days</span>
                                    </div>
                                    <div className="flex justify-center gap-2 mt-4">
                                        <button onClick={() => setDuration(30)} className="text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-1 px-3 rounded-full transition-colors">30D</button>
                                        <button onClick={() => setDuration(90)} className="text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-1 px-3 rounded-full transition-colors">90D</button>
                                        <button onClick={() => setDuration(182)} className="text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-1 px-3 rounded-full transition-colors">6M</button>
                                        <button onClick={() => setDuration(365)} className="text-xs font-bold bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white py-1 px-3 rounded-full transition-colors">1Y</button>
                                    </div>
                                </div>

                                {/* Units */}
                                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                                    <div className="flex justify-between mb-2">
                                        <label className="text-xs font-bold text-slate-500 uppercase">Volume (Units)</label>
                                        {error && (
                                            <span className={`text-xs font-bold text-white px-2 py-1 rounded shadow-lg ${error === "OVERDRAFT" ? "bg-red-900/20 text-red-400 border border-red-900" : "bg-red-600 shadow-red-900/50"}`}>
                                                {error}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="number"
                                            min="1"
                                            value={units}
                                            onChange={(e) => setUnits(parseInt(e.target.value) || 0)}
                                            className="flex-grow p-3 bg-slate-800 border border-slate-600 rounded-lg font-mono text-lg text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all hide-number-arrows"
                                        />
                                        <button
                                            onClick={() => setUnits(affordableUnits > 0 ? affordableUnits : 1)}
                                            className="bg-slate-800 border border-slate-600 hover:border-indigo-500 text-slate-400 hover:text-indigo-400 px-4 py-3 rounded-lg text-xs font-bold uppercase transition-colors"
                                        >
                                            Max
                                        </button>
                                    </div>
                                    <div className="flex justify-between mt-2">
                                        <span className="text-[10px] text-slate-500">Buying Power: <span className="font-mono text-slate-300 font-bold">{affordableUnits}</span></span>
                                    </div>
                                </div>

                                {/* Totals */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 border border-slate-700 bg-slate-800/30 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Cost Basis</p>
                                        <p className="font-mono font-bold text-white text-xl">{formatMoney(costBasis)}</p>
                                    </div>
                                    <div className="p-4 border border-slate-700 bg-slate-800/30 rounded-xl">
                                        <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Current Balance</p>
                                        <p className={`font-mono font-bold text-xl ${balance < 0 ? 'text-red-500' : 'text-emerald-400'}`}>{formatMoney(balance)}</p>
                                    </div>
                                </div>

                                {/* Calculation Breakdown */}
                                <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800">
                                    <h4 className="text-sm font-bold text-slate-400 mb-3 font-mono uppercase">Projected Output (10% Price Increase)</h4>
                                    <div className="space-y-2 text-xs">
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Entry Price:</span>
                                            <span className="font-mono text-slate-300">{formatMoney(currentProduct.currentPrice)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Projected Exit Price (10%):</span>
                                            <span className="font-mono text-emerald-400">{formatMoney(currentProduct.currentPrice * 1.1)}</span>
                                        </div>
                                        <div className="flex justify-between border-t border-slate-700 pt-2 mt-2">
                                            <span className="text-slate-500 font-bold">Projected Profit per Unit (10%):</span>
                                            <span className="font-mono text-emerald-400 font-bold">{formatMoney(currentProduct.currentPrice * 0.1)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-500">Total Units:</span>
                                            <span className="font-mono text-slate-300">{units}</span>
                                        </div>
                                        <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-2">
                                            <span className="text-slate-400 font-bold">Total Projected Profit (10%):</span>
                                            <span className="font-mono text-emerald-400 font-bold">{formatMoney(currentProduct.currentPrice * 0.1 * units)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleExecuteTrade}
                                disabled={!!error && error !== "OVERDRAFT"}
                                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/40 transition-all transform hover:-translate-y-1 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed disabled:shadow-none disabled:transform-none uppercase tracking-wide relative overflow-hidden"
                            >
                                Execute Trade
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Momentum Help Modal */}
            {showMomentumHelp && (
                <div className="fixed inset-0 bg-slate-950/90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                    <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-6 border border-indigo-700 relative animate-bounce-in">
                        <div className="text-center">
                            <div className="text-4xl mb-4 text-indigo-400 animate-pulse">
                                📈
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">
                                What is Momentum?
                            </h3>
                            <p className="text-slate-300 mb-4 leading-relaxed text-sm text-left">
                                <strong className="text-indigo-400">Momentum</strong> is a predictive indicator of an asset's short-term price direction. It's calculated based on recent price changes.
                            </p>
                            <div className="text-left space-y-3 mb-6 text-sm">
                                <div>
                                    <p className="text-emerald-400 font-bold">• Upward (momentum &gt; 1.02)</p>
                                    <p className="text-slate-300 text-xs pl-4">Indicates strong positive sentiment. The asset price is likely to continue increasing in the near future. This is a good sign for potential growth.</p>
                                </div>
                                <div>
                                    <p className="text-slate-400 font-bold">• Neutral (0.98 - 1.02)</p>
                                    <p className="text-slate-300 text-xs pl-4">The asset is stable, with no strong trend in either direction. Price movement is expected to be minimal.</p>
                                </div>
                                <div>
                                    <p className="text-red-400 font-bold">• Downward (momentum &lt; 0.98)</p>
                                    <p className="text-slate-300 text-xs pl-4">Indicates strong negative sentiment. The asset price is likely to continue decreasing. Caution is advised.</p>
                                </div>
                            </div>
                            <p className="text-slate-400 text-xs italic mb-6">
                                While momentum is a useful guide, it's not a guarantee of future performance. Market conditions can change rapidly.
                            </p>
                            <button
                                onClick={() => setShowMomentumHelp(false)}
                                className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                            >
                                Got It
                            </button>
                        </div>
                    </div>
                </div>
            )}</>
    );
};

export default TradingPage;
