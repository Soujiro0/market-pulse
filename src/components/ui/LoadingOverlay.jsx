const LoadingOverlay = ({ isLoading, message = "ESTABLISHING UPLINK...", subMessage = "Syncing Market Data Stream" }) => {
    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 bg-slate-950 z-[200] flex flex-col items-center justify-center fade-in">
            <div className="w-16 h-16 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mb-4"></div>
            <h2 className="text-indigo-400 font-mono text-lg font-bold animate-pulse">{message}</h2>
            <p className="text-slate-500 text-xs font-mono mt-2">{subMessage}</p>
        </div>
    );
};

export default LoadingOverlay;