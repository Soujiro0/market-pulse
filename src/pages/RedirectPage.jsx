import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const RedirectPage = () => {
    const [copied, setCopied] = useState(false);
    const url = 'https://market-pulse-game.vercel.app/';

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center fade-in bg-slate-900">
            <div className="glass-panel p-12 rounded-3xl max-w-lg text-center border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-indigo-500/5 to-transparent pointer-events-none"></div>
                <div className="relative">
                    <h1 className="text-4xl font-bold text-white mb-4 tracking-tight">
                        Market Pulse Has Moved
                    </h1>
                    <p className="text-slate-400 text-lg mb-4">
                        The game has been relocated to a new domain.
                    </p>
                    <div className="relative inline-block w-full mb-8">
                        <p className="text-indigo-400 font-mono text-sm bg-slate-800/50 py-3 px-4 pr-12 rounded-lg border border-indigo-500/20 break-all">
                            {url}
                        </p>
                        <button
                            onClick={handleCopy}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-slate-700/50 transition-colors"
                            title="Copy to clipboard"
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-emerald-400" />
                            ) : (
                                <Copy className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                            )}
                        </button>
                    </div>
                    <a 
                        href={url}
                        className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-indigo-500/50 hover:scale-105"
                    >
                        Go to New Site
                    </a>
                </div>
            </div>
        </div>
    );
};

export default RedirectPage;
