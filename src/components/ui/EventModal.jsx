const EventModal = ({ event, onClose }) => {
    if (!event) return null;

    const getEffectClass = () => {
        if (event.profitMultiplier > 1) return 'text-emerald-400';
        if (event.lossMultiplier > 1) return 'text-red-500';
        return 'text-slate-400';
    };

    return (
        <div className="fixed inset-0 bg-slate-950/80 z-[200] flex items-center justify-center p-4 backdrop-blur-sm fade-in">
            <div 
                className="bg-slate-900 rounded-2xl shadow-2xl max-w-lg w-full border-2 border-yellow-500/50 overflow-hidden animate-bounce-in"
            >
                <div className="p-8 text-center relative">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-yellow-500 animate-pulse"></div>
                    <span className="text-6xl mb-4 inline-block">{event.icon}</span>
                    <h2 className="text-3xl font-bold text-yellow-400 mb-3 tracking-tighter">EVENT TRIGGERED</h2>
                    <h3 className="text-2xl font-semibold text-white mb-4">{event.name}</h3>
                    <p className="text-slate-300 mb-6 leading-relaxed">{event.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4 text-left bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Duration</p>
                            <p className="text-lg font-mono text-white">{event.duration} Years</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase font-bold">Climate</p>
                            <p className="text-lg font-mono text-white">{event.climate}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-slate-500 uppercase font-bold">Economic Effect</p>
                            <p className={`text-lg font-mono font-bold ${getEffectClass()}`}>
                                {event.profitMultiplier > 1 && `Profits x${event.profitMultiplier}`}
                                {event.lossMultiplier > 1 && `Losses x${event.lossMultiplier}`}
                                {event.profitMultiplier === 1 && event.lossMultiplier === 1 && 'Standard Conditions'}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="w-full mt-8 py-3 rounded-lg text-white font-bold transition-all shadow-lg bg-yellow-600 hover:bg-yellow-500 hover:scale-105 active:scale-95 uppercase text-sm tracking-wide"
                    >
                        Acknowledge
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EventModal;
