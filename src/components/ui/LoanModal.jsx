import { useState, useEffect, useCallback } from 'react';
import { useGame } from '@/contexts/GameContext';
import { formatMoney } from '@/utils';
import { Sparkles, TrendingUp, AlertCircle } from 'lucide-react';

const LoanModal = () => {
    const { state, toggleLoanModal, takeLoan } = useGame();
    const [loanAmount, setLoanAmount] = useState(0);
    const [loanTerm, setLoanTerm] = useState(10); // Default from HTML
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const premiumRate = Math.floor(loanTerm / 5) * 0.01;
    const totalInterestRate = 0.05 + premiumRate;
    const repaymentAmount = Math.floor(loanAmount * (1 + totalInterestRate));

    useEffect(() => {
        // Reset state when modal opens/closes
        if (state.showLoanModal) {
            setLoanAmount(0);
            setLoanTerm(10);
            setIsProcessing(false);
            setShowSuccess(false);
        }
    }, [state.showLoanModal]);

    const handleTakeLoan = useCallback(() => {
        setIsProcessing(true);
        // Simulate processing delay
        setTimeout(() => {
            setIsProcessing(false);
            setShowSuccess(true);
        }, 1500);
    }, [loanAmount, loanTerm]);

    const handleContinue = useCallback(() => {
        takeLoan(loanAmount, loanTerm);
        toggleLoanModal(false);
    }, [loanAmount, loanTerm, takeLoan, toggleLoanModal]);

    if (!state.showLoanModal) return null;

    // Show loading state while processing
    if (isProcessing) {
        return (
            <div className="fixed inset-0 bg-slate-950 z-100 flex flex-col items-center justify-center fade-in">
                <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
                <h2 className="text-indigo-400 font-mono text-lg font-bold animate-pulse">PROCESSING TRANSACTION...</h2>
                <p className="text-slate-500 text-xs font-mono mt-2">Authorizing Credit Facility</p>
            </div>
        );
    }

    // Show success prompt
    if (showSuccess) {
        return (
            <div className="fixed inset-0 bg-slate-950/80 z-100 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
                <div className="bg-slate-900 rounded-xl shadow-2xl max-w-md w-full p-8 border border-emerald-700 relative animate-bounce-in">
                    <div className="text-center">
                        <div className="text-6xl mb-4 text-emerald-500 animate-scale-in">
                            ✓
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3 animate-slide-up">
                            Transaction Authorized
                        </h3>
                        <p className="text-slate-300 mb-6 leading-relaxed animate-slide-up" style={{animationDelay: '0.1s'}}>
                            Your credit facility of <span className="font-mono font-bold text-emerald-400">{formatMoney(loanAmount)}</span> has been approved.
                            <br />
                            <span className="text-sm text-slate-400 mt-2 block">Repayment due: Year {state.turn + loanTerm}</span>
                        </p>
                        <button
                            onClick={handleContinue}
                            className="w-full py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide animate-slide-up"
                            style={{animationDelay: '0.2s'}}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-100 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-slate-700 relative overflow-hidden animate-scale-in">
                {/* Subtle glow effect */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 hover:bg-indigo-500/20 transition-all">
                                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">Credit Facility</h3>
                                <p className="text-xs text-slate-500 font-mono">LEVERAGE PROTOCOL</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => toggleLoanModal(false)} 
                            className="text-slate-500 hover:text-white text-2xl leading-none hover:rotate-90 transition-all duration-300 hover:scale-110"
                        >
                            ×
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Requested Capital</label>
                            <div className="relative group">
                                <span className="absolute left-4 top-3.5 text-indigo-400 font-mono text-lg group-hover:scale-110 transition-transform">$</span>
                                <input
                                    type="number"
                                    id="input-loan-amount"
                                    className="w-full p-3 pl-8 bg-slate-800/50 border-2 border-slate-700 rounded-lg font-mono text-white text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all placeholder-slate-600 hover:border-slate-600 hover:bg-slate-800/70 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                    placeholder="0"
                                    value={loanAmount}
                                    onChange={(e) => setLoanAmount(parseInt(e.target.value) || 0)}
                                    min="0"
                                    max="50000"
                                />
                                <div className="absolute right-3 top-3.5 text-slate-600 text-xs font-mono">
                                    / 50K
                                </div>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <p className="text-[10px] text-slate-500 font-mono">MAX LIMIT: $50,000</p>
                                {loanAmount > 50000 && (
                                    <div className="flex items-center gap-1 text-red-400 text-[10px] animate-pulse animate-shake">
                                        <AlertCircle className="w-3 h-3" />
                                        <span>EXCEEDS LIMIT</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase mb-2 block tracking-wider">Duration (Years)</label>
                            <input
                                type="range"
                                id="input-loan-term"
                                min="5"
                                max="20"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(parseInt(e.target.value))}
                                className="w-full accent-indigo-500 h-2 hover:h-2.5 transition-all"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-3 font-mono">
                                <span className="text-slate-600 transition-colors hover:text-slate-400">5Y</span>
                                <div id="loan-term-val" className="font-bold text-indigo-400 bg-indigo-500/10 px-4 py-1 rounded-full border border-indigo-500/20 hover:bg-indigo-500/20 transition-all hover:scale-105">
                                    {loanTerm} YEARS
                                </div>
                                <span className="text-slate-600 transition-colors hover:text-slate-400">20Y</span>
                            </div>
                        </div>

                        <div className="bg-slate-800/30 p-5 rounded-xl border border-slate-700 space-y-3 text-sm backdrop-blur-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-mono text-xs">Base Rate</span>
                                <span className="font-mono font-bold text-slate-300">5.0%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 font-mono text-xs">Term Premium</span>
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3 text-red-400" />
                                    <span id="loan-premium" className="font-mono font-bold text-red-400">+{Math.round(premiumRate * 100)}%</span>
                                </div>
                            </div>
                            <div className="border-t border-slate-700 my-3"></div>
                            <div className="flex justify-between items-center bg-indigo-500/5 -mx-5 -mb-5 px-5 py-4 rounded-b-xl border-t border-indigo-500/10">
                                <span className="font-bold text-indigo-400 uppercase text-xs tracking-widest">Total Repayment</span>
                                <span id="loan-total-repay" className="font-mono text-xl font-bold text-white">{formatMoney(repaymentAmount)}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleTakeLoan}
                            disabled={loanAmount === 0 || loanAmount > 50000}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/30 transition-all hover:scale-105 active:scale-95 disabled:hover:scale-100 uppercase tracking-wider text-sm border border-indigo-500/30 disabled:border-slate-600 relative overflow-hidden group"
                        >
                            <span className="relative z-10">Authorize Transaction</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoanModal;
