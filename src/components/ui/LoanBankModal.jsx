import React from 'react';
import { X, Landmark, DollarSign, CheckCircle, BadgePercent, CalendarClock, Activity, ShieldAlert, HelpCircle } from 'lucide-react';
import { formatMoney } from '@/utils';

const LoanBankModal = ({ isOpen, onClose, state, toggleLoanModal, handlePayLoan, setIsBankInfoModalOpen }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full p-6 border border-indigo-700 relative">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <Landmark className="w-8 h-8 text-indigo-400" />
                        <div>
                            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                                Loan Bank
                                <HelpCircle className="w-5 h-5 cursor-pointer text-slate-400 hover:text-white" onClick={() => setIsBankInfoModalOpen(true)} />
                            </h3>
                            <p className="text-sm text-slate-400">Your trusted financial partner.</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="relative z-10 h-full flex flex-col justify-between">
                    {!state.loan.active ? (
                        <div id="bank-no-loan" className="text-center p-8">
                            <div className="p-6 bg-slate-800/50 rounded-full border-4 border-indigo-500/30 mb-6 w-32 h-32 mx-auto flex items-center justify-center">
                                <DollarSign className="w-16 h-16 text-indigo-400" />
                            </div>
                            <h4 className="text-xl font-bold text-white mb-2">Request Liquidity</h4>
                            <p className="text-base text-slate-400 leading-tight mb-6">Access credit lines to leverage your capital. Default risk applies.</p>
                            <button onClick={() => toggleLoanModal(true)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-lg font-bold uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2">
                                Open Credit Line
                            </button>
                        </div>
                    ) : (
                        <div id="bank-active-loan" className="space-y-4">
                            <div className="p-6 bg-red-900/20 rounded-xl border-2 border-red-800/50 text-center">
                                <p className="text-sm text-red-400 uppercase font-bold tracking-wider">Total Liability</p>
                                <p id="loan-amount-display" className="font-mono text-4xl font-bold text-red-400">{formatMoney(state.loan.amount)}</p>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                    <p className="text-sm text-slate-400 uppercase font-bold flex items-center justify-center gap-2"><BadgePercent className="w-4 h-4" /> Rate</p>
                                    <p id="loan-rate-display" className="font-mono text-2xl font-bold text-slate-200 mt-1">{(state.loan.interestRate * 100).toFixed(0)}%</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                    <p className="text-sm text-slate-400 uppercase font-bold flex items-center justify-center gap-2"><CalendarClock className="w-4 h-4" /> Due</p>
                                    <p id="loan-due-display" className="font-mono text-2xl font-bold text-slate-200 mt-1">{state.loan.dueTurn}</p>
                                </div>
                                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 text-center">
                                    <p className="text-sm text-slate-400 uppercase font-bold flex items-center justify-center gap-2"><ShieldAlert className="w-4 h-4" /> Asset Ceased</p>
                                    <p className="font-mono text-2xl font-bold text-slate-200 mt-1">{state.loan.dueTurn + 10}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => {
                                    handlePayLoan();
                                    onClose();
                                }}
                                disabled={state.turn < state.loan.dueTurn}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white text-lg font-bold rounded-lg transition-colors mt-4 uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg"
                            >
                                <CheckCircle className="w-6 h-6" />
                                Settle Debt
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoanBankModal;
