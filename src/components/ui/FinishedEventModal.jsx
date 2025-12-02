const FinishedEventModal = ({ event, onClose }) => {
    if (!event) return null;

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full border border-slate-700 overflow-hidden animate-bounce-in">
                <div className="p-8 text-center relative">
                    <span className="text-6xl mb-4 inline-block">🏁</span>
                    <h2 className="text-3xl font-bold text-white mb-3 tracking-tighter">EVENT CONCLUDED</h2>
                    <h3 className="text-2xl font-semibold text-slate-300 mb-4">{event.name}</h3>
                    <p className="text-slate-400 mb-6 leading-relaxed">
                        The "{event.name}" event has ended. The market is now returning to its normal state.
                    </p>
                    
                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FinishedEventModal;
