import React from 'react';
import { X, Landmark, BadgePercent, CalendarClock, ShieldAlert } from 'lucide-react';

const BankInfoModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-[60] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-xl shadow-2xl max-w-2xl w-full p-6 border border-indigo-700 relative">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <Landmark className="w-8 h-8 text-indigo-400" />
                        <h3 className="text-2xl font-bold text-white">Global Ventures Bank Information</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-6 text-slate-300 max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
                    <div>
                        <h4 className="text-lg font-bold text-indigo-400 mb-2 flex items-center gap-2"><BadgePercent className="w-5 h-5" /> Loan Terms & Interest</h4>
                        <p>
                            Loans are available to all traders seeking to leverage their capital. The base interest rate is 5%. For every 5 turns of the loan's duration, an additional 1% premium is added to the interest rate. The maximum loan amount is $50,000.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-yellow-400 mb-2 flex items-center gap-2"><CalendarClock className="w-5 h-5" /> Overdue Accounts & Penalties</h4>
                        <p>
                            If a loan is not paid by its due date, it becomes overdue. A grace period of 10 turns is granted to settle the debt. During this grace period, a <span className="font-bold">50% penalty</span> is applied to the outstanding loan amount each turn.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-bold text-red-500 mb-2 flex items-center gap-2"><ShieldAlert className="w-5 h-5" /> Asset Cessation Protocol</h4>
                        <p>
                            If the loan is not settled by the end of the 10-turn grace period, the Asset Cessation Protocol is initiated. The bank will automatically seize and liquidate your available capital to cover the outstanding debt. If your capital is insufficient, your balance will go into a negative state, reflecting your outstanding debt to the bank.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BankInfoModal;
