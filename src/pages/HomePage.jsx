import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useGame } from '@/contexts/GameContext';
import { formatMoney } from '@/utils';
import { Play, Activity, DollarSign, Zap, User, BookOpen, Database, Megaphone, Menu, ChevronDown, Quote, Package } from 'lucide-react';
import ranks from '@/data/ranks.json';
import Announcements from '@/components/ui/Announcements';
import GenericModal from '@/components/ui/GenericModal';
import AnnouncementDetailModal from '@/components/ui/AnnouncementDetailModal';

const quotes = [
    "The market waits for no one. Make your move count.",
    "Risk and reward are two sides of the same coin.",
    "In trading, patience is as valuable as capital.",
    "Every market cycle brings new opportunities.",
    "Fortune favors the prepared trader.",
    "Buy low, sell high - easier said than done.",
    "Market volatility is where profits are born.",
    "Your biggest competitor is your own emotions.",
    "Data drives decisions, emotions drive mistakes.",
    "The best time to trade was yesterday. The second best time is now.",
];

const HomePage = () => {
    const { state } = useGame();
    const navigate = useNavigate();
    const [isAnnouncementsModalOpen, setIsAnnouncementsModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [displayedQuote, setDisplayedQuote] = useState('');
    const [currentQuote, setCurrentQuote] = useState('');
    const [quoteIndex, setQuoteIndex] = useState(0);

    // Select a random quote initially and every 10 seconds
    useEffect(() => {
        const selectRandomQuote = () => {
            const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
            setCurrentQuote(randomQuote);
            setQuoteIndex(0);
            setDisplayedQuote('');
        };

        // Initial quote
        selectRandomQuote();

        // Change quote every 10 seconds
        const interval = setInterval(selectRandomQuote, 10000);

        return () => clearInterval(interval);
    }, []);

    // Typing effect
    useEffect(() => {
        if (quoteIndex < currentQuote.length) {
            const timeout = setTimeout(() => {
                setDisplayedQuote(prev => prev + currentQuote[quoteIndex]);
                setQuoteIndex(prev => prev + 1);
            }, 50); // Typing speed

            return () => clearTimeout(timeout);
        }
    }, [quoteIndex, currentQuote]);

    const handleAnnouncementClick = (announcement) => {
        setSelectedAnnouncement(announcement);
    };

    const closeDetailModal = () => {
        setSelectedAnnouncement(null);
    };
    const { balance, turn, history, xp, rankId, loan, profileIcon, marketEvent, eventTurnsLeft } = state;

    const totalWins = history.filter(h => h.profit > 0).length;
    const totalLosses = history.filter(h => h.profit < 0).length;

    const currentRank = ranks[rankId];
    const tierName = currentRank.name;
    const xpPerRank = 5000;
    const currentRankXP = xp % xpPerRank;
    const xpProgress = (currentRankXP / xpPerRank) * 100;

    return (
        <>
            <div className="min-h-[calc(100vh-200px)] flex items-center justify-center fade-in p-4">
                <div className="max-w-7xl w-full space-y-6">
                    {/* Top Section: Rank & XP */}
                    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-4 items-start">
                        {/* Rank Badge */}
                        <div
                            className="glass-panel p-4 rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-500 transition-all hover:scale-105 cursor-pointer group bg-indigo-900/10 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/30"
                            onClick={() => navigate('/profile')}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-xl flex items-center justify-center shadow-lg overflow-hidden bg-indigo-600/20 border-2 border-indigo-500/30 group-hover:border-indigo-500 transition-all">
                                    <img src={`assets/ranks/${currentRank.image}`} alt={tierName} className="w-full h-full object-contain group-hover:scale-110 transition-transform" />
                                </div>
                                <div>
                                    <p className="text-slate-400 text-xs uppercase font-bold">Rank</p>
                                    <span className="text-sm font-mono text-indigo-400 font-bold">
                                        {tierName.toUpperCase()} {currentRank.level}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* XP Progress Bar */}
                        <div className="glass-panel p-4 rounded-2xl border-2 border-indigo-500/30 bg-indigo-900/10 shadow-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shrink-0 animate-pulse">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <p className="text-slate-400 text-xs uppercase font-bold">Level {currentRank.level} Experience</p>
                                        <p className="text-indigo-400 font-mono font-bold text-xs">{currentRankXP} / {xpPerRank} XP</p>
                                    </div>
                                    <div className="relative w-full bg-slate-800/50 rounded-full h-4 overflow-hidden border border-slate-700">
                                        <div
                                            className="absolute inset-0 bg-indigo-500 transition-all duration-500 shadow-lg shadow-indigo-500/50"
                                            style={{ width: `${xpProgress}%` }}
                                        ></div>
                                        <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Menu Dropdown */}
                        <div className="relative w-full lg:w-48">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="flex items-center justify-between gap-3 px-5 py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl transition-all border-2 border-slate-700 hover:border-indigo-500/50 w-full shadow-lg hover:shadow-indigo-500/20 hover:scale-105"
                            >
                                <div className="flex items-center gap-2">
                                    <Menu className="w-5 h-5 text-indigo-400" />
                                    <span className="text-sm font-semibold">Menu</span>
                                </div>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 text-indigo-400 ${isMenuOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <div className={`absolute top-full mt-2 w-full bg-slate-800 rounded-xl border border-slate-700 shadow-xl overflow-hidden z-10 transition-all duration-300 origin-top ${isMenuOpen
                                ? 'opacity-100 scale-y-100 translate-y-0'
                                : 'opacity-0 scale-y-0 -translate-y-2 pointer-events-none'
                                }`}>
                                <button
                                    onClick={() => {
                                        navigate('/profile');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-all w-full border-b border-slate-700"
                                >
                                    <User className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Profile</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/databank');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-all w-full border-b border-slate-700"
                                >
                                    <Database className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Databank</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/collection');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-all w-full border-b border-slate-700"
                                >
                                    <Package className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Collection</span>
                                </button>
                                <button
                                    onClick={() => {
                                        navigate('/help');
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-all w-full border-b border-slate-700"
                                >
                                    <BookOpen className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Manual</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setIsAnnouncementsModalOpen(true);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex items-center gap-3 px-5 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-all w-full"
                                >
                                    <Megaphone className="w-4 h-4" />
                                    <span className="text-sm font-semibold">Announcements</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Year Counter */}
                        <div className="glass-panel p-5 rounded-2xl border-2 border-indigo-500/30 hover:border-indigo-500 transition-all hover:scale-105 bg-indigo-900/10 shadow-lg hover:shadow-indigo-500/30 group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 text-xs uppercase font-bold">Year</span>
                                <div className="w-10 h-10 bg-indigo-600/20 rounded-lg flex items-center justify-center border border-indigo-500/30 group-hover:border-indigo-500 transition-all">
                                    <Activity className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-indigo-400 font-mono">#{turn}</p>
                        </div>

                        {/* Balance Card */}
                        <div className="glass-panel p-5 rounded-2xl border-2 border-emerald-500/30 hover:border-emerald-500 transition-all hover:scale-105 bg-emerald-900/10 shadow-lg hover:shadow-emerald-500/30 group">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-slate-400 text-xs uppercase font-bold">Capital</span>
                                <div className="w-10 h-10 bg-emerald-600/20 rounded-lg flex items-center justify-center border border-emerald-500/30 group-hover:border-emerald-500 transition-all">
                                    <DollarSign className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                                </div>
                            </div>
                            <p className="text-2xl font-bold text-emerald-400 font-mono">{formatMoney(balance)}</p>
                        </div>
                    </div>

                    {/* Main Content Grid: Market Wisdom Left, Stats Right */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Market Wisdom Quote - Square */}
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden border-2 border-amber-500/30 aspect-square flex flex-col justify-center bg-amber-900/10 shadow-lg hover:shadow-amber-500/20 transition-all group">
                            <div className="absolute inset-0 bg-amber-500/5 pointer-events-none"></div>
                            <div className="absolute inset-0 bg-white/5 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                            <div className="relative flex flex-col items-center text-center gap-6">
                                <div className="relative">
                                    <Quote className="w-16 h-16 text-amber-400 shrink-0 animate-pulse" />
                                    <div className="absolute inset-0 bg-amber-400/20 blur-2xl rounded-full"></div>
                                </div>
                                <div className="flex-1 flex flex-col justify-center">
                                    <h3 className="text-xl font-bold text-amber-400 uppercase tracking-wider mb-6">💡 Market Wisdom</h3>
                                    <p className="text-slate-300 text-lg font-mono leading-relaxed">
                                        {displayedQuote}
                                        <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse"></span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Stats and Play Button */}
                        <div className="flex flex-col gap-4">
                            {/* Collection Section */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Collection Market Button */}
                                <button
                                    onClick={() => navigate('/collection-market')}
                                    className="glass-panel p-6 rounded-xl border-2 border-purple-500/30 hover:border-purple-500 transition-all hover:scale-105 bg-purple-900/10 shadow-lg hover:shadow-purple-500/30 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-purple-600/20 rounded-xl flex items-center justify-center border-2 border-purple-500/30 group-hover:border-purple-500 transition-all group-hover:scale-110">
                                            <Package className="w-7 h-7 text-purple-400 group-hover:rotate-12 transition-transform" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className="text-lg font-bold text-purple-400 mb-1">Collection Market</h3>
                                            <p className="text-slate-400 text-xs">Browse and purchase premium collectibles</p>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-purple-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>

                                {/* My Collection Button */}
                                <button
                                    onClick={() => navigate('/collection')}
                                    className="glass-panel p-6 rounded-xl border-2 border-emerald-500/30 hover:border-emerald-500 transition-all hover:scale-105 bg-emerald-900/10 shadow-lg hover:shadow-emerald-500/30 group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-emerald-600/20 rounded-xl flex items-center justify-center border-2 border-emerald-500/30 group-hover:border-emerald-500 transition-all group-hover:scale-110">
                                            <Package className="w-7 h-7 text-emerald-400 group-hover:rotate-12 transition-transform" />
                                        </div>
                                        <div className="text-left flex-1">
                                            <h3 className="text-lg font-bold text-emerald-400 mb-1">My Collection</h3>
                                            <p className="text-slate-400 text-xs">View, manage, and merge your collectibles</p>
                                        </div>
                                        <ChevronDown className="w-5 h-5 text-emerald-400 -rotate-90 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </button>
                            </div>

                            {/* Loan Warning */}
                            {loan.active && (
                                <div className="glass-panel p-5 rounded-2xl border-2 border-red-500/50 bg-red-900/10 shadow-lg shadow-red-500/20 animate-pulse">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-500/50">
                                                <Activity className="w-5 h-5 text-red-400 animate-pulse" />
                                            </div>
                                            <div>
                                                <p className="text-red-400 font-bold text-sm uppercase">⚠️ Active Loan Warning</p>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    Outstanding debt: <span className="font-mono font-bold text-red-400">{formatMoney(loan.amount)}</span> | Due: Year {loan.dueTurn}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="text-red-400 text-xs font-bold px-3 py-1 bg-red-900/50 rounded-full border-2 border-red-500">
                                            {loan.dueTurn - turn} Years Left
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Current Market Event */}
                            {marketEvent && (
                                <div className={`glass-panel p-5 rounded-2xl border-2 shadow-lg ${marketEvent.climate === 'Bullish' ? 'border-green-500/50 bg-green-900/10 shadow-green-500/20' :
                                        marketEvent.climate === 'Bearish' ? 'border-red-500/50 bg-red-900/10 shadow-red-500/20' :
                                            'border-yellow-500/50 bg-yellow-900/10 shadow-yellow-500/20'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center border ${marketEvent.climate === 'Bullish' ? 'bg-green-900/30 border-green-500/50' :
                                                    marketEvent.climate === 'Bearish' ? 'bg-red-900/30 border-red-500/50' :
                                                        'bg-yellow-900/30 border-yellow-500/50'
                                                }`}>
                                                <Activity className={`w-5 h-5 ${marketEvent.climate === 'Bullish' ? 'text-green-400' :
                                                        marketEvent.climate === 'Bearish' ? 'text-red-400' :
                                                            'text-yellow-400'
                                                    } animate-pulse`} />
                                            </div>
                                            <div>
                                                <p className={`font-bold text-sm uppercase ${marketEvent.climate === 'Bullish' ? 'text-green-400' :
                                                        marketEvent.climate === 'Bearish' ? 'text-red-400' :
                                                            'text-yellow-400'
                                                    }`}>
                                                    🎯 {marketEvent.climate} Market Event
                                                </p>
                                                <p className="text-slate-400 text-xs mt-1">
                                                    {marketEvent.name}
                                                </p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full border-2 ${marketEvent.climate === 'Bullish' ? 'text-green-400 bg-green-900/50 border-green-500' :
                                                marketEvent.climate === 'Bearish' ? 'text-red-400 bg-red-900/50 border-red-500' :
                                                    'text-yellow-400 bg-yellow-900/50 border-yellow-500'
                                            }`}>
                                            {eventTurnsLeft} Years Left
                                        </span>
                                    </div>
                                </div>
                            )}

                            {/* Play Button - Takes remaining space */}
                            <div className="flex-1 flex items-center justify-center">
                                <button
                                    onClick={() => navigate('/market')}
                                    className="group relative flex items-center justify-start p-7 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xl rounded-full shadow-2xl shadow-indigo-900/50 transition-all duration-500 hover:scale-110 hover:shadow-indigo-500/50 hover:pr-8 mx-auto overflow-hidden border-2 border-indigo-500/50 hover:border-indigo-400"
                                >
                                    {/* Background Glow Effect */}
                                    <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl group-hover:blur-3xl transition-all -z-10 animate-pulse"></div>

                                    {/* Shining Sweep Effect */}
                                    <div className="absolute inset-0 rounded-full bg-white/30 -translate-x-[200%] skew-x-12 group-hover:animate-[shimmer_1s_infinite] transition-transform"></div>

                                    {/* Icon - Always Visible */}
                                    <Play className="w-14 h-14 shrink-0 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-6 relative z-10" />

                                    {/* Text - Slides out on Hover */}
                                    <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 group-hover:max-w-xs group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 ease-in-out relative z-10 uppercase tracking-wider">
                                        Enter Market
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <GenericModal
                isOpen={isAnnouncementsModalOpen}
                onClose={() => setIsAnnouncementsModalOpen(false)}
                title="Latest Announcements"
            >
                <Announcements onAnnouncementClick={handleAnnouncementClick} />
            </GenericModal>

            <AnnouncementDetailModal
                isOpen={!!selectedAnnouncement}
                onClose={closeDetailModal}
                announcement={selectedAnnouncement}
            />
        </>
    );
};

export default HomePage;
